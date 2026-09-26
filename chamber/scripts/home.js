const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#navigation");
const darkModeButton = document.querySelector("#dark-mode");

const currentTemp = document.querySelector("#current-temp");
const weatherDescription = document.querySelector("#weather-description");
const forecastContainer = document.querySelector("#forecast");

const spotlightsContainer = document.querySelector("#spotlights");


/* Mobile navigation */

menuButton.addEventListener("click", () => {

    const isOpen = navigation.classList.toggle("open");

    menuButton.setAttribute("aria-expanded", isOpen);

    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );

});


/* Dark mode */

darkModeButton.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    const darkModeEnabled =
        document.body.classList.contains("dark-mode");

    darkModeButton.textContent =
        darkModeEnabled ? "☀" : "☾";

});


/* Footer */

document.querySelector("#current-year").textContent =
    new Date().getFullYear();

document.querySelector("#last-modified").textContent =
    document.lastModified;


/* Weather API */

const latitude = -17.7833;
const longitude = -63.1821;




const currentWeatherUrl =
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=50074e5b202d79c3163b00d41de50323`;

const forecastUrl =
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=50074e5b202d79c3163b00d41de50323`;


async function getWeather() {

    try {

        const [currentResponse, forecastResponse] =
            await Promise.all([
                fetch(currentWeatherUrl),
                fetch(forecastUrl)
            ]);


        if (!currentResponse.ok || !forecastResponse.ok) {

            throw new Error("Unable to retrieve weather data.");

        }


        const currentData =
            await currentResponse.json();

        const forecastData =
            await forecastResponse.json();


        displayCurrentWeather(currentData);

        displayForecast(forecastData);


    } catch (error) {

        console.error("Weather error:", error);

        currentTemp.textContent =
            "Weather unavailable";

        weatherDescription.textContent =
            "Weather information could not be loaded.";

        forecastContainer.innerHTML =
            "<p>Forecast unavailable.</p>";

    }

}


/* Current weather */

function displayCurrentWeather(data) {

    currentTemp.innerHTML =
        `${Math.round(data.main.temp)}&deg;C`;

    weatherDescription.textContent =
        data.weather[0].description;

}


/* Three-day forecast */

function displayForecast(data) {

    forecastContainer.innerHTML = "";


    const dailyForecasts = [];

    const usedDates = new Set();


    for (const item of data.list) {

        const date =
            item.dt_txt.split(" ")[0];


        if (!usedDates.has(date)) {

            usedDates.add(date);

            dailyForecasts.push(item);

        }


        if (dailyForecasts.length === 3) {

            break;

        }

    }


    dailyForecasts.forEach((day) => {

        const date =
            new Date(day.dt * 1000);


        const dayName =
            date.toLocaleDateString("en-US", {
                weekday: "short"
            });


        const temperature =
            Math.round(day.main.temp);


        const card =
            document.createElement("article");

        card.classList.add("forecast-card");


        card.innerHTML = `
            <h4>${dayName}</h4>
            <p>${temperature}&deg;C</p>
            <p>${day.weather[0].description}</p>
        `;


        forecastContainer.appendChild(card);

    });

}


/* Company Spotlights */

async function getSpotlights() {

    try {

        const response =
            await fetch("data/members.json");


        if (!response.ok) {

            throw new Error(
                "Could not load member data."
            );

        }


        const members =
            await response.json();


        const eligibleMembers =
            members.filter(
                member =>
                    member.membership === 2 ||
                    member.membership === 3
            );


        const shuffledMembers =
            eligibleMembers.sort(
                () => Math.random() - 0.5
            );


        const selectedMembers =
            shuffledMembers.slice(0, 3);


        displaySpotlights(selectedMembers);


    } catch (error) {

        console.error(
            "Spotlight error:",
            error
        );

        spotlightsContainer.innerHTML = `
            <p class="error-message">
                Business spotlights could not be loaded.
            </p>
        `;

    }

}


/* Display spotlight cards */

function displaySpotlights(members) {

    spotlightsContainer.innerHTML = "";


    members.forEach((member) => {

        const card =
            document.createElement("article");

        card.classList.add("spotlight-card");


        const membershipName =
            member.membership === 3
                ? "Gold Member"
                : "Silver Member";


        card.innerHTML = `
            <div class="spotlight-header">

                <h3>${member.name}</h3>

                <p>${member.tagline}</p>

            </div>


            <div class="spotlight-image">

                <img
                    src="images/${member.image}"
                    alt="${member.name} logo"
                    loading="lazy"
                >

            </div>


            <div class="spotlight-info">

                <p>
                    <strong>Membership:</strong>
                    ${membershipName}
                </p>

                <p>
                    <strong>Phone:</strong>
                    <a href="tel:${member.phone}">
                        ${member.phone}
                    </a>
                </p>

                <p>
                    <strong>Address:</strong>
                    Santa Cruz de la Sierra, Bolivia
                </p>

                <p>
                    <strong>Website:</strong>
                    <a
                        href="${member.url}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        ${member.website}
                    </a>
                </p>

            </div>

        `;


        spotlightsContainer.appendChild(card);

    });

}


/* Start */

getWeather();

getSpotlights();