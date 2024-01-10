$(document).ready(function () {
    let pageOffset = 0;

    initCopyText();

    initSetPageOffset();

    initResponsiveTable();

    initAnchors();

    initSidebarToggle();

    initSidebarAccordion();

    initFeedbackForm();

    initDropdown();

    initSearchPopup();

    initHomeSearchPosition();

    initPopup();

   // initToc();

    initVertionDropdown();

    //initLightbox();

    initPageScrolling();

    initPostAnchor();

    //initHubspotForm();
});

function initHubspotForm() {
    let formContainer = $('.js-hubspot-form');

    if (!formContainer.length) return;

    let hubspotPopup = $('.hubspot-submitted').popup({
        animSpeed: 500,
        box: '.hubspot-submitted__popup',
        close: '.hubspot-submitted__close',
        overlay: '.hubspot-submitted__popup-overlay',
        preventScroll: true,
    });

    hbspt.forms.create({
        portalId: formContainer.data('portalId'),
        formId: formContainer.data('formId'),
        submitButtonClass: 'button button--red hubspot-form__submit',
        target: '#' + formContainer.attr('id'),
        onFormReady: function () { },
        onFormSubmitted: function () {
            hubspotPopup.open();

            setTimeout(function () {
                hubspotPopup.close();
            }, 5000);
        },
    });
}

function initAnchors() {
    anchors.add('.post-content h2:not([data-toc-skip]),.post-content h3:not([data-toc-skip]),.post-content h4:not([data-toc-skip]),.post-content h5:not([data-toc-skip])');

    let anchorLinks = $('.anchorjs-link'),
        $window = $(window);

    anchorLinks.on('click', function (e) {
        e.preventDefault();
        $window.scrollTop($(e.target).offset().top - pageOffset + 1);
    });
}

function initPostAnchor() {
    let anchor = $('.post-anchor__button');

    anchor.on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 300);
    });
}

function initPageScrolling() {
    let page = $(window),
        body = $('body'),
        lastScrollPosition = 0;

    function changeBodyClass() {
        let currentScrollPosition = window.pageYOffset;

        if (currentScrollPosition < 2) {
            body.removeClass('scroll-up page-scrolled');
        } else {
            body.addClass('page-scrolled');
        }

        if (currentScrollPosition < 2) return;

        if (currentScrollPosition > lastScrollPosition && !body.hasClass('scroll-down')) {
            // down
            body.removeClass('scroll-up').addClass('scroll-down');
        } else if (currentScrollPosition < lastScrollPosition && body.hasClass('scroll-down')) {
            // up
            body.removeClass('scroll-down').addClass('scroll-up');
        }

        lastScrollPosition = currentScrollPosition;
    }

    changeBodyClass();

    page.on('scroll', changeBodyClass);
}

function initLightbox() {
    $('.post-content img').each(function (i, item) {
        let image = $(this);

        if (image.is('.inline-img img')) {
            return;
        }

        image.wrap('<a href="' + image.attr('src') + '" data-lightbox="content-lightbox"></a>');
    });

    lightbox.option({
        'resizeDuration': 300,
        'wrapAround': false
    });

    let closeButton = $('.lightbox .lb-close');

    if (closeButton) {
        $('.lightbox .lb-container').append(closeButton);
    }
}

function initVertionDropdown() {
    let body = $('body'),
        dropdown = $('.alt-nav.dropdown'),
        overlay = $('.alt-nav__overlay');

    dropdown.on('show.bs.dropdown', function () {
        overlay.show();
        body.addClass('tablet-overflow');
    });

    dropdown.on('hide.bs.dropdown', function () {
        overlay.hide();
        body.removeClass('tablet-overflow');
    });
}

function initSetPageOffset() {
    let header = $('.main-header'),
        headerElement = header.get(0),
        menu = $('.main-sidebar'),
        menuElement = menu.get(0),
        headerPosition,
        menuPosition,
        headerOffset = 0,
        menuOffset = 0;

    if (!menuElement) {
        pageOffset = 0;
        return;
    }

    function calcOffset() {
        headerPosition = window.getComputedStyle(headerElement, null).getPropertyValue('position');
        menuPosition = window.getComputedStyle(menuElement, null).getPropertyValue('position');

        if (headerPosition === 'fixed' || headerPosition === 'sticky') {
            headerOffset = header.outerHeight();
        } else {
            headerOffset = 0;
        }

        if (menuPosition === 'fixed' || menuPosition === 'sticky') {
            menuOffset = menu.outerHeight();
        } else {
            menuOffset = 0;
        }

        pageOffset = headerOffset + menuOffset;
    }

    calcOffset();

    $(window).on('resize orientationchange', calcOffset);
}

