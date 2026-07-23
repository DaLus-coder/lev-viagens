const API =
    location.hostname === "localhost"
        ? "http://localhost:3000/api"
        : "https://lev-viagem.onrender.com/api";


/* ================= LOGIN ================= */
async function login() {

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    try {

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

    } catch (err) {

        console.error(err);
        alert("Não foi possível conectar ao servidor.");
    }
}


/* ================= CADASTRO ================= */
async function register() {

    const nome = document.getElementById("nome").value.trim();

    const email = document.getElementById("emailReg").value.trim();
    const email2 = document.getElementById("emailReg2").value.trim();

    const senha = document.getElementById("senhaReg").value;
    const senha2 = document.getElementById("senhaReg2").value;

    const cidade = document.getElementById("cidade").value.trim();
    const telefone = document.getElementById("telefone").value.trim();

    if (!nome || !email || !senha) {
        alert("Preencha os campos obrigatórios.");
        return;
    }

    if (email !== email2) {
        alert("Emails não coincidem");
        return;
    }

    if (senha !== senha2) {
        alert("Senhas não coincidem");
        return;
    }

    try {

        const res = await fetch(`${API}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome,
                email,
                senha,
                cidade,
                telefone
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Erro ao criar conta");
            return;
        }

        alert("Conta criada com sucesso!");

        document.getElementById("nome").value = "";
        document.getElementById("emailReg").value = "";
        document.getElementById("emailReg2").value = "";
        document.getElementById("senhaReg").value = "";
        document.getElementById("senhaReg2").value = "";
        document.getElementById("cidade").value = "";
        document.getElementById("telefone").value = "";

    } catch (err) {

        console.error(err);
        alert("Não foi possível conectar ao servidor.");
    }
}