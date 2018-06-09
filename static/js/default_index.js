// This is the js for the default/index.html view.


var app = function() {

    var self = {};


    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    // Enumerates an array.
    var enumerate = function(v) {
        var k=0;
        return v.map(function(e) {e._idx = k++;});
    };

    self.get_images = function () {
        setTimeout(function() {
            $.getJSON(all_image_url,
                {},
                function (data) {
                self.vue.user_images = data.user_images;
                enumerate(self.vue.user_images);
                self.vue.users = data.users;
                enumerate(self.vue.users);
                self.vue.max_id = self.vue.user_images.length;
            })
        }, 1000);
    };

    self.get_sorted_images = function (flag) {
        setTimeout(function() {
            $.post(sorted_images_url,
            {
                flag: flag
            },
                function (data) {
                console.log("send out flag: ", flag)
                self.vue.user_images = data.user_images;
                enumerate(self.vue.user_images);
            })
        }, 1000);
    };

    self.log_user = function () {
        $.getJSON(log_user_url,
            {},
            function (data) {
            self.vue.current_user = data.current_user;
        })
    };


    self.upload_preview = function(event) {
        {
            self.vue.preview_image = true;
            var reader = new FileReader();
            reader.onload = function () {
                var output = document.getElementById('output_image');
                output.src = reader.result;
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }
    self.upload_file = function () {
        // Reads the file.
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
                    self.vue.image_url = get_url;
                });
        }
    };

    self.upload_complete = function(get_url) {
        setTimeout(function(){
                   // Hides the uploader div.

        console.log('The file was uploaded; it is now available at ' + get_url);
            self.vue.preview_image = true;
             self.vue.get_images();

        }, 1000);
        console.log("details: ");
        console.log(self.vue.post_title + self.vue.post_description);
    };

    self.add_post = function (){
        self.upload_file();
        setTimeout(function(){
            if(self.vue.image_url !== null){
            $.post(add_image_url,
            {
                image_price: self.vue.image_price,
                description: self.vue.post_description,
                title: self.vue.post_title,
                image_url: self.vue.image_url,
                phone_number: self.vue.post_phone_number,
                text_ok: self.vue.text_ok,
                call_ok: self.vue.call_ok,
                show_email: self.vue.show_email
            },
            function (data) {
                self.vue.user_images.push(data.user_images);
                self.vue.preview_image_id = (data.user_images.id);
                enumerate(self.vue.user_images);
                console.log
            });
            }
            if(self.vue.image_url == null){
                console.log("no img posted");
                $.post(add_image_url_np,
                {
                    image_price: self.vue.image_price,
                    description: self.vue.post_description,
                    title: self.vue.post_title,
                    phone_number: self.vue.post_phone_number,
                    text_ok: self.vue.text_ok,
                    call_ok: self.vue.call_ok,
                    show_email: self.vue.show_email
                },
                function (data) {
                    self.vue.user_images.push(data.user_images);
                    enumerate(self.vue.user_images);
                });
            }
                console.log("uploaded post with ", self.vue.image_price,
                            " ", self.vue.post_description, " "
                            , self.vue.post_title, " ",
                            self.vue.post_phone_number)
                  self.vue.go_home();
            }, 1000);


    };



    self.set_price = function(image_id, image_price){
        console.log("changing price of image id: " + image_id +" to "+ image_price);
        $.post(set_price_url,
            {
                user_image_id: image_id,
                new_price: image_price
            },
            function () {
      })
    };

    self.show_item = function(image_idx){
        self.vue.selected_item_idx = null;
        self.vue.home_page=false;
        self.vue.item_page=false;
        self.vue.selected_item_idx = image_idx;
        self.vue.item_page=true;
    };

    self.go_home = function(){
        self.vue.text_ok =false;
        self.vue.call_ok=false;
        self.vue.show_email= true;
        self.vue.get_images();
        self.vue.image_url=null;
        self.vue.image_price = null;
        self.vue.post_description = null;
        self.vue.post_title = null;
        self.vue.item_page=false;
        self.vue.post_page=false;
        self.vue.post_page_2 =false;
        self.vue.is_uploading=false;
        self.vue.preview_image = false;
        self.vue.home_page=true;
        self.vue.selected_item_idx = null;
    };

    self.go_post_page = function(){
        self.vue.home_page=false;
        self.vue.post_page_2=false;
        self.vue.post_page=true;

    };

    self.go_post_page_2 = function(){
        if(self.vue.post_title != null && self.vue.post_description != null && self.vue.image_price != null){
            self.vue.post_page=false;
            self.vue.post_page_2=true;

        }
        else{
            alert("Missing required fields!")
        }


    };

    self.follow_post = function(image_id){
        $.post(follow_post_url,
            {
                image_id: image_id
            },
            function () {
            });
        self.vue.get_images();
        console.log("current user: "+self.vue.current_user)
    };

    self.delete_post = function(post_id) {
        $.post(del_post_url,
            {
                post_id: post_id
            },
            function () {
                var idx = null;
                for (var i = 0; i < self.vue.user_images.length; i++) {
                    if (self.vue.user_images[i].id === post_id) {
                        idx = i + 1;
                        break;
                    }
                }
                if (idx) {
                    self.vue.user_images.splice(idx - 1, 1);
                }
                self.vue.preview_image = false;
            }
            )
       };

    self.delete_post_idx = function(post_idx) {
        var id = null;
        for (var i = 0; i < self.vue.user_images.length; i++) {
            if (self.vue.user_images[i]._idx === post_idx) {
                self.vue.post_id = self.vue.user_images[i].id;
                break;
                }
        }
        $.post(del_post_url,
            {
                post_id: self.vue.post_id
            },
            function () {
                var idx = null;
                for (var i = 0; i < self.vue.user_images.length; i++) {
                    if (self.vue.user_images[i].id === self.vue.post_id) {
                        idx = i + 1;
                        break;
                    }
                }
                if (idx) {
                    self.vue.user_images.splice(idx - 1, 1);
                }
                self.vue.preview_image = false;
            }
            )
       };

    self.cancel_post =function(){
        if(self.vue.preview_image){
            self.vue.image_url = null;
        }
        self.go_home();
    };


    self.get_follows = function () {
        setTimeout(function() {
            $.getJSON(all_follows_url,
                {},
                function (data) {
                self.vue.follows = data.follows;
                enumerate(self.vue.follows);
            })
        }, 000);
    };


    self.clear_preview = function(){
        self.vue.image_url = null;
        self.vue.preview_image = false;

    };


    self.toggle = function(num){
        if(num==1){
            self.vue.text_ok = !self.vue.text_ok;
        }
        if(num==2){
            self.vue.call_ok = !self.vue.call_ok;
        }
        if(num==3){
            self.vue.show_email = !self.vue.show_email;
        }
    };

    self.search_fields = function(string){
        var str = string;
        var title = ""
        var desc = ""
        console.log("starting search of ", self.vue.user_images.length, "size")
        for (var i = 0; i < self.vue.user_images.length; i++) {
            title = self.vue.user_images[i].title;
            desc = self.vue.user_images[i].description;
            if(title.includes(str) || desc.includes(str)){
                console.log("found a match")
                console.log("saving post title: ", title, "desc: ", desc)
            }
            else{
                console.log("was not match")
                console.log("removing post title: ", title, "desc: ", desc)
                console.log("removing ", self.vue.user_images[i])
                self.vue.user_images.splice(i,1);
                i--;

            }

        }
    }


    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            user_images: [],
            users: [],
            follows: [],
            user_email: null,
            image_price: null,
            new_price: null,
            image_url: null,
            image_preview: null,
            post_title:null,
            post_description:null,
            selected_item_idx:null,
            is_uploading: false,
            home_page: true,
            item_page: false,
            post_page: false,
            post_page_2: false,
            add_item_page: false,
            preview_image: false,
            preview_id: null,
            max_id: 0,
            post_id: null,
            current_user: null,
            display_number: false,
            output_src: null,
            post_phone_number: null,
            text_ok:false,
            call_ok:false,
            show_email: true,
            preview_image_id: null,
            by_recent: 1,
            by_price_up:2,
            by_price_down:3,
            search_input: null,

        },
        methods: {
            local_image: self.local_image,
            extend: self.extend,
            add_post: self.add_post,
            log_users: self.log_users,
            follow_post: self.follow_post,
            set_price: self.set_price,
            get_user_images: self.get_user_images,
            get_images: self.get_images,
            get_follows: self.get_follows,

            search_fields: self.search_fields,
            show_item: self.show_item,
            upload_file: self.upload_file,
            upload_complete: self.upload_complete,
            go_home: self.go_home,
            go_post_page: self.go_post_page,
            go_post_page_2: self.go_post_page_2,
            delete_post: self.delete_post,
            delete_post_idx: self.delete_post_idx,
            unfollow: self.unfollow,
            clear_follows: self.clear_follows,
            cancel_post: self.cancel_post,
            get_user: self.get_user,
            clear_preview: self.clear_preview,
            upload_preview: self.upload_preview,
            toggle: self.toggle,
            get_sorted_images: self.get_sorted_images

        }

    });

    self.log_user();
    self.get_images();
    console.log(self.vue.max_id);
    $("#vue-div").show();
    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});

