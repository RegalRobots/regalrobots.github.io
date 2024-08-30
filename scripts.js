/* Place your JavaScript in this file */
"use strict";
let sidebar;
let titleBar;
let sidebarOpen;
let content_div;

let applyAttributes = (attributeObj, item) => {if(attributeObj) 
    Object.keys(attributeObj).forEach((key)=>{item.setAttribute(key, attributeObj[key])})};

class Item {
    parentDiv;
    title;
    content;
    imagePath;
    imageCaptionText;
    list;
    addToContent;
    imageAttrs;
    cardAttrs;
    alt;
    constructor(itemBuilder) {
        this.parentDiv = itemBuilder.parentDiv;
        this.title = itemBuilder.title;
        this.content = itemBuilder.content;
        this.imagePath = itemBuilder.imagePath;
        this.imageCaptionText = itemBuilder.imageCaptionText;
        this.list = itemBuilder.list;
        this.addToContent = itemBuilder.addToContent;
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
        img.tabIndex = 0;
    
        const caption = document.createElement("h3");
        caption.innerHTML = text;
    
        const ImageWithCaption = document.createElement("div")
        ImageWithCaption.title = "Click to fullscreen image";
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
            if(e.code === "Enter") fullScreenImg();
        });

        document.addEventListener("keyup", (e) => {
            if(e.code === "Enter" && document.fullscreenElement) document.exitFullscreen();
        });

        return ImageWithCaption;
    }
    
    createContentCaption() {
        const caption = document.createElement("p");
        caption.classList.add("caption");
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
            imageDiv.classList.add("caption-image");
            caption.insertAdjacentElement('afterbegin', imageDiv);
        }

        this.parentDiv.appendChild(this.item);
    }

    toggleHide() {
        this.item.style.display = this.item.style.display == "none" ? "" : "none";
    }
}

class ItemBuilder {
    parentDiv;
    title;
    content;
    imagePath;
    imageCaptionText;
    list;
    addToContent;
    cardAttrs;
    imageAttrs;
    titleAttrs;
    alt;
    constructor(parentDiv, cardAttrs=null) {
        this.parentDiv = parentDiv;
        this.title = null;
        this.content = null;
        this.imagePath = null;
        this.imageCaptionText = null;
        this.addToContent = null;
        this.imageAttrs = null;
        this.cardAttrs = cardAttrs;
        this.titleAttrs = null;
        this.alt = null;
    }
    
    addTitle(title, attrs=null){
        this.title = title;
        this.titleAttrs = attrs;
        return this;
    }

    addContent(content, attrs=null) {
        this.content = content;
        this.captionAttrs = attrs;
        return this;
    }

    addList(list, addToContent=true) {
        this.list = list;
        this.addToContent = addToContent;
        return this;
    }

    addImage(imagePath, imageCaptionText, altText, attrs=null) {
        this.imagePath = imagePath;
        this.imageCaptionText = imageCaptionText;
        this.imageAttrs = attrs;
        this.altText = altText;
        return this;
    }

    build() {
        return new Item(this);
    }
}

class Queue extends Array {
    constructor() {
        super(1);
    }
    push(item) {
        this.splice(0, 0, item);
    }
}


function loadPage(resolve, reject) {
    fetch('navigation.txt')
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

            resolve(content_div);
        }
        ).catch(() => { reject(); });
}

function loadHomepage() {
    new Promise(loadPage).then((content_div) => {
        document.getElementById("home").classList.add("selected-link");
        content_div.classList.add("home-content");

        const itemArray = new Queue();
        itemArray.push(new ItemBuilder(content_div).addTitle("New website up and running!").addContent(
            "Hello world! This is our website made ahead of the 2024-2025 season of the FTC robotics competition!"));
        itemArray.push(new ItemBuilder(content_div).addTitle("New Logo!").addContent(
            "Say hello to our new logo now on both the website and our various accounts!"
        ).addImage("Assets/Icons/favicon.svg", "Our Logo", "Our new Logo", {class:"home-image"}));
        itemArray.push(new ItemBuilder(content_div).addTitle("Contact Us Page Operational!").addContent(
            "Our <a class=outside-link href=contact-us.html>Contact Us</a> page is now operational. Navigate there through the \
            side menu to check it out!"));
        itemArray.push(new ItemBuilder(content_div).addTitle("New Season!").addContent(
            "As the new season 'Into the Deep' begins, we are very excited to begin a new chapter in the story of our team!"));
        itemArray.forEach((x) => {x.build().render()});
    });
}


