
const track = document.querySelector(".carousel-track");

const cards = document.querySelectorAll(".card");

const dots = document.querySelectorAll(".dot");

const next = document.querySelector(".right");
const prev = document.querySelector(".left");

let current = 0;

function updateCarousel() {

    track.style.transform =
        `translateX(-${current * 100}%)`;

    dots.forEach(dot =>
        dot.classList.remove("active")
    );

    dots[current].classList.add("active");
}

next.addEventListener("click", () => {

    current++;

    if (current >= cards.length) {
        current = 0;
    }

    updateCarousel();
});

prev.addEventListener("click", () => {

    current--;

    if (current < 0) {
        current = cards.length - 1;
    }

    updateCarousel();
});

/* Auto-play */

setInterval(() => {

    current++;

    if (current >= cards.length) {
        current = 0;
    }

    updateCarousel();

}, 5000);

updateCarousel();

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

menuBtn.addEventListener("click", function () {

    mobileMenu.classList.toggle("active");

});


//folders content

const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabBtns.forEach(btn => {

    btn.addEventListener("click", () => {

        tabBtns.forEach(b =>
            b.classList.remove("active")
        );

        tabContents.forEach(c =>
            c.classList.remove("active")
        );

        btn.classList.add("active");

        document
            .getElementById(btn.dataset.tab)
            .classList.add("active");
    });

});