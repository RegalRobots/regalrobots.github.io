/* Place your JavaScript in this file */
"use strict";
let sidebar;
let titleBar;
let sidebarOpen;
let content_div;

function createCardItem(){
    const item = document.createElement("div");
    item.classList.add("card-div");
    item.classList.add("portrait-width");
    return item;
}

function createImageWithCaption(text, imgPath){
    const img = document.createElement("img");
    img.src = imgPath;

    const caption = document.createElement("h4");
    caption.innerHTML = text;

    const ImageWithCaption = document.createElement("div")
    ImageWithCaption.appendChild(img);
    ImageWithCaption.appendChild(caption);
    ImageWithCaption.classList.add("image-with-caption");

    return ImageWithCaption;
}

function createContentCaption(){
    const caption = document.createElement("p");
    caption.classList.add("caption");
    return caption;
}

function createContentTitle(){
    const title = document.createElement("h2");
    title.classList.add("default-padding");
    return title;
}

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
        const header = createContentTitle();
        header.innerHTML = this.title;
        const caption = createContentCaption();
        caption.innerHTML = this.content;
        const item = createCardItem();

        this.parentDiv.appendChild(item);
        if(this.imagePath !== null && this.imageCaptionText !== null){
            const imageDiv = createImageWithCaption(this.imageCaptionText, this.imagePath);
            imageDiv.classList.add("caption-image");            
            caption.insertAdjacentElement('afterbegin', imageDiv);
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
        sidebar = document.getElementById("sidebar");
        titleBar = document.getElementById("top-div");
        content_div = document.getElementById("content");
        sidebarOpen = false;
        if(window.matchMedia("not (orientation:portrait)").matches) openSidebar();
        content_div.addEventListener("click", ()=>{
            if(window.matchMedia("(orientation:portrait)").matches) closeSidebar();
        });
        resolve(content_div);
    }
    ).catch(()=>{reject();});
}

function loadHomepage(){
    new Promise(loadPage).then((content_div)=>{
        document.getElementById("home").classList.add("selectedLink");
        
        const itemArray = new Queue();
        itemArray.push(new ItemBuilder(content_div, "New website up and running!", 
        "Hello world! This is our website made ahead of the 2024-2025 season of the FTC robotics competition!").build());
        itemArray.forEach((x)=>{x.render()});
    });
}

function loadAboutpage(){
    new Promise(loadPage).then((content_div) => {
        document.getElementById("about-us").classList.add("selectedLink");

        const header = document.createElement("h1");
        header.innerHTML = "About us!";

        const caption = createContentTitle();
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

        const item = createCardItem();
        
        item.appendChild(header);
        item.appendChild(caption);
        content_div.appendChild(item);
        
        const image2023 = createImageWithCaption("Our team in the 2023-2024 season.", "Assets/Group_Photos/2023group_photo.jpg")
        const imageCurrent = createImageWithCaption("Our current team.", "Assets/Group_Photos/2023group_photo.jpg")
        
        const imagesContainer = document.createElement("aside");
        imagesContainer.classList.add("images-container")

        imagesContainer.appendChild(image2023);
        imagesContainer.appendChild(imageCurrent);
        imagesContainer.classList.add("portrait-width");
        content_div.appendChild(imagesContainer);
    });
}

function loadSponsorspage(){
    new Promise(loadPage).then((content_div) => {
        document.getElementById("sponsors").classList.add("selectedLink");
    });
}

