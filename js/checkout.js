// ============================================================
// CHECKOUT.JS - Finalização do pedido e integração WhatsApp
// ============================================================

/**
 * Classe Checkout - gerencia o formulário e envio via WhatsApp
 */
class Checkout {
    constructor() {
        this.carrinho = JSON.parse(localStorage.getItem('bbd_carrinho') || '[]');
        this.inicializar();
    }
    
    inicializar() {
        // Se o carrinho estiver vazio e não estiver na página de checkout, não faz nada
        if (this.carrinho.length === 0 && window.location.pathname.includes('checkout')) {
            this.mostrarCarrinhoVazio();
            return;
        }
        
        if (window.location.pathname.includes('checkout')) {
            this.renderizarResumo();
            this.configurarFormulario();
            this.configurarBuscaCEP();
        }
    }
    
    mostrarCarrinhoVazio() {
        const conteudo = document.querySelector('.checkout-grid');
        if (conteudo) {
            conteudo.innerHTML = `
                <div style="text-align:center;padding:60px 20px;grid-column:1/-1">
                    <i class="fas fa-shopping-cart" style="font-size:4rem;color:var(--text-muted);margin-bottom:20px;display:block"></i>
                    <h2 style="font-family:var(--font-display);color:#fff;margin-bottom:10px">Carrinho Vazio</h2>
                    <p style="color:var(--text-muted);margin-bottom:24px">Adicione produtos antes de finalizar seu pedido.</p>
                    <a href="loja.html" class="btn btn-primary">IR PARA A LOJA</a>
                </div>
            `;
        }
    }
    
    // Renderiza o resumo do pedido no checkout
    renderizarResumo() {
        const container = document.getElementById('resumoItens');
        if (!container) return;
        
        container.innerHTML = this.carrinho.map(item => `
            <div class="checkout-resumo-item">
                <img src="${item.imagem}" alt="${item.nome}">
                <div style="flex:1">
                    <strong>${item.nome}</strong>
                    <div style="font-size:0.75rem;color:var(--neon)">Tam: ${item.tamanho} | Qtd: ${item.quantidade}</div>
                    <div style="font-family:var(--font-display);color:var(--neon)">${formatarMoeda(item.preco * item.quantidade)}</div>
                </div>
            </div>
        `).join('');
        
        const subtotal = this.calcularSubtotal();
        document.getElementById('resumoSubtotal').textContent = formatarMoeda(subtotal);
        document.getElementById('resumoTotal').textContent = formatarMoeda(subtotal);
        
        // Frete grátis acima de R$250
        if (subtotal >= 250) {
            document.getElementById('resumoFrete').textContent = 'GRÁTIS';
        }
    }
    
    calcularSubtotal() {
        return this.carrinho.reduce((t, item) => t + (item.preco * item.quantidade), 0);
    }
    
    // Configura o formulário de checkout
    configurarFormulario() {
        const form = document.getElementById('checkoutForm');
        if (!form) return;
        
        // Aplica máscara no campo WhatsApp
        const whatsappInput = document.getElementById('whatsapp');
        if (whatsappInput) {
            mascaraWhatsApp(whatsappInput);
        }
        
        // Configura o botão de finalizar
        const btnFinalizar = document.getElementById('btnFinalizarPedido');
        if (btnFinalizar) {
            btnFinalizar.addEventListener('click', (e) => {
                e.preventDefault();
                this.processarPedido();
            });
        }
    }
    
    // Configura a busca automática de CEP
    configurarBuscaCEP() {
        const cepInput = document.getElementById('cep');
        if (!cepInput) return;
        
        cepInput.addEventListener('blur', () => {
            const cep = cepInput.value.replace(/\D/g, '');
            if (cep.length === 8) {
                // Mostra indicador de carregamento
                cepInput.style.borderColor = 'var(--neon)';
                
                buscarCEP(cep, (endereco) => {
                    document.getElementById('rua').value = endereco.rua;
                    document.getElementById('bairro').value = endereco.bairro;
                    document.getElementById('cidade').value = endereco.cidade;
                    document.getElementById('estado').value = endereco.estado;
                    cepInput.style.borderColor = 'var(--success)';
                    
                    // Foca no número após preencher
                    document.getElementById('numero').focus();
                });
            }
        });
    }
    
    // Valida todos os campos obrigatórios
    validarFormulario() {
        const campos = [
            { id: 'nome', nome: 'Nome completo' },
            { id: 'whatsapp', nome: 'WhatsApp' },
            { id: 'cep', nome: 'CEP' },
            { id: 'rua', nome: 'Rua' },
            { id: 'numero', nome: 'Número' },
            { id: 'bairro', nome: 'Bairro' },
            { id: 'cidade', nome: 'Cidade' },
            { id: 'estado', nome: 'Estado' }
        ];
        
        for (const campo of campos) {
            const el = document.getElementById(campo.id);
            if (!el || !el.value.trim()) {
                alert(`Por favor, preencha o campo: ${campo.nome}`);
                if (el) el.focus();
                return false;
            }
        }
        
        // Valida WhatsApp (mínimo 14 caracteres com máscara)
        const whatsapp = document.getElementById('whatsapp').value.replace(/\D/g, '');
        if (whatsapp.length < 10) {
            alert('Por favor, informe um número de WhatsApp válido com DDD.');
            document.getElementById('whatsapp').focus();
            return false;
        }
        
        return true;
    }
    
