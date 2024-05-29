/* Place your JavaScript in this file */

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
        header.style.background = "#A167A5";
        header.style.padding = "0.5vw 0.5vw 0vw 0.5vw";
        header.style.margin = "0vw";
        var caption = document.createElement("p");
        caption.style.display = "inline";
        caption.style.background = "#5268A5";
        caption.style.padding = "0.5vw 0.5vw 2vw 0.5vw";
        caption.style.maxWidth = "35vw";
        caption.style.margin = "0vw";
        caption.innerHTML = this.content;
        var item = document.createElement("div");
        item.style.display = "grid";
        document.getElementById(parentDiv).appendChild(item);
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

function loadPage(){
    fetch('navigation.txt')
    .then(response => response.text())
    .then(text => {
            document.body.innerHTML = text;
            sidebar = document.getElementById("sidebarDiv");
            titleBar = document.getElementById("topDiv");
            content = document.getElementById("content");
            sidebarOpen = false;
            sideBarAnimated = true;
            var itemArray = new ItemCollection();
            itemArray.add(new Item("New website up and running!", 
            "Hello world! This is our website made to be ready for the 2024-2025 season of the FTC robotics competition!"));
            itemArray.add(new Item("About us", "..."));
            itemArray.forEach((x)=>{x.render("content")});}
    )
}

var sidebar;
var titleBar;
var sidebarOpen;
var sideBarAnimated;


function openSideMenu(){
    sideBarAnimated = true;
    sidebar.classList.remove("staticSidebarClosed")
    titleBar.classList.remove("staticTopbarClosed")
    sidebar.classList.remove("staticSidebar")
    titleBar.classList.remove("staticTopbar")
    if(sidebarOpen){
        closeSidebar();
    } else if(!sidebarOpen){
        openSidebar();
    }
}

function openSidebar(){
    titleBar.classList.remove("growTopbar");
    sidebar.classList.remove("closeSidebar");
    sidebar.classList.add("openSidebar");
    titleBar.classList.add("shrinkTopbar");
    content.classList.remove("growTopbar");
    content.classList.add("shrinkTopbar");
    sidebarOpen = true;
}

function closeSidebar(){
    titleBar.classList.remove("shrinkTopbar");
    sidebar.classList.remove("openSidebar");
    titleBar.classList.add("growTopbar");
    sidebar.classList.add("closeSidebar");
    content.classList.remove("shrinkTopbar");
    content.classList.add("growTopbar");
    sidebarOpen = false;
}


window.addEventListener("resize", function() {
    console.log("RESIZE")
    sideBarAnimated = false;
    if(!sidebarOpen) {
        console.log("BLOCKED FROM TRANSITION")        
        sidebar.classList.remove("closeSidebar");
        sidebar.classList.add("staticSidebarClosed");
        titleBar.classList.remove("growTopbar")
        titleBar.classList.add("staticTopbarClosed")
    } else if(sidebarOpen){
        console.log("BLOCKED FROM TRANSITION")
        sidebar.classList.remove("openSidebar");
        sidebar.classList.add("staticSidebar");
        titleBar.classList.remove("shrinkTopbar")
        titleBar.classList.add("staticTopbar")
    }
  })

