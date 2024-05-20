function startTimer() {
    let count = 100; // Valeur de départ du timer
    const timerDiv = document.getElementById('timer'); // Récupération de la div

    const intervalId = setInterval(() => {
        timerDiv.textContent = count; // Mise à jour de la div avec la valeur actuelle
        count--; // Décrémentation du compteur
        
        if (count < 0) {
            clearInterval(intervalId); // Arrêt du timer lorsque le compteur est inférieur à 0
        }
    }, 600); // Intervalle de 1000 ms (1 seconde)
}
