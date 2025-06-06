
const express = require('express');
const router = express.Router();
const Evaluation = require('../models/Evaluation');
const { authenticateToken } = require('../middleware/auth');

// Obtenir toutes les évaluations
router.get('/', authenticateToken, async (req, res) => {
  try {
    const evaluations = await Evaluation.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      evaluations
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des évaluations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

// Obtenir une évaluation par ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const evaluation = await Evaluation.findOne({ id: req.params.id });
    
    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: 'Évaluation non trouvée'
      });
    }
    
    res.json({
      success: true,
      evaluation
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'évaluation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

// Créer une nouvelle évaluation
router.post('/', authenticateToken, async (req, res) => {
  try {
    const evaluationData = req.body;
    
    // Vérifier si une évaluation avec le même ID existe déjà
    const existingEvaluation = await Evaluation.findOne({ id: evaluationData.id });
    if (existingEvaluation) {
      return res.status(400).json({
        success: false,
        message: 'Une évaluation avec cet ID existe déjà'
      });
    }
    
    const newEvaluation = new Evaluation({
      ...evaluationData,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    
    await newEvaluation.save();
    
    res.status(201).json({
      success: true,
      message: 'Évaluation créée avec succès',
      evaluation: newEvaluation
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'évaluation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

// Mettre à jour une évaluation
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const evaluationData = req.body;
    
    const updatedEvaluation = await Evaluation.findOneAndUpdate(
      { id: req.params.id },
      { ...evaluationData, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!updatedEvaluation) {
      return res.status(404).json({
        success: false,
        message: 'Évaluation non trouvée'
      });
    }
    
    res.json({
      success: true,
      message: 'Évaluation mise à jour avec succès',
      evaluation: updatedEvaluation
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'évaluation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

// Supprimer une évaluation
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deletedEvaluation = await Evaluation.findOneAndDelete({ id: req.params.id });
    
    if (!deletedEvaluation) {
      return res.status(404).json({
        success: false,
        message: 'Évaluation non trouvée'
      });
    }
    
    res.json({
      success: true,
      message: 'Évaluation supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'évaluation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

module.exports = router;
