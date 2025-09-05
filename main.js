// Hamburger Menu Toggle

const hamburgerButton = document.querySelector(
  '[aria-controls="primary-navigation"]'
);
const nav = document.querySelector(".primary-navigation");

// Toggle the menu when the hamburger button is clicked
hamburgerButton.addEventListener("click", () => {
  const isNavOpened = hamburgerButton.getAttribute("aria-expanded");
  hamburgerButton.setAttribute(
    "aria-expanded",
    isNavOpened === "false" ? "true" : "false"
  );
});

// Close the menu when any navigation link is clicked
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburgerButton.setAttribute("aria-expanded", "false");
  });
});

// Close the menu when clicking outside the navigation or the hamburger button
document.addEventListener("click", (event) => {
  const isNavOpened = hamburgerButton.getAttribute("aria-expanded") === "true";
  if (
    isNavOpened &&
    !nav.contains(event.target) &&
    !hamburgerButton.contains(event.target)
  ) {
    hamburgerButton.setAttribute("aria-expanded", "false");
  }
});

// Resize Observer to add a class when resizing

const resizeObserver = new ResizeObserver((entries) => {
  document.body.classList.add("resizing");

  requestAnimationFrame(() => {
    document.body.classList.remove("resizing");
  });
});

// Observe the document body
resizeObserver.observe(document.body);

// Course Catalog Filtering

const cards = document.querySelectorAll(".courses-catalog .card");
const organizationalFilter = document.querySelector("#organization");
const techFilter = document.querySelector("#tech");

const noResultsMessage = document.querySelector(".no-courses-match-message");

const currentFilters = {
  organization: "all",
  tech: "all",
};

cards.forEach((card, index) => {
  // You can use a data attribute if cards have unique IDs
  const courseId = `course-${index + 1}`;
  card.style.viewTransitionName = `course-card-${courseId}`;
});

organizationalFilter.addEventListener("change", updateFilter);
techFilter.addEventListener("change", updateFilter);

function updateFilter(e) {
  const filterType = e.target.name;

  currentFilters[filterType] = e.target.value;

  if (!document.startViewTransition) {
    filterCards();
    return;
  }
  document.startViewTransition(() => filterCards());
}

function filterCards() {
  let hasVisibleCards = false;

  cards.forEach((card) => {
    const organizations = Array.from(
      card.querySelectorAll("[data-organization]")
    ).map((el) => el.dataset.organization);

    const techs = Array.from(card.querySelectorAll("[data-tech]")).map(
      (el) => el.dataset.tech
    );

    const organizationsFilter = Array.isArray(currentFilters.organization)
      ? currentFilters.organization
      : [currentFilters.organization];

    const techFilter = Array.isArray(currentFilters.tech)
      ? currentFilters.tech
      : [currentFilters.tech];

    const matchesOrganization =
      organizationsFilter.includes("all") ||
      organizations.some((org) => organizationsFilter.includes(org));

    const matchesTech =
      techFilter.includes("all") || techs.some((t) => techFilter.includes(t));

    if (matchesOrganization && matchesTech) {
      card.hidden = false;
      hasVisibleCards = true;
    } else {
      card.hidden = true;
    }
  });

  noResultsMessage.hidden = hasVisibleCards;
}

// Enable filtering controls (in case JavaScript is disabled, they remain hidden)

function enableFiltering() {
  organizationalFilter.hidden = false;
  techFilter.hidden = false;
}

enableFiltering();