function initPopup() {
    $('.main-header').popup({
        animSpeed: 300,
        box: '.nav-popup',
        opener: '.nav-opener',
        preventScroll: true,
    });

    $('.toc').popup({
        animSpeed: 300,
        box: '.toc__popup',
        opener: '.toc__popup-opener',
        close: '.toc__popup-close, .toc__popup-overlay',
        overlay: '.toc__popup-overlay',
        anchorLinks: 'nav-link',
        showPopup: function () {
            $('body').addClass('toc-active');
        },
        hidePopup: function () {
            setTimeout(function () {
                $('body').removeClass('toc-active scroll-down');
            }, 100);
        },
    });

    $('.main-sidebar').popup({
        animSpeed: 300,
        box: '.main-sidebar__popup',
        opener: '.js-main-sidebar-opener',
        close: '.main-sidebar__close',
        preventScroll: true,
        bodyClass: 'main-sidebar-opened',
    });
}

$.fn.popup = function (options) {
    options = $.extend(
        {
            animSpeed: 500,
            effect: 'fade',
            box: '.popup__box',
            opener: '.popup__opener',
            close: '.popup__close',
            bodyClass: 'mobile-overflow',
            overlay: null,
            anchorLinks: null,
        },
        options
    );

    let page = jQuery(window),
        holder = $(this),
        body = $('body'),
        popup = holder.find(options.box),
        opener = holder.find(options.opener),
        close = holder.find(options.close),
        overlay = holder.find(options.overlay),
        links = options.anchorLinks,
        bodyClass = options.bodyClass,
        menuIsOpened = false,
        menuIsAnimated = false,
        preventScroll = false;

    function toggleMenu() {
        menuIsAnimated = !menuIsAnimated;

        if (!menuIsAnimated) {
            return;
        }

        if (menuIsOpened) {
            opener.removeClass('expanded');

            if (options.preventScroll) {
                body.removeClass(bodyClass);
            }

            popup.fadeOut(300, function () {
                switchMenuState();
            });

            if (options.overlay) {
                overlay.fadeOut(300);
            }

            if (typeof options.hidePopup === 'function') {
                options.hidePopup();
            }
        } else {
            opener.addClass('expanded');

            if (options.preventScroll) {
                body.addClass(bodyClass);
            }

            popup.fadeIn(300, function () {
                switchMenuState();
            });

            if (options.overlay) {
                overlay.fadeIn(300);
            }

            if (typeof options.showPopup === 'function') {
                options.showPopup();
            }
        }
    }

    function switchMenuState() {
        menuIsOpened = !menuIsOpened;
        menuIsAnimated = !menuIsAnimated;
    }

    let popupFunc = function () {
        if (links) {
            popup.on('click', function (e) {
                if (e.target.classList.contains(links) && window.innerWidth < 1280 && !menuIsAnimated) {
                    menuIsAnimated = !menuIsAnimated;
                    setTimeout(function () {
                        menuIsAnimated = !menuIsAnimated;
                        toggleMenu();
                    }, 500);
                }
            });
        }

        opener.on('click', function (e) {
            e.preventDefault();
            toggleMenu();
        });

        close.on('click', function (e) {
            e.preventDefault();
            menuIsOpened = true;
            toggleMenu();
        });
    };

    this.close = function () {
        menuIsOpened = true;
        toggleMenu();
    }

    this.open = function () {
        toggleMenu();
    }

    return this.each(popupFunc);
};

function initHomeSearchPosition() {
    let homePage = $('.home-layout');

    if (!homePage.length) return;

    let page = jQuery(window),
        pageOffsetTop,
        isScrolled = false,
        searchContainer = $('.js-home-search'),
        opener = $('.js-search-popup-opener'),
        searchOffsetTop;

    function handleScroll() {
        pageOffsetTop = page.scrollTop();
        searchOffsetTop = searchContainer.offset().top;

        if (isScrolled && pageOffsetTop < searchOffsetTop) {
            opener.removeClass('under-search');
            isScrolled = !isScrolled;
        } else if (!isScrolled && pageOffsetTop > searchOffsetTop) {
            opener.addClass('under-search');
            isScrolled = !isScrolled;
        }
    }

    handleScroll();

    page.on('scroll', handleScroll);
}

function initSearchPopup() {
    let popup = $('.search-popup'),
        opener = $('.js-search-popup-opener'),
        close = $('.js-search-popup-close'),
        body = $('body'),
        input = $('.search-input.aa-input');

    // mobile-overflow

    opener.on('click', function (e) {
        e.preventDefault();
        body.addClass('tablet-overflow');
        popup.fadeIn(300, function () {
            input.focus();
        });
    });

    close.on('click', function (e) {
        e.preventDefault();
        body.removeClass('tablet-overflow');

        popup.fadeOut(300);
    });
}

