var map;
var marker_cluster;
var OpenStreetMap_DE;

$(function () {

    get_compare_list();

    $(".sorting-options").on({
        change: function (e) {
            var _value = $(this).val();
            if (_value !== null && _value !== "") {
                window.location.href = $(this).val();
            }
           
        }
    }, '.sorting');

    $(".sorting-options").on({
        click: function (e) {
            e.stopPropagation();
            $("#grid_view_btn").removeClass("opacity-2 ml-5");
            $("#lst_view_btn").addClass("opacity-2 ml-5");
            createCookie("vsk_lst_view", 1, 30);
            var url = $(this).data('url');
            window.location.href = url;
        }
    }, '#lst_view_btn');

    $(".sorting-options").on({
        click: function (e) {
            e.stopPropagation();
            $("#grid_view_btn").addClass("opacity-2 ml-5");
            $("#lst_view_btn").removeClass("opacity-2 ml-5");
            createCookie("vsk_lst_view", 0, 30);
            var url = $(this).data('url');
            window.location.href = url;
        }
    }, '#grid_view_btn');


    $("#hero-area").on({
        click: function (e) {
            $('#search_input_location').val($(this).data('value'));
        }
    }, 'ul.location li');

    $("#hero-area").on({
        click: function (e) {
            $('#search_input_ad_type').val($(this).data('value'));
        }
    }, 'ul.ad_type li');

    $("#hero-area").on({
        click: function (e) {
            $('#search_input_ad_status').val($(this).data('value'));
        }
    }, 'ul.ad_status li');

    $("#hero-area").on({
        click: function (e) {
            $('#search_input_bedrooms').val($(this).data('value'));
        }
    }, 'ul.bed_rooms li');

    $("#hero-area").on({
        click: function (e) {
            $('#search_input_bathrooms').val($(this).data('value'));
        }
    }, 'ul.bathrooms li');


    $("#hero-area").on({
        click: function (e) {
            e.stopPropagation();
            var url = $(this).data('url');
            window.location.href = url + "listings/q/?location=" + $('#search_input_location').val() + "&atype=" + $('#search_input_ad_type').val() + "&astatus=" + $('#search_input_ad_status').val() + "&bedrooms=" + $('#search_input_bedrooms').val() + "&bathrooms=" + $('#search_input_bathrooms').val();

            return false;
        }
    }, '#search_form_btn_01');

    $(".list").on({
        click: function (e) {
            e.stopPropagation();
            var url = $(this).data('url');
            var title = $(this).data('title');
            $("#media_shr_fb_link").attr("href", "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url));
            $("#media_shr_twitter_link").attr("href", "https://twitter.com/home?status=" + encodeURIComponent(url));
            $("#media_shr_linkedin_link").attr("href", "https://www.linkedin.com/shareArticle?mini=true&url=" + encodeURIComponent(url) + "/&title=" + encodeURIComponent(title) + "&summary=&source=");
            $("#media_shr_reddit_link").attr("href", "http://reddit.com/submit?url=" + encodeURIComponent(url) + "&title=" + encodeURIComponent(title));
            $("#media_shr_thumblr_link").attr("href", "http://www.tumblr.com/share/link?url=" + encodeURIComponent(url) + "&name=" + encodeURIComponent(title));
            $("#media_shr_google_link").attr("href", "https://plus.google.com/share?url=" + encodeURIComponent(url));
            $("#media_shr_whatsapp_link").attr("href", "whatsapp://send?text=" + encodeURIComponent(url));
            $("#media_shr_messenger_link").attr("href", "fb-messenger://share/?link=" + encodeURIComponent(url) + "&app_id=" + $("#media_shr_messenger_link").data("appid"));

            $("#shareModal").modal();
            return false;
        }
    }, '.share_link');

    
    $(".mylist").on({
        click: function (e) {
            e.stopPropagation();
            var id = $(this).data('id');
            var title = $(this).data('title');
            var price = $(this).data('price');
            var url = $(this).data('imgurl');
            var cookie = $(this).data('cookie');

            var obj = {
                id: id,
                title: title,
                url: url,
                price: price
            };
           
            var raw_list = localStorage.getItem(cookie);
            if (raw_list === null)
                list = [];
            else
                list = JSON.parse(raw_list);
          
            if (list.length < 3) {

                if (!compare_item_exist(list, id)) {
                    list.push(obj);
                    localStorage.setItem(cookie, JSON.stringify(list));
                }
               
            }

            get_compare_list();
               
            return false;
        }
    }, '.compare_link');

    $("#compare").on({
        click: function (e) {
            e.stopPropagation();
            var id = $(this).data('id');
            var cookie = $(this).data('cookie');
                        
            var raw_list = localStorage.getItem(cookie);
            if (raw_list === null)
                list = [];
            else
                list = JSON.parse(raw_list);

            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].id === id) {
                        list.splice(i, 1);
                    }
                }
                localStorage.setItem(cookie, JSON.stringify(list));
            }

            get_compare_list();

            return false;
        }
    }, '.remove-compare-link');
    

    $(".mylist").on({
        click: function (e) {
            e.stopPropagation();
            var action = $(this).data('action');
            var id = $(this).data('id');
            var url = $(this).data('url');
            var auth = $(this).data('auth');
            var type = $(this).data('type');
            if (auth === '0') {
                window.location.href = url + "signin?returnUrl=" + url;
            } else {
                if (action === 0) {
                    $(this).addClass('text-secondary bg-accent border-accent');
                    $(this).removeClass('text-body hover-secondary bg-hover-accent border-hover-accent');
                    $(this).children('i').addClass('fas');
                    $(this).children('i').removeClass('far');
                    $(this).data('action', 1);
                    $.ajax({
                        type: "POST",
                        url: "/api/handler/add_to_favorites",
                        data: JSON.stringify({ contentid: id, type: type }),
                        async: true,
                        cache: true,
                        success: function (msg) {
                            console.log(msg);
                        }
                    });
                } else {
                    $(this).removeClass('text-secondary bg-accent border-accent');
                    $(this).addClass('text-body hover-secondary bg-hover-accent border-hover-accent');
                    $(this).children('i').addClass('far');
                    $(this).children('i').removeClass('fas');
                    $(this).data('action', 0);
                    $.ajax({
                        type: "POST",
                        url: "/api/handler/remove_favorite",
                        data: JSON.stringify({ contentid: id, type: type }),
                        async: true,
                        cache: true,
                        success: function (msg) {
                            console.log(msg);
                        }
                    });
                }
            }
            return false;
        }
    }, '.fav_link');


    /*$(".mylist_v2").on({
        click: function (e) {
            e.stopPropagation();

            var action = $(this).data('action');
            var id = $(this).data('id');
            var url = $(this).data('url');
            var auth = $(this).data('auth');
            var type = $(this).data('type');
            if (auth === '0') {
                window.location.href = url + "signin?returnUrl=" + url;
            } else {
                if (action === 0) {
                    //$(this).addClass('text-secondary bg-accent border-accent');
                    //$(this).removeClass('text-body hover-secondary bg-hover-accent border-hover-accent');
                    $(this).children('i').addClass('fas');
                    $(this).children('i').removeClass('far');
                    $(this).data('action', 1);
                    $.ajax({
                        type: "POST",
                        url: "/api/handler/add_to_favorites",
                        data: JSON.stringify({ contentid: id, type: type }),
                        async: true,
                        cache: true,
                        success: function (msg) {
                            console.log(msg);
                        }
                    });
                } else {
                    //$(this).removeClass('text-secondary bg-accent border-accent');
                    //$(this).addClass('text-body hover-secondary bg-hover-accent border-hover-accent');
                    $(this).children('i').addClass('far');
                    $(this).children('i').removeClass('fas');
                    $(this).data('action', 0);
                    $.ajax({
                        type: "POST",
                        url: "/api/handler/remove_favorite",
                        data: JSON.stringify({ contentid: id, type: type }),
                        async: true,
                        cache: true,
                        success: function (msg) {
                            console.log(msg);
                        }
                    });
                }
            }
            return false;
        }
    }, '.fav_link'); */

    $(".enqury-frm").on({
        click: function (e) {
            e.stopPropagation();

            var author_userid = $('#author_userid').val();
            var isauth = $('#isauth').val();
            var input_name = $('#input_name').val();
            var input_email = $('#input_email').val();
            var input_phone = $('#input_phone').val();
            var input_message = $('#input_message').val();
            var input_contact_email = $('#contact_email').val();
            var enquiry_type = $('#enquiry_type').val();

            var isAuthenticate = (isauth == 'true');

            var msg_panel_id = '#enquiry_msg';
            var container_panel_id = '#enquiry_container';

            if (!isAuthenticate) {

                if (input_name == null || input_name == "") {
                    displayMessage("Please enter name", 'alert-danger', msg_panel_id);
                    return false;
                }

                if (input_email == null || input_email == "") {
                    displayMessage("Please enter email address", 'alert-danger', msg_panel_id);
                    return false;
                }
                else if (!validateEmail(input_email)) {
                    displayMessage("Invalid email address", 'alert-danger', msg_panel_id);
                    return false;
                }

                if (input_phone == null || input_phone == "") {
                    displayMessage("Please enter phone", 'alert-danger', msg_panel_id);
                    return false;
                }
            }

            if (input_message == null || input_message == "") {
                displayMessage("Please enter message", 'alert-danger', msg_panel_id);
                return false;
            }

            initializeLoader(msg_panel_id);
            $(container_panel_id).hide();

            var obj = {
                Author_UserID: author_userid,
                fullName: input_name,
                phoneNumber: input_phone,
                emailAddress: input_email,
                ContactEmail: input_contact_email,
                Message: input_message
            }
            console.log('enquiry type is ' + enquiry_type);
            var url = '';
            switch (enquiry_type) {
                case '0':
                    // agent
                    url = '/api/enquiry/agent_enquiry';
                    break;
                case '1':
                    // agency
                    url = '/api/enquiry/agency_enquiry';
                    break;
                case '2':
                    // ad
                    obj.AdId = $('#ad_id').val();
                    obj.AdTitle = $('#ad_title').val();

                    url = '/api/enquiry/ad_enquiry';
                    break;
            }
            console.log(obj);
            if (url != '') {
                $.ajax({
                    type: "POST",
                    url: url,
                    data: JSON.stringify(obj),
                    async: true,
                    cache: true,
                    success: function (response) {
                        if (response.status === 'success') {
                            displayMessage("Message Sent", 'alert-success', msg_panel_id);
                            if ($('#input_name').length) {
                                $('#input_name').val("");
                            }
                            if ($('#input_email').length) {
                                $('#input_email').val("");
                            }
                            if ($('#input_phone').length) {
                                $('#input_phone').val("");
                            }
                            $('#input_message').val("");
                        } else {
                            displayMessage("Error Occured", 'alert-danger', msg_panel_id);
                        }
                        $(container_panel_id).show();
                    }
                });
            }
            return false;
        }
    }, '#btn_enquiry_submit');

    $(".write-review").on({
        click: function (e) {
            e.stopPropagation();
            var isauth = $('#review_isauth').val();
            var input_message = $('#review_message').val();
            var content_id = $('#review_content_id').val();
            var author_id = $('#review_author_id').val();
            var review_type = $('#review_type').val();
            var rating = $('#review_rating').val();

            var isAuthenticate = (isauth == 'true');

            var msg_panel_id = '#review_msg';
            var container_panel_id = '#review_container';

            if (!isAuthenticate) {

                displayMessage("Please sign-in or sign-up to continue", 'alert-danger', msg_panel_id);
                return false;
            }

            if (input_message == null || input_message == "") {
                displayMessage("Please enter message", 'alert-danger', msg_panel_id);
                return false;
            }

            initializeLoader(msg_panel_id);
            $(container_panel_id).hide();

            var obj = {
                profile_userid: author_id,
                contentid: content_id,
                type: review_type,
                rating: rating,
                description: input_message
            }
          
            var url = '/api/review/proc';
            if (url != '') {
                $.ajax({
                    type: "POST",
                    url: url,
                    data: JSON.stringify(obj),
                    async: true,
                    cache: true,
                    success: function (response) {
                        if (response.status === 'success') {
                            displayMessage("Review Submitted", 'alert-success', msg_panel_id);

                            $('#review_message').val("");
                        } else {
                            console.log(response);
                            displayMessage("Error Occured", 'alert-danger', msg_panel_id);
                        }
                        $(container_panel_id).show();
                    }
                });
            }
            return false;
        }
    }, '#btn_write_review');

    $(".write-review").on({
        click: function (e) {
            e.stopPropagation();
            var rating = $(this).data('rating');
            $('#review_rating').val(rating);
        }
    }, '.lh-1');

    $(".post-comment").on({
        click: function (e) {
            e.stopPropagation();

            var isauth = $('#isauth').val();
            var input_message = $('#comment_body').val();
            var content_id = $('#content_id').val();
            var content_type = $('#content_type').val();

            var isAuthenticate = (isauth == 'true');
            var msg_panel_id = '#comment_msg';
            var container_panel_id = '#comment_container';
            if (!isAuthenticate) {

                displayMessage("Please sign-in or sign-up to continue", 'alert-danger', msg_panel_id);
                return false;
            }

            if (input_message == null || input_message == "") {
                displayMessage("Please enter message", 'alert-danger', msg_panel_id);
                return false;
            }

            initializeLoader(msg_panel_id);
            $(container_panel_id).hide();

            var obj = {
                contentid: content_id,
                type: content_type,
                message: input_message
            }

            var url = '/api/comment/post_comment';

            if (url != '') {

                $.ajax({
                    type: "POST",
                    url: url,
                    data: JSON.stringify(obj),
                    async: true,
                    cache: true,
                    success: function (response) {
                        if (response.status === 'success') {
                            displayMessage("Comment Posted", 'alert-success', msg_panel_id);

                            $('#input_message').val("");
                        } else {
                            displayMessage("Error Occured", 'alert-danger', msg_panel_id);
                        }
                        $(container_panel_id).show();
                    }
                });
            }
            return false;
        }
    }, '#btn_comment_submit');

    $(".offer-frm").on({
        click: function (e) {
            e.stopPropagation();
            var default_price = $('#input_default_price').val();
            var input_price = $('#input_price').val();
            var input_message = $('#input_message').val();
            var ad_id = $('#ad_id').val();
            var user_id = $('#user_id').val();

            var msg_panel_id = '#offer_msg';
            var container_panel_id = '#offer_container';

            if (input_price == null || input_price == "") {
                displayMessage("Please enter price", 'alert-danger', msg_panel_id);
                return false;
            }

            if (parseInt(input_price, 10) > default_price) {
                displayMessage("Offer should't exceed list price", 'alert-danger', msg_panel_id);
                return false;
            }

            if (input_message == null || input_message == "") {
                displayMessage("Please enter message", 'alert-danger', msg_panel_id);
                return false;
            }

            initializeLoader(msg_panel_id);
            $(container_panel_id).hide();

            var obj = {
                amount: input_price,
                message: input_message,
                userid: user_id,
                adid: ad_id
            }

            var url = '/api/enquiry/offer';

            if (url != '') {
                $.ajax({
                    type: "POST",
                    url: url,
                    data: JSON.stringify(obj),
                    async: true,
                    cache: true,
                    success: function (response) {
                        if (response.status === 'success') {
                            displayMessage("Offer Sent", 'alert-success', msg_panel_id);
                            if ($('#input_price').length) {
                                $('#input_price').val("");
                            }
                            $('#input_message').val("");
                        } else {
                            displayMessage(response.message, 'alert-danger', msg_panel_id);
                        }
                        $(container_panel_id).show();
                    }
                });
            }
            return false;
        }
    }, '#btn_offer_submit');

    $(".contact-frm").on({
        click: function (e) {
            e.stopPropagation();

            var input_name = $('#input_name').val();
            var input_email = $('#input_email').val();
            var input_phone = $('#input_phone').val();
            var input_message = $('#input_message').val();


            var msg_panel_id = '#contact_msg';
            var container_panel_id = '#cotnact_container';

            if (input_name == null || input_name == "") {
                displayMessage("Please enter name", 'alert-danger', msg_panel_id);
                return false;
            }

            if (input_email == null || input_email == "") {
                displayMessage("Please enter email address", 'alert-danger', msg_panel_id);
                return false;
            }
            else if (!validateEmail(input_email)) {
                displayMessage("Invalid email address", 'alert-danger', msg_panel_id);
                return false;
            }

            if (input_phone == null || input_phone == "") {
                displayMessage("Please enter phone", 'alert-danger', msg_panel_id);
                return false;
            }

            if (input_message == null || input_message == "") {
                displayMessage("Please enter message", 'alert-danger', msg_panel_id);
                return false;
            }

            initializeLoader(msg_panel_id);
            $(container_panel_id).hide();

            var obj = {
                SenderName: input_name,
                PhoneNumber: input_phone,
                EmailAddress: input_email,
                Body: input_message
            }
            var url = '/api/enquiry/contact';

            if (url != '') {
                $.ajax({
                    type: "POST",
                    url: url,
                    data: JSON.stringify(obj),
                    async: true,
                    cache: true,
                    success: function (response) {
                        if (response.status === 'success') {
                            displayMessage("Message Sent", 'alert-success', msg_panel_id);
                            if ($('#input_name').length) {
                                $('#input_name').val("");
                            }
                            if ($('#input_email').length) {
                                $('#input_email').val("");
                            }
                            if ($('#input_phone').length) {
                                $('#input_phone').val("");
                            }
                            $('#input_message').val("");
                        } else {
                            displayMessage("Error Occured", 'alert-danger', msg_panel_id);
                        }
                        $(container_panel_id).show();
                    }
                });
            }
            return false;
        }
    }, '#btn_contact_submit');

    // for sale tab
    $(".main-search").on({
        click: function (e) {
            $('#search-ad-type').val(0);
        }
    }, '#ad-type-sale');

    // for rent tab
    $(".main-search").on({
        click: function (e) {
            $('#search-ad-type').val(1);
        }
    }, '#ad-type-rent');

    $(".main-search").on({
        click: function (e) {
            var value = $('#adv-search').val();

            if (value == 0)
                value = 1;
            else
                value = 0;
            $('#adv-search').val(value);
        }
    }, '#pnl-advance-search');


});

