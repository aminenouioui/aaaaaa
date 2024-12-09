// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Définition du schéma User
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    birthDate: {
        type: Date,
        required: false
    },
    phoneNumber: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
});

// Hachage du mot de passe avant de sauvegarder un utilisateur
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Méthode pour comparer le mot de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Création du modèle User
const User = mongoose.model('User', userSchema);

module.exports = User;
