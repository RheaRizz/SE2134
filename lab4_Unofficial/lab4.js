document.addEventListener('DOMContentLoaded', function () {
    var animalIcons = ['fa-fish', 'fa-cat', 'fa-dog', 'fa-dragon'];
    var colors = ['#FF5733', '#33FFA6', '#3366FF', '#FF33D1'];
    var storedAnimal = localStorage.getItem('inviscord.animal');
    var storedColor = localStorage.getItem('inviscord.color');
    if (!storedAnimal || !storedColor) {
        storedAnimal = animalIcons[Math.floor(Math.random() * animalIcons.length)];
        storedColor = colors[Math.floor(Math.random() * colors.length)];
        localStorage.setItem('inviscord.animal', storedAnimal);
        localStorage.setItem('inviscord.color', storedColor);
    }
    var userAvatar = document.getElementById('user-avatar');
    if (userAvatar) {
        userAvatar.innerHTML = "<i class=\"fa-solid ".concat(storedAnimal, "\" style=\"color: ").concat(storedColor, ";\"></i>");
    }
});
