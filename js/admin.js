// ============================================================
// ADMIN.JS - Painel administrativo da BIGBABYDOG (Supabase)
// ============================================================
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// ---------- CONEXÃO COM O SUPABASE ----------
const supabaseUrl = 'https://lekzyptgypjkwpxuruel.supabase.co';
const supabaseKey = 'sb_publishable_9z5CfPvDD0XEK9RglCOh5w_VE_F9D4H';
const supabase = createClient(supabaseUrl, supabaseKey);

// Elementos do DOM (serão preenchidos no DOMContentLoaded)
let elementos = {};

document.addEventListener('DOMContentLoaded', () => {
    // Mapeia os elementos da tela de login e do painel
    elementos = {
        loginOverlay: document.getElementById('adminLoginOverlay'),
        adminPanel: document.getElementById('adminPanel'),
        emailInput: document.getElementById('adminEmail'),
        senhaInput: document.getElementById('adminSenha'),
        btnLogin: document.getElementById('btnAdminLogin'),
        formProduto: document.getElementById('formProduto'),
        produtosTbody: document.getElementById('adminProdutosTbody'),
        // Campos do formulário
        prodNome: document.getElementById('prodNome'),
        prodCategoria: document.getElementById('prodCategoria'),
        prodPreco: document.getElementById('prodPreco'),
        prodPrecoAntigo: document.getElementById('prodPrecoAntigo'),
        prodDescricao: document.getElementById('prodDescricao'),
        prodImagem: document.getElementById('prodImagemUpload'),
        prodDestaque: document.getElementById('prodDestaque'),
        prodNovo: document.getElementById('prodNovo'),
    };

    // Verifica se já existe uma sessão ativa
    verificarSessao();

    // Eventos de login
    if (elementos.btnLogin) {
        elementos.btnLogin.addEventListener('click', fazerLogin);
    }
    if (elementos.senhaInput) {
        elementos.senhaInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') fazerLogin();
        });
    }

    // Evento de submit do formulário de produto
    if (elementos.formProduto) {
        elementos.formProduto.addEventListener('submit', adicionarProduto);
    }

    // Abas
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const target = tab.dataset.tab;
            document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
            document.getElementById(`section-${target}`).classList.add('active');
        });
    });
});

// ========== AUTENTICAÇÃO ==========
async function verificarSessao() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        mostrarPainel();
    } else {
        mostrarLogin();
    }
}

async function fazerLogin() {
    const email = elementos.emailInput.value.trim() || 'admin@bigbabydog.com';
    const senha = elementos.senhaInput.value;

    if (!senha) {
        alert('Digite a senha.');
        return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) {
        alert('Erro ao fazer login: ' + error.message);
    } else {
        mostrarPainel();
    }
}

function mostrarLogin() {
    elementos.loginOverlay.style.display = 'flex';
    elementos.adminPanel.style.display = 'none';
}

function mostrarPainel() {
    elementos.loginOverlay.style.display = 'none';
    elementos.adminPanel.style.display = 'block';
    carregarProdutosAdmin();
}

async function fazerLogout() {
    await supabase.auth.signOut();
    mostrarLogin();
}
window.fazerLogout = fazerLogout;

// ========== GERENCIAMENTO DE PRODUTOS ==========
async function carregarProdutosAdmin() {
    const tbody = elementos.produtosTbody;
    if (!tbody) return;

    const { data: produtos, error } = await supabase
        .from('produtos')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        tbody.innerHTML = '<tr><td colspan="6">Erro ao carregar.</td></tr>';
        return;
    }

    if (!produtos || produtos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">Nenhum produto cadastrado.</td></tr>';
        return;
    }

    tbody.innerHTML = produtos.map(p => `
        <tr>
            <td>${p.id}</td>
            <td><img src="${p.imagem || 'https://placehold.co/40x50'}" style="width:40px;height:50px;object-fit:cover;border-radius:4px;"></td>
            <td>${p.nome}</td>
            <td>${p.categoria}</td>
            <td>R$ ${Number(p.preco).toFixed(2).replace('.', ',')}</td>
            <td>
                <button class="btn-sm danger" onclick="excluirProduto(${p.id})">Excluir</button>
            </td>
        </tr>
    `).join('');
}

async function adicionarProduto(event) {
    event.preventDefault();

    // Coleta os dados do formulário
    const nome = elementos.prodNome.value.trim();
    const categoria = elementos.prodCategoria.value;
    const preco = parseFloat(elementos.prodPreco.value);
    const precoAntigo = parseFloat(elementos.prodPrecoAntigo.value) || null;
    const descricao = elementos.prodDescricao.value.trim();
    const destaque = elementos.prodDestaque.checked;
    const novo = elementos.prodNovo.checked;
    const arquivo = elementos.prodImagem.files[0];

    if (!nome || !categoria || isNaN(preco)) {
        alert('Preencha nome, categoria e preço.');
        return;
    }

    // Upload da imagem (se houver)
    let imagemUrl = null;
    if (arquivo) {
        const nomeArquivo = `produto_${Date.now()}_${arquivo.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('produtos')
            .upload(nomeArquivo, arquivo, { cacheControl: '3600' });

        if (uploadError) {
            alert('Erro ao enviar imagem: ' + uploadError.message);
            return;
        }

        const { data: urlData } = supabase.storage.from('produtos').getPublicUrl(nomeArquivo);
        imagemUrl = urlData.publicUrl;
    } else {
        imagemUrl = `https://placehold.co/600x800/1a1a2e/b366ff?text=${encodeURIComponent(nome)}`;
    }

    // Insere no banco
    const { error } = await supabase.from('produtos').insert([{
        nome,
        categoria,
        preco,
        preco_antigo: precoAntigo,
        descricao,
        imagem: imagemUrl,
        tamanhos: ['P', 'M', 'G', 'GG'],
        destaque,
        novo,
    }]);

    if (error) {
        alert('Erro ao cadastrar: ' + error.message);
        return;
    }

    alert('Produto cadastrado com sucesso!');
    elementos.formProduto.reset();
    carregarProdutosAdmin();
}

async function excluirProduto(id) {
    if (!confirm('Excluir este produto?')) return;
    const { error } = await supabase.from('produtos').delete().eq('id', id);
    if (error) {
        alert('Erro ao excluir: ' + error.message);
        return;
    }
    carregarProdutosAdmin();
}
window.excluirProduto = excluirProduto;