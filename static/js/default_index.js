var app = function() {

    var self = {};
    Vue.config.silent = false;

    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

<<<<<<< HEAD
    self.get_posts = function () {
        setTimeout(function() {
            $.getJSON(all_post_url,
                {},
                function (data) {
                self.vue.posts = data.posts;
                enumerate(self.vue.posts);
            })
        }, 1000);
    };

    self.open_uploader = function () {
        $("div#uploader_div").show();
        self.vue.is_uploading = true;
    };

    self.close_uploader = function () {
        $("div#uploader_div").hide();
        self.vue.is_uploading = false;
        $("input#file_input").val(""); // This clears the file choice once uploaded.

    };

    self.upload_file = function (event) {
        // Reads the file.
        var input = event.target;
        var file = document.getElementById("file_input").files[0];
        if (file) {
            // First, gets an upload URL.
            console.log("Trying to get the upload url");
            $.getJSON('https://upload-dot-luca-teaching.appspot.com/start/uploader/get_upload_url',
                function (data) {
                    // We now have upload (and download) URLs.
                    var put_url = data['signed_url'];
                    var get_url = data['access_url'];
                    console.log("Received upload url: " + put_url);
                    // Uploads the file, using the low-level interface.
                    var req = new XMLHttpRequest();
                    req.addEventListener("load", self.upload_complete(get_url));
                    // TODO: if you like, add a listener for "error" to detect failure.
                    req.open("PUT", put_url, true);
                    req.send(file);
                });
        }
    };

    self.upload_complete = function(get_url) {
        setTimeout(function(){
                   // Hides the uploader div.
        self.close_uploader();
        console.log('The file was uploaded; it is now available at ' + get_url);
        // TODO: The file is uploaded.  Now you have to insert the get_url into the database, etc.
         $.post(add_post_url,
            {
                post_price: self.vue.post_price,
                description: self.vue.post_description,
                title: self.vue.post_title,
                image_url: get_url,

=======
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
>>>>>>> 24c2738ede7f1e7bcc4f024438b3e85968550675
            },
            function (data) {
                $.web2py.enableElement($("#add_post_submit"));
                self.vue.posts.unshift(data.post);
                console.log(self.vue.posts.length);
                self.vue.is_adding_post = !self.vue.is_adding_post;
<<<<<<< HEAD
                self.vue.description = "";
                self.vue.posts.push(data.posts);
                enumerate(self.vue.posts);
            });
        }, 1000);
        console.log("The post has been uploaded");
    };

    self.add_post_button = function () {
        if(self.vue.logged_in)
          self.vue.is_adding_post = !self.vue.is_adding_post;
=======
                self.vue.form_content = "";
            });
>>>>>>> 24c2738ede7f1e7bcc4f024438b3e85968550675
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

<<<<<<< HEAD

=======
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
>>>>>>> 24c2738ede7f1e7bcc4f024438b3e85968550675
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
<<<<<<< HEAD
            user_email: null,
            post_price: null,
            image_url: null,
            is_uploading: false,
            self_page: true, // Leave it to true, so initially you are looking at your own images.
=======
>>>>>>> 24c2738ede7f1e7bcc4f024438b3e85968550675
            posts: [],
            logged_in: false,
            editing: false,
            is_adding_post: false,
<<<<<<< HEAD
            post_description: null,
            post_title: null,
            created_by: null,
=======
            form_content: null,
>>>>>>> 24c2738ede7f1e7bcc4f024438b3e85968550675
            edit_content: null,
            edit_id: 0,
            show: true
        },
        methods: {
<<<<<<< HEAD
            get_posts: self.get_posts,
            open_uploader: self.open_uploader,
            close_uploader: self.close_uploader,
            upload_file: self.upload_file,
            upload_complete: self.upload_complete,
=======
>>>>>>> 24c2738ede7f1e7bcc4f024438b3e85968550675
            add_post_button: self.add_post_button,
            add_post: self.add_post,
            delete_track: self.delete_track,
            edit_post: self.edit_post,
            edit_post_submit: self.edit_post_submit,
<<<<<<< HEAD
            cancel_edit: self.cancel_edit
=======
            cancel_edit: self.cancel_edit,
            toggle_vis: self.toggle_vis
>>>>>>> 24c2738ede7f1e7bcc4f024438b3e85968550675
        }
    });

    self.get_posts();
    $("#vue-div").show();
    return self;
};

var APP = null;


jQuery(function(){APP = app();});




