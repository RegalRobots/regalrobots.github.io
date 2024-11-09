"use strict";

import * as navigation from "/navigation/navigation.js"

/**
 * Encapsulates all scripts and logic for documentation table of contents navbar that connects to the headers on the documentation page
 */
class DocumentationNavbar {
    copyToastContainer;
    copyToastContent;
    navbarHeaderMap;
    anchorsList;
    /**
     * @param {Object} navbarHeaderMap {id {String} of header: text {String} text value to display on the navbar}
     */
    constructor(navbarHeaderMap, copyToastContainer, copyToastContent) {
        this.copyToastContainer = copyToastContainer;
        this.copyToastContent = copyToastContent;
        this.navbarHeaderMap = navbarHeaderMap;
        this.anchorsList = [];
        this.buildNavbar();

        // Documentation Navbar Scroll highlighting
        document.addEventListener('DOMContentLoaded', this.highlightVisibleHeader.bind(this));
        document.addEventListener('load', this.highlightVisibleHeader.bind(this));
        document.addEventListener("scroll", this.highlightVisibleHeader.bind(this));
        document.addEventListener('resize', this.highlightVisibleHeader.bind(this));
    }

    buildNavbar() {
        const docNavBar = document.createElement("div");
        docNavBar.id = "documentation-navbar";

        const docNavBarAnchorContainer = document.createElement("nav");
        docNavBarAnchorContainer.id = "navbar-anchor-container";
        docNavBar.appendChild(docNavBarAnchorContainer);
        document.body.appendChild(docNavBar);

        for(const [key, value] of Object.entries(this.navbarHeaderMap)) {
            this.anchorsList.push(this.addToDocNavBar(key, value, docNavBarAnchorContainer, this.copyToastContainer, this.copyToastContent));
        }
    }

    addToDocNavBar(id, name, docNavBarAnchorContainer, copyToastContainer, copyToastContent){
        const anchor = document.createElement("a");

        anchor.classList.add("documentation-nav-links");
        anchor.classList.add("outside-link");
        anchor.innerHTML = name;
        anchor.href = "./documentation.html#" + id;

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

        docNavBarAnchorContainer.appendChild(anchor);
        return anchor;
    }

    highlightVisibleHeader() {
        const getTop = (id) => {return document.getElementById(id).getBoundingClientRect().top;};
        let tops = [...Object.keys(this.navbarHeaderMap)].map((id) => {return getTop(id);});
        for(let i = tops.length - 1; i >= 0; i--) {
            if(tops[i] <= 0) {
                document.querySelectorAll(".highlighted-link").forEach(elem => elem.classList.remove("highlighted-link"));
                this.anchorsList[i].classList.add("highlighted-link");
                return;
            }
        }
    }

}

/**
 * A list of colored buttons is given to the program in order of how the styles should be stacked so that each buttons' css styles are added 
 * on top of the button below its css styles when the button is "checked" (the buttons are checkboxes).
 * 
 * @example
 * ColoredButtonsBar([new ColoredReadingButton(...), new ColoredReadingButton(...), ...])
 * // This will add two buttons to the colored buttons bar where the second button (i=1) will override the first button when checked
 * // but when unchecked, the first button must be checked
 * // When each button is checked, their corresponding styles are added to the page
 */
class ColoredButtonsBar {
    buttons;
    currCheckedButtonIndex;
    constructor(buttons) {
        this.buttons = buttons;
     
        const colorButtonsContainerSelector = "#reading-modes";

        buttons.forEach(button => {
            button.classList.add("colored-radios");
            button.classList.add("styling-button");
            document.querySelector(colorButtonsContainerSelector).appendChild(button);
            document.querySelector(colorButtonsContainerSelector).appendChild(button.styleLabel);
        });

        this.buttons[0].checked = true;
        this.currCheckedButtonIndex = 0;
        buttons.forEach(button => button.addEventListener("click", () => clickHandler(button)));

        function removeOtherButtonStyles(button) {
            buttons.forEach((arrayBtn, i) => {
                if(arrayBtn != button && i != 0) arrayBtn.removeStyles();
            });
        }

        function clickHandler(button) {
            removeOtherButtonStyles(button);
            button.addStyles();
        }
    }

    removeAllStyles() {
        this.buttons.forEach(button => button.removeStyles());
    }

    toggleReadingModeAll() {
        this.buttons.forEach(button => button.classList.toggle("reading-mode"));
    }

    resetChecked() {
        this.buttons[0].checked = true;
        this.currCheckedButtonIndex = 0;
    }
}

class ColoredReadingButton extends HTMLInputElement {
    style;
    styleLabel;
    styleQuerySelectors; // starts as ["body", "h1", "h2", "h3", ".content"], only add selectors that are additional to that
    constructor(styleName, id, ARIALabel, additionalQuerySelectors = null) {
        super();
        this.type = "radio";

        const radioGroupName = "colored-radio";
        this.name = radioGroupName;

        this.style = styleName;
        this.id = id;
        this.styleQuerySelectors = ["body", "h1", "h2", "h3", ".content"];
        if(additionalQuerySelectors) this.styleQuerySelectors = this.styleQuerySelectors.concat(additionalQuerySelectors);
        
        this.styleLabel = document.createElement("label");
        this.styleLabel.htmlFor = id;
        this.styleLabel.tabIndex = 0;
        this.styleLabel.role = "radio";
        this.styleLabel.ariaLabel = ARIALabel;
        this.styleLabel.title = ARIALabel;
    }

