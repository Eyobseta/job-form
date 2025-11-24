document.addEventListener("DOMContentLoaded", function () {

    // Make sure '.swiper' exists
    const swiperEl = document.querySelector(".swiper");
    if (!swiperEl) {
        console.error("Swiper container not found!");
        return;
    }

    const swiper = new Swiper(swiperEl, {
        direction: "horizontal",
        allowTouchMove: false, // disable manual swipe
        slidesPerView: 1,
        spaceBetween: 20,
    });

    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");
    const submitBtn = document.getElementById("submitBtn");

    prevBtn.style.display = "none"; // hide back on first slide

    nextBtn.addEventListener("click", () => {
        swiper.slideNext();

        if (swiper.isEnd) {
            nextBtn.style.display = "none";
            submitBtn.style.display = "inline-block";
        }

        if (!swiper.isBeginning) prevBtn.style.display = "inline-block";
    });

    prevBtn.addEventListener("click", () => {
        swiper.slidePrev();

        if (swiper.isBeginning) prevBtn.style.display = "none";
        if (!swiper.isEnd) {
            nextBtn.style.display = "inline-block";
            submitBtn.style.display = "none";
        }
    });

});
