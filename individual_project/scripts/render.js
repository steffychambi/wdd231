export function createExperimentCard(
    item,
    saved,
    onToggleSaved,
    onViewDetails
) {
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
        onViewDetails(item);
    });

    const saveButton = document.createElement("button");
    const isSaved = saved.includes(item.id);

    saveButton.className =
        `save-button ${isSaved ? "is-saved" : ""}`;
    saveButton.type = "button";
    saveButton.textContent = isSaved ? "★ Saved" : "☆ Save";
    saveButton.setAttribute("aria-pressed", String(isSaved));

    saveButton.addEventListener("click", () => {
        onToggleSaved(item.id);
    });

    actions.append(viewButton, saveButton);
    content.append(label, title, description, details, actions);
    card.append(image, content);

    return card;
}

export function renderExperiments({
    experiments,
    list,
    count,
    emptyState,
    searchInput,
    topicFilter,
    difficultyFilter,
    getSavedExperiments,
    onToggleSaved,
    onViewDetails
}) {
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

        const matchesTopic =
            selectedTopic === "All" ||
            selectedTopic === "all" ||
            selectedTopic === "" ||
            item.topic === selectedTopic;

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
        list.append(
            createExperimentCard(
                item,
                saved,
                onToggleSaved,
                onViewDetails
            )
        );
    });
}

export function showExperimentDetails(item, dialog, dialogContent) {
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
    image.decoding = "async";

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
        dialogContent,
        "Materials",
        Array.isArray(item.materials) ? item.materials : [],
        "ul"
    );

    appendList(
        dialogContent,
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

function appendList(dialogContent, headingText, items, type) {
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
