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


/* Read form data */

const params = new URLSearchParams(window.location.search);

const firstName = params.get("firstName") || "";

const lastName = params.get("lastName") || "";

const email = params.get("email") || "";

const mobile = params.get("mobile") || "";

const organization = params.get("organization") || "";

const timestamp = params.get("timestamp") || "";


/* Display form data */

document.querySelector("#display-first-name").textContent = firstName;

document.querySelector("#display-last-name").textContent = lastName;

document.querySelector("#display-email").textContent = email;

document.querySelector("#display-mobile").textContent = mobile;

document.querySelector("#display-organization").textContent = organization;


/* Format timestamp */

if (timestamp) {

    const date = new Date(timestamp);

    document.querySelector("#display-timestamp").textContent = date.toLocaleString();

} else {

    document.querySelector("#display-timestamp").textContent = "Not available";

}