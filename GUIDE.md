# Guide d'Utilisation - Misterdil.ca

## Démarrage Rapide

1. Ouvrez `index.html` dans votre navigateur web
2. Explorez les deals disponibles sur la page d'accueil
3. Utilisez la barre de recherche pour trouver des produits spécifiques
4. Cliquez sur les catégories pour filtrer les deals

## Fonctionnalités Principales

### 1. Parcourir les Deals
- Faites défiler la page pour voir tous les deals disponibles
- Chaque deal affiche: prix actuel, prix original, pourcentage de réduction
- Cliquez sur "Ajouter au panier" pour ajouter un produit

### 2. Panier d'Achats
- Cliquez sur l'icône du panier (🛒) dans le header
- Gérez les quantités avec les boutons +/-
- Supprimez des articles avec l'icône poubelle
- Voir le total en temps réel
- Cliquez sur "Payer" pour finaliser (nécessite connexion)

### 3. Authentification
- Cliquez sur "Se connecter" dans le header
- Choisissez entre "Connexion" ou "Inscription"
- Option de connexion avec Google disponible
- Mode démo fonctionnel sans configuration Firebase

### 4. Recherche
- Utilisez la barre de recherche dans la section hero
- Les résultats se filtrent en temps réel
- Recherche par nom ou description de produit

### 5. Catégories
- 8 catégories disponibles avec icônes distinctives
- Cliquez sur une catégorie pour filtrer les deals
- Catégorie "International" pour les opportunités mondiales

## Configuration Firebase (Optionnel)

Pour activer l'authentification Firebase complète:

1. Créez un projet sur [Firebase Console](https://console.firebase.google.com/)
2. Activez Authentication > Email/Password et Google
3. Copiez les identifiants de configuration
4. Modifiez `firebase-config.js` avec vos valeurs:

```javascript
const firebaseConfig = {
    apiKey: "VOTRE_API_KEY",
    authDomain: "VOTRE_AUTH_DOMAIN",
    projectId: "VOTRE_PROJECT_ID",
    storageBucket: "VOTRE_STORAGE_BUCKET",
    messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
    appId: "VOTRE_APP_ID"
};
```

## Mode Démo

L'application fonctionne en mode démo sans configuration Firebase:
- Toutes les fonctionnalités sont accessibles
- Le panier est sauvegardé localement
- L'authentification simule une connexion
- Parfait pour tester et développer

## Technologies Utilisées

- **HTML5**: Structure sémantique
- **CSS3**: Styles modernes avec variables CSS
- **JavaScript ES6+**: Logique applicative
- **Firebase**: Authentification (optionnel)
- **Font Awesome**: Icônes
- **LocalStorage**: Persistance du panier

## Support

Pour toute question ou problème:
- Consultez le README.md pour plus de détails
- Vérifiez que JavaScript est activé dans votre navigateur
- Ouvrez la console développeur (F12) pour voir les logs

## Déploiement

### Hébergement Local
```bash
# Avec Python
python -m http.server 8080

# Avec Node.js
npx http-server -p 8080
```

### Hébergement Web
- Uploadez tous les fichiers sur votre serveur web
- Aucune configuration serveur requise
- Fonctionne sur n'importe quel hébergeur statique (GitHub Pages, Netlify, Vercel, etc.)

## Personnalisation

### Modifier les Couleurs
Éditez les variables CSS dans `styles.css`:
```css
:root {
    --primary-color: #FF6B35;
    --secondary-color: #004E89;
    --accent-color: #F77F00;
}
```

### Ajouter des Deals
Modifiez le tableau `sampleDeals` dans `app.js`:
```javascript
const sampleDeals = [
    {
        id: 13,
        title: "Nouveau Produit",
        description: "Description du produit",
        price: 99.99,
        oldPrice: 149.99,
        discount: 33,
        category: "electronics",
        icon: "🎁"
    }
];
```

## Licence

MIT License - Libre d'utilisation et de modification

---

**Misterdil.ca** - Votre destination pour les meilleurs deals du web 🎯
