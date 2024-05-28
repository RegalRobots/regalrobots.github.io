/* Place your JavaScript in this file */
"use strict";
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
    sidebarOpen = true;
}

function closeSidebar(){
    titleBar.classList.remove("shrinkTopbar");
    sidebar.classList.remove("openSidebar");
    titleBar.classList.add("growTopbar");
    sidebar.classList.add("closeSidebar");
    sidebarOpen = false;
}

function loadPage(){
    fetch('component.txt')
    .then(response => response.text())
    .then(text => {
            document.body.innerHTML = text;
            sidebar = document.getElementById("sidebarDiv");
            titleBar = document.getElementById("topDiv");
            sidebarOpen = false;
            sideBarAnimated = true;
        }
    )
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
