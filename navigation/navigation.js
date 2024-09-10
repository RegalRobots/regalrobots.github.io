/* Place your JavaScript in this file */
"use strict";
let sidebar;
let titleBar;
let sidebarOpen;
let content_div;

let applyAttributes = (attributeObj, item) => {if(attributeObj) 
    Object.keys(attributeObj).forEach((key)=>{item.setAttribute(key, attributeObj[key])})};


export class Item {
    parentDiv;
    cardAttrs;
    title;
    content;
    imagePath;
    imageCaptionText;
    imageAttrs;
    alt;
    list;
    constructor(itemBuilder) {
        this.parentDiv = itemBuilder.parentDiv;
        this.title = itemBuilder.title;
        this.content = itemBuilder.content;
        this.imagePath = itemBuilder.imagePath;
        this.imageCaptionText = itemBuilder.imageCaptionText;
        this.list = itemBuilder.list;
        this.imageAttrs = itemBuilder.imageAttrs;
        this.cardAttrs = itemBuilder.cardAttrs;
        this.titleAttrs = itemBuilder.titleAttrs;
        this.alt = itemBuilder.altText;
        this.item = null;
    }

    createCardItem(attrs = null) {
        const item = document.createElement("div");
        applyAttributes(attrs, item);
        item.classList.add("card-div");
        return item;
    }
    
    createImageWithCaption(text, imgPath, altText, attrs=null) {
        const img = document.createElement("img");
        img.alt = altText;
        img.src = imgPath;
        img.role = "button";
        img.ariaLabel = "Click to fullscreen image";
        img.title = "Click to fullscreen image";
        img.width = 200;
        img.height = 200;
        img.tabIndex = 0;
    
        // const imageButton = document.createElement("button");
        // imageButton.appendChild(img);

        const caption = document.createElement("h3");
        caption.innerHTML = text;
    
        const ImageWithCaption = document.createElement("div")
        applyAttributes(attrs, ImageWithCaption);
        
        ImageWithCaption.appendChild(img);
        ImageWithCaption.appendChild(caption);
        ImageWithCaption.classList.add("image-with-caption");

        let fullScreenImg = () => {
            img.requestFullscreen();
            img.style.width = document.body.offsetWidth;
            img.style.height = document.body.offsetHeight;
            img.style.width = "";
            img.style.height = "";
            closeSidebar();  // Chrome stinks
        }

        // img.onclick = () => {};
        // img.onkeyup = () => {};

        img.addEventListener("click", () => {
            document.fullscreenElement ? document.exitFullscreen() : fullScreenImg();
        });

        img.addEventListener("keyup", (e) => {
            if(e.code === "Enter" || e.code === "Space") fullScreenImg();
        });

        document.addEventListener("keyup", (e) => {
            if((e.code === "Enter" || e.code === "Space") && document.fullscreenElement) document.exitFullscreen();
        });

        return ImageWithCaption;
    }
    
    createContentCaption() {
        const caption = document.createElement("p");
        caption.classList.add("content");
        return caption;
    }
    
    createContentTitle(attrs=null) {
        const title = document.createElement("h2");
        applyAttributes(title, attrs);
        title.classList.add("default-padding");
        return title;
    }

    render() {
        this.item = this.createCardItem(this.cardAttrs);
        const caption = this.createContentCaption();

        const header = this.createContentTitle(this.titleAttrs);
        header.innerHTML = this.title;
        this.item.appendChild(header);

        if(this.content){
            caption.innerHTML = this.content;
            this.item.appendChild(caption);
        }

        if(this.list){
            const listHtml = this.list.map((listItem)=>`<li>${listItem}</li>`);
            let listStr = "<ul>";
            listHtml.forEach((listItem) => listStr += listItem);
            listStr += "</ul>";
            if(this.addToContent && this.content){
                this.content.innerHTML += listStr;
            } else {
                const listCaption = this.createContentCaption();
                listCaption.innerHTML = listStr;
                this.item.appendChild(listCaption);
            }
        }

        if (this.content && this.imagePath && this.imageCaptionText) {
            const imageDiv = this.createImageWithCaption(this.imageCaptionText, this.imagePath, this.alt, this.imageAttrs);
            imageDiv.classList.add("content-image");
            caption.insertAdjacentElement('afterbegin', imageDiv);
        }

        this.parentDiv.appendChild(this.item);
    }

    toggleHide() {
        this.item.style.display = this.item.style.display == "none" ? "" : "none";
    }
}

