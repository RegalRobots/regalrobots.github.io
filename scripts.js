/* Place your JavaScript in this file */
"use strict";
let sidebar;
let titleBar;
let sidebarOpen;
let sideBarAnimated;
let content_div;

class Item{
    parentDiv;
    title;
    content;
    imagePath;
    imageCaptionText;
    constructor(itemBuilder){
        this.parentDiv = itemBuilder.parentDiv;
        this.title = itemBuilder.title;
        this.content = itemBuilder.content;
        this.imagePath = itemBuilder.imagePath;
        this.imageCaptionText = itemBuilder.imageCaptionText;
    }

    render() {
        let header = document.createElement("h2");
        header.innerHTML = this.title;
        header.style.display = "inline";
        header.style.overflow = "hidden";
        header.style.background = "#A167A5";
        header.style.padding = "0.5vw 0.5vw 2vh";
        header.style.margin = "0vw";
        let caption = document.createElement("p");
        caption.style.display = "inline";
        caption.style.overflow = "hidden";
        caption.style.background = "#5268A566";
        caption.style.padding = "0.5vw 0.5vw 2vw";
        caption.innerHTML = this.content;
        let item = document.createElement("div");
        item.style.display = "grid";
        item.style.minWidth = "28vw";
        item.style.maxWidth = "56.5vw";
        item.style.overflow = "hidden";
        this.parentDiv.appendChild(item);
        if(this.imagePath !== null && this.imageCaptionText !== null){
            let imageDiv = document.createElement("div");
            imageDiv.style.float = "right";
            imageDiv.style.minWidth = "20vw";

            let imageCaption = document.createElement("h5")
            imageCaption.innerHTML = this.imageCaptionText;
            imageCaption.style.textAlign = "center";

            let sideImage = document.createElement("img");
            sideImage.src = this.imagePath;
            imageDiv.appendChild(sideImage);
            imageDiv.appendChild(imageCaption);

            caption.appendChild(imageDiv);
        }
        item.appendChild(header);
        item.appendChild(caption);
    }
}

class ItemBuilder {
    parentDiv;
    title;
    content;
    imagePath;
    imageCaptionText;
    constructor(parentDiv, title, content){
        this.parentDiv = parentDiv;
        this.title = title;
        this.content = content;
        this.imagePath = null;
        this.imageCaptionText = null;
    }
    addImage(imagePath, imageCaptionText){
        this.imagePath = imagePath;
        this.imageCaptionText = imageCaptionText;
        return this;
    }
    build(){
        return new Item(this);
    }
}

class Queue extends Array{
    constructor(){
        super(1);
    }
    push(item){
        this.splice(0, 0, item);
    }
}

function loadPage(resolve, reject){
    fetch('navigation.txt')
    .then(response => response.text())
    .then(text => {
        document.body.innerHTML = text;
        sidebar = document.getElementById("sidebarDiv");
        titleBar = document.getElementById("topDiv");
        content_div = document.getElementById("content");
        content_div.style.paddingBottom = "4vh";
        sidebarOpen = false;
        sideBarAnimated = true;
        content_div.addEventListener("click", ()=>{
            if(window.matchMedia("(orientation:portrait)").matches) closeSidebar();
        });
        resolve();
    }
    ).catch(()=>{reject();});
}

function loadHomepage(){
    new Promise(loadPage).then(()=>{
        let itemArray = new Queue();
        itemArray.push(new ItemBuilder(content_div, "New website up and running!", 
        "Hello world! This is our website made ahead of the 2024-2025 season of the FTC robotics competition!").build());
        itemArray.forEach((x)=>{x.render()});
    });
}

