"use strict";

import * as navigation from "/navigation/navigation.js"

new Promise(navigation.loadPage).then(content_div => {
    document.getElementById("documentation").classList.add("selected-link");

    content_div.classList.add("flex-column");
    content_div.classList.add("documentation-content");

    const docNavBar = document.createElement("div");
    docNavBar.id = "documentation-navbar";

    const docNavBarAnchorContainer = document.createElement("nav");
    docNavBarAnchorContainer.id = "navbar-anchor-container";

    docNavBar.appendChild(docNavBarAnchorContainer);        
    
    const overviewHeader = document.createElement("h1");
    overviewHeader.innerHTML = "How does an FTC game work?";
    overviewHeader.id = "how-ftc-game-works";
    addToDocNavBar(overviewHeader.id, "How an FTC game works");
    
    const overviewText = navigation.Item.prototype.createContentCaption();
    overviewText.innerHTML = "The First Tech Challenge is made up of two different periods where both you and your allied team face an alliance \
    of two other teams. These periods are an autonomous mode and a TeleOp mode. Every game starts in the autonomous mode which is active for 30 \
    seconds and in this period the robot must run a preset program without human input to complete tasks and objectives within the bounds of the \
    game. Then the 2:30 minute TeleOp mode begins where players must control their robot with game controllers to complete tasks and score points \
    as fast as possible. The last 30 seconds of the TeleOp mode constitute the endgame time where special rules apply and it is possible to score \
    more points. To see a more in depth explanation of this year's game check out \
    <a class=outside-link aria-label=\"Check out this year's game manuals\" target=_blank \
    href=https://www.firstinspires.org/resource-library/ftc/game-and-season-info>the game manuals</a>.";
    
    const overviewCard = navigation.Item.prototype.createCardItem();
    overviewCard.appendChild(overviewHeader);
    overviewCard.appendChild(overviewText);
    
    document.body.appendChild(docNavBar);
    content_div.appendChild(overviewCard);

    const programmingHeader = createHeader("How do you program for FTC?", "programming-guide");
    const cadHeader = createHeader("How do you CAD for FTC?", "cad-guide");        
    const buildHeader = createHeader("How do you build for FTC?", "build-guide");
    const programmingItemArray = new navigation.ItemArray();
    const cadItemArray = new navigation.ItemArray();
    const buildingItemArray = new navigation.ItemArray();

    fetch("documentationPage.json")
        .then(response => response.json())
        .then(jsonData => {
            content_div.appendChild(programmingHeader);

            programmingItemArray.buildPageFromJson(jsonData["Programming"], content_div);
            createCollapseButton(programmingHeader, programmingItemArray);
            programmingItemArray.render();

            content_div.appendChild(cadHeader);
            cadItemArray.buildPageFromJson(jsonData["Cad"], content_div);
            createCollapseButton(cadHeader, cadItemArray);
            cadItemArray.render();
            
            content_div.appendChild(buildHeader);
            buildingItemArray.buildPageFromJson(jsonData["Building"], content_div);
            createCollapseButton(buildHeader, buildingItemArray);
            buildingItemArray.render();
        });

    function createHeader(title, id) {
        const header = document.createElement("h1");
        header.innerHTML = title;
        header.id = id;
        header.classList.add("documentation-header");
        addToDocNavBar(id, title);
        return header;
    }

    function addToDocNavBar(id, name){
        const anchor = document.createElement("a");
        const copyToastContainer = document.createElement("div");
        const copyToastContent =  document.createElement("div");
        copyToastContainer.appendChild(copyToastContent);

        anchor.classList.add("documentation-nav-links");
        anchor.classList.add("outside-link");
        anchor.innerHTML = name;
        anchor.href = "./documentation.html#" + id;
        
        copyToastContainer.classList.add("copy-toast-container");
        copyToastContent.classList.add("copy-toast-content");
        
        async function writeClipboardText(text) {
            try {
                await navigator.clipboard.writeText(text);
            } catch(error) {
                console.error("Could not copy navigator text.", error.message);
                return false;
            } return true;
        }
        
        anchor.addEventListener("click", () => {
            copyToastContainer.classList.add("show-toast");
            copyToastContent.textContent = "Copied to clipboard.";
            if (writeClipboardText(anchor.href)) copyToastContent.textContent = "Copied to clipboard.";
            else copyToastContent.textContent = "Could not copy to clipboard.";
            setTimeout(() => {copyToastContainer.classList.remove("show-toast");}, 1525);
        });
        docNavBarAnchorContainer.appendChild(copyToastContainer);
        docNavBarAnchorContainer.appendChild(anchor);
    }

    function createCollapseButton(header, informationList) {
        const collapseIcon = document.createElement("button");
        collapseIcon.ariaLabel = "Collapse Header";
        header.insertAdjacentElement("beforeend", collapseIcon);
        collapseIcon.classList.add("svg-button");
        collapseIcon.classList.add("collapse-button");
        collapseIcon.addEventListener("click", () => {
            collapseIcon.classList.toggle("collapse-button-close")
            informationList.forEach((elem) =>{elem.toggleHide();});
        });
        return collapseIcon;
    }
});
