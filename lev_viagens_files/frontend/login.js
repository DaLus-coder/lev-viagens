const API = "http://localhost:3000/api";

/* ================= LOGIN ================= */
async function login() {

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, senha })
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.error || "Erro no login");
        return;
    }

    localStorage.setItem("user", JSON.stringify(data.user));

    alert("Login realizado com sucesso!");

    window.location.href = "index.html";
}


/* ================= CADASTRO ================= */
async function register() {

    const nome = document.getElementById("nome").value;

    const email = document.getElementById("emailReg").value;
    const email2 = document.getElementById("emailReg2").value;

    const senha = document.getElementById("senhaReg").value;
    const senha2 = document.getElementById("senhaReg2").value;

    const cidade = document.getElementById("cidade").value;
    const telefone = document.getElementById("telefone").value;

    if (email !== email2) {
        alert("Emails não coincidem");
        return;
    }

    if (senha !== senha2) {
        alert("Senhas não coincidem");
        return;
    }

    await fetch(API + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nome,
            email,
            senha,
            cidade,
            telefone
        })
    });

    alert("Conta criada!");
}
