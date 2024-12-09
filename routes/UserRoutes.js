const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

// Route pour créer un utilisateur
router.post('/signup', userController.createUser);

// Route pour connecter un utilisateur (login)
router.post('/login', userController.loginUser);

// Route pour obtenir tous les utilisateurs
router.get("/", userController.getAll);

// Route pour authentifier un utilisateur
router.post("/auth", userController.authenticate);

// Route pour supprimer un utilisateur
router.delete("/:userId", userController.delete);

module.exports = router;
