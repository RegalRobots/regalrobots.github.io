"use strict";

let sidebarOpen;
let sidebar;
let titlebar;
let content_div;

let applyAttributes = (attributeObj, item) => {if(attributeObj) 
    Object.keys(attributeObj).forEach((key)=>{item.setAttribute(key, attributeObj[key])})};


export class Item {
    parentElement;
    cardAttrs;
    title;
    header;
    headerAttrs;
    content;
    contentAttrs;
    imagePath;
    imageCaptionText;
    imageAttrs;
    alt;
    list;
    constructor(itemBuilder) {
        this.parentElement = itemBuilder.parentElement;
        this.title = itemBuilder.title;
        this.content = itemBuilder.content;
        this.contentAttrs = itemBuilder.contentAttrs;
        this.imagePath = itemBuilder.imagePath;
        this.imageCaptionText = itemBuilder.imageCaptionText;
        this.list = itemBuilder.list;
        this.imageAttrs = itemBuilder.imageAttrs;
        this.cardAttrs = itemBuilder.cardAttrs;
        this.titleAttrs = itemBuilder.titleAttrs;
        this.header = itemBuilder.header;
        this.headerAttrs = itemBuilder.headerAttrs;
        this.alt = itemBuilder.altText;
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
    
    createContent(attrs = null) {
        const caption = document.createElement("p");
        caption.classList.add("content");
        applyAttributes(attrs, caption);
        return caption;
    }
    
    createContentTitle(attrs=null) {
        const title = document.createElement("h2");
        applyAttributes(attrs, title);
        title.classList.add("default-padding");
        return title;
    }

    createListContent(listArray, content = null) {
        const listHtml = listArray.map((listItem)=>`<li>${listItem}</li>`);
        let listStr = "<ul>";
        listHtml.forEach((listItem) => listStr += listItem);
        listStr += "</ul>";
        if(content){
            content.innerHTML += listStr;
        } else {
            const listCaption = this.createContent();
            listCaption.innerHTML = listStr;
            return listCaption;
        }
    }

    createHeader(attrs = null) {
        const header = document.createElement("h1");
        applyAttributes(attrs, header);
        return header;
    }

    render() {
        this.item = this.createCardItem(this.cardAttrs);

        if(this.header) {
            const header = this.createHeader(this.headerAttrs);
            header.innerHTML = this.header;
            this.item.appendChild(header);
        }

        if(this.title) {
            const title = this.createContentTitle(this.titleAttrs);
            title.innerHTML = this.title;
            this.item.appendChild(title);
        }

        if(this.content){
            const caption = this.createContent(this.contentAttrs);
            caption.innerHTML = this.content;
            this.item.appendChild(caption);
            if (this.imagePath && this.imageCaptionText) {
                const imageDiv = this.createImageWithCaption(this.imageCaptionText, this.imagePath, this.alt, this.imageAttrs);
                imageDiv.classList.add("content-image");
                caption.insertAdjacentElement('afterbegin', imageDiv);
            }
        }

        // this is bugged
        if(this.list){
            const list = this.createListContent(this.list, this.content);
            this.item.appendChild(list);
        }

        this.parentElement.appendChild(this.item);
        return this.item;
    }

    toggleHide() {
        this.item.classList.toggle("hide-item");
    }
}

/**
 * Builder class to simplify creating Items
 * @see {@link Item}
 * @example
 * let itemBuilder = new ItemBuilder(infoDiv);
 * itemBuilder.addTitle({title: "Important Info", attrs: {class: "large-title"}});
 * itemBuilder.addContent({content: "Important Info is important and it is..."});
 * let item = itemBuilder.build();
 * item.render();
 */
export class ItemBuilder {
    parentElement;
    cardAttrs;
    title;
    header;
    headerAttrs;
    content;
    contentAttrs;
    list;
    imagePath;
    imageCaptionText;
    imageAttrs;
    titleAttrs;
    altText;
    /**
     * Constructs ItemBuilder
     * @param {HTMLElement} parentElement Element that {@link ItemBuilter.build()} {@link Item} will be rendered to 
     * @see {@link ItemBuilder}
     */
    constructor(parentElement) {
        this.parentElement = parentElement;
        this.cardAttrs = null;
        this.title = null;
        this.content = null;
        this.imagePath = null;
        this.imageCaptionText = null;
        this.imageAttrs = null;
        this.titleAttrs = null;
        this.altText = null;
        this.list = null;
        this.header = null;
        this.headerAttrs = null;
        this.contentAttrs = null;
    }

