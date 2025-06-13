
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    // Connexion à MongoDB
    const mongoURI = process.env.MONGO_URI || process.env.MONGO_URI_LOCAL || 'mongodb://localhost:27017/mtfop_db';
    await mongoose.connect(mongoURI);
    console.log('Connecté à MongoDB');

    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ username: 'RAHAJANIAINA' });
    if (existingAdmin) {
      console.log('Utilisateur admin existe déjà');
      return;
    }

    // Créer l'utilisateur admin
    const adminUser = new User({
      username: 'RAHAJANIAINA',
      password: 'Olivier',
      firstName: 'Olivier',
      lastName: 'RAHAJANIAINA',
      email: 'admin@mtfop.mg',
      role: 'admin'
    });

    await adminUser.save();
    console.log('✅ Utilisateur admin créé avec succès');
    console.log('Username: RAHAJANIAINA');
    console.log('Password: Olivier');

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

createAdminUser();
