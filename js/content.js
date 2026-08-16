/* ================================================================
   CONTENT.JS - All project data lives here.

   HOW TO UPDATE:
   - Edit the PROJECTS array below to change titles, tags, descriptions, etc.
   - Set `image` to a path like 'images/herfreedom101.jpg' once you have images.
     Until then, leave it as null - a gradient placeholder will show.
   - Set `link` to the case study page URL once it exists.

   ADDING MORE PROJECTS:
   - Just add another object to the array. Any projects beyond FLAGSHIP_COUNT
     will be hidden on the homepage but will show on an all-projects page (TBD).
   ================================================================ */

/* How many projects to show on the homepage */
const FLAGSHIP_COUNT = 3;

const PROJECTS = [

    /* ---- Project 1 - Main case study 01 ---- */
    {
        client:      'Liberis',
        title:       'Helping merchants choose funding',
        tags:        ['Fintech', 'Product Strategy', 'Research'],
        role:        'Lead Designer',
        status:      'Validated concept',
        description: 'Designing and validating a multi-product journey around the different ways merchants understand, compare and choose funding.',
        image:       null,
        video:       'images/multi-product/multi-product-demo.mp4',
        poster:      'images/multi-product/multi-product-demo-poster.jpg',
        link:        'case-study.html',
        placeholderBg: 'linear-gradient(140deg, #1a1430 0%, #2a1b3d 45%, #3d2342 100%)',
    },

    /* ---- Project 2 - Main case study 02 ---- */
    {
        client:      'Liberis',
        title:       'Launching and evolving Flex in Partner Hub',
        tags:        ['Fintech', '0–1 Delivery', 'Partner Hub'],
        role:        'Product Designer, 0→1',
        status:      'Shipped + iterating',
        description: 'Creating an end-to-end agent journey for a new funding product, then improving the assessment experience using partner feedback.',
        image:       null,
        video:       'images/flex/flex-demo.mp4',
        poster:      'images/flex/flex-demo-poster.jpg',
        link:        'case-study-flex.html',
        placeholderBg: 'linear-gradient(140deg, #15182e 0%, #1d2142 45%, #2a2350 100%)',
    },

    /* ---- Project 3 ---- */
    {
        client:      'HerFreedom101',
        title:       'Designing wellness that adapts to you',
        tags:        ['Wellness', 'Product Strategy', 'Systems Thinking'],
        role:        'Founder & Designer',
        status:      'Shipped',
        description: 'Evolving an adaptive wellness product so progress responds to changing capacity without relying on pressure or punishment.',
        image:       null,
        link:        'case-study-herfreedom101.html',
        placeholderBg: 'linear-gradient(140deg, #2a1424 0%, #3d1d33 45%, #4a2240 100%)',
    },

    /* ---- Main case study 03 (not yet built) ---- */
    {
        client:      'Liberis',
        title:       'Creating clear ownership in a shared application workflow',
        tags:        ['Fintech', 'Systems Thinking', 'Partner Hub'],
        status:      'Exploratory',
        description: 'Exploring a scalable model for claiming, assigning and managing applications across agents and administrators.',
        image:       null,
        link:        '#',       /* TODO: build case-study-universal-application.html */
        placeholderBg: 'linear-gradient(140deg, #0f2027 0%, #1a3a3f 45%, #234548 100%)',
    },

    /* ---- Supporting project 01 (not yet built) ---- */
    {
        client:      'Liberis',
        title:       'Rethinking how Partner Hub fits together',
        tags:        ['Information Architecture', 'Platform Strategy'],
        status:      'Exploratory and ongoing',
        description: 'Mapping two growing platforms to create a clearer long-term direction for navigation, application journeys and feature discoverability.',
        image:       null,
        link:        'selected-case-study.html?project=partner-hub-ia',
        placeholderBg: 'linear-gradient(140deg, #1b1a2e 0%, #241f3d 45%, #2d2650 100%)',
    },

    /* ---- Supporting project 02 (not yet built) ---- */
    {
        client:      'Liberis',
        title:       'Helping partner agents progress applications with document upload',
        tags:        ['Fintech', 'Shipped Feature'],
        status:      'Shipped',
        description: 'Enabling agents to upload the KYC and supporting evidence merchants had already provided, reducing avoidable chasing.',
        image:       null,
        link:        'selected-case-study.html?project=document-upload',
        placeholderBg: 'linear-gradient(140deg, #14182b 0%, #1d2340 45%, #262c52 100%)',
    },

    /* ---- Supporting project 03 ---- */
    {
        client:      'Liberis',
        title:       'Designing the system behind application progress',
        tags:        ['B2B Platform', 'Workflow Design', 'Systems Thinking'],
        status:      'Shipped across multiple releases',
        description: 'Evolving Partner Hub so agents could understand merchant status, identify blockers and take the right next action across application drop-off, evidence collection and recovery.',
        image:       null,
        link:        'case-study-partner-hub-progress.html',
        placeholderBg: 'linear-gradient(140deg, #17201f 0%, #203932 48%, #315b4d 100%)',
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

/* Homepage projects that add breadth beyond the featured case studies. */
const SELECTED_PROJECTS = [
    PROJECTS[4], /* Partner Hub information architecture */
    PROJECTS[5], /* Document upload */
    PROJECTS[6], /* Partner Hub application progress */
];
