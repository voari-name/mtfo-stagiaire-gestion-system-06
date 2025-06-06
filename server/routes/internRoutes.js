
const express = require('express');
const router = express.Router();
const Intern = require('../models/Intern');
const { authenticateToken } = require('../middleware/auth');

// Obtenir tous les stagiaires
router.get('/', authenticateToken, async (req, res) => {
  try {
    const interns = await Intern.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      interns
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des stagiaires:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

// Obtenir un stagiaire par ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const intern = await Intern.findOne({ id: req.params.id });
    
    if (!intern) {
      return res.status(404).json({
        success: false,
        message: 'Stagiaire non trouvé'
      });
    }
    
    res.json({
      success: true,
      intern
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du stagiaire:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

// Créer un nouveau stagiaire
router.post('/', authenticateToken, async (req, res) => {
  try {
    const internData = req.body;
    
    // Vérifier si un stagiaire avec le même ID existe déjà
    const existingIntern = await Intern.findOne({ id: internData.id });
    if (existingIntern) {
      return res.status(400).json({
        success: false,
        message: 'Un stagiaire avec cet ID existe déjà'
      });
    }
    
    const newIntern = new Intern({
      ...internData,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    
    await newIntern.save();
    
    res.status(201).json({
      success: true,
      message: 'Stagiaire créé avec succès',
      intern: newIntern
    });
  } catch (error) {
    console.error('Erreur lors de la création du stagiaire:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

// Mettre à jour un stagiaire
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const internData = req.body;
    
    const updatedIntern = await Intern.findOneAndUpdate(
      { id: req.params.id },
      { ...internData, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!updatedIntern) {
      return res.status(404).json({
        success: false,
        message: 'Stagiaire non trouvé'
      });
    }
    
    res.json({
      success: true,
      message: 'Stagiaire mis à jour avec succès',
      intern: updatedIntern
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du stagiaire:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

// Supprimer un stagiaire
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deletedIntern = await Intern.findOneAndDelete({ id: req.params.id });
    
    if (!deletedIntern) {
      return res.status(404).json({
        success: false,
        message: 'Stagiaire non trouvé'
      });
    }
    
    res.json({
      success: true,
      message: 'Stagiaire supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du stagiaire:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

module.exports = router;
