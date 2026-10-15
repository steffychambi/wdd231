
import { loadExperiments } from "./data.js";

import {
    getSavedExperiments,
    toggleSavedExperiment
} from "./storage.js";

import {
    renderExperiments as renderExperimentList,
    showExperimentDetails
} from "./render.js";

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

let experiments = [];

function renderExperiments() {
    renderExperimentList({
        experiments,
        list,
        count,
        emptyState,
        searchInput,
        topicFilter,
        difficultyFilter,
        getSavedExperiments,
        onToggleSaved: (id) => {
            toggleSavedExperiment(id);
            renderExperiments();
        },
        onViewDetails: (item) => {
            showExperimentDetails(item, dialog, dialogContent);
        }
    });
}

searchInput.addEventListener("input", renderExperiments);
topicFilter.addEventListener("change", renderExperiments);
difficultyFilter.addEventListener("change", renderExperiments);

clearButton.addEventListener("click", () => {
    searchInput.value = "";
    topicFilter.value = "All";
    difficultyFilter.value = "All";

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

async function initializeExperiments() {
    try {
        experiments = await loadExperiments();

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

        if (requestedTopic && topics.includes(requestedTopic)) {
            topicFilter.value = requestedTopic;
        } else if (topics.includes(currentTopic)) {
            topicFilter.value = currentTopic;
        } else {
            topicFilter.value = "All";
        }

        renderExperiments();
    } catch (error) {
        console.error("Unable to initialize experiments:", error);

        count.textContent = "Experiment data unavailable.";
        list.textContent =
            "The experiment library could not be loaded. Check the JSON file and its format.";
        emptyState.hidden = true;
    }
}

initializeExperiments();
