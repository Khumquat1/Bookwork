var app = function() {

    var self = {};
    Vue.config.silent = false;

    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    function get_posts_url(start_idx, end_idx) {
        console.log("I am in the get posts url method");
        var pp = {
            start_idx: start_idx,
            end_idx: end_idx
        };
        return posts_url + "?" + $.param(pp);
    }


    self.get_posts = function () {
        console.log("I am in the get posts method");
        var post_len = self.vue.posts.length;
        $.getJSON(get_posts_url(0,10), function (data) {
            console.log(data);
            self.vue.posts = data.posts;
            self.vue.logged_in = data.logged_in;
        })
    };

    self.add_post_button = function () {
        if(self.vue.logged_in)
          self.vue.is_adding_post = !self.vue.is_adding_post;
    };

    self.add_post = function () {
        $.post(add_post_url,
            {
                content: self.vue.form_content
            },
            function (data) {
                $.web2py.enableElement($("#add_post_submit"));
                self.vue.posts.unshift(data.post);
                console.log(self.vue.posts.length);
                self.vue.is_adding_post = !self.vue.is_adding_post;
                self.vue.form_content = "";
            });
    };

    self.edit_post_submit = function () {
        $.post(edit_post_url,
            {
                post_content: self.vue.edit_content,
                id: self.vue.edit_id
            },
            function (data) {
                $.web2py.enableElement($("#edit_post_submit"));
                self.vue.editing = !self.vue.editing;
            });
    };
    self.edit_post = function(post_id) {
        console.log(post_id);
        self.vue.editing = !self.vue.editing;
        self.vue.edit_id = post_id;
    };

    self.cancel_edit = function () {
        self.vue.editing = !self.vue.editing;
        self.vue.edit_id = 0;

    };

    self.delete_track = function(post_id) {
        $.post(del_post_url,
            {
                post_id: post_id
            },
            function () {
                var idx = null;
                for (var i = 0; i < self.vue.posts.length; i++) {
                    if (self.vue.posts[i].id === post_id) {
                        idx = i + 1;
                        break;
                    }
                }
                if (idx) {
                    self.vue.posts.splice(idx - 1, 1);

                }
            }
        )
    };

    self.toggle_vis = function (post_id) {
        console.log(post_id);
        for (var i = 0; i < self.vue.posts.length; i++) {
                    if (self.vue.posts[i].id === post_id) {
                        self.vue.posts[i].is_public = !self.vue.posts[i].is_public;
                        break;
                    }
                }
        $.post(toggle_vis_url,
            {
                post_id: post_id
            },
            function () {
            }
        )
    };

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            posts: [],
            logged_in: false,
            editing: false,
            is_adding_post: false,
            form_content: null,
            edit_content: null,
            edit_id: 0,
            show: true
        },
        methods: {
            add_post_button: self.add_post_button,
            add_post: self.add_post,
            delete_track: self.delete_track,
            edit_post: self.edit_post,
            edit_post_submit: self.edit_post_submit,
            cancel_edit: self.cancel_edit,
            toggle_vis: self.toggle_vis
        }
    });

    self.get_posts();
    $("#vue-div").show();
    return self;
};

var APP = null;


jQuery(function(){APP = app();});




