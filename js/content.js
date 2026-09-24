/* ================================================================
   CONTENT.JS - All project data lives here.

   HOW TO UPDATE:
   - Edit the PROJECTS array below to change titles, tags, descriptions, etc.
   - Set `image` to a path like 'images/herfreedom101.jpg' once you have images.
     Until then, leave it as null - a gradient placeholder will show.
   - Set `link` to the case study page URL once it exists.

   CURATING THE HOMEPAGE:
   - FEATURED_PROJECTS sets the three lead stories in reading order.
   - SELECTED_PROJECTS adds supporting work below them.
   ================================================================ */


const PROJECTS = [

    /* ---- Project 1 - Main case study 01 ---- */
    {
        client:      'Liberis',
        title:       'Helping merchants choose the right funding product',
        cardImage:   'images/multi-product/cost-calculator.webp',
        tags:        ['Fintech', 'Product Strategy', 'Research'],
        role:        'Product Designer · End-to-end design',
        cardScope:   'Research & strategy',
        status:      'Validated concept',
        description: 'Designing and validating a multi-product journey around the different ways merchants understand, compare and choose funding.',
        image:       null,
        video:       'images/multi-product/multi-product-preview.mp4',
        poster:      'images/multi-product/multi-product-preview-poster.jpg',
        link:        'case-study.html',
        placeholderBg: 'linear-gradient(140deg, #1a1430 0%, #2a1b3d 45%, #3d2342 100%)',
    },

    /* ---- Project 2 - Main case study 02 ---- */
    {
        client:      'Liberis',
        title:       'Launching and evolving a new funding product',
        cardImage:   'images/flex/flex-set-account-limit.png',
        tags:        ['Fintech', '0–1 Delivery', 'Partner Hub'],
        role:        'Product Designer · Research to delivery',
        cardScope:   'Research to delivery',
        status:      'Shipped',
        description: 'Designed and launched a new funding journey for partner agents. An updated journey, informed by agent feedback and usage after launch, is now being built.',
        image:       null,
        video:       'images/flex/flex-preview.mp4',
        poster:      'images/flex/flex-preview-poster.jpg',
        link:        'case-study-flex.html',
        placeholderBg: 'linear-gradient(140deg, #15182e 0%, #1d2142 45%, #2a2350 100%)',
    },

    /* ---- Project 3 - Featured case study 03 ---- */
    {
        client:      'Liberis',
        title:       'Designing the system behind application progress',
        tags:        ['B2B Platform', 'Workflow Design', 'Systems Thinking'],
        role:        'Product Designer · Service mapping & delivery',
        cardScope:   'Service mapping & delivery',
        status:      'Shipped',
        description: 'Connected status, ownership and recovery actions across a dashboard and account panel so agents could understand what needed to happen next.',
        image:       'images/partner-hub-progress/hero-sidepanel-composite-transparent.png',
        video:       'images/partner-hub-progress/dropoffs-demo.mp4',
        poster:      'images/partner-hub-progress/dropoffs-demo-poster.jpg',
        link:        'case-study-partner-hub-progress.html',
        placeholderBg: 'linear-gradient(140deg, #17201f 0%, #203932 48%, #315b4d 100%)',
    },

    /* ---- Supporting project 02 ---- */
    {
        client:      'Liberis',
        title:       'Helping agents progress applications with document upload',
        tags:        ['Fintech', 'Shipped Feature'],
        status:      'Shipped',
        role:        'Product Designer · Workflow & interaction design',
        cardScope:   'Workflow & interaction design',
        description: 'Shipped a document workflow that connects requirements, upload states and evidence to the application task.',
        image:       'images/document-upload/doc-upload-desktop.png',
        link:        'selected-case-study.html?project=document-upload',
        placeholderBg: 'linear-gradient(140deg, #14182b 0%, #1d2340 45%, #262c52 100%)',
    },

    /* ---- Supporting project 03 ---- */
    {
        client:      'HerFreedom101',
        title:       'Designing wellness that adapts to you',
        tags:        ['Wellness', 'Product Strategy', 'Systems Thinking'],
        role:        'Founder & Designer · Strategy, build & launch',
        cardScope:   'Founder · Build & launch',
        status:      'Shipped',
        description: 'Built and launched a wellness app, then used early behaviour to replace a feature dashboard with one adaptive daily journey.',
        cardImages:  ['images/herfreedom101/daily-plan-handover.jpg', 'images/herfreedom101/daily-journey-start.jpg'],
        image:       'images/herfreedom101/daily-journey-start.jpg',
        link:        'case-study-herfreedom101.html',
        placeholderBg: 'linear-gradient(140deg, #2a1424 0%, #3d1d33 45%, #4a2240 100%)',
    },

];

/* Curated order: delivery, systems thinking, independent product ownership. */
const projectAt = link => PROJECTS.find(project => project.link === link);
const FEATURED_PROJECTS = [projectAt("case-study-flex.html"), projectAt("case-study-partner-hub-progress.html"), projectAt("case-study-herfreedom101.html")];
const SELECTED_PROJECTS = [projectAt("case-study.html"), projectAt("selected-case-study.html?project=document-upload")];
