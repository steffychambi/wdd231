const featuredGrid = document.querySelector("#featured-grid");
const dialog = document.querySelector("#experiment-dialog");
const dialogContent = document.querySelector("#dialog-content");
const closeButton = document.querySelector("#dialog-close");

async function loadFeaturedExperiments() {
    try {
        const response = await fetch("data/experiments.json");

        if (!response.ok) {
            throw new Error("Failed to load experiments.");
        }

        const experiments = await response.json();
        const featuredExperiments = experiments.slice(0, 3);

        featuredGrid.innerHTML = featuredExperiments.map((experiment) => `
            <article class="experiment-card">
                <img
                    class="experiment-image"
                    src="${experiment.image}"
                    alt="${experiment.imageAlt}"
                    loading="lazy"
                    width="400"
                    height="250"
                >

                <div class="experiment-card-content">
                    <p class="experiment-topic">${experiment.topic}</p>
                    <h3>${experiment.name}</h3>
                    <p>${experiment.description}</p>

                    <p><strong>Difficulty:</strong> ${experiment.difficulty}</p>
                    <p><strong>Duration:</strong> ${experiment.duration} minutes</p>

                    <h4>Purpose</h4>
                    <p>${experiment.purpose}</p>

                    <h4>Materials</h4>
                    <ul>
                        ${experiment.materials.map((material) => `
                            <li>${material}</li>
                        `).join("")}
                    </ul>
                </div>
            </article>
        `).join("");

    } catch (error) {
        console.error("Error loading featured experiments:", error);

        featuredGrid.innerHTML =
            "<p>Unable to load featured experiments. Please try again later.</p>";
    }
}

function showDetails(id, experiments) {
    const experiment = experiments.find((item) => item.id === id);

    if (!experiment) return;

    dialogContent.replaceChildren();

    const title = document.createElement("h2");
    title.id = "dialog-title";
    title.textContent = experiment.name;
    dialogContent.append(title);

    const description = document.createElement("p");
    description.textContent = experiment.description;
    dialogContent.append(description);

    const facts = document.createElement("p");
    facts.textContent =
        `Topic: ${experiment.topic} | Difficulty: ${experiment.difficulty} | Duration: ${experiment.duration} minutes`;
    dialogContent.append(facts);

    const purposeTitle = document.createElement("h3");
    purposeTitle.textContent = "Purpose";
    dialogContent.append(purposeTitle);

    const purpose = document.createElement("p");
    purpose.textContent = experiment.purpose;
    dialogContent.append(purpose);

    appendList("Materials", experiment.materials, "ul");
    appendList("Suggested procedure", experiment.procedure, "ol");

    const safety = document.createElement("p");
    safety.textContent =
        "Follow your instructor's laboratory safety procedures.";
    dialogContent.append(safety);

    if (typeof dialog.showModal === "function") {
        dialog.showModal();
    }
}

function appendList(headingText, items, listType) {
    const heading = document.createElement("h3");
    heading.textContent = headingText;

    const listElement = document.createElement(listType);

    items.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        listElement.append(li);
    });

    dialogContent.append(heading, listElement);
}

if (closeButton) {
    closeButton.addEventListener("click", () => dialog.close());
}

if (dialog) {
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
    });
}

loadFeaturedExperiments();