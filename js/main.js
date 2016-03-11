var features = {
    "featMain": ["data/cap01.png", "Device selection showing the available webcam controls"],
    "featRecord": ["data/cap02.png", "Support for all possible video formats and codecs"],
    "featEffects": ["data/cap03.png", "Applying effects in real-time to a video"],
    "featDesktop": ["data/cap04.png", "Desktop capture"],
    "featVirtual": ["data/cap05.png", "Virtual camera support"]
};

function showPreview()
{
    var preview = document.getElementById("preview");

    if (!preview)
        return;

    var caller = this.getAttribute("id");
    preview.src = features[caller][0];
    preview.alt = preview.title = features[caller][1];

    for (feature in features) {
        var feat = document.getElementById(feature);

        if (!feat)
            continue;

        if (feature == caller)
            feat.className += " feature-selected";
        else
            feat.className = feat.className.replace(" feature-selected", "");
    }

    return false;
}

var scroll = 0;
var scrolling = false;
var transitionTime = 0.3;
var steps = 25;
var threshold = 6;
var scrollTimeout = 0.5;

function scrollTo(height)
{
    var diff = Math.abs(window.pageYOffset - height);

    if (diff <= 0) {
        scrolling = false;

        return false;
    }

    var sign = window.pageYOffset >= height? -1: 1;
    var k = Math.min(diff, Math.round(document.body.clientHeight / steps));

    if (window.scrollBy)
        window.scrollBy(0, sign * k);
    else
        window.scrollTop += sign * k;

    setTimeout(scrollTo, 1000 * transitionTime / steps, height);

    return false;
}

function scrollListTo(featureList, offset)
{
    var diff = Math.abs(featureList.scrollTop - offset[1]);

    if (diff <= 0) {
        scrolling = false;
        var preview = document.getElementById("preview");

        if (!preview)
            return false;

        var caller = offset[0];
        preview.src = features[caller][0];
        preview.alt = preview.title = features[caller][1];

        for (feature in features) {
            var feat = document.getElementById(feature);

            if (!feat)
                continue;

            if (feature == caller)
                feat.className += " feature-selected";
            else
                feat.className = feat.className.replace(" feature-selected", "");
        }

        return false;
    }

    var sign = featureList.scrollTop >= offset[1]? -1: 1;
    var k = Math.min(diff, Math.round(featureList.clientHeight / steps));

    if (featureList.scrollBy)
        featureList.scrollBy(0, sign * k);
    else
        featureList.scrollTop += sign * k;

    setTimeout(scrollListTo, 1000 * transitionTime / steps, featureList, offset);

    return false;
}

/* Mouse scroll handlers */

function scrollHandler(event)
{
    if (!scrolling) {
        event = window.event || event;
        var delta = event.detail? event.detail: event.wheelDelta;

        if ((scroll > 0 && delta < 0)
            || (scroll < 0 && delta > 0)) {
            scroll = 0;
        }

        scroll += delta;

        if (Math.abs(scroll) >= threshold) {
            scrolling = true;
            scroll = 0;

            if (delta > 0) {
                var downloadsPage = document.getElementById("downloads");
                scrollTo(downloadsPage.scrollHeight);
            } else if (delta < 0) {
                scrollTo(0);
            }
        } else {
            setTimeout(function() { scroll = 0; }, 1000 * scrollTimeout);
        }
    }

    event.returnValue = false;

    if (event.preventDefault)
        event.preventDefault();

    return false;
}

function nearestOffset(featureList, offset)
{
    var diff = Number.MAX_VALUE;
    var offsetY = 0;
    var child = "";

    for (var children in featureList.children) {
        var offsetTop = featureList.children[children].offsetTop;
        var d = Math.abs(offsetTop - offset);

        if (d < diff) {
            diff = d;
            offsetY = offsetTop;
            child = featureList.children[children].children[0].id;
        }
    }

    return [child, offsetY];
}

function listScrollHandler(event)
{
    if (!scrolling) {
        event = window.event || event;
        var delta = event.detail? event.detail: event.wheelDelta;

        if ((scroll > 0 && delta < 0)
            || (scroll < 0 && delta > 0)) {
            scroll = 0;
        }

        scroll += delta;

        if (Math.abs(scroll) >= threshold) {
            scrolling = true;
            scroll = 0;
            var featureList = document.getElementById("featurelist");
            var diff = featureList.children[0].clientHeight;

            if (delta != 0) {
                var offset = featureList.scrollTop + diff * (delta > 0? 1: -1);
                scrollListTo(featureList, nearestOffset(featureList, offset));
            }
        } else {
            setTimeout(function() { scroll = 0; }, 1000 * scrollTimeout);
        }
    }

    event.returnValue = false;

    if (event.preventDefault)
        event.preventDefault();

    return false;
}

