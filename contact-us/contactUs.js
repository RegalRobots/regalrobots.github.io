"use strict";

import * as navigation from "/navigation/navigation.js"

new Promise(navigation.loadPage).then(content_div => {
    fetch("contactUs.json")
    .then(jsonResponse => jsonResponse.json())
    .then(json => {
        document.getElementById("contact-us").classList.add("selected-link");
        content_div.classList.add("flex-column");

        new navigation.ItemBuilder(content_div).buildFromObject(json["header"]).render();
        const otherContactsText = new navigation.ItemBuilder(content_div).buildFromObject(json["content"]).render();
    
        const contactUsContentDiv = document.createElement("div");
        const otherContactsDiv = document.createElement("div");
    
        const formDiv = document.createElement("div");
        const form = document.createElement("iframe");
    
        const discordWidgetDiv = document.createElement("div");
        const discordWidget = document.createElement("iframe");
    
        otherContactsDiv.id = "other-contacts-div";    
        otherContactsDiv.appendChild(otherContactsText);
    
        form.src = "https://docs.google.com/forms/d/e/1FAIpQLScNBoul0k6i3fpKjC-CMVM2zc7ZCeh-rKvGRAPyI4UuYvx4Tg/viewform?embedded=true";
        form.id = "contact-us-form";
        form.width = "100%";
        form.height = "600";
        form.frameBorder = "0";
        form.marginHeight = "0";
        form.marginWidth = "0";
        form.innerHTML = "Loading…";
    
        formDiv.id = "form-div";
        formDiv.appendChild(form);
        formDiv.classList.add("iframe-wrapper");
    
        discordWidget.src = "https://discord.com/widget?id=1266328894735126618&theme=dark";
        discordWidget.width = "100%";
        discordWidget.height = "500";
        discordWidget.frameBorder = "0";
        discordWidget.marginHeight = "0";
        discordWidget.marginWidth = "0";
        discordWidget.sandbox = "allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts";
    
        discordWidgetDiv.appendChild(discordWidget);
        discordWidgetDiv.classList.add("iframe-wrapper");
    
        contactUsContentDiv.appendChild(otherContactsDiv);
        contactUsContentDiv.appendChild(formDiv);
        otherContactsDiv.appendChild(discordWidgetDiv);
        contactUsContentDiv.id = "contact-us-content";
    
        content_div.appendChild(contactUsContentDiv);
    });
});