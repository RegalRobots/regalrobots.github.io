import * as navigation from "/navigation/navigation.js";

new Promise(navigation.loadPage).then((content_div) => {
    document.getElementById("links").classList.add("selected-link");

    content_div.classList.add("flex-column");

    const importantLinksHeader = document.createElement("h1");
    importantLinksHeader.classList.add("large-title");
    importantLinksHeader.innerHTML = "Important Links";

    content_div.appendChild(importantLinksHeader);
    
    const links = new navigation.ItemArray();

    fetch("importantLinksPage.json")
        .then(response => response.json())
        .then(jsonData => {
            links.buildPageFromJson(jsonData, content_div);
            links.render();
        });
});