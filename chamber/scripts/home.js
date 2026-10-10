
const currentTemp = document.querySelector("#current-temp");
const weatherDescription = document.querySelector("#weather-description");
const forecastContainer = document.querySelector("#forecast");
const spotlightsContainer = document.querySelector("#spotlights");
const weatherHighLow = document.querySelector("#weather-high-low");

// Santa Cruz de la Sierra coordinates.
const latitude = -17.7833;
const longitude = -63.1821;

// OpenWeatherMap API key.
const apiKey = "50074e5b202d79c3163b00d41de50323";

const currentWeatherUrl =
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

const forecastUrl =
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

// Load current weather and forecast.
async function getWeather() {
    if (!currentTemp || !weatherDescription || !forecastContainer) return;

    try {
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastUrl)
        ]);

        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error("Unable to retrieve weather data.");
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        displayCurrentWeather(currentData);
        displayForecast(forecastData);
    } catch (error) {
        console.error("Weather error:", error);

        currentTemp.textContent = "Weather unavailable";
        weatherDescription.textContent =
            "Weather information could not be loaded.";
        forecastContainer.textContent = "Forecast unavailable.";

        if (weatherHighLow) {
            weatherHighLow.textContent = "High: --°C / Low: --°C";
        }
    }
}

// Display current weather.
function displayCurrentWeather(data) {
    const temperature = Math.round(data.main.temp);
    const description = data.weather?.[0]?.description;

    currentTemp.textContent = `${temperature}°C`;
    weatherDescription.textContent = description
        ? description.charAt(0).toUpperCase() + description.slice(1)
        : "Conditions unavailable";

    if (weatherHighLow && data.main) {
        const high = Math.round(data.main.temp_max);
        const low = Math.round(data.main.temp_min);

        weatherHighLow.textContent = `High: ${high}°C / Low: ${low}°C`;
    }
}

// Display the next three forecast days.
function displayForecast(data) {
    forecastContainer.replaceChildren();

    const dailyForecasts = [];
    const usedDates = new Set();

    const today = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/La_Paz",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(new Date());

    for (const item of data.list) {
        const date = item.dt_txt.split(" ")[0];

        if (date <= today || usedDates.has(date)) {
            continue;
        }

        usedDates.add(date);
        dailyForecasts.push(item);

        if (dailyForecasts.length === 3) break;
    }

    if (dailyForecasts.length === 0) {
        forecastContainer.textContent = "Forecast unavailable.";
        return;
    }

    dailyForecasts.forEach((day) => {
        const card = document.createElement("article");
        card.className = "forecast-card";

        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString("en-US", {
            weekday: "short",
            timeZone: "America/La_Paz"
        });

        const heading = document.createElement("h4");
        heading.textContent = dayName;

        const temperature = document.createElement("p");
        temperature.textContent = `${Math.round(day.main.temp)}°C`;

        const description = document.createElement("p");
        const condition = day.weather?.[0]?.description;

        description.textContent = condition
            ? condition.charAt(0).toUpperCase() + condition.slice(1)
            : "Conditions unavailable";

        card.append(heading, temperature, description);
        forecastContainer.appendChild(card);
    });
}

// Load business members for homepage spotlights.
async function getSpotlights() {
    if (!spotlightsContainer) return;

    try {
        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error("Could not load member data.");
        }

        const members = await response.json();

        const eligibleMembers = members.filter(
            (member) =>
                Number(member.membership) === 2 ||
                Number(member.membership) === 3
        );

        const shuffledMembers = [...eligibleMembers];

        for (let i = shuffledMembers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledMembers[i], shuffledMembers[j]] =
                [shuffledMembers[j], shuffledMembers[i]];
        }

        displaySpotlights(shuffledMembers.slice(0, 3));
    } catch (error) {
        console.error("Spotlight error:", error);

        spotlightsContainer.replaceChildren();

        const message = document.createElement("p");
        message.className = "error-message";
        message.textContent =
            "Business spotlights could not be loaded.";

        spotlightsContainer.appendChild(message);
    }
}

// Display spotlight cards.
function displaySpotlights(members) {
    spotlightsContainer.replaceChildren();

    if (members.length === 0) {
        spotlightsContainer.textContent =
            "No featured business members are available.";
        return;
    }

    members.forEach((member) => {
        const card = document.createElement("article");
        card.className = "spotlight-card";

        const heading = document.createElement("h3");
        heading.textContent = member.name;

        const tagline = document.createElement("p");
        tagline.textContent = member.tagline;

        const image = document.createElement("img");
        image.src = `images/${member.image}`;
        image.alt = `${member.name} logo`;
        image.loading = "lazy";
        image.width = 300;
        image.height = 200;

        const imageContainer = document.createElement("div");
        imageContainer.className = "spotlight-image";
        imageContainer.appendChild(image);

        const info = document.createElement("div");
        info.className = "spotlight-info";

        const membership = document.createElement("p");
        membership.textContent =
            `Membership: ${Number(member.membership) === 3
                ? "Gold Member"
                : "Silver Member"}`;

        const phone = document.createElement("p");
        phone.append("Phone: ");

        const phoneLink = document.createElement("a");
        phoneLink.href = `tel:${member.phone}`;
        phoneLink.textContent = member.phone;
        phone.appendChild(phoneLink);

        const address = document.createElement("p");
        address.textContent = "Address: Santa Cruz de la Sierra, Bolivia";

        const website = document.createElement("p");
        website.append("Website: ");

        const websiteLink = document.createElement("a");
        websiteLink.href = member.url;
        websiteLink.target = "_blank";
        websiteLink.rel = "noopener noreferrer";
        websiteLink.textContent = member.website;
        website.appendChild(websiteLink);

        info.append(membership, phone, address, website);
        card.append(heading, tagline, imageContainer, info);
        spotlightsContainer.appendChild(card);
    });
}

// Initialize homepage features.
getWeather();
getSpotlights();