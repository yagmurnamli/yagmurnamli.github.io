var paragraph = document.getElementById('clickableParagraph');
var soundEffect = document.getElementById('soundEffect');

// Définir le volume à 1.0 s'il dépasse cette valeur après multiplication par 3
soundEffect.volume = Math.min(1.0, soundEffect.volume * 5);

// Ajouter un événement de clic sur la balise <p>
paragraph.addEventListener('click', function() {
    soundEffect.play();
});


/* 

document.addEventListener("DOMContentLoaded", function () {
    var timerElement = document.getElementById("timer");

    var observerOptions = {
        root: null, // par défaut, l'élément racine est le viewport
        rootMargin: '0px',
        threshold: 0.1 // déclenchement lorsque 10% de la div est visible
    };

    function handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                onTimerVisible();
                // Si vous souhaitez arrêter l'observation après la première intersection, décommentez la ligne suivante :
                // observer.unobserve(entry.target);
            }
        });
    }

    var observer = new IntersectionObserver(handleIntersection, observerOptions);
    observer.observe(timerElement);
});

*/