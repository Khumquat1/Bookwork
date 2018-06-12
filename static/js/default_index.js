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
                self.vue.format_date();
            })
        },00); //Timeout kept in event of latency issues
    };

    self.view_follows = function () {
        if(!self.vue.logged_in){
            alert('You must be logged in to track posts!');

        }
        else {
            setTimeout(function () {
                $.post(view_follows_url,
                    {
                        user: self.vue.current_user
                    },
                    function (data) {
                        console.log(data.user_images);
                        self.vue.user_images = data.user_images;
                        enumerate(self.vue.user_images);
                        self.vue.format_date();
                        self.vue.go_follow_page();
                        self.vue.max_id = self.vue.user_images.length;
                    })
            }, 000);
        }

    };

    self.get_local_follows = function(){
        setTimeout(function() {
            $.post(view_follows_url,
            {
                user: self.vue.current_user
            },
                function (data) {
                console.log(data.user_images);
                self.vue.follows = data.user_images;
                enumerate(self.vue.follows);
                self.vue.max_id = self.vue.user_images.length;
            })
        }, 1000);
        self.vue.format_date();
    };

    self.get_sorted_images = function (flag) {
        setTimeout(function() {
            $.post(sorted_images_url,
            {
                user_images: self.vue.user_images,
                flag: flag
            },
                function (data) {
                console.log("send out flag: ", flag)
                self.vue.user_images = data.user_images;
                enumerate(self.vue.user_images);
                self.vue.max_id = self.vue.user_images.length;
            })
        }, 1000);
        self.vue.format_date();
    };

    self.log_user = function () {

        $.getJSON(log_user_url,
            {},
            function (data) {
            self.vue.current_user = data.current_user;
            if(self.vue.current_user) {
                console.log(self.vue.current_user, "is logged in")
                self.vue.logged_in = true;
            }
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
        }, 1000);

    };

    self.add_post = function (){
        self.upload_file();
        self.vue.preview_image = false;
        setTimeout(function(){
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
                self.get_images();
            });
            }, 1000);
        setTimeout(function(){
                self.vue.go_home();
        },2000)

    };

    self.update_post = function(){
        if(self.vue.change_image)
        {
            self.upload_file();
        }
        setTimeout(function() {
            if (self.vue.change_image) {
                console.log("update with image")
                $.post(update_post_url,
                    {
                        post_id: self.vue.post_id,
                        image_price: self.vue.image_price,
                        description: self.vue.post_description,
                        title: self.vue.post_title,
                        image_url: self.vue.image_url,
                        phone_number: self.vue.post_phone_number,
                        text_ok: self.vue.text_ok,
                        call_ok: self.vue.call_ok,
                        show_email: self.vue.show_email
                    }, function (data) {
                    });
            }
            if (!self.vue.change_image) {
                console.log("update without image")
                $.post(update_post_url,
                    {
                        post_id: self.vue.post_id,
                        image_price: self.vue.image_price,
                        description: self.vue.post_description,
                        title: self.vue.post_title,
                        phone_number: self.vue.post_phone_number,
                        text_ok: self.vue.text_ok,
                        call_ok: self.vue.call_ok,
                        show_email: self.vue.show_email
                    }, function (data) {
                    });
            }
            self.view_owned();
        },1000);
        setTimeout(function(){
            self.go_edit_page();
        },1500)
    }


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
        self.vue.search_page = false;
        self.vue.preview_image = false;
        self.vue.post_page_2=false;
        self.vue.follow_page = false;
        self.vue.edit_page = false;
        self.vue.selected_item_idx = image_idx;
        self.vue.item_page=true;
    };

    self.go_home = function(){
        self.vue.last_page = 'home'
        self.vue.edit_page = false;
        self.vue.text_ok =false;
        self.vue.call_ok=false;
        self.vue.post_phone_number=null;
        self.vue.show_email= true;
        self.vue.get_images();
        self.vue.search_page=false;
        self.vue.image_url=null;
        self.vue.image_price = null;
        self.vue.post_description = null;
        self.vue.post_title = null;
        self.vue.item_page=false;
        self.vue.post_page=false;
        self.vue.post_page_2 =false;
        self.vue.is_uploading=false;
        self.vue.preview_image=false;
        self.vue.home_page=true;
        self.vue.selected_item_idx = null;
        self.vue.search_input = null;
        self.vue.local_search =null;
        self.vue.follow_page=null;
        self.vue.intro_page= false;
        self.vue.change_image = false;
    };

    self.go_post_page = function(){
        if(self.vue.logged_in) {
            self.vue.home_page = false;
            self.vue.preview_image = false;
            self.vue.post_page_2 = false;
            self.vue.follow_page = false;
            self.vue.edit_page = false;
            self.vue.post_page = true;
        }
        else{
            alert("You must be logged in to create a post!")
        }

    };

    self.go_back= function(){
        if(self.vue.last_page == 'home')
            self.vue.go_home()
        if(self.vue.last_page == 'follows')
            self.vue.go_follow_page()
        if(self.vue.last_page == 'edits')
            self.vue.go_edit_page()
        if(self.vue.last_page == 'search')
            self.vue.go_search_results()

    }

    self.go_edit_page = function(){
        self.vue.home_page=false;
        self.vue.last_page= 'edits'
        self.vue.item_page=false
        self.vue.edit_page = true;
        self.vue.edit_item_page=false;
        self.vue.change_image = false;

    };


    self.go_search_results = function(){
        self.vue.last_page = 'search'
        self.vue.home_page=false;
        self.vue.search_page = true;
        self.vue.item_page=false

    };

     self.go_follow_page = function(){
        self.vue.home_page=false;
        self.vue.item_page=false
        self.vue.last_page='follows'
        self.vue.follow_page = true;

    };



    self.go_post_page_2 = function(){
        if(self.vue.post_title != null && self.vue.post_description != null && self.vue.image_price != null){
            self.vue.post_page=false;
            self.vue.post_page_2=true;
            self.vue.preview_image = false;

        }
        else{
            alert("Missing required fields!")
        }


    };

    self.test_follow_post = function(image_id, flag){
        if(!self.vue.logged_in)
            alert('You must be logged in to track posts!')
        $.post(test_follow_post_url,
            {
                user: self.vue.current_user,
                image_id: image_id,
                flag: flag
            },
            function () {
            self.vue.get_images();
            });

    };


    self.follow_post = function(image_id, flag){
        $.post(follow_post_url,
            {
                image_id: image_id,
                user: self.vue.current_user,
                flag: flag
            },
            function () {
            });
        self.vue.get_images();
        self.vue.get_local_follows();
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
                self.get_images()
                self.go_home()
                alert("Success! Your post was deleted.")
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

    self.edit_item= function(item_idx, image_id){
        selected_item_idx = item_idx;
        self.vue.post_id = image_id;
        self.vue.post_title = self.vue.user_images[item_idx].title;
        self.vue.post_description = self.vue.user_images[item_idx].description;
        self.vue.image_price = self.vue.user_images[item_idx].image_price;
        self.vue.image_url = self.vue.user_images[item_idx].image_url;
        self.vue.post_phone_number = self.vue.user_images[item_idx].phone_number;
        self.vue.text_ok = self.vue.user_images[item_idx].text_ok;
        self.vue.call_ok = self.vue.user_images[item_idx].call_ok;
        self.vue.show_email = self.vue.user_images[item_idx].show_email;
        self.vue.home_page=false;
        self.vue.item_page=false;
        self.vue.search_page = false;
        self.vue.preview_image = false;
        self.vue.post_page_2=false;
        self.vue.follow_page = false;
        self.vue.edit_page = false;
        self.vue.edit_item_page=true;


    }


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
        if(self.vue.user_images.length ==0)
            self.vue.get_images();
        self.vue.local_search = string;
        self.vue.go_search_results();
        var str = string;
        var title = ""
        var desc = ""
        var local = []
        console.log("starting search of ", self.vue.user_images.length, "size")
        for (var i = 0; i < self.vue.user_images.length; i++) {
            title = self.vue.user_images[i].title;
            desc = self.vue.user_images[i].description;
            if(title.includes(str) || desc.includes(str)){
                console.log("found a match")
                console.log("saving post title: ", title, "desc: ", desc)
                self.vue.user_images[i]._idx = i
                local.push(self.vue.user_images[i])
            }
            else{
                console.log("was not match")
                console.log("removing post title: ", title, "desc: ", desc)
                console.log("removing ", self.vue.user_images[i])
                self.vue.user_images.splice(i,1);
                i--;
            }
        }
        self.vue.user_images = local
        self.vue.max_id = self.vue.user_images.length;

    };

    self.view = function(flag){
        var flag = flag
        if(flag == 1){
            self.vue.view_thumbnail = false;
            self.vue.view_list = false;
            self.vue.view_thumbnail = true;
        }
        if(flag == 2){
            self.vue.view_list = false;
            self.vue.view_thumbnail = false;
            self.vue.view_list = true;
        }
    };

    self.view_owned= function(){
            setTimeout(function() {
            $.post(view_owned_url,
            {
                user: self.vue.current_user
            },
                function (data) {
                console.log(data.user_images);
                self.vue.user_images = data.user_images;
                enumerate(self.vue.user_images);
                self.vue.format_date();
                self.vue.go_edit_page();
                self.vue.max_id = self.vue.user_images.length;
            })
        }, 000);

    };

    self.new_image = function()
    {
        self.vue.change_image = true;
        $("div#uploader_div2").show();
    }

    self.cancel_new_image = function()
    {
        self.vue.change_image = false;
        $("div#uploader_div2").hide();
    }

    self.format_date = function(){
        var old_date;
        var m;
        var d;
        var updated;

         for (var i = 0; i < self.vue.user_images.length; i++) {
             old_date = self.vue.user_images[i].created_on;
             m = old_date.substring(5,7);
             d = old_date.substring(8,10);
             if(m=='01')
                 m = 'Jan';
             if(m=='02')
                 m = 'Feb';
             if(m=='03')
                 m = 'Mar';
             if(m=='04')
                 m = 'Apr';
             if(m=='05')
                 m = 'May';
             if(m=='06')
                 m = 'Jun';
             if(m=='07')
                 m = 'Jul';
             if(m=='08')
                 m = 'Aug';
             if(m=='09')
                 m = 'Sep';
             if(m=='10')
                 m = 'Oct';
             if(m=='11')
                 m = 'Nov';
             if(m=='12')
                 m = 'Dec';
             updated = m + " " +d;

             self.vue.user_images[i].created_on=updated;
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
            post_description:'',
            selected_item_idx:null,
            is_uploading: false,
            intro_page: true,
            home_page: false,
            item_page: false,
            post_page: false,
            search_page:false,
            post_page_2: false,
            add_item_page: false,
            follow_page: false,
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
            view_thumbnail: true,
            view_list: false,
            edit_page: false,
            last_page: 'home',
            edit_item_page: false,
            change_image: false,
            logged_in:false,
            preferred_date:null
        },
        methods: {
            local_image: self.local_image,
            extend: self.extend,
            add_post: self.add_post,
            log_users: self.log_users,
            follow_post: self.follow_post,
            test_follow_post: self.test_follow_post,
            set_price: self.set_price,
            get_user_images: self.get_user_images,
            get_images: self.get_images,
            get_follows: self.get_follows,
            get_local_follows: self.get_local_follows,
            edit_item: self.edit_item,
            search_fields: self.search_fields,
            show_item: self.show_item,
            upload_file: self.upload_file,
            upload_complete: self.upload_complete,
            go_home: self.go_home,
            go_search_results: self.go_search_results,
            go_follow_page: self.go_follow_page,
            go_edit_page: self.go_edit_page,
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
            get_sorted_images: self.get_sorted_images,
            view: self.view,
            view_follows: self.view_follows,
            previewImages: self.previewImages,
            view_owned: self.view_owned,
            go_back: self.go_back,
            new_image: self.new_image,
            cancel_new_image: self.cancel_new_image,
            update_post: self.update_post,
            format_date: self.format_date


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

