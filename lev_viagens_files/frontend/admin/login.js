const API =
    location.hostname === "localhost"
        ? "http://localhost:3000/api"
        : "https://lev-viagem.onrender.com/api";


async function loginAdmin() {

    const usuario =
        document.getElementById("usuario").value;

    const senha =
        document.getElementById("senha").value;

    const res = await fetch(
        API + "/admin/login",
        {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                usuario,
                senha
            })
        }
    );

    const data = await res.json();

    if(!res.ok){
        alert(data.error || "Erro");
        return;
    }

    localStorage.setItem(
        "adminLogado",
        "true"
    );

    window.location.href = "index.html";
}