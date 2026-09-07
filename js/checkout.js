// ============================================================
// CHECKOUT.JS - Finalização do pedido e integração WhatsApp
// ============================================================

console.log('🔥 CHECKOUT.JS carregado!'); // Log inicial para confirmar execução

const WHATSAPP_LOJA = '5512992229727'; // Número da loja (sem +)

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

class Checkout {
    constructor() {
        console.log('🛒 Inicializando checkout...');
        this.carrinho = JSON.parse(localStorage.getItem('bbd_carrinho') || '[]');
        console.log('📦 Itens no carrinho:', this.carrinho);
        this.inicializar();
    }

    inicializar() {
        if (this.carrinho.length === 0) {
            console.warn('⚠️ Carrinho vazio!');
            this.mostrarCarrinhoVazio();
            return;
        }
        console.log('✅ Carrinho tem', this.carrinho.length, 'itens.');
        this.renderizarResumo();
        this.configurarFormulario();
        this.configurarBuscaCEP();
    }

    mostrarCarrinhoVazio() {
        const grid = document.querySelector('.checkout-grid');
        if (grid) {
            grid.innerHTML = `
                <div style="text-align:center;padding:60px 20px;grid-column:1/-1">
                    <i class="fas fa-shopping-cart" style="font-size:4rem;color:var(--text-muted);margin-bottom:20px;display:block"></i>
                    <h2 style="font-family:var(--font-display);color:#fff;margin-bottom:10px">Carrinho Vazio</h2>
                    <p style="color:var(--text-muted);margin-bottom:24px">Adicione produtos antes de finalizar.</p>
                    <a href="loja.html" class="btn btn-primary">IR PARA A LOJA</a>
                </div>
            `;
        }
    }

    renderizarResumo() {
        const container = document.getElementById('resumoItens');
        if (!container) {
            console.error('❌ Elemento #resumoItens não encontrado.');
            return;
        }

        console.log('📝 Renderizando resumo com', this.carrinho.length, 'itens');

        if (this.carrinho.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:var(--text-muted);">Nenhum item no carrinho.</p>';
            return;
        }

        container.innerHTML = this.carrinho.map(item => {
            const imgSrc = item.imagem || 'https://placehold.co/50x60/e0ddd6/1a1a2e?text=...';
            return `
                <div class="checkout-resumo-item">
                    <img src="${imgSrc}" alt="${item.nome}" style="width:50px;height:65px;object-fit:cover;border-radius:6px;">
                    <div style="flex:1">
                        <strong>${item.nome}</strong>
                        <div style="font-size:0.75rem;color:var(--text-muted)">Tam: ${item.tamanho} | Qtd: ${item.quantidade}</div>
                        <div style="font-weight:600;">${formatarMoeda(item.preco * item.quantidade)}</div>
                    </div>
                </div>
            `;
        }).join('');

        const subtotal = this.calcularSubtotal();
        document.getElementById('resumoSubtotal').textContent = formatarMoeda(subtotal);
        document.getElementById('resumoTotal').textContent = formatarMoeda(subtotal);
        document.getElementById('resumoFrete').textContent = subtotal >= 250 ? 'GRÁTIS' : 'A combinar';
        console.log('💰 Subtotal:', subtotal);
    }

    calcularSubtotal() {
        return this.carrinho.reduce((t, item) => t + (item.preco * item.quantidade), 0);
    }

