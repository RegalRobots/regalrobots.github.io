import*as navigation from"/navigation/navigation.js";new Promise(navigation.loadPage).then((n=>{document.getElementById("links").classList.add("selected-link"),n.classList.add("flex-column");const e=document.createElement("h1");e.classList.add("large-title"),e.innerHTML="Important Links",n.appendChild(e);const t=new navigation.ItemArray;fetch("importantLinksPage.json").then((n=>n.json())).then((e=>{t.buildPageFromJson(e,n),t.render()}))}));