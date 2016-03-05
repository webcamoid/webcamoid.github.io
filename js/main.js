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
    console.log(event)

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
