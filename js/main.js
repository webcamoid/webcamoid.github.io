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
}