    /**
     * Adds attributes to the item container "card" from an object 
     * @see {@link Item.createCardItem()}
     * @param {Object} obj an object that contains the key "attrs" with object of all attributes to be added to the item container "card"
     * @example new ItemBuilder(parentElement).addCardAttrs({attrs: {class: "stylish-class"}});
     */
    addCardAttrs(obj) {
        ({attrs: this.cardAttrs} = obj);
        if(this.cardAttrs === undefined) throw new ReferenceError("Did not define necessary 'attrs' key with Object");
    }

    /**
     * Adds title to the item builder
     * creates **\<h2> (obj.attrs){key: value, key value}> obj.title \</h2>** in Item class after {@link ItemBuilder.build()} is run
     * @see {@link Item.createContentTitle()}
     * @param {Object} obj {title {String}: ..., attrs {object}?:...}, attrs optional
     * @example new ItemBuilder(parentElement).addTitle({title: "Title", attrs: {class: "stylish-class"}});
     */
    addTitle(obj){
        ({title: this.title, attrs: this.titleAttrs = null} = obj);
        if(this.title === undefined) throw new ReferenceError("Did not define necessary 'title' key with String");
        return this;
    }

    /** 
     * Adds content text to the item builder
     * creates **\<p> obj.content \</p>** in Item class after {@link ItemBuilder.build()} is run
     * @see {@link Item.createContent()};
     * @param {Object} obj {content {String}: ..., attrs {obj} ?: {...}}
     * @example new ItemBuilder(parentDiv).addContent({content: "This is information."});
     */
    addContent(obj) {
        ({content: this.content, attrs: this.contentAttrs} = obj);
        if(this.content === undefined) throw new ReferenceError("Did not define necessary 'content' key with String");
        return this;
    }

    /**
     * Adds an image to the item builder
     * @see {@link Item.createImageWithCaption()}
     * @param {Object} obj {imagePath {String}: ..., imageCaptionText {String}: ..., altText {String}?: ..., attrs {Object}?: {...}}
     * @example new ItemBuilder(parentDiv).addImage({imagePath: "/Assets/...", imageCaptionText: "Caption of the image", attrs: {class: "stylish-class"}, altText: "ARIA Description"});
     */
    addImage(obj) {
        ({imagePath: this.imagePath, imageCaptionText: this.imageCaptionText,
            altText: this.altText, attrs: this.imageAttrs = null} = obj);
        if(this.imagePath === undefined) throw new ReferenceError("Did not define necessary 'imagePath' key with String");
        if(this.imageCaptionText === undefined) throw new ReferenceError("Did not define necessary 'imageCaptionText' key with String");
        return this;
    }
    
    /**
     * Adds a list to the item builder
     * @see {@link Item.createListContent()}
     * @param {Object} obj {list {Array}: ...}
     * @example new ItemBuilder(parentElement).addList({list: ["<a href="#">link here</a>", "<p>paragraph here</p>"]});
     */    
    addList(obj) {
        ({list: this.list} = obj);
        if(this.list === undefined) throw new ReferenceError("Did not define necessary 'list' key with Array");
        return this;
    }

    /**
     * Adds a header to the item builder
     * @see {@link Item.createHeader()}
     * @param {Object} obj {header {String}: ..., attrs {Object}?:...}
     * @example new ItemBuilder(parentElement).addHeader({header: "header", attrs: {class:"stylish-class"}});
     */
    addHeader(obj) {
        ({header: this.header, attrs: this.headerAttrs} = obj);
        if(this.header === undefined) throw new ReferenceError("Did not define necessary 'header' key with String");
        return this;
    }

    /**
     * @returns {Item} an {@link Item} built from *this* ItemBuilder
     */
    build() {
        return new Item(this);
    }

    /**
     * Builds an {@link Item} from one object
     * @param {Object} jsonObj {(any {@link ItemBuilder} method): {parameter: value, parameter2: value2, ...}}
     * @returns a built {@link Item} from the object
     * @example new ItemBuilder(parentElement).buildFromObject({"addTitle": {"title": "title:"},"addContent": {"content": "content<a href=#>example</a>"}});
     */
    buildFromObject(jsonObj){
        Object.keys(jsonObj).forEach(fileKey => this[fileKey](jsonObj[fileKey]));
        return new Item(this);
    }
}

/**
 * An array collection of Items that can be rendered in bulk or created in bulk from a json file
 * @see {@link ItemArray.buildPageFromJson()}
 * @see {@link ItemArray.render()}
 * @see {@link ItemBuilder}
 */
export class ItemArray extends Array {
    constructor() {
        super(1);
    }
    
