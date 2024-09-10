"use strict";

import * as navigation from "/navigation/navigation.js"

new Promise(navigation.loadPage).then(content_div => {
    document.getElementById("sponsors").classList.add("selected-link");

    let sponsorUsDiv = document.createElement("div");
    let thankSponsorsDiv = document.createElement("div");
    content_div.appendChild(sponsorUsDiv);
    content_div.appendChild(thankSponsorsDiv);
});
