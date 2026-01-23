document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel');

    carousels.forEach(carouselEl => {
        const carousel = bootstrap.Carousel.getOrCreateInstance(carouselEl);
        const toggleBtn = carouselEl.querySelector('.carousel-control-toggle');

        let isPlaying = true;

        toggleBtn.addEventListener('click', () => {
            if (isPlaying) {
                carousel.pause();
                toggleBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
                toggleBtn.setAttribute('aria-label', '재생');
            } else {
                carousel.cycle();
                toggleBtn.innerHTML = '<i class="fa-solid fa-stop"></i>';
                toggleBtn.setAttribute('aria-label', '정지');
            }
            isPlaying = !isPlaying;
        });
    });
});
