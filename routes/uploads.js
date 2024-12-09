const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Définir le stockage pour multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../images")); // Chemin où enregistrer les images
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, "-")+file.originalname); // Nom de fichier conservé comme original
    }
});

// Créer l'instance multer avec la configuration de stockage
const upload = multer({ storage });

// Route pour l'upload d'image
router.post("/", upload.single("image"), (req, res) => {
    res.status(200).json({ message: "Image téléchargée avec succès" });
});

module.exports = router;
