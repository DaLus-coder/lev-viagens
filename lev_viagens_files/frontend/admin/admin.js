const API = "http://localhost:3000/api";

window.onload = () => {
    loadAdmin();
};

/* =========================
   LISTAR
========================= */
async function loadAdmin() {

    const res = await fetch(API + "/cards");
    const cards = await res.json();

    const list = document.getElementById("listaCards");
    list.innerHTML = "";

    cards.forEach(c => {

        const div = document.createElement("div");
        div.className = "card-admin";

        div.innerHTML = `
            <h3>${c.titulo}</h3>
            <p>${c.categoria}</p>

            <button onclick="editCard(${c.id})">Editar</button>
            <button onclick="deleteCard(${c.id})">Excluir</button>
        `;

        list.appendChild(div);
    });
}

/* =========================
   UPLOAD (CORRIGIDO)
========================= */
async function uploadImagem() {

    const fileInput = document.getElementById("file");
    const imagemInput = document.getElementById("imagem");

    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
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
   SAVE (CREATE + UPDATE)
========================= */
async function saveCard() {

    const titulo = document.getElementById("titulo").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const imagem = document.getElementById("imagem").value.trim();
    const categoria = document.getElementById("categoria").value;
    const botao_texto = document.getElementById("botao_texto").value.trim();

    // 🔴 VALIDAÇÃO (OBRIGATÓRIO PREENCHER TUDO)
    if (!titulo || !descricao || !imagem || !categoria || !botao_texto) {
        alert("Preencha todos os campos antes de salvar.");
        return;
    }

    const data = {
        titulo,
        descricao,
        imagem,
        categoria,
        botao_texto
    };

    const url = window.editId
        ? `${API}/admin/cards/${window.editId}`
        : `${API}/admin/cards`;

    const confirmAction = window.editId
        ? confirm("Tem certeza que deseja EDITAR este card?")
        : confirm("Tem certeza que deseja CRIAR este card?");

    if (!confirmAction) return;

    await fetch(url, {
        method: window.editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    window.editId = null;

    clearForm();
    loadAdmin();

    alert("Ação realizada com sucesso!");
}

async function deleteCard(id) {

    const confirmDelete = confirm("Tem certeza que deseja EXCLUIR este card?");

    if (!confirmDelete) return;

    await fetch(`${API}/admin/cards/${id}`, {
        method: "DELETE"
    });

    alert("Card excluído com sucesso!");

    loadAdmin();
}

async function editCard(id) {

    const confirmEdit = confirm("Deseja editar este card?");

    if (!confirmEdit) return;

    const res = await fetch(API + "/cards");
    const cards = await res.json();

    const card = cards.find(c => c.id === id);

    window.editId = id;

    document.getElementById("titulo").value = card.titulo;
    document.getElementById("descricao").value = card.descricao;
    document.getElementById("imagem").value = card.imagem;
    document.getElementById("categoria").value = card.categoria;
    document.getElementById("botao_texto").value = card.botao_texto;
}

/* =========================
   EDIT
========================= */
async function editCard(id) {

    const res = await fetch(API + "/cards");
    const cards = await res.json();

    const card = cards.find(c => c.id === id);

    window.editId = id;

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

    await fetch(`${API}/admin/cards/${id}`, {
        method: "DELETE"
    });

    loadAdmin();
}

/* =========================
   LIMPAR FORM
========================= */
function clearForm() {

    document.getElementById("titulo").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("imagem").value = "";
    document.getElementById("categoria").value = "alugueis";
    document.getElementById("botao_texto").value = "";
}