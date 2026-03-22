/**
 * Asynchronously loads a script.
 *
 * @param {string} url - The URL of the script to be loaded.
 * @param {boolean} isModule - A flag indicating whether the script is an ES6 module.
 * @returns {Promise} A Promise that resolves when the script is loaded successfully, or rejects if the script fails to load.
 * @throws {Error} Throws an error if the input parameters are not valid.
 * @example
 * // Example of using loadScript function
 * const scriptUrl = "../../script.js";
 * const isModule = true;
 * loadScript(scriptUrl, isModule);
 */
export async function loadScript(url, isModule = false) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.async = false; // Ensures synchronous loading

        if (isModule) {
            script.type = "module";
        }

        script.onload = () => {
            resolve();
        };

        script.onerror = (error) => {
            reject(error);
        };

        document.head.appendChild(script);
    });
}

/**
 * Asynchronously loads multiple scripts.
 *
 * @param {string[]} urls - An array of URLs for the scripts to be loaded.
 * @param {boolean} isModule - A flag indicating whether the scripts are ES6 modules.
 * @returns {Promise} A Promise that resolves when all scripts are loaded successfully, or rejects if any of the scripts fail to load.
 * @throws {Error} Throws an error if the input parameters are not valid.
 * @example
 * // Example of using loadScripts function
 * const scriptUrls = ["script1.js", "script2.js", "script3.js"];
 * loadScripts(scriptUrls, true);
 */
export async function loadScripts(urls, isModule) {
    const promises = urls.map(url => loadScript(url, isModule));

    try {
        await Promise.all(promises);
    } catch (error) {
        console.error('Error loading scripts:', error);
    }
}


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
export async function loadTextFile(url) {
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