function load_compare_list() {
    var cookieName = $('#compare').data('cookie');
    var raw_list = localStorage.getItem(cookieName);
    if (raw_list === null)
        list = [];
    else
        list = JSON.parse(raw_list);

    var range_ids = [];
    if (list.length > 0) {
        list.forEach(function (item) {
            range_ids.push(item.id);
        });
    } 
    $.ajax({
        type: "POST",
        url: "/api/handler/get_compare_list",
        data: JSON.stringify({ range_ids  }),
        async: true,
        success: function (res) {
            if (res.status === 'success') {
                generate_compare_listing(res.posts);
                toggle_display(1);
            } else {
                toggle_display(0);
            }
        }
    });
}

function toggle_display(index) {
    if (index === 0) {
        // no records
        $('#compare_recordexist').hide();
        $('#compare_norecord').show();
        $('#compare_norecord').html("<h5 class='text-center py-10'>No listings found for comparing</h5>");
    } else {
        $('#compare_recordexist').show();
        $('#compare_norecord').hide();
        $('#compare_norecord').html("");
    }
}

function generate_compare_listing(list) {
    
    var str = "";
    if (list.length > 0) {
        str += generate_compare_listing_heading(list);
        toggle_display(1);
    } else {
        toggle_display(0);
    }
   
    $('#compare_tbl').html(str);
}

