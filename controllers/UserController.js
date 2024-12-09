const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Créer un nouvel utilisateur
exports.createUser = async (req, res) => {
    try {
        const { username, birthDate, phoneNumber, email, password } = req.body;

        // Vérification si l'email ou le nom d'utilisateur existe déjà
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Email ou nom d\'utilisateur déjà existant' });
        }

        const newUser = new User({ username, email, password, phoneNumber, birthDate });

        // Sauvegarder l'utilisateur dans la base de données
        await newUser.save();

        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
};

// Obtenir tous les utilisateurs
exports.getAll = async (req, res) => {
    try {
        const users = await User.find(); // Récupérer tous les utilisateurs
        res.status(200).json(users); // Retourner les utilisateurs au format JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
};

// Supprimer un utilisateur
exports.delete = async (req, res) => {
    const { userId } = req.params; // Récupérer l'ID de l'utilisateur à partir des paramètres de la requête
  
    try {
        // Trouver et supprimer l'utilisateur par son ID
        const user = await User.findByIdAndDelete(userId);
  
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
  
        res.status(200).json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
};

// Authentifier un utilisateur (login)
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Utilisateur non trouvé' });
        }

        // Comparer le mot de passe
        const isMatch = await bcrypt.compare(password, user.password); // Utilisation de bcrypt pour comparer les mots de passe
        if (!isMatch) {
            return res.status(400).json({ message: 'Mot de passe incorrect' });
        }

        // Générer un token JWT
        const token = jwt.sign({ userId: user._id }, 'votre_secret', { expiresIn: '1h' });

        res.status(200).json({ message: 'Connexion réussie', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
};

exports.authenticate = async (req, res) => {
    const { email, password } = req.body;

    // Vérifiez si l'email et le mot de passe sont fournis
    if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    try {
        // Vérifier si l'email existe dans la base de données
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe invalide' });
        }

        // Comparer le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou mot de passe invalide' });
        }

        // Générer un token JWT
        const token = jwt.sign({ userId: user._id }, 'votre_secret', { expiresIn: '1h' });

        // Succès : Retourner le token
        res.status(200).json({
            message: 'Connexion réussie',
            token,
            user: {
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber,
                birthDate: user.birthDate,
            },
        });
    } catch (error) {
        console.error('Erreur lors de l\'authentification :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

