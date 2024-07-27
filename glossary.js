document.addEventListener("DOMContentLoaded", function() {
    if (typeof window.glossaryTerms !== 'undefined' && window.glossaryTerms.length > 0) {
        const contentElement = document.querySelector('div[itemprop="articleBody"]');
        if (contentElement) {
            let content = contentElement.innerHTML;
            const urlPath = window.location.pathname;
            const langCodeMatch = urlPath.match(/^\/(en|es|pt-br|ar)\//);
            const langCode = langCodeMatch ? langCodeMatch[1] : 'en';
            function replaceTextOutsideATags(node, term, replacement) {
                if (node.nodeType === Node.TEXT_NODE && node.parentNode.nodeName !== 'A') {
                    const parentNode = node.parentNode;
                    const text = node.textContent;
                    const regex = new RegExp(`\\b${term}\\b`,'gi');
                    const newText = text.replace(regex, replacement);
                    if (newText !== text) {
                        const span = document.createElement('span');
                        span.innerHTML = newText;
                        parentNode.replaceChild(span, node);
                    }
                } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName !== 'A') {
                    node.childNodes.forEach(child=>replaceTextOutsideATags(child, term, replacement));
                }
            }
            window.glossaryTerms.forEach(termData=>{
                const term = termData.term;
                const definitionKey = `definition_${langCode.replace('-', '_')}`;
                const definition = termData[definitionKey] || termData.definition_en;
                const replacement = `<abbr class="glossary-term" data-definition="${encodeURIComponent(definition)}">${term}</abbr>`;
                contentElement.childNodes.forEach(child=>replaceTextOutsideATags(child, term, replacement));
            }
            );
            const glossaryTerms = document.querySelectorAll('.glossary-term');
            let tooltip = null;
            function showTooltip(term) {
                if (!tooltip) {
                    tooltip = document.createElement('div');
                    tooltip.classList.add('glossary-tooltip');
                    document.body.appendChild(tooltip);
                    tooltip.style.position = 'fixed';
                    tooltip.style.bottom = '50px';
                    tooltip.style.left = '10px';
                    tooltip.style.width = 'calc(100vw - 20px)';
                }
                tooltip.innerHTML = decodeURIComponent(term.dataset.definition);
                tooltip.style.visibility = 'visible';
                tooltip.style.opacity = 1;
                document.body.classList.add('showing-tooltip');
            }
            function hideTooltip() {
                if (tooltip) {
                    tooltip.style.visibility = 'hidden';
                    tooltip.style.opacity = 0;
                    document.body.classList.remove('showing-tooltip');
                }
            }
            glossaryTerms.forEach(term=>{
                term.addEventListener('click', (event)=>{
                    event.stopPropagation();
                    if (tooltip && tooltip.style.visibility === 'visible') {
                        hideTooltip();
                    } else {
                        showTooltip(term);
                    }
                }
                );
            }
            );
            document.addEventListener('click', ()=>{
                hideTooltip();
            }
            );
        }
    }
});
