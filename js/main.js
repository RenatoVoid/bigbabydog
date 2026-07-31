// ============================================================
// MAIN.JS - Catálogo de produtos da BIGBABYDOG (Supabase)
// Seções: Destaques, Novidades e Categorias com "Ver mais"
// ============================================================
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://lekzyptgypjkwpxuruel.supabase.co';
const supabaseKey = 'sb_publishable_9z5CfPvDD0XEK9RglCOh5w_VE_F9D4H';
const supabase = createClient(supabaseUrl, supabaseKey);

const PRODUTOS_POR_VEZ = 4; // quantos mostrar antes do "Ver mais"

document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
});

async function carregarProdutos() {
    try {
        const { data: produtos, error } = await supabase
            .from('produtos')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;

        if (!produtos || produtos.length === 0) {
            document.querySelectorAll('.produtos-grid').forEach(grid => {
                grid.innerHTML = '<p class="empty-section">Nenhum produto disponível.</p>';
            });
            return;
        }

        // Destaques e Novidades mostram todos
        preencherGridCompleto('grid-destaques', produtos.filter(p => p.destaque));
        preencherGridCompleto('grid-novidades', produtos.filter(p => p.novo));

        // Categorias com "Ver mais"
        configurarCategoria('camiseta', produtos.filter(p => p.categoria === 'camiseta'));
        configurarCategoria('calca', produtos.filter(p => p.categoria === 'calca'));
        configurarCategoria('moletom', produtos.filter(p => p.categoria === 'moletom'));
        configurarCategoria('tenis', produtos.filter(p => p.categoria === 'tenis'));
        configurarCategoria('acessorio', produtos.filter(p => p.categoria === 'acessorio'));

    } catch (erro) {
        console.error('Erro ao carregar produtos:', erro.message);
        document.querySelectorAll('.produtos-grid').forEach(grid => {
            grid.innerHTML = '<p class="empty-section">Erro ao carregar.</p>';
        });
    }
}

// ---------- CRIAÇÃO DE CARD ----------
function criarCard(produto) {
    const imagem = produto.imagem || `https://placehold.co/600x800/1a1a2e/b366ff?text=${encodeURIComponent(produto.nome)}`;
    const precoAtual = Number(produto.preco).toFixed(2).replace('.', ',');
    const precoAntigoHtml = (produto.preco_antigo && produto.preco_antigo > 0)
        ? `<span class="card-preco-antigo">R$ ${Number(produto.preco_antigo).toFixed(2).replace('.', ',')}</span>`
        : '';

    let badgesHtml = '';
    if (produto.novo) badgesHtml += '<span class="card-badge badge-novo">NOVO</span>';
    if (produto.destaque) badgesHtml += '<span class="card-badge badge-promo">DESTAQUE</span>';

    const card = document.createElement('div');
    card.className = 'produto-card';
    card.innerHTML = `
        ${badgesHtml}
        <img src="${imagem}" alt="${produto.nome}" class="card-img" loading="lazy" />
        <div class="card-body">
            <div class="card-categoria">${produto.categoria || 'Geral'}</div>
            <h3 class="card-nome">${produto.nome}</h3>
            <div class="card-preco">
                <span class="card-preco-atual">R$ ${precoAtual}</span>
                ${precoAntigoHtml}
            </div>
            <button class="btn-add-cart" data-id="${produto.id}">Ver detalhes</button>
        </div>
    `;

    card.querySelector('.btn-add-cart').addEventListener('click', (e) => {
        e.stopPropagation();
        window.location.href = `produto.html?id=${produto.id}`;
    });

    return card;
}

// ---------- PREENCHIMENTO COMPLETO (DESTAQUES / NOVIDADES) ----------
function preencherGridCompleto(gridId, lista) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = '';
    if (lista.length === 0) {
        grid.innerHTML = '<p class="empty-section">Nenhum produto nesta seção.</p>';
        return;
    }
    lista.forEach(p => grid.appendChild(criarCard(p)));
}

// ---------- CATEGORIA COM "VER MAIS" ----------
function configurarCategoria(categoria, lista) {
    const mapa = {
        camiseta: 'grid-camisetas',
        calca: 'grid-calcas',
        moletom: 'grid-moletons',
        tenis: 'grid-tenis',
        acessorio: 'grid-acessorios'
    };
    const gridId = mapa[categoria];
    const grid = document.getElementById(gridId);
    const btnVerMais = document.querySelector(`.btn-ver-mais[data-categoria="${categoria}"]`);

    if (!grid) return;

    // Limpa grid e botão
    grid.innerHTML = '';
    if (btnVerMais) btnVerMais.style.display = 'none';

    if (lista.length === 0) {
        grid.innerHTML = '<p class="empty-section">Nenhum produto nesta categoria.</p>';
        return;
    }

    // Se tem poucos, mostra todos e esconde botão
    if (lista.length <= PRODUTOS_POR_VEZ) {
        lista.forEach(p => grid.appendChild(criarCard(p)));
        return;
    }

    // Mostra primeiros 4
    const visiveis = lista.slice(0, PRODUTOS_POR_VEZ);
    const ocultos = lista.slice(PRODUTOS_POR_VEZ);
    visiveis.forEach(p => grid.appendChild(criarCard(p)));

    // Exibe botão "Ver mais"
    if (btnVerMais) {
        btnVerMais.style.display = 'block';
        btnVerMais.onclick = () => {
            ocultos.forEach(p => grid.appendChild(criarCard(p)));
            btnVerMais.style.display = 'none';
        };
    }
}