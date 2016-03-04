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
var transitionTime = 0.2;
var steps = 50;
var threshold = 6;
var scrollTimeout = 500;

function scrollToMain()
{
    if (window.pageYOffset <= 0)
        return false;

    window.scrollBy(0, -document.body.clientHeight / steps);
    setTimeout(scrollToMain, 1000 * transitionTime / steps);

    return false;
}

function scrollToDownloads()
{
    var downloadsPage = document.getElementById("downloads");

    if (window.pageYOffset >= downloadsPage.scrollHeight)
        return false;

    window.scrollBy(0, document.body.clientHeight / steps);
    setTimeout(scrollToDownloads, 1000 * transitionTime / steps);

    return false;
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

    if (!scrolling) {
        if (scroll > threshold && delta > 0) {
            scrolling = true;
            scrollToDownloads();
        } else if (scroll < -threshold && delta < 0) {
            scrolling = true;
            scrollToMain();
        }
    }

    setTimeout(function() {
        scroll = 0;
        scrolling = false;
    }, scrollTimeout);

    event.returnValue = false;

    if (event.preventDefault)
        event.preventDefault();

    return false;
}

function main()
{
    for (feature in features) {
        var feat = document.getElementById(feature);

        if (!feat)
            continue;

        if (feature == "featMain")
            feat.className += " feature-selected";

        feat.addEventListener("click", showPreview);
    }

    var downloadButton = document.getElementById("downloadbutton");
    downloadButton.onclick = scrollToDownloads;

    if (document.addEventListener) {
        document.addEventListener("mousewheel", scrollHandler, false);
        document.addEventListener("DOMMouseScroll", scrollHandler, false);
    } else if (document.attachEvent) {
        document.attachEvent("mousewheel", scrollHandler);
        document.attachEvent("DOMMouseScroll", scrollHandler);
    } else {
        document.attachEvent("onmousewheel", scrollHandler);
    }

    document.body.className = "hiddenscrollbars";
}
