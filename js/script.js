class Carousel {
            constructor(container) {
                this.container = container;
                this.slides = container.querySelector('.carousel-container');
                this.slideCount = container.querySelectorAll('.carousel-slide').length;
                this.currentSlide = 0;
                this.isDragging = false;
                this.startX = 0;
                this.currentX = 0;
                this.dragThreshold = 50; // Минимальное расстояние для смены слайда
                this.dragIndicator = container.querySelector('.carousel-drag-indicator');
                
                this.init();
            }
            
            init() {
                // Кнопки навигации
                this.container.querySelector('.prev-btn').addEventListener('click', () => {
                    this.prevSlide();
                });
                
                this.container.querySelector('.next-btn').addEventListener('click', () => {
                    this.nextSlide();
                });
                
                // Превью изображения
                this.container.querySelectorAll('.preview-item').forEach((preview, index) => {
                    preview.addEventListener('click', () => {
                        this.goToSlide(index);
                    });
                });
                
                // Обработчики для мыши
                this.container.addEventListener('mousedown', this.startDrag.bind(this));
                this.container.addEventListener('mousemove', this.drag.bind(this));
                this.container.addEventListener('mouseup', this.endDrag.bind(this));
                this.container.addEventListener('mouseleave', this.endDrag.bind(this));
                
                // Обработчики для касаний
                this.container.addEventListener('touchstart', this.startDrag.bind(this));
                this.container.addEventListener('touchmove', this.drag.bind(this));
                this.container.addEventListener('touchend', this.endDrag.bind(this));
                
                // Показываем индикатор при первом посещении
                //this.showDragIndicator();
                
                // Автопрокрутка
                //this.startAutoPlay();
            }
            
            startDrag(e) {
                this.isDragging = true;
                this.startX = this.getX(e);
                this.currentX = this.startX;
                this.slides.style.transition = 'none';
                
                // Скрываем индикатор при начале перетаскивания
                //this.hideDragIndicator();
            }
            
            drag(e) {
                if (!this.isDragging) return;
                
                e.preventDefault();
                this.currentX = this.getX(e);
                const diff = this.currentX - this.startX;
                
                // Вычисляем смещение с учетом границ
                const maxOffset = (this.slideCount - 1) * 100;
                const baseOffset = -this.currentSlide * 100;
                const dragOffset = (diff / this.container.offsetWidth) * 100;
                const totalOffset = baseOffset + dragOffset;
                
                // Ограничиваем смещение
                const boundedOffset = Math.max(-maxOffset, Math.min(0, totalOffset));
                this.slides.style.transform = `translateX(${boundedOffset}%)`;
            }
            
            endDrag() {
                if (!this.isDragging) return;
                
                this.isDragging = false;
                this.slides.style.transition = 'transform 0.5s ease-in-out';
                
                const diff = this.currentX - this.startX;
                const slideWidth = this.container.offsetWidth;
                const slideDiff = diff / slideWidth;
                
                // Определяем направление и силу свайпа
                if (Math.abs(diff) > this.dragThreshold) {
                    if (diff > 0) {
                        this.prevSlide();
                    } else {
                        this.nextSlide();
                    }
                } else {
                    // Если свайп слабый - возвращаем к текущему слайду
                    this.updateCarousel();
                }
            }
            
            getX(e) {
                return e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            }
            
            nextSlide() {
                this.currentSlide = (this.currentSlide + 1) % this.slideCount;
                this.updateCarousel();
            }
            
            prevSlide() {
                this.currentSlide = (this.currentSlide - 1 + this.slideCount) % this.slideCount;
                this.updateCarousel();
            }
            
            goToSlide(index) {
                this.currentSlide = index;
                this.updateCarousel();
            }
            
            updateCarousel() {
                const offset = -this.currentSlide * 100;
                this.slides.style.transform = `translateX(${offset}%)`;
                
                // Обновляем активное превью
                this.container.querySelectorAll('.preview-item').forEach((preview, index) => {
                    preview.classList.toggle('active', index === this.currentSlide);
                });
            }
            
            //showDragIndicator() {
            //    // Показываем индикатор только один раз
            //    if (!localStorage.getItem('carouselHintShown')) {
            //        this.dragIndicator.classList.add('show');
            //        setTimeout(() => {
            //            this.dragIndicator.classList.remove('show');
            //            localStorage.setItem('carouselHintShown', 'true');
            //        }, 3000);
            //    }
           // }
            
            //hideDragIndicator() {
            //    this.dragIndicator.classList.remove('show');
            //}
            
            startAutoPlay() {
                setInterval(() => {
                    this.nextSlide();
                }, 5000);
            }
        }

