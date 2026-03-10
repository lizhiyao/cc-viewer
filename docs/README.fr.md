# CC-Viewer

Système de surveillance des requêtes Claude Code, capturant et visualisant en temps réel toutes les requêtes et réponses API de Claude Code (texte brut, sans troncature). Permet aux développeurs de surveiller leur contexte afin de faciliter la revue et le diagnostic lors du Vibe Coding.
La dernière version de CC-Viewer propose également une solution de déploiement serveur pour la programmation web, ainsi que des outils de programmation mobile. N'hésitez pas à l'utiliser dans vos projets ; davantage de fonctionnalités de plugins seront ouvertes à l'avenir, avec prise en charge du déploiement cloud.

[English](../README.md) | [简体中文](./README.zh.md) | [繁體中文](./README.zh-TW.md) | [한국어](./README.ko.md) | [日本語](./README.ja.md) | [Deutsch](./README.de.md) | [Español](./README.es.md) | Français | [Italiano](./README.it.md) | [Dansk](./README.da.md) | [Polski](./README.pl.md) | [Русский](./README.ru.md) | [العربية](./README.ar.md) | [Norsk](./README.no.md) | [Português (Brasil)](./README.pt-BR.md) | [ไทย](./README.th.md) | [Türkçe](./README.tr.md) | [Українська](./README.uk.md)

## Utilisation

### Installation

```bash
npm install -g cc-viewer --registry=https://registry.npmjs.org
```

### Mode surveillance (dans ce mode, lancer claude ou claude --dangerously-skip-permissions démarre automatiquement un processus de journalisation pour enregistrer les requêtes)

```bash
ccv
```

### Mode programmation

== claude

```bash
ccv -c
```

== claude --dangerously-skip-permissions

```bash
ccv -d
```

Une fois le mode programmation lancé, la page web s'ouvre automatiquement.

Vous pouvez utiliser Claude directement depuis la page web, tout en consultant les requêtes complètes et les modifications de code.

Et encore mieux : vous pouvez même programmer depuis un appareil mobile !

Cette commande détecte automatiquement le mode d'installation local de Claude Code (NPM ou Native Install) et s'adapte en conséquence.

- **Installation NPM** : injecte automatiquement un script d'interception dans le fichier `cli.js` de Claude Code.
- **Installation Native** : détecte automatiquement le binaire `claude`, configure un proxy transparent local et met en place un Zsh Shell Hook pour rediriger le trafic automatiquement.
- Ce projet recommande l'utilisation de Claude Code installé via npm.

### Remplacement de configuration (Configuration Override)

