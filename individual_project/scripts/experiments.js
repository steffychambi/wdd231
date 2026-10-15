
const list = document.querySelector("#experiment-list");
const count = document.querySelector("#results-count");
const emptyState = document.querySelector("#empty-state");

const searchInput = document.querySelector("#search-input");
const topicFilter = document.querySelector("#topic-filter");
const difficultyFilter = document.querySelector("#difficulty-filter");
const clearButton = document.querySelector("#clear-filters");

const dialog = document.querySelector("#experiment-dialog");
const dialogContent = document.querySelector("#dialog-content");
const closeDialog = document.querySelector("#dialog-close");

const STORAGE_KEY = "physicsLabSavedExperiments";

let experiments = [];

function getSavedExperiments() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        console.warn("Unable to read saved experiments:", error);
        return [];
    }
}

function toggleSavedExperiment(id) {
    const saved = getSavedExperiments();

    const updated = saved.includes(id)
        ? saved.filter((savedId) => savedId !== id)
        : [...saved, id];

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
        console.warn("Unable to save this experiment:", error);
    }

    renderExperiments();
}

function createExperimentCard(item, saved) {
    const card = document.createElement("article");
    card.className = "experiment-card";

    const image = document.createElement("img");
    image.className = "experiment-image";
    image.src = item.image;
    image.alt = item.imageAlt || `Illustration for ${item.name}`;
    image.width = 600;
    image.height = 400;
    image.loading = "lazy";
    image.decoding = "async";

    image.addEventListener("error", () => {
        image.alt = `Image unavailable for ${item.name}`;
        image.classList.add("image-unavailable");
    }, { once: true });

    const content = document.createElement("div");
    content.className = "experiment-card-content";

    const label = document.createElement("p");
    label.className = "card-label";
    label.textContent = item.topic;

    const title = document.createElement("h2");
    title.textContent = item.name;

    const description = document.createElement("p");
    description.textContent = item.description;

    const details = document.createElement("dl");
    details.className = "experiment-info";

    [
        ["Difficulty", item.difficulty],
        ["Duration", `${item.duration} minutes`]
    ].forEach(([termText, valueText]) => {
        const term = document.createElement("dt");
        term.textContent = termText;

        const value = document.createElement("dd");
        value.textContent = valueText;

        details.append(term, value);
    });

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const viewButton = document.createElement("button");
    viewButton.className = "text-button";
    viewButton.type = "button";
    viewButton.textContent = "View Details";
    viewButton.addEventListener("click", () => {
        showExperimentDetails(item);
    });

    const saveButton = document.createElement("button");
    const isSaved = saved.includes(item.id);

    saveButton.className = `save-button ${isSaved ? "is-saved" : ""}`;
    saveButton.type = "button";
    saveButton.textContent = isSaved ? "★ Saved" : "☆ Save";
    saveButton.setAttribute("aria-pressed", String(isSaved));

    saveButton.addEventListener("click", () => {
        toggleSavedExperiment(item.id);
    });

    actions.append(viewButton, saveButton);
    content.append(label, title, description, details, actions);
    card.append(image, content);

    return card;
}