    configurarFormulario() {
        const form = document.getElementById('checkoutForm');
        if (!form) {
            console.error('❌ Formulário #checkoutForm não encontrado.');
            return;
        }

        const btnFinalizar = document.getElementById('btnFinalizarPedido');
        if (btnFinalizar) {
            console.log('✅ Botão finalizar encontrado.');
            btnFinalizar.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🖱️ Clique no botão finalizar.');
                this.processarPedido();
            });
        } else {
            console.error('❌ Botão #btnFinalizarPedido não encontrado.');
        }

        // Máscara WhatsApp
        const whatsappInput = document.getElementById('whatsapp');
        if (whatsappInput) {
            whatsappInput.addEventListener('input', function(e) {
                let value = this.value.replace(/\D/g, '');
                if (value.length > 11) value = value.slice(0, 11);
                if (value.length > 2) {
                    value = `(${value.slice(0,2)}) ${value.slice(2)}`;
                }
                if (value.length > 10) {
                    value = value.slice(0, 10) + '-' + value.slice(10);
                }
                this.value = value;
            });
        }
    }

    configurarBuscaCEP() {
        const cepInput = document.getElementById('cep');
        if (!cepInput) return;

        cepInput.addEventListener('blur', () => {
            const cep = cepInput.value.replace(/\D/g, '');
            if (cep.length === 8) {
                fetch(`https://viacep.com.br/ws/${cep}/json/`)
                    .then(res => res.json())
                    .then(data => {
                        if (!data.erro) {
                            document.getElementById('rua').value = data.logradouro || '';
                            document.getElementById('bairro').value = data.bairro || '';
                        } else {
                            alert('CEP não encontrado!');
                        }
                    })
                    .catch(() => alert('Erro ao buscar CEP. Preencha manualmente.'));
            }
        });
    }

    validarFormulario() {
        const campos = ['nome', 'whatsapp', 'cep', 'rua', 'numero', 'bairro'];
        for (const id of campos) {
            const el = document.getElementById(id);
            if (!el || !el.value.trim()) {
                alert(`Por favor, preencha o campo ${id.charAt(0).toUpperCase() + id.slice(1)}.`);
                if (el) el.focus();
                return false;
            }
        }
        const whats = document.getElementById('whatsapp').value.replace(/\D/g, '');
        if (whats.length < 10) {
            alert('WhatsApp inválido. Informe com DDD.');
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
            pagamento: document.getElementById('pagamento').value,
            observacoes: document.getElementById('observacoes').value.trim()
        };
    }

    formatarMensagemWhatsApp(dados) {
        const itens = this.carrinho.map(item => {
            const subtotalItem = item.preco * item.quantidade;
            return `• ${item.nome} (Tamanho ${item.tamanho})\n   Qtd: ${item.quantidade} | ${formatarMoeda(item.preco)} cada\n   Subtotal: ${formatarMoeda(subtotalItem)}`;
        }).join('\n\n');

        const subtotal = this.calcularSubtotal();
        const frete = subtotal >= 250 ? 'GRÁTIS' : 'A combinar';
        const endereco = `${dados.rua}, ${dados.numero}${dados.complemento ? ' - ' + dados.complemento : ''}\n${dados.bairro}\nCEP: ${dados.cep}`;

        return `🛒 *NOVO PEDIDO - BIGBABYDOG*\n\n👤 *Cliente:* ${dados.nome}\n📱 *WhatsApp:* ${dados.whatsapp}\n\n📦 *Itens do Pedido:*\n━━━━━━━━━━━━━━━━━━\n${itens}\n━━━━━━━━━━━━━━━━━━\n\n💰 *Resumo:*\nSubtotal: ${formatarMoeda(subtotal)}\nFrete: ${frete}\n*TOTAL: ${formatarMoeda(subtotal)}*\n\n📍 *Endereço de Entrega:*\n${endereco}\n\n💳 *Pagamento:* ${dados.pagamento}\n\n📝 *Obs:* ${dados.observacoes || 'Nenhuma'}\n\n✨ Obrigado pela preferência!`;
    }

    async processarPedido() {
        console.log('🚀 processarPedido() chamado.');
        if (!this.validarFormulario()) {
            console.warn('⚠️ Formulário inválido.');
            return;
        }

        const dados = this.coletarDados();
        console.log('📋 Dados coletados:', dados);

        const idPedido = 'BBD-' + Date.now().toString(36).toUpperCase();
        const mensagem = this.formatarMensagemWhatsApp(dados);
        console.log('📨 Mensagem gerada:', mensagem);

        // Salva pedido (opcional)
        try {
            await window.supabase.from('pedidos').insert([{
                pedido_id: idPedido,
                cliente_nome: dados.nome,
                cliente_whatsapp: dados.whatsapp,
                cep: dados.cep,
                rua: dados.rua,
                numero: dados.numero,
                complemento: dados.complemento,
                bairro: dados.bairro,
                pagamento: dados.pagamento,
                observacoes: dados.observacoes,
                itens: this.carrinho,
                subtotal: this.calcularSubtotal(),
                status: 'Novo'
            }]);
            console.log('✅ Pedido salvo no Supabase.');
        } catch (e) {
            console.warn('⚠️ Não foi possível salvar no Supabase:', e);
        }

        // Limpa carrinho
        localStorage.removeItem('bbd_carrinho');
        console.log('🧹 Carrinho limpo.');

        // Abre WhatsApp
        const url = `https://wa.me/${WHATSAPP_LOJA}?text=${encodeURIComponent(mensagem)}`;
        console.log('🔗 Abrindo WhatsApp:', url);
        window.open(url, '_blank');

        // Confirmação
        this.mostrarConfirmacao(idPedido, mensagem);
    }

    mostrarConfirmacao(idPedido, mensagem) {
        const overlay = document.getElementById('confirmacaoOverlay');
        if (!overlay) {
            console.error('❌ Elemento #confirmacaoOverlay não encontrado.');
            return;
        }
        console.log('✅ Mostrando confirmação para o pedido', idPedido);

        document.getElementById('pedidoNumero').textContent = idPedido;
        document.getElementById('btnWppManual').onclick = () => {
            window.open(`https://wa.me/${WHATSAPP_LOJA}?text=${encodeURIComponent(mensagem)}`, '_blank');
        };

        overlay.classList.add('show');
        console.log('✅ Overlay de confirmação ativado.');
    }
}

// ---------- INICIALIZAÇÃO IMEDIATA ----------
// Como o script é module, o DOM já está pronto.
// Verifica se o DOM está carregado, se não, aguarda.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('📄 DOM carregado, iniciando checkout...');
        window.checkout = new Checkout();
    });
} else {
    console.log('📄 DOM já carregado, iniciando checkout imediatamente...');
    window.checkout = new Checkout();
}