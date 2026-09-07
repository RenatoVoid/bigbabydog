// ============================================================
// LOJA.JS - Catálogo com busca e filtros (Supabase)
// ============================================================
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://lekzyptgypjkwpxuruel.supabase.co';
const supabaseKey = 'sb_publishable_9z5CfPvDD0XEK9RglCOh5w_VE_F9D4H';
const supabase = createClient(supabaseUrl, supabaseKey);

let todosProdutos = [];
let produtosFiltrados = [];
let categoriaAtual = 'todos';
let termoBusca = '';

// Elementos DOM
const grid = document.getElementById('catalogoGrid');
const buscaInput = document.getElementById('buscaInput');
const filtros = document.querySelectorAll('.filtro-btn');
const loading = document.getElementById('loadingProdutos');

// Função para buscar produtos do Supabase
async function carregarProdutos() {
    if (loading) loading.style.display = 'block';

    const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('id', { ascending: true });

    if (loading) loading.style.display = 'none';

    if (error) {
        console.error('Erro ao carregar produtos:', error);
        grid.innerHTML = `<p class="empty-state">Erro ao carregar produtos. Tente novamente.</p>`;
        return;
    }

    todosProdutos = data || [];
    produtosFiltrados = [...todosProdutos];
    renderizarProdutos();
}

// Renderiza os produtos no grid
function renderizarProdutos() {
    if (!grid) return;

    if (produtosFiltrados.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column:1/-1; text-align:center; padding:40px;">
                <i class="fas fa-box-open" style="font-size:2rem; color:var(--text-muted);"></i>
                <p style="margin-top:10px; color:var(--text-muted);">Nenhum produto encontrado.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = produtosFiltrados.map(produto => {
        const preco = Number(produto.preco).toFixed(2).replace('.', ',');
        const precoAntigo = produto.preco_antigo ? Number(produto.preco_antigo).toFixed(2).replace('.', ',') : null;
        const imagem = produto.imagem || `https://placehold.co/600x800/e0ddd6/1a1a2e?text=${encodeURIComponent(produto.nome)}`;

        return `
            <div class="produto-card fade-in" onclick="window.location.href='produto.html?id=${produto.id}'">
                ${produto.novo ? '<span class="card-badge badge-novo">Novo</span>' : ''}
                ${precoAntigo ? '<span class="card-badge badge-promo">Promo</span>' : ''}
                <img src="${imagem}" alt="${produto.nome}" class="card-img" loading="lazy" 
                     onerror="this.onerror=null; this.src='https://placehold.co/600x800/e0ddd6/1a1a2e?text=${encodeURIComponent(produto.nome)}'">
                <div class="card-body">
                    <div class="card-categoria">${produto.categoria}</div>
                    <div class="card-nome">${produto.nome}</div>
                    <div class="card-preco">
                        <span class="card-preco-atual">R$ ${preco}</span>
                        ${precoAntigo ? `<span class="card-preco-antigo">R$ ${precoAntigo}</span>` : ''}
                    </div>
                    <button class="btn-add-cart" onclick="event.stopPropagation(); window.location.href='produto.html?id=${produto.id}'">
                        Ver detalhes
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Aplica os filtros (categoria + busca)
function aplicarFiltros() {
    let filtrados = [...todosProdutos];

    // Filtro por categoria
    if (categoriaAtual !== 'todos') {
        filtrados = filtrados.filter(p => p.categoria === categoriaAtual);
    }

    // Filtro por busca (nome ou categoria)
    if (termoBusca.trim() !== '') {
        const busca = termoBusca.toLowerCase().trim();
        filtrados = filtrados.filter(p =>
            p.nome.toLowerCase().includes(busca) ||
            p.categoria.toLowerCase().includes(busca) ||
            p.descricao?.toLowerCase().includes(busca)
        );
    }

    produtosFiltrados = filtrados;
    renderizarProdutos();
}

// Event listeners
function configurarEventos() {
    // Busca com debounce
    if (buscaInput) {
        buscaInput.addEventListener('input', (e) => {
            termoBusca = e.target.value;
            aplicarFiltros();
        });
    }

    // Filtros por categoria
    filtros.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active de todos
            filtros.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            categoriaAtual = btn.dataset.categoria || 'todos';
            aplicarFiltros();
        });
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
    configurarEventos();
});