function loadDocumentationpage(){
    new Promise(loadPage).then((content_div)=>{
        document.getElementById("documentation").classList.add("selectedLink");

        content_div.classList.add("flex-column");

        const overviewHeader = document.createElement("h1");
        overviewHeader.innerHTML = "Overview:";

        const overviewText = createContentCaption();
        overviewText.innerHTML = "The First Tech Challenge is made up of two different periods where both you and your allied team face an alliance \
        of two other teams. These periods are an autonomous mode and a TeleOp mode. Every game starts in the autonomous mode which is active for 30 \
        seconds and in this period the robot must run a preset program without human input to complete tasks and objectives within the bounds of the \
        game. Then the 2:30 minute TeleOp mode begins where players must control their robot with game controllers to complete tasks and score points \
        as fast as possible. The last 30 seconds of the TeleOp mode constitute the endgame time where special rules apply and it is possible to score \
        more points. To see a more in depth explanation of this year's minigame check out the game manuals \
        <a class=\"outsideLink\" href=\"https://www.firstinspires.org/resource-library/ftc/game-and-season-info\">here</a>.";

        const overviewCard = createCardItem();
        overviewCard.appendChild(overviewHeader);
        overviewCard.appendChild(overviewText);
        content_div.appendChild(overviewCard);

        const programmingHeader = document.createElement("h1");
        programmingHeader.innerHTML = "Programming:";
        content_div.appendChild(programmingHeader);

        const itemArray = [];
        itemArray.push(new ItemBuilder(content_div, "Overview: ",
        "When programming a robot for the First Tech Challenge, one must use Android Studio, a REV \
        driver hub (tablet), and a REV control hub. So, how does code from a computer program a robot's movements in TeleOp and autonomous modes?\
        Code is pushed from a computer running Android Studio to the REV control hub which has motors, servos, sensors, and other hardware parts\
        plugged into it via different colorful cables. So, the REV control hub is attached to the rest of the robot on the actual drivetrain and\
        code is pushed to it from a computer using Android Studio software. The driver hub serves as the human interface for running code already \
        uploaded onto the robot. This means that the driver hub is where controllers are plugged in, camera systems can be checked, telemetry is read,\
        and where different OpModes are run from with a simple GUI.").build());

        itemArray.push(new ItemBuilder(content_div, "Getting Started:", 
        "To get started fork <a class=\"outsideLink\" href=\"https://github.com/FIRST-Tech-Challenge/FtcRobotController\">the ftc sdk</a> \
        and copy the link to the fork to paste it into Android Studio (Create new project > Get from VCS > Paste link > Clone). Note you need \
        to have git which can be downloaded <a class=\"outsideLink\" href=\"https://git-scm.com/downloads\">here</a>. By doing this you will get your own\
        version of the interface to the robotics parts to mess with.\
        <br>\
        Once you have this repository in your Android Studio, navigate to TeamCode and go through the various folders and make three files \
        at the end: <code>Hardware.java</code>, <code>TeleOp.java</code>, <code>Auto.java</code>. This is where you will write your code, but you\
        would only want your <code>Teleop</code> and <code>Auto</code> classes to be runnable from the driver hub tablet.").build());

        itemArray.push(new ItemBuilder(content_div, "Init:", 
        "By this stage in the robotics game, no robots have moved and controllers are left alone. In the program, this is where all hardware \
        needs to be initialized (hence the name) into the program. Usually code initializing hardware is written into an <code>init()</code> method\
        in the <code>Hardware</code> class (file).").build());

        itemArray.push(new ItemBuilder(content_div, "OpMode Movement:", 
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
    ).addImage("Assets/Images/Mecannum.png", "How Mecannum wheels move (fig. 1)").build());

        itemArray.push(new ItemBuilder(content_div, "CV:", 
        "Lorem Ipsum").build());

        itemArray.forEach((x)=>{x.render()});
        
        const cadHeader = document.createElement("h1");
        cadHeader.innerHTML = "CAD:";
        content_div.appendChild(cadHeader);
    
        itemArray = [];

        itemArray.push(new ItemBuilder(content_div, "Software to use:", "Lorem Ipsum").build());

        itemArray.forEach((x)=>{x.render()});
        
        const buildHeader = document.createElement("h1");
        buildHeader.innerHTML = "Building:";
        content_div.appendChild(buildHeader);

        itemArray = [];

        itemArray.push(new ItemBuilder(content_div, "Useful resources:", "Lorem Ipsum").build());

        itemArray.forEach((x)=>{x.render()});
    });
}

