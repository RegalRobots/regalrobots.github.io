"use strict";

import * as navigation from "/navigation/navigation.js"

class ItemQueue extends navigation.ItemArray {
    push(item) {
        this.splice(0, 0, item);
    }
}

new Promise(navigation.loadPage).then(content_div => {
    fetch("/home-page/homePage.json")
    .then(response => response.json())
    .then(jsonData => {
        document.getElementById("home").classList.add("selected-link");
        content_div.classList.add("home-content");
        new ItemQueue().buildPageFromJson(jsonData, content_div).render();
    });
});