    removeStyles() {
        this.styleQuerySelectors.forEach(selector => {if(document.querySelector(selector)) document.querySelectorAll(selector).forEach(elem => elem.classList.remove(this.style))});
    }

    addStyles() {
        this.styleQuerySelectors.forEach(selector => {if(document.querySelector(selector)) document.querySelectorAll(selector).forEach(elem => elem.classList.add(this.style))});
    }
}

/**
 * Encapsulates all scripts and logic for reading buttons
 */
class ReadingModeButton extends HTMLButtonElement {
    style;
    active; // in effect
    buttonBar;
    querySelectorsActivated;
    // starts as ["body", "h1", "h2", "h3", ".content"], only add selectors that are additional to that
    constructor(styleName, id, ARIALabel, additionalQuerySelectorsActivated = null) {
        super();
        this.style = styleName;
        this.id = id;
        this.ariaLabel = ARIALabel;
        this.active = false;
        this.querySelectorsActivated = ["body", "h1", "h2", "h3", ".content"];
        if(additionalQuerySelectorsActivated) this.querySelectorsActivated = Array.prototype.concat(this.querySelectorsActivated, additionalQuerySelectorsActivated);
        
        const actions = Object.freeze({CLICK: Symbol("CLICK"), MOUSEOVER: Symbol("MOUSEOVER")})
        let lastAction;

        this.classList.add("svg-button");

        this.addEventListener("click", () => {
            if(!this.classList.contains("blur")) {
                if(lastAction !== actions.MOUSEOVER) this.active ? this.removeStyles(true) : this.addStyles(true);
                else this.active ? this.removeStyles(true) : this.addStyles(false);
                this.classList.toggle("reading-mode", !this.active);
                this.active = !this.active;
                lastAction = actions.CLICK;
            }
        });

        this.addEventListener("mouseover", () => {
            if(!this.active){
                this.addStyles(true);
                this.classList.toggle("reading-mode", !this.active);
            }
            lastAction = actions.MOUSEOVER;
        });

        this.addEventListener("mouseout", () => {
            if(!this.active && lastAction !== actions.CLICK) this.removeStyles(true);
            this.classList.toggle("reading-mode", this.active);
        });
    }

    setButtonsBar(buttonsBar) {
        this.buttonBar = buttonsBar;
    }

    addStyles(fade) {
        if(fade) {
            document.body.classList.add("reading-mode-delay");
            document.body.classList.add(this.style);
        } 
        setTimeout(() => {
            this.querySelectorsActivated.forEach(selector => document.querySelectorAll(selector).forEach(elem => elem.classList.add(this.style)));
            if(fade) document.body.classList.remove("reading-mode-delay");
        }, 200);
    }

    removeStyles(fade) {
        if(fade) {
            document.body.classList.add("reading-mode-delay");
            document.body.classList.add(this.style);
        }
        setTimeout(() => {
            this.querySelectorsActivated.forEach(selector => document.querySelectorAll(selector).forEach(elem => elem.classList.remove(this.style)));
            this.buttonBar.removeAllStyles();
            this.buttonBar.resetChecked();
            document.body.classList.remove("reading-mode-delay");
        }, 200);        
    }
}

