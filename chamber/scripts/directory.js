const membersContainer = document.querySelector("#members");
const gridButton = document.querySelector("#grid-button");
const listButton = document.querySelector("#list-button");
const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#navigation");
const darkModeButton = document.querySelector("#dark-mode");

async function getMembers() {
    try {
        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error("Could not load member data.");
        }

        const members = await response.json();
        displayMembers(members);

    } catch (error) {
        console.error("Error loading members:", error);

        membersContainer.innerHTML = `
            <p class="error-message">
                The business directory could not be loaded.
            </p>
        `;
    }
}

function displayMembers(members) {
    membersContainer.innerHTML = "";

    members.forEach((member) => {
        const card = document.createElement("article");

        card.classList.add("member-card");

        card.innerHTML = `
            <div class="card-header">
                <h2>${member.name}</h2>
                <p>${member.tagline}</p>
            </div>

            <div class="card-divider"></div>

            <div class="card-content">
                <div class="member-image">
                    <img
                        src="images/${member.image}"
                        alt="${member.name} logo"
                        loading="lazy"
                    >
                </div>

                <div class="member-info">
                    <p>
                        <span>EMAIL:</span>
                        <a href="mailto:${member.email}">
                            ${member.email}
                        </a>
                    </p>

                    <p>
                        <span>PHONE:</span>
                        <a href="tel:${member.phone}">
                            ${member.phone}
                        </a>
                    </p>

                    <p>
                        <span>URL:</span>
                        <a
                            href="${member.url}"
                            target="_blank"
                            rel="noopener noreferrer">
                            ${member.website}
                        </a>
                    </p>
                </div>
            </div>
        `;

        membersContainer.appendChild(card);
    });
}

gridButton.addEventListener("click", () => {
    membersContainer.classList.remove("list-view");
    membersContainer.classList.add("grid-view");

    gridButton.classList.add("active");
    listButton.classList.remove("active");
});

listButton.addEventListener("click", () => {
    membersContainer.classList.remove("grid-view");
    membersContainer.classList.add("list-view");

    listButton.classList.add("active");
    gridButton.classList.remove("active");
});

menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");

    menuButton.setAttribute("aria-expanded", isOpen);
});

darkModeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const darkModeEnabled =
        document.body.classList.contains("dark-mode");

    darkModeButton.textContent =
        darkModeEnabled ? "☀" : "☾";
});

document.querySelector("#current-year").textContent =
    new Date().getFullYear();

document.querySelector("#last-modified").textContent =
    document.lastModified;

getMembers();