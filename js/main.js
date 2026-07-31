// ============================================================
// MAIN.JS - Catálogo de produtos da BIGBABYDOG (Supabase)
// ============================================================
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// ---------- CONEXÃO COM O SUPABASE ----------
const supabaseUrl = 'https://lekzyptgypjkwpxuruel.supabase.co';
const supabaseKey = 'sb_publishable_9z5CfPvDD0XEK9RglCOh5w_VE_F9D4H';
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Busca todos os produtos no banco e inicia a renderização
 */
async function carregarProdutos() {
    try {
        // Consulta a tabela 'produtos' ordenada por ID
        const { data: produtos, error } = await supabase
            .from('produtos')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            throw error;
        }

        // Se houver dados, renderiza; senão, mostra mensagem
        if (produtos && produtos.length > 0) {
            renderizarProdutos(produtos);
        } else {
            const container = document.getElementById('lista-produtos');
            if (container) {
                container.innerHTML = `<p class="text-center">Nenhum produto disponível no momento.</p>`;
            }
        }
    } catch (erro) {
        console.error('Erro ao carregar produtos:', erro.message);
        const container = document.getElementById('lista-produtos');
        if (container) {
            container.innerHTML = `<p class="text-center">Erro ao carregar produtos. Tente novamente.</p>`;
        }
    }
}

/**
 * Cria os cards HTML e insere no container #lista-produtos
 * @param {Array} produtos - Lista de objetos retornados do Supabase
 */
function renderizarProdutos(produtos) {
    const container = document.getElementById('lista-produtos');
    if (!container) return;

    // Limpa o container
    container.innerHTML = '';

    // Para cada produto, monta o card com as classes definidas no CSS
    produtos.forEach(p => {
        // Define a imagem (usa placeholder se não existir)
        const imagem = p.imagem || `https://placehold.co/600x800/1a1a2e/b366ff?text=${encodeURIComponent(p.nome)}`;
        
        // Formata os preços
        const precoAtual = Number(p.preco).toFixed(2).replace('.', ',');
        const precoAntigoHtml = p.preco_antigo && p.preco_antigo > 0
            ? `<span class="card-preco-antigo">R$ ${Number(p.preco_antigo).toFixed(2).replace('.', ',')}</span>`
            : '';

        // Cria o elemento do card usando a estrutura EXATA do CSS
        const card = document.createElement('div');
        card.className = 'produto-card';

        card.innerHTML = `
            <img src="${imagem}" alt="${p.nome}" class="card-img" />
            <div class="card-body">
                <div class="card-categoria">${p.categoria || 'Geral'}</div>
                <h3 class="card-nome">${p.nome}</h3>
                <div class="card-preco">
                    <span class="card-preco-atual">R$ ${precoAtual}</span>
                    ${precoAntigoHtml}
                </div>
                <button class="btn-add-cart" data-id="${p.id}">Ver detalhes</button>
            </div>
        `;

        // Adiciona evento de clique para redirecionar à página do produto
        const botao = card.querySelector('.btn-add-cart');
        botao.addEventListener('click', () => {
            window.location.href = `produto.html?id=${p.id}`;
        });

        container.appendChild(card);
    });
}

// Inicializa o carregamento ao abrir a página da loja
carregarProdutos();