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
    const isMobile = window.innerWidth <= 768;
    
    sections.forEach(section => {
        if (isMobile && section.id === 'section-3') {
            section.style.minHeight = '';
            section.style.height = '';
            return;
        }
        section.style.minHeight = `${vh}px`;
        section.style.height = `${vh}px`;
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
    initPaymentInstructionModal();

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
                slides.forEach((slide, index) => {
                    slide.classList.toggle('preview-carousel-slide-active', index === currentSlide);
                });
                
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
            window.addEventListener('resize', updateCarousel);
            updateCarousel();
            updateScale();
});

function initPaymentInstructionModal() {
    const trigger = document.getElementById('payInstructionTrigger');
    const modal = document.getElementById('payInstructionModal');
    const closeBtn = document.getElementById('payInstructionModalClose');
    if (!trigger || !modal || !closeBtn) return;

    function openModal() {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
    }

    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
    }

    trigger.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });
}

function adaptiveScale() {
    // Section geometry is controlled by CSS.
    // Keep this hook for backward compatibility without forcing inline styles.
}

function layoutSection3Mobile() {
    const section3 = document.getElementById('section-3');
    const wrapper = document.querySelector('#section-3 .buy-scale-wrapper');
    const preview = document.getElementById('previewCarouselContainer');
    const func = document.querySelector('.scalable-func-content');
    const pay = document.querySelector('.scalable-pay-content');
    const requirement = document.querySelector('.scalable-requirement-content');

    if (!section3 || !wrapper || !preview || !func || !pay || !requirement) return;

    const viewportWidth = window.innerWidth;
    const sidePadding = 12;
    const contentWidth = Math.max(0, viewportWidth - sidePadding * 2);
    const gap = Math.max(8, Math.round(viewportWidth * 0.02));

    const wideScale = Math.min(1, contentWidth / 1000);
    const narrowScale = Math.min(1, contentWidth / 680);

    const previewW = 1000 * wideScale;
    const previewH = 483 * wideScale;
    const funcW = 1000 * wideScale;
    const funcH = 269 * wideScale;
    const payW = 680 * narrowScale;
    const payH = 320 * narrowScale;
    const requirementW = 680 * narrowScale;
    const requirementH = 432 * narrowScale;

    const leftWide = sidePadding + (contentWidth - previewW) / 2;
    const leftNarrow = sidePadding + (contentWidth - payW) / 2;

    let top = gap;

    func.style.setProperty('--scale-factor', wideScale);
    func.style.left = `${leftWide}px`;
    func.style.top = `${top}px`;
    top += funcH + gap;

    preview.style.setProperty('--scale-factor', wideScale);
    preview.style.left = `${leftWide}px`;
    preview.style.top = `${top}px`;
    top += previewH + gap;

    pay.style.setProperty('--scale-factor', narrowScale);
    pay.style.left = `${leftNarrow}px`;
    pay.style.top = `${top}px`;
    top += payH + gap;

    requirement.style.setProperty('--scale-factor', narrowScale);
    requirement.style.left = `${leftNarrow}px`;
    requirement.style.top = `${top}px`;
    top += requirementH + gap;

    wrapper.style.width = `${viewportWidth}px`;
    wrapper.style.height = `${Math.ceil(top)}px`;
    wrapper.style.left = '0px';
    wrapper.style.top = '0px';
    wrapper.style.transform = 'none';

    preview.style.right = 'auto';
    preview.style.bottom = 'auto';
    preview.style.transformOrigin = 'top left';
    func.style.right = 'auto';
    func.style.bottom = 'auto';
    func.style.transformOrigin = 'top left';
    pay.style.right = 'auto';
    pay.style.bottom = 'auto';
    pay.style.transformOrigin = 'top left';
    requirement.style.right = 'auto';
    requirement.style.bottom = 'auto';
    requirement.style.transformOrigin = 'top left';

    section3.classList.remove('section3-js-fixed');
    section3.classList.add('section3-mobile-js');
}

function resetSection3MobileLayout() {
    const section3 = document.getElementById('section-3');
    const wrapper = document.querySelector('#section-3 .buy-scale-wrapper');
    const preview = document.getElementById('previewCarouselContainer');
    const func = document.querySelector('.scalable-func-content');
    const pay = document.querySelector('.scalable-pay-content');
    const requirement = document.querySelector('.scalable-requirement-content');

    if (!section3 || !wrapper || !preview || !func || !pay || !requirement) return;

    section3.classList.remove('section3-mobile-js');
    section3.classList.remove('section3-js-fixed');
    wrapper.style.height = '';
    wrapper.style.width = '';
    wrapper.style.left = '';
    wrapper.style.top = '';
    wrapper.style.transform = '';

    [preview, func, pay, requirement].forEach((node) => {
        node.style.left = '';
        node.style.top = '';
        node.style.right = '';
        node.style.bottom = '';
        node.style.transformOrigin = '';
    });
}

