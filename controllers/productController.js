// productController.js
const Product = require("../models/Product"); // Assurez-vous que ce chemin est correct

// Créer et sauvegarder un nouveau produit
exports.create = (req, res) => {
    // Valider la requête
    if (!req.body.nom || !req.body.description || !req.body.prix || !req.body.image) {
      return res.status(400).send({
        message: "Le contenu du produit ne peut pas être vide.",
      });
    }
   
    // Créer un produit
    const produit = new Product({
      nom: req.body.nom,
      description: req.body.description,
      prix: req.body.prix,
      image: req.body.image,
    });
   
    // Sauvegarder le produit dans la base de données
    produit
      .save()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Une erreur est survenue lors de la création du produit.",
        });
      });
};

// Récupérer tous les produits de la base de données
exports.findAll = (req, res) => {
    Product.find()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Une erreur est survenue lors de la récupération des produits.",
        });
      });
};
