var paragraph = document.getElementById('clickableParagraph');
var soundEffect = document.getElementById('soundEffect');

        // Ajouter un événement de clic sur la balise <p>
        paragraph.addEventListener('click', function() {
            soundEffect.play();
        });