    /**
     * Build *this* item array from a json file
     * @see {@link ItemBuilder}
     * @param {Array} jsonArray A list of all Item objects and the methods that make them up
     * @param {HTMLElement} parentElement The element that the item array will be rendered to
     * @returns *this* item array which was built from the json file
     * @example let itemArray = new ItemArray();
     * fetch("items.json").then(response => response.json()).then(jsonData => {itemArray.buildFromObject(jsonData, parentElement);});
     * /* items.json: 
     * [
     *  {
     *      "addTitle": {
     *          "title": "title:"
     *      },
     *      "addContent": {
     *          "content": "content<a href=#>example</a>"
     *      }
     *  }
     * ]
     * /*
     */
    buildPageFromJson(jsonArray, parentElement) {
        jsonArray.forEach(jsonObj => this.push(new ItemBuilder(parentElement).buildFromObject(jsonObj)));
        return this;
    }

    /**
     * Renders all the items in *this* item array in the order of their indices into the {@link Item.parentElement}
     */
    render() {
        this.forEach((x) => {x.render()});
    }
}

/**
 * Used exclusively in a promise, sets up the navigation for the page and returns a <main> for every page to manipulate
 * @param {function} resolve Filled in from Promise, holds return
 * @param {function} reject Filled in from Promise
 * @returns {HTMLElement} the <main> element where all content is placed into
 * @example new Promise( { import_alias }.loadPage).then({ main_div_variable } => { 
 *  // page-specific procedures
 * });
 */
export function loadPage(resolve, reject) {
    fetch('/navigation/navigation.txt')
        .then(response => response.text())
        .then(text => {
            document.body.innerHTML = text;
            sidebar = document.getElementById("sidebar");
            titlebar = document.getElementById("top-div");
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

                        
            function sideMenuHandler() {
                sidebar.classList.remove("static-sidebar-closed")
                titlebar.classList.remove("static-content-closed")
                sidebar.classList.remove("static-sidebar")
                titlebar.classList.remove("static-content")
                if (sidebarOpen) {
                    closeSidebar();
                } else if (!sidebarOpen) {
                    openSidebar();
                }
            }

            window.addEventListener("resize", function () {
                if (window.matchMedia("(orientation:portrait)").matches || window.matchMedia(
                    "only screen and (orientation:landscape) and (max-width:992px)").matches) return;

                // Reset sidebar
                sidebar.classList.remove("close-sidebar");
                titlebar.classList.remove("grow-content")
                sidebar.classList.remove("open-sidebar");
                titlebar.classList.remove("shrink-content")

                if (!sidebarOpen) {
                    sidebar.classList.add("static-sidebar-closed");
                    titlebar.classList.add("static-content-closed")
                } else if (sidebarOpen) {
                    sidebar.classList.add("static-sidebar");
                    titlebar.classList.add("static-content")
                }
            });

            resolve(content_div);
        }
        ).catch(() => { reject(); });
}

export function openSidebar() {
    sidebarOpen = true;
    const menuButton = document.querySelector("#menu-button");
    menuButton.classList.add("close-sidebar-button");
    menuButton.ariaLabel = "Sidebar button, select to close";
    menuButton.title = "Open Sidebar";

    titlebar.classList.remove("grow-content");
    titlebar.classList.add("shrink-content");
    sidebar.classList.remove("close-sidebar");
    sidebar.classList.add("open-sidebar");
    content_div.classList.remove("grow-content");
    content_div.classList.add("shrink-content");
    if (window.matchMedia("only screen and (orientation:landscape) and (max-width:992px)").matches
    || window.matchMedia("(orientation:portrait)").matches) document.body.style.overflow = "hidden";
}

export function closeSidebar() {
    sidebarOpen = false;
    const menuButton = document.querySelector("#menu-button");
    menuButton.classList.remove("close-sidebar-button");
    menuButton.ariaLabel = "Sidebar button, select to open";
    menuButton.title = "Open Sidebar";

    titlebar.classList.remove("shrink-content");
    titlebar.classList.add("grow-content");
    sidebar.classList.remove("open-sidebar");
    sidebar.classList.add("close-sidebar");
    content_div.classList.remove("shrink-content");
    content_div.classList.add("grow-content");
    document.body.style.overflow = "visible";
}