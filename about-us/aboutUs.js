"use strict";

import * as navigation from "/navigation/navigation.js";

new Promise(navigation.loadPage).then(content_div => {
    document.getElementById("about-us").classList.add("selected-link");

    const header = document.createElement("h1");
    header.innerHTML = "About us: What is FTC Robotics and our Regal Robotics Team?";

    const caption = navigation.Item.prototype.createContentTitle();
    caption.innerHTML = "The First Tech Challenge is a competition between different robotics teams across \
    the globe, split across different leagues and districts. In this competition, the teamwork, ingenuity, \
    innovation, and the creativity of these different teams are pitted against each other as every team \
    struggles to put together a robot that completes a variety of tasks in time before they face off against \
    other teams. <br>\
    Our team was created in 2023 in time for the Powerplay season from 2023-2024. We started out with very \
    little other than the knowledge of the others in our school robotics club, a driving station, some old spare \
    tools from other teams in our school, and a drivertrain kit from goBilda. Starting with what we started with, \
    we did not do terrible, but instead peaked at 4th place in our regional competition. We hope to do even better \
    starting in the 2024-2025 season starting with the creation of this very website! Not only do we hope to do \
    better this season but to be able to preserve as much knowledge and experience as possible through the \
    documentation on this website and through our our school-wide robotics club and this junior team.";
    caption.classList.add("content");
    caption.classList.add("about-us-content");

    const item = navigation.Item.prototype.createCardItem();

    item.appendChild(header);
    item.appendChild(caption);
    content_div.appendChild(item);

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
