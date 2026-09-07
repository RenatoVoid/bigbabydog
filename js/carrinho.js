// ============================================================
// CARRINHO.JS - Gestão do carrinho (localStorage)
// ============================================================

class Carrinho {
    constructor() {
        this.itens = JSON.parse(localStorage.getItem('bbd_carrinho') || '[]');
        this.atualizarUI();
        console.log('🛒 Carrinho inicializado com', this.itens.length, 'itens');
    }

    salvar() {
        localStorage.setItem('bbd_carrinho', JSON.stringify(this.itens));
        this.atualizarUI();
        console.log('💾 Carrinho salvo:', this.itens);
    }

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
                imagem: produto.imagem,
                tamanho: tamanho,
                quantidade: quantidade
            });
        }
        this.salvar();
        this.abrir();
        mostrarToast(`${produto.nome} adicionado ao carrinho!`);
    }

    remover(indice) {
        this.itens.splice(indice, 1);
        this.salvar();
    }

    alterarQuantidade(indice, novaQtd) {
        if (novaQtd < 1) {
            this.remover(indice);
            return;
        }
        this.itens[indice].quantidade = novaQtd;
        this.salvar();
    }

    calcularSubtotal() {
        return this.itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    }

    calcularTotalItens() {
        return this.itens.reduce((total, item) => total + item.quantidade, 0);
    }

    limpar() {
        this.itens = [];
        this.salvar();
    }

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

    fechar() {
        const overlay = document.getElementById('cartOverlay');
        const sidebar = document.getElementById('cartSidebar');
        if (overlay && sidebar) {
            overlay.classList.remove('open');
            sidebar.classList.remove('open');
            document.body.style.overflow = '';
        }
    }

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

    atualizarUI() {
        this.renderizarItens();
        atualizarContadorCarrinho();
    }
}

// ---------- FUNÇÕES AUXILIARES ----------
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}
window.formatarMoeda = formatarMoeda;

function mostrarToast(mensagem) {
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = mensagem;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

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

function irParaCheckout() {
    if (window.carrinho.itens.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    window.carrinho.fechar();
    window.location.href = 'checkout.html';
}
window.irParaCheckout = irParaCheckout;

function atualizarContadorCarrinho() {
    const contador = document.getElementById('cartCount');
    if (!contador) return;

    const total = window.carrinho ? window.carrinho.calcularTotalItens() : 0;
    contador.textContent = total;
    contador.style.display = total > 0 ? 'flex' : 'none';
    contador.classList.add('pulse');
    setTimeout(() => contador.classList.remove('pulse'), 400);
}

// ---------- FUNÇÃO ADICIONAR AO CARRINHO (GLOBAL) ----------
async function adicionarAoCarrinho(produtoId, tamanho) {
    if (!tamanho) {
        alert('Por favor, selecione um tamanho!');
        return;
    }

    if (!window.carrinho) {
        console.error('Carrinho não inicializado');
        alert('Erro ao adicionar ao carrinho. Tente novamente.');
        return;
    }

    const { data: produto, error } = await window.supabase
        .from('produtos')
        .select('*')
        .eq('id', produtoId)
        .single();

    if (error || !produto) {
        alert('Produto não encontrado!');
        return;
    }

    window.carrinho.adicionar(produto, tamanho);
}
// 🔥 EXPÕE A FUNÇÃO GLOBALMENTE
window.adicionarAoCarrinho = adicionarAoCarrinho;

// ---------- INICIALIZAÇÃO IMEDIATA ----------
injetarModalCarrinho();
window.carrinho = new Carrinho();
atualizarContadorCarrinho();

console.log('✅ Carrinho e função adicionarAoCarrinho prontos!');