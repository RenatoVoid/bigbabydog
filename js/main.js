// ============================================================
// MAIN.JS - Funções compartilhadas entre todas as páginas
// ============================================================

// ---------- CONFIGURAÇÃO GLOBAL ----------
// NÚMERO DO WHATSAPP DA LOJA (altere aqui para mudar em todo o site)
const WHATSAPP_LOJA = "5512996491449"; // Formato: 55 + DDD + número

// ---------- UTILITÁRIOS ----------

/**
 * Formata um número para o formato de moeda brasileira (R$)
 */
function formatarMoeda(valor) {
    return 'R$ ' + Number(valor).toFixed(2).replace('.', ',');
}

/**
 * Gera um ID único para pedidos
 */
function gerarIdPedido() {
    let ultimo = parseInt(localStorage.getItem('bbd_ultimo_pedido') || '0');
    ultimo++;
    localStorage.setItem('bbd_ultimo_pedido', ultimo);
    return '#BBD-' + String(ultimo).padStart(3, '0');
}

/**
 * Aplica máscara de WhatsApp no formato (XX) XXXXX-XXXX
 */
function mascaraWhatsApp(input) {
    input.addEventListener('input', function(e) {
        let valor = this.value.replace(/\D/g, '');
        if (valor.length > 11) valor = valor.slice(0, 11);
        if (valor.length > 2) {
            valor = '(' + valor.slice(0, 2) + ') ' + valor.slice(2);
        }
        if (valor.length > 10) {
            valor = valor.slice(0, 10) + '-' + valor.slice(10);
        }
        this.value = valor;
    });
}

/**
 * Busca endereço pelo CEP usando a API ViaCEP
 */
async function buscarCEP(cep, callback) {
    cep = cep.replace(/\D/g, '');
    if (cep.length !== 8) return;
    
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
            callback({
                rua: data.logradouro || '',
                bairro: data.bairro || '',
                cidade: data.localidade || '',
                estado: data.uf || ''
            });
        }
    } catch (erro) {
        console.log('Erro ao buscar CEP:', erro);
    }
}

/**
 * Obtém todos os produtos (mescla dados padrão com customizados do admin)
 */
function obterProdutos() {
    const customizados = JSON.parse(localStorage.getItem('bbd_produtos_custom') || '[]');
    // Cria um mapa dos customizados por ID para substituição
    const mapa = {};
    customizados.forEach(p => { mapa[p.id] = p; });
    
    // Mescla: se tem customizado, usa ele; senão usa o original
    const todos = [...PRODUTOS];
    const resultado = todos.map(p => mapa[p.id] || p);
    
    // Adiciona produtos novos (com ID > 10 ou IDs que não existem no original)
    customizados.forEach(p => {
        if (!todos.find(orig => orig.id === p.id)) {
            resultado.push(p);
        }
    });
    
    return resultado;
}

/**
 * Salva um pedido no histórico
 */
function salvarPedido(pedido) {
    const historico = JSON.parse(localStorage.getItem('bbd_pedidos') || '[]');
    historico.unshift(pedido); // Adiciona no início (mais recente primeiro)
    localStorage.setItem('bbd_pedidos', JSON.stringify(historico));
}

/**
 * Obtém histórico de pedidos
 */
function obterPedidos() {
    return JSON.parse(localStorage.getItem('bbd_pedidos') || '[]');
}

// ---------- NAVBAR MOBILE TOGGLE ----------
document.addEventListener('DOMContentLoaded', () => {
    // Configura o menu mobile se existir
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
        
        // Fecha o menu ao clicar em um link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
            });
        });
    }
    
    // Efeito de scroll na navbar
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
    
    // Atualiza o contador do carrinho na navbar
    if (typeof atualizarContadorCarrinho === 'function') {
        atualizarContadorCarrinho();
    }
});