    const divs = document.querySelectorAll('.clickable-div');
    let clickCount = 0;

    divs.forEach(div => {
        console.log("hello")
        div.addEventListener('click', function handleClick() {
            // Disable further clicks on this div
            div.children[0].src = "glass1.png";
            div.removeEventListener('click', handleClick);
            clickCount++;

            if (clickCount === 4) {
                const p = document.createElement('p');
                /*p.textContent = 'Tous les divs ont été cliqués!';*/
                
                document.getElementById('secret').innerHTML = "You hear a voice from above !";
                document.getElementById('secret').style.color =  "#FB6072";
            }
        });
    });
