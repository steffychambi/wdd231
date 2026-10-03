const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#navigation");
const darkModeButton = document.querySelector("#dark-mode");


/* Mobile navigation */

menuButton.addEventListener("click", () => {

    const isOpen = navigation.classList.toggle("open");

    menuButton.setAttribute("aria-expanded", isOpen);

    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );

});


/* Dark mode */

darkModeButton.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    const darkModeEnabled = document.body.classList.contains("dark-mode");

    darkModeButton.textContent = darkModeEnabled ? "☀" : "☾";

});


/* Footer */

document.querySelector("#current-year").textContent = new Date().getFullYear();

document.querySelector("#last-modified").textContent = document.lastModified;


/* Form timestamp */

document.querySelector("#timestamp").value = new Date().toISOString();


/* Membership modals */

const membershipLinks = document.querySelectorAll(".membership-link");

const dialogs = document.querySelectorAll("dialog");


membershipLinks.forEach((link) => {

    link.addEventListener("click", (event) => {

        event.preventDefault();

        const modalId = link.getAttribute("data-modal");

        const modal = document.querySelector(`#${modalId}`);

        modal.showModal();

    });

});


/* Close buttons */

dialogs.forEach((dialog) => {

    const closeButton = dialog.querySelector(".modal-close");

    closeButton.addEventListener("click", () => {

        dialog.close();

    });


/* Close when clicking the backdrop */

dialog.addEventListener("click", (event) => {

    if (event.target === dialog) {
        
        dialog.close();
        
    }

});

});