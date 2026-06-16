/* ================================================================
   CONTENT.JS — All project data lives here.

   HOW TO UPDATE:
   - Edit the PROJECTS array below to change titles, tags, descriptions, etc.
   - Set `image` to a path like 'images/herfreedom101.jpg' once you have images.
     Until then, leave it as null — a gradient placeholder will show.
   - Set `link` to the case study page URL once it exists.

   ADDING MORE PROJECTS:
   - Just add another object to the array. Any projects beyond FLAGSHIP_COUNT
     will be hidden on the homepage but will show on an all-projects page (TBD).
   ================================================================ */

/* How many projects to show on the homepage */
const FLAGSHIP_COUNT = 3;

const PROJECTS = [

    /* ---- Project 1 ---- */
    {
        client:      'Liberis',
        title:       'Partner Hub Redesign',
        tags:        ['Fintech', 'B2B', 'UX Strategy'],
        description: 'Redesigning the core partner experience to improve clarity, reduce friction and drive growth.',
        image:       null,      /* Set to: 'images/partner-hub.jpg' */
        link:        'case-study.html',
        placeholderBg: 'linear-gradient(140deg, #1a1430 0%, #2a1b3d 45%, #3d2342 100%)',
    },

    /* ---- Project 2 ---- */
    {
        client:      'Liberis',
        title:       'Funding Journey Overhaul',
        tags:        ['Fintech', 'User Flow', 'Prototyping'],
        description: 'Simplifying a complex funding journey to increase conversion and user confidence.',
        image:       null,
        link:        '#',
        placeholderBg: 'linear-gradient(140deg, #15182e 0%, #1d2142 45%, #2a2350 100%)',
    },

    /* ---- Project 3 ---- */
    {
        client:      'HerFreedom101',
        title:       'HerFreedom101',
        tags:        ['Wellness', '0–1 Product', 'UI/UX'],
        description: 'Building a feminine wellbeing platform from 0–1, from brand to product to validation.',
        image:       null,
        link:        '#',
        placeholderBg: 'linear-gradient(140deg, #2a1424 0%, #3d1d33 45%, #4a2240 100%)',
    },

    /* ---- Add future projects here ---- */
    /*
    {
        title:       'New Project Title',
        tags:        ['Tag 1', 'Tag 2', 'Tag 3'],
        description: 'Short description of the project.',
        image:       null,
        link:        '#',
        placeholderBg: 'linear-gradient(140deg, #e0f2f1 0%, #b2dfdb 100%)',
    },
    */

];