function loadAboutpage() {
    new Promise(loadPage).then((content_div) => {
        document.getElementById("about-us").classList.add("selected-link");

        const header = document.createElement("h1");
        header.innerHTML = "About us: What is FTC Robotics and our Regal Robotics Team?";

        const caption = Item.prototype.createContentTitle();
        caption.innerHTML = "The First Tech Challenge is a competition between different robotics teams across \
        the globe, split across different leagues and districts. In this competition, the teamwork, ingenuity, \
        innovation, and the creativity of these different teams are pitted against each other as every team \
        struggles to put together a robot that completes a variety of tasks in time before they face off against \
        other teams. <br>\
        Our team was created in 2023 in time for the Powerplay season from 2023-2024. We started out with very \
        little other than the knowledge of the others in our school robotics club, a driving station, some old spare \
        tools from other teams in our school, and a drivertrain kit from goBilda. Starting with what we started with, \
        we did not do terrible, but instead peaked at 4th place in our regional competition. We hope to do even better \
        starting in the 2024-2025 season starting with the creation of this very website! Not only do we hope to do \
        better this season but to be able to preserve as much knowledge and experience as possible through the \
        documentation on this website and through our our school-wide robotics club and this junior team.";
        caption.classList.add("caption");
        caption.classList.add("about-us-caption");

        const item = Item.prototype.createCardItem();

        item.appendChild(header);
        item.appendChild(caption);
        content_div.appendChild(item);

        const image2023 = Item.prototype.createImageWithCaption("Our team in the 2023-2024 season.", "Assets/Group_Photos/2023group_photo.jpg")
        const imageCurrent = Item.prototype.createImageWithCaption("Our current team.", "Assets/Group_Photos/2023group_photo.jpg")

        const imagesContainer = document.createElement("aside");
        imagesContainer.classList.add("images-container")
        imagesContainer.classList.add("about-us-images")

        imagesContainer.appendChild(image2023);
        imagesContainer.appendChild(imageCurrent);
        content_div.appendChild(imagesContainer);
    });
}

function loadSponsorspage() {
    new Promise(loadPage).then((content_div) => {
        document.getElementById("sponsors").classList.add("selected-link");

        let sponsorUsDiv = document.createElement("div");
        let thankSponsorsDiv = document.createElement("div");
        content_div.appendChild(sponsorUsDiv);
        content_div.appendChild(thankSponsorsDiv);
    });
}

