(function () {
    "use strict";

    function createTag(label, className)
    {
        var tag = document.createElement("span");
        tag.className = "effect-tag" + (className ? " " + className : "");
        tag.textContent = label;

        return tag;
    }

    function createEffectCard(effect)
    {
        var article = document.createElement("article");
        article.className = "effect-card";
        article.id = "effect-" + effect.id;

        var link = document.createElement("a");
        link.className = "effect-card-link";
        link.href = "/effects/#effect-" + encodeURIComponent(effect.id);
        link.setAttribute("aria-label", effect.description);

        var imageBox = document.createElement("div");
        imageBox.className = "effect-card-image";

        var img = document.createElement("img");
        img.src = effect.image;
        img.alt = effect.description;
        img.loading = "lazy";
        img.addEventListener("error", function () {
            img.remove();
            var placeholder = document.createElement("div");
            placeholder.className = "effect-image-placeholder";
            placeholder.textContent = "Screenshot coming soon";
            imageBox.appendChild(placeholder);
        }, {once: true});
        imageBox.appendChild(img);

        var content = document.createElement("div");
        content.className = "effect-card-content";

        var title = document.createElement("h2");
        title.className = "effect-card-title";
        title.textContent = effect.description;
        content.appendChild(title);

        var tags = document.createElement("div");
        tags.className = "effect-card-tags";
        tags.appendChild(createTag(effect.category === "basic" ? "Basic" : "Extra plugin",
                                   effect.category === "extra" ? "effect-tag-premium" : ""));

        if (effect.stable_9_4_0)
            tags.appendChild(createTag("Stable 9.4.0", ""));
        else
            tags.appendChild(createTag("Development build", "effect-tag-development"));

        content.appendChild(tags);
        link.appendChild(imageBox);
        link.appendChild(content);
        article.appendChild(link);

        return article;
    }

    function renderEffects(container, effects, limit)
    {
        container.textContent = "";
        var selected = effects.slice(0, limit || effects.length);

        if (!selected.length) {
            var empty = document.createElement("p");
            empty.className = "effects-message";
            empty.textContent = "No effects match this filter.";
            container.appendChild(empty);
            return;
        }

        selected.forEach(function (effect) {
            container.appendChild(createEffectCard(effect));
        });
    }

    function loadEffects()
    {
        var catalogue = document.getElementById("effects-grid");
        var preview = document.getElementById("effects-preview-grid");

        if (!catalogue && !preview)
            return;

        fetch("/data/effects.json")
            .then(function (response) {
                if (!response.ok)
                    throw new Error("Unable to load effects data");

                return response.json();
            })
            .then(function (data) {
                var effects = data.effects || [];

                if (preview) {
                    var previewEffects = effects.filter(function (effect) {
                        return effect.category === "basic";
                    }).slice(0, 3).concat(effects.filter(function (effect) {
                        return effect.category === "extra";
                    }).slice(0, 3));
                    renderEffects(preview, previewEffects);
                }

                if (!catalogue)
                    return;

                var filters = document.getElementById("effects-filters");
                var activeFilter = "all";

                function applyFilter()
                {
                    var visible = effects.filter(function (effect) {
                        if (activeFilter === "basic" || activeFilter === "premium")
                            return effect.category === activeFilter;

                        if (activeFilter === "development")
                            return effect.development_only === true;

                        return true;
                    });

                    renderEffects(catalogue, visible);
                }

                if (filters) {
                    filters.querySelectorAll("[data-filter]").forEach(function (button) {
                        button.addEventListener("click", function () {
                            activeFilter = button.dataset.filter;
                            filters.querySelectorAll("[data-filter]").forEach(function (item) {
                                var selected = item === button;
                                item.classList.toggle("effect-filter-selected", selected);
                                item.setAttribute("aria-pressed", selected ? "true" : "false");
                            });
                            applyFilter();
                        });
                    });
                }

                applyFilter();
            })
            .catch(function () {
                [catalogue, preview].forEach(function (container) {
                    if (!container)
                        return;

                    container.textContent = "";
                    var message = document.createElement("p");
                    message.className = "effects-message";
                    message.textContent = "The effects catalogue is temporarily unavailable.";
                    container.appendChild(message);
                });
            });
    }

    if (document.readyState === "loading")
        document.addEventListener("DOMContentLoaded", loadEffects);
    else
        loadEffects();
})();
