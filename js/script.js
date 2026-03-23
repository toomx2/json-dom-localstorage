// --- 1. ESTADO GLOBAL ---
let listaDePedidos = JSON.parse(localStorage.getItem("pedidos_confeitaria")) || [];
let itensDoPedidoAtual = [];

// Elementos do DOM
const inputNomeCliente = document.getElementById("nome-cliente");
const inputItemNome = document.getElementById("item-nome");
const inputItemQtd = document.getElementById("item-qtd");
const inputItemPreco = document.getElementById("item-preco");
const listaTempUi = document.getElementById("lista-itens-temporaria");
const containerPedidos = document.getElementById("container-pedidos");

// --- 2. FUNÇÕES DE APOIO ---

function salvarDados() {
    localStorage.setItem("pedidos_confeitaria", JSON.stringify(listaDePedidos));
}

function atualizarPainelFinanceiro() {
    const displayValor = document.getElementById("faturamento-valor");
    const displayQtd = document.getElementById("qtd-pedidos");

    if (!displayValor || !displayQtd) return;

    const totalSoma = listaDePedidos.reduce((acc, pedido) => {
        return acc + (parseFloat(pedido.totalCalculado) || 0);
    }, 0);

    displayValor.textContent = totalSoma.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    displayQtd.textContent = `${listaDePedidos.length} pedidos realizados`;
}

function renderizar() {
    if (!containerPedidos) return;
    
    containerPedidos.innerHTML = "";

    // Invertemos a ordem (.reverse) para o pedido mais recente aparecer no topo
    const pedidosExibicao = [...listaDePedidos].reverse();

    pedidosExibicao.forEach(pedido => {
        const div = document.createElement("div");
        div.className = "card-pedido";
        
        // Criamos a lista de produtos em formato de texto
        const listaProdutosHTML = pedido.itens.map(item => 
            `<li>• ${item.quantidade}x ${item.produto} (R$ ${item.subtotal.toFixed(2)})</li>`
        ).join("");

        div.innerHTML = `
            <div class="card-header">
                <strong>Pedido: ${pedido.identificadorPedido}</strong>
                <span class="data-pedido">${new Date().toLocaleDateString()}</span>
            </div>
            <div class="card-body">
                <span>👤 <b>Cliente:</b> ${pedido.cliente.nome}</span>
                <ul class="itens-venda">
                    ${listaProdutosHTML}
                </ul>
            </div>
            <div class="card-footer">
                <span>Total: <b>R$ ${pedido.totalCalculado.toFixed(2)}</b></span>
            </div>
        `;
        containerPedidos.appendChild(div);
    });

    atualizarPainelFinanceiro();
}

function atualizarListaTemporaria() {
    if (!listaTempUi) return;
    listaTempUi.innerHTML = "";
    itensDoPedidoAtual.forEach(item => {
        listaTempUi.innerHTML += `<li>✅ ${item.quantidade}x ${item.produto} - R$ ${item.subtotal.toFixed(2)}</li>`;
    });
}

// --- 3. EVENTOS ---

// Adicionar Item ao Pedido Atual
document.getElementById("btn-add-item").addEventListener("click", () => {
    const nome = inputItemNome.value;
    const qtd = parseInt(inputItemQtd.value);
    const preco = parseFloat(inputItemPreco.value);

    if (!nome || isNaN(qtd) || isNaN(preco)) {
        alert("Preencha todos os campos do produto!");
        return;
    }

    itensDoPedidoAtual.push({
        produto: nome,
        quantidade: qtd,
        subtotal: qtd * preco
    });

    atualizarListaTemporaria();
    
    inputItemNome.value = "";
    inputItemPreco.value = "";
    inputItemNome.focus();
});

// Finalizar o Pedido Completo
document.getElementById("btn-finalizar-pedido").addEventListener("click", () => {
    const nomeCliente = inputNomeCliente.value;

    if (!nomeCliente || itensDoPedidoAtual.length === 0) {
        alert("Preencha o nome do cliente e adicione pelo menos um item!");
        return;
    }

    const totalDoPedido = itensDoPedidoAtual.reduce((acc, item) => acc + item.subtotal, 0);

    const pedidoCompleto = {
        identificadorPedido: "PED-" + Math.floor(Math.random() * 9000 + 1000),
        cliente: { nome: nomeCliente },
        itens: [...itensDoPedidoAtual], 
        totalCalculado: totalDoPedido
    };

    listaDePedidos.push(pedidoCompleto);
    salvarDados();
    renderizar();

    // Limpeza após finalizar
    itensDoPedidoAtual = [];
    inputNomeCliente.value = "";
    listaTempUi.innerHTML = "";
    alert("Pedido registrado com sucesso!");
});

// Botão para limpar histórico (Extra)
document.getElementById("btn-limpar-tudo").addEventListener("click", () => {
    if(confirm("Deseja apagar todos os registros?")) {
        listaDePedidos = [];
        salvarDados();
        renderizar();
    }
});

// Inicialização
renderizar();