function layoutSection3Desktop(referenceScale = 1) {
    const section3 = document.getElementById('section-3');
    const container = document.querySelector('#section-3 .container');
    const topBlock = document.querySelector('#section-3 .buy-left-top-block');
    const wrapper = document.querySelector('#section-3 .buy-scale-wrapper');
    const preview = document.getElementById('previewCarouselContainer');
    const func = document.querySelector('.scalable-func-content');
    const pay = document.querySelector('.scalable-pay-content');
    const requirement = document.querySelector('.scalable-requirement-content');

    if (!section3 || !container || !wrapper || !preview || !func || !pay || !requirement) return;

    const PREVIEW_W = 1000;
    const PREVIEW_H = 483;
    const FUNC_W = 1000;
    const FUNC_H = 269;
    const PAY_W = 680;
    const PAY_H = 320;
    const REQ_W = 680;
    const REQ_H = 432;
    const GAP_X = 20;
    const GAP_Y = 20;
    const SIDE_PADDING = 20;
    const BOTTOM_PADDING = 44;
    const TOP_GAP = 26;

    const baseWidth = PREVIEW_W + GAP_X + PAY_W;
    const baseHeight = Math.max(PREVIEW_H + GAP_Y + FUNC_H, PAY_H + GAP_Y + REQ_H);

    // Apply desktop fixed-mode class before measurements so offsets are read from final desktop CSS.
    section3.classList.add('section3-js-fixed');

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const topReserved = topBlock
        ? (topBlock.offsetTop + topBlock.offsetHeight + TOP_GAP)
        : 170;

    const scaleByWidth = (containerWidth - SIDE_PADDING * 2) / baseWidth;
    const scaleByHeight = (containerHeight - topReserved - BOTTOM_PADDING) / baseHeight;
    const fitScale = Math.min(scaleByWidth, scaleByHeight);
    // Keep section 3 in sync with section 2 scaling on desktop (including >1 on 2K/4K).
    const section2Scale = referenceScale;
    const scale = Math.max(0.1, Math.min(section2Scale, fitScale));

    const visualWidth = baseWidth * scale;
    const visualHeight = baseHeight * scale;
    // Anchor to top reserved area to avoid visual drift to the bottom.
    const top = topReserved;
    const left = (containerWidth - visualWidth) / 2;
    const section3Height = Math.ceil(top + visualHeight + BOTTOM_PADDING);

    // Avoid static 100vh empty space when width changes and content scales down.
    section3.style.height = `${section3Height}px`;
    section3.style.minHeight = `${section3Height}px`;

    wrapper.style.width = `${baseWidth}px`;
    wrapper.style.height = `${baseHeight}px`;
    wrapper.style.left = `${Math.round(left)}px`;
    wrapper.style.top = `${Math.round(top)}px`;
    wrapper.style.transform = `scale(${scale})`;
    wrapper.style.transformOrigin = 'top left';

    preview.style.setProperty('--scale-factor', 1);
    preview.style.left = '0px';
    preview.style.top = '0px';
    preview.style.right = 'auto';
    preview.style.bottom = 'auto';
    preview.style.transformOrigin = 'top left';

    func.style.setProperty('--scale-factor', 1);
    func.style.left = '0px';
    const leftBottomTop = baseHeight - FUNC_H;
    const rightBottomTop = baseHeight - REQ_H;

    func.style.top = `${leftBottomTop}px`;
    func.style.right = 'auto';
    func.style.bottom = 'auto';
    func.style.transformOrigin = 'top left';

    pay.style.setProperty('--scale-factor', 1);
    pay.style.left = `${PREVIEW_W + GAP_X}px`;
    pay.style.top = '0px';
    pay.style.right = 'auto';
    pay.style.bottom = 'auto';
    pay.style.transformOrigin = 'top left';

    requirement.style.setProperty('--scale-factor', 1);
    requirement.style.left = `${PREVIEW_W + GAP_X}px`;
    requirement.style.top = `${rightBottomTop}px`;
    requirement.style.right = 'auto';
    requirement.style.bottom = 'auto';
    requirement.style.transformOrigin = 'top left';

    section3.classList.remove('section3-mobile-js');
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

    // Section 3 geometry is now fully JS-driven.
    const isMobile = window.innerWidth <= 768;
    section3.style.setProperty('--section-3-scale', 1);
    buyLemma.style.setProperty('--scale-factor', 1);

    if (isMobile) {
        section3.style.height = '';
        section3.style.minHeight = '';
        layoutSection3Mobile();
    } else {
        resetSection3MobileLayout();
        layoutSection3Desktop(scale);
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
        { element: '#responsive-container', intensity: 0.01 },
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
    const isMobile = window.innerWidth <= 768;
    const showThreshold = isMobile ? 420 : 120;
    const hideThreshold = isMobile ? 300 : 90;
    let isVisible = false;

    function syncFloatingNav() {
        const scrollY = window.scrollY;

        // Hysteresis prevents flicker and accidental header visibility near top.
        if (!isVisible && scrollY > showThreshold) {
            isVisible = true;
        } else if (isVisible && scrollY < hideThreshold) {
            isVisible = false;
        }

        header.classList.toggle('visible', isVisible);
        pageNav.classList.toggle('hidden', isVisible);
    }

    window.addEventListener('scroll', syncFloatingNav);
    syncFloatingNav();
}

function openExternal(url) {
    window.open(url, '_blank');
}