function initMobileNav() {
    let page = jQuery(window),
        header = jQuery('.main-header'),
        nav = header.find('.nav-popup'),
        links = header.find('.main-nav-anchor'),
        opener = jQuery('.nav-opener'),
        body = jQuery('body'),
        menuIsOpened = false,
        menuIsAnimated = false;

    function toggleMenu() {
        if (window.innerWidth >= 1025) {
            return;
        }

        menuIsAnimated = !menuIsAnimated;

        if (!menuIsAnimated) {
            return;
        }

        if (menuIsOpened) {
            opener.removeClass('expanded');
            body.removeClass('overflow');
            nav.fadeOut(300, function () {
                menuIsOpened = !menuIsOpened;
                menuIsAnimated = !menuIsAnimated;
            });
        } else {
            opener.addClass('expanded');
            body.addClass('overflow');
            nav.fadeIn(300, function () {
                menuIsOpened = !menuIsOpened;
                menuIsAnimated = !menuIsAnimated;
            });
        }
    }

    links.on('click', function (e) {
        e.preventDefault();
        toggleMenu();
    });

    opener.on('click', function (e) {
        e.preventDefault();
        toggleMenu();
    });
}

function initDropdown() {
    let mainNav = $('.main-nav'),
        dropdown = mainNav.find('.dropdown'),
        subMenu = mainNav.find('.dropdown-menu');

    $('.dropdown-menu .dropdown-toggle').on('click', function (e) {
        let $el = $(this);
        let $parent = $el.offsetParent('.dropdown-menu');

        if (!$el.next().hasClass('show')) {
            $el.parents('.dropdown-menu').first().find('.show').removeClass('show');
        }

        let $subMenu = $el.next('.dropdown-menu');
        $subMenu.toggleClass('show');

        $el.parent('li').toggleClass('show');

        return false;
    });

    mainNav.on('hide.bs.dropdown', function (e) {
        dropdown.removeClass('show');
        subMenu.removeClass('show');
    });
}

function initResponsiveTable() {
    $('.post-content table').each(function () {
        let table = jQuery(this),
            th = table.find('th'),
            tr = table.find('tr'),
            switcher = $('<div class="table__toggle"><span class="table__toggle-default-text">Show all</span><span class="table__toggle-active-text">Hide</span></div>'),
            isExpanded = false,
            wrapper;

        table.wrap($('<div class="table"></div>'));
        switcher.insertAfter(table);
        wrapper = table.closest('.table');

        if (th.length < 3) {
            wrapper.addClass('width-50');
        }

        tr.each(function () {
            $(this).find('td').each(function (i, item) {
                item.setAttribute('data-th-text', th.eq(i).text());
            });
        });

        switcher.on('click', function (e) {
            wrapper.toggleClass('expanded');

            if (isExpanded) {
                table.get(0).scrollIntoView();
            }

            isExpanded = !isExpanded;
        });

        function checkTableHeight() {
            if (window.innerWidth >= 768) return;

            if (table.outerHeight() > (window.innerHeight - pageOffset)) {
                wrapper.addClass('has-collapse');
            } else {
                wrapper.removeClass('has-collapse');
            }
        }

        checkTableHeight();

        $(window).on('resize orientationchange', checkTableHeight);
    });
}

function initCopyText() {
    jQuery('.post-content > pre, .post-content details > pre, div.highlight').each(function () {
        let block = jQuery(this),
            codeContainer = block.find('code').get(0),
            copyButton = jQuery('<div class="code-button"><i class="icon-copy"></i></div>'),
            blockHeader = jQuery('<div class="code-header"></div>');

        copyButton.bind('click', {
            container: codeContainer,
            btn: copyButton,
        }, copyText);

        blockHeader.append(copyButton);
        blockHeader.insertBefore(block);
    });

    function copyText(e) {
        e.preventDefault();
        e.data.btn.removeClass('active');

        let textArea = document.createElement('textarea');

        textArea.value = e.data.container.textContent.trim();
        textArea.classList.add('hidden-item');
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('Copy');
        textArea.remove();

        e.data.btn.addClass('active');
    }
}

function initSidebarAccordion() {
    $('.sidebar-nav li.active-page-item').parents('li').toggleClass('active');

    $('.sidebar-nav').navgoco({
        caretHtml: null,
        openClass: 'active',
        save: false,
        slide: {
            duration: 300,
            easing: 'linear',
        },
    });
}

