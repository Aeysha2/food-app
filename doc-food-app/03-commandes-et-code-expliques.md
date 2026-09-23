# 3. Commandes et code expliqués ligne par ligne

Cette section explique d'abord toutes les commandes du terminal, puis chaque fichier important du serveur et du client, ligne par ligne. Les fichiers d'affichage très longs (`AdminDashboard.jsx`, 1 543 lignes) sont expliqués par blocs, car ils répètent les mêmes mécanismes.

## 3.1 Les commandes du terminal

| Commande | Où la taper | Ce qu'elle fait |
| --- | --- | --- |
| `node -v` / `npm -v` | Partout | Affiche la version de Node et de npm installée |
| `mkdir server client` | Racine du projet | Crée les deux dossiers |
| `cd server` | Racine | Entre dans le dossier `server` (`cd ..` pour remonter) |
| `npm init -y` | `server/` | Crée un `package.json` avec les réglages par défaut (`-y` = oui à tout) |
| `npm install express cors dotenv mongoose bcryptjs jsonwebtoken` | `server/` | Télécharge ces bibliothèques dans `node_modules/` et les note dans `package.json` |
| `npm install -D nodemon` | `server/` | Installe nodemon en outil de développement (`-D`) : il redémarre le serveur à chaque sauvegarde |
| `npm run dev` | `server/` | Lance le script `dev` = `nodemon server.js` |
| `npm start` | `server/` | Lance `node server.js` (sans redémarrage auto) |
| `node seedUsers.js` | `server/` | Crée les comptes admin et client de démo dans MongoDB |
| `node seedMenu.js` | `server/` | Efface tous les plats puis insère les 9 plats de démo |
| `npm create vite@latest . -- --template react` | `client/` | Crée un projet React avec Vite dans le dossier courant (`.`) |
| `npm install` | `client/` ou `server/` | Installe toutes les dépendances listées dans `package.json` (à faire après un `git clone`) |
| `npm install tailwindcss @tailwindcss/vite lucide-react` | `client/` | Ajoute Tailwind et les icônes |
| `npm run dev` | `client/` | Lance Vite sur http://localhost:5173 |
| `npm run build` | `client/` | Fabrique la version finale optimisée dans `client/dist/` |
| `npm run install-all` | Racine | Installe `server` puis `client` en une commande |
| `Ctrl + C` | Terminal qui tourne | Arrête le serveur ou Vite |
| `git init` | Racine | Transforme le dossier en dépôt Git |
| `git status` | Racine | Montre les fichiers modifiés |
| `git add .` | Racine | Prépare tous les fichiers modifiés pour le prochain commit |
| `git commit -m "message"` | Racine | Enregistre une version avec un message |
| `git push -u origin main` | Racine | Envoie les commits sur GitHub |
| `git pull` | Racine | Récupère les derniers commits de GitHub |
| `git checkout nom-branche` | Racine | Change de branche |

## 3.2 `server/package.json`

```json
{
  "name": "food-ordering-server",
  "type": "module",
  "main": "server.js",
  "scripts": { "start": "node server.js", "dev": "nodemon server.js" },
  "dependencies": { "bcryptjs": "...", "cors": "...", "dotenv": "...", "express": "...", "jsonwebtoken": "...", "mongoose": "..." },
  "devDependencies": { "nodemon": "..." }
}
```

- `name` : le nom du projet.
- `type: "module"` : autorise `import ... from` (syntaxe moderne). Sans ça, il faudrait `require()`.
- `main` : le fichier de départ.
- `scripts` : des raccourcis. `npm run dev` exécute `nodemon server.js`.
- `dependencies` : bibliothèques nécessaires pour faire tourner l'appli. `devDependencies` : seulement pour développer.

## 3.3 `server/.env`

```bash
PORT=5001
JWT_SECRET=une_longue_phrase_secrete
CLIENT_URL=http://localhost:5173
NODE_ENV=development
MONGO_URI=mongodb+srv://utilisateur:motdepasse@cluster0.xxxx.mongodb.net/food-ordering
```

