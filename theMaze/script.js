//get the md file content if any
let mdContent;

try {
  mdContent = await loadTextFile("content.md");
} catch(error){
  //silently fails
}
//console.log("mdContent", mdContent);

//get all the p elements to automatize id transfer to parent

const allP = [...document.getElementsByClassName("answerContainer")[0].getElementsByTagName("p")];

allP.forEach((p) => {
  p.addEventListener("click", (event) => {
    const isEnd = (p.id === "end");
    console.log("p._nodeId", p._nodeId, "isEnd", isEnd);
    if (p._nodeId || isEnd) (
      window.parent.postMessage({
        nodeId: p._nodeId,
        md: mdContent,
        isEnd : isEnd
      })
    )
  });
});

/**
 * Charge un fichier texte à partir de son URL.
 * @param {string} url - L'URL du fichier texte à charger.
 * @returns {Promise<string>} Une promesse qui se résout avec le contenu du fichier texte ou se rejette avec une erreur.
 * @async
 * @example
 * // Utilisation de la fonction avec await
 * async function exempleUtilisation() {
 *   try {
 *     const contenu = await chargerFichierTexte("exemple.txt");
 *     console.log("Contenu du fichier :", contenu);
 *   } catch (erreur) {
 *     console.error("Erreur de chargement du fichier :", erreur);
 *   }
 * }
 * 
 * // Appeler la fonction exempleUtilisation pour charger le fichier texte
 * exempleUtilisation();
 */
async function loadTextFile(url) {
  return new Promise((resolve, reject) => {
    let requete = new XMLHttpRequest();
    requete.open("GET", url);
    requete.responseType = "text";
    requete.onload = function () {
      if (requete.status === 200) {
        resolve(requete.response);
      } else {
        reject(new Error(`Impossible de charger le fichier texte : ${url}`));
      }
    };
    requete.onerror = function () {
      reject(new Error(`Erreur de chargement du fichier texte : ${url}`));
    };
    requete.send();
  });
}
