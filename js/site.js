var newURL = window.location.protocol + "://" + window.location.host;
$(function () {
    /*$('[data-click="accordion"]').click(function () {
        alert('test clicked');
        if (!$(this).is('.open')) {
            $('[data-click="accordion"].open').each((i, item) => {
                item.click();
            });
            $(this).addClass('open');
        }
        else {
            $(this).removeClass('open');
        }
    });*/

    $(".login__container").on({
        click: function (e) {
            e.preventDefault();
            var type = $(this).parent().parent().find(".password").attr("type");
            if (type == "password") {
                $(this).removeClass("fa-eye-slash");
                $(this).addClass("fa-eye");
                $(this).parent().parent().find(".password").attr("type", "text");
            } else if (type == "text") {
                $(this).removeClass("fa-eye");
                $(this).addClass("fa-eye-slash");
                $(this).parent().parent().find(".password").attr("type", "password");
            }
            return false;
        }
    }, '#togglePassword');

    $(".fill_form").on({
        change: function (e) {
            if (this.value == 0) {
                $('#range_options').show()
                $('#normal_options').hide()
            } else {
                $('#normal_options').show()
                $('#range_options').hide()
            }
          
        }
    }, '#salary_pay_type');
    
    $("#cal_result").on({
        click: function (e) {
            e.preventDefault();
            $('#cal_result').hide();
            $('#cal_form').show()
            return false;

        }
    }, '#cal_back');
    

    // Autom Complete
    /*$('.cityautocomplete').autoComplete({
        resolver: 'custom',
        formatResult: function (item) {
            return {
                value: item.id,
                text: item.title + " - " + item.state + ""
               
            };
        },
        events: {
            search: function (qry, callback) {
                $.ajax({
                    type: "POST",
                    url: "/api/search/locations",
                    data: JSON.stringify({ start_search_key: qry }),
                    async: true,
                    cache: true,
                    success: function (res) {
                        callback(res.posts)
                    }
                });
            }
        }
    });*/


    // Auto Complete [Classified]
    /*$('.search_autocomplete').autoComplete({
        resolver: 'custom',
        formatResult: function (item) {
            return {
                value: item.id,
                text: item.title
                
            };
        },
        events: {
            search: function (qry, callback) {
                $.ajax({
                    type: "POST",
                    url: "/api/search/labels",
                    data: JSON.stringify({ start_search_key: qry, type: 18 }),
                    async: true,
                    cache: true,
                    success: function (res) {
                        callback(res.posts)
                    }
                });
            }
        }
    });*/

    // Auto Complete [Brands / Models]
    /*$('.brand_autocomplete').autoComplete({
        resolver: 'custom',
        formatResult: function (item) {
            return {
                value: item.id,
                text: item.title
               
            };
        },
        events: {
            search: function (qry, callback) {
                $.ajax({
                    type: "POST",
                    url: "/api/search/categories",
                    data: JSON.stringify({ start_search_key: qry, type: 18 }),
                    async: true,
                    cache: true,
                    success: function (res) {
                        callback(res.posts)
                    }
                });
            }
        }
    });

    // Auto Complete [Agents]
    $('.agent_search_autocomplete').autoComplete({
        resolver: 'custom',
        formatResult: function (item) {
            return {
                value: item.id,
                text: item.title
               
            };
        },
        events: {
            search: function (qry, callback) {
                $.ajax({
                    type: "POST",
                    url: "/api/search/labels",
                    data: JSON.stringify({ start_search_key: qry, type: 17 }),
                    async: true,
                    cache: true,
                    success: function (res) {
                        callback(res.posts)
                    }
                });
            }
        }
    });

    // Auto Complete [Agency]
    $('.agency_search_autocomplete').autoComplete({
        resolver: 'custom',
        formatResult: function (item) {
            return {
                value: item.id,
                text: item.title
               
            };
        },
        events: {
            search: function (qry, callback) {
                $.ajax({
                    type: "POST",
                    url: "/api/search/labels",
                    data: JSON.stringify({ start_search_key: qry, type: 16 }),
                    async: true,
                    cache: true,
                    success: function (res) {
                        callback(res.posts)
                    }
                });
            }
        }
    });

    // Auto Complete [Agency]
    $('.blog_search_autocomplete').autoComplete({
        resolver: 'custom',
        formatResult: function (item) {
            return {
                value: item.id,
                text: item.title
                
            };
        },
        events: {
            search: function (qry, callback) {
                $.ajax({
                    type: "POST",
                    url: "/api/search/labels",
                    data: JSON.stringify({ start_search_key: qry, type: 4 }),
                    async: true,
                    cache: true,
                    success: function (res) {
                        callback(res.posts)
                    }
                });
            }
        }
    });*/


    // Form Eye
    /*$(".ftco-section").on({
        click: function (e) {

            $(this).toggleClass("fa-eye fa-eye-slash");
            var input = $($(this).attr("toggle"));
            if (input.attr("type") == "password") {
                console.log('test 2')
                input.attr("type", "text");
            } else {
                console.log('test 3')
                input.attr("type", "password");
            }
        }
    }, '.toggle-password');

    $(".enqury-frm").on({
        click: function (e) {
            $('#shw_eml_cnt').html($(this).data("eml"))
            $(this).hide();
            return false;
        }
    }, '#shw_eml');

    $(".enqury-frm").on({
        click: function (e) {
            $('#shw_ph_cnt').html($(this).data("ph"))
            $(this).hide();
            return false;
        }
    }, '#shw_ph');

    $(".enqury-frm").on({
        click: function (e) {
            var id = $(this).data('id');
            var auth = $(this).data('auth')
            $.ajax({
                type: "POST",
                url: "/api/handler/generate_chat_url",
                data: JSON.stringify({ id: id }),
                success: function (res) {
                    if (res.status == "success") {
                        if (auth === 0) {
                            window.location = "/signin?returnUrl=" + res.url
                        } else {
                            window.location = res.url;
                        }
                    }
                }
            });
            return false;
        }
    }, '#chat-btn');



    $(".ad_attr").on({
        click: function (e) {
            if ($("#attr_more_list").is(":visible")) {
                $("#attr_more_list").hide();
                $(this).text("Show More")
            } else {
                $("#attr_more_list").show();
                $(this).text("Show Less")
            }
            return false;
        }
    }, '#toggle_attr');

    $(".ad_decs").on({
        click: function (e) {
            if ($("#desc_more").is(":visible")) {
                $("#desc_more").hide();
                $(this).text("Show More")
            } else {
                $("#desc_more").show();
                $(this).text("Show Less")
            }
            return false;
        }
    }, '#toggle_desc');*/


});

/*
function displayMessage(message, alert_css, msg) {
    var str = "";
    str += '<div class="alert ' + alert_css + ' alert-dismissible fade show" role="alert">';
    str += message;
    str += '</button></div>';
    $(msg).html(str);
}*/