function loadContactUspage(){
    new Promise(loadPage).then((content_div)=>{
        document.getElementById("contact-us").classList.add("selectedLink");

        content_div.classList.add("flex-column");

        const pageTitle = document.createElement("h1");

        const contactUsContentDiv = document.createElement("div");
        
        const otherContactsDiv = document.createElement("div");
        const otherContactsText = createContentCaption();
        
        const formDiv = document.createElement("div");
        const form = document.createElement("iframe");
        
        const discordWidgetDiv = document.createElement("div");
        const discordWidget = document.createElement("iframe");

        pageTitle.innerHTML = "CONTACT US";
        pageTitle.id = "contact-us-title";
        
        otherContactsDiv.classList.add("portrait-width");
        otherContactsDiv.id = "other-contacts-div";

        otherContactsText.id = "contact-us-text";
        otherContactsText.innerHTML = `You can contact us through various means, please find which method is most 
        convenient for you. <br>
        You can contact us via our email: <a href=mailto:24702regalrobots@gmail.com>24702regalrobots@gmail.com</a>,
        you can message our instagram account: <a href=instagram.com>regal robots</a>, 
        or you can complete the form to the side and we will promptly receive your message. `;
        otherContactsDiv.appendChild(otherContactsText);
        
        form.src = "https://docs.google.com/forms/d/e/1FAIpQLScNBoul0k6i3fpKjC-CMVM2zc7ZCeh-rKvGRAPyI4UuYvx4Tg/viewform?embedded=true";
        form.width="100%";
        form.height="600";
        form.frameBorder="0";
        form.marginHeight="0";
        form.marginWidth="0"; 
        form.innerHTML = "Loading…";
        
        formDiv.appendChild(form);
        formDiv.classList.add("iframe-wrapper");
        formDiv.classList.add("portrait-width");        
        
        discordWidget.src = "https://discord.com/widget?id=1266328894735126618&theme=dark";
        discordWidget.width = "100%"; 
        discordWidget.height = "500";
        discordWidget.frameBorder = "0";
        discordWidget.marginHeight="0";
        discordWidget.marginWidth="0"; 
        discordWidget.sandbox = "allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts";

        discordWidgetDiv.appendChild(discordWidget);
        discordWidgetDiv.classList.add("portrait-width");
        discordWidgetDiv.classList.add("iframe-wrapper");

        contactUsContentDiv.appendChild(otherContactsDiv);
        contactUsContentDiv.appendChild(formDiv);
        otherContactsDiv.appendChild(discordWidgetDiv);
        contactUsContentDiv.id = "contact-us-content";
        
        content_div.appendChild(pageTitle);
        content_div.appendChild(contactUsContentDiv);
    });
}

function loadImportantLinkspage(){
    new Promise(loadPage).then((content_div)=>{
        document.getElementById("links").classList.add("selectedLink");

    });
}

function sideMenuHandler(){
    sidebar.classList.remove("static-sidebar-closed")
    titleBar.classList.remove("static-content-closed")
    sidebar.classList.remove("static-sidebar")
    titleBar.classList.remove("static-content")
    if(sidebarOpen){
        closeSidebar();
    } else if(!sidebarOpen){
        openSidebar();
    }
}

function openSidebar(){  
    sidebarOpen = true;
    titleBar.classList.remove("grow-content");
    sidebar.classList.remove("close-sidebar");
    sidebar.classList.add("open-sidebar");
    titleBar.classList.add("shrink-content");
    content_div.classList.remove("grow-content");
    content_div.classList.add("shrink-content");
    if(window.matchMedia("only screen and (orientation:landscape) and (max-width:992px)").matches 
    || window.matchMedia("(orientation:portrait)").matches) document.body.style.overflow = "hidden";
}

function closeSidebar(){
    sidebarOpen = false;
    titleBar.classList.remove("shrink-content");
    sidebar.classList.remove("open-sidebar");
    titleBar.classList.add("grow-content");
    sidebar.classList.add("close-sidebar");
    content_div.classList.remove("shrink-content");
    content_div.classList.add("grow-content");
    document.body.style.overflow = "visible";
}


window.addEventListener("resize", function() {
    if(window.matchMedia("(orientation:portrait)").matches || window.matchMedia(
        "only screen and (orientation:landscape) and (max-width:992px)").matches) return;

    // Reset sidebar
    sidebar.classList.remove("close-sidebar");
    titleBar.classList.remove("grow-content")
    sidebar.classList.remove("open-sidebar");
    titleBar.classList.remove("shrink-content")

    if(!sidebarOpen) {
        sidebar.classList.add("static-sidebar-closed");
        titleBar.classList.add("static-content-closed")
    } else if(sidebarOpen){
        sidebar.classList.add("static-sidebar");
        titleBar.classList.add("static-content")
    }
  });
