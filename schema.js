/* Types de projets, partagés par index.html (affichage) et admin.html (formulaires).
   Pour ajouter un champ ou un type, tout se passe ici.
   facts    : petites infos affichées dans le bloc « code » (moteur, genre…)
   sections : blocs de texte avec titre. kind "long" = paragraphes, "list" = une puce par ligne.
              lead:true = affiché avant la galerie. root:true = stocké dans project.description. */
const ROLE = { key: "role", label: "Mon rôle", name: "role", ph: "Programmation, game design…" };
const TEAM = { key: "team", label: "Équipe", name: "equipe", ph: "Seul, 3 personnes…" };

/* champs ajoutés à tous les types (tous facultatifs : rien ne s'affiche s'ils sont vides) */
const DURATION = { key: "duration", label: "Durée", name: "duree", ph: "3 mois, une game jam de 48 h…" };
const VIDEO = { key: "video", label: "Vidéo", name: "video", ph: "Lien YouTube, Vimeo… (https://…)" };
const CONTRIBUTION = { key: "contribution", label: "Ce que j'ai développé", kind: "list", ph: "Une réalisation personnelle par ligne (systèmes, outils, écrans, scripts…)" };
const NOTES = { key: "notes", label: "Informations complémentaires", kind: "long", ph: "Contexte, résultats, crédits, remerciements… tout ce qui ne rentre pas ailleurs." };

window.SCHEMA = {
  types: {
    game: {
      label: "Jeu", plural: "Jeux", code: "jeu",
      facts: [
        { key: "engine", label: "Moteur", name: "moteur", ph: "Unity, Godot, Unreal…" },
        { key: "genre", label: "Genre", name: "genre", ph: "Action RPG, puzzle…" },
        { key: "platforms", label: "Plateformes", name: "plateformes", ph: "PC, Android… (séparées par des virgules)", list: true },
        { key: "mode", label: "Mode de jeu", name: "mode", ph: "Solo, coop, multijoueur…" },
        ROLE, TEAM, DURATION, VIDEO
      ],
      sections: [
        { key: "pitch", label: "Pitch", kind: "long", lead: true, ph: "Le jeu en 2-3 phrases : l'accroche, ce qui le rend différent." },
        { key: "description", root: true, label: "Univers et histoire", kind: "long", rows: 8 },
        { key: "mechanics", label: "Gameplay et mécaniques", kind: "list", ph: "Une mécanique par ligne" },
        CONTRIBUTION,
        { key: "tech", label: "Réalisation technique", kind: "long", ph: "Architecture, réseau, IA, outils…" },
        { key: "challenges", label: "Difficultés et apprentissages", kind: "long" },
        NOTES
      ]
    },
    app: {
      label: "App / webapp", plural: "Apps", code: "app",
      facts: [
        { key: "stack", label: "Stack technique", name: "stack", ph: "React, Node, PostgreSQL… (séparées par des virgules)", list: true },
        { key: "kind", label: "Type d'application", name: "type", ph: "Webapp, PWA, mobile, extension…" },
        { key: "audience", label: "Public visé", name: "public", ph: "Étudiants, PME…" },
        ROLE, TEAM, DURATION, VIDEO
      ],
      sections: [
        { key: "context", label: "Contexte", kind: "long", lead: true, ph: "D'où vient le projet : cadre, besoin, commanditaire…" },
        { key: "problem", label: "Problématique", kind: "long", lead: true, ph: "Quel problème l'application est-elle censée résoudre ?" },
        { key: "solution", label: "Solution", kind: "long", ph: "Comment l'application y répond." },
        { key: "features", label: "Fonctionnalités", kind: "list", ph: "Une fonctionnalité par ligne" },
        CONTRIBUTION,
        { key: "description", root: true, label: "Détails", kind: "long", rows: 6 },
        { key: "challenges", label: "Choix techniques et difficultés", kind: "long" },
        NOTES
      ]
    },
    other: {
      label: "Autre", plural: "Autres", code: "projet",
      facts: [ROLE, TEAM, DURATION, VIDEO],
      sections: [{ key: "description", root: true, label: "Description", kind: "long", rows: 10 }, CONTRIBUTION, NOTES]
    }
  }
};
