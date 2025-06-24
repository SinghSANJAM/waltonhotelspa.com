document.addEventListener("DOMContentLoaded", function () {
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    const prevButton = document.querySelector(".prev-slide");
    const nextButton = document.querySelector(".next-slide");
    const header = document.querySelector(".site-header");

    let currentSlide = 0;
    let slideInterval;
    let scrollTimeout;

    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove("active"));
        dots.forEach(dot => dot.classList.remove("active"));

        currentSlide = (n + slides.length) % slides.length;

        slides[currentSlide].classList.add("active");
        dots[currentSlide].classList.add("active");

        if (currentSlide === 0 && window.scrollY <= 100) {
            header.classList.add("transparent");
            header.classList.remove("white");
        } else {
            header.classList.remove("transparent");
            header.classList.add("white");
        }
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 7999);
    }

    function stopSlideShow() {
        clearInterval(slideInterval);
    }

    prevButton.addEventListener("click", () => {
        showSlide(currentSlide - 1);
        stopSlideShow();
        startSlideShow();
    });

    nextButton.addEventListener("click", () => {
        showSlide(currentSlide + 1);
        stopSlideShow();
        startSlideShow();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            showSlide(index);
            stopSlideShow();
            startSlideShow();
        });
    });

    // Pause slide show on scroll
    window.addEventListener('scroll', () => {
        stopSlideShow();
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            startSlideShow();
        }, 2000);
    });

    // Initial setup
    header.classList.add("transparent");
    showSlide(0);
    startSlideShow();
});

// Scroll effect for hero image scaling + header color change
window.addEventListener('scroll', () => {
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        const offset = window.scrollY * 0.25;
        heroImage.style.transform = `scale(1.05) translateY(${offset}px)`;
    }

    const header = document.querySelector(".site-header");
    if (header) {
        const activeSlide = document.querySelector(".slide.active");
        if (activeSlide && activeSlide === document.querySelectorAll(".slide")[0]) {
            if (window.scrollY > 100) {
                header.classList.remove("transparent");
                header.classList.add("white");
            } else {
                header.classList.add("transparent");
                header.classList.remove("white");
            }
        }
    }
});

// Intersection Observer for magic welcome section
document.addEventListener('DOMContentLoaded', function () {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                section.querySelector('.magic-content')?.classList.add('animate-in');
                section.querySelector('.magic-image-area')?.classList.add('animate-in');
                observer.unobserve(section);
            }
        });
    }, { threshold: 0.3 });

    const magicSection = document.querySelector('.magic-welcome-section');
    if (magicSection) {
        observer.observe(magicSection);
    }
});document.addEventListener("DOMContentLoaded", () => {
    const quote = "“Where history whispers and luxury lingers.”";
    const container = document.getElementById("quote-text");

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          quote.split("").forEach((char, index) => {
            const span = document.createElement("span");
            span.textContent = char === " " ? "\u00A0" : char;
            span.className = "letter";
            span.style.animationDelay = `${index * 0.05}s`;
            container.appendChild(span);
          });
          obs.unobserve(container); // stop observing once animated
        }
      });
    }, {
      threshold: 0.5
    });

    observer.observe(container);
  });

// Bubble/Steam Effect
const spaMist = document.querySelector('.spa-mist');
function createBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.style.left = Math.random() * 90 + 5 + '%';
    bubble.style.width = Math.random() * 20 + 10 + 'px';
    bubble.style.height = bubble.style.width;
    bubble.style.animationDuration = Math.random() * 3 + 2 + 's';
    bubble.style.animationDelay = Math.random() * 1.5 + 's';
    bubble.style.setProperty('--drift', Math.random() > 0.5 ? 1 : -1);
    spaMist.appendChild(bubble);
    setTimeout(() => bubble.remove(), 5000);
}

const spaSection = document.querySelector('.spa-section');
const spaObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setInterval(createBubble, 150);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

if (spaSection) {
    spaObserver.observe(spaSection);
}

const spaImage = document.querySelector('.section-image');
spaImage.addEventListener('mouseenter', () => {
    spaImage.style.transform = 'scale(1.03)';
    document.querySelector('.image-overlay').style.background = 'linear-gradient(180deg, rgba(175,142,99,0.2) 0%, rgba(61,90,64,0.1) 100%)';
});
spaImage.addEventListener('mouseleave', () => {
    spaImage.style.transform = '';
    document.querySelector('.image-overlay').style.background = 'linear-gradient(180deg, rgba(61,90,64,0.08) 0%, rgba(175,142,99,0.05) 100%)';
});

// Spa Tip Popup
const spaSurpriseBtn = document.getElementById('spa-surprise-btn');
const spaTipPopup = document.getElementById('spa-tip-popup');

spaSurpriseBtn.addEventListener('mouseenter', () => {
    spaTipPopup.classList.add('visible');
});
spaSurpriseBtn.addEventListener('mouseleave', () => {
    spaTipPopup.classList.remove('visible');
});

// Lake Highlights Dots
const highlights = {
    walking: "Enjoy tranquil walks along the lake’s edge. Discover hidden paths and native wildlife.",
    picnic: "Relax with a lakeside picnic. Our gourmet hampers are perfect for sunny afternoons.",
    cruise: "Set sail for a scenic cruise. Experience the lake from a unique vantage point.",
    celebrate: "Host your special event with the lake as your backdrop. Perfect for weddings and celebrations.",
    theatre: "Visit the Royal Shakespeare Theatre nearby. Experience world-class performances."
};

document.querySelectorAll('.lake-dot').forEach(dot => {
    dot.addEventListener('click', function () {
        const highlight = this.getAttribute('data-highlight');
        const discoveryText = document.getElementById('discovery-text');
        discoveryText.innerHTML = `<p><strong>${highlight.charAt(0).toUpperCase() + highlight.slice(1)}:</strong> ${highlights[highlight]}</p>`;
    });
});

// Scroll Reveal Animation
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            el.classList.add('active');
        }
    });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('subscribed') === 'true') {
      const popup = document.getElementById('newsletter-popup');
      if (popup) {
        popup.style.display = 'block';
        // Optional: hide after 5 seconds
        setTimeout(() => popup.style.display = 'none', 5000);
      }
    }
  });