function downloadsScrollHandler(event)
{
    if (!scrolling) {
        event = window.event || event;
        var delta = event.detail? event.detail: event.wheelDelta;

        if ((scroll > 0 && delta < 0)
            || (scroll < 0 && delta > 0)) {
            scroll = 0;
        }

        scroll += delta;

        if (Math.abs(scroll) >= threshold) {
            scrolling = true;
            scroll = 0;

            if (delta < 0)
                scrollTo(0);
        } else {
            setTimeout(function() { scroll = 0; }, 1000 * scrollTimeout);
        }
    }

    event.returnValue = false;

    if (event.preventDefault)
        event.preventDefault();

    return false;
}

/* Touch scroll handlers */

var touchStartX = 0;
var touchStartY = 0;
var touchTime0 = 0;
var touchSpeedThreshold = 0.5;

function touchScrollHandler(event)
{
    switch (event.type)
    {
        case "touchstart":
            var element = event.changedTouches[0];
            touchStartX = element.pageX;
            touchStartY = element.pageY;
            touchTime0 = new Date().getTime();

            break;
        case "touchmove":
            break;
        case "touchend":
            var element = event.changedTouches[0];
            var speedX = (element.pageX - touchStartX) / (new Date().getTime() - touchTime0);
            var speedY = (element.pageY - touchStartY) / (new Date().getTime() - touchTime0);

            if (Math.abs(speedY) >= touchSpeedThreshold) {
                scrolling = true;

                if (speedY > 0) {
                    scrollTo(0);
                } else if (speedY < 0) {
                    var downloadsPage = document.getElementById("downloads");
                    scrollTo(downloadsPage.scrollHeight);
                }
            }

            break;
        default:
            break;
    }

    event.returnValue = false;

    if (event.preventDefault)
        event.preventDefault();

    return false;
}

function listTouchScrollHandler(event)
{
    switch (event.type)
    {
        case "touchstart":
            var element = event.changedTouches[0];
            touchStartX = element.pageX;
            touchStartY = element.pageY;
            touchTime0 = new Date().getTime();

            break;
        case "touchmove":
            break;
        case "touchend":
            var element = event.changedTouches[0];
            var speedX = (element.pageX - touchStartX) / (new Date().getTime() - touchTime0);
            var speedY = (element.pageY - touchStartY) / (new Date().getTime() - touchTime0);

            if (Math.abs(speedY) >= touchSpeedThreshold) {
                scrolling = true;
                var featureList = document.getElementById("featurelist");
                var diff = featureList.children[0].clientHeight;

                if (speedY != 0) {
                    var offset = featureList.scrollTop + diff * (speedY < 0? 1: -1);
                    scrollListTo(featureList, nearestOffset(featureList, offset));
                }
            }

            break;
        default:
            break;
    }

    event.returnValue = false;

    if (event.preventDefault)
        event.preventDefault();

    return false;
}

function downloadsTouchScrollHandler(event)
{
    switch (event.type)
    {
        case "touchstart":
            var element = event.changedTouches[0];
            touchStartX = element.pageX;
            touchStartY = element.pageY;
            touchTime0 = new Date().getTime();

            break;
        case "touchmove":
            break;
        case "touchend":
            var element = event.changedTouches[0];
            var speedX = (element.pageX - touchStartX) / (new Date().getTime() - touchTime0);
            var speedY = (element.pageY - touchStartY) / (new Date().getTime() - touchTime0);

            if (Math.abs(speedY) >= touchSpeedThreshold) {
                scrolling = true;

                if (speedY > 0)
                    scrollTo(0);
            }

            break;
        default:
            break;
    }

    event.returnValue = false;

    if (event.preventDefault)
        event.preventDefault();

    return false;
}

/* Key press handlers */

keycodes = {
    "0,9": "Tab",
    "0,33": "PageUp",
    "0,34": "PageDown",
    "0,37": "ArrowLeft",
    "0,38": "ArrowUp",
    "0,39": "ArrowRight",
    "0,40": "ArrowDown",
    "32,0": " ",
    "32,32": " "
};

function keyPressHandler(event)
{
    var key = keycodes[event.charCode + "," + event.keyCode];

    switch (key) {
        case "PageUp":
        case "ArrowLeft":
        case "ArrowUp":
            // go up
            if (!scrolling) {
                scrolling = true;
                scroll = 0;
                scrollTo(0);
            }

            event.returnValue = false;

            if (event.preventDefault)
                event.preventDefault();

            return false;
        case " ":
        case "PageDown":
        case "ArrowRight":
        case "ArrowDown":
            // go down
            if (!scrolling) {
                scrolling = true;
                scroll = 0;
                var downloadsPage = document.getElementById("downloads");
                scrollTo(downloadsPage.scrollHeight);
            }

            event.returnValue = false;

            if (event.preventDefault)
                event.preventDefault();

            return false;
        case "Tab":
            event.returnValue = false;

            if (event.preventDefault)
                event.preventDefault();

            return false;
        default:
            break;
    }

    return true;
}