- `PORT` : le port où le serveur écoute.
- `JWT_SECRET` : la clé qui signe les tokens. Si elle change, tous les tokens existants deviennent invalides.
- `CLIENT_URL` : l'adresse du site React.
- `NODE_ENV` : `development` affiche plus de détails d'erreur.
- `MONGO_URI` : l'adresse de la base Atlas (section 4).

## 3.4 `server/server.js` — le point d'entrée

```js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import connectDB from './config/database.js';

connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'], credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'online', timestamp: new Date().toISOString(), service: 'Food Ordering Platform API' });
});

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
});

app.listen(PORT, () => {
  console.log(`🚀 Food Ordering Server running on http://localhost:${PORT}`);
});
```

- `import 'dotenv/config'` : lit le fichier `.env` et remplit `process.env`. **Doit être le premier import** (c'est la correction du bug JWT, voir section 7).
- `import express` : le framework qui crée le serveur HTTP.
- `import cors` : autorise le navigateur à appeler le serveur depuis une autre adresse (5173 → 5001).
- `import authRoutes ...` (3 lignes) : récupère les listes de routes de chaque domaine.
- `import connectDB` : la fonction qui se connecte à MongoDB.
- `connectDB()` : lance la connexion à la base.
- `const app = express()` : crée l'application serveur.
- `const PORT = process.env.PORT || 5001` : prend le port du `.env`, sinon 5001.
- `app.use(cors({...}))` : liste des adresses autorisées à appeler l'API.
- `app.use(express.json())` : transforme le corps JSON des requêtes en objet `req.body`. Sans cette ligne, `req.body` est vide.
- `app.use('/api/auth', authRoutes)` : toutes les URL qui commencent par `/api/auth` vont dans `authRoutes`. Idem pour `/api/menu` et `/api/orders`.
- `app.get('/api/health', ...)` : une route de test qui répond « en ligne ».
- Premier `app.use((req, res) => ...)` : si aucune route ne correspond, répond 404.
- Second `app.use((err, req, res, next) => ...)` : attrape toutes les erreurs non gérées et répond 500. Express le reconnaît grâce aux **4 paramètres**.
- `app.listen(PORT, ...)` : démarre le serveur et affiche le message dans le terminal.

## 3.5 `server/config/database.js`

```js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000, socketTimeoutMS: 45000 });
    console.log(`✅ MongoDB connecté : ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB :', error.message);
    process.exit(1);
  }
};

export default connectDB;
```

- `import mongoose` : la bibliothèque qui parle à MongoDB.
- `const connectDB = async () => {` : fonction asynchrone, car la connexion prend du temps.
- `try {` : on essaie ; si ça échoue on va dans `catch`.
- `await mongoose.connect(process.env.MONGO_URI, {...})` : se connecte avec l'URI du `.env`. On attend (`await`) la fin.
- `serverSelectionTimeoutMS: 10000` : abandonne après 10 secondes si Atlas ne répond pas.
- `socketTimeoutMS: 45000` : coupe une requête inactive après 45 secondes.
- `console.log(...)` : affiche l'hôte Atlas connecté.
- `catch (error)` : affiche l'erreur.
- `process.exit(1)` : arrête le serveur (code 1 = erreur). Inutile de tourner sans base.
- `export default connectDB` : rend la fonction importable ailleurs.

## 3.6 `server/models/User.js`

```js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: [true, 'Le nom est requis'], trim: true, maxlength: [100, '...'] },
  email:    { type: String, required: [true, "L'email est requis"], unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Format email invalide'] },
  password: { type: String, required: [true, '...'], minlength: [6, '...'] },
  role:     { type: String, enum: ['user', 'admin'], default: 'user' },
  phone:    { type: String, default: '' },
  address:  { type: String, default: '' }
}, { timestamps: true });

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', UserSchema);
export default User;
```

- `new mongoose.Schema({...})` : décrit la forme d'un utilisateur dans la base.
- `type: String` : le champ est du texte.
- `required: [true, 'message']` : champ obligatoire, avec le message d'erreur.
- `trim: true` : enlève les espaces au début et à la fin.
- `unique: true` : MongoDB refuse deux fois le même email (erreur code 11000).
- `lowercase: true` : met l'email en minuscules.
- `match: [regex, ...]` : vérifie que l'email ressemble à `x@y.z`.
- `minlength: 6` : au moins 6 caractères.
- `enum: ['user', 'admin']` : seules ces deux valeurs sont acceptées.
- `default: 'user'` : valeur si on ne la donne pas.
- `{ timestamps: true }` : ajoute automatiquement `createdAt` et `updatedAt`.
- `UserSchema.pre('save', ...)` : code exécuté **avant** chaque enregistrement.
- `if (!this.isModified('password')) return` : si le mot de passe n'a pas changé, on ne le re-hache pas.
- `bcrypt.hash(this.password, 10)` : remplace le mot de passe par son hash. `10` = coût du calcul.
- `comparePassword` : compare le mot de passe tapé avec le hash enregistré. Renvoie `true` ou `false`.
- `toSafeObject` : copie l'utilisateur et **supprime le mot de passe** avant de l'envoyer au navigateur.
- `mongoose.model('User', UserSchema)` : crée le modèle. Mongoose utilisera la collection `users`.

## 3.7 `server/models/MenuItem.js`

Même principe que `User.js`. Champs : `name` (≤ 120 caractères), `category`, `price` (≥ 0), `description` (≤ 500), `image` (URL, une image Unsplash par défaut), `rating` (0 à 5, défaut 5), `reviewsCount`, `prepTime` (défaut « 20 min »), `isVeg`, `isAvailable` (défaut `true`), `isPopular`. `timestamps: true` ajoute les dates. Collection : `menuitems`.

## 3.8 `server/models/Order.js`

- `OrderItemSchema` : un plat dans une commande (`itemId`, `name`, `price`, `quantity ≥ 1`, `image`, `category`). `{ _id: false }` : pas d'identifiant propre pour chaque ligne.
- `OrderSchema` : `orderNumber` (unique), `userId` (défaut `guest-user`), client, `items: [OrderItemSchema]` (un tableau de lignes), montants, adresse, `paymentMethod` (liste fermée), `paymentStatus`, `status` (les 5 statuts), `estimatedDeliveryTime`.
- `OrderSchema.pre('save', ...)` : avant d'enregistrer, compte les commandes existantes et crée un numéro `ORD-0001`, `ORD-0002`, etc. `padStart(4, '0')` ajoute des zéros devant.

## 3.9 `server/middleware/auth.js`

```js
import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required. No token provided.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || 'crave_dash_super_secret_jwt_key_2026';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification failed:", error.message);
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  next();
};
```

- Un **middleware** est une fonction placée entre la requête et le contrôleur. Elle laisse passer (`next()`) ou bloque (`res.status(...)`).
- `req.headers.authorization` : lit l'en-tête envoyé par le client, par exemple `Bearer eyJhbGci...`.
- `if (!authHeader || !authHeader.startsWith('Bearer '))` : pas d'en-tête ou mauvais format → 401 (non authentifié).
- `authHeader.split(' ')[1]` : coupe au niveau de l'espace et garde la 2e partie, le token.
- `jwt.verify(token, secret)` : vérifie la signature et la date d'expiration. Si c'est bon, renvoie le contenu du token (`id`, `email`, `role`, `name`).
- `req.user = decoded` : attache l'utilisateur à la requête pour les fonctions suivantes.
- `next()` : passe à la fonction suivante.
- `catch` : token faux ou expiré → 403 et le message « Invalid or expired token » que tu as vu.
- `requireAdmin` : vérifie que `req.user.role` vaut `'admin'`, sinon 403. Il doit toujours venir **après** `requireAuth`.

## 3.10 `server/controllers/authController.js`

```js
const getJwtSecret = () => process.env.JWT_SECRET || 'crave_dash_super_secret_jwt_key_2026';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email et mot de passe sont requis.' });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    const safeUser = user.toSafeObject();
    const token = jwt.sign(
      { id: safeUser._id, email: safeUser.email, role: safeUser.role, name: safeUser.name },
      getJwtSecret(),
      { expiresIn: '7d' }
    );
    res.json({ message: 'Connexion réussie', token, user: safeUser });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
};
```

- `getJwtSecret` : lit la clé **au moment de l'appel**, comme le middleware. Les deux utilisent donc toujours la même clé.
- `const { email, password } = req.body` : récupère les champs envoyés (« déstructuration »).
- Premier `if` : champ manquant → 400 (mauvaise requête).
- `User.findOne({ email })` : cherche l'utilisateur en base.
- `if (!user)` : pas trouvé → 401. Le message ne dit pas si c'est l'email ou le mot de passe qui est faux, pour ne pas aider un pirate.
- `user.comparePassword(password)` : compare avec le hash.
- `toSafeObject()` : retire le mot de passe.
- `jwt.sign(contenu, clé, options)` : fabrique le token. Contenu = id, email, rôle, nom. `expiresIn: '7d'` = valable 7 jours.
- `res.json({...})` : renvoie le token et l'utilisateur au navigateur.
- `register` fait la même chose, mais crée d'abord l'utilisateur avec `User.create(...)`. Il force `role: 'user'` : on ne peut pas s'inscrire en admin. Il répond 201 (créé).
- `getMe` : `User.findById(req.user.id).select('-password')` renvoie le profil sans le mot de passe.

## 3.11 `server/controllers/menuController.js`

- `getMenuItems` : lit `category`, `search`, `vegOnly` dans l'URL (`req.query`) et construit un filtre MongoDB.
  - Filtre catégorie : une expression régulière `^catégorie$` avec l'option `i`, donc catégorie exacte sans tenir compte des majuscules.
  - Filtre recherche : l'opérateur `or` de MongoDB cherche le mot dans le nom **ou** dans la description.
  - `MenuItem.find(query).sort({ isPopular: -1, createdAt: 1 })` : populaires d'abord, puis du plus ancien au plus récent.
- `getCategories` : `MenuItem.distinct('category')` renvoie la liste des catégories sans doublons, avec `All` devant.
- `getMenuItemById` : `findById(req.params.id)`, où `:id` est dans l'URL.
- `createMenuItem` : vérifie nom, catégorie et prix, puis `MenuItem.create({...})`. `parseFloat(price)` transforme `"12.5"` en nombre 12.5. `Boolean(isVeg)` force vrai ou faux.
- `updateMenuItem` : `findByIdAndUpdate(id, ..., { new: true, runValidators: true })` avec l'opérateur `set` de MongoDB, qui modifie seulement les champs envoyés. `new: true` renvoie la version modifiée, `runValidators` revérifie les règles du schéma.
- `deleteMenuItem` : `findByIdAndDelete`. Renvoie 404 si le plat n'existe pas.

## 3.12 `server/controllers/orderController.js`

- `createOrder` : pour chaque ligne envoyée, relit le plat côté serveur, vérifie qu'il existe et qu'il est disponible, puis recalcule.
  - `Math.max(1, parseInt(orderItem.quantity) || 1)` : quantité d'au moins 1.
  - `Math.round(subtotal * 0.08 * 100) / 100` : taxe de 8 % arrondie à 2 décimales.
  - `subtotal >= 45 ? 0 : 3.50` : livraison gratuite à partir de 45.
  - `req.user ? req.user.id : 'guest-user'` : utilisateur connecté ou invité.
- `getUserOrders`, `getOrderById`, `getAllOrders` : lectures simples.
- `updateOrderStatus` : refuse tout statut qui n'est pas dans `validStatuses`.
- `getOrderReports` : filtre les commandes par jour, mois ou année (`createdAt.startsWith('2026-09')`), les range par heure, jour ou mois, puis calcule chiffre d'affaires, panier moyen, top 6 des plats et répartition par catégorie.
- Attention : ce contrôleur lit encore `data/store.js` (mémoire) et pas MongoDB (voir section 7).

## 3.13 `server/routes/menuRoutes.js`

```js
const router = express.Router();
router.get('/', getMenuItems);
router.get('/categories', getCategories);
router.get('/:id', getMenuItemById);
router.post('/', requireAuth, requireAdmin, createMenuItem);
router.put('/:id', requireAuth, requireAdmin, updateMenuItem);
router.delete('/:id', requireAuth, requireAdmin, deleteMenuItem);
export default router;
```

- `express.Router()` : un mini-serveur pour regrouper des routes.
- `router.get('/', ...)` : répond à `GET /api/menu` (le préfixe vient de `server.js`).
- `/categories` est déclaré **avant** `/:id`. Sinon Express croirait que « categories » est un id.
- `router.post('/', requireAuth, requireAdmin, createMenuItem)` : les fonctions s'exécutent dans l'ordre. Token valide, puis rôle admin, puis création.
- `put` = modifier, `delete` = supprimer.

## 3.14 `server/seedUsers.js` et `seedMenu.js`

- `dotenv.config()` puis `mongoose.connect(process.env.MONGO_URI)` : connexion à Atlas.
- `User.findOne({ email: 'admin@example.com' })` : vérifie si l'admin existe déjà.
- `User.create({...})` : sinon le crée. Le mot de passe est haché par le `pre('save')`.
- `MenuItem.deleteMany({})` : **efface tous les plats**. `insertMany(items)` : insère la liste.
- `process.exit(0)` : termine le script (0 = succès).

## 3.15 `client/vite.config.js`

```js
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: { '/api': { target: 'http://localhost:5001', changeOrigin: true } }
  }
});
```

- `plugins: [react(), tailwindcss()]` : active JSX/React et Tailwind.
- `port: 5173` : le port du site.
- `proxy` : quand le navigateur appelle `/api/...`, Vite transmet au serveur 5001. C'est pour ça qu'on écrit `fetch('/api/menu')` sans l'adresse complète.
- `changeOrigin: true` : le serveur voit la requête comme venant de lui-même.

## 3.16 `client/src/main.jsx`

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- `import './index.css'` : charge Tailwind et les styles globaux.
- `document.getElementById('root')` : trouve la `<div id="root">` de `index.html`.
- `createRoot(...).render(<App />)` : React dessine toute l'application dans cette div.
- `StrictMode` : mode développement qui signale les erreurs courantes.

## 3.17 `client/src/services/api.js`

```js
const API_BASE_URL = '/api';

async createMenuItem(itemData, token) {
  const res = await fetch(`${API_BASE_URL}/menu`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(itemData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create menu item');
  return data;
},
```

- `API_BASE_URL = '/api'` : préfixe de toutes les requêtes (redirigé par le proxy).
- `fetch(url, options)` : envoie une requête HTTP depuis le navigateur.
- `method: 'POST'` : on crée quelque chose.
- `'Content-Type': 'application/json'` : prévient le serveur que le corps est du JSON.
- La ligne `Authorization` envoie le mot `Bearer`, un espace, puis le token. C'est ce que lit `requireAuth`.
- `JSON.stringify(itemData)` : transforme l'objet JavaScript en texte JSON.
- `await res.json()` : lit la réponse du serveur.
- `if (!res.ok) throw new Error(...)` : si le statut n'est pas 2xx, on déclenche une erreur avec le message du serveur. C'est ce message qui s'affiche en popup.
- Toutes les autres fonctions (`getMenu`, `login`, `createOrder`, `updateOrderStatus`...) suivent exactement ce modèle.

## 3.18 `client/src/context/AuthContext.jsx`

- `createContext()` : crée une « boîte » partagée par tous les composants, sans passer les données de parent en enfant.
- `useState(() => localStorage.getItem('crave_token') || null)` : au chargement, relit le token enregistré dans le navigateur.
- `useEffect(() => {...}, [user, token])` : chaque fois que `user` ou `token` change, les enregistre dans le `localStorage` (ou les efface si déconnecté).
- `login` : appelle `api.login`, puis `setUser` et `setToken`. `setLoading` affiche un chargement, `setAuthError` garde le message d'erreur.
- `quickDemoLogin('admin')` : connexion en un clic avec le compte de démo.
- `logout` : remet tout à `null`, ce qui efface le `localStorage`.
- `isAdmin: user?.role === 'admin'` : `?.` évite une erreur si `user` est `null`.
- `useAuth()` : raccourci pour lire le contexte dans un composant. `const { token, isAdmin } = useAuth();`.

## 3.19 `client/src/context/CartContext.jsx`

- `cartItems` : le tableau du panier, sauvegardé dans `localStorage` sous `crave_cart`.
- `addToCart(item)` : si le plat est déjà là, quantité + 1 ; sinon, on l'ajoute avec quantité 1.
- `updateQuantity(id, delta)` : ajoute `delta` (+1 ou −1). Si la quantité tombe à 0, `.filter(Boolean)` retire la ligne.
- `applyCoupon` : `CRAVE20` = 20 %, `FIRST5` = 5 dollars.
- Calculs : `subtotal` (somme prix × quantité), `discount`, `tax` (8 %), `deliveryFee`, `grandTotal`. Ils ne servent qu'à l'affichage : le serveur recalcule tout.

## 3.20 `client/src/App.jsx`

- Enveloppe l'appli dans `AuthProvider` et `CartProvider`.
- `useEffect(() => loadMenu(), [selectedCategory, searchTerm, vegOnly])` : recharge le menu dès qu'un filtre change.
- Trois écrans selon l'état :
  1. Pas connecté et pas invité → `<AuthPage />`.
  2. Admin (et pas en aperçu) → `<AdminDashboard />`.
  3. Sinon → la boutique : `Navbar`, `HeroBanner`, `CategoryFilter`, la grille de `FoodCard`, et les fenêtres `CartDrawer`, `CheckoutModal`, `OrderTrackerModal`.

## 3.21 Les composants (lecture par blocs)

Chaque composant suit la même structure : les imports, puis les `useState` (ce qui change à l'écran), puis les fonctions `handle...` (ce qui se passe au clic), puis le `return (...)` avec le JSX et les classes Tailwind.

| Composant | Lignes | Rôle |
| --- | --- | --- |
| `AdminDashboard.jsx` | 1 543 | Tableau de bord admin : vue d'ensemble, plats, commandes, rapports |
| `AdminPanelModal.jsx` | 367 | Ancienne version du panneau admin, en fenêtre |
| `AuthPage.jsx` | 309 | Page d'accueil connexion / inscription / continuer en invité |
| `CartDrawer.jsx` | 229 | Panier qui glisse depuis la droite |
| `CheckoutModal.jsx` | 223 | Formulaire de commande (adresse, paiement) |
| `OrderTrackerModal.jsx` | 215 | Suivi en 4 étapes |
| `AuthModal.jsx` | 202 | Connexion en fenêtre depuis la boutique |
| `Navbar.jsx` | 161 | Barre du haut : recherche, filtre végé, panier, compte |
| `FoodCard.jsx` | 122 | Carte d'un plat + boutons de quantité |
| `HeroBanner.jsx` | 73 | Grande bannière d'accueil |
| `CategoryFilter.jsx` | 49 | Boutons de catégories |

Exemple dans `AdminDashboard.jsx` : quand tu cliques sur « Enregistrer », `handleSaveDish` appelle `api.createMenuItem(dishForm, token)`, puis `onMenuUpdated()` recharge le menu côté client.

---
Projet CraveDash (food-app) — documentation, 23 septembre 2026.
