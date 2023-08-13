// Function to check if the app is installed
function checkAppInstalled() {
  if ('getInstalledRelatedApps' in navigator) {
    navigator.getInstalledRelatedApps().then(apps => {
      if (apps.length === 0) {
        const installButton = document.getElementById('install-button');
        installButton.style.display = 'block';
        installButton.innerHTML = 'Install App';
        installButton.addEventListener('click', install);
      }
    });
  }
}

// Function to install the app
function install() {
  if ('getInstalledRelatedApps' in navigator) {
    const manifestURL = 'https://cajetanjohn.github.io/Rubik/manifest.json';
    
    navigator.getInstalledRelatedApps().then(apps => {
      // Check if the app is not already installed
      if (apps.length === 0) {
        // Trigger the installation prompt
        window.location.href = manifestURL;
      } else {
        // App is already installed, update button text
        const installButton = document.getElementById('install-button');
        installButton.innerHTML = 'App already installed';
        installButton.disabled = true;
      }
    }).catch(error => {
      // Handle error and display it in the button
      const installButton = document.getElementById('install-button');
      installButton.innerHTML = 'Error: ' + error.message;
    });
  }
}

// Check if the app is installed when the page loads
checkAppInstalled();
