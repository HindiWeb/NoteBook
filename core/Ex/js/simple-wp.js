if (typeof loggingOn === 'undefined') loggingOn = false;

function determineImageOrientation(imageUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        
        img.onload = function() {
            const originalWidth = img.naturalWidth;
            const originalHeight = img.naturalHeight;
            const fitHeight = 210; 
            
            imgWidth =originalWidth / (originalHeight / fitHeight );

            // console.log(imgWidth,fitHeight,originalHeight,originalWidth);

            if (imgWidth > fitHeight + 10 ) {
                resolve('wide');
            } else if (fitHeight > imgWidth + 10) {
                resolve('tall');
            } else if (fitHeight === imgWidth)  {
                resolve('square');
            } else{
                resolve('almost-squre');
            } 

            // if (originalWidth > originalHeight) {
            //     resolve('wide');
            // } else if (originalHeight > originalWidth) {
            //     resolve('tall');
            // } else {
            //     resolve('square');
            // }
        };

        img.onerror = function() {
            // reject(new Error('Unable to load image'));
            resolve('no-img');
        };

        img.src = imageUrl;
    });
}

function adcTwr(cls){
     $('#preview-container .wiki-wr').addClass(cls);
}
function setPopupPosition(previewContainer,x,y) {
    ps = previewContainer.style;
    ps.top = 'auto';
    ps.left = 'auto';
    ps.bottom = 'auto';
    ps.right = 'auto';
    if(x>window.innerWidth/2){
        ps.right = (window.innerWidth - x -50) + 'px';
        adcTwr('right');
    } else {
        ps.left = (x-50) + 'px';
        adcTwr('left');
    }
    if(y>window.innerHeight/2){
        ps.bottom = (window.innerHeight -y+15)+ 'px';
        adcTwr('top');
    } else {
        ps.top = (y + 15) + 'px';
        adcTwr('bottom');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    $.fn.isHovered = function() {
        return $(this).filter(':hover').length > 0;
    };
    var previewContainer = document.getElementById('preview-container') || $('<div id="preview-container"></div>').appendTo('body')[0];

    var lastFatched;

    setInterval(() => {
        // console.log(1,!$(previewContainer).isHovered());
        // console.log(2,!document.querySelectorAll('a:hover').length > 0);
        if (!$(previewContainer).isHovered()&& !document.querySelectorAll('a:hover').length > 0) {
            setTimeout(() => {
                if (!$(previewContainer).isHovered()&&!document.querySelectorAll('a:hover').length > 0) {
                    hidePreview();
                }                
            }, 500);
        }
    }, 1000);

    function addHoverListeners(link) {
        if (link.dataset.hasListener) return; // Prevent adding multiple listeners
        if (link.closest('.wiki-wr')) return;
        link.dataset.hasListener = true;

        link.addEventListener('mouseenter', async (event) => {
            setTimeout(async() => {
                if(!$(link).isHovered()) return;
                const url = event.target.href;
            
                // console.log('Hovering over link:', url,event); // Debugging
                const previewContent = await fetchPreviewContent(url);
                if(!previewContent)return;
                
                $(link).isHovered() && showPreview(event.target, previewContent,event.clientX,event.clientY);
            }, 150);
        });

        link.addEventListener('mouseleave', () => {
            // Only hide preview if mouse is not over the preview container
            setTimeout(() => {
                if (!$(previewContainer).isHovered()) {
                    // hidePreview();
                }                    
            }, 200);
        });
    }

    async function fetchPreviewContent(url) {

        const [language, title] = getWikipediaLanguageAndTitle(url);
        const apiUrl = `https://${language}.wikipedia.org/api/rest_v1/page/summary/${title}`;
        if(lastFatched === apiUrl && $(previewContainer).is(':visible')) return null;
        lastFatched = apiUrl;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            // TO DO
            // send data to wikis/get -> POST to save it
            if(data) $.ajax({
                method:'POST',
                url:'/cache/wikis/save.php',
                data:{qxm:data,title:decodeURIComponent(title)},
                success:function(res){
                    if (loggingOn) console.log(res);
                }
            })
            return data;
        } catch (error) {
            try {
                const fallbackResponse = await fetch(`/Start/NET-JRF/wikis/get?qxm=${title}`);
                if (!fallbackResponse.ok) throw new Error('Network response was not ok');
                const fallbackData = await fallbackResponse.json();
                // console.error('Primary fetch failed, falling back to secondary fetch:', error.message,fallbackData);
                return { title: title, ...fallbackData };
            } catch (fallbackError) {
                console.error('Both fetch attempts failed:', fallbackError.message);
                return { title: title, error: 'Both primary and fallback fetches failed.' };
            }
        }
    }

    function getWikipediaLanguageAndTitle(url) {
        url = decodeURI(url);
        const urlParts = new URL(url).pathname.split('/');
        const lang = new URL(url).hostname.split('.');//[0];
        const title = urlParts[urlParts.length - 1];
        const language =lang.length > 1 ? lang[0] : (/[\u0900-\u097F]/u.test(decodeURIComponent(title)) ? 'hi' : 'en');
        return [language, title];
    }

    function showPreview(link, content, x, y) {
        const rect = link.getBoundingClientRect();

        if(!content||!content.extract_html)return;

        previewContainer.classList.remove('wide', 'tall', 'square', 'almost-square','no-img');
        content.thumbnail ? determineImageOrientation(content.thumbnail.source).then(o=>previewContainer.classList.add(o)):null;
        previewContainer.innerHTML = `
            <div class="wiki-wr tooltip">
                
                <div class="wiki-p hwofd-default">
                    <a style="color:#000" target="_blank" href="${(link)}">
                    ${content.extract_html}
                    </a>
                </div>
                ${content.thumbnail ? `<div class="wiki img">    
                    <a href="${content.content_urls.desktop.page}" target="_blank" rel="noopener noreferrer">
                    <img src="${content.thumbnail.source}" alt="${content.title}">
                    </a>
                </div>` : ''}
                
            </div>
        `;
        // previewContainer.style.display = 'block';
        $(previewContainer).fadeIn(300);

        setPopupPosition(previewContainer,x,y);
        
        // console.log(rect.right ,rect.left," : rect RL");
        // if(rect.left > window.innerWidth/2){
        //     previewContainer.style.right = (window.innerWidth- rect.right) + 'px';
        // } else {        
        //     previewContainer.style.left = `${rect.left + window.scrollX}px`;
        // }

        // setTimeout(() => {
        //     const wrect = previewContainer.getBoundingClientRect();
        //     // console.log( wrect.right , window.innerWidth,wrect.left ,'RwL');
        //     // console.log( previewContainer.style.right , window.innerWidth,previewContainer.style.left ,'RwL');
    
        //     if(wrect.right > window.innerWidth){
        //         previewContainer.style.right = (window.width - rect.right) + 'px';
        //         previewContainer.style.left = 'auto';
        //     }
        //     // console.log( previewContainer.style.right , window.innerWidth, previewContainer.style.left ,'RwL');
        // }, 100);
    }

    function hidePreview() {
        // previewContainer.style.display = 'none';
        $(previewContainer).fadeOut(300);
    }

    function observeMutations() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {//wikipedia.org
                            const links = node.querySelectorAll('a[href*="/wiki/"]');
                            links.forEach(link => addHoverListeners(link));
                            if (node.matches('a[href*="/wiki/"]')) {
                                addHoverListeners(node);//wikipedia.org
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Add listeners to existing Wikipedia links
    //wikipedia.org
    const initialLinks = document.querySelectorAll('a[href*="/wiki/"]');
    // console.log('Initial Wikipedia links:', initialLinks); // Debugging
    initialLinks.forEach(link => addHoverListeners(link));

    // Observe future changes
    observeMutations();
    document.body.addEventListener('click', (event) => {
        if (!previewContainer.contains(event.target) && !event.target.matches('a[href*="wikipedia.org/wiki/"]')) {
            hidePreview();
        }
    });
});

