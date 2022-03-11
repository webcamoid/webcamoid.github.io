function copyToClipBoard(elementId)
{
    var textInput = document.getElementById(elementId);
    textInput.select();
    textInput.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(textInput.value);
}

function maxRatio()
{
    var screenshots = document.getElementById("preview");

    if (!screenshots)
        return 0;

    var rmax = 0;

    for (var i = 1; i < screenshots.children.length; i++) {
        var r = screenshots.children[i].height / screenshots.children[i].width;

        if (r > rmax)
            rmax = r;
    }

    return rmax;
}

function slidesControlClicked(event)
{
    var screenshots = document.getElementById("preview");

    if (!screenshots)
        return;

    var features = document.getElementById("feature-list");
    var controls = document.getElementsByClassName("slides-control");

    for (var i = 0; i < controls.length; i++) {
        controls[i].className = controls[i].className.replace(" slides-control-selected", "");
        screenshots.children[i + 1].className = screenshots.children[i + 1].className.replace(" screenshot-selected", "");
        features.children[i].style.display = "none";

        if (controls[i] == event.target) {
            controls[i].className += " slides-control-selected";
            screenshots.children[i + 1].className += " screenshot-selected";
            features.children[i].style.display = "list-item";
        }
    }
}

function advanceSlide()
{
    var screenshots = document.getElementById("preview");

    if (!screenshots)
        return;

    var features = document.getElementById("feature-list");
    var controls = document.getElementsByClassName("slides-control");

    for (var i = 0; i < controls.length; i++) {
        var cur = controls[i].className.indexOf(" slides-control-selected") >= 0;
        controls[i].className = controls[i].className.replace(" slides-control-selected", "");
        screenshots.children[i + 1].className = screenshots.children[i + 1].className.replace(" screenshot-selected", "");
        features.children[i].style.display = "none";

        if (cur) {
            var next = (i + 1) % controls.length;
            controls[next].className += " slides-control-selected";
            screenshots.children[next + 1].className += " screenshot-selected";
            features.children[next].style.display = "list-item";
            i++;
        }
    }
}

var ratio = 0.75;

function resizeHandler(event)
{
    var showcase = document.getElementById("showcase");
    var width = document.body.clientWidth;
    var height = document.body.clientHeight;

    var preview = document.getElementById("preview");

    if (!preview)
        return;

    if (ratio * width < 480)
        preview.style.height = showcase.style.height = ratio * width + "px";
    else
        preview.style.height = showcase.style.height = "auto";
}

function main()
{
    var ssfound = false;

    for (var ss in document.styleSheets)
        if (document.styleSheets[ss].href
            && document.styleSheets[ss].href.indexOf("theme/css/main.css") >= 0) {
            ssfound = true;

            break;
        }

    if (!ssfound)
        return;

    var controls = document.getElementsByClassName("slides-control");

    for (var i = 0; i < controls.length; i++)
        controls[i].addEventListener("click", slidesControlClicked);

    setInterval(advanceSlide, 5000);
    window.addEventListener("resize", resizeHandler, false);
    ratio = maxRatio();
    resizeHandler(null);
}
