var paragraph = document.getElementById('clickableParagraph1');
var soundEffect = document.getElementById('soundEffect');
var soundEffect2 = document.getElementById('soundEffect2');
var timer = document.getElementById('soundEffect2');

        // Ajouter un événement de clic sur la balise <p>
        paragraph.addEventListener('click', function() {
            soundEffect.play();
            soundEffect2.play();
            
        });

        var paragraph = document.getElementById('clickableParagraph2');


        // Ajouter un événement de clic sur la balise <p>
        paragraph.addEventListener('click', function() {
            soundEffect.play();
        });

        var paragraph = document.getElementById('clickableParagraph3');


        // Ajouter un événement de clic sur la balise <p>
        paragraph.addEventListener('click', function() {
            soundEffect.play();
        });