function initFeedbackForm() {
    let form = $('#feedback-form'),
        formNative = form.get(0),
        regEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
        isValid = false,
        errorClass = 'validation-error',
        inputs = form.find('.required-field, .required-email, .optional-email'),
        successMessage = $('.feedback-form__success-message'),
        formIsSubmitted = false;

    function validateForm() {
        isValid = true;
        inputs.each(checkField);

        if (!isValid) {
            return false;
        }
    }

    function checkField(i, item) {
        let input = $(item);

        // not empty fields
        if (input.hasClass('required-field')) {
            setState(input, !input.val().length)
        }

        // correct email fields
        if (input.hasClass('required-email')) {
            setState(input, !regEmail.test(input.val()));
        }

        // optional email fields
        if (input.hasClass('optional-email') && input.val().length) {
            setState(input, !regEmail.test(input.val()));
        }
    }

    function setState(field, error) {
        field.removeClass(errorClass);

        if (error) {
            field.addClass(errorClass);

            field.one('focus', function () {
                field.removeClass(errorClass);
            });

            isValid = false;
        }
    }

    $(':input', form).change(function () {
        form.data('state-changed', true);
    })

    $('.form-collapse').each(function () {
        let container = $(this),
            opener = container.find('.js-form-collapse__opener'),
            firstStep = container.find('.js-form-collapse__first-step'),
            secondStep = container.find('.js-form-collapse__second-step'),
            secondStepOpener = container.find('.js-form-collapse__second-step-opener'),
            close = container.find('.js-form-collapse__close'),
            slide = container.find('.js-form-collapse__slide'),
            shortFeedback = container.find('.js-form-collapse__short-feedback');

        secondStepOpener.on('click', function (e) {
            let shortFeedbackValue = $(e.currentTarget).text();

            shortFeedback.val(shortFeedbackValue).change();
            firstStep.hide();
            secondStep.removeClass('hidden');
        });

        opener.on('click', function () {
            opener.addClass('button--disabled');
            slide.stop().slideDown(300);
        });

        close.on('click', function (e) {
            e.preventDefault();

            slide.stop().slideUp(300);

            if (!formIsSubmitted) {
                opener.removeClass('button--disabled');
            }
        });
    });

    $('#feedback-submit').on('click', function (e) {
        e.preventDefault();
        validateForm();

        if (isValid) {
            handleFeedbackSubmit(e);
            form.data('state-changed', false);
        }
    });

    async function handleFeedbackSubmit(event) {
        event.preventDefault();
        let data = new FormData(formNative);

        fetch(formNative.action, {
            method: formNative.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.status === 200) {
                form.hide();
                successMessage.show();
                formIsSubmitted = true;
            }
        }).catch(error => {
            console.log(error);
        });
    }

    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden' && form.data('state-changed')) {
            navigator.sendBeacon(formNative.action, new FormData(formNative));
        }
    });
}

function initSidebarToggle() {
    let sidebar = $('.main-sidebar'),
        opener = sidebar.find('.js-main-sidebar-switcher');

    opener.on('click', function (e) {
        e.preventDefault();
      
        sidebar.toggleClass('main-sidebar--collapsed');
    });
}

