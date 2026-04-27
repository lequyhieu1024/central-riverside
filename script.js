document.addEventListener('DOMContentLoaded', () => {
    // Populate Centralized Assets
    if (window.APP_ASSETS) {
        const assets = window.APP_ASSETS;

        // Detect base path from current script location
        let basePath = '';
        if (document.currentScript) {
            const src = document.currentScript.src;
            basePath = src.substring(0, src.lastIndexOf('/') + 1);
        } else {
            // Fallback for older browsers
            const scriptTag = document.querySelector('script[src*="script.js"]');
            const scriptSrc = scriptTag ? scriptTag.getAttribute('src') : '';
            basePath = scriptSrc.replace('script.js', '');
        }

        const fixPath = (path) => {
            if (!path || path.startsWith('http') || path.startsWith('/') || path.startsWith('data:')) return path;
            // Ensure we don't double up slashes if basePath is a full URL
            return basePath + path;
        };
        
        // Auto-fill images with data-asset attribute
        document.querySelectorAll('img[data-asset]').forEach(img => {
            const key = img.getAttribute('data-asset');
            if (assets[key]) img.src = fixPath(assets[key]);
        });

        // Auto-fill text/href for hotline, zalo, address
        document.querySelectorAll('.asset-text').forEach(el => {
            const key = el.getAttribute('data-asset');
            if (assets[key]) el.textContent = assets[key];
        });

        document.querySelectorAll('.asset-href').forEach(el => {
            const key = el.getAttribute('data-asset');
            if (assets[key]) {
                if (key === 'hotline') el.href = `tel:${assets[key].replace(/\s/g, '')}`;
                else el.href = assets[key];
            }
        });

        // Populate slider — hỗ trợ plain string hoặc object {type, url}
        const sliderContainer = document.getElementById('slider');
        const sliderNav = document.querySelector('.slider-nav');
        if (sliderContainer && assets.slider) {
            sliderContainer.innerHTML = assets.slider.map((item, i) => {
                const isObj = typeof item === 'object';
                const type = isObj ? item.type : 'image';
                const url = fixPath(isObj ? item.url : item);

                if (type === 'video') {
                    return `<div class="slide slide-video" data-index="${i}">
                        <video src="${url}" muted playsinline preload="metadata" loop
                            style="width:100%;height:100%;object-fit:cover;display:block;"></video>
                    </div>`;
                } else {
                    return `<div class="slide" style="background-image: url('${url}');"></div>`;
                }
            }).join('');

            // Rebuild dots to match number of slides
            if (sliderNav) {
                sliderNav.innerHTML = assets.slider.map((_, i) =>
                    `<div class="nav-dot${i === 0 ? ' active' : ''}" data-index="${i}"></div>`
                ).join('');
            }
        }

        // Populate gallery section
        const galleryGrid = document.getElementById('gallery-grid');
        if (galleryGrid && assets.gallery) {
            galleryGrid.innerHTML = assets.gallery.map(url =>
                `<div class="gallery-item">
                    <img src="${fixPath(url)}" alt="Ảnh dự án Central Riverside" loading="lazy">
                </div>`
            ).join('');
        }

        // Populate video section
        const videoGrid = document.getElementById('video-grid');
        if (videoGrid && assets.videos) {
            videoGrid.innerHTML = assets.videos.map(url =>
                `<div class="video-item">
                    <video controls preload="metadata" style="width:100%; border-radius:10px; display:block;">
                        <source src="${fixPath(url)}" type="video/mp4">
                    </video>
                </div>`
            ).join('');
        }
    }

    const header = document.getElementById('header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const closeMobile = document.getElementById('close-mobile');

    // Sticky Header
    header.classList.add('is-sticky');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        }
    });

    // Mobile Menu
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            mobileOverlay.classList.add('active');
        });
    }

    const hideMenu = () => {
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
    };

    if (closeMobile) closeMobile.addEventListener('click', hideMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', hideMenu);

    // Slider Logic
    const slider = document.getElementById('slider');
    let currentSlide = 0;
    let autoPlayTimer = null;

    const goToSlide = (index) => {
        const dots = Array.from(document.querySelectorAll('.nav-dot'));
        if (!slider || !dots.length) return;

        // Pause any playing videos
        Array.from(document.querySelectorAll('.slide-video video')).forEach(v => {
            v.pause();
            v.currentTime = 0;
        });

        slider.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[index]) dots[index].classList.add('active');
        currentSlide = index;

        // Play video if current slide is video
        const slideEl = slider.children[index];
        if (slideEl && slideEl.classList.contains('slide-video')) {
            const vid = slideEl.querySelector('video');
            if (vid) {
                vid.play().catch(() => {});
                clearInterval(autoPlayTimer);
                vid.onended = () => {
                    const total = document.querySelectorAll('.nav-dot').length;
                    currentSlide = (currentSlide + 1) % total;
                    goToSlide(currentSlide);
                    startAutoPlay(total);
                };
                return;
            }
        }

        startAutoPlay(document.querySelectorAll('.nav-dot').length);
    };

    const startAutoPlay = (total) => {
        clearInterval(autoPlayTimer);
        autoPlayTimer = setInterval(() => {
            currentSlide = (currentSlide + 1) % total;
            goToSlide(currentSlide);
        }, 5000);
    };

    const initSlider = () => {
        const dots = Array.from(document.querySelectorAll('.nav-dot'));
        if (!dots.length) return;

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(autoPlayTimer);
                goToSlide(index);
            });
        });

        goToSlide(0);
    };

    setTimeout(initSlider, 50);

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    hideMenu();
                }
            }
        });
    });
});
