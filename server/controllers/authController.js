import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Read at call time so it always matches the secret used in middleware/auth.js
const getJwtSecret = () => process.env.JWT_SECRET || 'crave_dash_super_secret_jwt_key_2026';

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nom, email et mot de passe sont requis.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Un compte avec cet email existe déjà.' });
    }

    const newUser = await User.create({
      name,
      email,
      password, // hashed by pre-save hook
      phone: phone || '',
      address: address || '',
      role: 'user'
    });

    const safeUser = newUser.toSafeObject();
    const token = jwt.sign(
      { id: safeUser._id, email: safeUser.email, role: safeUser.role, name: safeUser.name },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Inscription réussie',
      token,
      user: safeUser
    });
  } catch (error) {
    console.error("Erreur d'inscription :", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }
    res.status(500).json({ message: "Erreur serveur lors de l'inscription" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe sont requis.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    const safeUser = user.toSafeObject();
    const token = jwt.sign(
      { id: safeUser._id, email: safeUser.email, role: safeUser.role, name: safeUser.name },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: safeUser
    });
  } catch (error) {
    console.error('Erreur de connexion :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du profil' });
  }
};
