function Changefog() {
    var fogElement = document.getElementById("fog");
    fogElement.classList.add("hidden");
    setTimeout(function() {
        fogElement.src = "fog2.png";
        fogElement.classList.remove("hidden");
    }, 1000); // Correspond à la durée de la transition définie dans le CSS (1s)
}

function Changefog2() {
    var fogElement = document.getElementById("fog");
    fogElement.classList.add("hidden");
    setTimeout(function() {
        fogElement.src = "fog3.png";
        fogElement.classList.remove("hidden");
    }, 1000); // Correspond à la durée de la transition définie dans le CSS (1s)
}