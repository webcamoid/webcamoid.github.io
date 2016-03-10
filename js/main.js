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
        stopScrolling();

        return false;
    }

    var sign = window.pageYOffset >= height? -1: 1;
    var k = Math.min(diff, Math.round(document.body.clientHeight / steps));
    window.scrollBy(0, sign * k);
    setTimeout(scrollTo, 1000 * transitionTime / steps, height);

    return false;
}

function scrollListTo(featureList, height)
{
    var diff = Math.abs(featureList.scrollTop - height);

    if (diff <= 0) {
        stopScrolling();

        return false;
    }

    var sign = featureList.scrollTop >= height? -1: 1;
    var k = Math.min(diff, Math.round(featureList.clientHeight / steps));
    featureList.scrollBy(0, sign * k);
    setTimeout(scrollListTo, 1000 * transitionTime / steps, featureList, height);

    return false;
}

function stopScrolling()
{
    scroll = 0;
    scrolling = false;
}

function scrollHandler(event)
{
    event = window.event || event;
    var delta = event.detail? event.detail: event.wheelDelta;

    if ((scroll > 0 && delta < 0)
        || (scroll < 0 && delta > 0)) {
        scroll = 0;
    }

    scroll += delta;

    if (!scrolling
        && Math.abs(scroll) >= threshold) {
        scrolling = true;

        if (delta > 0) {
            var downloadsPage = document.getElementById("downloads");
            scrollTo(downloadsPage.scrollHeight);
        } else if (delta < 0) {
            scrollTo(0);
        }
    }

    if (!scrolling)
        setTimeout(stopScrolling, 1000 * scrollTimeout);

    event.returnValue = false;

    if (event.preventDefault)
        event.preventDefault();

    return false;
}

function nearestOffset(featureList, offset)
{
    var diff = Number.MAX_VALUE;
    var offsetY = 0;

    for (var children in featureList.children) {
        var offsetTop = featureList.children[children].offsetTop;
        var d = Math.abs(offsetTop - offset);

        if (d < diff) {
            diff = d;
            offsetY = offsetTop;
        }
    }

    return offsetY;
}

function listScrollHandler(event)
{
    event = window.event || event;
    var delta = event.detail? event.detail: event.wheelDelta;

    if ((scroll > 0 && delta < 0)
        || (scroll < 0 && delta > 0)) {
        scroll = 0;
    }

    scroll += delta;

    if (!scrolling
        && Math.abs(scroll) >= threshold) {
        scrolling = true;
        var featureList = document.getElementById("featurelist");
        var diff = featureList.children[0].clientHeight;

        if (delta != 0) {
            var offset = featureList.scrollTop + diff * (delta > 0? 1: -1);
            scrollListTo(featureList, nearestOffset(featureList, offset));
        }
    }

    if (!scrolling)
        setTimeout(stopScrolling, 1000 * scrollTimeout);

    event.returnValue = false;

    if (event.preventDefault)
        event.preventDefault();

    return false;
}

function downloadsScrollHandler(event)
{
    event = window.event || event;
    var delta = event.detail? event.detail: event.wheelDelta;

    if ((scroll > 0 && delta < 0)
        || (scroll < 0 && delta > 0)) {
        scroll = 0;
    }

    scroll += delta;

    if (!scrolling
        && Math.abs(scroll) >= threshold) {
        scrolling = true;

        if (delta < 0)
            scrollTo(0);
    }

    if (!scrolling)
        setTimeout(stopScrolling, 1000 * scrollTimeout);

    event.returnValue = false;

    if (event.preventDefault)
        event.preventDefault();

    return false;
}

keycodes = {
    "0,9": "Tab",
    "0,33": "PageUp",
    "0,34": "PageDown",
    "0,37": "ArrowLeft",
    "0,38": "ArrowUp",
    "0,39": "ArrowRight",
    "0,40": "ArrowDown",
    "32,0": " "
};

function keyPressHandler(event)
{
    var key = keycodes[event.charCode + "," + event.keyCode];

    switch (key) {
        case "PageUp":
        case "ArrowLeft":
        case "ArrowUp":
            // go up
            scrollTo(0);
            event.returnValue = false;

            if (event.preventDefault)
                event.preventDefault();

            return false;
        case " ":
        case "PageDown":
        case "ArrowRight":
        case "ArrowDown":
            // go down
            var downloadsPage = document.getElementById("downloads");
            scrollTo(downloadsPage.scrollHeight);
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
        unlistenForScroll(document, scrollHandler);
    } else {
        listenForScroll(document, scrollHandler);
        unlistenForScroll(document.getElementById("downloads"), downloadsScrollHandler);
        unlistenForScroll(document.getElementById("featurelist"), listScrollHandler);
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
    return document.body.clientWidth < 200 * ppmm[0];
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
         var downloadsPage = document.getElementById("downloads");
         scrollTo(downloadsPage.scrollHeight);

        return false;
    };

    document.addEventListener("keypress", keyPressHandler, false);
    document.body.className = "hiddenscrollbars";
    window.addEventListener("resize", resizeHandler, false);
}
