// Select elements in the page
const alertMessageElement = document.getElementById("alert-message");
const gsmStatusElement = document.getElementById("gsm-status");
const ipAddressElement = document.getElementById("ip-address");
const menuItems = document.querySelectorAll('.menu-item');

// Update alert message and media controls
function updateAlertMessage(message) {
  alertMessageElement.innerText = message;
}

function updateGSMStatus(status) {
  gsmStatusElement.innerText = status;
}

function updateIP(ip) {
  ipAddressElement.innerText = ip;
}

// Control media (pause or resume)
function controlMedia(pause) {
  if (pause) {
    console.log("Pausing media playback...");
    // Send command to Arduino or ESP32 to pause media
    fetch('/control-media?pause=true', { method: 'GET' });
  } else {
    console.log("Resuming media playback...");
    // Send command to Arduino or ESP32 to resume media
    fetch('/control-media?pause=false', { method: 'GET' });
  }
}

// Fetch device information periodically (like checking GSM status and IP)
function fetchDeviceInfo() {
  // Fetch IP from the local server or ESP32
  fetch('http://192.168.1.1')  // Make sure to use the actual IP address of the server or ESP32
    .then(response => response.json())
    .then(data => {
      updateIP(data.ip || "N/A");
      updateGSMStatus(data.gsmStatus || "Checking...");
    })
    .catch(error => {
      console.error('Error fetching device info:', error);
    });
}

// Function to calculate the direction of the detected object (for example purposes, this is a dummy function)
function calculateDirection() {
  // This function should use data from your sensors (LiDAR, GPS, etc.) to calculate the direction.
  // For now, we return a random direction as an example.
  const directions = ['North', 'South', 'East', 'West'];
  const randomIndex = Math.floor(Math.random() * directions.length);
  return directions[randomIndex];
}

// Handle incoming data from Arduino (example: via WebSocket or HTTP)
function handleIncomingData() {
  // This function can be used to get updates like alerts or measurements from the server
  setInterval(() => {
    // For example, if a hidden object is detected:
    const direction = calculateDirection();  // Get the direction of the detected object
    const alertMessage = Hidden object detected in the ${direction} direction;  // Update alert message with direction
    updateAlertMessage(alertMessage);
    updateGSMStatus("Ready");

    // Pause media when an alert is triggered
    controlMedia(true);

    // Resume media after 5 seconds of the alert
    setTimeout(() => {
      controlMedia(false);
    }, 5000);
  }, 10000);  // Simulate an alert every 10 seconds
}

// Change section when clicking on the menu
function openSection(section) {
  // Hide all sections first
  document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
  
  // Show the selected section
  document.getElementById(section).style.display = 'block';
}

// Add click events to menu items
menuItems.forEach(item => {
  item.addEventListener('click', function() {
    const sectionId = this.getAttribute('onclick').match(/'(.*?)'/)[1];
    openSection(sectionId);
  });
});

// Initialize functions when the page loads
document.addEventListener('DOMContentLoaded', function() {
  fetchDeviceInfo();  // Fetch device info
  handleIncomingData();  // Simulate incoming data
})