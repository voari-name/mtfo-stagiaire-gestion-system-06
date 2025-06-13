
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const internRoutes = require('./routes/internRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');

// Création de l'application Express
const app = express();
const PORT = process.env.PORT || 5000;

// Configuration CORS améliorée
const corsOptions = {
  origin: [
    process.env.CLIENT_URL || 'http://localhost:8081',
    'http://localhost:8080',
    'http://localhost:3000',
    // Ajoutez ici votre domaine de déploiement
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
  optionsSuccessStatus: 200
};

// Middlewares
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Middleware de logging pour le debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Connexion à MongoDB avec gestion d'erreur améliorée
const connectDB = async () => {
  try {
    // Utilise MONGO_URI pour Atlas ou MONGO_URI_LOCAL pour local
    const mongoURI = process.env.MONGO_URI || process.env.MONGO_URI_LOCAL || 'mongodb://localhost:27017/mtfop_db';
    
    console.log('Tentative de connexion à MongoDB...');
    console.log('URI utilisé:', mongoURI.replace(/\/\/.*@/, '//****:****@')); // Masque les credentials
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(mongoURI, options);
    console.log('✅ Connecté à MongoDB avec succès');
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB:', error.message);
    
    // En développement, essayer de se connecter à la base locale
    if (process.env.NODE_ENV === 'development' && process.env.MONGO_URI_LOCAL) {
      try {
        console.log('Tentative de connexion à la base locale...');
        await mongoose.connect(process.env.MONGO_URI_LOCAL);
        console.log('✅ Connecté à MongoDB local');
      } catch (localError) {
        console.error('❌ Impossible de se connecter à MongoDB local:', localError.message);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
};

// Connexion à la base de données
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/interns', internRoutes);
app.use('/api/evaluations', evaluationRoutes);

// Route de test pour vérifier la connectivité
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API MTFoP opérationnelle',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connectée' : 'Déconnectée'
  });
});

// Route de test
app.get('/', (req, res) => {
  res.send('API MTFoP en ligne - Prête pour le déploiement');
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Erreur serveur'
  });
});

// Gestion des routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📡 URL API: http://localhost:${PORT}/api`);
  console.log(`🌐 Client URL autorisé: ${process.env.CLIENT_URL}`);
});

// Gestion propre de l'arrêt du serveur
process.on('SIGINT', async () => {
  console.log('Arrêt du serveur...');
  await mongoose.connection.close();
  process.exit(0);
});
