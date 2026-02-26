Blind Dance
====

Le but de ce projet est de proposer un jeu où les joueur voient une image/vidéo/musique de danse, proposent quel type de danse parmi 5 propositions.
Les points sont donné en fonction d'une bonne réponse et de la rapidité de la réponse. A la fin,
un tableau des score est proposé avec un beau podium.

Partie public
------

Le joueur arrive sur une page via une url de session de partie. Il inscrit son pseudo (on peut aussi cliquer
sur un dés pour un pseudo aléatoire). Le joueur peut aussi choisir, sur la même page, son avatar parmi un choix
d'avatar rigolo.

Une fois cette page passé, il est positionné en file d'attente le temps que tous les joueurs soit présents
et que l'admin de la session lance la partie.

Les différents round vont donc se succéder. Chaque round, nous présentons une photo, une vidéo ou une bande son,
le joueur a X secondes pour répondre (cette configuration est faite par l'admin de la session). Quand le joueur a sélectionné
son choix, il ne peut plus annuler. Après le temps impartie, on présente dans un tableau les points de tout le monde et on déplace les lignes
dynamiquement pour replacer les joueurs suivant leur total de points.

Les point sont calculé de tel sorte que : 
- une bonne réponse vaut 100 points
- une mauvaise réponse vaut 0 points
- on ajout 100 * pourcentage du temps restant pour répondre en cas de bonne réponse.

En suite, le nouveau round peut être lancé par l'admin de la session, tous les joueurs ont leur session qui démarre en même temps.

A la fin des round, un tableau des score avec un podium est présenté à tous.

Partie privée
------

Via une url, un utilisateur peut créer une session pour partager son lien à d'autre utilisateurs.
Une fois la session lancé, l'admin est aussi joueur.

L'admin peut déterminer le nombre de round, puis pour chaque round :
- le temps impartie
- les réponses possibles
- La bonne réponse valant les points
- le lien du média et un choix de type de média

Technique
----

Développement de l'application en nextjs déployé sur un vercel app. la base de données est en mongodb
Le front est en tailwind