# Presentation De Soutenance - HERGO

## Slide 1 - Introduction

**Titre du projet :** HERGO, plateforme web de reservation d'hebergements

**Presentation generale**

HERGO est une application web qui met en relation des voyageurs a la recherche d'un logement, des hotes qui souhaitent publier leurs biens, et des administrateurs qui assurent le controle de la plateforme.

**Objectif principal**

Concevoir une solution numerique complete permettant :
- la consultation des logements en ligne ;
- la reservation d'hebergements ;
- la gestion des annonces par les hotes ;
- l'administration globale de la plateforme ;
- l'automatisation des notifications et du paiement.

**Pourquoi ce projet ?**

Le secteur de l'hebergement touristique evolue vers des services digitaux simples, rapides et securises. HERGO repond a ce besoin en centralisant dans une meme plateforme la recherche, la reservation, la gestion des logements et le suivi des utilisateurs.

---

## Slide 2 - Contexte Et Problematique

**Contexte**

Dans le domaine de la location touristique, plusieurs difficultes reviennent souvent :
- les voyageurs ont du mal a trouver rapidement un logement fiable ;
- les hotes ont besoin d'un espace simple pour publier et gerer leurs annonces ;
- les administrateurs doivent verifier les contenus et surveiller l'activite ;
- les echanges entre les acteurs sont parfois disperses entre plusieurs outils.

**Problematique**

Comment concevoir une plateforme web moderne qui permette :
- une navigation simple cote utilisateur ;
- une gestion differenciee selon les roles ;
- un systeme de reservation fiable ;
- un paiement structure ;
- une administration securisee et centralisee ?

**Enjeux**

- ameliorer l'experience utilisateur ;
- fluidifier le parcours de reservation ;
- garantir la securite des acces ;
- assurer une bonne organisation des donnees et des traitements metier.

---

## Slide 3 - Proposition D'une Solution

**Solution proposee**

Pour repondre a cette problematique, nous avons developpe HERGO sous forme d'une application web composee :
- d'un frontend moderne pour l'interface utilisateur ;
- d'un backend API REST pour la logique metier ;
- d'une base de donnees relationnelle pour stocker les informations.

**Principaux profils geres**

**1. Voyageur**
- consulter les logements publies ;
- voir les details d'un logement ;
- effectuer une reservation ;
- suivre ses reservations ;
- ajouter des favoris ;
- laisser des avis ;
- consulter ses notifications ;
- envoyer une reclamation.

**2. Hote**
- ajouter un logement ;
- modifier un logement ;
- gerer les images, equipements et espaces ;
- suivre les reservations recues ;
- consulter le calendrier.

**3. Administrateur**
- gerer les utilisateurs ;
- gerer les logements ;
- valider ou refuser des annonces ;
- consulter les paiements ;
- acceder aux statistiques globales.

**Valeur ajoutee de la solution**

HERGO centralise l'ensemble du processus metier dans une seule plateforme et propose une separation claire des responsabilites selon les differents types d'utilisateurs.

---

## Slide 4 - Conception Et Realisation

**Architecture generale**

Le projet repose sur une architecture separee en deux parties :

**Frontend**
- developpe avec React et TypeScript ;
- navigation geree avec React Router ;
- composants reutilisables ;
- pages dediees pour les voyageurs, hotes et administrateurs ;
- routes protegees selon le role de l'utilisateur.

**Backend**
- developpe avec Node.js et Express ;
- expose une API REST ;
- logique structuree en routes, controleurs, services et configuration ;
- base de donnees geree avec Prisma ;
- securisation par JWT et controle des roles.

**Organisation technique du backend**

Le backend suit une architecture en couches :
- `routes` : definition des endpoints ;
- `controllers` : reception des requetes HTTP ;
- `services` : traitement de la logique metier ;
- `config` et `helpers` : securite, notifications, outils externes ;
- `prisma/schema.prisma` : modelisation de la base de donnees.

**Organisation technique du frontend**

Le frontend est organise autour de :
- `pages` pour les vues metier ;
- `components` pour les elements reutilisables ;
- `hooks` pour la gestion de l'authentification ;
- `core/api` pour les appels vers le backend.

**Principales entites de la base de donnees**

Les modeles metier principaux sont :
- `User` ;
- `Logement` ;
- `Reservation` ;
- `Payment` ;
- `Review` ;
- `Notification` ;
- `Reclamation`.

**Exemple de flux fonctionnel**

