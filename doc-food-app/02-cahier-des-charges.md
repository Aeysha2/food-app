# 2. Cahier des charges

CraveDash est une application web de commande de repas en ligne pour un restaurant. Les clients commandent et suivent leurs commandes, et un administrateur gère le menu et les commandes.

## 2.1 Contexte et objectifs

- **Contexte** : un restaurant veut prendre des commandes en ligne, comme UberEats ou Deliveroo, mais pour lui seul.
- **Objectif 1** : permettre à un client de choisir des plats, payer et suivre sa livraison.
- **Objectif 2** : permettre au gérant de modifier le menu et de faire avancer les commandes sans toucher au code.
- **Objectif 3** : garder des données fiables : les prix sont toujours recalculés par le serveur.

## 2.2 Utilisateurs (acteurs)

| Acteur | Qui | Ce qu'il peut faire |
| --- | --- | --- |
| Visiteur (invité) | Personne non connectée | Voir le menu, remplir le panier, commander en invité, suivre une commande |
| Client | Compte avec `role: "user"` | Tout ce que fait l'invité + historique de ses commandes |
| Administrateur | Compte avec `role: "admin"` | Ajouter, modifier, supprimer des plats ; gérer le stock ; changer le statut des commandes ; voir les rapports |

## 2.3 Besoins fonctionnels

| N° | Fonctionnalité | Acteur | Priorité |
| --- | --- | --- | --- |
| F1 | Créer un compte (nom, email, mot de passe ≥ 6 caractères) | Visiteur | Haute |
| F2 | Se connecter / se déconnecter | Client, Admin | Haute |
| F3 | Voir le menu avec photo, prix, temps de préparation, note | Tous | Haute |
| F4 | Filtrer par catégorie (Burgers, Pizza, Asian, Pasta, Healthy, Desserts, Drinks) | Tous | Haute |
| F5 | Rechercher un plat par nom ou description | Tous | Moyenne |
| F6 | Filtre « végétarien uniquement » | Tous | Moyenne |
| F7 | Panier : ajouter, retirer, changer la quantité, garder le panier après rechargement | Tous | Haute |
| F8 | Codes promo : `CRAVE20` (−20 %) et `FIRST5` (−5 $) | Tous | Basse |
| F9 | Passer commande : adresse, téléphone, instructions, moyen de paiement | Tous | Haute |
| F10 | Suivi de commande en 4 étapes : Passée → En préparation → En livraison → Livrée | Tous | Haute |
| F11 | Historique de mes commandes | Client | Moyenne |
| F12 | Ajouter / modifier / supprimer un plat | Admin | Haute |
| F13 | Marquer un plat « en stock » ou « épuisé » | Admin | Haute |
| F14 | Voir toutes les commandes et changer leur statut | Admin | Haute |
| F15 | Rapports journaliers, mensuels, annuels (chiffre d'affaires, plats les plus vendus) | Admin | Moyenne |

## 2.4 Règles de gestion

- **Taxe** : 8 % du sous-total.
- **Livraison** : 3,50 $ si le sous-total est inférieur à 45 $, gratuite au-dessus.
- **Prix** : le client envoie seulement `{ id, quantité }`. Le serveur relit le vrai prix en base et recalcule le total.
- **Stock** : un plat épuisé (`isAvailable: false`) ne peut pas être commandé.
- **Statuts possibles** : Order Placed, Preparing Food, Out for Delivery, Delivered, Cancelled.
- **Email unique** : deux comptes ne peuvent pas avoir le même email.

## 2.5 Besoins non fonctionnels

- **Sécurité** : mots de passe hachés avec bcrypt (jamais stockés en clair) ; sessions par token JWT valable 7 jours ; routes admin protégées côté serveur.
- **Secrets** : clé JWT et accès MongoDB dans `.env`, jamais dans le code ni sur GitHub.
- **Interface** : responsive (téléphone, tablette, ordinateur), en français.
- **Performance** : le menu s'affiche en moins de 2 secondes.
- **Maintenabilité** : code séparé en modèles, contrôleurs, routes, composants.

## 2.6 Choix techniques

| Partie | Technologie | Pourquoi |
| --- | --- | --- |
| Interface | React 19 + Vite | Composants réutilisables, rechargement instantané |
| Style | Tailwind CSS 4 | Styles directement dans le JSX, pas de gros fichiers CSS |
| Icônes | lucide-react | Icônes légères en composants React |
| Serveur | Node.js + Express 4 | Même langage (JavaScript) que le client |
| Base de données | MongoDB Atlas + Mongoose | Gratuit, dans le cloud, schémas simples |
| Authentification | jsonwebtoken + bcryptjs | Standard, sans serveur de session |

## 2.7 Contraintes et livrables

- **Livrables** : code source sur GitHub, fichier README, base Atlas avec données de démo, comptes de démo (`admin@example.com` / `admin123`, `user@example.com` / `password123`).
- **Hors périmètre** : vrai paiement en ligne (le paiement est simulé), plusieurs restaurants, application mobile native.

## 2.8 Critères d'acceptation

- [ ] Un visiteur peut commander sans compte et suivre sa commande.
- [ ] Un client connecté retrouve ses commandes dans l'historique.
- [ ] Un admin ajoute un plat et le plat apparaît côté client.
- [ ] Un client ne peut pas appeler une route admin (réponse 403).
- [ ] Modifier le prix dans le navigateur ne change pas le prix facturé.

---
Projet CraveDash (food-app) — documentation, 23 septembre 2026.
