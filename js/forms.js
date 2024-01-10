'use strict';
var forms = {
    init: function () {
        forms.forms();
    },
   
    forms: () => {
        (function () {
            "use strict";
            window.addEventListener("load", function () {
                var forms = document.querySelectorAll(".needs-validation");
                var inputRecaptcha = document.querySelector("input[data-recaptcha]");
                window.verifyRecaptchaCallback = function (response) {
                    inputRecaptcha.value = response;
                    inputRecaptcha.dispatchEvent(new Event("change"));
                }
                window.expiredRecaptchaCallback = function () {
                    var inputRecaptcha = document.querySelector("input[data-recaptcha]");
                    inputRecaptcha.value = "";
                    inputRecaptcha.dispatchEvent(new Event("change"));
                }
                var validation = Array.prototype.filter.call(forms, function (form) {
                    form.addEventListener("submit", function (event) {
                        if (form.checkValidity() === false) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                        form.classList.add("was-validated");
                        if (form.checkValidity() === true) {
                            event.preventDefault();
                            form.classList.remove("was-validated");
                            var isCalculatorForm = form.classList.contains('fill_form');
                            if (isCalculatorForm) {
                                var formData = new FormData(form);
                                var _inputData = {}
                                for (var [key, value] of formData.entries()) {
                                    _inputData[key] = value;
                                }
                                //console.log('yahoo')
                                //console.log(_inputData)
                                var alertClass = 'alert-danger';

                                if (_inputData.salary === undefined || _inputData.salary === '') {
                                    _inputData.salary = 0;
                                } else {
                                    _inputData.salary = _inputData.salary.replaceAll(',', '');
                                }

                                if (!isNumeric(_inputData.salary)) {
                                    
                                    var alertBox = '<div class="alert ' + alertClass + ' alert-dismissible fade show"><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>Enter Amount in Correct Format</div>';
                                    form.querySelector(".messages").insertAdjacentHTML('beforeend', alertBox);
                                    return false;
                                }
                                

                                if (_inputData.min_salary === undefined || _inputData.min_salary === '') {
                                    _inputData.min_salary = 0;
                                } else {
                                    _inputData.min_salary = _inputData.min_salary.replaceAll(',', '');
                                }

                                if (!isNumeric(_inputData.min_salary)) {
                                 
                                    var alertBox = '<div class="alert ' + alertClass + ' alert-dismissible fade show"><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>Enter Min Amount in Correct Format</div>';
                                    form.querySelector(".messages").insertAdjacentHTML('beforeend', alertBox);
                                    return false;

                                }

                                if (_inputData.max_salary === undefined || _inputData.max_salary === '') {
                                    _inputData.max_salary = 0;
                                } else {
                                    _inputData.max_salary = _inputData.max_salary.replaceAll(',', '');
                                }

                                if (!isNumeric(_inputData.max_salary)) {
                                    var alertBox = '<div class="alert ' + alertClass + ' alert-dismissible fade show"><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>Enter Max Amount in Correct Format</div>';
                                    form.querySelector(".messages").insertAdjacentHTML('beforeend', alertBox);
                                    return false;

                                }

                                console.log(_inputData)


                              
                                $('#cal_loader').show()
                                $('#cal_form').hide()
                                $.ajax({
                                    type: "POST",
                                    url: "/api/enquiry/estimate",
                                    data: JSON.stringify(_inputData),
                                    async: true,
                                    cache: true,
                                    success: function (response) {
                                    
                                        if (response.status === 'success') {
                                            $('#cal_result').show();
                                            $('#cal_loader').hide()
                                            $('#cal_form').hide()
                                            $('#cal_result_title').html(_inputData.title)
                                            $('#cal_est_hours').html(response.estimate.hours)
                                            $('#cal_est_hours_span').html(response.estimate.hours)
                                            $('#cal_est_rate_span').html(response.estimate.rate)
                                            $('#cal_est_amount').html(response.estimate.amount)
                                            $('#cal_est_yearl_amount').html(response.estimate.yearly_amount)
                                            $('#cal_staff_agency_amount').html(response.estimate.staffing_agency)
                                            var i;
                                            for (i = 0; i < response.estimate.activity.length; ++i) {
                                                $('#cal_result_detail').append('<li>' + response.estimate.activity[i].label + ': ' + response.estimate.activity[i].amount + "</li>")
                                            }
                                            
                                            //alertClass = 'alert-success';
                                        }
                                        else {
                                            $('#cal_loader').hide()
                                            $('#cal_form').show()
                                            var alertBox = '<div class="alert ' + alertClass + ' alert-dismissible fade show"><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' + response.message + '</div>';
                                            form.querySelector(".messages").insertAdjacentHTML('beforeend', alertBox);
                                        }
                                     
                                        // form.reset();
                                    }
                                });
                            }
                            var isContactForm = form.classList.contains('contact-form');
                            if (isContactForm) {
                                var formData = new FormData(form);
                                var _inputData = {}
                                for (var [key, value] of formData.entries()) {
                                    _inputData[key] = value;
                                }
                                console.log('input data is')
                                console.log(_inputData)
                                /*var alertClass = 'alert-danger';
                                $.ajax({
                                    type: "POST",
                                    url: "/api/enquiry/contact",
                                    data: JSON.stringify(_inputData),
                                    async: true,
                                    cache: true,
                                    success: function (response) {
                                        console.log(response)

                                        if (response.status === 'success') {
                                            alertClass = 'alert-success';
                                        }

                                        var alertBox = '<div class="alert ' + alertClass + ' alert-dismissible fade show"><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' + response.message + '</div>';
                                        form.querySelector(".messages").insertAdjacentHTML('beforeend', alertBox);
                                        form.reset();
                                    }
                                });*/

                            }
                        }
                    }, false);
                });
            }, false);
        })();
    },
}

forms.init();


function isNumeric(str) {
    return /^-?\d+$/.test(str);
}