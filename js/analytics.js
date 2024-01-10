function proc_analytics(companyid, listingid, referrer, ipaddress) {
    if (!isBot()) {
        var browser_info = prepareResponse();
        var obj = {
            ipaddress: ipaddress,
            companyid: companyid,
            listingid: listingid,
            referrer: referrer,
            browser: browser_info.browserName,
            os: browser_info.osName
        };
        if (obj.ipaddress === '::1') {
            obj.ipaddress = "39.40.66.3";
        }
        //console.log('object is');
        //console.log(obj);
        // analytics
        $.ajax({
            url: "/api/analytics/proc",
            type: "post",
            data: JSON.stringify(obj),
            success: function (response) {
                console.log(response);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });
    }
}


function isBot() {
    if (/bot|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex/i
        .test(navigator.userAgent)) {
        console.log('its a bot');
        return true;
    } else {
        console.log('its not a bot');
        return false;
    }
}

function prepareResponse() {
    var obj = {
        browserName: 'Unknown',
        osName: "Unknown"
    };
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browserName = navigator.appName;
    var fullVersion = '' + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

    // In Opera, the true version is after "Opera" or after "Version"
    if ((verOffset = nAgt.indexOf("Opera")) != -1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
        browserName = "Microsoft Internet Explorer";
        fullVersion = nAgt.substring(verOffset + 5);
    }
    // In Chrome, the true version is after "Chrome"
    else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
        browserName = "Chrome";
        fullVersion = nAgt.substring(verOffset + 7);
    }
    // In Safari, the true version is after "Safari" or after "Version"
    else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
        browserName = "Safari";
        fullVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
    // In Firefox, the true version is after "Firefox"
    else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
        browserName = "Firefox";
        fullVersion = nAgt.substring(verOffset + 8);
    }
    // In most other browsers, "name/version" is at the end of userAgent
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
        (verOffset = nAgt.lastIndexOf('/'))) {
        browserName = nAgt.substring(nameOffset, verOffset);
        fullVersion = nAgt.substring(verOffset + 1);
        if (browserName.toLowerCase() == browserName.toUpperCase()) {
            browserName = navigator.appName;
        }
    }
    // trim the fullVersion string at semicolon/space if present
    if ((ix = fullVersion.indexOf(";")) != -1)
        fullVersion = fullVersion.substring(0, ix);
    if ((ix = fullVersion.indexOf(" ")) != -1)
        fullVersion = fullVersion.substring(0, ix);

    majorVersion = parseInt('' + fullVersion, 10);
    if (isNaN(majorVersion)) {
        fullVersion = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
    }

    obj.browserName = browserName;
    var os = getMobileOperatingSystem();
    if (os === 'unknown') {
        if (navigator.appVersion.indexOf("Win") != -1) obj.osName = "Windows";
        if (navigator.appVersion.indexOf("Mac") != -1) obj.osName = "MacOS";
        if (navigator.appVersion.indexOf("X11") != -1) obj.osName = "UNIX";
        if (navigator.appVersion.indexOf("Linux") != -1) obj.osName = "Linux";
    } else {
        obj.osName = os;
    }

    return obj;
    /* document.write(''
      +'Browser name  = '+browserName+'<br>'
      +'Full version  = '+fullVersion+'<br>'
      +'Major version = '+majorVersion+'<br>'
      +'navigator.appName = '+navigator.appName+'<br>'
      +'navigator.userAgent = '+navigator.userAgent+'<br>'
     )*/
}

function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "unknown";
}