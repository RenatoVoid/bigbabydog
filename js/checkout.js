// ============================================================
// CHECKOUT.JS - Finalização do pedido e integração WhatsApp
// ============================================================

class Checkout {
    constructor() {
        this.carrinho = JSON.parse(localStorage.getItem('bbd_carrinho') || '[]');
        this.inicializar();
    }
    
    inicializar() {
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
                </div>`;
        }
    }
    
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
        if (subtotal >= 250) document.getElementById('resumoFrete').textContent = 'GRÁTIS';
    }
    
    calcularSubtotal() {
        return this.carrinho.reduce((t, item) => t + (item.preco * item.quantidade), 0);
    }
    
    configurarFormulario() {
        const form = document.getElementById('checkoutForm');
        if (!form) return;
        
        const whatsappInput = document.getElementById('whatsapp');
        if (whatsappInput) mascaraWhatsApp(whatsappInput);
        
        const btnFinalizar = document.getElementById('btnFinalizarPedido');
        if (btnFinalizar) {
            btnFinalizar.addEventListener('click', (e) => {
                e.preventDefault();
                this.processarPedido();
            });
        }
    }
    
    configurarBuscaCEP() {
        const cepInput = document.getElementById('cep');
        if (!cepInput) return;
        
        cepInput.addEventListener('blur', () => {
            const cep = cepInput.value.replace(/\D/g, '');
            if (cep.length === 8) {
                cepInput.style.borderColor = 'var(--neon)';
                buscarCEP(cep, (endereco) => {
                    document.getElementById('rua').value = endereco.rua;
                    document.getElementById('bairro').value = endereco.bairro;
                    document.getElementById('cidade').value = endereco.cidade;
                    document.getElementById('estado').value = endereco.estado;
                    cepInput.style.borderColor = 'var(--success)';
                    document.getElementById('numero').focus();
                });
            }
        });
    }
    
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
        
        const whatsapp = document.getElementById('whatsapp').value.replace(/\D/g, '');
        if (whatsapp.length < 10) {
            alert('Por favor, informe um número de WhatsApp válido com DDD.');
            document.getElementById('whatsapp').focus();
            return false;
        }
        
        return true;
    }
    
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
    
    formatarMensagemWhatsApp(dados, idPedido) {
        const itens = this.carrinho.map(item => {
            const subtotalItem = item.preco * item.quantidade;
            return `• ${item.nome} (Tamanho ${item.tamanho})\n   Qtd: ${item.quantidade} | ${formatarMoeda(item.preco)} cada\n   Subtotal: ${formatarMoeda(subtotalItem)}`;
        }).join('\n\n');
        
        const subtotal = this.calcularSubtotal();
        const frete = subtotal >= 250 ? 'GRÁTIS' : 'A combinar';
        const endereco = `${dados.rua}, ${dados.numero}${dados.complemento ? ' - ' + dados.complemento : ''}\n${dados.bairro} - ${dados.cidade}/${dados.estado}\nCEP: ${dados.cep}`;
        
        return `🛒 *NOVO PEDIDO - BIGBABYDOG*\n\n👤 *Cliente:* ${dados.nome}\n📱 *WhatsApp:* ${dados.whatsapp}\n\n📦 *Itens do Pedido:*\n━━━━━━━━━━━━━━━━━━\n${itens}\n━━━━━━━━━━━━━━━━━━\n\n💰 *Resumo:*\nSubtotal: ${formatarMoeda(subtotal)}\nFrete: ${frete}\n*TOTAL: ${formatarMoeda(subtotal)}*\n\n📍 *Endereço de Entrega:*\n${endereco}\n\n💳 *Pagamento:* ${dados.pagamento}\n\n📝 *Obs:* ${dados.observacoes || 'Nenhuma'}\n\n✨ Obrigado pela preferência!`;
    }
    
    async processarPedido() {
        if (!this.validarFormulario()) return;
        
        const dados = this.coletarDados();
        const idPedido = gerarIdPedido();
        const mensagem = this.formatarMensagemWhatsApp(dados, idPedido);
        
        // Salva o pedido no Supabase
        const pedidoParaSalvar = {
            pedido_id: idPedido,
            cliente_nome: dados.nome,
            cliente_whatsapp: dados.whatsapp,
            cep: dados.cep,
            rua: dados.rua,
            numero: dados.numero,
            complemento: dados.complemento,
            bairro: dados.bairro,
            cidade: dados.cidade,
            estado: dados.estado,
            pagamento: dados.pagamento,
            observacoes: dados.observacoes,
            itens: this.carrinho, // JSON array
            subtotal: this.calcularSubtotal(),
            status: 'Novo'
        };
        
        const pedidoSalvo = await salvarPedido(pedidoParaSalvar);
        
        // Limpa o carrinho local
        localStorage.removeItem('bbd_carrinho');
        
        // Abre WhatsApp
        this.abrirWhatsApp(mensagem);
        
        // Mostra confirmação
        this.mostrarConfirmacao(idPedido, mensagem);
    }
    
    abrirWhatsApp(mensagem) {
        const mensagemCodificada = encodeURIComponent(mensagem);
        const url = `https://wa.me/${WHATSAPP_LOJA}?text=${mensagemCodificada}`;
        setTimeout(() => window.open(url, '_blank'), 500);
    }
    
    mostrarConfirmacao(idPedido, mensagem) {
        const overlay = document.getElementById('confirmacaoOverlay');
        if (!overlay) return;
        
        document.getElementById('pedidoNumero').textContent = idPedido;
        
        const btnWppManual = document.getElementById('btnWppManual');
        if (btnWppManual) {
            btnWppManual.onclick = () => this.abrirWhatsApp(mensagem);
        }
        
        overlay.classList.add('show');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.checkout = new Checkout();
});