function loadAboutpage(){
    new Promise(loadPage).then(() => {
        let header = document.createElement("h1");
        header.innerHTML = "About us!";
        let caption = document.createElement("h2");
        caption.style.display = "inline";
        caption.style.overflow = "hidden";
        caption.style.background = "#5268A566";
        caption.style.padding = "0.5vw 0.5vw 2vw 0.5vw";
        caption.innerHTML = "Our team was created in 2023 in time for the Powerplay season from 2023-2024. We started \
        out with very little other than the knowledge of the others in our school robotics club, a driving station, some\
        old spare tools from other teams, and a drivertrain kit from goBilda. Starting with what we started with, we did \
        not do terrible, but instead peaked at 4th place in our regional competition. We hope to do even better starting in \
        the 2024-2025 season starting with the creation of this very website! Not only do we hope to do better this season but \
        to be able to preserve as much knowledge and experience as possible through the documentation on this website and through our \
        our school-wide robotics club and this junior team.";
        let item = document.createElement("div");
        item.style.display = "grid";
        item.style.minWidth = "38vw";
        item.style.maxWidth = "55.5vw";
        item.style.overflow = "hidden";
        item.style.alignSelf = "flex-start";
        content_div.appendChild(item);
        item.appendChild(header);
        item.appendChild(caption);
        item.classList.add("custom-style");
        
        let image2023 = document.createElement("img");
        image2023.src = "2023group_photo.jpg";
        image2023.style.width = "95%";
        image2023.style.paddingTop = "1.5vh";
        
        let caption2023 = document.createElement("h4");
        caption2023.innerHTML = "Our team in the 2023-2024 season.";
        
        let imageCurrent = document.createElement("img");
        imageCurrent.src = "2023group_photo.jpg";
        imageCurrent.style.width = "95%";
        imageCurrent.style.paddingTop = "1.5vh";
        let captionCurrent = document.createElement("h4");
        captionCurrent.innerHTML = "Our current team.";
        
        let imagesContainer = document.createElement("aside");
        imagesContainer.style.background = "#5268A566";
        imagesContainer.style.flex = "1 1 auto";
        imagesContainer.style.maxWidth = "30vw";
        imagesContainer.style.paddingBottom = "1.5vh";
        imagesContainer.style.width = "fit-content";
        imagesContainer.style.display = "flex";
        imagesContainer.style.flexDirection = "column";
        imagesContainer.style.alignItems = "center";
        
        imagesContainer.appendChild(image2023);
        imagesContainer.appendChild(caption2023);
        imagesContainer.appendChild(imageCurrent);
        imagesContainer.appendChild(captionCurrent);
        imagesContainer.classList.add("custom-style");

        document.querySelector("style").innerText = "@media(orientation:portrait){\
            .custom-style{max-width:86.5vw !important; width:86.5vw !important;}\
        }";
        content_div.appendChild(imagesContainer);
    });
}

function loadSponsorspage(){
    loadPage();
}

function loadDocumentationpage(){
    new Promise(loadPage).then(()=>{
        content_div.style.flexDirection = "column";
        let programmingHeader = document.createElement("h1");
        programmingHeader.innerHTML = "Programming:";
        content_div.appendChild(programmingHeader);
        let itemArray = [];
        itemArray.push(new ItemBuilder(content_div, "Init:", 
        "Lorem Ipsum").build());
        itemArray.push(new ItemBuilder(content_div, "OpMode Movement:", 
        "Lorem Ipsum (gm0.org)").build());
        itemArray.push(new ItemBuilder(content_div, "CV:", 
        "Lorem Ipsum").build());
        itemArray.forEach((x)=>{x.render()});
        
        let cadHeader = document.createElement("h1");
        cadHeader.innerHTML = "CAD:";
        content_div.appendChild(cadHeader);
        itemArray = [];
        itemArray.push(new ItemBuilder(content_div, "Software to use:", "Lorem Ipsum").build());
        itemArray.forEach((x)=>{x.render()});
        
        let buildHeader = document.createElement("h1");
        buildHeader.innerHTML = "Building:";
        content_div.appendChild(buildHeader);
        itemArray = [];
        itemArray.push(new ItemBuilder(content_div, "Useful resources:", "Lorem Ipsum").build());
        itemArray.forEach((x)=>{x.render()});
    });
}

function openSideMenu(){
    sideBarAnimated = true;
    sidebar.classList.remove("staticSidebarClosed")
    titleBar.classList.remove("staticContentClosed")
    sidebar.classList.remove("staticSidebar")
    titleBar.classList.remove("staticContent")
    if(sidebarOpen){
        closeSidebar();
    } else if(!sidebarOpen){
        openSidebar();
    }
}

function openSidebar(){  
    sidebarOpen = true;
    titleBar.classList.remove("growContent");
    sidebar.classList.remove("closeSidebar");
    sidebar.classList.add("openSidebar");
    titleBar.classList.add("shrinkContent");
    content_div.classList.remove("growContent");
    content_div.classList.add("shrinkContent");
    if(window.matchMedia("(orientation:portrait)").matches) document.body.style.overflow = "hidden";
}

function closeSidebar(){
    titleBar.classList.remove("shrinkContent");
    sidebar.classList.remove("openSidebar");
    titleBar.classList.add("growContent");
    sidebar.classList.add("closeSidebar");
    content_div.classList.remove("shrinkContent");
    content_div.classList.add("growContent");
    document.body.style.overflow = "visible";
    sidebarOpen = false;
}


window.addEventListener("resize", function() {
    if(window.matchMedia("(orientation:portrait)").matches) return;
    sideBarAnimated = false;
    if(!sidebarOpen) {
        sidebar.classList.remove("closeSidebar");
        sidebar.classList.add("staticSidebarClosed");
        titleBar.classList.remove("growContent")
        titleBar.classList.add("staticContentClosed")
    } else if(sidebarOpen){
        sidebar.classList.remove("openSidebar");
        sidebar.classList.add("staticSidebar");
        titleBar.classList.remove("shrinkContent")
        titleBar.classList.add("staticContent")
    }
  });
