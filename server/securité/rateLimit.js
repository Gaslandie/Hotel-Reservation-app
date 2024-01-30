// une attaque par  deni de service vise à rendre une ressource(serveur,service ,site web) indisponible pour ses utilisateurs
//legitimes. cela se fait souvent en surchargeant le serveur avec un très grand nombre de requetes en peu de temps, ce qui epuise les ressources du serveur

//Attaque par force brute: une attaque par force brute consiste à tenter de nombreuses combinaisons de noms d'utilisateurs et de mot de passe
//ou d'autres donnée d'identification dans le but de s'introduire dans un systeme, cela se fait souvent en automatisant les requêtes de connexion ou d'autres formulaires


const rateLimit = require('express-rate-limit');//aide à prevenir les attaques par deni de service et le bourrage par force brute
//express rate limit cree un limiteur de debit pour les requetes à notre application express.il
//limite le nombre de requetes qu'un utilisateur peut faire notre API dans un intervalle detemps defini.

const limiter = rateLimit({
    windowMs:15 * 60 * 1000,
    max:100//limite chaque Ip à 100 requetes par fenetre
})

module.exports = limiter;