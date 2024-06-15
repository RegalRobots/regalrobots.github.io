/* Place your JavaScript in this file */
"use strict";
let sidebar;
let titleBar;
let sidebarOpen;
let sideBarAnimated;
let content_div;

class Item{
    title;
    content;
    constructor(title, content){
        this.title = title;
        this.content = content;
    }
    
    render(parentDiv, imagePath = null, imageCaptionText = null) {
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
        item.style.minWidth = "38vw";
        item.style.maxWidth = "86.5vw";
        item.style.overflow = "hidden";
        parentDiv.appendChild(item);
        if(imagePath !== null && imageCaptionText !== null){
            let imageDiv = document.createElement("div");
            imageDiv.style.float = "right";

            let imageCaption = document.createElement("h5")
            imageCaption.innerHTML = imageCaptionText;

            let sideImage = document.createElement("img");
            sideImage.src = imagePath;
            imageDiv.appendChild(sideImage);
            imageDiv.appendChild(imageCaption);

            item.appendChild(imageDiv);
        }
        item.appendChild(header);
        item.appendChild(caption);
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
        itemArray.push(new Item("New website up and running!", 
        "Hello world! This is our website made ahead of the 2024-2025 season of the FTC robotics competition!"));
        itemArray.forEach((x)=>{x.render(content_div)});
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
        content_div.appendChild(item);
        item.appendChild(header);
        item.appendChild(caption);
        item.classList.add("custom-style");
        
        let image2023 = document.createElement("img");
        image2023.src = "2023group_photo.jpg";
        image2023.style.width = "95%";
        image2023.style.padding = "0.75vw 0.75vw 0vh";
        
        let caption2023 = document.createElement("h4");
        caption2023.innerHTML = "Our team in the 2023-2024 season.";
        
        let imageCurrent = document.createElement("img");
        // imageCurrent.src = "group_photo.jpg";
        let captionCurrent = document.createElement("h4");
        captionCurrent.innerHTML = "Our current team.";
        
        let imagesContainer = document.createElement("aside");
        imagesContainer.style.background = "#5268A566";
        imagesContainer.style.flex = "1 1 auto";
        imagesContainer.style.maxWidth = "30vw";
        imagesContainer.style.width = "fit-content";
        
        
        imagesContainer.appendChild(image2023);
        imagesContainer.appendChild(caption2023);
        imagesContainer.appendChild(imageCurrent);
        imagesContainer.appendChild(captionCurrent);
        image2023.classList.add("custom-style");
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
        itemArray.push(new Item("Init:", 
        "Lorem Ipsum"));
        itemArray.push(new Item("OpMode Movement:", 
        "Lorem Ipsum (gm0.org)"));
        itemArray.push(new Item("CV:", 
        "Lorem Ipsum"));
        itemArray.forEach((x)=>{x.render(content_div)});
        
        let cadHeader = document.createElement("h1");
        cadHeader.innerHTML = "CAD:";
        content_div.appendChild(cadHeader);
        itemArray = [];
        itemArray.push(new Item("Software to use:", "Lorem Ipsum"));
        itemArray.forEach((x)=>{x.render(content_div)});
        
        let buildHeader = document.createElement("h1");
        buildHeader.innerHTML = "Building:";
        content_div.appendChild(buildHeader);
        itemArray = [];
        itemArray.push(new Item("Useful resources:", "Lorem Ipsum"));
        itemArray.forEach((x)=>{x.render(content_div)});
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