function initToc() {
    /*!
     * Bootstrap Table of Contents v<%= version %> (http://afeld.github.io/bootstrap-toc/)
     * Copyright 2015 Aidan Feldman
     * Licensed under MIT (https://github.com/afeld/bootstrap-toc/blob/gh-pages/LICENSE.md) */

    window.Toc = {
        helpers: {
            // return all matching elements in the set, or their descendants
            findOrFilter: function ($el, selector) {
                // http://danielnouri.org/notes/2011/03/14/a-jquery-find-that-also-finds-the-root-element/
                // http://stackoverflow.com/a/12731439/358804
                var $descendants = $el.find(selector);
                return $el
                    .filter(selector)
                    .add($descendants)
                    .filter(':not([data-toc-skip])');
            },

            generateUniqueIdBase: function (el) {
                var text = $(el).text();

                // adapted from
                // https://github.com/bryanbraun/anchorjs/blob/65fede08d0e4a705f72f1e7e6284f643d5ad3cf3/anchor.js#L237-L257

                // Regex for finding the non-safe URL characters (many need escaping): & +$,:;=?@"#{}|^~[`%!'<>]./()*\ (newlines, tabs, backspace, & vertical tabs)
                var nonsafeChars =
                    /[& +$,:;=?@"#{}|^~[`%!'<>\]\.\/\(\)\*\\\n\t\b\v]/g,
                    urlText;

                // Note: we trim hyphens after truncating because truncating can cause dangling hyphens.
                // Example string:                      // " ⚡⚡ Don't forget: URL fragments should be i18n-friendly, hyphenated, short, and clean."
                urlText = text
                    .trim() // "⚡⚡ Don't forget: URL fragments should be i18n-friendly, hyphenated, short, and clean."
                    .replace(/\'/gi, '') // "⚡⚡ Dont forget: URL fragments should be i18n-friendly, hyphenated, short, and clean."
                    .replace(nonsafeChars, '-') // "⚡⚡-Dont-forget--URL-fragments-should-be-i18n-friendly--hyphenated--short--and-clean-"
                    .replace(/-{2,}/g, '-') // "⚡⚡-Dont-forget-URL-fragments-should-be-i18n-friendly-hyphenated-short-and-clean-"
                    .substring(0, 64) // "⚡⚡-Dont-forget-URL-fragments-should-be-i18n-friendly-hyphenated-"
                    .replace(/^-+|-+$/gm, '') // "⚡⚡-Dont-forget-URL-fragments-should-be-i18n-friendly-hyphenated"
                    .toLowerCase(); // "⚡⚡-dont-forget-url-fragments-should-be-i18n-friendly-hyphenated"

                return urlText || el.tagName.toLowerCase();
            },

            generateUniqueId: function (el) {
                var anchorBase = this.generateUniqueIdBase(el);
                for (var i = 0; ; i++) {
                    var anchor = anchorBase;
                    if (i > 0) {
                        // add suffix
                        anchor += '-' + i;
                    }
                    // check if ID already exists
                    if (!document.getElementById(anchor)) {
                        return anchor;
                    }
                }
            },

            generateAnchor: function (el) {
                if (el.id) {
                    return el.id;
                } else {
                    var anchor = this.generateUniqueId(el);
                    el.id = anchor;
                    return anchor;
                }
            },

            createNavList: function () {
                return $('<ul class="nav"></ul>');
            },

            createChildNavList: function ($parent) {
                var $childList = this.createNavList();
                $parent.append($childList);
                return $childList;
            },

            generateNavEl: function (anchor, text, navLevel) {
                var $a = (navLevel == 2) ? $('<a class="nav-link"></a>') : $('<a class="nav-link nav-link--shifted"></a>');
                $a.attr('href', '#' + anchor);
                $a.text(text);
                var $li = $('<li></li>');
                $li.append($a);

                $a.on('click', function (event) {
                    event.preventDefault();

                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset().top - pageOffset + 1
                    }, 500);

                    window.history.replaceState('', '', '#' + anchor);
                });

                return $li;
            },

            generateNavItem: function (headingEl, navLevel) {
                var anchor = this.generateAnchor(headingEl);
                var $heading = $(headingEl);
                var text = $heading.data('toc-text') || $heading.text();
                return this.generateNavEl(anchor, text, navLevel);
            },

            // Find the first heading level (`<h1>`, then `<h2>`, etc.) that has more than one element. Defaults to 1 (for `<h1>`).
            getTopLevel: function ($scope) {
                for (var i = 1; i <= 6; i++) {
                    var $headings = this.findOrFilter($scope, 'h' + i);
                    if ($headings.length > 0) {
                        return i;
                    }
                }

                return 1;
            },

            // returns the elements for the top level, and the next below it
            getHeadings: function ($scope, topLevel) {
                var topSelector = 'h' + topLevel;

                var secondaryLevel = topLevel + 1;
                var secondarySelector = 'h' + secondaryLevel;

                return this.findOrFilter(
                    $scope,
                    topSelector + ',' + secondarySelector
                );
            },

            getNavLevel: function (el) {
                return parseInt(el.tagName.charAt(1), 10);
            },

            populateNav: function ($topContext, topLevel, $headings) {
                var $context = $topContext;

                var helpers = this;

                $headings.each(function (i, el) {
                    var navLevel = helpers.getNavLevel(el);
                    var $newNav = helpers.generateNavItem(el, navLevel);

                    $context.append($newNav);
                });
            },

            parseOps: function (arg) {
                var opts;
                if (arg.jquery) {
                    opts = {
                        $nav: arg,
                    };
                } else {
                    opts = arg;
                }
                opts.$scope = opts.$scope || $(document.body);
                return opts;
            },
        },

        // accepts a jQuery object, or an options object
        init: function (opts) {
            opts = this.helpers.parseOps(opts);

            // ensure that the data attribute is in place for styling
            opts.$nav.attr('data-toggle', 'toc');

            var $topContext = this.helpers.createChildNavList(opts.$nav);
            var topLevel = this.helpers.getTopLevel(opts.$scope);
            var $headings = this.helpers.getHeadings(opts.$scope, topLevel);

            if ($headings.length < 2) {
                opts.$nav.closest('.toc').hide();
                return;
            } else {
                opts.$nav.closest('.toc').show();
            }

            this.helpers.populateNav($topContext, topLevel, $headings);
        },
    };

    $('nav[data-toggle="toc"]').each(function (i, el) {
        Toc.init({
            $nav: $(el),
            $scope: $('.post-content h2, .post-content h3'),
        });
    });

    let $body = $('body'),
        $window = $(window),
        $toc = $('#toc');

    $body.scrollspy({
        target: $toc,
        offset: pageOffset,
    });

    function updateOffset() {
        let cfg = $body.data('bs.scrollspy')._config;

        if (cfg.offset != pageOffset) {
            cfg.offset = pageOffset;
            $body.scrollspy('refresh');
        }
    }

    function checkHash() {
        if (location.hash) {
            let target = $(location.hash);

            $window.scrollTop(target.offset().top - pageOffset + 1);
        }
    }

    checkHash();

    $window.on('load', function () {
        $body.trigger('scroll');
    });

    $window.on('resize orientationchange', updateOffset);

    $window.on('activate.bs.scrollspy', function (e) {
        let activeLink = $toc.find('.active'),
            activeLinkHref;

        if (activeLink.length) {
            activeLinkHref = activeLink.attr('href');
            window.history.replaceState('', '', activeLinkHref);
        }
    });
}

