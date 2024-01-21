const errorMessage = document.getElementById("error-notification");
const healthBar = document.getElementById("health-bar");

const hideErrorMessage = () => {
  errorMessage.remove(); // Remove the error message from the DOM
};

setTimeout(hideErrorMessage, 5000);

// Update the width of the health bar as time passes
const initialWidth = healthBar.offsetWidth; // Get the initial width of the health bar
const remainingTime = 1400; // The remaining time in milliseconds, has been set by hit & trial method;
const intervalTime = 100; // The interval time for updating the health bar width
const intervalWidth = initialWidth / (remainingTime / intervalTime); // The width increment per interval

let currentWidth = initialWidth;
const updateHealthBar = setInterval(() => {
  currentWidth -= intervalWidth;
  healthBar.style.width = currentWidth + "px";
  if (currentWidth <= 0) {
    clearInterval(updateHealthBar);
  }
}, intervalTime);
