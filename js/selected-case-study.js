(function () {
    'use strict';

    var projects = {
        'document-upload': {
            title: 'Helping agents progress applications with <em>document upload</em>',
            plainTitle: 'Document upload',
            subtitle: 'Enabling partner agents to upload documents customers had already emailed them, giving the Liberis Operations team clear evidence for funding checks and reducing avoidable chasing.',
            tags: ['Fintech', 'Shipped Workflow', 'Partner Hub'],
            status: 'Shipped',
            timeline: 'Q4 2025 · Shipped',
            team: ['PM', 'Engineers', 'Operations', 'Partner Managers'],
            scope: 'Workflow design, content design, upload states, requirements and handoff',
            visual: 'upload',
            video: 'images/document-upload/document-upload-prototype.mp4',
            poster: 'images/document-upload/document-upload-prototype-poster.jpg',
            setup: 'Customers often emailed partner agents the documents needed for their funding application. Agents could forward them by email, but had no way to upload them through Partner Hub. The Liberis Operations team could end up chasing customers for documents their agent already held.',
            challenge: 'Partner agents often sent documents that didn’t meet the requirements, leaving Operations to reject them and agents to chase customers for replacements. Operations knew what was needed, but that knowledge wasn’t clearly available to agents.</p><p>The challenge was to bring that guidance into the upload flow so agents could understand which documents to provide and what made them suitable for review. The flow also needed to work across desktop and mobile, as agents switched between devices depending on where they were working.',
            problem: 'The existing process relied on agents forwarding documents by email. Partner Hub had no upload route, and agents lacked clear guidance on what the Liberis Operations team needed. Unsuitable documents led to rejected submissions and further requests to customers.',
            process: 'I worked backwards from what Operations needed to review each document. I clarified why the evidence was required, what a usable file needed to contain and which states the agent needed to understand before mapping the document manager and individual upload flow. I then designed default, uploading, error and completed states so the handoff remained clear when an upload did not go perfectly.',
            solution: 'The behaviour I wanted to drive was for partner agents to submit the right documents first time, quickly and confidently. I designed the upload flow to make that behaviour easier: explaining document requirements before submission, giving clear feedback, and letting agents choose which requirement to complete next through the document manager.',
            outcome: 'The feature shipped in Q4 2025. In feedback shared through Slack and email, the Liberis Operations team reported less chasing for documents and said most submissions met their requirements. Partner agents described the document-sharing process as much more streamlined.</p><p>The designs will also inform planned updates to the customer-facing document upload interface.',
            delivery: 'Before launch, I walked through the designs with the product manager and engineers. We worked through error scenarios and edge cases, including applications involving two applicants. A proof-of-identity label alone would not make it clear whose document was needed, so we added the applicant’s name beneath the label. This gave agents a specific person to associate each identity document with when uploading.',
            decisions: [
                ['Explain requirements first', 'Agents can check format, recency and content before choosing a file.'],
                ['Make every state visible', 'Default, uploading, error and complete states do not rely on browser behaviour alone.'],
                ['Keep the task in context', 'The agent can see why the evidence is required and what happens after submission.']
            ],
            reflection: 'I learned that making document upload simple means helping agents choose the right document in the first place. Bringing Operations’ requirements into the flow was as important as the upload interaction itself, because an easy upload only helps if the document is suitable for review.</p><p>I also learned that efficiency meant giving agents control over their next step. Returning them to the document manager added navigation, but let them work with the documents they had available. I needed to consider effort across the whole process, including whether submissions created more work for Operations or further requests to customers.',
            neverAgain: 'I will never design an upload flow without first asking what the person reviewing the file actually needs from it. A smooth upload interaction would have changed nothing if agents kept submitting documents Operations had to reject, so the requirements had to come from Operations before the interface existed.</p><p>The same applies to what I left out. I dropped the optional notes field because Operations did not need free-text context, and I stopped sending agents straight to the next requirement because they rarely had the documents in the order I had assumed.'
        }
    };

    var requestedKey = new URLSearchParams(window.location.search).get('project');
    var key = Object.prototype.hasOwnProperty.call(projects, requestedKey) ? requestedKey : 'document-upload';
    var project = projects[key];

    function metaHTML() {
        return '<div class="cs-meta-col"><h3>Role</h3><p>Product Designer</p></div>' +
            '<div class="cs-meta-col"><h3>Team</h3><div class="cs-meta-chips">' + project.team.map(function (item) { return '<span class="cs-meta-chip">' + item + '</span>'; }).join('') + '</div></div>' +
            '<div class="cs-meta-col"><h3>Scope</h3><p>' + project.scope + '</p></div>' +
            '<div class="cs-meta-col"><h3>Timeline</h3><p>' + project.timeline + '</p></div>';
    }

    function section(title, body) {
        return '<section class="cs-article-section"><h2>' + title + '</h2><p>' + body + '</p></section>';
    }

    function tldrVisualHTML() {
        if (project.visual !== 'upload') return '';
        return '<div class="cs-figure-row cs-figure-row--upload">' +
            '<figure class="cs-figure cs-tldr-final"><div class="cs-figure-img cs-figure-img--shot selected-upload-desktop"><img loading="lazy" decoding="async" src="images/document-upload/document-manager-desktop.png" alt="Desktop Document Manager listing outstanding evidence requirements and uploaded documents"></div><figcaption>The document manager keeps outstanding requirements and completed uploads visible in one place.</figcaption></figure>' +
            '<figure class="cs-figure cs-tldr-final"><div class="cs-figure-img cs-figure-img--shot selected-upload-desktop selected-upload-desktop--upload"><img loading="lazy" decoding="async" src="images/document-upload/doc-upload-desktop.png" alt="Proof of identity upload screen with a file drop area and document requirements"></div><figcaption>The upload screen explains the document requirements alongside the file upload area.</figcaption></figure>' +
            '</div>';
    }

    function tldrSolutionHTML() {
        return '<section class="cs-article-section"><h2>The solution and impact</h2><p>' + project.solution + '</p><p>' + project.outcome + '</p>' + tldrVisualHTML() + '</section>';
    }

    function tldrHTML() {
        return section('The problem', project.setup) +
            section('What made this hard', project.challenge) +
            tldrSolutionHTML() +
            section('What I learned', project.neverAgain);
    }

    function uploadDetailedHTML() {
        return section('Overview', project.problem + '</p><p>The behaviour I wanted to drive was for partner agents to submit the right documents first time, quickly and confidently.') +
            '<section class="cs-article-section"><h2>The process</h2><h3 class="cs-step-title">Step #1: Defining what usable evidence meant</h3>' +
            '<p>I spoke with a member of the Liberis Operations team and worked with our product manager to establish eight document requirements the upload flow needed to support. Proof of identity and proof of address were the two main requirements for the know-your-customer (KYC) checks.</p>' +
            '<p>They provided the specific criteria for each requirement. For proof of identity, this included a passport or another accepted form of government-issued ID. I used these criteria to define the document categories and the guidance agents would need when choosing a file.</p></section>' +
            '<section class="cs-article-section"><h3 class="cs-step-title">Step #2: Learning from existing upload interfaces</h3>' +
            '<p>I reviewed document upload interfaces, including iwoca, to identify common patterns: drag-and-drop areas, document counts, loading states, file size and format requirements, upload timestamps and clear document labels. I adopted these patterns to make the upload interaction familiar.</p>' +
            '<p>Some examples also included practical advice for identity documents, such as avoiding blurry or cropped images. This informed the image-quality guidance in our flow. I combined these references with the specific document requirements supplied by the Liberis Operations team.</p>' +
            '<p>I left out optional notes because the Liberis Operations team didn’t require free-text context. The document category and applicant details already provided the context needed for review, so a notes field would have added unnecessary effort for agents.</p></section>' +
            '<section class="cs-article-section"><h3 class="cs-step-title">Step #3: Preventing unusable submissions before upload</h3>' +
            '<p>I translated the requirements into guidance alongside the upload area. For proof of identity, agents could see which types of ID were accepted and check that the image was clear and uncropped before submitting it.</p>' +
            '<p>This addressed two separate questions: whether the agent had the right document and whether its contents were readable. The aim was to help agents spot unsuitable evidence before it reached Operations.</p>' +
            '<p>I designed the desktop layout with mobile in mind, arranging components so they could stack into a single column on smaller screens. I kept the document-accuracy guidance close to the upload area in both layouts so agents could check it while choosing a file.</p>' +
            '<div class="selected-upload-state-grid">' +
              '<figure class="cs-figure"><div class="selected-upload-guidance-detail"><img loading="lazy" decoding="async" src="images/document-upload/doc-upload-desktop.png" alt="Close-up of document guidance listing accepted ID types, required visible details, and advice to avoid blurry or cropped images"></div><figcaption>Accepted ID types and image-quality guidance help agents check their document before submitting it.</figcaption></figure>' +
              '<figure class="cs-figure"><div class="selected-upload-phone"><div class="selected-upload-phone-screen" tabindex="0" aria-label="Scrollable mobile bank statement upload screen"><div class="selected-upload-bank-detail"><img src="images/document-upload/bank-statements-design-board.webp" alt="Mobile bank statement upload screen with document-accuracy guidance directly above the file upload area" loading="lazy"></div></div></div><span class="selected-scroll-hint">Scroll inside the phone to explore</span><figcaption>On mobile, the accuracy guidance sits directly above the upload area in a single column.</figcaption></figure>' +
            '</div></section>' +
            '<section class="cs-article-section"><h3 class="cs-step-title">Step #4: Handling upload errors and edge cases</h3>' +
            '<p>I drew on upload problems I’d encountered myself and researched examples online to identify potential error scenarios. I then worked through these with the product manager and engineers to decide which the flow needed to handle and what guidance would help agents recover.</p>' +
            '<p>I designed the default, uploading, error and completed states so agents knew what was happening at each stage. Progress feedback showed that the file was uploading, errors explained what needed to change, and completion confirmed that the upload had succeeded. A successful upload meant the file had been submitted for Operations to review.</p>' +
            '<p>We also considered applications involving two applicants. A proof-of-identity label alone wouldn’t make it clear whose document was needed, so we added the applicant’s name beneath it. This helped agents match each identity document to the correct person.</p>' +
            '<div class="selected-upload-state-grid">' +
              '<figure class="cs-figure"><div class="cs-figure-img cs-figure-img--shot selected-upload-desktop selected-upload-desktop--task"><img loading="lazy" decoding="async" src="images/document-upload/error-screen-desktop.png" alt="Desktop proof of identity upload screen showing a file size error and guidance to upload a smaller file"></div><figcaption>The file-size error explains that the selected file is too large and asks the agent to upload a smaller file.</figcaption></figure>' +
              '<figure class="cs-figure"><div class="selected-upload-phone"><div class="selected-upload-phone-screen" tabindex="0" aria-label="Scrollable completed document manager screen"><img loading="lazy" decoding="async" src="images/document-upload/mobile-upload-complete.png" alt="Mobile Document Manager showing successful upload feedback and completed files"></div></div><span class="selected-scroll-hint">Scroll inside the phone to explore</span><figcaption>Completion feedback confirms that the file has been uploaded for review.</figcaption></figure>' +
            '</div></section>' +
            '<section class="cs-article-section"><h3 class="cs-step-title">Step #5: Letting agents choose which document to upload next</h3>' +
            '<p>My initial flow took agents straight to the next document requirement after submission. I reconsidered that sequence because agents might have different documents available at different times. A fixed order could interrupt their progress by directing them to a requirement they weren’t ready to complete.</p>' +
            '<p>I changed the flow so submitting a document returned agents to the document manager, where they could choose which requirement to address next. This let them upload documents in the order that suited them.</p>' +
            '<p>I designed the individual upload screens first, then the document manager that brought them together. The manager needed to show basic application details alongside required documents and previously uploaded files, so agents could see what was still needed.</p><p>For the required-document cards, I reused components from another initiative because they already supported the information and actions we needed. This kept the experience consistent and avoided asking engineers to build a new card component.</p>' +
            '<div class="selected-upload-desktop-grid">' +
              '<figure class="cs-figure"><div class="cs-figure-img cs-figure-img--shot selected-upload-desktop"><img loading="lazy" decoding="async" src="images/document-upload/document-manager-desktop.png" alt="Desktop Document Manager listing required evidence and uploaded documents"></div><figcaption>The document manager keeps outstanding requirements and completed uploads visible together.</figcaption></figure>' +
              '<figure class="cs-figure"><div class="cs-figure-img cs-figure-img--shot selected-upload-desktop selected-upload-desktop--task"><img loading="lazy" decoding="async" src="images/document-upload/doc-upload-desktop.png" alt="Desktop proof of identity upload screen with file requirements and document accuracy guidance"></div><figcaption>The individual upload task explains what makes the evidence usable before the agent selects a file.</figcaption></figure>' +
            '</div></section>' +
            section('Outcome', project.outcome) +
            section('What I learned', project.reflection);
    }

    function detailedHTML() {
        return uploadDetailedHTML();
    }

    document.title = project.title.replace(/<[^>]*>/g, '') + ' | Carmen Gyoh';
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
    document.getElementById('selected-tldr').innerHTML = tldrHTML();
    document.getElementById('selected-detailed').innerHTML = detailedHTML();
    document.getElementById('selected-next').href = 'case-study-flex.html';
    document.getElementById('selected-next-title').textContent = 'Flex Advance';
})();
