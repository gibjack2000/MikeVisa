document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return; // Only run on pages with a canvas container

    const context = canvas.getContext('2d');
    const wrapper = document.querySelector('.scrolly-wrapper');
    const heroContent = document.querySelector('.hero-content');

    // Config
    const frameCount = 120;
    const images = [];
    const airfoils = { frame: 0 };
    let loadedImagesCount = 0;

    // Helper to format frame numbers like 001, 010, 120
    const currentFrame = index => (
        `Assets/ezgif-frame-${index.toString().padStart(3, '0')}.png`
    );

    // Preload images
    const preloadImages = () => {
        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            img.onload = () => {
                loadedImagesCount++;
                if (loadedImagesCount === 1) {
                    // Draw first frame as soon as it's ready to prevent blank screen
                    updateImage(0);
                }
                if (loadedImagesCount === frameCount) {
                    // All loaded
                    console.log('All hero frames loaded.');
                }
            };
            images.push(img);
        }
    };

    // Resize canvas logic to preserve "cover" aspect ratio
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        updateImage(airfoils.frame);
    };

    window.addEventListener('resize', resizeCanvas);

    // Draw image covering the canvas
    const updateImage = index => {
        if (!images[index] || !images[index].complete) return;

        const img = images[index];
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Aspect Fill (Cover) logic
        const xAspectRatio = canvas.width / img.width;
        const yAspectRatio = canvas.height / img.height;
        const ratio = Math.max(xAspectRatio, yAspectRatio);

        const newWidth = img.width * ratio;
        const newHeight = img.height * ratio;

        // Center the image
        const xOffset = (canvas.width - newWidth) / 2;
        const yOffset = (canvas.height - newHeight) / 2;

        context.drawImage(img, xOffset, yOffset, newWidth, newHeight);
    };

    // Scroll mapping logic
    const handleScroll = () => {
        if (!wrapper) return;

        // Calculate how far we've scrolled inside the wrapper
        // wrapper ends scrolling when scrollY + windowHeight = wrapper.offsetTop + wrapper.offsetHeight
        const maxScrollTop = wrapper.offsetHeight - window.innerHeight;
        const scrollFraction = window.scrollY / maxScrollTop;

        // Ensure scroll fraction is between 0 and 1
        const boundedFraction = Math.max(0, Math.min(1, scrollFraction));

        // Determine which frame to show
        const frameIndex = Math.min(
            frameCount - 1,
            Math.ceil(boundedFraction * frameCount)
        );

        // Optional: Fade out text as we scroll down deep
        if (heroContent) {
            const opacity = 1 - (boundedFraction * 2); // fades out by halfway
            heroContent.style.opacity = Math.max(0, opacity);
            heroContent.style.transform = `translateY(${boundedFraction * 100}px)`;
        }

        // Only update if frame changed to avoid redundant draws
        if (airfoils.frame !== frameIndex) {
            airfoils.frame = frameIndex;
            // Use requestAnimationFrame for smooth drawing
            requestAnimationFrame(() => updateImage(frameIndex));
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initialize
    preloadImages();
    resizeCanvas();
});
