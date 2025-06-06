
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { authenticateToken } = require('../middleware/auth');

// Obtenir tous les projets
router.get('/', authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      projects
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

// Obtenir un projet par ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findOne({ id: req.params.id });
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }
    
    res.json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du projet:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

// Créer un nouveau projet
router.post('/', authenticateToken, async (req, res) => {
  try {
    const projectData = req.body;
    
    // Vérifier si un projet avec le même ID existe déjà
    const existingProject = await Project.findOne({ id: projectData.id });
    if (existingProject) {
      return res.status(400).json({
        success: false,
        message: 'Un projet avec cet ID existe déjà'
      });
    }
    
    const newProject = new Project({
      ...projectData,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    
    await newProject.save();
    
    res.status(201).json({
      success: true,
      message: 'Projet créé avec succès',
      project: newProject
    });
  } catch (error) {
    console.error('Erreur lors de la création du projet:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

// Mettre à jour un projet
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const projectData = req.body;
    
    const updatedProject = await Project.findOneAndUpdate(
      { id: req.params.id },
      { ...projectData, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }
    
    res.json({
      success: true,
      message: 'Projet mis à jour avec succès',
      project: updatedProject
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du projet:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

// Supprimer un projet
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deletedProject = await Project.findOneAndDelete({ id: req.params.id });
    
    if (!deletedProject) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }
    
    res.json({
      success: true,
      message: 'Projet supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

module.exports = router;
