document.addEventListener('DOMContentLoaded', () => {
    // Populate Centralized Assets
    if (window.APP_ASSETS) {
        const assets = window.APP_ASSETS;
        
        // Auto-fill images with data-asset attribute
        document.querySelectorAll('img[data-asset]').forEach(img => {
            const key = img.getAttribute('data-asset');
            if (assets[key]) img.src = assets[key];
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
        
        // Populate slider if present
        const sliderContainer = document.getElementById('slider');
        if (sliderContainer && assets.slider) {
            sliderContainer.innerHTML = assets.slider.map(url => 
                `<div class="slide" style="background-image: url('${url}');"></div>`
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
    const dots = document.querySelectorAll('.nav-dot');
    let currentSlide = 0;

    const goToSlide = (index) => {
        if (!slider) return;
        slider.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        currentSlide = index;
    };

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    // Auto slide
    setInterval(() => {
        currentSlide = (currentSlide + 1) % dots.length;
        goToSlide(currentSlide);
    }, 5000);

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                    hideMenu();
                }
            }
        });
    });
});
