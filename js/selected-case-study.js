(function () {
    'use strict';

    var projects = {
        'partner-hub-ia': {
            title: 'Rethinking how <em>Partner Hub fits together</em>',
            plainTitle: 'Partner Hub information architecture',
            subtitle: 'Mapping two growing platforms to create a clearer long-term direction for navigation, application journeys and feature discoverability.',
            tags: ['Information Architecture', 'Platform Strategy', 'Partner Hub'],
            status: 'Exploratory and ongoing',
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
            scope: 'Workflow design, content design, upload states, requirements and handoff',
            visual: 'upload',
            problem: 'Partner agents often already had the documents needed to support a merchant’s finance application. Without a clear upload route in Partner Hub, operations could still need to contact the merchant directly, slowing progress and duplicating effort.',
            process: 'I designed the workflow around the operational details that determined whether evidence would actually be useful: what was required, why it was needed, which files were acceptable and how agents would understand progress, failure and completion.',
            solution: 'The experience gives agents a direct route to provide evidence on a merchant’s behalf. Requirements appear before file selection, upload states remain visible, and every document stays connected to the application task it supports.',
            outcome: 'The feature shipped and gave partner agents a structured way to provide documents needed to progress applications. It reduced reliance on merchants being contacted again for evidence they had already shared and gave internal teams clearer inputs to review.',
            decisions: [
                ['Explain requirements first', 'Agents can check format, recency and content before choosing a file.'],
                ['Make every state visible', 'Default, uploading, error and complete states do not rely on browser behaviour alone.'],
                ['Keep the task in context', 'The agent can see why the evidence is required and what happens after submission.']
            ],
            reflection: 'Although focused in scope, the quality of this workflow depended on operational detail. Requirements, feedback and error prevention were not secondary content tasks; they determined whether the uploaded evidence was usable.'
        },
        'pay-with-liberis': {
            title: 'Designing <em>Pay with Liberis</em> from the ground up',
            plainTitle: 'Pay with Liberis',
            subtitle: 'Creating a new merchant-facing purchase and financing journey that let businesses buy from a partner and repay through a percentage of daily sales.',
            tags: ['Fintech', '0 to 1 Product', 'Merchant-facing'],
            status: 'Delivered to launch partner',
            scope: '0-to-1 merchant journey, proposition communication, interaction design and partner handoff',
            visual: 'payment',
            problem: 'Pay with Liberis combined a purchase decision with a new type of financing experience. Merchants needed to understand what they were buying, what Liberis was providing and how repayment through daily sales would work as they moved between partner and Liberis contexts.',
            process: 'With no existing end-to-end journey or established pattern for the proposition, I worked from the ground up: making the offer tangible, shaping its place in the purchase journey and working through how responsibility and handoffs should be communicated.',
            solution: 'The resulting journey connected the partner purchase to a clear Liberis funding proposition. It introduced the offer at the right moment, explained percentage-of-daily-sales repayment in plain language and established a reusable foundation for different partner contexts.',
            outcome: 'The journey was completed and handed over to the launch partner. It became a merchant-facing foundation for later partner implementations rather than requiring each new experience to begin from a blank page.',
            decisions: [
                ['Connect purchase and funding', 'The experience needed to feel coherent even as the merchant moved between partner and Liberis contexts.'],
                ['Explain repayment plainly', 'A new financing proposition only works when merchants can understand the commitment.'],
                ['Design for reuse', 'The core journey stays consistent while products, branding and purchase contexts can adapt.']
            ],
            reflection: 'This work shows my ability to shape a new proposition as well as its interface: turning an unfamiliar financing model into a journey a merchant could understand and a partner could implement.'
        }
    };

    var order = ['partner-hub-ia', 'document-upload', 'pay-with-liberis'];
    var key = new URLSearchParams(window.location.search).get('project') || order[0];
    var project = projects[key] || projects[order[0]];
    var currentIndex = order.indexOf(key);
    if (currentIndex < 0) currentIndex = 0;
    var nextKey = order[(currentIndex + 1) % order.length];

    function metaHTML() {
        return '<div class="cs-meta-col"><h3>My contribution</h3><p>Product design across the end-to-end experience.</p></div>' +
            '<div class="cs-meta-col"><h3>Scope</h3><p>' + project.scope + '</p></div>' +
            '<div class="cs-meta-col"><h3>Status</h3><p>' + project.status + '</p></div>';
    }

    function section(title, body) {
        return '<section class="cs-article-section"><h2>' + title + '</h2><p>' + body + '</p></section>';
    }

    function decisionsHTML() {
        return '<section class="cs-article-section"><h2>Key <em>decisions</em></h2><div class="selected-decision-grid">' + project.decisions.map(function (item) {
            return '<div class="selected-decision"><h3>' + item[0] + '</h3><p>' + item[1] + '</p></div>';
        }).join('') + '</div></section>';
    }

    document.title = project.plainTitle + ' — Carmen Gyoh';
    document.getElementById('selected-title').innerHTML = project.title;
    document.getElementById('selected-subtitle').textContent = project.subtitle;
    document.getElementById('selected-tags').innerHTML = project.tags.map(function (tag) { return '<span class="cs-chip">' + tag + '</span>'; }).join('');
    document.getElementById('selected-cover').classList.add('selected-cs-cover--' + project.visual);
    document.getElementById('selected-cover').innerHTML = '<div class="selected-cover-art"><span></span><span></span><span></span><span></span></div>';
    document.getElementById('selected-meta-tldr').innerHTML = metaHTML();
    document.getElementById('selected-meta-detailed').innerHTML = metaHTML();
    document.getElementById('selected-tldr').innerHTML = section('The problem', project.problem) + section('The approach', project.process) + section('The solution', project.solution) + section('The outcome', project.outcome);
    document.getElementById('selected-detailed').innerHTML = section('Overview', project.subtitle) + section('Understanding the <em>problem</em>', project.problem) + section('How I approached it', project.process) + decisionsHTML() + section('The solution', project.solution) + section('Outcome', project.outcome) + '<section class="cs-article-section"><h2>Reflection</h2><blockquote class="cs-pullquote">' + project.reflection + '</blockquote></section>';
    document.getElementById('selected-next').href = 'selected-case-study.html?project=' + nextKey;
    document.getElementById('selected-next-title').textContent = projects[nextKey].plainTitle;
})();
