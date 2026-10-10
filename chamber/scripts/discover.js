import { places } from "../data/places.mjs";

const cardsContainer = document.querySelector("#discoverCards");
const visitMessage = document.querySelector("#visitMessage");

// Display a message based on the visitor's previous visit.

function showVisitMessage() {
    if (!visitMessage) return;

    const storageKey = "discoverLastVisit";
    const now = Date.now();
    const oneMinute = 60 * 1000;
    const oneDay = 24 * 60 * oneMinute;

    try {
        const storedVisit = localStorage.getItem(storageKey);
        const lastVisit = Number(storedVisit);

        if (!storedVisit || !Number.isFinite(lastVisit) || lastVisit <= 0) {
            visitMessage.textContent =
                "Welcome! Let us know if you have any questions.";
        } else {
            const elapsed = Math.max(0, now - lastVisit);

            if (elapsed < oneMinute) {
                const seconds = Math.floor(elapsed / 1000);
                const unit = seconds === 1 ? "second" : "seconds";

                visitMessage.textContent =
                    `You last visited ${seconds} ${unit} ago.`;
            } else if (elapsed < oneDay) {
                const minutes = Math.floor(elapsed / oneMinute);
                const seconds = Math.floor((elapsed % oneMinute) / 1000);

                visitMessage.textContent =
                    `You last visited ${minutes} min ${seconds} sec ago.`;
            } else {
                const days = Math.floor(elapsed / oneDay);
                const unit = days === 1 ? "day" : "days";

                visitMessage.textContent =
                    `You last visited ${days} ${unit} ago.`;
            }
        }

        localStorage.setItem(storageKey, String(now));
    } catch (error) {
        visitMessage.textContent =
            "Welcome! Explore the places around Santa Cruz.";

        console.warn("Visit history is unavailable:", error);
    }
}

// Display a card for each place.
function displayPlaces(items) {
    if (!cardsContainer) return;

    cardsContainer.replaceChildren();

    items.forEach((place, index) => {
        const card = document.createElement("article");
        card.classList.add("place-card", `area-${index + 1}`);

        const heading = document.createElement("h2");
        heading.textContent = place.name;

        const figure = document.createElement("figure");
        const image = document.createElement("img");

        image.src = `images/${place.image}`;
        image.alt = place.alt;
        image.width = 300;
        image.height = 200;
        image.loading = "lazy";

        figure.appendChild(image);

        const address = document.createElement("address");
        address.textContent = place.address;

        const description = document.createElement("p");
        description.textContent = place.description;

        const button = document.createElement("button");
        button.classList.add("learn-more");
        button.type = "button";
        button.textContent = "Learn More";
        button.setAttribute("aria-label", `Learn more about ${place.name}`);

        button.addEventListener("click", () => {
            window.alert(
                `${place.name}\n\n${place.description}\n\nAddress: ${place.address}`
            );
        });

        card.append(heading, figure, address, description, button);
        cardsContainer.appendChild(card);
    });
}

// Initialize the Discover page.
showVisitMessage();
displayPlaces(places);