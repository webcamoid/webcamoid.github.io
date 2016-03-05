var features = {
    "featMain": "data/cap01.png",
    "featRecord": "data/cap02.png",
    "featEffects": "data/cap03.png",
    "featDesktop": "data/cap04.png",
    "featVirtual": "data/cap05.png"
};

function showPreview()
{
    var preview = document.getElementById("preview");

    if (!preview)
        return;

    var caller = this.getAttribute("id");
    preview.src = features[caller];

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
var transitionTime = 0.1;
var steps = 25;
var threshold = 6;
var scrollTimeout = 0.5;

function scrollTo(height)
{
    var diff = window.pageYOffset - height;

    if (Math.abs(diff) <= 0) {
        stopScrolling();

        return false;
    }

    var sign = diff >= 0? -1: 1;
    window.scrollBy(0, sign * document.body.clientHeight / steps);
    setTimeout(scrollTo, 1000 * transitionTime / steps, height);

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

function keyPressHandler(event)
{
    switch (event.keyCode) {
        case 38: // go up
            scrollTo(0);

            break;
        case 40: // go down
            var downloadsPage = document.getElementById("downloads");
            scrollTo(downloadsPage.scrollHeight);

            break;
        default:
            break;
    }

    event.returnValue = false;

    if (event.preventDefault)
        event.preventDefault();

    return false;
}

function main()
{
    var ssfound = false;

    for (var ss in document.styleSheets)
        if (document.styleSheets[ss].href
            && document.styleSheets[ss].href.indexOf("stylesheets/stylesheet.css") >= 0) {
            ssfound = true;

            break;
        }

    if (!ssfound)
        return;

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

    if (document.addEventListener) {
        document.addEventListener("mousewheel", scrollHandler, false);
        document.addEventListener("DOMMouseScroll", scrollHandler, false);
    } else if (document.attachEvent) {
        document.attachEvent("mousewheel", scrollHandler);
        document.attachEvent("DOMMouseScroll", scrollHandler);
    } else {
        document.attachEvent("onmousewheel", scrollHandler);
    }

    document.addEventListener("keypress", keyPressHandler, false);
    document.body.className = "hiddenscrollbars";
}
