// ============================================================
// LOJA.JS - Catálogo com busca e filtros (versão estável)
// ============================================================

console.log('🔥 loja.js carregado (usando window.supabase)');

const supabase = window.supabase;

if (!supabase) {
    console.error('❌ window.supabase NÃO encontrado!');
} else {
    console.log('✅ window.supabase encontrado');
}

let todosProdutos = [];
let produtosFiltrados = [];
let categoriaAtual = 'todos';
let termoBusca = '';

const grid = document.getElementById('catalogoGrid');
const buscaInput = document.getElementById('buscaInput');
const filtros = document.querySelectorAll('.filtro-btn');

console.log('🔍 Elementos DOM: grid=', !!grid, 'buscaInput=', !!buscaInput, 'filtros=', filtros.length);

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

function getImagem(produto) {
    return produto.imagem || `https://placehold.co/600x800/e0ddd6/1a1a2e?text=${encodeURIComponent(produto.nome)}`;
}

async function carregarProdutos() {
    console.log('🚀 carregarProdutos() chamado!');
    try {
        console.log('📡 Fazendo query no Supabase...');
        const { data, error } = await supabase
            .from('produtos')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('❌ Erro na query:', error);
            grid.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:var(--text-muted);">Erro ao carregar produtos.</p>`;
            return;
        }

        console.log('📦 Dados recebidos:', data);
        console.log('📦 Quantidade:', data?.length || 0);
        todosProdutos = data || [];
        produtosFiltrados = [...todosProdutos];
        renderizarProdutos();
    } catch (err) {
        console.error('❌ Erro inesperado:', err);
        grid.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:var(--text-muted);">Erro ao carregar produtos.</p>`;
    }
}

function renderizarProdutos() {
    console.log('🎨 renderizarProdutos() chamado, produtos:', produtosFiltrados.length);
    if (!grid) {
        console.error('❌ grid não encontrado!');
        return;
    }

    if (produtosFiltrados.length === 0) {
        grid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-muted);">
                <i class="fas fa-box-open" style="font-size:2rem; display:block; margin-bottom:10px;"></i>
                Nenhum produto encontrado.
            </div>
        `;
        return;
    }

    grid.innerHTML = produtosFiltrados.map(produto => {
        const img = getImagem(produto);
        const preco = formatarMoeda(produto.preco);
        const precoAntigo = produto.preco_antigo ? formatarMoeda(produto.preco_antigo) : null;
        return `
            <div class="produto-card fade-in" onclick="window.location.href='produto.html?id=${produto.id}'">
                ${produto.novo ? '<span class="card-badge badge-novo">Novo</span>' : ''}
                ${precoAntigo ? '<span class="card-badge badge-promo">Promo</span>' : ''}
                <img src="${img}" alt="${produto.nome}" class="card-img" loading="lazy"
                     onerror="this.onerror=null; this.src='https://placehold.co/600x800/e0ddd6/1a1a2e?text=Erro'">
                <div class="card-body">
                    <div class="card-categoria">${produto.categoria}</div>
                    <div class="card-nome">${produto.nome}</div>
                    <div class="card-preco">
                        <span class="card-preco-atual">${preco}</span>
                        ${precoAntigo ? `<span class="card-preco-antigo">${precoAntigo}</span>` : ''}
                    </div>
                    <button class="btn-add-cart" onclick="event.stopPropagation(); window.location.href='produto.html?id=${produto.id}'">Ver detalhes</button>
                </div>
            </div>
        `;
    }).join('');
}

function aplicarFiltros() {
    let filtrados = [...todosProdutos];

    if (categoriaAtual !== 'todos') {
        filtrados = filtrados.filter(p => p.categoria === categoriaAtual);
    }

    if (termoBusca.trim() !== '') {
        const busca = termoBusca.toLowerCase().trim();
        filtrados = filtrados.filter(p =>
            p.nome.toLowerCase().includes(busca) ||
            (p.descricao && p.descricao.toLowerCase().includes(busca))
        );
    }

    produtosFiltrados = filtrados;
    renderizarProdutos();
}

function configurarEventos() {
    if (buscaInput) {
        buscaInput.addEventListener('input', (e) => {
            termoBusca = e.target.value;
            aplicarFiltros();
        });
    }

    filtros.forEach(btn => {
        btn.addEventListener('click', () => {
            filtros.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            categoriaAtual = btn.dataset.categoria || 'todos';
            aplicarFiltros();
        });
    });
}

// ========== INICIALIZAÇÃO ==========
console.log('⏳ Chamando carregarProdutos()...');
carregarProdutos();
configurarEventos();
console.log('✅ Inicialização completa.');