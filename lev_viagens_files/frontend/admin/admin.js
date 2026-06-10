const API = "http://localhost:3000/api";

let editId = null;

/* ================= SIDEBAR MOBILE ================= */

const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const menuToggle = document.getElementById("menuToggle");

menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
});

/* 🔥 AGORA FECHA AO CLICAR FORA */
overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
});

/* ================= LOAD CARDS ================= */

async function load() {

    const res = await fetch(API + "/cards");
    const cards = await res.json();

    const container = document.getElementById("cards");
    container.innerHTML = "";

    const grupos = {
        alugueis: [],
        experiencias: [],
        gastronomia: []
    };

    cards.forEach(c => {
        if (grupos[c.categoria]) grupos[c.categoria].push(c);
    });

    for (let grupo in grupos) {

        const title = document.createElement("h2");
        title.textContent = grupo.toUpperCase();
        container.appendChild(title);

        const grid = document.createElement("div");
        grid.className = "cards-grid";

        grupos[grupo].forEach(c => {

            const div = document.createElement("div");
            div.className = "card-admin";

            div.innerHTML = `
                <img src="${c.imagem}">
                <h4>${c.titulo}</h4>

                <div class="card-actions">
                    <button class="edit-btn" onclick="edit(${c.id})">Editar</button>
                    <button class="delete-btn" onclick="remove(${c.id})">Excluir</button>
                </div>
            `;

            grid.appendChild(div);
        });

        container.appendChild(grid);
    }
}

/* ================= SAVE ================= */

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

    if (!confirm("Tem certeza?")) return;

    const data = { titulo, descricao, imagem, categoria, botao_texto };

    const url = editId
        ? `${API}/admin/cards/${editId}`
        : `${API}/admin/cards`;

    const method = editId ? "PUT" : "POST";

    await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    editId = null;
    clear();
    load();
}

/* ================= EDIT ================= */

async function edit(id) {

    const res = await fetch(API + "/cards");
    const cards = await res.json();

    const c = cards.find(x => x.id === id);

    editId = id;

    document.getElementById("titulo").value = c.titulo;
    document.getElementById("descricao").value = c.descricao;
    document.getElementById("imagem").value = c.imagem;
    document.getElementById("categoria").value = c.categoria;
    document.getElementById("botao_texto").value = c.botao_texto;
}

/* ================= DELETE ================= */

async function remove(id) {

    if (!confirm("Excluir card?")) return;

    await fetch(`${API}/admin/cards/${id}`, {
        method: "DELETE"
    });

    load();
}

/* ================= CLEAR ================= */

function clear(){
    document.getElementById("titulo").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("imagem").value = "";
    document.getElementById("botao_texto").value = "";
}

/* ================= UPLOAD IMAGEM ================= */

async function uploadImagem() {

    const fileInput = document.getElementById("file");
    const imagemInput = document.getElementById("imagem");

    if (!fileInput) {
        alert("Input de arquivo não encontrado");
        return;
    }

    if (!imagemInput) {
        alert("Input de URL (imagem) não encontrado no HTML");
        return;
    }

    if (!fileInput.files || fileInput.files.length === 0) {
        alert("Selecione uma imagem primeiro!");
        return;
    }

    const formData = new FormData();
    formData.append("imagem", fileInput.files[0]);

    try {
        const res = await fetch(`${API}/upload`, {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (!data.url) {
            alert("Upload falhou no backend");
            return;
        }

        imagemInput.value = data.url;

        alert("Upload concluído!");

    } catch (err) {
        console.error(err);
        alert("Erro ao enviar imagem");
    }
}

/* INIT */
load();