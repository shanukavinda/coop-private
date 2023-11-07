document.getElementById("tab-0").click();

function openPanel(event, tabId) {
  // Hide all tab panels
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.style.display = "none";
  });

  // Remove the "active" class from all tabs
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Show the current tab and add an "active" class to the button
  document.getElementById(tabId).style.display = "block";
  event.currentTarget.classList.add("active");
}
