// ============================================================
// PRODUTO.JS - Página individual do produto (Supabase)
// ============================================================

console.log('🔥 produto.js carregado!');

// ---------- ELEMENTOS DOM (com verificação) ----------
function getElement(id) {
    const el = document.getElementById(id);
    if (!el) console.warn(`⚠️ Elemento não encontrado: #${id}`);
    return el;
}

const loadingEl = getElement('loadingProduto');
const erroEl = getElement('erroProduto');
const detalheEl = getElement('detalheProduto');

const galeriaPrincipal = getElement('galeriaPrincipal');
const galeriaThumbs = getElement('galeriaThumbs');
const produtoCategoria = getElement('produtoCategoria');
const produtoNome = getElement('produtoNome');
const produtoPreco = getElement('produtoPreco');
const produtoPrecoAntigo = getElement('produtoPrecoAntigo');
const produtoDescricao = getElement('produtoDescricao');
const produtoBadges = getElement('produtoBadges');
const tamanhoOpcoes = getElement('tamanhoOpcoes');
const btnComprar = getElement('btnComprar');
const sugestoesGrid = getElement('sugestoesGrid');

let produtoAtual = null;
let tamanhoSelecionado = null;

// ---------- FUNÇÃO DE FORMATAÇÃO DE MOEDA ----------
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}
window.formatarMoeda = formatarMoeda;

// ---------- OBTÉM ID DA URL ----------
function obterIdDaURL() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    console.log('🔍 ID da URL:', id);
    return id || null;
}

// ---------- MOSTRA ERRO ----------
function mostrarErro() {
    if (loadingEl) loadingEl.style.display = 'none';
    if (erroEl) erroEl.style.display = 'block';
    if (detalheEl) detalheEl.style.display = 'none';
}

// ---------- PREENCHE A PÁGINA ----------
function preencherPagina(produto) {
    console.log('✅ Produto recebido:', produto);
    console.log('📸 URL da imagem:', produto.imagem);

    if (loadingEl) loadingEl.style.display = 'none';
    if (erroEl) erroEl.style.display = 'none';
    if (detalheEl) detalheEl.style.display = 'grid';

    document.title = `${produto.nome} - BIGBABYDOG`;

    if (produtoCategoria) produtoCategoria.textContent = produto.categoria || 'Geral';
    if (produtoNome) produtoNome.textContent = produto.nome;
    if (produtoPreco) produtoPreco.textContent = formatarMoeda(produto.preco);

    if (produtoPrecoAntigo) {
        if (produto.preco_antigo) {
            produtoPrecoAntigo.textContent = formatarMoeda(produto.preco_antigo);
            produtoPrecoAntigo.style.display = 'inline';
        } else {
            produtoPrecoAntigo.style.display = 'none';
        }
    }

    if (produtoDescricao) produtoDescricao.textContent = produto.descricao || 'Sem descrição disponível.';

    // Badges
    if (produtoBadges) {
        let badgesHtml = '';
        if (produto.novo) {
            badgesHtml += `<span class="card-badge badge-novo" style="position:static;display:inline-block;margin-right:8px;">Novo</span>`;
        }
        if (produto.preco_antigo) {
            const desconto = Math.round(((produto.preco_antigo - produto.preco) / produto.preco_antigo) * 100);
            badgesHtml += `<span class="card-badge badge-promo" style="position:static;display:inline-block;">-${desconto}%</span>`;
        }
        produtoBadges.innerHTML = badgesHtml;
    }

    // ----- IMAGEM PRINCIPAL -----
    let imagemPrincipal = produto.imagem;
    if (!imagemPrincipal || imagemPrincipal.trim() === '') {
        imagemPrincipal = `https://placehold.co/600x800/e0ddd6/1a1a2e?text=${encodeURIComponent(produto.nome)}`;
        console.log('⚠️ Usando placeholder (imagem vazia)');
    } else {
        console.log('✅ Usando imagem do banco:', imagemPrincipal);
    }
    if (galeriaPrincipal) {
        galeriaPrincipal.src = imagemPrincipal;
        galeriaPrincipal.alt = produto.nome;
    }

    // ----- THUMBNAILS -----
    if (galeriaThumbs) {
        let imagens = [imagemPrincipal];
        if (produto.imagens && Array.isArray(produto.imagens) && produto.imagens.length > 0) {
            imagens = [imagemPrincipal, ...produto.imagens];
        }

        galeriaThumbs.innerHTML = imagens.map((img, index) => `
            <img src="${img}" alt="${produto.nome} - Imagem ${index+1}" 
                 class="${index === 0 ? 'active' : ''}"
                 onclick="window.trocarImagemPrincipal('${img}', this)"
                 loading="lazy"
                 onerror="this.onerror=null; this.src='https://placehold.co/70x90/e0ddd6/1a1a2e?text=Erro'"
            >
        `).join('');
    }

    // ----- TAMANHOS -----
    if (tamanhoOpcoes) {
        const tamanhos = produto.tamanhos && Array.isArray(produto.tamanhos) ? produto.tamanhos : ['P', 'M', 'G', 'GG'];
        tamanhoOpcoes.innerHTML = tamanhos.map(t => `
            <button class="tamanho-btn" data-tamanho="${t}" onclick="window.selecionarTamanho('${t}', this)">
                ${t}
            </button>
        `).join('');
    }

    if (btnComprar) {
        btnComprar.disabled = true;
        btnComprar.innerHTML = `<i class="fas fa-shopping-cart"></i> SELECIONE UM TAMANHO`;
    }
    tamanhoSelecionado = null;
}

