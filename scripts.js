document.addEventListener("DOMContentLoaded", () => {
    // Preloader Logic
    if (sessionStorage.getItem("preloaderShown") !== "true") {
        const preloader = document.querySelector(".preloader");
        const progressBar = document.querySelector(".preloader-progress-bar");

        if (preloader) {
            // Add preloading class to body to hide content
            document.body.classList.add("preloading");

            // Simulate loading progress (fast animation)
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10; // Increment for quick animation
                if (progressBar) {
                    progressBar.style.width = progress + "%";
                }
                if (progress >= 100) {
                    clearInterval(interval);
                    // Fade out preloader
                    preloader.style.opacity = "0";
                    setTimeout(() => {
                        preloader.style.display = "none";
                        document.body.classList.remove("preloading");
                        // Show content
                        document.querySelectorAll(".site-header, .hero-slider, section, footer").forEach((el) => {
                            el.style.display = "";
                        });
                        // Mark preloader as shown
                        sessionStorage.setItem("preloaderShown", "true");
                    }, 300); // Short fade-out delay
                }
            }, 50); // Fast interval for progress
        }
    } else {
        // Skip preloader if already shown
        const preloader = document.querySelector(".preloader");
        if (preloader) {
            preloader.style.display = "none";
        }
        document.body.classList.remove("preloading");
        document.querySelectorAll(".site-header, .hero-slider, section, footer").forEach((el) => {
            el.style.display = "";
        });
    }

    // Constants
    const SLIDE_INTERVAL = 9000;
    const DEBOUNCE_DELAY = 100;
    const highlights = {
        walking: "Enjoy tranquil walks along the lake’s edge. Discover hidden paths and native wildlife.",
        picnic: "Relax with a lakeside picnic. Our gourmet hampers are perfect for sunny afternoons.",
        cruise: "Set sail for a scenic cruise. Experience the lake from a unique vantage point.",
        celebrate: "Host your special event with the lake as your backdrop. Perfect for weddings and celebrations.",
        theatre: "Visit the Royal Shakespeare Theatre nearby. Experience world-class performances."
    };

    // Utility: Debounce function
    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(null, args), delay);
        };
    };

    // Hero Slider
    const initSlider = () => {
        const slides = document.querySelectorAll(".slide");
        const dots = document.querySelectorAll(".dot");
        const prevButton = document.querySelector(".prev-slide");
        const nextButton = document.querySelector(".next-slide");
        let currentSlide = 0;
        let slideInterval;
        let isTransitioning = false;

        if (!slides.length || !dots.length || !prevButton || !nextButton) {
            console.error("Slider elements missing:", { slides: slides.length, dots: dots.length, prevButton, nextButton });
            return;
        }

        const showSlide = (n, immediate = false) => {
            currentSlide = (n + slides.length) % slides.length;
            isTransitioning = true;
            clearInterval(slideInterval);

            slides.forEach(slide => {
                slide.classList.remove("active");
                slide.style.display = "none";
                const img = slide.querySelector("img");
                if (img) {
                    img.style.transition = "none";
                    img.style.transform = "scale(1.2)";
                }
            });
            dots.forEach(dot => dot.classList.remove("active"));

            const newSlide = slides[currentSlide];
            newSlide.classList.add("active");
            newSlide.style.display = "block";
            dots[currentSlide].classList.add("active");

            const img = newSlide.querySelector("img");
            if (img) {
                requestAnimationFrame(() => {
                    img.style.transition = immediate ? "none" : "transform 4s ease";
                    img.style.transform = "scale(1)";
                });
            }
            setTimeout(() => {
                isTransitioning = false;
            }, immediate ? 0 : 4000);

            startSlideShow();
        };

        const nextSlide = () => showSlide(currentSlide + 1);
        const startSlideShow = () => {
            slideInterval = setInterval(nextSlide, SLIDE_INTERVAL);
        };
        const stopSlideShow = () => clearInterval(slideInterval);

        prevButton.addEventListener("click", () => {
            stopSlideShow();
            showSlide(currentSlide - 1);
        });

        nextButton.addEventListener("click", () => {
            stopSlideShow();
            showSlide(currentSlide + 1);
        });

        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                if (index === currentSlide) return;
                stopSlideShow();
                showSlide(index);
            });
        });

        let touchStartX = 0;
        const sliderContainer = document.querySelector(".slider-container");
        sliderContainer.addEventListener("touchstart", (e) => {
            touchStartX = e.touches[0].clientX;
        });
        sliderContainer.addEventListener("touchend", (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            if (touchStartX - touchEndX > 50) {
                stopSlideShow();
                nextSlide();
            } else if (touchEndX - touchStartX > 50) {
                stopSlideShow();
                showSlide(currentSlide - 1);
            }
        });

        showSlide(0, true);
        startSlideShow();
    };

    // Header Scroll Effect
    const initHeaderScroll = () => {
        const header = document.querySelector(".site-header");
        if (!header) return;

        const updateHeader = () => {
            if (window.scrollY > 100) {
                header.classList.remove("transparent");
                header.classList.add("white");
            } else {
                header.classList.add("transparent");
                header.classList.remove("white");
            }
        };

        window.addEventListener("scroll", debounce(updateHeader, DEBOUNCE_DELAY));
        updateHeader();
    };

    // Hero Image Parallax
    const initHeroParallax = () => {
        const slides = document.querySelectorAll(".slide");
        if (!slides.length) return;

        const updateParallax = () => {
            const scrollY = window.scrollY;
            slides.forEach(slide => {
                const img = slide.querySelector("img");
                if (img && slide.classList.contains("active")) {
                    img.style.transform = `scale(1) translateY(${scrollY * 0.1}px)`;
                }
            });
        };

        window.addEventListener("scroll", () => requestAnimationFrame(updateParallax));
    };

    // Intersection Observer for Magazine-Style Animations
    const initAnimations = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const section = entry.target;
                    section.classList.add("reveal");
                    section.querySelectorAll(".magic-content, .magic-image-area, .section-content, .section-image, .highlight-card, .room-card, .venue-card, .offer-card").forEach((el, index) => {
                        el.style.animationDelay = `${index * 0.2}s`;
                        el.classList.add("animate-in");
                    });
                    observer.unobserve(section);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll(".section-transition-quote, .highlights-showcase, .magic-welcome-section, .rooms-section, .meetings-section, .weddings-section, .christmas-section, .spa-section, .map-section").forEach(section => {
            observer.observe(section);
        });

        // Stylish Quote Animation
        const quoteContainer = document.getElementById("quote-text");
        if (quoteContainer) {
            const quote = "“Where history whispers and luxury lingers.”";
            const observerQuote = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        quoteContainer.innerHTML = "";
                        quote.split("").forEach((char, index) => {
                            const span = document.createElement("span");
                            span.textContent = char === " " ? "\u00A0" : char;
                            span.className = "quote-letter";
                            span.style.animationDelay = `${index * 0.045}s`;
                            quoteContainer.appendChild(span);
                        });
                        observerQuote.unobserve(quoteContainer);
                    }
                });
            }, { threshold: 0.5 });
            observerQuote.observe(quoteContainer);
        }
    };

    // Spa Image Hover
    const initSpaImageHover = () => {
        const spaImage = document.querySelector(".spa-section .section-image");
        const overlay = document.querySelector(".spa-section .image-overlay");
        if (!spaImage || !overlay) return;

        spaImage.addEventListener("mouseenter", () => {
            spaImage.style.transform = "scale(1.03) rotate(1deg)";
            overlay.style.background = "linear-gradient(180deg, rgba(30, 42, 43, 0.4) 0%, rgba(139, 111, 71, 0.3) 100%)";
        });
        spaImage.addEventListener("mouseleave", () => {
            spaImage.style.transform = "";
            overlay.style.background = "linear-gradient(180deg, rgba(30, 42, 43, 0.3) 0%, rgba(139, 111, 71, 0.2) 100%)";
        });
    };

    // Spa Tip Popup
    const initSpaPopup = () => {
        const spaTipPopup = document.getElementById("spa-tip-popup");
        if (!spaTipPopup) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    spaTipPopup.classList.add("visible");
                    spaTipPopup.setAttribute("aria-hidden", "false");
                    observer.unobserve(spaTipPopup);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(spaTipPopup);
    };

    // Lake Highlights
    const initLakeHighlights = () => {
        document.querySelectorAll(".lake-dot").forEach(dot => {
            dot.setAttribute("role", "button");
            dot.setAttribute("aria-label", `Show ${dot.getAttribute("data-highlight")} highlight`);
            dot.addEventListener("click", () => {
                const highlight = dot.getAttribute("data-highlight");
                const discoveryText = document.getElementById("discovery-text");
                if (discoveryText && highlights[highlight]) {
                    discoveryText.style.opacity = 0;
                    setTimeout(() => {
                        discoveryText.innerHTML = `<p><strong>${highlight.charAt(0).toUpperCase() + highlight.slice(1)}:</strong> ${highlights[highlight]}</p>`;
                        discoveryText.style.opacity = 1;
                    }, 150);
                } else {
                    discoveryText.innerHTML = "<p>Please select a highlight to view details.</p>";
                }
            });
        });
    };

    // Scroll Reveal
    const initScrollReveal = () => {
        const reveals = document.querySelectorAll(".reveal");
        const reveal = () => {
            const windowHeight = window.innerHeight;
            reveals.forEach(el => {
                const elementTop = el.getBoundingClientRect().top;
                if (elementTop < windowHeight - 100) {
                    el.classList.add("active");
                }
            });
        };
        window.addEventListener("scroll", debounce(reveal, DEBOUNCE_DELAY));
        reveal();
    };

    // Scroll Progress Indicator
    const initScrollProgress = () => {
        const progressBar = document.createElement("div");
        progressBar.className = "scroll-progress";
        document.body.appendChild(progressBar);

        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${progress}%`;
        };

        window.addEventListener("scroll", debounce(updateProgress, DEBOUNCE_DELAY));
    };

    // Newsletter Popup
    const initNewsletterPopup = () => {
        const params = new URLSearchParams(window.location.search);
        const popup = document.getElementById("newsletter-popup");
        if (params.get("subscribed") === "true" && popup) {
            popup.style.display = "block";
            popup.setAttribute("aria-hidden", "false");
            setTimeout(() => {
                popup.style.opacity = 0;
                setTimeout(() => {
                    popup.style.display = "none";
                    popup.setAttribute("aria-hidden", "true");
                }, 300);
            }, 4000);
        }
    };

    // Back to Top
    const initBackToTop = () => {
        const backToTop = document.querySelector(".back-to-top");
        if (!backToTop) return;

        const updateBackToTop = () => {
            if (window.scrollY > 400) {
                backToTop.classList.add("visible");
            } else {
                backToTop.classList.remove("visible");
            }
        };

        window.addEventListener("scroll", debounce(updateBackToTop, DEBOUNCE_DELAY));
    };

    // Card Hover Lift
    const initCardHover = () => {
        document.querySelectorAll(".highlight-card, .room-card, .venue-card, .offer-card").forEach(card => {
            card.addEventListener("mouseenter", () => {
                card.style.transform = "translateY(-8px) rotate(1deg)";
            });
            card.addEventListener("mouseleave", () => {
                card.style.transform = "";
            });
        });
    };

    // Dropdown Accessibility
    const initDropdownAccessibility = () => {
        document.querySelectorAll(".dropdown").forEach(dropdown => {
            const link = dropdown.querySelector("a");
            const menu = dropdown.querySelector(".dropdown-menu");
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const isExpanded = menu.style.display === "block";
                menu.style.display = isExpanded ? "none" : "block";
                link.setAttribute("aria-expanded", !isExpanded);
            });
            link.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    const isExpanded = menu.style.display === "block";
                    menu.style.display = isExpanded ? "none" : "block";
                    link.setAttribute("aria-expanded", !isExpanded);
                }
            });
        });
    };

    // Cursor Sparkle Effect
    const initCursorSparkle = () => {
        if (!window.matchMedia("(pointer: fine)").matches) return;

        const interactiveElements = document.querySelectorAll(".btn-primary, .btn-secondary, .btn-book, .btn-meetings, .lake-dot, .highlight-card, .room-card, .venue-card, .offer-card");
        interactiveElements.forEach(el => {
            el.addEventListener("mousemove", (e) => {
                const sparkle = document.createElement("div");
                sparkle.className = "sparkle";
                sparkle.style.left = `${e.clientX}px`;
                sparkle.style.top = `${e.clientY}px`;
                document.body.appendChild(sparkle);
                setTimeout(() => sparkle.remove(), 800);
            });
            el.addEventListener("mouseenter", () => {
                el.style.cursor = "pointer";
                el.style.boxShadow = `0 0 12px rgba(212, 160, 23, 0.5)`;
            });
            el.addEventListener("mouseleave", () => {
                el.style.boxShadow = "";
            });
        });
    };

    // Sticky Title Fade
    const initStickyTitleFade = () => {
        const titles = document.querySelectorAll(".section-title, .section-title1");
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    entry.target.classList.add("scrolled");
                } else {
                    entry.target.classList.remove("scrolled");
                }
            });
        }, { threshold: 0.1 });

        titles.forEach(title => observer.observe(title));
    };

    // Drone Reel Video (unchanged, but included for completeness)
    const initDroneReel = () => {
        const droneReelPlayBtn = document.getElementById("droneReelPlayBtn");
        if (droneReelPlayBtn) {
            droneReelPlayBtn.addEventListener("click", () => {
                const placeholder = document.getElementById("droneReelPlaceholder");
                const videoWrapper = document.getElementById("droneReelVideoWrapper");

                if (!placeholder || !videoWrapper) return;

                // Show loading spinner
                videoWrapper.innerHTML = '<div class="video-loading-spinner">Loading video...</div>';

                // Create video element
                const video = document.createElement("video");
                video.setAttribute("controls", "");
                video.setAttribute("autoplay", "");
                video.setAttribute("playsinline", "");
                video.setAttribute("poster", "images/index/drone-poster.jpg");
                video.style.background = "#000";
                video.innerHTML = `
                    <source src="path/to/drone-reel.mp4" type="video/mp4">
                    Your browser does not support the video tag.
                `;

                // Remove placeholder and show video when ready
                video.oncanplay = () => {
                    videoWrapper.innerHTML = "";
                    videoWrapper.appendChild(video);
                };

                // Hide placeholder
                placeholder.style.display = "none";
            });
        }
    };

    // Initialize all features
    initSlider();
    initHeaderScroll();
    initHeroParallax();
    initAnimations();
    initSpaImageHover();
    initSpaPopup();
    initLakeHighlights();
    initScrollReveal();
    initScrollProgress();
    initNewsletterPopup();
    initBackToTop();
    initCardHover();
    initDropdownAccessibility();
    initCursorSparkle();
    initStickyTitleFade();
    initDroneReel();

    // Add slide background for parallax
    document.querySelectorAll(".slide").forEach(slide => {
        const bg = document.createElement("div");
        bg.className = "slide-bg";
        bg.style.position = "absolute";
        bg.style.top = "0";
        bg.style.left = "0";
        bg.style.width = "100%";
        bg.style.height = "100%";
        bg.style.background = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M10 50c10 20 30 20 40 0s30-20 40 0" stroke="rgba(139, 111, 71, 0.1)" fill="none" stroke-width="2"/></svg>') center/cover`;
        slide.insertBefore(bg, slide.firstChild);
    });

    // Inject Schema.org JSON-LD
    const schemaScript = document.createElement("script");
    schemaScript.type = "application/ld+json";
    schemaScript.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Hotel",
        "name": "Sunday Warwickshire Walton Hall Hotel & Spa",
        "description": "Luxury hotel in Warwickshire offering 197 rooms, spa, weddings, and event spaces in a 16th-century estate.",
        "url": "https://www.waltonhallhotel.co.uk",
        "telephone": "+441789842424",
        "email": "mice.waltonhall@hotelssunday.com",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Walton, Wellesbourne",
            "addressLocality": "Warwickshire",
            "postalCode": "CV35 9HG",
            "addressCountry": "UK"
        },
        "image": "https://www.waltonhallhotel.co.uk/output-onlinepngtools.png",
        "starRating": {
            "@type": "Rating",
            "ratingValue": "4",
            "bestRating": "5"
        },
        "priceRange": "$$$",
        "checkInTime": "15:00",
        "checkOutTime": "11:00",
        "amenityFeature": [
            { "@type": "LocationFeatureSpecification", "name": "Spa" },
            { "@type": "LocationFeatureSpecification", "name": "Restaurant" },
            { "@type": "LocationFeatureSpecification", "name": "Conference Rooms" },
            { "@type": "LocationFeatureSpecification", "name": "Free Wi-Fi" },
            { "@type": "LocationFeatureSpecification", "name": "Parking" }
        ]
    });
    document.head.appendChild(schemaScript);

    // Button click logging (for debugging)
    document.querySelectorAll(".btn-primary, .btn-secondary").forEach(button => {
        button.addEventListener("click", (e) => {
            console.log("Button clicked:", button.getAttribute("href"));
        });
    });
});
