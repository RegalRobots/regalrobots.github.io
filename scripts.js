/* Place your JavaScript in this file */
"use strict";
var sidebar;
var titleBar;
var sidebarOpen;
var sideBarAnimated;
var content_div;

class Item{
    title;
    content;
    constructor(title, content){
        this.title = title;
        this.content = content;
    }
    
    render(parentDiv) {
        var header = document.createElement("h2");
        header.innerHTML = this.title;
        header.style.display = "inline";
        header.style.overflow = "hidden";
        header.style.background = "#A167A5";
        header.style.padding = "0.5vw 0.5vw 2vh";
        header.style.margin = "0vw";
        var caption = document.createElement("p");
        caption.style.display = "inline";
        caption.style.overflow = "hidden";
        caption.style.background = "#5268A566";
        caption.style.padding = "0.5vw 0.5vw 2vw";
        caption.innerHTML = this.content;
        var item = document.createElement("div");
        item.style.display = "grid";
        item.style.minWidth = "38vw";
        item.style.maxWidth = "86.5vw";
        item.style.overflow = "hidden";
        item.style.height = "min-content";
        parentDiv.appendChild(item);
        item.appendChild(header);
        item.appendChild(caption);
    }
}

class ItemCollection extends Array{
    constructor(){
        super(1);
    }
    add(item){
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
    )
}

function loadHomepage(){
    new Promise(loadPage).then(()=>{
        var itemArray = new ItemCollection();
        itemArray.add(new Item("New website up and running!", 
        "Hello world! This is our website made ahead of the 2024-2025 season of the FTC robotics competition!"));
        itemArray.forEach((x)=>{x.render(content_div)});
    });
}

function loadAboutpage(){
    new Promise(loadPage).then(() => {
        var header = document.createElement("h1");
        header.innerHTML = "About us!";
        header.id = "aboutUsHeader";
        header.style.display = "inline";
        header.style.overflow = "hidden";
        header.style.background = "#A167A5";
        header.style.padding = "0.5vw 0.5vw 0vw 0.5vw";
        header.style.margin = "0vw";
        var caption = document.createElement("h2");
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
        var item = document.createElement("div");
        item.style.display = "grid";
        item.style.minWidth = "38vw";
        item.style.maxWidth = "55.5vw";
        item.style.overflow = "hidden";
        content_div.appendChild(item);
        item.appendChild(header);
        item.appendChild(caption);
        item.classList.add("custom-style");
        
        var image2023 = document.createElement("img");
        image2023.src = "2023group_photo.jpg";
        image2023.style.maxWidth = "30vw";
        var image2023container = document.createElement("aside");
        image2023container.style.background = "#5268A566";
        image2023container.style.flex = "1 1 auto";
        image2023container.style.maxWidth = "30vw";
        image2023container.style.width = "fit-content";
        var caption2023 = document.createElement("h4");
        caption2023.innerHTML = "Our team in the 2023-2024 season.";
        image2023container.appendChild(image2023);
        image2023container.appendChild(caption2023);
        var imageCurrent = document.createElement("img");
        // image2023.src = "2023group_photo.jpg";
        var captionCurrent = document.createElement("h4");
        captionCurrent.innerHTML = "Our current team.";
        image2023container.appendChild(imageCurrent);
        image2023container.appendChild(captionCurrent);
        image2023.classList.add("custom-style");
        image2023container.classList.add("custom-style");

        document.querySelector("style").innerText = "@media(orientation:portrait){\
            .custom-style{max-width:86.5vw !important; width:86.5vw !important;}\
        }";
        content_div.appendChild(image2023container);
    });
}

function loadSponsorspage(){
    loadPage();
}

function loadDocumentationpage(){
    loadPage();
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