new Promise(navigation.loadPage).then(content_div => {
    // Reading Mode
    customElements.define('read-button', ReadingModeButton, {extends: 'button'});
    customElements.define('color-button', ColoredReadingButton, {extends: 'input'});
        
    const documentationTitle = document.createElement("h1");
    documentationTitle.textContent = "Documentation";
    documentationTitle.id = "documentation-title";
    content_div.appendChild(documentationTitle);
    
    const readingModes = document.createElement("aside");
    readingModes.id = "reading-modes";
    
    const blackButton = new ColoredReadingButton("reading-mode-dark", "black-button", "Activate Black Reading Mode",
        ["img", ".collapse-button", "#top-div", "#documentation-navbar", ".documentation-content", ".hide-item"]);
    const yellowButton = new ColoredReadingButton("reading-mode-light", "yellow-button", "Activate Yellow Reading Mode", ["a"]);
    const darkGrayButton = new ColoredReadingButton("reading-mode-dark-gray", "dark-gray-button", "Activate Blue Reading Mode");
    const lightGrayButton = new ColoredReadingButton("reading-mode-light-gray", "light-gray-button", "Activate Gray Reading Mode", ["a"]);

    const readButton = new ReadingModeButton("reading-mode-dark", "read-button", "Activate reading mode",
        ["img", ".collapse-button", "#top-div", "#documentation-navbar", ".documentation-content", ".hide-item", ".mobile-nav-button"]);
    document.body.appendChild(readButton);
    document.body.appendChild(readingModes);

    const buttonsBar = new ColoredButtonsBar([blackButton, darkGrayButton, yellowButton, lightGrayButton]);
    readButton.setButtonsBar(buttonsBar);

    readButton.addEventListener("click", () => {
        if(!readButton.classList.contains("blur")){
            navigation.closeSidebar();
            readingModes.classList.toggle("show");
            readButton.classList.toggle("show");
            buttonsBar.toggleReadingModeAll();
        }
    });
    readButton.addEventListener("mouseover", navigation.closeSidebar);

    // The headers ("addheader"s) of the various information lists in the JSON must be the first object in the list in the JSON (check json file)
    fetch("documentationPage.json")
        .then(response => response.json())
        .then(jsonData => {
            document.getElementById("documentation").classList.add("selected-link");
            content_div.classList.add("flex-column");

            // Copy to Clipboard Toast Notification
            const copyToastContainer = document.createElement("div");
            copyToastContainer.classList.add("copy-toast-container");

            const copyToastContent =  document.createElement("div");
            copyToastContent.classList.add("copy-toast-content");
            copyToastContainer.appendChild(copyToastContent);
            document.body.appendChild(copyToastContainer);

            // Documentation Navigation Sidebar
            const idHeaderObj = {"how-ftc-game-works": "How an FTC game works", "programming-guide": "How do you program for FTC?", 
                "cad-guide": "How do you CAD for FTC?", "build-guide": "How do you build for FTC?"};
            new DocumentationNavbar(idHeaderObj, copyToastContainer, copyToastContent);

            const mobileNav = document.createElement("dialog");
            mobileNav.id = "mobile-nav";
            document.body.appendChild(mobileNav);

            const mobileNavLinks = document.createElement("div");
            mobileNavLinks.id = "mobile-nav-links";
            mobileNav.appendChild(mobileNavLinks);

            const closeMobileDialog = document.createElement("button");
            closeMobileDialog.autofocus = false;
            closeMobileDialog.id = "close-dialog";
            closeMobileDialog.classList.add("svg-button");
            closeMobileDialog.onclick = closeMobileNav;
            mobileNav.appendChild(closeMobileDialog);

            for(const [key, value] of Object.entries(idHeaderObj)) {
                DocumentationNavbar.prototype.addToDocNavBar(key, value, mobileNavLinks);
            }

            // Documentation Content from JSON
            new navigation.ItemBuilder(content_div).buildFromObject(jsonData["Overview"]).render();
            const programmingItemArray = new navigation.ItemArray();
            const cadItemArray = new navigation.ItemArray();
            const buildingItemArray = new navigation.ItemArray();

            programmingItemArray.buildPageFromJson(jsonData["Programming"], content_div).render();
            cadItemArray.buildPageFromJson(jsonData["Cad"], content_div).render();
            buildingItemArray.buildPageFromJson(jsonData["Building"], content_div).render();

            createCollapseButton(0, programmingItemArray);
            createCollapseButton(1, cadItemArray);
            createCollapseButton(2, buildingItemArray);

            /**
             * Creates a collapse button at the end of a header to hide a provided list of Items
             * @param {number} headerIndex What number header it is on the page in order
             * @param {navigation.ItemArray} informationList The array that will be hidden by the butten
             * @returns The button element of the Collapse Button
             */
            function createCollapseButton(headerIndex, informationList) {
                const mobileNavIcon = document.createElement("button");
                mobileNavIcon.ariaLabel = "Open Page Navigation";
                mobileNavIcon.classList.add("svg-button");
                mobileNavIcon.classList.add("mobile-nav-button");
                document.querySelectorAll(".documentation-header")[headerIndex].insertAdjacentElement("beforeend", mobileNavIcon);
                mobileNavIcon.addEventListener("click", openMobileNav);
                screen.orientation.addEventListener("change", closeMobileNav);
                document.querySelector(".navigation").addEventListener("click", (e) => {
                    if(e.target !== mobileNav && !e.target.classList.contains("mobile-nav-button")) closeMobileNav()
                });
                const collapseIcon = document.createElement("button");
                collapseIcon.ariaLabel = "Collapse Header";
                document.querySelectorAll(".documentation-header")[headerIndex].insertAdjacentElement("beforeend", collapseIcon);
                collapseIcon.classList.add("svg-button");
                collapseIcon.classList.add("collapse-button");
                collapseIcon.addEventListener("click", () => {
                    collapseIcon.classList.toggle("collapse-button-close");
                    informationList.slice(2).forEach((elem) =>{elem.toggleHide();});
                });
                return collapseIcon;
            }

            function closeMobileNav() {
                document.body.style.overflow = "visible"; 
                mobileNav.classList.remove("open");
                document.querySelector(".navigation").classList.remove("blur");
                document.querySelector("#read-button").classList.remove("blur");
            }

            function openMobileNav() {
                navigation.closeSidebar();
                mobileNav.classList.add("open");
                document.querySelector(".navigation").classList.add("blur");
                document.querySelector("#read-button").classList.add("blur");
                document.body.style.overflow = "hidden";
            }
        });
});
