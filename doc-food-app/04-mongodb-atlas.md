# 4. MongoDB Atlas étape par étape

MongoDB Atlas héberge gratuitement la base de données dans le cloud. Il faut 6 étapes : compte, cluster, utilisateur, accès réseau, URI, test. Les noms des boutons viennent de l'interface Atlas et peuvent changer un peu avec le temps.

```mermaid
flowchart LR
  A[Compte] --> B[Cluster M0]
  B --> C[Utilisateur BDD]
  C --> D[Accès réseau]
  D --> E[URI dans .env]
  E --> F[Test + seed]
```

## Étape 1 — Créer le compte

1. Aller sur mongodb.com/cloud/atlas et cliquer sur **Try Free**.
2. S'inscrire avec un email ou un compte Google.
3. Atlas crée une **Organisation** et un **Projet**. On peut renommer le projet en `food-app`.

## Étape 2 — Créer le cluster gratuit

1. Cliquer sur **Create** (ou **Build a Database**).
2. Choisir l'offre **M0 / Free** : 512 Mo, suffisant pour ce projet.
3. Choisir un fournisseur (AWS) et une région proche (par exemple Paris ou Francfort).
4. Nommer le cluster (par défaut `Cluster0`) puis **Create Deployment**. La création prend 1 à 3 minutes.

## Étape 3 — Créer l'utilisateur de la base

Ce n'est **pas** ton compte Atlas : c'est l'identifiant que ton serveur Node utilisera.

1. Menu de gauche : **Security → Database Access** (ou l'écran « Security Quickstart » proposé juste après la création).
2. **Add New Database User**, méthode **Password**.
3. Nom d'utilisateur : par exemple `foodapp`. Mot de passe : cliquer sur **Autogenerate** et le copier dans un endroit sûr.
4. Rôle : **Read and write to any database**.
5. **Add User**.

Évite les caractères `@ : / ? # %` dans le mot de passe : ils cassent l'URI. Sinon, il faut les encoder (`@` devient `%40`).

## Étape 4 — Autoriser ton ordinateur (accès réseau)

1. Menu de gauche : **Security → Network Access**.
2. **Add IP Address**.
3. Cliquer sur **Add Current IP Address** (ton adresse actuelle).
4. Pour le développement, on peut aussi mettre `0.0.0.0/0` (**Allow access from anywhere**). Plus simple, mais moins sûr : à retirer en production.
5. **Confirm**. Attendre que le statut passe à **Active**.

Si ta box internet change d'adresse IP, la connexion échouera : il faudra rajouter la nouvelle IP.

## Étape 5 — Récupérer l'URI et la mettre dans `.env`

1. Page **Database / Clusters** → bouton **Connect** du cluster.
2. Choisir **Drivers**, puis **Node.js**.
3. Copier la chaîne de connexion. Elle ressemble à :

```bash
mongodb+srv://foodapp:<db_password>@cluster0.7fgtzzp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

4. Remplacer `<db_password>` par le vrai mot de passe (sans les chevrons `< >`).
5. Ajouter le **nom de la base** juste après `.mongodb.net/` : `food-ordering`. Sinon Mongoose utilise une base nommée `test`.
6. Coller le résultat dans `server/.env` :

```bash
MONGO_URI=mongodb+srv://foodapp:MonMotDePasse@cluster0.7fgtzzp.mongodb.net/food-ordering?retryWrites=true&w=majority&appName=Cluster0
```

| Morceau de l'URI | Signification |
| --- | --- |
| `mongodb+srv://` | Protocole ; `+srv` trouve automatiquement les serveurs du cluster |
| `foodapp:MonMotDePasse` | Utilisateur et mot de passe de l'étape 3 |
| `@cluster0.7fgtzzp.mongodb.net` | Adresse de ton cluster |
| `/food-ordering` | Nom de la base (créée automatiquement au premier enregistrement) |
| `?retryWrites=true&w=majority` | Réessaie les écritures ; confirme l'écriture sur la majorité des serveurs |

## Étape 6 — Tester et remplir la base

```bash
cd server
npm run dev
```

1. Le terminal doit afficher `✅ MongoDB connecté : ac-xxxx-shard-00-01...`.
2. Dans un **deuxième terminal** : `node seedUsers.js` puis `node seedMenu.js`.
3. Sur Atlas : **Database → Browse Collections**. On doit voir la base `food-ordering` avec les collections `users` (2 documents) et `menuitems` (9 documents).
4. Dans `users`, le champ `password` commence par `$2a$10$...` : c'est le hash bcrypt, jamais le mot de passe en clair.

## Erreurs fréquentes avec Atlas

| Message | Cause | Solution |
| --- | --- | --- |
| `bad auth : authentication failed` | Mauvais utilisateur ou mot de passe dans l'URI | Refaire l'étape 3 ; vérifier qu'il n'y a plus de `< >` |
| `Could not connect to any servers` / `ReplicaSetNoPrimary` | Ton IP n'est pas autorisée | Étape 4 : ajouter l'IP actuelle |
| `querySrv ENOTFOUND` | Faute de frappe dans l'adresse du cluster, ou DNS bloqué | Recopier l'URI ; essayer un autre réseau |
| `MONGO_URI` vaut `undefined` | `.env` pas lu ou mal placé | `.env` doit être dans `server/`, et `import 'dotenv/config'` en premier |
| Données dans une base `test` | Nom de base oublié dans l'URI | Ajouter `/food-ordering` après `.mongodb.net` |

---
Projet CraveDash (food-app) — documentation, 23 septembre 2026.
