// Directory elements
const membersContainer = document.querySelector("#members");
const gridButton = document.querySelector("#grid-button");
const listButton = document.querySelector("#list-button");

// Load business members from the JSON file.
async function getMembers() {
    if (!membersContainer) return;

    try {
        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error("Could not load member data.");
        }

        const members = await response.json();
        displayMembers(members);
    } catch (error) {
        console.error("Error loading members:", error);

        membersContainer.replaceChildren();

        const message = document.createElement("p");
        message.className = "error-message";
        message.textContent = "The business directory could not be loaded.";

        membersContainer.appendChild(message);
    }
}

// Display business member cards.
function displayMembers(members) {
    membersContainer.replaceChildren();

    members.forEach((member) => {
        const card = document.createElement("article");
        card.classList.add("member-card");

        const header = document.createElement("div");
        header.className = "card-header";

        const heading = document.createElement("h2");
        heading.textContent = member.name;

        const tagline = document.createElement("p");
        tagline.textContent = member.tagline;

        header.append(heading, tagline);

        const divider = document.createElement("div");
        divider.className = "card-divider";

        const content = document.createElement("div");
        content.className = "card-content";

        const imageContainer = document.createElement("div");
        imageContainer.className = "member-image";

        const image = document.createElement("img");
        image.src = `images/${member.image}`;
        image.alt = `${member.name} logo`;
        image.loading = "lazy";
        image.width = 300;
        image.height = 200;

        imageContainer.appendChild(image);

        const info = document.createElement("div");
        info.className = "member-info";

        const email = document.createElement("p");
        email.append("EMAIL: ");

        const emailLink = document.createElement("a");
        emailLink.href = `mailto:${member.email}`;
        emailLink.textContent = member.email;
        email.appendChild(emailLink);

        const phone = document.createElement("p");
        phone.append("PHONE: ");

        const phoneLink = document.createElement("a");
        phoneLink.href = `tel:${member.phone}`;
        phoneLink.textContent = member.phone;
        phone.appendChild(phoneLink);

        const website = document.createElement("p");
        website.append("URL: ");

        const websiteLink = document.createElement("a");
        websiteLink.href = member.url;
        websiteLink.target = "_blank";
        websiteLink.rel = "noopener noreferrer";
        websiteLink.textContent = member.website;
        website.appendChild(websiteLink);

        info.append(email, phone, website);
        content.append(imageContainer, info);
        card.append(header, divider, content);

        membersContainer.appendChild(card);
    });
}

// Switch to grid view.
if (gridButton && membersContainer && listButton) {
    gridButton.addEventListener("click", () => {
        membersContainer.classList.remove("list-view");
        membersContainer.classList.add("grid-view");

        gridButton.classList.add("active");
        listButton.classList.remove("active");

        gridButton.setAttribute("aria-pressed", "true");
        listButton.setAttribute("aria-pressed", "false");
    });
}

// Switch to list view.
if (listButton && membersContainer && gridButton) {
    listButton.addEventListener("click", () => {
        membersContainer.classList.remove("grid-view");
        membersContainer.classList.add("list-view");

        listButton.classList.add("active");
        gridButton.classList.remove("active");

        listButton.setAttribute("aria-pressed", "true");
        gridButton.setAttribute("aria-pressed", "false");
    });
}

// Load the directory.
getMembers();