// slider
const thumb = document.getElementById('thumb');
const progress = document.getElementById('progress');
const track = document.getElementById('track');
const labels = document.querySelectorAll('.slider-label');
const marks = document.querySelectorAll('.slider-mark');
//const currentValue = document.getElementById('currentValue');

const values = [
    { value: 1, text: '1 день' },
    { value: 7, text: '7 дней' },
    { value: 30, text: '30 дней' },
    { value: 90, text: '90 дней' }
];

const positions = [0, 33.33, 66.66, 100];
let currentPosition = 0;
let isDragging = false;

function updateSlider(positionIndex) {
    const position = positions[positionIndex];
    
    // Обновляем позицию ползунка и прогресс
    thumb.style.left = `${position}%`;
    progress.style.width = `${position}%`;
    
    // Обновляем активные метки и labels
    labels.forEach((label, index) => {
        label.classList.toggle('active', index === positionIndex);
    });
    
    marks.forEach((mark, index) => {
        mark.classList.toggle('active', index <= positionIndex);
    });
    
    // Обновляем отображаемое значение
    //currentValue.textContent = `Выбрано: ${values[positionIndex].text}`;
    currentPosition = positionIndex;
}

function getNearestPosition(clientX) {
    const rect = track.getBoundingClientRect();
    let x = clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    
    const percentage = (x / rect.width) * 100;
    
    // Находим ближайшую позицию
    const distances = positions.map(pos => Math.abs(pos - percentage));
    const minDistance = Math.min(...distances);
    return distances.indexOf(minDistance);
}

// Обработчики для мыши
thumb.addEventListener('mousedown', (e) => {
    isDragging = true;
    thumb.style.cursor = 'grabbing';
    e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const positionIndex = getNearestPosition(e.clientX);
    updateSlider(positionIndex);
});

document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        thumb.style.cursor = 'grab';
    }
});

// Клик по треку
track.addEventListener('click', (e) => {
    const positionIndex = getNearestPosition(e.clientX);
    updateSlider(positionIndex);
});

// Клик по labels
labels.forEach((label, index) => {
    label.addEventListener('click', () => {
        updateSlider(index);
    });
});

// Предотвращаем выделение текста при перетаскивании
document.addEventListener('selectstart', (e) => {
    if (isDragging) {
        e.preventDefault();
    }
});

// Инициализация
updateSlider(0);