function loadDocumentationpage() {
    new Promise(loadPage).then((content_div) => {
        document.getElementById("documentation").classList.add("selected-link");

        content_div.classList.add("flex-column");
        content_div.classList.add("documentation-content");

        const docNavBar = document.createElement("div");
        docNavBar.id = "documentation-navbar";

        const docNavBarAnchorContainer = document.createElement("div");
        docNavBarAnchorContainer.id = "navbar-anchor-container";

        docNavBar.appendChild(docNavBarAnchorContainer);

        function createHeader(title, id) {
            const header = document.createElement("h1");
            header.innerHTML = title;
            header.id = id;
            header.classList.add("documentation-header");
            addToDocNavBar(id, title);
            return header;
        }

        function addToDocNavBar(id, name){
            const anchor = document.createElement("a");
            const copyToastContainer = document.createElement("div");
            const copyToastContent =  document.createElement("div");
            copyToastContainer.appendChild(copyToastContent);

            anchor.classList.add("documentation-nav-links");
            anchor.classList.add("outside-link");
            anchor.innerHTML = name;
            anchor.href = "./documentation.html#" + id;
            
            
            copyToastContainer.classList.add("copy-toast-container");
            copyToastContent.classList.add("copy-toast-content");
            
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
                if (writeClipboardText(anchor.href)) copyToastContent.textContent = "Copied to clipboard.";
                else copyToastContent.textContent = "Could not copy to clipboard.";
                setTimeout(() => {copyToastContainer.classList.remove("show-toast");}, 2000);
            });
            docNavBarAnchorContainer.appendChild(copyToastContainer);
            docNavBarAnchorContainer.appendChild(anchor);
        }

        function createCollapseButton(header, informationList) {
            const collapseIcon = document.createElement("button");
            collapseIcon.ariaLabel = "Collapse Header";
            header.insertAdjacentElement("beforeend", collapseIcon);
            collapseIcon.classList.add("svg-button");
            collapseIcon.classList.add("collapse-button");
            collapseIcon.addEventListener("click", () => {
                collapseIcon.classList.toggle("collapse-button-close")
                informationList.forEach((elem) =>{elem.toggleHide();});
            });
            return collapseIcon;
        }        
        
        const overviewHeader = document.createElement("h1");
        overviewHeader.innerHTML = "How does an FTC game work?";
        overviewHeader.id = "how-ftc-game-works";
        addToDocNavBar(overviewHeader.id, "How an FTC game works");
        
        const overviewText = Item.prototype.createContentCaption();
        overviewText.innerHTML = "The First Tech Challenge is made up of two different periods where both you and your allied team face an alliance \
        of two other teams. These periods are an autonomous mode and a TeleOp mode. Every game starts in the autonomous mode which is active for 30 \
        seconds and in this period the robot must run a preset program without human input to complete tasks and objectives within the bounds of the \
        game. Then the 2:30 minute TeleOp mode begins where players must control their robot with game controllers to complete tasks and score points \
        as fast as possible. The last 30 seconds of the TeleOp mode constitute the endgame time where special rules apply and it is possible to score \
        more points. To see a more in depth explanation of this year's game check out \
        <a class=outside-link aria-label=\"Check out this year's game manuals\" target=_blank href=https://www.firstinspires.org/resource-library/ftc/game-and-season-info>the game manuals</a>.";
        
        const overviewCard = Item.prototype.createCardItem();
        overviewCard.appendChild(overviewHeader);
        overviewCard.appendChild(overviewText);
        
        const programmingHeader = createHeader("How do you program for FTC?", "programming-guide");
        let programmingItemArray = [];

        programmingItemArray.push(new ItemBuilder(content_div).addTitle("Overview:").addContent(
            "When programming a robot for the First Tech Challenge, one must use Android Studio, a REV \
            driver hub (tablet), and a REV control hub. So, how does code from a computer program a robot's movements in TeleOp and autonomous modes?\
            Code is pushed from a computer running Android Studio to the REV control hub which has motors, servos, sensors, and other hardware parts\
            plugged into it via different colorful cables. So, the REV control hub is attached to the rest of the robot on the actual drivetrain and\
            code is pushed to it from a computer using Android Studio software. The driver hub serves as the human interface for running code already \
            uploaded onto the robot. This means that the driver hub is where controllers are plugged in, camera systems can be checked, telemetry is read,\
            and where different OpModes are run from with a simple GUI."));

        programmingItemArray.push(new ItemBuilder(content_div).addTitle("Getting Started:").addContent(
            "To get started fork <a class=outside-link aria-label=\"Fork this year's github sdk\" \
            target=_blank href=https://github.com/FIRST-Tech-Challenge/FtcRobotController>the ftc sdk</a> and \
            copy the link to the fork to paste it into Android Studio (Create new project > Get from VCS > Paste link > Clone). \
            Note you need to have <a class=outside-link aria-label=\"Download Git here to use it \
            in Android Studio\" target=_blank href=https://git-scm.com/downloads>git downloaded</a>. By doing this you \
            will get your own version of the interface to the robotics parts to mess with.\
            <br>\
            Once you have this repository in your Android Studio, navigate to TeamCode and go through the various folders and make three files \
            at the end: <code>Hardware.java</code>, <code>TeleOp.java</code>, <code>Auto.java</code>. This is where you will write your code, but you\
            would only want your <code>Teleop</code> and <code>Auto</code> classes to be runnable from the driver hub tablet."));
        
        programmingItemArray.push(new ItemBuilder(content_div).addTitle("Init:").addContent(
            "By this stage in the robotics game, no robots have moved and controllers are left alone. In the program, this is where all hardware \
            needs to be initialized (hence the name) into the program. Usually code initializing hardware is written into an <code>init()</code> method\
            in the <code>Hardware</code> class (file)."));
            
        programmingItemArray.push(new ItemBuilder(content_div).addTitle("OpMode Movement:").addContent(
            " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu turpis sed libero placerat pretium. Sed et metus cursus, faucibus augue \
            vitae, posuere turpis. Sed iaculis, libero ac tempor porttitor, sem dui consequat sem, sit amet fringilla erat mauris varius leo. Donec \
            sollicitudin bibendum sem, at maximus arcu consectetur vel. Cras vestibulum urna id dolor efficitur pulvinar. Integer cursus tortor sit \
            amet purus finibus, at ullamcorper nibh feugiat. Integer tempor dolor sed lectus accumsan mollis. Proin quis purus auctor, congue mauris \
            a, placerat ipsum. Pellentesque facilisis blandit purus, in tempor quam posuere a. Suspendisse ut mollis felis. Aenean sit amet eros \
            pharetra, fringilla felis nec, imperdiet nisl. Morbi purus massa, aliquet vitae lorem sed, vehicula eleifend lectus. Nulla molestie odio \
            a turpis pharetra, sed interdum arcu tempor. Aliquam condimentum, lorem quis tempor condimentum, lectus magna scelerisque est, quis gravida \
            felis urna eu massa. <br/><br/>\
            Nulla quis vestibulum sapien. Nulla varius ultricies mollis. Aenean eget sapien condimentum, aliquam ipsum sed, placerat tortor. Nulla facilisi. \
            Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas metus arcu, interdum vitae lobortis id, \
            accumsan nec arcu. Mauris nunc velit, volutpat at nunc consequat, ultricies tristique ligula. "
        ).addImage("Assets/Images/Mecannum.png", "How Mecannum wheels move (fig. 1)", 
            `To drive forward, backward, or to strafe, the left slant wheels move together and the
            right slant wheels move together. However to rotate skid-steer style, the left slant
            wheels move counter to one another as do the right slant wheels - this requires four
            separate channels on your motor controller.`));
            
        programmingItemArray.push(new ItemBuilder(content_div).addTitle("CV:").addContent(
            "Lorem Ipsum"));
            
        const cadHeader = createHeader("How do you CAD for FTC?", "cad-guide");        
        let cadItemArray = [];
                
        cadItemArray.push(new ItemBuilder(content_div).addTitle("Software to use:").addContent("Lorem Ipsum"));
        
        const buildHeader = createHeader("How do you build for FTC?", "build-guide");
        let buildingItemArray = [];

        buildingItemArray.push(new ItemBuilder(content_div).addTitle("Useful resources:").addContent("Lorem Ipsum"));


        document.body.appendChild(docNavBar);
        content_div.appendChild(overviewCard);

        content_div.appendChild(programmingHeader);
        programmingItemArray = programmingItemArray.map((x) => {return x.build();});        
        createCollapseButton(programmingHeader, programmingItemArray);
        programmingItemArray.forEach((elem) => {elem.render();})
        
        content_div.appendChild(cadHeader);
        cadItemArray = cadItemArray.map((x) => {return x.build();});        
        createCollapseButton(cadHeader, cadItemArray);
        cadItemArray.forEach((x) => {x.render()});
        
        content_div.appendChild(buildHeader);
        buildingItemArray = buildingItemArray.map((x) => {return x.build();});        
        createCollapseButton(buildHeader, buildingItemArray);
        buildingItemArray.forEach((x) => {x.render()});
    });
}

