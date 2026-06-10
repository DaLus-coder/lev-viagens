const API = "http://localhost:3000/api";

let editId = null;

/* =========================
   MENU MOBILE
========================= */
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const menuToggle = document.getElementById("menuToggle");

menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
});

overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
});

/* =========================
   LOAD CARDS
========================= */
async function load() {

    const res = await fetch(API + "/cards");
    const cards = await res.json();

    const container = document.getElementById("listaCards");
    container.innerHTML = "";

    cards.forEach(c => {

        const div = document.createElement("div");
        div.className = "card-admin";

        div.innerHTML = `
            <img src="${c.imagem}">
            <h3>${c.titulo}</h3>
            <p>${c.categoria}</p>

            <button onclick="editCard(${c.id})">Editar</button>
            <button onclick="deleteCard(${c.id})">Excluir</button>
        `;

        container.appendChild(div);
    });
}

/* =========================
   SAVE CARD
========================= */
async function saveCard() {

    const titulo = document.getElementById("titulo").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const imagem = document.getElementById("imagem").value.trim();
    const categoria = document.getElementById("categoria").value;
    const botao_texto = document.getElementById("botao_texto").value.trim();

    if (!titulo || !descricao || !imagem || !categoria || !botao_texto) {
        alert("Preencha todos os campos!");
        return;
    }

    if (!confirm("Tem certeza que deseja salvar este card?")) return;

    const data = { titulo, descricao, imagem, categoria, botao_texto };

    const url = editId
        ? `${API}/admin/cards/${editId}`
        : `${API}/admin/cards`;

    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        alert("Erro ao salvar card");
        return;
    }

    editId = null;
    clearForm();
    load();

    alert("Card salvo com sucesso!");
}

/* =========================
   EDIT
========================= */
async function editCard(id) {

    const res = await fetch(API + "/cards");
    const cards = await res.json();

    const card = cards.find(c => c.id === id);

    editId = id;

    document.getElementById("titulo").value = card.titulo;
    document.getElementById("descricao").value = card.descricao;
    document.getElementById("imagem").value = card.imagem;
    document.getElementById("categoria").value = card.categoria;
    document.getElementById("botao_texto").value = card.botao_texto;
}

/* =========================
   DELETE
========================= */
async function deleteCard(id) {

    if (!confirm("Excluir este card?")) return;

    await fetch(`${API}/admin/cards/${id}`, {
        method: "DELETE"
    });

    load();
}

/* =========================
   UPLOAD IMAGEM
========================= */
async function uploadImagem() {

    const fileInput = document.getElementById("file");
    const imagemInput = document.getElementById("imagem");

    if (!fileInput.files.length) {
        alert("Selecione uma imagem");
        return;
    }

    const formData = new FormData();
    formData.append("imagem", fileInput.files[0]);

    const res = await fetch(`${API}/upload`, {
        method: "POST",
        body: formData
    });

    const data = await res.json();
    imagemInput.value = data.url;
}

/* =========================
   CLEAR FORM
========================= */
function clearForm() {
    document.getElementById("titulo").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("imagem").value = "";
    document.getElementById("categoria").value = "alugueis";
    document.getElementById("botao_texto").value = "";
}

/* INIT */
load();