// ---------- FUNÇÕES GLOBAIS PARA OS ONCLICKS ----------
window.trocarImagemPrincipal = function(src, thumbElement) {
    if (galeriaPrincipal) galeriaPrincipal.src = src;
    if (galeriaThumbs) {
        document.querySelectorAll('.galeria-thumbs img').forEach(img => img.classList.remove('active'));
        thumbElement.classList.add('active');
    }
};

window.selecionarTamanho = function(tamanho, elemento) {
    if (tamanhoOpcoes) {
        document.querySelectorAll('.tamanho-btn').forEach(btn => btn.classList.remove('selected'));
        elemento.classList.add('selected');
    }
    tamanhoSelecionado = tamanho;
    if (btnComprar) {
        btnComprar.disabled = false;
        btnComprar.innerHTML = `<i class="fas fa-shopping-cart"></i> ADICIONAR AO CARRINHO - ${formatarMoeda(produtoAtual.preco)}`;
    }
};

// ---------- CARREGA PRODUTO ----------
async function carregarProduto() {
    console.log('🚀 carregarProduto() chamada!');
    const id = obterIdDaURL();
    if (!id) {
        console.warn('❌ ID inválido, mostrando erro.');
        mostrarErro();
        return;
    }

    try {
        console.log('📡 Buscando produto no Supabase...');
        const { data: produto, error } = await window.supabase
            .from('produtos')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !produto) {
            console.error('❌ Erro ao buscar produto:', error);
            mostrarErro();
            return;
        }

        console.log('✅ Produto encontrado:', produto);
        produtoAtual = produto;
        preencherPagina(produto);
        carregarSugestoes(produto);
    } catch (err) {
        console.error('❌ Erro no carregamento:', err);
        mostrarErro();
    }
}

// ---------- CARREGA SUGESTÕES ----------
async function carregarSugestoes(produto) {
    if (!sugestoesGrid) return;

    try {
        const { data: sugestoes, error } = await window.supabase
            .from('produtos')
            .select('*')
            .eq('categoria', produto.categoria)
            .neq('id', produto.id)
            .limit(4);

        if (error || !sugestoes || sugestoes.length === 0) {
            sugestoesGrid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:var(--text-muted);">Nenhuma sugestão disponível</p>';
            return;
        }

        sugestoesGrid.innerHTML = sugestoes.map(p => {
            const img = p.imagem || `https://placehold.co/600x800/e0ddd6/1a1a2e?text=${encodeURIComponent(p.nome)}`;
            return `
                <div class="produto-card fade-in" onclick="window.location.href='produto.html?id=${p.id}'">
                    <img src="${img}" alt="${p.nome}" class="card-img" loading="lazy"
                         onerror="this.onerror=null; this.src='https://placehold.co/600x800/e0ddd6/1a1a2e?text=${encodeURIComponent(p.nome)}'">
                    <div class="card-body">
                        <div class="card-categoria">${p.categoria}</div>
                        <div class="card-nome">${p.nome}</div>
                        <div class="card-preco">
                            <span class="card-preco-atual">${formatarMoeda(p.preco)}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.error('Erro ao carregar sugestões:', err);
    }
}

// ---------- BOTÃO COMPRAR ----------
if (btnComprar) {
    btnComprar.addEventListener('click', () => {
        if (!tamanhoSelecionado) {
            alert('Por favor, selecione um tamanho antes de comprar!');
            return;
        }
        if (!produtoAtual) return;
        window.adicionarAoCarrinho(produtoAtual.id, tamanhoSelecionado);
    });
}

// ---------- MOBILE MENU ----------
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('menuToggle');
    const links = document.getElementById('navLinks');
    if (toggle && links) {
        toggle.addEventListener('click', () => {
            links.classList.toggle('open');
        });
    }
});

// ---------- INICIALIZA ----------
console.log('⏳ Aguardando DOMContentLoaded...');
// Inicialização imediata (já que o script é module e executa depois do DOM)
console.log('🚀 Iniciando carregamento imediato...');
carregarProduto();