// Плавный скролл к секциям
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Адаптивная высота секций
function adjustSectionHeight() {
    const sections = document.querySelectorAll('.section');
    const vh = window.innerHeight;
    
    sections.forEach(section => {
        section.style.minHeight = `${vh}px`;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    new Carousel(document.querySelector('.carousel'));

    adaptiveScale();

    updateScale();
    updateAllFontSizes();
    adjustSectionHeight();
    initParallax();
    initFloatingNavigation();

    window.addEventListener('resize', adaptiveScale);
    window.addEventListener('resize', adjustSectionHeight);
    window.addEventListener('resize', updateAllFontSizes);
    window.addEventListener('resize', updateScale);

    const marquees = {
        'marqueeContainerTop': {
            text: 'INUKO CHEAT FOR PUBG',
            speed: 200
        },
        'marqueeContainerBottom': {
            text: 'INUKO CHEAT FOR PUBG', 
            speed: 200
        }
    };
    
    Object.keys(marquees).forEach(id => initMarquee(id, marquees[id]));
    
    function initMarquee(containerId, settings) {
        const marqueeContainer = document.getElementById(containerId);
        if (!marqueeContainer) return;
        
        const container = marqueeContainer.parentElement;
        
        function createMarqueeContent() {
            const containerWidth = container.offsetWidth;
            const singleItemWidth = 120;
            
            const itemsNeeded = Math.ceil((containerWidth * 2) / singleItemWidth);
            
            let content = '';
            for (let i = 0; i < itemsNeeded; i++) {
                content += `<span class="marquee-text">${settings.text}</span>`;
            }
            
            return content + content;
        }
        
        marqueeContainer.innerHTML = createMarqueeContent();
        marqueeContainer.style.animationDuration = settings.speed + 's';
    }
    
    window.addEventListener('resize', function() {
        Object.keys(marquees).forEach(id => initMarquee(id, marquees[id]));
    });

    // carousel
    const carouselSlides = document.querySelector('.preview-carousel-slides');
            const slides = document.querySelectorAll('.preview-carousel-slide');
            const previewItems = document.querySelectorAll('.preview-carousel-item');
            const previewContainer = document.querySelector('.preview-carousel-items');
            const prevBtn = document.querySelector('.preview-carousel-prev');
            const nextBtn = document.querySelector('.preview-carousel-next');
            
            let currentSlide = 0;
            const totalSlides = slides.length;
            
            function updateCarousel() {
                carouselSlides.style.transform = `translateY(-${currentSlide * 100}%)`;
                
                previewItems.forEach((item, index) => {
                    if (index === currentSlide) {
                        item.classList.add('preview-carousel-active');
                    } else {
                        item.classList.remove('preview-carousel-active');
                    }
                });
                
                scrollToActivePreview();
            }
            
            function scrollToActivePreview() {
                const activePreview = document.querySelector('.preview-carousel-item.preview-carousel-active');
                if (!activePreview) return;
                
                const activeIndex = Array.from(previewItems).indexOf(activePreview);
                const containerHeight = previewContainer.clientHeight;
                const itemHeight = 70;
                const gap = 8;
                
                const centerPosition = activeIndex * (itemHeight + gap) - (2 * (itemHeight + gap));
                const maxScroll = previewContainer.scrollHeight - containerHeight;
                const finalPosition = Math.max(0, Math.min(centerPosition, maxScroll));
                
                previewContainer.scrollTo({
                    top: finalPosition,
                    behavior: 'smooth'
                });
            }
            
            prevBtn.addEventListener('click', function() {
                currentSlide = Math.max(0, currentSlide - 1);
                updateCarousel();
            });
            
            nextBtn.addEventListener('click', function() {
                currentSlide = Math.min(totalSlides - 1, currentSlide + 1);
                updateCarousel();
            });
            
            previewItems.forEach(item => {
                item.addEventListener('click', function() {
                    const slideIndex = parseInt(this.getAttribute('data-slide'));
                    currentSlide = slideIndex;
                    updateCarousel();
                });
            });
            
            document.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    currentSlide = Math.max(0, currentSlide - 1);
                    updateCarousel();
                } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    currentSlide = Math.min(totalSlides - 1, currentSlide + 1);
                    updateCarousel();
                }
            });
            
            window.addEventListener('resize', updateScale);
            updateCarousel();
            updateScale();
});