function renderExperiments() {
    const term = searchInput.value.trim().toLowerCase();
    const selectedTopic = topicFilter.value;
    const selectedDifficulty = difficultyFilter.value;
    const saved = getSavedExperiments();

    const filtered = experiments.filter((item) => {
        const searchableText = [
            item.name,
            item.topic,
            item.description,
            item.purpose,
            ...(Array.isArray(item.materials) ? item.materials : [])
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(term);

        // "All" and an empty value both mean all topics.
        const matchesTopic =
            selectedTopic === "All" ||
            selectedTopic === "all" ||
            selectedTopic === "" ||
            item.topic === selectedTopic;

        // "All" and an empty value both mean all difficulty levels.
        const matchesDifficulty =
            selectedDifficulty === "All" ||
            selectedDifficulty === "all" ||
            selectedDifficulty === "" ||
            item.difficulty === selectedDifficulty;

        return matchesSearch && matchesTopic && matchesDifficulty;
    });

    count.textContent =
        `Showing ${filtered.length} of ${experiments.length} experiments`;

    emptyState.hidden = filtered.length !== 0;
    list.replaceChildren();

    filtered.forEach((item) => {
        list.append(createExperimentCard(item, saved));
    });
}

function showExperimentDetails(item) {
    dialogContent.replaceChildren();

    const title = document.createElement("h2");
    title.id = "dialog-title";
    title.textContent = item.name;

    const image = document.createElement("img");
    image.className = "experiment-image";
    image.src = item.image;
    image.alt = item.imageAlt || `Illustration for ${item.name}`;
    image.width = 600;
    image.height = 400;
    image.loading = "lazy";

    const description = document.createElement("p");
    description.textContent = item.description;

    const facts = document.createElement("p");
    facts.textContent =
        `Topic: ${item.topic} | Difficulty: ${item.difficulty} | Duration: ${item.duration} minutes`;

    const purposeHeading = document.createElement("h3");
    purposeHeading.textContent = "Purpose";

    const purpose = document.createElement("p");
    purpose.textContent = item.purpose;

    dialogContent.append(
        title,
        image,
        description,
        facts,
        purposeHeading,
        purpose
    );

    appendList(
        "Materials",
        Array.isArray(item.materials) ? item.materials : [],
        "ul"
    );

    appendList(
        "Suggested Procedure",
        Array.isArray(item.procedure) ? item.procedure : [],
        "ol"
    );

    const safety = document.createElement("p");
    safety.textContent =
        "Follow your instructor's safety directions before performing this experiment.";

    dialogContent.append(safety);

    if (typeof dialog.showModal === "function") {
        dialog.showModal();
    }
}

function appendList(headingText, items, type) {
    const heading = document.createElement("h3");
    heading.textContent = headingText;

    const listElement = document.createElement(type);

    items.forEach((value) => {
        const li = document.createElement("li");
        li.textContent = value;
        listElement.append(li);
    });

    dialogContent.append(heading, listElement);
}

searchInput.addEventListener("input", renderExperiments);
topicFilter.addEventListener("change", renderExperiments);
difficultyFilter.addEventListener("change", renderExperiments);

clearButton.addEventListener("click", () => {
    searchInput.value = "";
    topicFilter.value = "All";
    difficultyFilter.value = "All";

    // Clear topic parameters so the URL doesn't reapply an old filter.
    const url = new URL(window.location.href);
    url.searchParams.delete("topic");
    window.history.replaceState({}, "", url);

    renderExperiments();
});

closeDialog.addEventListener("click", () => {
    dialog.close();
});

dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
        dialog.close();
    }
});

async function loadExperiments() {
    try {
        const response = await fetch("data/experiments.json");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length < 15) {
            throw new Error(
                "The experiment data must contain at least 15 items."
            );
        }

        const hasInvalidItems = data.some((item) => {
            return (
                !item.id ||
                !item.name ||
                !item.topic ||
                !item.description ||
                !Array.isArray(item.materials) ||
                !Array.isArray(item.procedure)
            );
        });

        if (hasInvalidItems) {
            throw new Error(
                "One or more experiments have missing or invalid required fields."
            );
        }

        experiments = data;

        // Populate topic options from the actual JSON categories.
        // This prevents mismatches between the filter and experiment data.
        const currentTopic = topicFilter.value;
        const topics = [...new Set(
            experiments
                .map((item) => item.topic)
                .filter(Boolean)
        )].sort((a, b) => a.localeCompare(b));

        topicFilter.replaceChildren();

        const allTopicsOption = document.createElement("option");
        allTopicsOption.value = "All";
        allTopicsOption.textContent = "All Topics";
        topicFilter.append(allTopicsOption);

        topics.forEach((topic) => {
            const option = document.createElement("option");
            option.value = topic;
            option.textContent = topic;
            topicFilter.append(option);
        });

        const params = new URLSearchParams(window.location.search);
        const requestedTopic = params.get("topic");

        // Apply a topic passed from a link on the home page.
        if (requestedTopic && topics.includes(requestedTopic)) {
            topicFilter.value = requestedTopic;
        } else if (topics.includes(currentTopic)) {
            topicFilter.value = currentTopic;
        } else {
            topicFilter.value = "All";
        }

        renderExperiments();
    } catch (error) {
        console.error("Unable to load experiments:", error);
        count.textContent = "Experiment data unavailable.";
        list.textContent =
            "The experiment library could not be loaded. Check the JSON file and its format.";
        emptyState.hidden = true;
    }
}

loadExperiments();
