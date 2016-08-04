function slidesControlClicked(event)
{
    var screenshots = document.getElementById("preview");
    var features = document.getElementById("feature-list");
    var controls = document.getElementsByClassName("slides-control");

    for (var i = 0; i < controls.length; i++) {
        controls[i].className = controls[i].className.replace(" slides-control-selected", "");
        screenshots.children[i + 1].style.display = "none";
        features.children[i].style.display = "none";

        if (controls[i] == event.target) {
            controls[i].className += " slides-control-selected";
            screenshots.children[i + 1].style.display = "initial";
            features.children[i].style.display = "initial";
        }
    }
}

function advanceSlide()
{
    var screenshots = document.getElementById("preview");
    var features = document.getElementById("feature-list");
    var controls = document.getElementsByClassName("slides-control");

    for (var i = 0; i < controls.length; i++) {
        var cur = controls[i].className.indexOf(" slides-control-selected") >= 0;
        controls[i].className = controls[i].className.replace(" slides-control-selected", "");
        screenshots.children[i + 1].style.display = "none";
        features.children[i].style.display = "none";

        if (cur) {
            var next = (i + 1) % controls.length;
            controls[next].className += " slides-control-selected";
            screenshots.children[next + 1].style.display = "initial";
            features.children[next].style.display = "initial";
            i++;
        }
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

    var controls = document.getElementsByClassName("slides-control");

    for (var i = 0; i < controls.length; i++)
        controls[i].addEventListener("click", slidesControlClicked);

    setInterval(advanceSlide, 5000);
}
