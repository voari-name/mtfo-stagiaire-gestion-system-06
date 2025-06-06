
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/auth');

// Route d'inscription
router.post('/register', async (req, res) => {
  try {
    const { username, password, firstName, lastName, email, role } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Nom d\'utilisateur ou email déjà utilisé'
      });
    }

    // Créer un nouvel utilisateur
    const newUser = new User({
      username,
      password,
      firstName,
      lastName,
      email,
      role: role || 'user'
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

// Route de connexion
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Trouver l'utilisateur
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Nom d\'utilisateur ou mot de passe incorrect'
      });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Nom d\'utilisateur ou mot de passe incorrect'
      });
    }

    // Mettre à jour la dernière connexion
    user.lastLogin = Date.now();
    await user.save();

    // Créer un token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Envoyer le token dans un cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
      secure: process.env.NODE_ENV === 'production'
    });

    res.json({
      success: true,
      message: 'Connexion réussie',
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

// Route de déconnexion
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({
    success: true,
    message: 'Déconnexion réussie'
  });
});

// Route pour obtenir le profil utilisateur actuel
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

// Route pour mettre à jour le profil utilisateur
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, email, profilePhoto } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, email, profilePhoto, updatedAt: Date.now() },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profil mis à jour',
      user: updatedUser
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

module.exports = router;
