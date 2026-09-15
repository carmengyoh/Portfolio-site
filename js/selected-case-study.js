(function () {
    'use strict';

    var projects = {
        'partner-hub-ia': {
            title: 'Rethinking how <em>Partner Hub fits together</em>',
            plainTitle: 'Partner Hub information architecture',
            subtitle: 'Mapping two growing platforms to create a clearer long-term direction for navigation, application journeys and feature discoverability.',
            tags: ['Information Architecture', 'Platform Strategy', 'Partner Hub'],
            statusLabel: 'Exploratory',
            status: 'Exploratory and ongoing',
            timeline: '2026 · Exploratory and ongoing',
            team: ['PM', 'Engineers', 'Partner Managers'],
            scope: 'Product audit, site mapping, information architecture and future-state principles',
            heroSummary: 'Partner Hub had grown feature by feature across two related platforms, leaving similar tasks organised in different ways. I led the product audit, mapped both platforms and defined principles for navigation, terminology and future application journeys.',
            heroResult: 'The work gave Product, Engineering and Partner teams a shared baseline for near-term improvements while the longer-term platform direction remains exploratory.',
            visual: 'ia',
            setup: 'Partner Hub had grown feature by feature across two related platforms. Both supported similar partner tasks, but years of local decisions had left navigation, terminology and application journeys organised differently.',
            challenge: 'This was not a navigation tidy-up. Platform history, duplicated routes and unresolved product strategy were tangled together, and a polished future-state sitemap would have implied decisions the organisation had not actually made.',
            problem: 'Partner Hub had grown through a series of valuable individual features, but its navigation and application structure had not evolved at the same pace. Two related partner platforms also organised similar tasks differently, making features harder to find and creating uncertainty about where future products should live.',
            process: 'I audited both platforms and mapped their current information architecture, then compared equivalent account, application, merchant and funding tasks. This separated local usability issues from structural problems caused by duplicated routes, inconsistent terminology and platform history. I also distinguished improvements that could be made incrementally from decisions that depended on a longer-term platform direction.',
            solution: 'Rather than treating a new navigation as the starting point, I organised the opportunity around four connected areas: navigation, terminology, application sequence and cross-platform consistency. This created principles teams could use for near-term feature decisions while the broader future-state architecture continued to develop.',
            outcome: 'The maps gave Product, Engineering and Partner teams a shared view of how both platforms had evolved, where equivalent tasks diverged and where future growth would place pressure on the existing structure. The work remains intentionally exploratory, but it replaced fragmented assumptions with a common baseline for future decisions.',
            decisions: [
                ['Map before redesigning', 'Beginning with the current state avoided treating symptoms as the whole problem.'],
                ['Compare equivalent tasks', 'Looking across account, application, merchant and funding contexts exposed inconsistent structures and language.'],
                ['Separate near and long term', 'Not every structural issue needs a platform-wide redesign before improvements can begin.']
            ],
            reflection: 'I learned that information architecture work is as much about sequencing organisational decisions as arranging navigation. A useful direction had to acknowledge platform history, improve what teams could change now and avoid presenting unresolved product strategy as a finished structure.',
            neverAgain: 'I will never start an IA project by drawing the ideal navigation. Without mapping the current platforms and naming the unresolved product decisions first, I would only turn organisational ambiguity into a deceptively tidy diagram.'
        },
        'document-upload': {
            title: 'Helping agents progress applications with <em>document upload</em>',
            plainTitle: 'Document upload',
            subtitle: 'Enabling partner agents to upload KYC and supporting evidence merchants had already provided, reducing avoidable chasing and giving operations clearer application inputs.',
            tags: ['Fintech', 'Workflow Design', 'Partner Hub'],
            statusLabel: 'Shipped',
            status: 'Shipped',
            timeline: 'Q4 2025 · Shipped',
            team: ['PM', 'Engineers', 'Operations', 'Partner Managers'],
            scope: 'Workflow design, content design, upload states, requirements and handoff',
            heroSummary: 'Partner agents often already held application evidence, but Partner Hub gave them no way to submit it, so Operations could chase merchants for documents that already existed. I led the workflow and content design and worked with engineers through delivery.',
            heroResult: 'Shipped in Q4 2025, the feature connects each file to its requirement and makes upload progress, errors and completion clear.',
            visual: 'upload',
            video: 'images/document-upload/document-upload-prototype.mp4',
            poster: 'images/document-upload/document-upload-prototype-poster.jpg',
            setup: 'Partner agents often already had the KYC and supporting evidence needed for a merchant’s finance application, but Partner Hub gave them no way to submit it. Operations then had to chase the merchant for documents that already existed.',
            challenge: 'The apparent “add an uploader” request hid the real risk: a file could upload successfully and still be useless to Operations because it was stale, incomplete or detached from the requirement it was meant to satisfy.',
            problem: 'Partner agents often already held the KYC and supporting evidence needed for a merchant’s finance application. Without an upload route in Partner Hub, operations could still need to contact the merchant again, duplicating effort and slowing the application. The challenge was not simply adding a file picker. The evidence also needed to be valid, understandable and connected to the requirement it was meant to resolve.',
            process: 'I worked backwards from what Operations needed to review each document. I clarified why the evidence was required, what a usable file needed to contain and which states the agent needed to understand before mapping the document manager and individual upload flow. I then designed default, uploading, error and completed states so the handoff remained clear when an upload did not go perfectly.',
            solution: 'The document manager brings outstanding requirements and previously supplied files into one view. Each upload route explains the requirement before file selection, keeps the document connected to its application task and gives explicit feedback during upload, failure and completion. These decisions helped agents prevent unusable submissions rather than discovering problems after the handoff.',
            outcome: 'Shipped in Q4 2025, the feature gives partner agents a submission route for evidence they already hold. Each file stays connected to its application requirement, and agents can see upload progress, recover from errors and confirm completion. Operations receives evidence in the context of the task it needs to review.',
            evidenceNote: 'Repeat contact and application completion time have not been quantified in this case study.',
            delivery: 'I worked closely with engineers to turn the workflow into a reliable shipped feature. Together, we worked through file requirements, validation, upload failures and the way each document connected to an application task. I stayed involved during implementation to resolve edge cases and adapt the design when technical constraints affected the experience. The measure of success was the workflow agents could use in production, not what remained in the design file.',
            decisions: [
                ['Explain requirements first', 'Agents can check format, recency and content before choosing a file.'],
                ['Make every state visible', 'Default, uploading, error and complete states do not rely on browser behaviour alone.'],
                ['Keep the task in context', 'The agent can see why the evidence is required and what happens after submission.']
            ],
            reflection: 'I learned that a small workflow can still carry significant operational risk. Requirements, validation, feedback and error recovery were not secondary details around the uploader. They determined whether the evidence was usable and whether the application could genuinely progress.',
            neverAgain: 'I will never treat file upload as a component-level task again. Designing the happy-path picker before agreeing what makes evidence usable would have shipped a technically complete feature that simply moved failure downstream to Operations.'
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

    function tldrVisualHTML() {
        if (project.visual !== 'upload') return '';
        return '<figure class="cs-figure cs-figure--full cs-tldr-final"><div class="cs-figure-img cs-figure-img--shot selected-upload-desktop"><img src="images/document-upload/document-manager-desktop.png" alt="Desktop Document Manager listing outstanding evidence requirements and uploaded documents"></div><figcaption>The document manager keeps outstanding requirements and completed uploads visible in one place.</figcaption></figure>';
    }

    function tldrSolutionHTML() {
        return '<section class="cs-article-section"><h2>The solution</h2><p>' + project.solution + '</p>' + tldrVisualHTML() + '</section>';
    }

    function outcomeHTML() {
        var title = project.visual === 'upload' ? 'A working handoff for application evidence' : 'A shared foundation for platform decisions';
        return '<section class="cs-article-section"><h2>' + title + '</h2><p>' + project.outcome + '</p>' + (project.evidenceNote ? '<p class="cs-evidence-note">' + project.evidenceNote + '</p>' : '') + '</section>';
    }

    function tldrHTML() {
        return section('Overview', project.setup) +
            section('What made this hard', project.challenge) +
            tldrSolutionHTML() +
            outcomeHTML() +
            section('What I learned', project.neverAgain);
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

    function uploadDetailedHTML() {
        return section('Overview', project.subtitle + ' ' + project.problem) +
            '<section class="cs-article-section"><h2>The process</h2><h3 class="cs-step-title">Defining what usable evidence meant</h3>' +
            '<p>The design problem was larger than giving agents a file picker. Operations needed to understand which application requirement each document addressed and whether the evidence was suitable to review.</p>' +
            '<p>I worked backwards from those operational needs, clarifying why each document was required, what a usable file needed to contain and which requirements agents needed to see before selecting anything. This established the content and validation rules for the workflow before I moved into detailed screen design.</p></section>' +
            '<section class="cs-article-section"><h3 class="cs-step-title">Connecting the document manager to each application task</h3>' +
            '<p>I designed the document manager as the starting point for the workflow. It brought outstanding requirements and previously supplied files into one view, helping agents understand what was still needed before opening an individual upload task.</p>' +
            '<p>Each upload route stayed connected to the requirement it supported. This prevented document upload from becoming a separate file library with no clear relationship to application progress.</p>' +
            '<div class="selected-upload-desktop-grid">' +
              '<figure class="cs-figure"><div class="cs-figure-img cs-figure-img--shot selected-upload-desktop"><img src="images/document-upload/document-manager-desktop.png" alt="Desktop Document Manager listing required evidence and uploaded documents"></div><figcaption>The document manager keeps outstanding requirements and completed uploads visible together.</figcaption></figure>' +
              '<figure class="cs-figure"><div class="cs-figure-img cs-figure-img--shot selected-upload-desktop selected-upload-desktop--task"><img src="images/document-upload/doc-upload-desktop.png" alt="Desktop proof of identity upload screen with file requirements and document accuracy guidance"></div><figcaption>The individual upload task explains what makes the evidence usable before the agent selects a file.</figcaption></figure>' +
            '</div></section>' +
            '<section class="cs-article-section"><h3 class="cs-step-title">Preventing unusable submissions before upload</h3>' +
            '<p>Agents needed to know what made a document acceptable before choosing a file, not after an upload had failed or reached Operations. I placed format, content and recency requirements before file selection so agents could check the evidence they already held.</p>' +
            '<p>This treated content design as part of error prevention. Clear requirements reduced the risk of an upload being technically successful but operationally unusable.</p>' +
            '<figure class="cs-figure"><div class="selected-upload-phone" style="margin:0 auto;"><div class="selected-upload-phone-screen" tabindex="0" aria-label="Scrollable VAT document upload screen"><img src="images/document-upload/vat-document-upload.png" alt="Mobile VAT document upload screen with requirements and an uploaded file ready to submit"></div></div><span class="selected-scroll-hint">Scroll inside the phone to explore</span><figcaption>Requirements appear before submission so the agent can check that the evidence is usable.</figcaption></figure></section>' +
            '<section class="cs-article-section"><h3 class="cs-step-title">Making progress, failure and completion visible</h3>' +
            '<p>I designed the default, uploading, error and completed states as one system. Progress feedback reassured agents that the file was still being processed, errors explained what needed to change and completion updated the remaining-document list.</p>' +
            '<p>Keeping each state explicit reduced uncertainty and discouraged agents from repeating an upload because they were unsure whether it had worked.</p>' +
            '<div class="selected-upload-state-grid">' +
              '<figure class="cs-figure"><div class="cs-figure-img cs-figure-img--shot selected-upload-desktop selected-upload-desktop--task"><img src="images/document-upload/error-screen-desktop.png" alt="Desktop proof of identity upload screen showing a file size error and guidance to upload a smaller file"></div><figcaption>The error state explains what went wrong and gives the agent a clear route to recover.</figcaption></figure>' +
              '<figure class="cs-figure"><div class="selected-upload-phone"><div class="selected-upload-phone-screen" tabindex="0" aria-label="Scrollable completed document manager screen"><img src="images/document-upload/mobile-upload-complete.png" alt="Mobile Document Manager showing successful upload feedback and completed files"></div></div><span class="selected-scroll-hint">Scroll inside the phone to explore</span><figcaption>Completion feedback confirms success and updates the list of outstanding evidence.</figcaption></figure>' +
            '</div></section>' +
            '<section class="cs-article-section"><h3 class="cs-step-title">Working with engineers to ship the workflow</h3>' +
            '<p>' + project.delivery + '</p></section>' +
            outcomeHTML() +
            section('What I learned', project.reflection);
    }

    function iaDetailedHTML() {
        return section('Overview', project.subtitle) +
            section('Understanding the <em>problem</em>', project.problem) +
            section('How I approached it', project.process) +
            '<section class="cs-article-section"><h2>Mapping the <em>current state</em></h2>' +
            '<p>I mapped both Partner Hub platforms at the same level of detail, including their top-level structure, conditional areas and end-to-end agent journeys. Putting the maps side by side made differences in terminology, sequence and feature placement easier to compare.</p>' +
            '<div class="selected-sitemap-grid">' +
            '<figure class="cs-figure cs-figure--full"><a class="selected-sitemap-link" href="images/partner-hub-ia/bca-platform-sitemap.png" target="_blank" rel="noopener" aria-label="Open the BCA platform site map at full resolution"><div class="cs-figure-img cs-figure-img--shot selected-sitemap"><img src="images/partner-hub-ia/bca-platform-sitemap.png" alt="Current-state information architecture and agent journey map for the Partner Hub BCA platform"></div></a><figcaption>The BCA map connects the platform structure to the create-application journey. Open the image to inspect it at full resolution.</figcaption></figure>' +
            '<figure class="cs-figure cs-figure--full"><a class="selected-sitemap-link" href="images/partner-hub-ia/capital-platform-sitemap.png" target="_blank" rel="noopener" aria-label="Open the Capital platform site map at full resolution"><div class="cs-figure-img cs-figure-img--shot selected-sitemap"><img src="images/partner-hub-ia/capital-platform-sitemap.png" alt="Current-state information architecture and agent journey map for the Partner Hub Capital platform"></div></a><figcaption>The Capital map reveals an equivalent platform organised around opportunities and merchant accounts. Open the image to inspect it at full resolution.</figcaption></figure>' +
            '</div></section>' +
            decisionsHTML() + section('The solution', project.solution) + outcomeHTML() + section('What I learned', project.reflection);
    }

    function detailedHTML() {
        if (project.visual === 'upload') return uploadDetailedHTML();
        if (project.visual === 'ia') return iaDetailedHTML();
        return section('Overview', project.subtitle) + section('Understanding the <em>problem</em>', project.problem) + section('How I approached it', project.process) + visualsHTML() + decisionsHTML() + section('The solution', project.solution) + outcomeHTML() + deliveryHTML() + section('What I learned', project.reflection);
    }

    document.title = project.plainTitle + ' - Carmen Gyoh';
    document.getElementById('selected-title').innerHTML = project.title;
    document.getElementById('selected-subtitle').textContent = project.subtitle;
    document.getElementById('selected-tags').innerHTML = '<span class="cs-chip cs-chip--status">' + project.statusLabel + '</span>' + project.tags.map(function (tag) { return '<span class="cs-chip">' + tag + '</span>'; }).join('');
    document.getElementById('selected-cover').classList.add('selected-cs-cover--' + project.visual);
    var cover = document.getElementById('selected-cover');
    var fallbackArt = '<div class="selected-cover-art"><span></span><span></span><span></span><span></span></div>';
    cover.innerHTML = project.video
        ? '<div class="selected-cover-video"><div class="selected-phone-speaker" aria-hidden="true"></div><video autoplay muted loop playsinline preload="metadata" poster="' + project.poster + '" aria-label="Document upload prototype walkthrough"><source src="' + project.video + '" type="video/mp4"></video></div>'
        : fallbackArt;
    document.getElementById('selected-meta-tldr').innerHTML = metaHTML();
    document.getElementById('selected-meta-detailed').innerHTML = metaHTML();
    document.getElementById('selected-tldr').innerHTML = tldrHTML();
    document.getElementById('selected-detailed').innerHTML = detailedHTML();
    var header = document.querySelector('.cs-hero-card');
    header.classList.add('cs-hero-card--context');
    var titleBlock = document.getElementById('selected-title').parentElement;
    titleBlock.removeAttribute('style');
    header.insertBefore(titleBlock, cover);
    var context = document.createElement('div');
    context.className = 'cs-wide-block cs-project-context';
    context.innerHTML = '<p class="cs-project-summary">' + project.heroSummary + ' ' + project.heroResult + '</p>';
    header.insertBefore(context, cover);
    header.insertBefore(document.getElementById('selected-meta-tldr'), cover);
    document.getElementById('selected-meta-detailed').remove();
    document.getElementById('selected-next').href = 'selected-case-study.html?project=' + nextKey;
    document.getElementById('selected-next-title').textContent = projects[nextKey].plainTitle;
})();
