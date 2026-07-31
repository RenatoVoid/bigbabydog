// ============================================================
// ADMIN.JS - Painel administrativo protegido por senha
// ============================================================

const ADMIN_SENHA = 'admin123';
let adminAutenticado = false;
let produtosCustomizados = JSON.parse(localStorage.getItem('bbd_produtos_custom') || '[]');

/**
 * Inicializa o painel admin
 */
function initAdmin() {
    // Se já estiver autenticado nesta sessão
    if (sessionStorage.getItem('bbd_admin_auth') === 'true') {
        adminAutenticado = true;
        mostrarPainel();
    } else {
        mostrarLogin();
    }
}

/**
 * Mostra a tela de login
 */
function mostrarLogin() {
    const overlay = document.getElementById('adminLoginOverlay');
    if (overlay) overlay.style.display = 'flex';
}

/**
 * Verifica a senha do admin
 */
function verificarSenha() {
    const input = document.getElementById('adminSenha');
    const senha = input.value;
    
    if (senha === ADMIN_SENHA) {
        adminAutenticado = true;
        sessionStorage.setItem('bbd_admin_auth', 'true');
        document.getElementById('adminLoginOverlay').style.display = 'none';
        mostrarPainel();
    } else {
        alert('Senha incorreta! Tente novamente.');
        input.value = '';
        input.focus();
    }
}

/**
 * Mostra o painel admin após autenticação
 */
function mostrarPainel() {
    const painel = document.getElementById('adminPanel');
    if (painel) painel.style.display = 'block';
    
    carregarProdutosAdmin();
    carregarPedidosAdmin();
    configurarTabs();
    configurarFormProduto();
}

/**
 * Configura as abas do painel
 */
function configurarTabs() {
    const tabs = document.querySelectorAll('.admin-tab');
    const sections = document.querySelectorAll('.admin-section');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const target = tab.dataset.tab;
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(`section-${target}`).classList.add('active');
        });
    });
}

/**
 * Carrega e exibe a lista de produtos no admin
 */
function carregarProdutosAdmin() {
    const tbody = document.getElementById('adminProdutosTbody');
    if (!tbody) return;
    
    const produtos = obterProdutos();
    
    tbody.innerHTML = produtos.map(p => `
        <tr>
            <td>${p.id}</td>
            <td><img src="${p.imagens[0]}" alt="${p.nome}" style="width:40px;height:50px;object-fit:cover;border-radius:4px"></td>
            <td>${p.nome}</td>
            <td>${p.categoria}</td>
            <td>${formatarMoeda(p.preco)}</td>
            <td>
                <button class="btn-sm" onclick="editarProduto(${p.id})">✏️ Editar</button>
                <button class="btn-sm danger" onclick="removerProduto(${p.id})">🗑️ Remover</button>
            </td>
        </tr>
    `).join('');
}

/**
 * Configura o formulário de adicionar/editar produto
 */
function configurarFormProduto() {
    const form = document.getElementById('formProduto');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = parseInt(document.getElementById('prodId').value) || Date.now();
        const produto = {
            id: id,
            nome: document.getElementById('prodNome').value,
            categoria: document.getElementById('prodCategoria').value,
            preco: parseFloat(document.getElementById('prodPreco').value),
            precoAntigo: parseFloat(document.getElementById('prodPrecoAntigo').value) || null,
            descricao: document.getElementById('prodDescricao').value,
            imagens: [
                document.getElementById('prodImg1').value || 'https://placehold.co/600x800/1a1a2e/b366ff?text=Produto',
                document.getElementById('prodImg2').value || 'https://placehold.co/600x800/1a1a2e/b366ff?text=Produto',
                document.getElementById('prodImg3').value || 'https://placehold.co/600x800/1a1a2e/b366ff?text=Produto'
            ],
            tamanhos: document.getElementById('prodTamanhos').value.split(',').map(t => t.trim()),
            destaque: document.getElementById('prodDestaque').checked,
            novo: document.getElementById('prodNovo').checked
        };
        
        salvarProdutoCustomizado(produto);
        form.reset();
        document.getElementById('prodId').value = '';
        carregarProdutosAdmin();
        alert('Produto salvo com sucesso! ✅');
    });
}

/**
 * Salva um produto customizado (novo ou editado)
 */
function salvarProdutoCustomizado(produto) {
    // Remove versão anterior se existir
    produtosCustomizados = produtosCustomizados.filter(p => p.id !== produto.id);
    produtosCustomizados.push(produto);
    localStorage.setItem('bbd_produtos_custom', JSON.stringify(produtosCustomizados));
}

/**
 * Preenche o formulário para editar um produto existente
 */
function editarProduto(id) {
    const produtos = obterProdutos();
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;
    
    document.getElementById('prodId').value = produto.id;
    document.getElementById('prodNome').value = produto.nome;
    document.getElementById('prodCategoria').value = produto.categoria;
    document.getElementById('prodPreco').value = produto.preco;
    document.getElementById('prodPrecoAntigo').value = produto.precoAntigo || '';
    document.getElementById('prodDescricao').value = produto.descricao;
    document.getElementById('prodImg1').value = produto.imagens[0] || '';
    document.getElementById('prodImg2').value = produto.imagens[1] || '';
    document.getElementById('prodImg3').value = produto.imagens[2] || '';
    document.getElementById('prodTamanhos').value = produto.tamanhos.join(', ');
    document.getElementById('prodDestaque').checked = produto.destaque;
    document.getElementById('prodNovo').checked = produto.novo;
    
    // Scroll até o formulário
    document.getElementById('formProduto').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Remove um produto customizado (produtos originais não podem ser removidos, apenas ocultados)
 */
function removerProduto(id) {
    if (!confirm('Tem certeza que deseja remover este produto?')) return;
    
    // Adiciona à lista de removidos (para produtos originais) ou remove dos customizados
    if (id <= 10) {
        // Produto original - marca como inativo
        const produto = { id: id, ativo: false };
        salvarProdutoCustomizado(produto);
    } else {
        produtosCustomizados = produtosCustomizados.filter(p => p.id !== id);
        localStorage.setItem('bbd_produtos_custom', JSON.stringify(produtosCustomizados));
    }
    
    carregarProdutosAdmin();
}

/**
 * Carrega e exibe os pedidos recebidos
 */
function carregarPedidosAdmin() {
    const tbody = document.getElementById('adminPedidosTbody');
    if (!tbody) return;
    
    const pedidos = obterPedidos();
    
    if (pedidos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:30px;color:var(--text-muted)">Nenhum pedido recebido ainda.</td></tr>';
        return;
    }
    
    tbody.innerHTML = pedidos.map(p => {
        const data = new Date(p.data).toLocaleString('pt-BR');
        const itensResumo = p.itens.map(i => `${i.nome} (${i.tamanho}) x${i.quantidade}`).join(', ');
        
        return `
            <tr>
                <td><strong style="color:var(--neon)">${p.id}</strong></td>
                <td>${data}</td>
                <td>${p.cliente.nome}</td>
                <td title="${itensResumo}" style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${itensResumo}</td>
                <td>${formatarMoeda(p.subtotal)}</td>
            </tr>
        `;
    }).join('');
}

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', () => {
    initAdmin();
    
    // Evento de tecla Enter no campo de senha
    const senhaInput = document.getElementById('adminSenha');
    if (senhaInput) {
        senhaInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') verificarSenha();
        });
    }
});