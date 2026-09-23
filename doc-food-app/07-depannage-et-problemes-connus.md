# 7. Dépannage et problèmes connus

Le bug JWT est corrigé, mais en relisant tout le code j'ai trouvé 3 autres problèmes que tu vas rencontrer après l'ajout d'un plat. Ils sont décrits ici avec leur correction, pour que tu saches les reconnaître en refaisant le projet.

## 7.1 Bug corrigé : « JWT Verification failed: invalid signature »

- **Symptôme** : popup « Invalid or expired token » sur toutes les actions admin.
- **Cause** : en modules ES, tous les `import` s'exécutent avant le reste du fichier. `dotenv.config()` tournait donc **après** le chargement de `authController.js`, qui avait déjà lu une clé vide et pris la clé de secours. Le token était signé avec la clé de secours et vérifié avec la vraie clé du `.env`.
- **Correction** : `import 'dotenv/config';` en toute première ligne de `server.js`, et lecture de la clé au moment de signer (`getJwtSecret()`).
- **Leçon** : ne jamais lire `process.env` au niveau du module dans un fichier importé ; le lire dans la fonction.

## 7.2 Problème à corriger : `id` au lieu de `_id`

- **Symptôme attendu** : modifier, supprimer ou « épuiser » un plat envoie la requête vers `/api/menu/undefined` (erreur 500) ; au panier, tous les plats se confondent.
- **Cause** : MongoDB nomme l'identifiant `_id`. Le client utilise `item.id` partout (`FoodCard.jsx`, `CartContext.jsx`, `AdminDashboard.jsx`, `CheckoutModal.jsx`), un reste de l'ancienne version en mémoire.
- **Correction la plus simple** : demander à Mongoose d'ajouter aussi `id` dans le JSON, dans chaque modèle :

```js
const MenuItemSchema = new mongoose.Schema({ /* champs */ }, {
  timestamps: true,
  toJSON: { virtuals: true }
});
```

`virtuals: true` ajoute le champ virtuel `id` (le `_id` en texte) à chaque réponse. Tout le code client existant marche alors sans autre changement.

## 7.3 Problème à corriger : les commandes ne sont pas dans MongoDB

- **Symptôme attendu** : « Item with ID ... no longer exists » en passant commande ; les commandes disparaissent au redémarrage du serveur ; rapports vides.
- **Cause** : `orderController.js` utilise encore `db` de `data/store.js`, une base en mémoire avec ses propres plats (`item-1`, `item-2`...). Les plats de MongoDB n'y sont pas.
- **Correction** : réécrire le contrôleur avec les modèles Mongoose, sur le même principe que `menuController.js` :
  - `db.getMenuItemById(id)` → `await MenuItem.findById(id)`
  - `db.createOrder({...})` → `await Order.create({...})` (avec `itemId` au lieu de `id` dans chaque ligne)
  - `db.getOrders()` → `await Order.find().sort({ createdAt: -1 })`
  - `db.getOrdersByUser(id)` → `await Order.find({ userId: id })`
  - `db.updateOrderStatus(id, s)` → `await Order.findByIdAndUpdate(id, { status: s }, { new: true })`
  - Rendre les fonctions `async`. Dans les rapports, `createdAt` devient une `Date` : utiliser `o.createdAt.toISOString()` avant `startsWith`.
  - `paymentMethod` : le client envoie `Credit Card (Stripe)` et `Digital Wallet`, absents de la liste `enum` du modèle. Ajouter ces valeurs à l'`enum`.

## 7.4 Sécurité : le fichier `.env` est sur GitHub

- **Problème** : `server/.env` est commité. Toute personne qui voit le dépôt a ta clé JWT et l'accès à ta base.
- **Correction** :
  1. Créer `server/.gitignore` avec les lignes `.env` et `node_modules`.
  2. `git rm --cached server/.env` (retire le fichier de Git sans l'effacer de ton disque).
  3. Sur Atlas, changer le mot de passe de l'utilisateur (section 4, étape 3) et mettre la nouvelle URI dans `.env`.
  4. Changer `JWT_SECRET` (puis se reconnecter).

## 7.5 Tableau des erreurs courantes

| Message ou symptôme | Cause probable | Solution |
| --- | --- | --- |
| `Invalid or expired token` | Token signé avec une autre clé, ou plus de 7 jours | Se déconnecter / reconnecter ; vérifier que `dotenv` est chargé en premier |
| `Authentication required. No token provided.` | En-tête `Authorization` absent | Vérifier que le token est passé à la fonction de `api.js` |
| `Access denied. Admin privileges required.` | Connecté avec un compte non admin | Se connecter avec `admin@example.com` |
| `Email ou mot de passe incorrect.` | Comptes de démo absents de la base | `node seedUsers.js` |
| `EADDRINUSE: address already in use :::5001` | Le serveur tourne déjà dans un autre terminal | Fermer l'autre terminal ou `Ctrl + C` |
| `Cannot find module 'express'` | Dépendances non installées | `npm install` dans `server/` |
| `SyntaxError: Cannot use import statement outside a module` | `"type": "module"` manquant | L'ajouter dans `server/package.json` |
| Erreur CORS dans la console du navigateur | Adresse du client absente de la liste `cors` | Ajouter l'adresse dans `server.js`, ou passer par le proxy Vite |
| `Failed to fetch` / `ECONNREFUSED` | Serveur arrêté | `npm run dev` dans `server/` |
| Menu vide | Base vide ou mauvaise base dans l'URI | `node seedMenu.js` ; vérifier `/food-ordering` dans l'URI |
| Changement du code non visible | nodemon non utilisé ou cache navigateur | `npm run dev` (pas `npm start`) ; `Ctrl + Shift + R` |
| Erreurs MongoDB | Voir le tableau de la section 4 | — |

## 7.6 Réflexes de débogage

1. **Lire le terminal du serveur** : chaque `console.error` y apparaît avec la vraie cause.
2. **Ouvrir la console du navigateur** (F12 → Console) et l'onglet **Network** : cliquer sur la requête rouge, regarder **Response**.
3. **Rejouer la requête dans Postman** : si elle marche dans Postman, le problème est côté React ; sinon, côté serveur.
4. **Ajouter des `console.log`** avant et après la ligne suspecte.
5. **Changer une seule chose à la fois**, puis retester.

---
Projet CraveDash (food-app) — documentation, 23 septembre 2026.