    // Coleta os dados do formulário
    coletarDados() {
        return {
            nome: document.getElementById('nome').value.trim(),
            whatsapp: document.getElementById('whatsapp').value.trim(),
            cep: document.getElementById('cep').value.trim(),
            rua: document.getElementById('rua').value.trim(),
            numero: document.getElementById('numero').value.trim(),
            complemento: document.getElementById('complemento').value.trim(),
            bairro: document.getElementById('bairro').value.trim(),
            cidade: document.getElementById('cidade').value.trim(),
            estado: document.getElementById('estado').value.trim(),
            pagamento: document.getElementById('pagamento').value,
            observacoes: document.getElementById('observacoes').value.trim()
        };
    }
    
    // Formata a mensagem para o WhatsApp
    formatarMensagem(dados, idPedido) {
        const itens = this.carrinho.map(item => {
            const subtotalItem = item.preco * item.quantidade;
            return `• ${item.nome} (Tamanho ${item.tamanho})
   Qtd: ${item.quantidade} | ${formatarMoeda(item.preco)} cada
   Subtotal: ${formatarMoeda(subtotalItem)}`;
        }).join('\n\n');
        
        const subtotal = this.calcularSubtotal();
        const frete = subtotal >= 250 ? 'GRÁTIS' : 'A combinar';
        const endereco = `${dados.rua}, ${dados.numero}${dados.complemento ? ' - ' + dados.complemento : ''}
${dados.bairro} - ${dados.cidade}/${dados.estado}
CEP: ${dados.cep}`;
        
        return `🛒 *NOVO PEDIDO - BIGBABYDOG*
        
👤 *Cliente:* ${dados.nome}
📱 *WhatsApp:* ${dados.whatsapp}

📦 *Itens do Pedido:*
━━━━━━━━━━━━━━━━━━
${itens}
━━━━━━━━━━━━━━━━━━

💰 *Resumo:*
Subtotal: ${formatarMoeda(subtotal)}
Frete: ${frete}
*TOTAL: ${formatarMoeda(subtotal)}*

📍 *Endereço de Entrega:*
${endereco}

💳 *Pagamento:* ${dados.pagamento}

📝 *Obs:* ${dados.observacoes || 'Nenhuma'}

✨ Obrigado pela preferência!`;
    }
    
    // Processa o pedido completo
    processarPedido() {
        // Valida o formulário
        if (!this.validarFormulario()) return;
        
        // Coleta dados
        const dados = this.coletarDados();
        
        // Gera ID do pedido
        const idPedido = gerarIdPedido();
        
        // Formata a mensagem
        const mensagem = this.formatarMensagem(dados, idPedido);
        
        // Salva o pedido no histórico
        const pedido = {
            id: idPedido,
            data: new Date().toISOString(),
            cliente: dados,
            itens: [...this.carrinho],
            subtotal: this.calcularSubtotal(),
            status: 'Novo'
        };
        salvarPedido(pedido);
        
        // Limpa o carrinho
        localStorage.removeItem('bbd_carrinho');
        
        // Abre o WhatsApp
        this.abrirWhatsApp(mensagem);
        
        // Mostra a tela de confirmação
        this.mostrarConfirmacao(idPedido, mensagem);
    }
    
    // Abre o WhatsApp com a mensagem formatada
    abrirWhatsApp(mensagem) {
        const mensagemCodificada = encodeURIComponent(mensagem);
        const url = `https://wa.me/${WHATSAPP_LOJA}?text=${mensagemCodificada}`;
        
        // Abre em nova aba
        setTimeout(() => {
            window.open(url, '_blank');
        }, 500);
    }
    
    // Mostra a tela de confirmação pós-compra
    mostrarConfirmacao(idPedido, mensagem) {
        const overlay = document.getElementById('confirmacaoOverlay');
        if (!overlay) return;
        
        // Atualiza o número do pedido na tela
        document.getElementById('pedidoNumero').textContent = idPedido;
        
        // Configura o botão de WhatsApp manual
        const btnWppManual = document.getElementById('btnWppManual');
        if (btnWppManual) {
            btnWppManual.onclick = () => this.abrirWhatsApp(mensagem);
        }
        
        // Mostra o overlay com animação
        overlay.classList.add('show');
    }
}

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', () => {
    window.checkout = new Checkout();
});