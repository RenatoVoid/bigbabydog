// ============================================================
// ADMIN.JS - Painel administrativo BIGBABYDOG (com edição)
// ============================================================

console.log('🔥 admin.js carregado');

const supabase = window.supabase;
if (!supabase) {
    console.error('❌ Supabase NÃO encontrado!');
} else {
    console.log('✅ Supabase encontrado.');
}

// ---------- ELEMENTOS DOM ----------
const loginOverlay = document.getElementById('adminLoginOverlay');
const adminPanel = document.getElementById('adminPanel');
const emailInput = document.getElementById('adminEmail');
const senhaInput = document.getElementById('adminSenha');
const btnLogin = document.getElementById('btnAdminLogin');
const formProduto = document.getElementById('formProduto');
const produtosTbody = document.getElementById('adminProdutosTbody');
const pedidosTbody = document.getElementById('adminPedidosTbody');

// Campos do formulário
const prodId = document.getElementById('prodId');
const prodNome = document.getElementById('prodNome');
const prodCategoria = document.getElementById('prodCategoria');
const prodPreco = document.getElementById('prodPreco');
const prodPrecoAntigo = document.getElementById('prodPrecoAntigo');
const prodDescricao = document.getElementById('prodDescricao');
const prodImagemUpload = document.getElementById('prodImagemUpload');
const prodImagemUrl = document.getElementById('prodImagemUrl');
const prodDestaque = document.getElementById('prodDestaque');
const prodNovo = document.getElementById('prodNovo');
const tamanhoCheckboxes = document.querySelectorAll('.tamanho-checkbox');
const formTitulo = document.getElementById('formTitulo');
const btnCancelarEdicao = document.getElementById('btnCancelarEdicao');
const btnSalvarProduto = document.getElementById('btnSalvarProduto');

// ---------- FUNÇÕES DE AUTENTICAÇÃO ----------
async function verificarSessao() {
    console.log('🔍 Verificando sessão...');
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        console.log('✅ Sessão ativa.');
        mostrarPainel();
        carregarProdutosAdmin();
        carregarPedidosAdmin();
    } else {
        console.log('⚠️ Nenhuma sessão ativa.');
        mostrarLogin();
    }
}

async function fazerLogin() {
    console.log('🖱️ Botão de login clicado!');
    const email = emailInput.value.trim() || 'admin@gmail.com';
    const senha = senhaInput.value.trim();

    if (!senha) {
        alert('Digite a senha.');
        senhaInput.focus();
        return;
    }

    console.log(`📧 Tentando login com: ${email}`);

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: senha
        });

        if (error) {
            console.error('❌ Erro no login:', error);
            alert('Erro ao fazer login: ' + error.message);
            return;
        }

        console.log('✅ Login bem-sucedido!', data);
        mostrarPainel();
        carregarProdutosAdmin();
        carregarPedidosAdmin();

    } catch (err) {
        console.error('❌ Erro inesperado:', err);
        alert('Erro inesperado. Verifique o console.');
    }
}

function mostrarLogin() {
    if (loginOverlay) loginOverlay.style.display = 'flex';
    if (adminPanel) adminPanel.style.display = 'none';
}

function mostrarPainel() {
    if (loginOverlay) loginOverlay.style.display = 'none';
    if (adminPanel) adminPanel.style.display = 'block';
}

async function fazerLogout() {
    console.log('🚪 Sair...');
    await supabase.auth.signOut();
    mostrarLogin();
}
window.fazerLogout = fazerLogout;