Si vous devez utiliser un point de terminaison API personnalisé (par exemple un proxy d'entreprise), il suffit de le configurer dans `~/.claude/settings.json` ou de définir la variable d'environnement `ANTHROPIC_BASE_URL`. `ccv` le détectera automatiquement et transmettra correctement les requêtes.

### Mode silencieux (Silent Mode)

Par défaut, `ccv` fonctionne en mode silencieux lorsqu'il encapsule `claude`, garantissant que la sortie de votre terminal reste propre et cohérente avec l'expérience native. Tous les journaux sont capturés en arrière-plan et consultables via `http://localhost:7008`.

Une fois la configuration terminée, utilisez simplement la commande `claude` comme d'habitude. Accédez à `http://localhost:7008` pour consulter l'interface de surveillance.

### Dépannage (Troubleshooting)

Si vous rencontrez des problèmes de démarrage, voici une solution de dépannage ultime :
Étape 1 : ouvrez Claude Code dans n'importe quel répertoire ;
Étape 2 : donnez l'instruction suivante à Claude Code :
```
J'ai installé le package npm cc-viewer, mais après avoir exécuté ccv, il ne fonctionne toujours pas correctement. Examine cli.js et findcc.js de cc-viewer, puis adapte-le au mode de déploiement local de Claude Code en fonction de l'environnement spécifique. Limite autant que possible les modifications au fichier findcc.js.
```
Laisser Claude Code diagnostiquer lui-même les erreurs est plus efficace que de consulter qui que ce soit ou de lire n'importe quelle documentation !

Une fois l'instruction ci-dessus exécutée, findcc.js sera mis à jour. Si votre projet nécessite fréquemment un déploiement local, ou si le code forké doit souvent résoudre des problèmes d'installation, conservez ce fichier — vous pourrez simplement le copier la prochaine fois. À ce stade, de nombreux projets et entreprises n'utilisent pas Claude Code sur Mac mais via un déploiement serveur hébergé, c'est pourquoi l'auteur a séparé le fichier findcc.js pour faciliter le suivi des mises à jour du code source de cc-viewer.

### Désinstallation

```bash
ccv --uninstall
```

### Vérifier la version

```bash
ccv -v
```

## Fonctionnalités

### Surveillance des requêtes (mode texte brut)
<img width="1500" height="720" alt="image" src="https://github.com/user-attachments/assets/519dd496-68bd-4e76-84d7-2a3d14ae3f61" />

- Capture en temps réel de toutes les requêtes API émises par Claude Code, garantissant le texte brut et non des journaux tronqués (c'est très important !)
- Identification et marquage automatiques des requêtes Main Agent et Sub Agent (sous-types : Plan, Search, Bash)
- Les requêtes MainAgent prennent en charge le Body Diff JSON, affichant de manière repliée les différences avec la requête MainAgent précédente (seuls les champs modifiés/ajoutés sont affichés)
- Statistiques d'utilisation des tokens affichées en ligne pour chaque requête (tokens d'entrée/sortie, création/lecture de cache, taux de succès)
- Compatible avec Claude Code Router (CCR) et autres scénarios de proxy — correspondance de secours des requêtes via le pattern de chemin API

### Mode conversation

Cliquez sur le bouton « Mode conversation » en haut à droite pour analyser l'historique complet des conversations du Main Agent sous forme d'interface de chat :
<img width="1500" height="730" alt="image" src="https://github.com/user-attachments/assets/c973f142-748b-403f-b2b7-31a5d81e33e6" />

- L'affichage Agent Team n'est pas encore pris en charge
- Messages utilisateur alignés à droite (bulles bleues), réponses du Main Agent alignées à gauche (bulles sombres)
- Les blocs `thinking` sont repliés par défaut, rendus en Markdown, cliquez pour développer et voir le processus de réflexion ; traduction en un clic prise en charge (fonctionnalité encore instable)
- Les messages de sélection utilisateur (AskUserQuestion) sont affichés sous forme de questions-réponses
- Synchronisation bidirectionnelle des modes : le passage en mode conversation positionne automatiquement sur la conversation correspondant à la requête sélectionnée ; le retour en mode texte brut positionne automatiquement sur la requête sélectionnée
- Panneau de paramètres : permet de basculer l'état de repli par défaut des résultats d'outils et des blocs de réflexion
- Navigation des conversations sur mobile : en mode CLI sur mobile, appuyez sur le bouton « Navigation des conversations » dans la barre supérieure pour faire glisser une vue de conversation en lecture seule et parcourir l'historique complet des conversations sur mobile

### Mode programmation

Après le lancement avec ccv -c ou ccv -d, vous verrez :
<img width="1500" height="725" alt="image" src="https://github.com/user-attachments/assets/a64a381e-5a68-430c-b594-6d57dc01f4d3" />

Vous pouvez consulter directement le diff du code après l'édition :
<img width="1500" height="728" alt="image" src="https://github.com/user-attachments/assets/2a4acdaa-fc5f-4dc0-9e5f-f3273f0849b2" />

Bien que vous puissiez ouvrir des fichiers et programmer manuellement, ce n'est pas recommandé — c'est de la programmation à l'ancienne !

### Programmation mobile

Vous pouvez même scanner un QR code pour programmer depuis un appareil mobile :
<img width="3018" height="1460" alt="image" src="https://github.com/user-attachments/assets/8debf48e-daec-420c-b37a-609f8b81cd20" />

Sur mobile, vous pouvez voir :
<img width="1700" height="790" alt="image" src="https://github.com/user-attachments/assets/da3e519f-ff66-4cd2-81d1-f4e131215f6c" />

Réalisez tout ce que vous imaginez en matière de programmation mobile. De plus, un mécanisme de plugins est disponible ; si vous souhaitez personnaliser selon vos habitudes de programmation, vous pourrez suivre les mises à jour des hooks de plugins.


### Outils statistiques

Panneau flottant « Statistiques » dans la zone d'en-tête :
<img width="1500" height="729" alt="image" src="https://github.com/user-attachments/assets/b23f9a81-fc3d-4937-9700-e70d84e4e5ce" />

- Affichage du nombre de créations/lectures de cache et du taux de succès du cache
- Statistiques de reconstruction du cache : nombre d'occurrences et tokens cache_creation affichés par groupe de raisons (TTL, changement system/tools/model, troncature/modification de messages, changement de clé)
- Statistiques d'utilisation des outils : fréquence d'appel de chaque outil, triée par nombre d'appels
- Statistiques d'utilisation des Skills : fréquence d'appel de chaque Skill, triée par nombre d'appels
- Icône d'aide conceptuelle (?) : cliquez pour consulter la documentation intégrée de MainAgent, CacheRebuild et de chaque outil

### Gestion des journaux

Via le menu déroulant CC-Viewer en haut à gauche :
<img width="1200" height="672" alt="image" src="https://github.com/user-attachments/assets/8cf24f5b-9450-4790-b781-0cd074cd3b39" />

- Importer des journaux locaux : parcourir les fichiers de journaux historiques, regroupés par projet, ouverts dans une nouvelle fenêtre
- Charger un fichier JSONL local : sélectionner directement un fichier `.jsonl` local à charger (prise en charge jusqu'à 500 Mo)
- Enregistrer le journal actuel sous : télécharger le fichier journal JSONL actuellement surveillé
- Fusionner les journaux : fusionner plusieurs fichiers journaux JSONL en une seule session pour une analyse unifiée
- Voir les Prompts utilisateur : extraire et afficher toutes les saisies utilisateur, avec trois modes de visualisation — mode brut (contenu original), mode contexte (balises système repliables), mode texte (texte brut) ; les commandes slash (`/model`, `/context`, etc.) sont affichées comme des entrées distinctes ; les balises liées aux commandes sont automatiquement masquées du contenu du Prompt
- Exporter les Prompts en TXT : exporter les Prompts utilisateur (texte brut, sans balises système) en fichier `.txt` local

### Support multilingue

CC-Viewer prend en charge 18 langues, avec basculement automatique selon la langue du système :

简体中文 | English | 繁體中文 | 한국어 | Deutsch | Español | Français | Italiano | Dansk | 日本語 | Polski | Русский | العربية | Norsk | Português (Brasil) | ไทย | Türkçe | Українська

### Mise à jour automatique

CC-Viewer vérifie automatiquement les mises à jour au démarrage (une fois toutes les 4 heures maximum). Les mises à jour au sein d'une même version majeure (par exemple 1.x.x → 1.y.z) sont appliquées automatiquement et prennent effet au prochain démarrage. Les changements de version majeure affichent uniquement une notification.

La mise à jour automatique suit la configuration globale de Claude Code `~/.claude/settings.json`. Si Claude Code a désactivé les mises à jour automatiques (`autoUpdates: false`), CC-Viewer ignorera également la mise à jour automatique.

## License

MIT
