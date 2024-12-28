const scroll = new LocomotiveScroll({
    el: document.querySelector('#main'),
    smooth: true
});

function setupProjectImageInteraction() {
    const projectContainer = document.querySelector("#elem-container");
    const previewImage = document.querySelector("#fixed-image");

    projectContainer.addEventListener("mouseenter", () => {
        previewImage.style.display = "block";
    });

    projectContainer.addEventListener("mouseleave", () => {
        previewImage.style.display = "none";
    });

    document.querySelectorAll(".elem").forEach(project => {
        project.addEventListener("mouseenter", () => {
            const imageUrl = project.getAttribute("data-image");
            previewImage.style.backgroundImage = `url(${imageUrl})`;
        });
    });
}

function setupSlider() {
    new Swiper(".mySwiper", {
        slidesPerView: "auto",
        centeredSlides: true,
        spaceBetween: 100
    });
}

function setupMobileMenu() {
    const menuButton = document.querySelector("nav h3");
    const menuOverlay = document.querySelector("#full-scr");
    const menuIcon = document.querySelector("nav img");
    let menuOpen = false;

    menuButton.addEventListener("click", () => {
        menuOpen = !menuOpen;
        menuOverlay.style.top = menuOpen ? "0" : "-100%";
        menuIcon.style.opacity = menuOpen ? "0" : "1";
    });
}

function startPageLoader() {
    const pageLoader = document.querySelector("#loader");
    
    setTimeout(() => {
        pageLoader.style.top = "-100%";
    }, 4200);
}

setupSlider();
setupProjectImageInteraction();
setupMobileMenu();
startPageLoader();