function loadContactUspage() {
    new Promise(loadPage).then((content_div) => {
        document.getElementById("contact-us").classList.add("selected-link");

        content_div.classList.add("flex-column");

        const pageTitle = document.createElement("h1");

        const contactUsContentDiv = document.createElement("div");

        const otherContactsDiv = document.createElement("div");
        const otherContactsText = Item.prototype.createContentCaption();

        const formDiv = document.createElement("div");
        const form = document.createElement("iframe");

        const discordWidgetDiv = document.createElement("div");
        const discordWidget = document.createElement("iframe");

        pageTitle.innerHTML = "CONTACT US";
        pageTitle.id = "contact-us-title";

        otherContactsDiv.id = "other-contacts-div";

        otherContactsText.id = "contact-us-text";
        otherContactsText.innerHTML = `You can contact us through various means, please find which method is most 
        convenient for you. <br><br>
        You can contact us via our email: 
        <a class="outside-link" target=_blank href=mailto:24702regalrobots@gmail.com>24702regalrobots@gmail.com</a>,<br><br>
        you can message our instagram account: 
        <a class= "outside-link" target=_blank href=https://www.instagram.com/regalrobots/>regal robots</a>,<br><br>
        <a class="outside-link" target=_blank href=https://discord.gg/Avy2Zf9r>join our discord server</a> by clicking on the widget below,<br><br>
        or you can complete the form to the side and we will promptly receive your message.`;
        otherContactsDiv.appendChild(otherContactsText);

        form.src = "https://docs.google.com/forms/d/e/1FAIpQLScNBoul0k6i3fpKjC-CMVM2zc7ZCeh-rKvGRAPyI4UuYvx4Tg/viewform?embedded=true";
        form.id = "contact-us-form";
        form.width = "100%";
        form.height = "600";
        form.frameBorder = "0";
        form.marginHeight = "0";
        form.marginWidth = "0";
        form.innerHTML = "Loading…";

        formDiv.id = "form-div";
        formDiv.appendChild(form);
        formDiv.classList.add("iframe-wrapper");

        discordWidget.src = "https://discord.com/widget?id=1266328894735126618&theme=dark";
        discordWidget.width = "100%";
        discordWidget.height = "500";
        discordWidget.frameBorder = "0";
        discordWidget.marginHeight = "0";
        discordWidget.marginWidth = "0";
        discordWidget.sandbox = "allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts";

        discordWidgetDiv.appendChild(discordWidget);
        discordWidgetDiv.classList.add("iframe-wrapper");

        contactUsContentDiv.appendChild(otherContactsDiv);
        contactUsContentDiv.appendChild(formDiv);
        otherContactsDiv.appendChild(discordWidgetDiv);
        contactUsContentDiv.id = "contact-us-content";

        content_div.appendChild(pageTitle);
        content_div.appendChild(contactUsContentDiv);
    });
}