export class ItemBuilder {
    parentDiv;
    cardAttrs;
    title;
    titleAttrs;
    content;
    imagePath;
    imageCaptionText;
    list;
    imageAttrs;
    altText;
    constructor(parentDiv) {
        this.parentDiv = parentDiv;
        this.title = null;
        this.content = null;
        this.imagePath = null;
        this.imageCaptionText = null;
        this.addToContent = null;
        this.imageAttrs = null;
        this.cardAttrs = null;
        this.titleAttrs = null;
        this.altText = null;
    }

    addCard(obj) {
        ({attrs: this.cardAttrs = null} = obj);
    }

    addTitle(obj){
        ({title: this.title, attrs: this.titleAttrs = null} = obj);
        return this;
    }

    addContent(obj) {
        ({content: this.content} = obj);
        return this;
    }

    addImage(obj) {
        ({imagePath: this.imagePath, imageCaptionText: this.imageCaptionText,
            altText: this.altText, attrs: this.imageAttrs = null} = obj);
        return this;
    }
    
    addList(obj) {
        ({list: this.list} = obj);
        return this;
    }

    build() {
        return new Item(this);
    }

    buildFromJson(jsonObj){
        Object.keys(jsonObj).forEach(fileKey => this[fileKey](jsonObj[fileKey]));
        return new Item(this);
    }
}

export class ItemArray extends Array {
    constructor() {
        super(1);
    }
    
    buildPageFromJson(jsonArray, parentDiv) {
        jsonArray.forEach(jsonObj => this.push(new ItemBuilder(parentDiv).buildFromJson(jsonObj)));
        return this;
    }

    render() {
        this.forEach((x) => {x.render()});
    }
}

export function loadPage(resolve, reject) {
    fetch('/navigation/navigation.txt')
        .then(response => response.text())
        .then(text => {
            document.body.innerHTML = text;
            sidebar = document.getElementById("sidebar");
            titleBar = document.getElementById("top-div");
            content_div = document.getElementById("content");
            sidebarOpen = false;
            if (window.matchMedia("not (orientation:portrait)").matches) openSidebar();
            
            content_div.addEventListener("click", () => {
                if (window.matchMedia("(orientation:portrait)").matches) closeSidebar();
            });
            
            content_div.addEventListener("keyup", (e) => {
                if (window.matchMedia("(orientation:portrait)").matches && 
                (e.code === "Space" || e.code === "Enter")) closeSidebar();
            });

            document.querySelector("#menu-button").onclick = sideMenuHandler;

            resolve(content_div);
        }
        ).catch(() => { reject(); });
}

function sideMenuHandler() {
    sidebar.classList.remove("static-sidebar-closed")
    titleBar.classList.remove("static-content-closed")
    sidebar.classList.remove("static-sidebar")
    titleBar.classList.remove("static-content")
    if (sidebarOpen) {
        closeSidebar();
    } else if (!sidebarOpen) {
        openSidebar();
    }
}

function openSidebar() {
    sidebarOpen = true;
    let menuButton = document.querySelector("#menu-button");
    menuButton.classList.add("close-sidebar-button");
    menuButton.ariaLabel = "Sidebar button, select to close";
    menuButton.title = "Open Sidebar";

    titleBar.classList.remove("grow-content");
    titleBar.classList.add("shrink-content");
    sidebar.classList.remove("close-sidebar");
    sidebar.classList.add("open-sidebar");
    content_div.classList.remove("grow-content");
    content_div.classList.add("shrink-content");
    if (window.matchMedia("only screen and (orientation:landscape) and (max-width:992px)").matches
    || window.matchMedia("(orientation:portrait)").matches) document.body.style.overflow = "hidden";
}

function closeSidebar() {
    sidebarOpen = false;
    let menuButton = document.querySelector("#menu-button");
    menuButton.classList.remove("close-sidebar-button");
    menuButton.ariaLabel = "Sidebar button, select to open";
    menuButton.title = "Open Sidebar";

    titleBar.classList.remove("shrink-content");
    titleBar.classList.add("grow-content");
    sidebar.classList.remove("open-sidebar");
    sidebar.classList.add("close-sidebar");
    content_div.classList.remove("shrink-content");
    content_div.classList.add("grow-content");
    document.body.style.overflow = "visible";
}

window.addEventListener("resize", function () {
    if (window.matchMedia("(orientation:portrait)").matches || window.matchMedia(
        "only screen and (orientation:landscape) and (max-width:992px)").matches) return;

    // Reset sidebar
    sidebar.classList.remove("close-sidebar");
    titleBar.classList.remove("grow-content")
    sidebar.classList.remove("open-sidebar");
    titleBar.classList.remove("shrink-content")

    if (!sidebarOpen) {
        sidebar.classList.add("static-sidebar-closed");
        titleBar.classList.add("static-content-closed")
    } else if (sidebarOpen) {
        sidebar.classList.add("static-sidebar");
        titleBar.classList.add("static-content")
    }
});