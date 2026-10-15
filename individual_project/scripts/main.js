const menuButton = document.querySelector("#menu-toggle");
const navigation = document.querySelector("#site-navigation");

if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("is-open");

        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

        menuButton.textContent = isOpen ? "×" : "☰";
    });

    navigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navigation.classList.remove("is-open");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open navigation menu");
            menuButton.textContent = "☰";
        });
    });
}

const yearElement = document.querySelector("#current-year");
const modifiedElement = document.querySelector("#last-modified");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

if (modifiedElement) {
    modifiedElement.textContent =
        `Last modified: ${document.lastModified}`;
}


/* Dark mode */
const themeToggle = document.querySelector("#themeToggle");
const root = document.documentElement;

function setTheme(theme) {
    root.dataset.theme = theme;

    const isDark = theme === "dark";

    if (themeToggle) {
        themeToggle.textContent = isDark ? "☀️ Light mode" : "🌙 Dark mode";
        themeToggle.setAttribute("aria-pressed", String(isDark));
        themeToggle.setAttribute(
            "aria-label",
            isDark ? "Activate light mode" : "Activate dark mode"
        );
    }
}

const savedTheme = localStorage.getItem("physicsLabTheme");
const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

setTheme(savedTheme || preferredTheme);

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const newTheme =
            root.dataset.theme === "dark" ? "light" : "dark";

        setTheme(newTheme);
        localStorage.setItem("physicsLabTheme", newTheme);
    });
}