function generate_compare_listing_heading(list) {
   
    var str = '<thead class="table-p-6">';
    // top header
    str += '<tr class="bg-gray-03 h-90">';
    str += '<th class="w-25" scope="col"></th>';  
    list.forEach(function (item) {
        str += '<th scope="col">';
        str += '<div class="fs-16 font-weight-normal text-dark mb-0 account_title" >' + item.title + '</div>';
        str += '</th>';
    });
    str += '</tr>';
    // second layer header
    str += "<tr>";
    str += '<th scope="col"></th>';
    list.forEach(function (item) {
        str += '<th scope="col">';
        str += '<div class="card border-0">';
        str += '<div class="rounded-lg">';
        str += '<img class="card-img-top" src="' + item.img_url + '" alt="' + item.title + '">';
        str += '</div>';
        str += '<div class="card-body pt-2 pb-0 px-0">';
        str += '<p class="font-weight-500 text-gray-light mb-0 account_title">' + item.address + '</p>';
        str += '<p class="fs-17 font-weight-bold text-heading mb-0 lh-16 account_title">' + item.customize_price + '</p>';
        str += '</div>';
        str += '</div>';
        str += '</th>';
    });

    str += "</tr>";

    str += '</thead>';

    // body
    str += '<tbody class="text-center table-p-4">';

    str += '<tr class="bg-gray-03 h-90">';
    // attributes[].values.value => value
    var sections = list[0].options;
    sections.forEach(function (section) {
        section.compare_attrs = [];
        section.attributes.forEach(function (attr) {
            section.compare_attrs.push({
                id: attr.id,
                title: attr.title,
                value_1: '',
                value_2: '',
                value_3: ''
            });
        });
    });

    var counter = 1;
    list.forEach(function (item) {
        item.options.forEach(function (section) {
            fetch_data(sections, section, counter);
        });
        counter++;
    });
   
    sections.forEach(function (section) {
        str += '<tr>';
        str += '<td colspan="' + (list.length + 1) + '" class="text-left"><h5>' + section.title + '</h5></td>';
        str += '</tr>';
        section.compare_attrs.forEach(function (attr) {
            str += '<tr>';
            
            $.each(attr, function (key, value) {
                if (key !== 'id') {
                    str += '<td>' + value + '</td>';
                }
            });
            str += '</tr>';
        });
    });
    str += '</tr>';
    str += '</tbody>';
    return str;
}

