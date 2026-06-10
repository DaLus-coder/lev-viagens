const API = "http://localhost:3000/api";

window.addEventListener("load", async () => {
    initTabs();
    initMainCarousel();
    initMiniCarousels(); // 👈 NOVO
    await loadCMS();
});

/* =========================
   CMS LOAD
========================= */
async function loadCMS() {

    const res = await fetch(API + "/cards");
    const cards = await res.json();

    const maps = {
        alugueis: document.getElementById("alugueis-track"),
        experiencias: document.getElementById("experiencias-track"),
        gastronomia: document.getElementById("gastronomia-track")
    };

    Object.values(maps).forEach(el => {
        if (el) el.innerHTML = "";
    });

    cards.forEach(card => {
        const el = createCard(card);
        if (maps[card.categoria]) {
            maps[card.categoria].appendChild(el);
        }
    });
}

/* =========================
   CARD
========================= */
function createCard(card) {

    const div = document.createElement("div");
    div.className = "mini-card";

    div.innerHTML = `
        <img src="${card.imagem}">
        <h3>${card.titulo}</h3>
        <p>${card.descricao}</p>
        <button>${card.botao_texto}</button>
    `;

    return div;
}

/* =========================
   CARROSSEL PRINCIPAL
========================= */
function initMainCarousel() {

    const track = document.querySelector(".carousel-track");
    const cards = document.querySelectorAll(".carousel-track .card");
    const left = document.querySelector(".arrow.left");
    const right = document.querySelector(".arrow.right");

    if (!track || !cards.length || !left || !right) return;

    let index = 0;
    const total = cards.length;

    function update() {
        track.style.transform = `translateX(-${index * 100}%)`;
    }

    left.addEventListener("click", () => {
        index = Math.max(0, index - 1);
        update();
    });

    right.addEventListener("click", () => {
        index = Math.min(total - 1, index + 1);
        update();
    });

    update();
}

/* =========================
   MINI CARROSSEL DOS TABS (NOVO - CORRIGIDO)
========================= */
function initMiniCarousels() {

    const carousels = document.querySelectorAll(".mini-carousel");

    carousels.forEach(carousel => {

        const track = carousel.querySelector(".mini-track");
        const prev = carousel.querySelector(".prev");
        const next = carousel.querySelector(".next");

        if (!track || !prev || !next) return;

        let index = 0;

        function getCardWidth() {
            const card = track.querySelector(".mini-card");
            if (!card) return 0;
            return card.getBoundingClientRect().width + 20; // margem
        }

        function update() {
            const width = getCardWidth();
            track.style.transform = `translateX(-${index * width}px)`;
        }

        prev.addEventListener("click", () => {
            const max = track.children.length - 1;
            index = Math.max(0, index - 1);
            update();
        });

        next.addEventListener("click", () => {
            const max = track.children.length - 1;
            index = Math.min(max, index + 1);
            update();
        });

        window.addEventListener("resize", update);

        update();
    });
}

/* =========================
   TABS
========================= */
function initTabs() {

    const buttons = document.querySelectorAll(".tab-btn");
    const contents = document.querySelectorAll(".tab-content");

    buttons.forEach(btn => {

        btn.addEventListener("click", () => {

            const target = btn.getAttribute("data-tab");

            buttons.forEach(b => b.classList.remove("active"));
            contents.forEach(c => c.classList.remove("active"));

            btn.classList.add("active");

            const section = document.getElementById(target);

            if (section) section.classList.add("active");
        });
    });
}