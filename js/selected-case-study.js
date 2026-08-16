(function () {
    'use strict';

    var projects = {
        'partner-hub-ia': {
            title: 'Rethinking how <em>Partner Hub fits together</em>',
            plainTitle: 'Partner Hub information architecture',
            subtitle: 'Mapping two growing platforms to create a clearer long-term direction for navigation, application journeys and feature discoverability.',
            tags: ['Information Architecture', 'Platform Strategy', 'Partner Hub'],
            status: 'Exploratory and ongoing',
            timeline: '2026 · Exploratory and ongoing',
            team: ['PM', 'Engineers', 'Partner Managers'],
            scope: 'Product audit, site mapping, information architecture and future-state principles',
            visual: 'ia',
            problem: 'Partner Hub had grown through a series of valuable individual features, but its navigation and overall application sequence had not evolved at the same pace. Two related platforms had also developed different structures and capabilities, making the wider experience harder to understand and scale.',
            process: 'I mapped the current information architecture of both platforms to understand how features, journeys and terminology connected. This created a shared baseline for separating isolated usability issues from deeper structural problems.',
            solution: 'Rather than jumping directly to a redesigned navigation, I organised the opportunity around navigation, terminology, application sequence and cross-platform consistency. The work creates a direction that can support near-term improvements while informing a longer-term platform strategy.',
            outcome: 'The current-state maps gave the team a clearer shared view of how both products had evolved and where future growth would place pressure on the existing structure. The work remains intentionally exploratory as the future-state direction develops.',
            decisions: [
                ['Map before redesigning', 'Beginning with the current state avoided treating symptoms as the whole problem.'],
                ['Compare equivalent tasks', 'Looking across account, application, merchant and funding contexts exposed inconsistent structures and language.'],
                ['Separate near and long term', 'Not every structural issue needs a platform-wide redesign before improvements can begin.']
            ],
            reflection: 'This project demonstrates how I work beyond individual features: understanding how platform history, existing journeys and future product ambitions interact, then creating a direction teams can adopt incrementally.'
        },
        'document-upload': {
            title: 'Helping agents progress applications with <em>document upload</em>',
            plainTitle: 'Document upload',
            subtitle: 'Enabling partner agents to upload KYC and supporting evidence merchants had already provided, reducing avoidable chasing and giving operations clearer application inputs.',
            tags: ['Fintech', 'Shipped Workflow', 'Partner Hub'],
            status: 'Shipped',
            timeline: '2026 · Shipped',
            team: ['PM', 'Engineers', 'Operations', 'Partner Managers'],
            scope: 'Workflow design, content design, upload states, requirements and handoff',
            visual: 'upload',
            video: 'images/document-upload/document-upload-prototype.mp4',
            poster: 'images/document-upload/document-upload-prototype-poster.jpg',
            problem: 'Partner agents often already had the documents needed to support a merchant’s finance application. Without a clear upload route in Partner Hub, operations could still need to contact the merchant directly, slowing progress and duplicating effort.',
            process: 'I designed the workflow around the operational details that determined whether evidence would actually be useful: what was required, why it was needed, which files were acceptable and how agents would understand progress, failure and completion.',
            solution: 'The experience gives agents a direct route to provide evidence on a merchant’s behalf. Requirements appear before file selection, upload states remain visible, and every document stays connected to the application task it supports.',
            outcome: 'The feature shipped and gave partner agents a structured way to provide documents needed to progress applications. It reduced reliance on merchants being contacted again for evidence they had already shared and gave internal teams clearer inputs to review.',
            delivery: 'I worked closely with engineers to turn the workflow into a reliable shipped feature. Together, we worked through file requirements, validation, upload failures and the way each document connected to an application task. I stayed involved during implementation to resolve edge cases and adapt the design when technical constraints affected the experience. The measure of success was the workflow agents could use in production, not what remained in the design file.',
            decisions: [
                ['Explain requirements first', 'Agents can check format, recency and content before choosing a file.'],
                ['Make every state visible', 'Default, uploading, error and complete states do not rely on browser behaviour alone.'],
                ['Keep the task in context', 'The agent can see why the evidence is required and what happens after submission.']
            ],
            reflection: 'Although focused in scope, the quality of this workflow depended on operational detail. Requirements, feedback and error prevention were not secondary content tasks; they determined whether the uploaded evidence was usable.'
        }
    };

    var order = ['partner-hub-ia', 'document-upload'];
    var key = new URLSearchParams(window.location.search).get('project') || order[0];
    var project = projects[key] || projects[order[0]];
    var currentIndex = order.indexOf(key);
    if (currentIndex < 0) currentIndex = 0;
    var nextKey = order[(currentIndex + 1) % order.length];

    function metaHTML() {
        return '<div class="cs-meta-col"><h3>Role</h3><p>Product Designer</p></div>' +
            '<div class="cs-meta-col"><h3>Team</h3><div class="cs-meta-chips">' + project.team.map(function (item) { return '<span class="cs-meta-chip">' + item + '</span>'; }).join('') + '</div></div>' +
            '<div class="cs-meta-col"><h3>Scope</h3><p>' + project.scope + '</p></div>' +
            '<div class="cs-meta-col"><h3>Timeline</h3><p>' + project.timeline + '</p></div>';
    }

    function section(title, body) {
        return '<section class="cs-article-section"><h2>' + title + '</h2><p>' + body + '</p></section>';
    }

    function decisionsHTML() {
        return '<section class="cs-article-section"><h2>Key <em>decisions</em></h2><div class="selected-decision-grid">' + project.decisions.map(function (item) {
            return '<div class="selected-decision"><h3>' + item[0] + '</h3><p>' + item[1] + '</p></div>';
        }).join('') + '</div></section>';
    }

    function deliveryHTML() {
        if (!project.delivery) return '';
        return '<section class="cs-article-section"><h2>From design to <em>shipped product</em></h2><div class="cs-insight-callout"><span class="label">DELIVERY</span><p>' + project.delivery + '</p></div></section>';
    }

    function visualsHTML() {
        if (project.visual !== 'upload') return '';
        return '<section class="cs-article-section selected-upload-visuals">' +
            '<h2>Designing the <em>end-to-end workflow</em></h2>' +
            '<p>The document manager gives agents one view of every outstanding requirement and every file already supplied. Each upload route then explains what a usable document must contain before the agent selects a file.</p>' +
            '<figure class="cs-figure cs-figure--full"><div class="cs-figure-img cs-figure-img--shot selected-upload-desktop"><img src="images/document-upload/document-manager-desktop.png" alt="Desktop Document Manager listing required evidence and uploaded documents"></div><figcaption>The desktop workspace keeps required documents and completed uploads visible together.</figcaption></figure>' +
            '<div class="selected-upload-mobile-grid">' +
              '<figure class="cs-figure"><div class="selected-upload-phone"><div class="selected-upload-phone-screen" tabindex="0" aria-label="Scrollable VAT document upload screen"><img src="images/document-upload/vat-document-upload.png" alt="Mobile VAT document upload screen with document requirements and an uploaded file ready to submit"></div></div><span class="selected-scroll-hint">Scroll inside the phone to explore</span><figcaption>Requirements appear before submission so agents can check that evidence is usable.</figcaption></figure>' +
              '<figure class="cs-figure"><div class="selected-upload-phone"><div class="selected-upload-phone-screen" tabindex="0" aria-label="Scrollable completed document manager screen"><img src="images/document-upload/mobile-upload-complete.png" alt="Mobile Document Manager showing a successful upload notification and completed files"></div></div><span class="selected-scroll-hint">Scroll inside the phone to explore</span><figcaption>Clear completion feedback confirms success and updates the remaining-document list.</figcaption></figure>' +
            '</div></section>';
    }

    document.title = project.plainTitle + ' - Carmen Gyoh';
    document.getElementById('selected-title').innerHTML = project.title;
    document.getElementById('selected-subtitle').textContent = project.subtitle;
    document.getElementById('selected-tags').innerHTML = project.tags.map(function (tag) { return '<span class="cs-chip">' + tag + '</span>'; }).join('');
    document.getElementById('selected-cover').classList.add('selected-cs-cover--' + project.visual);
    var cover = document.getElementById('selected-cover');
    var fallbackArt = '<div class="selected-cover-art"><span></span><span></span><span></span><span></span></div>';
    cover.innerHTML = project.video
        ? '<div class="selected-cover-video"><div class="selected-phone-speaker" aria-hidden="true"></div><video autoplay muted loop playsinline preload="metadata" poster="' + project.poster + '" aria-label="Document upload prototype walkthrough"><source src="' + project.video + '" type="video/mp4"></video></div>'
        : fallbackArt;
    document.getElementById('selected-meta-tldr').innerHTML = metaHTML();
    document.getElementById('selected-meta-detailed').innerHTML = metaHTML();
    document.getElementById('selected-tldr').innerHTML = section('The problem', project.problem) + section('The approach', project.process) + section('The solution', project.solution) + section('The outcome', project.outcome) + section('What I learned', project.reflection);
    document.getElementById('selected-detailed').innerHTML = section('Overview', project.subtitle) + section('Understanding the <em>problem</em>', project.problem) + section('How I approached it', project.process) + visualsHTML() + decisionsHTML() + section('The solution', project.solution) + section('Outcome', project.outcome) + deliveryHTML() + section('What I learned', project.reflection);
    document.getElementById('selected-next').href = 'selected-case-study.html?project=' + nextKey;
    document.getElementById('selected-next-title').textContent = projects[nextKey].plainTitle;
})();
