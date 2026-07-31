// ============================================================
// CARRINHO.JS - Gestão do carrinho de compras (localStorage)
// ============================================================

/**
 * Classe Carrinho - gerencia itens, localStorage e UI do modal
 */
class Carrinho {
    constructor() {
        this.itens = JSON.parse(localStorage.getItem('bbd_carrinho') || '[]');
        this.inicializar();
    }
    
    /** Salva o carrinho no localStorage e atualiza UI */
    salvar() {
        localStorage.setItem('bbd_carrinho', JSON.stringify(this.itens));
        this.atualizarUI();
    }
    
    /** Adiciona um produto ao carrinho */
    adicionar(produto, tamanho, quantidade = 1) {
        const existente = this.itens.find(
            item => item.id === produto.id && item.tamanho === tamanho
        );
        
        if (existente) {
            existente.quantidade += quantidade;
        } else {
            this.itens.push({
                id: produto.id,
                nome: produto.nome,
                preco: produto.preco,
                imagem: Array.isArray(produto.imagens) ? produto.imagens[0] : produto.imagem,
                tamanho: tamanho,
                quantidade: quantidade
            });
        }
        
        this.salvar();
        this.abrir();
        mostrarToast(`${produto.nome} adicionado ao carrinho!`);
    }
    
    /** Remove um item pelo índice */
    remover(indice) {
        this.itens.splice(indice, 1);
        this.salvar();
    }
    
    /** Altera a quantidade de um item */
    alterarQuantidade(indice, novaQtd) {
        if (novaQtd < 1) {
            this.remover(indice);
            return;
        }
        this.itens[indice].quantidade = novaQtd;
        this.salvar();
    }
    
    /** Calcula o subtotal */
    calcularSubtotal() {
        return this.itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    }
    
    /** Calcula o total de itens (soma das quantidades) */
    calcularTotalItens() {
        return this.itens.reduce((total, item) => total + item.quantidade, 0);
    }
    
    /** Limpa o carrinho completamente */
    limpar() {
        this.itens = [];
        this.salvar();
    }
    
    /** Abre o modal do carrinho */
    abrir() {
        const overlay = document.getElementById('cartOverlay');
        const sidebar = document.getElementById('cartSidebar');
        if (overlay && sidebar) {
            overlay.classList.add('open');
            sidebar.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
        this.renderizarItens();
    }
    
    /** Fecha o modal do carrinho */
    fechar() {
        const overlay = document.getElementById('cartOverlay');
        const sidebar = document.getElementById('cartSidebar');
        if (overlay && sidebar) {
            overlay.classList.remove('open');
            sidebar.classList.remove('open');
            document.body.style.overflow = '';
        }
    }
    
    /** Renderiza os itens na sidebar */
    renderizarItens() {
        const container = document.getElementById('cartItemsContainer');
        if (!container) return;
        
        if (this.itens.length === 0) {
            container.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Seu carrinho está vazio</p>
                    <p style="font-size:0.8rem;color:var(--text-muted)">Adicione produtos para continuar</p>
                </div>`;
        } else {
            container.innerHTML = this.itens.map((item, index) => `
                <div class="cart-item">
                    <img src="${item.imagem}" alt="${item.nome}" class="cart-item-img">
                    <div class="cart-item-info">
                        <div class="cart-item-nome">${item.nome}</div>
                        <div class="cart-item-tamanho">Tamanho: ${item.tamanho}</div>
                        <div class="cart-item-preco">${formatarMoeda(item.preco)}</div>
                        <div class="cart-item-qtd">
                            <button onclick="window.carrinho.alterarQuantidade(${index}, ${item.quantidade - 1})">−</button>
                            <span>${item.quantidade}</span>
                            <button onclick="window.carrinho.alterarQuantidade(${index}, ${item.quantidade + 1})">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" onclick="window.carrinho.remover(${index})" title="Remover">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `).join('');
        }
        
        this.atualizarResumo();
    }
    
    /** Atualiza o resumo financeiro */
    atualizarResumo() {
        const subtotalEl = document.getElementById('cartSubtotal');
        const totalEl = document.getElementById('cartTotal');
        const freteEl = document.getElementById('cartFrete');
        
        if (!subtotalEl || !totalEl) return;
        
        const subtotal = this.calcularSubtotal();
        subtotalEl.textContent = formatarMoeda(subtotal);
        if (freteEl) freteEl.textContent = subtotal >= 250 ? 'GRÁTIS' : 'A combinar';
        totalEl.textContent = formatarMoeda(subtotal);
    }
    
    /** Atualiza o contador e o botão de finalizar */
    atualizarUI() {
        this.renderizarItens();
        atualizarContadorCarrinho();
    }
}

/** Injeta o HTML do modal do carrinho no body */
function injetarModalCarrinho() {
    if (document.getElementById('cartOverlay')) return;
    
    const modalHTML = `
        <div id="cartOverlay" class="cart-overlay"></div>
        <div id="cartSidebar" class="cart-sidebar">
            <div class="cart-header">
                <h3>🛒 Seu Carrinho</h3>
                <button class="cart-close" onclick="window.carrinho.fechar()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="cart-items" id="cartItemsContainer"></div>
            <div class="cart-footer" id="cartFooter">
                <div class="cart-resumo">
                    <div><span>Subtotal:</span> <span id="cartSubtotal">R$ 0,00</span></div>
                    <div><span>Frete:</span> <span id="cartFrete">A combinar</span></div>
                    <div class="cart-total"><span>TOTAL:</span> <span id="cartTotal">R$ 0,00</span></div>
                </div>
                <button class="btn-finalizar" onclick="irParaCheckout()" id="btnFinalizarCart">
                    FINALIZAR PEDIDO
                </button>
                <button class="btn-continuar" onclick="window.carrinho.fechar()">
                    CONTINUAR COMPRANDO
                </button>
            </div>
        </div>`;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    document.getElementById('cartOverlay').addEventListener('click', () => {
        window.carrinho.fechar();
    });
}

/** Redireciona para a página de checkout */
function irParaCheckout() {
    if (window.carrinho.itens.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    window.carrinho.fechar();
    window.location.href = 'checkout.html';
}

/** Atualiza o contador de itens no ícone do carrinho */
function atualizarContadorCarrinho() {
    const contador = document.getElementById('cartCount');
    if (!contador) return;
    
    const total = window.carrinho ? window.carrinho.calcularTotalItens() : 0;
    contador.textContent = total;
    contador.style.display = total > 0 ? 'flex' : 'none';
    contador.classList.add('pulse');
    setTimeout(() => contador.classList.remove('pulse'), 400);
}

/** Função global para adicionar ao carrinho a partir de qualquer página */
async function adicionarAoCarrinho(produtoId, tamanho) {
    if (!tamanho) {
        alert('Por favor, selecione um tamanho!');
        return;
    }
    
    const produto = await obterProdutoPorId(produtoId);
    if (!produto) {
        alert('Produto não encontrado!');
        return;
    }
    
    window.carrinho.adicionar(produto, tamanho);
}

// Inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    injetarModalCarrinho();
    window.carrinho = new Carrinho();
    atualizarContadorCarrinho();
});

window.irParaCheckout = irParaCheckout;
window.adicionarAoCarrinho = adicionarAoCarrinho;