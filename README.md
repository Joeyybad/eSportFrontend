Jordan NKUNGA

## ProjectReactEsportEvo

# Etape de mise en place

- Pré requis :

Node.js ≥ 18
npm ≥ 9
MySQL ≥ 8
Git

- Installation npm install dans le dossier du projet
- démarrage npm run dev

url locale : http://localhost:5173

le serveur back-end n'autorise que les requêtes de cette url locale, via la configuration Cors dans son fichier app.js

# Choix technologiques & justification

Environnement & Framework :
ReactJS (setup avec Vite)
Plus rapide, plus léger, temps de compilation réduit, très simple à démarrer

Styling :
index.css style minime globale
Tailwind CSS
Intégration immédiate avec React + classes utilitaires efficaces permettant de prototyper très vite l’UI.

Requêtes HTTP:

Fetch API (native)
Suffisant, léger, aucune dépendance externe.
Choisi pour éviter des risques de dépréciation ou évolution lourde d'Axios et rester minimaliste.

Navigation:

React Router
Standard de facto pour la navigation dans une SPA React.

Gestion de l’état global

Tentative initiale de faire un Context personnalisé, mais plusieurs complications (persistances & re-render).

Migration vers Zustand
léger, simple à prendre en main, scalable, approche moderne et intuitive.
Plus flexible que Context pour gérer le user et le token.

# structure du projet

/EsportEvoFrontend
│
├── eslint.config.js Configuration linting
├── index.html Template racine
├── vite.config.js Configuration Vite
├── README.md Documentation du projet
├── package.json
├── package-lock.json
│
└── src/
├── assets/
│ └── images/
│ └── logo.jpg
│
├── components/
│ ├── layout/ Composants structurants (Header, Footer…)
│ ├── ui/ Composants UI réutilisables (Button, Input…)
│ └── routes/ ProtectedRoute, AdminRoute…
│
├── pages/
│ ├── admin/ Pages réservées à l’admin
│ └── \*.jsx Pages publiques (Home, Login, Signup, Profile…)
│
├── stores/
│ └── useAuthStore.js Store Zustand (user, token, login, logout)
│
├── App.css
├── App.jsx Déclaration des routes + layout global
├── index.css
├── Main.jsx Point d’entrée React (ReactDOM.createRoot)
└── MainLayout.jsx Layout général incluant Navbar/Footer
