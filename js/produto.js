// ============================================================
// PRODUTO.JS - Página individual do produto
// ============================================================

console.log('🔥 produto.js carregado');

const supabase = window.supabase;
if (!supabase) console.error('❌ Supabase não encontrado.');

// ---------- ELEMENTOS DOM ----------
const loadingEl = document.getElementById('loadingProduto');
const erroEl = document.getElementById('erroProduto');
const detalheEl = document.getElementById('detalheProduto');
const galeriaPrincipal = document.getElementById('galeriaPrincipal');
const galeriaThumbs = document.getElementById('galeriaThumbs');
const produtoCategoria = document.getElementById('produtoCategoria');
const produtoNome = document.getElementById('produtoNome');
const produtoPreco = document.getElementById('produtoPreco');
const produtoPrecoAntigo = document.getElementById('produtoPrecoAntigo');
const produtoDescricao = document.getElementById('produtoDescricao');
const produtoBadges = document.getElementById('produtoBadges');
const tamanhoOpcoes = document.getElementById('tamanhoOpcoes');
const btnComprar = document.getElementById('btnComprar');
const sugestoesGrid = document.getElementById('sugestoesGrid');
const breadcrumbProduto = document.getElementById('breadcrumbProduto');

// Elementos de avaliação
const mediaEstrelas = document.getElementById('mediaEstrelas');
const totalAvaliacoes = document.getElementById('totalAvaliacoes');
const estrelasContainer = document.getElementById('avaliacaoEstrelas');
const avaliacaoNome = document.getElementById('avaliacaoNome');
const avaliacaoComentario = document.getElementById('avaliacaoComentario');
const btnEnviar = document.getElementById('btnEnviarAvaliacao');
const listaAvaliacoes = document.getElementById('listaAvaliacoes');
const mensagemDiv = document.getElementById('avaliacaoMensagem');

let produtoAtual = null;
let tamanhoSelecionado = null;
let notaSelecionada = 0;

// ---------- FUNÇÕES AUXILIARES ----------
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}
window.formatarMoeda = formatarMoeda;

function obterIdDaURL() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id')) || null;
}

function mostrarErro() {
    if (loadingEl) loadingEl.style.display = 'none';
    if (erroEl) erroEl.style.display = 'block';
    if (detalheEl) detalheEl.style.display = 'none';
}

