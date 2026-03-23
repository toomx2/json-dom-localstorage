// --- ESTADO DA APLICAÇÃO ---
let listaDePedidos = JSON.parse(localStorage.getItem("pedidos_confeitaria")) || [];

// Seleção de Elementos do DOM
const container = document.getElementById("container-pedidos");
const faturamentoDisplay = document.getElementById("faturamento-valor");
const inputBusca = document.getElementById("input-busca");

// --- FUNÇÕES DE LÓGICA ---

function salvarDados() {
    localStorage.setItem("pedidos_confeitaria", JSON.stringify(listaDePedidos));
}

function calcularFaturamento() {
    const total = listaDePedidos.reduce((acc, p) => acc + p.totalCalculado, 0);
    faturamentoDisplay.textContent = total.toFixed(2);
}

function removerPedido(id) {
    listaDePedidos = listaDePedidos.filter(p => p.identificadorPedido !== id);
    salvarDados();
    renderizar();
}

// --- FUNÇÕES DE INTERFACE (DOM) ---

function renderizar(lista = listaDePedidos) {
    container.innerHTML = "";
    
    if (lista.length === 0) {
        container.innerHTML = "<p style='text-align:center; color:#999;'>Nenhum pedido por aqui...</p>";
    }

    lista.forEach(pedido => {
        const card = document.createElement("div");
        card.className = "card-pedido";
        card.innerHTML = `
            <strong>#${pedido.identificadorPedido}</strong><br>
            <span>👤 ${pedido.cliente.nome}</span><br>
            <span>💰 R$ ${pedido.totalCalculado.toFixed(2)}</span>
            <button class="btn-entregue" onclick="removerPedido('${pedido.identificadorPedido}')">Entregue ✓</button>
        `;
        container.appendChild(card);
    });

    calcularFaturamento();
}

// --- EVENTOS ---

document.getElementById("btn-gerar-pedido").addEventListener("click", () => {
    const nomes = ["Ana", "Bruno", "Carla", "Diego", "Elena"];
    const novoPedido = {
        identificadorPedido: "PED-" + Math.floor(Math.random() * 9000 + 1000),
        cliente: { nome: nomes[Math.floor(Math.random() * nomes.length)] },
        totalCalculado: Math.random() * 150 + 20
    };

    listaDePedidos.push(novoPedido);
    salvarDados();
    renderizar();
});

document.getElementById("btn-limpar-tudo").addEventListener("click", () => {
    if(confirm("Deseja apagar todo o histórico?")) {
        listaDePedidos = [];
        salvarDados();
        renderizar();
    }
});

inputBusca.addEventListener("input", (e) => {
    const termo = e.target.value.toLowerCase();
    const filtrados = listaDePedidos.filter(p => 
        p.cliente.nome.toLowerCase().includes(termo)
    );
    renderizar(filtrados);
});

// Inicialização
renderizar();