function loadImportantLinkspage() {
    new Promise(loadPage).then((content_div) => {
        document.getElementById("links").classList.add("selected-link");

        content_div.classList.add("flex-column");

        const importantLinksHeader = document.createElement("h1");
        importantLinksHeader.classList.add("large-title");
        importantLinksHeader.innerHTML = "Important Links";

        content_div.appendChild(importantLinksHeader);
    
        const followUsLinks = new ItemBuilder(content_div).addTitle("Follow Us Here:").addList([
            "<a class=outside-link target=_blank href=https://www.facebook.com/profile.php?id=61563126485686>Facebook</a>",
            "<a class=outside-link target=_blank href=https://www.instagram.com/regalrobots>Instagram</a>",
            "<a class=outside-link target=_blank href=https://github.com/RegalRobots>Github</a>",
            "<a class=outside-link target=_blank href=https://www.youtube.com/@RegalRobots>Youtube</a>"
        ]).build();
        followUsLinks.render();
        const contactUsLinks = new ItemBuilder(content_div).addTitle("Contact Us Here:").addList([
            "<a class=outside-link target=_blank href=mailto:24702regalrobots@gmail.com>24702regalrobots@gmail.com</a>",
            "<a class=outside-link target=_blank href=https://www.instagram.com/regalrobots>Instagram</a>",
            "<a class=outside-link target=_blank href=https://discord.gg/Avy2Zf9r>Discord</a>",
            "<a class=outside-link target=_blank href=https://docs.google.com/forms/d/e/1FAIpQLScNBoul0k6i3fpKjC-CMVM2zc7ZCeh-rKvGRAPyI4UuYvx4Tg/viewform>Google Forms</a>"
        ]).build();
        contactUsLinks.render();
        const forOurMembers = new ItemBuilder(content_div).addTitle("For Members:").addList([
            "<a class=outside-link target=_blank href=>This Year's Github Repository</a>",
            "<a class=outside-link target=_blank href=https://drive.google.com/drive/folders/1-O-36OPSPy68EVvZNUkGn2VLgfqbVDlj?usp=sharing>Request Access to the Google Drive</a>",
            "<a class=outside-link target=_blank href=https://discord.gg/Avy2Zf9r>Discord</a>"
        ]).build();
        forOurMembers.render();
    });
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