function fetch_data(sections, current_section, counter) {
    sections.forEach(function (section) {
        if (section.id === current_section.id) {
            fetch_attr(section.compare_attrs, current_section.attributes, counter);
        }
    });
}

function fetch_attr(compare_attrs, attrs, counter) {
    compare_attrs.forEach(function (attr) {
        attrs.forEach(function (current_attr) {
            if (attr.id === current_attr.id) {
                switch (counter) {
                    case 1:
                        attr.value_1 = current_attr.values.value;
                        break;
                    case 2:
                        attr.value_2 = current_attr.values.value;
                        break;
                    case 3:
                        attr.value_3 = current_attr.values.value;
                        break;
                }
            }
            
        });
    });
}

function get_compare_list() {
    var cookieName = $('#compare').data('cookie');
    var raw_list = localStorage.getItem(cookieName);
    if (raw_list === null)
        list = [];
    else
        list = JSON.parse(raw_list);

    $('#campare_list').html("");
    if (list.length > 0) {
        $('#compare').show();
        list.forEach(function (item) {
            $('#campare_list').append(prepare_compare_item(item, cookieName));

        });
    } 
    
}

function compare_item_exist(list, id) {
    var flag = false;
    list.forEach(function (item) {
        if (item.id == id) {
            flag = true;
        }
    });
    return flag;
}

// adjust layout with your theme styling
function prepare_compare_item(item, cookie) {
    var str = '<div class="list-group-item card bg-transparent">';
    str += '<div class="position-relative hover-change-image bg-hover-overlay">';
    str += '<img src="' + item.url + '" class="card-img" alt="' + item.title + '">';
    str += '<div class="card-img-overlay">';
    str += '<a href="#" data-id="' + item.id + '" data-cookie="' + cookie + '" class="text-white hover-image fs-16 lh-1 pos-fixed-top-right position-absolute m-2 remove-compare-link"><i class="fal fa-minus-circle"></i></a>';
    str += '</div>'
    str += '</div>'
    str += '</div>';
    return str;
}


function createCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

function initializeLoader(msg) {
    var str = '<div class="text-center" style="margin:30px 0px;">Processing...</div>';
    $(msg).html(str);
}

function displayMessage(message, alert_css, msg) {
    var str = "";
    str += '<div class="alert ' + alert_css + ' alert-dismissible fade show" role="alert">';
    str += message;
    str += '</button></div>';
    $(msg).html(str);
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}