Le parcours principal d'un voyageur est le suivant :
1. consulter la liste des logements ;
2. ouvrir la fiche detail d'un logement ;
3. creer une reservation ;
4. lancer un paiement ;
5. recevoir une notification ;
6. suivre l'etat de la reservation.

**Fonctionnalites techniques importantes**

- authentification et autorisation par role ;
- filtrage des logements ;
- verification de disponibilite avant reservation ;
- calcul du prix total ;
- gestion de paiements avec Stripe ;
- notifications email et SMS via Brevo ;
- documentation API avec Swagger ;
- securisation de l'API avec Helmet, CORS, compression et rate limiting.

---

## Slide 5 - Technologies Et Outils Utilises

**Frontend**
- React 19
- TypeScript
- Vite
- React Router DOM
- CSS Modules
- Lucide React

**Backend**
- Node.js
- Express.js
- Prisma
- PostgreSQL
- JWT
- Zod

**Services et integrations**
- Stripe pour le paiement
- Cloudinary pour la gestion des images
- Brevo pour les emails et SMS
- Swagger pour la documentation API

**Outils de developpement**
- Git et GitHub
- Docker et Docker Compose
- Render pour le deploiement
- Jest / tests
- Postman ou Swagger UI pour les tests d'API

---

## Slide 6 - Demo

**Scenario de demonstration conseille**

Pour la demonstration, il est pertinent de suivre un parcours metier complet :

**1. Cote voyageur**
- afficher la page d'accueil ;
- consulter les logements disponibles ;
- ouvrir la fiche detail d'un logement ;
- effectuer une reservation ;
- montrer la confirmation et les notifications.

**2. Cote hote**
- se connecter en tant qu'hote ;
- ajouter ou modifier un logement ;
- consulter les reservations recues ;
- montrer le calendrier.

**3. Cote administrateur**
- acceder au tableau de bord administrateur ;
- afficher la gestion des utilisateurs ;
- afficher la validation des logements ;
- presenter le suivi global de la plateforme.

**Ce que la demo doit mettre en valeur**

- la difference entre les interfaces selon les roles ;
- la fluidite du parcours utilisateur ;
- la communication entre front et back ;
- la coherence de la logique metier.

---

## Slide 7 - Conclusion Et Perspectives

**Conclusion**

HERGO est une plateforme web complete de reservation d'hebergements qui reunit dans une meme solution :
- une interface utilisateur moderne ;
- une API backend structuree ;
- une gestion multi-profils ;
- un systeme de reservation et de paiement ;
- des services de notification et d'administration.

Ce projet nous a permis de mettre en pratique plusieurs competences :
- conception d'une architecture web complete ;
- developpement frontend et backend ;
- gestion d'une base de donnees relationnelle ;
- securisation des acces ;
- integration de services externes.

**Perspectives d'amelioration**

- ajout d'un systeme de messagerie instantanee entre voyageur et hote ;
- integration d'une carte geographique pour localiser les logements ;
- mise en place de filtres avances et recommandations ;
- gestion plus poussee des statistiques et tableaux de bord ;
- ajout d'une version mobile.

---

 sudo dpkg -i antigravity_1.23.2-1776332190_amd64.deb
 ## Texte Court Pour L'Oral

Bonjour, aujourd'hui je vais vous presenter HERGO, une plateforme web de reservation d'hebergements. L'objectif de ce projet est de proposer une solution complete permettant a des voyageurs de rechercher et reserver un logement, a des hotes de publier et gerer leurs annonces, et a un administrateur de superviser l'ensemble de la plateforme.

Pour realiser cette solution, nous avons separe le projet en deux grandes parties. Le frontend a ete developpe avec React, TypeScript et Vite afin d'offrir une interface moderne, fluide et adaptee aux differents profils. Le backend a ete developpe avec Node.js, Express et Prisma pour structurer la logique metier, securiser les traitements et gerer les donnees dans une base PostgreSQL.

Parmi les fonctionnalites principales, on retrouve l'authentification, la gestion des roles, la publication de logements, la reservation, le paiement via Stripe, les notifications ainsi que les espaces d'administration. Ce projet nous a permis de travailler a la fois sur l'experience utilisateur, l'architecture logicielle et l'integration de services externes.

En conclusion, HERGO constitue une base solide pour une plateforme de reservation moderne et evolutive, avec plusieurs perspectives d'amelioration pour aller encore plus loin.

---

## Resume Express Pour Une Slide Finale

**HERGO en une phrase**

Une plateforme web complete de reservation d'hebergements qui connecte voyageurs, hotes et administrateurs autour d'un parcours simple, securise et centralise.