/*var newURL = window.location.protocol + "://" + window.location.host;
$(function () {
    // Navgoco Navigation
    $('.sidebar-nav').navgoco({
        caretHtml: null,
        openClass: 'active',
        save: false,
        slide: {
            duration: 300,
            easing: 'linear',
        },
    });

    $(".search-box").on({
        click: function (e) {
            var icon = $(this).data('icon');
            var placeholder = $(this).data('placeholder');
            var search = $(this).data('search');
            $('#select-search-icon').removeClass().addClass('fa ' + icon);
            $(".search-toggle").dropdown('toggle');
            $('.main-search-input').attr("placeholder", "Search " + placeholder + " ...");
            $("#SearchType").val(search);
            return false;
        }
    }, '.search-option');

    $(".actionbar").on({
        click: function (e) {
            $("#shw_sign_lgn").show();
            return false;
        }
    }, '.nologincss');

    var tg = 0;
    $(".vdinfo").on({
        click: function (e) {
            console.log('hit');
            if (tg === 0) {
                $(".vinfoico").removeClass('fa-chevron-circle-down');
                $(".vinfoico").addClass('fa-chevron-circle-up');
                $(".vinfotxt").html("show less");
                $(".vsminfo").hide();
                $(".vfullinfo").show();
                tg = 1;
            }
            else {
                $(".vinfoico").removeClass('fa-chevron-circle-up');
                $(".vinfoico").addClass('fa-chevron-circle-down');
                $(".vinfotxt").html("show more");
                $(".vsminfo").show();
                $(".vfullinfo").hide();
                tg = 0;
            }
            return false;
        }
    }, '.vinfobtn');
});


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




var timer,
count = 1,
cycle = function (el) {
    var s = el.attr('src'),
        root = s.substring(0, s.lastIndexOf('/') + 1);
    count++;
    if (count > 10)
        count = 1;
    var fn = '00' + count;
    if (count >= 10)
        fn = '0' + count;
    el.attr('src', root + "img_" + fn + ".jpg");
};
$('.thumbpreview').hover(function () {
    var $this = $(this);
    cycle($this);
    timer = setInterval(function () { cycle($this); }, 1000);
}, function () {
    clearInterval(timer);
});

$(".videopreview").on("mouseover", function(event) {
    var preview = $(this).data('preview');
    if (preview !== undefined && preview !== null && preview !== "") {
        console.log('preview triggered');
        var id = $(this).data('id');
        var img_id = $(this).data('imgid');
        showPreview(img_id, id, preview);
    }
  }).on('mouseout', function(event) {
      var preview = $(this).data('preview');
      if (preview !== undefined && preview !== null && preview !== "") {
          console.log('preview triggered');
          var id = $(this).data('id');
          var img_id = $(this).data('imgid');
          hidePreview(img_id, id);
      }
});
function showPreview(img_id, id, preview) {
    // $("#" + id).css("display", "none");
    // $("#" + id).css("display", "block");
    $('#' + img_id).hide();
    $('#' + id).show();
    $("#" + id).attr("src", preview);
}
function hidePreview(img_id, id) {
    // $("#" + id).css("display", "none");
    // $("#" + id).css("display", "block");
    $('#' + img_id).show();
    $('#' + id).hide();
}
//* Ajax Related Operations
function Ajax_Process(path, params, id, tp) {
    $.ajax({
        type: tp,
        url: path,
        data: params,
        async: true,
        cache: true,
        success: function (msg) {
            $(id).html(msg);
        }

    });
}

function Ajax_Process_Append(path, params, id, tp) {
    $.ajax({
        type: tp,
        url: path,
        data: params,
        async: true,
        cache: true,
        success: function (msg) {
            $(id).append(msg);
        }
    });
}
function Ajax_Process_PreAppend(path, params, id, tp) {
    $.ajax({
        type: tp,
        url: path,
        data: params,
        async: true,
        cache: true,
        success: function (msg) {
            $(id).prepend(msg);
        }
    });
}
function Ajax_Process_v2(path, params, id, tp, loadingid) {
    $.ajax({
        type: tp,
        url: path,
        data: params,
        async: true,
        cache: true,
        success: function (msg) {
            $(id).html(msg);
            $('#' + loadingid).html('loading');
            ShowHide(2, '#' + loadingid);
        }
    });
}
function Ajax_Process_v3(path, params, id, tp, loadingid) {
    var message = '';
    $.ajax({
        type: tp,
        url: path,
        data: params,
        async: true,
        cache: true,
        success: function (msg) {
            ShowHide(2, '#' + loadingid);
            message = msg;
        }
    });
    return message;
}

function Process_Advice(path, params, id, actionid, actiontype) {
    //toggle_panel(1, '#shw_lgn');
    // start posting ajax
    Ajax_Process(path, params, id, "GET");
    // disable like or dislike button
    if (actiontype === 0) {
        $(actionid).removeClass("ui-adv-icon-good");
        $(actionid).removeClass("ui-adv-icon-gd_hover");
        $(actionid).addClass("ui-fixed ui-adv-icon-good");

    } else {
        $(actionid).removeClass("ui-adv-icon-bad");
        $(actionid).removeClass("ui-adv-icon-bd_hover");
        $(actionid).addClass("ui-fixed ui-adv-icon-bad");
    }
    // disable action
}


function Process_Req(path, params, id, type, loadingid) {
    Display_Message(id, "Loading...", 2, 50);
    //ShowHide(1, '#' + loadingid);
    // start posting ajax
    Ajax_Process_v2(path, params, id, type, loadingid);
}

function Process_Req_Animate(path, params, id, type, loadingid) {
    //$(id).hide("slide", { direction: "left" }, 500);
    //$(id).show("slide", { direction: "right" }, 500);
    Process_Req(path, params, id, type, loadingid);

}

function Display_Processing(id) {
    $(id).html("<div style='padding:4px 0px;'>Processing....</div>");
}


function Display_Message(id, msg, tp, width) {
    switch (tp) {
        case 0:
            $(id).html(return_message('alert-danger', msg));
            break;
        case 1:
            $(id).html(return_message('alert-success', msg));
            break;
        case 2:
            $(id).html(return_message('alert-info', msg));
            break;
    }
}
function Display_Message_Pre(id, msg, tp, width) {
    switch (tp) {
        case 0:
            $(id).prepend(return_message('alert-danger', msg));
            break;
        case 1:
            $(id).prepend(return_message('alert-success', msg));
            break;
        case 2:
            $(id).prepend(return_message('alert-info', msg));
            break;
    }
}
function return_message(cls, msg) {
    return "<div class='alert " + cls + "'><button type='button' class='close' data-dismiss='alert'>&times;</button>" + msg + "</div>"
}
function loadingmessage(id, message) {
    if (message === "")
        $("#" + id).html("");
    else
        $("#" + id).html("<span class='label label-success'>" + message + "</span>");
}

function loadingtext(id) {
    var str = "";
    str += '<div class="modal-dialog">';
    str += '<div class="modal-content">';
    str += '<div class="modal-header">';
    str += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
    str += '<h4 class="modal-title" id="actxt">Facebook Login</h4>';
    str += '</div>';
    str += '<div class="model-body">';
    str += '<div class="pd_10">';
    str += "<div class=\"item_pad_4_c\">";
    str += "<img src='..\/images\/loading\/loading7.gif\' style=\"width: 100px;   height: 100px;\" \/>";
    str += "<\/div>";
    str += '<\/div>';
    str += '<\/div>';
    str += "<\/div>";
    str += "<\/div>";

    $(id).html(str);
}
function ShowMsg(id, message, messagetype, icontype) {
    var str = "";
    var message_class = "ui-state-error";
    var icon_message = "Alert";
    var icon_class = "ui-icon-alert";
    switch (messagetype) {
        case 0:
            message_class = "ui-state-error";
            break;
        case 1:
            message_class = "ui-state-highlight";
            break;
    }
    switch (icontype) {
        case 0:
            icon_class = "ui-icon-alert";
            icon_message = "Alert:";
            break;
        case 1:
            icon_class = "ui-icon-info";
            icon_message = "Info:";
            break;
        case 2:
            icon_class = "ui-icon-check";
            icon_message = "Success:";
            break;
    }
    str += "<div class=\"item_pad_2 ui-corner-all\"><div class=\"" + message_class + " ui-corner-all\">";
    str += "<div style=\"float:left; width:85%;\">";
    str += "<p><span class=\"ui-icon " + icon_class + "\" style=\"float: left; margin-right: .3em;\"></span>";
    str += "<strong>" + icon_message + "</strong>";
    str += " " + message + "<\/p><\/div><div style=\"float:right; width:10%; text-align:right;\"><a href=\"javascript:void(0)\" onclick=\"toggle_panel(2,'#" + id + "');\">close<\/a><\/div><div class=\"clear\"><\/div>";
    str += "<\/div><\/div>";
    $('#' + id).html(str);
}

function ConvertSize(size) {
    var csize = "";
    if (size > 1000000000) {
        csize = Math.round(size / 1000000000) + "G";
    } else if (size > 1000000) {
        csize = Math.round(size / 1000000) + "M";
    }
    else if (size > 1000) {
        csize = Math.round(size / 1000) + "K";
    }
    else {
        csize = size + "B";
    }

    return csize;
}

function ProcessLK(handler, params, action, actionid, action_box) {
    $(action_box).html("loading...");
    params = params + "&act=" + action;
    Process_Advice(handler, params, action_box, actionid, action);
    $(action_box).show();
}

function ActProcess(handler, params, action_box) {
    $(action_box).html("loading...");
    Process_Req(handler, params, action_box, 'GET');
    $(action_box).show();
}

function PlstPost(handler, params, action_box) {
    var value = $("#play_list").val();
    if (value === "") {
        Display_Message("#ply_msg", "Select playlist to add video!", 1, 1);
        return;
    }
    Ajax_Process(handler, params + "&val=" + value, action_box, "POST");
    $(action_box).show();
}

function FlagP(handler, params, action_box) {
    var value = $("#abuse_list").val();
    if (value === "") {
        Display_Message("#flg_msg", "Select reason for report!", 1, 1);
        return;
    }
    Ajax_Process(handler, params + "&val=" + value, action_box, "POST");
    $(action_box).show();
}

"use strict";

// Time Process
function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
}

$(function () {
    $(".actionbar").on({
        click: function (e) {
            var path = $(this).data("path");
            var param = $(this).data("param");
            ProcessLK(path, param, 0, '.ilike', ".abox");
            return false;
        }
    }, '.likeact');
    $(".actionbar").on({
        click: function (e) {
            var path = $(this).data("path");
            var param = $(this).data("param");
            ProcessLK(path, param, 1, '.idislike', ".abox");
            return false;
        }
    }, '.dislikeact');
    $(".actionbar").on({
        click: function (e) {
            var path = $(".current-rating").data("path");
            var params = $(".current-rating").data("param");
            var value = $(this).data("value");
            ActProcess(path, params + "&act=0&val=" + value, ".abox");
            // update rating
            var total_rating = $(".current-rating").data("totalratings");
            var ratings = $(".current-rating").data("ratings");
            total_rating++;
            ratings = ratings + value;
            var avg = Math.floor(ratings / total_rating) * 24;

            $(".current-rating").css('width', avg + 'px');
            return false;
        }
    }, '.rcss');
    $(".actionbar").on({
        click: function (e) {
            var path = $(this).data("path");
            var params = $(this).data("param");
            ActProcess(path, params, ".abox");
            return false;
        }
    }, '.favact');

    $(".actionbar").on({
        click: function (e) {
            var path = $(this).data("path");
            var params = $(this).data("param");
            ActProcess(path, params, ".abox");
            return false;
        }
    }, '.flagact');

    $(".actionbar").on({
        click: function (e) {
            var path = $(this).data("path");
            var params = $(this).data("param");
            ActProcess(path, params, ".abox");
            return false;
        }
    }, '.ishare');
    $(".actionbar").on({
        click: function (e) {
            var path = $(this).data("path");
            var params = $(this).data("param");
            ActProcess(path, params, ".abox");
            return false;
        }
    }, '.iembed');
    $(".actionbar").on({
        click: function (e) {
            var path = $(this).data("path");
            var params = $(this).data("param");

            ActProcess(path, params, ".abox");
            return false;
        }
    }, '.istats');

    $(".actionbar").on({
        click: function (e) {
            var path = $(this).data("path");
            var params = $(this).data("param");
            ActProcess(path, params, ".abox");
            return false;
        }
    }, '.plyact');

    $("#vsk_action_mod").on({
        click: function (e) {
            var path = $(this).data("path");
            var params = $(this).data("param");
            PlstPost(path, params, ".abox");
            return false;
        }
    }, '.ply_sbt');

    $("#vsk_action_mod").on({
        click: function (e) {
            var path = $(this).data("path");
            var params = $(this).data("param");
            FlagP(path, params, ".abox");
            return false;
        }
    }, '.flag_sbt');
    
    $("#vsk_action_mod").on({
        click: function (e) {
            $(".abox").hide();
            $("#shw_sign_lgn").hide();
            return false;
        }
    }, '#aclose');

    $(".actionbar").on({
        click: function (e) {
            var id = $(this).data("destination");
            var msg = "Please <strong><a href='/signin'>Sign In</a> or <strong><a href='/signup'>Sign Up</a> to complete this action!";
            Display_Message('#actionbar_msg', msg, 0);
            return false;
        }
    }, '.nologincss');
});

function ShowHide(index, pnl) {
    switch (index) {
        case 1:
            $(pnl).show();
            break;
        case 2:
            $(pnl).hide();
            break;
    }
}*/