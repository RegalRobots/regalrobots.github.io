"use strict";

import * as navigation from "/navigation/navigation.js"

new Promise(navigation.loadPage).then(content_div => {
    document.getElementById("sponsors").classList.add("selected-link");

    fetch("/sponsors/sponsors.json").
    then(response => response.json()).
    then(json => {
        const sponsorUs = document.createElement("section");
        sponsorUs.id = "sponsor-us";
        const ourSponsors = document.createElement("section");
        ourSponsors.id = "our-sponsors";

        sponsorUs.classList.add("sponsor-container");
        ourSponsors.classList.add("sponsor-container");
        
        content_div.appendChild(sponsorUs);
        content_div.appendChild(ourSponsors);
        
        new navigation.ItemArray().buildPageFromJson(json["sponsor-us"], sponsorUs).render();
        new navigation.ItemArray().buildPageFromJson(json["our-sponsors"], ourSponsors).render();
    });
});
