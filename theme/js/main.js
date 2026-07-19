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

/* Detects the user's operating system from the browser. Returns
   "windows", "linux", "android" or null (unknown / unsupported,
   e.g. macOS, iOS). Shared by the hero download button and every
   platform selector in the downloads section. */
function detectOS()
{
    var platform = (navigator.userAgentData && navigator.userAgentData.platform)
                   || navigator.platform
                   || "";
    var ua = navigator.userAgent || "";

    if (/android/i.test(ua))
        return "android";

    if (/win/i.test(platform) || /windows/i.test(ua))
        return "windows";

    if (/linux/i.test(platform) || /linux/i.test(ua))
        return "linux";

    return null;
}

/* Points the hero download button at the matching package for the
   detected OS, falling back to the downloads section for platforms
   without a direct one-click download. */
function setupDownloadButton()
{
    var button = document.getElementById("hero-download-button");
    var label = document.getElementById("hero-download-label");

    if (!button || !label)
        return;

    var os = detectOS();
    var option = os && document.querySelector('#app-download-card [role=option][data-os="' + os + '"]');

    button.setAttribute("href", option ? option.dataset.href : button.dataset.defaultHref);
    label.textContent = option ? "Download for " + option.dataset.label : button.dataset.defaultLabel;
}

/* Sets up every custom platform selector in the downloads section
   (".download-card"): opening/closing the option list, picking an
   option (which updates the trigger icon/label and the card's
   download button href), closing on outside click / Escape, and
   preselecting the option that matches the visitor's detected OS.
   All URLs/labels/icons live only in index.html as data-* attributes
   and markup on each <li role="option">. */
function initPlatformSelects()
{
    var cards = document.getElementsByClassName("download-card");
    var detectedOS = detectOS();

    for (var c = 0; c < cards.length; c++) {
        var card = cards[c];
        var select = card.querySelector(".platform-select");

        if (!select)
            continue;

        var trigger = select.querySelector(".platform-select-trigger");
        var list = select.querySelector(".platform-select-list");
        var iconSlot = trigger.querySelector(".platform-select-icon");
        var labelSlot = trigger.querySelector(".platform-select-label");
        var options = select.querySelectorAll("[role=option]");
        var button = card.querySelector(".download-card-button");

        (function (select, trigger, list, iconSlot, labelSlot, options, button) {
            function selectOption(option)
            {
                iconSlot.innerHTML = option.querySelector("svg").outerHTML;
                labelSlot.textContent = option.dataset.label;

                if (button)
                    button.setAttribute("href", option.dataset.href);

                for (var i = 0; i < options.length; i++)
                    options[i].setAttribute("aria-selected", options[i] == option ? "true" : "false");
            }

            function closeList()
            {
                list.hidden = true;
                trigger.setAttribute("aria-expanded", "false");
            }

            function openList()
            {
                list.hidden = false;
                trigger.setAttribute("aria-expanded", "true");
            }

            trigger.addEventListener("click", function (event) {
                event.stopPropagation();

                if (list.hidden)
                    openList();
                else
                    closeList();
            });

            for (var i = 0; i < options.length; i++) {
                options[i].addEventListener("click", function () {
                    selectOption(this);
                    closeList();
                    trigger.focus();
                });
            }

            select.addEventListener("keydown", function (event) {
                if (event.key === "Escape") {
                    closeList();
                    trigger.focus();
                }
            });

            document.addEventListener("click", function (event) {
                if (!select.contains(event.target))
                    closeList();
            });

            // Preselect the option matching the visitor's OS. If none
            // matches (e.g. macOS, iOS), fall back to the first option
            // so the button href always matches what's shown selected.
            var matched = null;

            for (var i = 0; i < options.length; i++) {
                if (options[i].dataset.os === detectedOS) {
                    matched = options[i];

                    break;
                }
            }

            selectOption(matched || options[0]);
        })(select, trigger, list, iconSlot, labelSlot, options, button);
    }
}

/* Toggles the "More downloads and options" panel in the downloads
   section. */
function initDownloadsMoreToggle()
{
    var toggle = document.querySelector(".downloads-more-toggle");

    if (!toggle)
        return;

    var panel = document.querySelector(".downloads-more-options");

    toggle.addEventListener("click", function () {
        var expanded = toggle.getAttribute("aria-expanded") === "true";

        toggle.setAttribute("aria-expanded", expanded ? "false" : "true");
        panel.hidden = expanded;
    });
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
    initPlatformSelects();
    initDownloadsMoreToggle();
}