// ---------- PREENCHE A PÁGINA ----------
function preencherPagina(produto) {
    if (loadingEl) loadingEl.style.display = 'none';
    if (erroEl) erroEl.style.display = 'none';
    if (detalheEl) detalheEl.style.display = 'grid';

    document.title = `${produto.nome} - BIGBABYDOG`;
    if (breadcrumbProduto) breadcrumbProduto.textContent = produto.nome;

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
    if (produtoDescricao) produtoDescricao.textContent = produto.descricao || 'Sem descrição.';

    // Badges
    if (produtoBadges) {
        let badgesHtml = '';
        if (produto.novo) badgesHtml += `<span class="card-badge badge-novo" style="position:static;display:inline-block;margin-right:8px;">Novo</span>`;
        if (produto.preco_antigo) {
            const desconto = Math.round(((produto.preco_antigo - produto.preco) / produto.preco_antigo) * 100);
            badgesHtml += `<span class="card-badge badge-promo" style="position:static;display:inline-block;">-${desconto}%</span>`;
        }
        produtoBadges.innerHTML = badgesHtml;
    }

    // Imagem principal
    let imagemPrincipal = produto.imagem || `https://placehold.co/600x800/e0ddd6/1a1a2e?text=${encodeURIComponent(produto.nome)}`;
    if (galeriaPrincipal) {
        galeriaPrincipal.src = imagemPrincipal;
        galeriaPrincipal.alt = produto.nome;
    }

    // Thumbnails
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
                 onerror="this.onerror=null; this.src='https://placehold.co/70x90/e0ddd6/1a1a2e?text=Erro'">
        `).join('');
    }

    // Tamanhos
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

    // Carrega avaliações
    carregarAvaliacoes(produto.id);
}

// ---------- FUNÇÕES GLOBAIS ----------
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
    const id = obterIdDaURL();
    if (!id) { mostrarErro(); return; }

    try {
        const { data: produto, error } = await supabase
            .from('produtos')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !produto) {
            mostrarErro();
            return;
        }

        produtoAtual = produto;
        preencherPagina(produto);
        carregarSugestoes(produto);
    } catch (err) {
        console.error('❌ Erro:', err);
        mostrarErro();
    }
}

// ---------- CARREGA SUGESTÕES ----------
async function carregarSugestoes(produto) {
    if (!sugestoesGrid) return;

    try {
        const { data: sugestoes, error } = await supabase
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

// ============================================================
// AVALIAÇÕES
// ============================================================

async function carregarAvaliacoes(produtoId) {
    if (!listaAvaliacoes) return;

    try {
        const { error: tableCheck } = await supabase
            .from('avaliacoes')
            .select('id', { count: 'exact', head: true });

        if (tableCheck && tableCheck.code === '42P01') {
            listaAvaliacoes.innerHTML = `
                <div style="text-align:center;padding:30px;color:var(--text-muted);">
                    <p>💬 Sistema de avaliações em breve.</p>
                </div>
            `;
            return;
        }

        const { data: avaliacoes, error } = await supabase
            .from('avaliacoes')
            .select('*')
            .eq('produto_id', produtoId)
            .order('data_criacao', { ascending: false });

        if (error) throw error;

        if (!avaliacoes || avaliacoes.length === 0) {
            listaAvaliacoes.innerHTML = `
                <div style="text-align:center;padding:30px;color:var(--text-muted);">
                    <i class="fas fa-star" style="font-size:2rem;display:block;margin-bottom:8px;"></i>
                    <p>Nenhuma avaliação ainda. Seja o primeiro!</p>
                </div>
            `;
            atualizarMedia(0, 0);
            return;
        }

        const soma = avaliacoes.reduce((acc, av) => acc + av.nota, 0);
        const media = soma / avaliacoes.length;
        atualizarMedia(media, avaliacoes.length);

        listaAvaliacoes.innerHTML = avaliacoes.map(av => {
            const estrelas = '★'.repeat(av.nota) + '☆'.repeat(5 - av.nota);
            const data = new Date(av.data_criacao).toLocaleDateString('pt-BR');
            return `
                <div class="avaliacao-item">
                    <div class="cabecalho">
                        <span class="nome">${av.cliente_nome || 'Anônimo'}</span>
                        <span class="estrelas">${estrelas}</span>
                    </div>
                    <div class="data">${data}</div>
                    ${av.comentario ? `<div class="comentario">${av.comentario}</div>` : ''}
                </div>
            `;
        }).join('');

    } catch (err) {
        console.error('Erro ao carregar avaliações:', err);
        listaAvaliacoes.innerHTML = `<p style="color:var(--text-muted);">Erro ao carregar avaliações.</p>`;
    }
}

function atualizarMedia(media, total) {
    if (mediaEstrelas) {
        const cheias = Math.round(media);
        mediaEstrelas.textContent = '★'.repeat(cheias) + '☆'.repeat(5 - cheias);
    }
    if (totalAvaliacoes) {
        totalAvaliacoes.textContent = `(${total} ${total === 1 ? 'avaliação' : 'avaliações'})`;
    }
}

function configurarEstrelas() {
    if (!estrelasContainer) return;
    const estrelas = estrelasContainer.querySelectorAll('span');
    estrelas.forEach(el => {
        el.addEventListener('click', () => {
            notaSelecionada = parseInt(el.dataset.nota);
            estrelas.forEach(e => {
                e.classList.toggle('active', parseInt(e.dataset.nota) <= notaSelecionada);
            });
        });
        el.addEventListener('mouseenter', () => {
            const nota = parseInt(el.dataset.nota);
            estrelas.forEach(e => {
                e.style.color = parseInt(e.dataset.nota) <= nota ? '#f5a623' : '#ccc';
            });
        });
        el.addEventListener('mouseleave', () => {
            estrelas.forEach(e => {
                e.style.color = e.classList.contains('active') ? '#f5a623' : '#ccc';
            });
        });
    });
}

async function enviarAvaliacao() {
    if (!produtoAtual) {
        mensagemDiv.textContent = 'Erro: produto não carregado.';
        mensagemDiv.style.color = 'var(--danger)';
        return;
    }
    if (notaSelecionada === 0) {
        mensagemDiv.textContent = 'Selecione uma nota (1 a 5 estrelas).';
        mensagemDiv.style.color = 'var(--danger)';
        return;
    }

    const nome = avaliacaoNome.value.trim() || 'Anônimo';
    const comentario = avaliacaoComentario.value.trim();

    try {
        const { error } = await supabase
            .from('avaliacoes')
            .insert([{
                produto_id: produtoAtual.id,
                cliente_nome: nome,
                nota: notaSelecionada,
                comentario: comentario || null
            }]);

        if (error) throw error;

        mensagemDiv.textContent = '✅ Avaliação enviada! Obrigado!';
        mensagemDiv.style.color = 'var(--success)';
        avaliacaoNome.value = '';
        avaliacaoComentario.value = '';
        notaSelecionada = 0;
        document.querySelectorAll('#avaliacaoEstrelas span').forEach(e => {
            e.classList.remove('active');
            e.style.color = '#ccc';
        });
        carregarAvaliacoes(produtoAtual.id);
    } catch (err) {
        console.error('Erro ao enviar avaliação:', err);
        mensagemDiv.textContent = '❌ Erro ao enviar. Tente novamente.';
        mensagemDiv.style.color = 'var(--danger)';
    }
}

// ---------- EVENTOS ----------
if (btnComprar) {
    btnComprar.addEventListener('click', () => {
        if (!tamanhoSelecionado) {
            alert('Selecione um tamanho!');
            return;
        }
        if (!produtoAtual) return;
        if (typeof window.adicionarAoCarrinho === 'function') {
            window.adicionarAoCarrinho(produtoAtual.id, tamanhoSelecionado);
        } else {
            alert('Erro ao adicionar ao carrinho.');
        }
    });
}

if (btnEnviar) {
    btnEnviar.addEventListener('click', enviarAvaliacao);
}
if (estrelasContainer) {
    configurarEstrelas();
}

// ---------- INICIALIZAÇÃO ----------
carregarProduto();

// ---------- CONTADOR DO CARRINHO ----------
window.atualizarContadorCarrinho = function() {
    const count = document.getElementById('cartCount');
    if (!count) return;
    const carrinho = JSON.parse(localStorage.getItem('bbd_carrinho') || '[]');
    const total = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    count.textContent = total;
    count.style.display = total > 0 ? 'flex' : 'none';
};
document.addEventListener('DOMContentLoaded', () => {
    if (window.carrinho) {
        window.carrinho.atualizarUI = function() {
            this.renderizarItens();
            window.atualizarContadorCarrinho();
        };
    }
    window.atualizarContadorCarrinho();
});