function mobileToggled(isMobile)
{
    if (isMobile) {
        listenForScroll(document.getElementById("downloads"), downloadsScrollHandler);
        listenForScroll(document.getElementById("featurelist"), listScrollHandler);
        listenForTouchScroll(document.getElementById("downloads"), downloadsTouchScrollHandler);
        listenForTouchScroll(document.getElementById("featurelist"), listTouchScrollHandler);
        unlistenForScroll(document, scrollHandler);
        unlistenForTouchScroll(document, touchScrollHandler);
    } else {
        listenForScroll(document, scrollHandler);
        listenForTouchScroll(document, touchScrollHandler);
        unlistenForScroll(document.getElementById("downloads"), downloadsScrollHandler);
        unlistenForScroll(document.getElementById("featurelist"), listScrollHandler);
        unlistenForTouchScroll(document.getElementById("downloads"), downloadsTouchScrollHandler);
        unlistenForTouchScroll(document.getElementById("featurelist"), listTouchScrollHandler);
    }
}

var ppmm = [0, 0];

function testResolution()
{
    var div = document.createElement("div");
    div.style.overflow = "hidden";
    div.style.visibility = "hidden";
    div.style.width = "1in";
    div.style.height = "1in";
    document.body.appendChild(div);
    var resolution = [div.offsetWidth / 25.4, div.offsetHeight / 25.4];
    document.body.removeChild(div);

    return resolution;
}

var isMobile = false;

function checkMobile()
{
    return document.body.clientWidth < 200 * ppmm[0]
        || document.body.clientHeight < 120 * ppmm[1];
}

function resizeHandler(event)
{
    if (checkMobile() != isMobile) {
        isMobile = !isMobile;
        mobileToggled(isMobile);
    }
}

function listenForScroll(element, handler)
{
    if (element.addEventListener) {
        element.addEventListener("mousewheel", handler, false);
        element.addEventListener("DOMMouseScroll", handler, false);
    } else if (document.attachEvent) {
        element.attachEvent("mousewheel", handler);
        element.attachEvent("DOMMouseScroll", handler);
    } else {
        element.attachEvent("onmousewheel", handler);
    }
}

function unlistenForScroll(element, handler)
{
    if (element.removeEventListener) {
        element.removeEventListener("mousewheel", handler);
        element.removeEventListener("DOMMouseScroll", handler);
    } else if (document.detachEvent) {
        element.detachEvent("mousewheel", handler);
        element.detachEvent("DOMMouseScroll", handler);
    } else {
        element.detachEvent("onmousewheel", handler);
    }
}

function listenForTouchScroll(element, handler)
{
    if (element.addEventListener) {
        element.addEventListener("touchstart", handler, false);
        element.addEventListener("touchmove", handler, false);
        element.addEventListener("touchend", handler, false);
    } else if (document.attachEvent) {
        element.attachEvent("touchstart", handler, false);
        element.attachEvent("touchmove", handler, false);
        element.attachEvent("touchend", handler, false);
    }
}

function unlistenForTouchScroll(element, handler)
{
    if (element.addEventListener) {
        element.removeEventListener("touchstart", handler, false);
        element.removeEventListener("touchmove", handler, false);
        element.removeEventListener("touchend", handler, false);
    } else if (document.attachEvent) {
        element.detachEvent("touchstart", handler);
        element.detachEvent("touchmove", handler);
        element.detachEvent("touchend", handler);
    }
}

function main()
{
    var ssfound = false;

    for (var ss in document.styleSheets)
        if (document.styleSheets[ss].href
            && document.styleSheets[ss].href.indexOf("stylesheets/desktop.css") >= 0) {
            ssfound = true;

            break;
        }

    if (!ssfound)
        return;

    ppmm = testResolution();
    isMobile = checkMobile();
    mobileToggled(isMobile);

    for (feature in features) {
        var feat = document.getElementById(feature);

        if (!feat)
            continue;

        if (feature == "featMain")
            feat.className += " feature-selected";

        feat.addEventListener("click", showPreview);
    }

    var downloadButton = document.getElementById("downloadbutton");
    downloadButton.onclick = function () {
        if (!scrolling) {
            scrolling = true;
            scroll = 0;
            var downloadsPage = document.getElementById("downloads");
            scrollTo(downloadsPage.scrollHeight);
        }

        return false;
    };

    document.addEventListener("keypress", keyPressHandler, false);
    document.addEventListener("keydown", keyPressHandler, false);
    document.body.className = "hiddenscrollbars";
    window.addEventListener("resize", resizeHandler, false);
}
