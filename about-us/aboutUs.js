"use strict";

import * as navigation from "/navigation/navigation.js";

new Promise(navigation.loadPage).then(content_div => {
    fetch("aboutUs.json")
    .then(jsonResponse => jsonResponse.json())
    .then(json => {
        document.getElementById("about-us").classList.add("selected-link");
        new navigation.ItemBuilder(content_div).buildFromObject(json).render();

        const image2023 = navigation.Item.prototype.createImageWithCaption(
            "Our team in the 2023-2024 season.", "/Assets/Group_Photos/2023group_photo.jpg")
        const imageCurrent = navigation.Item.prototype.createImageWithCaption(
            "Our current team.", "/Assets/Group_Photos/2023group_photo.jpg")

        const imagesContainer = document.createElement("aside");
        imagesContainer.classList.add("images-container")
        imagesContainer.classList.add("about-us-images")

        imagesContainer.appendChild(image2023);
        imagesContainer.appendChild(imageCurrent);
        content_div.appendChild(imagesContainer);
    });
});
