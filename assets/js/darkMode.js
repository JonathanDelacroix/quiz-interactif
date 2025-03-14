function applyDarkMode(isDarkMode) {
    document.body.classList.toggle('dark-mode', isDarkMode);
    document.getElementById('switch').checked = isDarkMode;
}

document.getElementById('switch').addEventListener('change', function() {
    const isDarkMode = this.checked;
    applyDarkMode(isDarkMode);
    // Sauvegarder le choix dans localStorage
    localStorage.setItem('darkMode', isDarkMode);
});

document.addEventListener('DOMContentLoaded', function() {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
        applyDarkMode(savedDarkMode === 'true');
    }
});