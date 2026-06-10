async function carregarEquipamentos() {

    const resposta =
        await fetch(
            'http://localhost:3000/equipamentos'
        );

    const equipamentos =
        await resposta.json();

    const container =
        document.getElementById(
            'equipamentosContainer'
        );

    container.innerHTML = '';

    equipamentos.forEach(item => {

        container.innerHTML += `
            <div class="card">

                <img
                    src="${item.imagem}"
                    alt="${item.titulo}"
                >

                <h3>${item.titulo}</h3>

                <p>${item.descricao}</p>

                <span>
                    R$ ${item.preco}
                </span>

            </div>
        `;
    });

}

carregarEquipamentos();