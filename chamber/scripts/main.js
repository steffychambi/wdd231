
// Mobile navigation
const menuButton = document.querySelector("#menuButton");
const navigation = document.querySelector("#navigation");

if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("open");

        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });
}

// Dark mode
const themeButton = document.querySelector("#themeButton");

if (themeButton) {
    themeButton.addEventListener("click", () => {
        const isDark = document.body.classList.toggle("dark-mode");

        themeButton.textContent = isDark ? "☀" : "☾";
        themeButton.setAttribute(
            "aria-label",
            isDark ? "Switch to light mode" : "Switch to dark mode"
        );
    });
}

// Footer information
const currentYear = document.querySelector("#current-year");
const lastModified = document.querySelector("#last-modified");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

if (lastModified) {
    lastModified.textContent = document.lastModified;
}