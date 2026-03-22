function Changeeye() {
    document.getElementById("puppet").src = "EXPRESSION3.png";
}

function Changemouse() {
    document.getElementById("puppet").src = "EXPRESSION2.png";
}

var paragraph = document.getElementById('puppet');
var soundEffect = document.getElementById('soundEffect');

        // Ajouter un événement de clic sur la balise <p>
        paragraph.addEventListener('click', function() {
            soundEffect.play();
        });
