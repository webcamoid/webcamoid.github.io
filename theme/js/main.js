function copyToClipBoard(elementId)
{
    var textInput = document.getElementById(elementId);
    textInput.select();
    textInput.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(textInput.value);
}

function slidesControlClicked(event)
{
    var screenshots = document.getElementById("preview");

    if (!screenshots)
        return;

    var controls = document.getElementsByClassName("slides-control");

    for (var i = 0; i < controls.length; i++) {
        controls[i].className = controls[i].className.replace(" slides-control-selected", "");
        screenshots.children[i].className = screenshots.children[i].className.replace(" screenshot-selected", "");

        if (controls[i] == event.target) {
            controls[i].className += " slides-control-selected";
            screenshots.children[i].className += " screenshot-selected";
        }
    }
}

function advanceSlide()
{
    var screenshots = document.getElementById("preview");

    if (!screenshots)
        return;

    var controls = document.getElementsByClassName("slides-control");

    for (var i = 0; i < controls.length; i++) {
        var cur = controls[i].className.indexOf(" slides-control-selected") >= 0;
        controls[i].className = controls[i].className.replace(" slides-control-selected", "");
        screenshots.children[i].className = screenshots.children[i].className.replace(" screenshot-selected", "");

        if (cur) {
            var next = (i + 1) % controls.length;
            controls[next].className += " slides-control-selected";
            screenshots.children[next].className += " screenshot-selected";
            i++;
        }
    }
}

/* Detects the user's operating system and points the hero download
 * button at the matching package, falling back to the downloads
 * section for platforms.
 */
function setupDownloadButton()
{
    var button = document.getElementById("hero-download-button");
    var label = document.getElementById("hero-download-label");

    if (!button || !label)
        return;

    var platform = (navigator.userAgentData && navigator.userAgentData.platform)
                   || navigator.platform
                   || "";
    var ua = navigator.userAgent || "";

    var os = null;

    if (/android/i.test(ua))
        os = "android";
    else if (/win/i.test(platform) || /windows/i.test(ua))
        os = "windows";
    else if (/linux/i.test(platform) || /linux/i.test(ua))
        os = "linux";

    var href = os && button.dataset[os + "Href"];
    var text = os && button.dataset[os + "Label"];

    // MacOS, iOS and any other platform without a direct package fall
    // back to the default href/label (the downloads section).
    button.setAttribute("href", href || button.dataset.defaultHref);
    label.textContent = text || button.dataset.defaultLabel;
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

    if (controls.length > 0)
        setInterval(advanceSlide, 5000);

    setupDownloadButton();
}
