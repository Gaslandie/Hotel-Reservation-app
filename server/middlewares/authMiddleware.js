//ce middleware est pour gerer l'authentification dans notre application
//il verifiera si le token jwt est present et valide dans les requetes entrantes,et affichera les informations de l'utilisateur
//comme l'id à l'objet req pour une utilisation ulterieur dans nos controleurs

const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req,res,next) => {
    let token;
    //l'en-tete authorization est souvent utilisé pour transmettre des tokens d'authentification
    //dans les systemes d'authentification basés sur les tokens, comme ceux utilisant jwt,il est 
    //courant de prefixer le token avec le mot Bearer suivi d'un espace
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        
        try {
            //extraire le token du header,on split avec l'espace car après Bearer il ya un espace,et Bearer
            //ayant l'indice 0,on recupere le token qui se trouve à l'indice 1
            token = req.headers.authorization.split(' ')[1];
            
            //on ajoute à notre objet requete,de recuperer le user à l'aide son id mais sans le mot de passe
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');
            
            next();
            

        } catch (error) {
            res.status(401).json({message:'Not authorized,token failed'});
        }
    }
    if(!token){
        res.status(401).json({message:'Not authorized ,no token'})
    }
}
//autorisation
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `User role ${req.user.role} is not authorized to access this route` });
        }
        next();
    };
};

module.exports = {protect, authorize };