"use strict";

// Get the main element and activity containers
const main = document.getElementById("main");
const article = main.querySelector("[data-article]");

// Store activity data
const activity = {};

let timeframe = "daily"; // Default timeframe

// Fetch data from the JSON file
const fetchData = async function () {
  try {
    const response = await fetch("./data.json");

    // Check if the response is okay
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();

    // Loop through the data and store it in the activity object
    data.forEach((item) => {
      activity[item.title] = item.timeframes;
    });

    // Handle the HTML markup with the fetched data
    handleHtmlMarkUP();
  } catch (error) {
    // Log errors if there are issues fetching the JSON file
    console.error("Error fetching the JSON file:", error);
  }
};

// Get the current and previous timeframes based on the selected timeframe
const getTimeFrame = function (activityData) {
  const { current, previous } = activityData[timeframe];
  return { current, previous };
};

// Generate and insert the HTML markup based on the activity data
const handleHtmlMarkUP = function () {
  Object.keys(activity).map((keys) => {
    // Format data for CSS class
    const data = keys.toLowerCase().replace(" ", "");
    const { current, previous } = getTimeFrame(activity[keys]);

    // Create HTML markup for each activity
    const htmlMarkup = `
    <section class="tracking-dashboard__activities ${data}">
      <div class="svg ${data}"></div>
      <article>
        <header>
          <h2>
            ${keys}
            <time datetime="${current}T00:00">${current}hrs</time>
          </h2>
        </header>

        <section>
          <div>
            <img src="./images/icon-ellipsis.svg" alt="An icon-ellipsis" />
          </div>
          <p>Last Week - ${previous}hrs</p>
        </section>
      </article>
    </section>
    `;
    // Insert the generated HTML markup into the article element
    article.insertAdjacentHTML("beforeend", htmlMarkup);
  });
};

// Remove all existing sections from the article element
const handleReset = function () {
  const sections = article.querySelectorAll(".tracking-dashboard__activities");
  return sections.forEach((section) => {
    return section.remove();
  });
};

// Add an active state class to the clicked element and remove it after a delay
const handleActiveState = function (target) {
  target.classList.add("currentstate");
  setTimeout(() => {
    target.classList.remove("currentstate");
  }, 2000);
};

// Attach event listeners to handle clicks and update the timeframe
const handleEvent = function () {
  main.addEventListener("click", function (e) {
    const daily = e.target.closest("[data-daily]");
    const weekly = e.target.closest("[data-weekly]");
    const monthly = e.target.closest("[data-monthly]");

    if (daily) {
      timeframe = "daily";
      handleActiveState(daily);
      handleReset();
      handleHtmlMarkUP();
    }

    if (weekly) {
      timeframe = "weekly";
      handleActiveState(weekly);
      handleReset();
      handleHtmlMarkUP();
    }
    if (monthly) {
      timeframe = "monthly";
      handleActiveState(monthly);
      handleReset();
      handleHtmlMarkUP();
    }
  });
};

// Initialize the app by fetching data and setting up event listeners
(function () {
  fetchData();
  handleEvent();
})();