// ---------- GERENCIAMENTO DE PRODUTOS ----------
async function carregarProdutosAdmin() {
    if (!produtosTbody) return;

    const { data: produtos, error } = await supabase
        .from('produtos')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        produtosTbody.innerHTML = '<tr><td colspan="6">Erro ao carregar.</td></tr>';
        return;
    }

    if (!produtos || produtos.length === 0) {
        produtosTbody.innerHTML = '<tr><td colspan="6">Nenhum produto cadastrado.</td></tr>';
        return;
    }

    produtosTbody.innerHTML = produtos.map(p => {
        const img = p.imagem || 'https://placehold.co/40x50/e0ddd6/1a1a2e?text=?';
        return `
            <tr>
                <td>${p.id}</td>
                <td><img src="${img}" class="produto-img" alt="${p.nome}"></td>
                <td>${p.nome}</td>
                <td>${p.categoria}</td>
                <td>${formatarMoeda(p.preco)}</td>
                <td style="text-align:center;">
                    <button class="btn-sm edit" onclick="window.editarProduto(${p.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn-sm danger" onclick="window.excluirProduto(${p.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

// ---------- FUNÇÃO DE EDIÇÃO ----------
window.editarProduto = async function(id) {
    console.log(`✏️ Editando produto ${id}`);

    const { data: produto, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !produto) {
        alert('Erro ao carregar produto para edição.');
        return;
    }

    // Preencher formulário
    prodId.value = produto.id;
    prodNome.value = produto.nome;
    prodCategoria.value = produto.categoria;
    prodPreco.value = produto.preco;
    prodPrecoAntigo.value = produto.preco_antigo || '';
    prodDescricao.value = produto.descricao || '';
    prodImagemUrl.value = produto.imagem || '';
    prodDestaque.checked = produto.destaque || false;
    prodNovo.checked = produto.novo || false;

    // Marcar tamanhos
    const tamanhos = produto.tamanhos || [];
    tamanhoCheckboxes.forEach(cb => {
        cb.checked = tamanhos.includes(cb.value);
    });

    // Mudar título do formulário
    formTitulo.textContent = 'Editar produto';
    btnSalvarProduto.innerHTML = '<i class="fas fa-save"></i> Atualizar produto';
    btnCancelarEdicao.style.display = 'inline-block';

    // Rolar para o formulário
    formProduto.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// ---------- FUNÇÃO PARA LIMPAR FORMULÁRIO ----------
function limparFormulario() {
    prodId.value = '';
    prodNome.value = '';
    prodCategoria.value = '';
    prodPreco.value = '';
    prodPrecoAntigo.value = '';
    prodDescricao.value = '';
    prodImagemUrl.value = '';
    prodImagemUpload.value = '';
    prodDestaque.checked = false;
    prodNovo.checked = false;
    tamanhoCheckboxes.forEach(cb => cb.checked = true); // padrão
    formTitulo.textContent = 'Adicionar novo produto';
    btnSalvarProduto.innerHTML = '<i class="fas fa-save"></i> Salvar produto';
    btnCancelarEdicao.style.display = 'none';
}
window.limparFormulario = limparFormulario;

// Cancelar edição
btnCancelarEdicao.addEventListener('click', limparFormulario);

// ---------- EXCLUIR PRODUTO ----------
window.excluirProduto = async function(id) {
    if (!confirm('Excluir este produto?')) return;
    const { error } = await supabase.from('produtos').delete().eq('id', id);
    if (error) {
        alert('Erro ao excluir: ' + error.message);
        return;
    }
    carregarProdutosAdmin();
};

// ---------- SALVAR/ATUALIZAR PRODUTO ----------
async function adicionarProduto(event) {
    event.preventDefault();

    const nome = prodNome.value.trim();
    const categoria = prodCategoria.value;
    const preco = parseFloat(prodPreco.value);
    const precoAntigo = parseFloat(prodPrecoAntigo.value) || null;
    const descricao = prodDescricao.value.trim();
    const destaque = prodDestaque.checked;
    const novo = prodNovo.checked;
    const arquivo = prodImagemUpload.files[0];
    const urlImagem = prodImagemUrl.value.trim();

    // Validar
    if (!nome || !categoria || isNaN(preco)) {
        alert('Preencha nome, categoria e preço.');
        return;
    }

    const tamanhos = Array.from(tamanhoCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    if (tamanhos.length === 0) {
        alert('Selecione pelo menos um tamanho.');
        return;
    }

    let imagemUrl = urlImagem || null;

    // Upload de imagem
    if (arquivo) {
        const nomeArquivo = `produto_${Date.now()}_${arquivo.name}`;
        const arrayBuffer = await arquivo.arrayBuffer();
        const { error: uploadError } = await supabase.storage
            .from('produtos')
            .upload(nomeArquivo, arrayBuffer, {
                cacheControl: '3600',
                contentType: arquivo.type
            });

        if (uploadError) {
            alert('Erro ao enviar imagem: ' + uploadError.message);
            return;
        }

        const { data: urlData } = supabase.storage.from('produtos').getPublicUrl(nomeArquivo);
        imagemUrl = urlData.publicUrl;
    }

    // Se não tem imagem e não é edição, usa placeholder
    if (!imagemUrl && !prodId.value) {
        imagemUrl = `https://placehold.co/600x800/e0ddd6/1a1a2e?text=${encodeURIComponent(nome)}`;
    }

    const produtoData = {
        nome,
        categoria,
        preco,
        preco_antigo: precoAntigo,
        descricao,
        imagem: imagemUrl,
        tamanhos,
        destaque,
        novo
    };

    const isEdit = prodId.value !== '';
    let error;

    if (isEdit) {
        // Atualizar
        const { error: updateError } = await supabase
            .from('produtos')
            .update(produtoData)
            .eq('id', parseInt(prodId.value));
        error = updateError;
    } else {
        // Inserir
        const { error: insertError } = await supabase
            .from('produtos')
            .insert([produtoData]);
        error = insertError;
    }

    if (error) {
        alert('Erro ao salvar: ' + error.message);
        return;
    }

    alert(isEdit ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!');
    limparFormulario();
    carregarProdutosAdmin();
}

// ---------- GERENCIAMENTO DE PEDIDOS ----------
async function carregarPedidosAdmin() {
    if (!pedidosTbody) return;

    const { data: pedidos, error } = await supabase
        .from('pedidos')
        .select('*')
        .order('data_pedido', { ascending: false });

    if (error) {
        pedidosTbody.innerHTML = '<tr><td colspan="6">Erro ao carregar pedidos.</td></tr>';
        return;
    }

    if (!pedidos || pedidos.length === 0) {
        pedidosTbody.innerHTML = '<tr><td colspan="6">Nenhum pedido recebido.</td></tr>';
        return;
    }

    pedidosTbody.innerHTML = pedidos.map(p => {
        const data = new Date(p.data_pedido).toLocaleDateString('pt-BR');
        const itens = p.itens ? p.itens.length : 0;
        return `
            <tr>
                <td>#${p.id}</td>
                <td>${data}</td>
                <td>${p.cliente_nome}</td>
                <td>${itens} itens</td>
                <td>${formatarMoeda(p.total)}</td>
                <td><span style="background:var(--accent);color:#fff;padding:2px 10px;border-radius:12px;font-size:0.7rem;font-weight:600;">${p.status || 'Pendente'}</span></td>
            </tr>
        `;
    }).join('');
}

// ---------- UTILITÁRIOS ----------
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

// ---------- EVENTOS (execução direta) ----------
console.log('📄 Configurando eventos...');

if (btnLogin) {
    btnLogin.addEventListener('click', fazerLogin);
} else {
    console.error('❌ Botão #btnAdminLogin NÃO encontrado.');
}

if (senhaInput) {
    senhaInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            fazerLogin();
        }
    });
}

document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
        const section = document.getElementById(`section-${target}`);
        if (section) section.classList.add('active');
    });
});

if (formProduto) {
    formProduto.addEventListener('submit', adicionarProduto);
}

// Verifica sessão imediatamente
verificarSessao();

console.log('✅ Admin inicializado com sucesso!');