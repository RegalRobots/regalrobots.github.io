"use strict";import*as navigation from"/navigation/navigation.js";class ItemQueue extends navigation.ItemArray{push(e){this.splice(0,0,e)}}new Promise(navigation.loadPage).then((e=>{fetch("/home-page/homePage.json").then((e=>e.json())).then((n=>{document.getElementById("home").classList.add("selected-link"),e.classList.add("home-content"),(new ItemQueue).buildPageFromJson(n,e).render()}))}));