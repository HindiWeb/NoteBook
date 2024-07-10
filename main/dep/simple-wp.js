// $(document).ready(function() {
//   function applyTextAlignment(element) {
//     if ($(element).find('img').length > 0) {
//       $(element).css('text-align', 'center');
//     }
//   }

//   $('body').on('click', function() {
//     $('p').each(function() {
//       applyTextAlignment(this);
//     });
//   });

// //   var observer = new MutationObserver(function(mutations) {
// //     mutations.forEach(function(mutation) {
// //       $(mutation.addedNodes).filter('p').each(function() {
// //         applyTextAlignment(this);
// //       });
// //     });
// //   });

// //   observer.observe(document.body, { childList: true, subtree: true });
// });


// script.js
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
            reject(new Error('Unable to load image'));
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
        if (!previewContainer.matches(':hover')&&!document.querySelectorAll('a:hover').length > 0) {
            setTimeout(() => {
                if (!previewContainer.matches(':hover')&&!document.querySelectorAll('a:hover').length > 0) {
                    hidePreview();
                }                
            }, 500);
        }
    }, 2000);

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
                if (!previewContainer.matches(':hover')) {
                    hidePreview();
                }                    
            }, 100);
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
            return data;
        } catch (error) {
            console.error('Fetch error:', error);
            return { title: 'Error', extract_html: 'Unable to fetch preview.' };
        }
    }

    function getWikipediaLanguageAndTitle(url) {
        const urlParts = new URL(url).pathname.split('/');
        const language = new URL(url).hostname.split('.')[0];
        const title = urlParts[urlParts.length - 1];
        return [language, title];
    }

    function showPreview(link, content,x,y) {
        const rect = link.getBoundingClientRect();
        //<h3 class="wiki title">${content.title}</h3>
        //if(content.title == 'Error')return;
        previewContainer.classList.remove('wide', 'tall', 'square', 'almost-square');
        content.thumbnail ? determineImageOrientation(content.thumbnail.source).then(o=>previewContainer.classList.add(o)):null;
        previewContainer.innerHTML = `
            <div class="wiki-wr tooltip">
                <div class="wiki-p hwofd-default">${content.extract_html}</div>
                ${content.thumbnail ? `<div class="wiki img">    <a href="${content.content_urls.desktop.page}" target="_blank" rel="noopener noreferrer">
                <img src="${content.thumbnail.source}" alt="${content.title}"></a></div>` : ''}
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
                        if (node.nodeType === 1) {
                            const links = node.querySelectorAll('a[href*="wikipedia.org/wiki/"]');
                            links.forEach(link => addHoverListeners(link));
                            if (node.matches('a[href*="wikipedia.org/wiki/"]')) {
                                addHoverListeners(node);
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
    const initialLinks = document.querySelectorAll('a[href*="wikipedia.org/wiki/"]');
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