function adaptiveScale() {
    let vw = window.innerWidth;
    let vh = window.innerHeight;

    const section2 = document.getElementById('section-2');
    const mltb = document.querySelector('.menu-left-top-block');
    const interfaceLemma = document.querySelector('.interface-lemma');
    const textDescription = document.querySelector('.rounded-container-text-description');
    const imageCarousel = document.querySelector('.rounded-container-image-carousel');

    const section3 = document.getElementById('section-3');
    const blmb = document.querySelector('.buy-left-middle-block');
    const previewCarouselContainer = document.querySelector('.preview-carousel-container');
    const bltb = document.querySelector('.buy-left-top-block');
    const blbb = document.querySelector('.buy-left-bottom-block');
    const scalableFuncContent = document.querySelector('.scalable-func-content');
    const funcWrapper = document.querySelector('.func-wrapper');
    const funcSection = document.querySelector('.func-section');
    const scalablePayContent = document.querySelector('.scalable-pay-content');
    const bmb = document.querySelector('.buy-middle-block');
    const scalableRequirementContent = document.querySelector('.scalable-requirement-content');
    const bbb = document.querySelector('.buy-bottom-block');

    if (vw > 768) {
    }
    else { // mobile
        // SECTION 2
        // SECTION 2
        // SECTION 2

        //section2.style.setProperty('height', '150vh');
        //mltb.style.setProperty('height', '60px');
        //interfaceLemma.style.setProperty('transform-origin', 'center left');

        //textDescription.style.setProperty('right', '2.2%');
        //textDescription.style.setProperty('width', '95.6%');
        //imageCarousel.style.setProperty('width', '95.6%');
        // Keep section 3 geometry identical to desktop even in emulation.
    }

    // SECTION 3 (single geometry mode for all viewport widths)
    section3.style.setProperty('height', '100vh');
    bltb.style.setProperty('height', '20%');
    blmb.style.setProperty('height', '70%');
    previewCarouselContainer.style.setProperty('height', '500px');
    previewCarouselContainer.style.setProperty('width', '1000px');
    previewCarouselContainer.style.setProperty('transform-origin', 'bottom right');
    previewCarouselContainer.style.setProperty('right', '0.5vh');
    previewCarouselContainer.style.setProperty('bottom', '0.5vh');
    previewCarouselContainer.style.setProperty('top', 'auto');
    scalableFuncContent.style.setProperty('width', '1000px');
    scalableFuncContent.style.setProperty('height', '210px');
    scalableFuncContent.style.setProperty('right', '0.5vh');
    scalableFuncContent.style.setProperty('top', '0.5vh');
    funcWrapper.style.setProperty('width', '1000px');
    funcWrapper.style.setProperty('height', '210px');
    funcSection.style.setProperty('padding', '0px 0px 0px 0px');
    blbb.style.setProperty('height', '30%');
    bmb.style.setProperty('height', '51.5%');
    scalablePayContent.style.setProperty('left', '0.5vh');
    scalablePayContent.style.setProperty('bottom', '0.5vh');
    scalablePayContent.style.setProperty('top', 'auto');
    scalablePayContent.style.setProperty('transform-origin', 'bottom left');
    // bbb.style.setProperty('height', '30.5%');
    scalableRequirementContent.style.setProperty('left', '0.5vh');
    scalableRequirementContent.style.setProperty('top', '0.5vh');
}

