const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController"); // Assurez-vous que le chemin est correct

// Route pour créer un produit
router.post("/create", productController.create);

// Route pour récupérer tous les produits
router.get("/all", productController.findAll);

module.exports = router;