function updateScale() {
    let vw = window.innerWidth;

    const section3 = document.getElementById('section-3');
    const interfaceLemma = document.querySelector('.interface-lemma');
    const buyLemma = document.querySelector('.buy-lemma');
    const container = document.querySelector('.rounded-container-text-description');
    const content = document.querySelector('.scalable-content');
    const carouseleContent = document.querySelector('.scalable-carousele-content');
    const funcContent = document.querySelector('.scalable-func-content');
    const payContent = document.querySelector('.scalable-pay-content');
    const requirementContent = document.querySelector('.scalable-requirement-content');

    if (!section3 || !container || !content || !buyLemma || !funcContent || !payContent || !requirementContent) return;
    
    const baseContainerWidth = 849;
    
    const currentContainerWidth = container.offsetWidth;
    const scale = currentContainerWidth / baseContainerWidth;
    let d2scale = scale;

    if (scale != 1 && window.innerWidth > 768) {
        d2scale = ((1 - scale) / 2) + scale
    }

    const previewCarouselContainer = document.getElementById('previewCarouselContainer');
    content.style.setProperty('--scale-factor', scale * 1.0460251);
    carouseleContent.style.setProperty('--scale-factor', scale);
    interfaceLemma.style.setProperty('--scale-factor', d2scale);
    buyLemma.style.setProperty('--scale-factor', d2scale);

    // Keep section 3 in one visual mode regardless of toolbar/device emulation.
    // Tune these independently: toolbar emulation and regular site mode.
    const section3ScaleSite = 1.3;
    const section3ScaleToolbar = 0.82;
    const isMobile = window.innerWidth <= 768;
    const isToolbarLike = window.innerWidth <= 900;
    const section3BaseScale = isToolbarLike ? section3ScaleToolbar : section3ScaleSite;
    const section3FitScale = Math.min(1, window.innerWidth / 1920);
    const section3FixedScale = isMobile ? 1 : (section3BaseScale * section3FitScale);
    section3.style.setProperty('--section-3-scale', section3FixedScale);
    buyLemma.style.setProperty('--scale-factor', 1);

    if (isMobile) {
        // Fit each fixed-size section-3 card into mobile viewport width.
        const mobileContentWidth = Math.max(320, window.innerWidth - 24);
        const previewScale = Math.min(1, mobileContentWidth / 1000);
        const wideCardScale = Math.min(1, mobileContentWidth / 1000);
        const narrowCardScale = Math.min(1, mobileContentWidth / 680);

        previewCarouselContainer.style.setProperty('--scale-factor', previewScale);
        funcContent.style.setProperty('--scale-factor', wideCardScale);
        payContent.style.setProperty('--scale-factor', narrowCardScale);
        requirementContent.style.setProperty('--scale-factor', narrowCardScale);
    } else {
        previewCarouselContainer.style.setProperty('--scale-factor', 1);
        funcContent.style.setProperty('--scale-factor', 1);
        payContent.style.setProperty('--scale-factor', 1);
        requirementContent.style.setProperty('--scale-factor', 1);
    }

    console.log(scale);
}

function updateAllFontSizes() {
    const container = document.getElementById('responsive-container');
    if (!container) return;
    
    const containerWidth = container.offsetWidth;
    const textElements = container.querySelectorAll('.text-element');
    
    textElements.forEach(element => {
        const fontSize = containerWidth * parseFloat('0.05');
        element.style.fontSize = fontSize + 'px';
    });
}

function initParallax() {
      const elements = [
        { element: '.main-biglogo', intensity: 0.015 },
        { element: '.main-previewesp', intensity: 0.015 },
    ];
    
    elements.forEach(item => {
        const element = document.querySelector(item.element);
        if (!element) return;
        
        const container = element.closest('.section') || document.body;
        let currentX = 0, currentY = 0, targetX = 0, targetY = 0;
        
        function animate() {
            currentX += (targetX - currentX) * 0.1;
            currentY += (targetY - currentY) * 0.1;
            element.style.transform = `translate(${currentX}%, ${currentY}%)`;
            requestAnimationFrame(animate);
        }
        
        animate();
        
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const moveX = (e.clientX - rect.left) / rect.width - 0.5;
            const moveY = (e.clientY - rect.top) / rect.height - 0.5;
            
            targetX = moveX * item.intensity * 100;
            targetY = moveY * item.intensity * 100;
        });
        
        container.addEventListener('mouseleave', () => {
            targetX = 0;
            targetY = 0;
        });
    });
}

function initFloatingNavigation() {
    const header = document.getElementById('mainHeader');
    const pageNav = document.getElementById('pageNav');
    const scrollThreshold = 100; // 10% от 1080px
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        if (scrollY > scrollThreshold) {
            // Показываем header, прячем кнопки на странице
            header.classList.add('visible');
            pageNav.classList.add('hidden');
        } else {
            // Прячем header, показываем кнопки на странице
            header.classList.remove('visible');
            pageNav.classList.remove('hidden');
        }
    });
}

function openExternal(url) {
    window.open(url, '_blank');
}
