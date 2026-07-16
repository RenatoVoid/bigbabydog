/**
 * ==========================================
 * BIGBABY DOG - Script Principal
 * ==========================================
 */

// ==========================================
// 1. DADOS DOS PRODUTOS
// ==========================================
// Altere os caminhos das imagens conforme necessário
// Exemplo: 'imagens/camiseta/nome-da-foto.jpg'
const products = [
    // CAMISETAS
    {
        id: 1,
        name: 'Camiseta the nothe face',
        price: 'R$ 89,90',
        description: 'Disponível: P, M, G, GG',
        image: 'imagens/camiseta/camisa_azul.png',
        category: 'camisetas',
        badge: 'Novo',
        badgeClass: 'badge-new',
        destaque: true
    },
    {
        id: 2,
        name: 'Camiseta the nothe face',
        price: 'R$ 79,90',
        description: 'Disponível: P ao GG',
        image: 'imagens/camiseta/camisa_branca.png',    
        category: 'camisetas',
        badge: '',
        badgeClass: '',
        destaque: false
    },
    {
        id: 3,
        name: 'Camiseta the nothe face',
        price: 'R$ 99,90',
        description: 'Disponível: M, G, GG',
        image: 'imagens/camiseta/camisa_colorida.png',
        category: 'camisetas',
        badge: 'Destaque',
        badgeClass: 'badge-featured',
        destaque: true
    },
    {
        id: 4,
        name: 'Camiseta the nothe face',
        price: 'R$ 109,90',
        description: 'Disponível: P, M, G',
        image: 'imagens/camiseta/camisa_verde.png',
        category: 'camisetas',
        badge: '',
        badgeClass: '',
        destaque: false
    },

    // BLUSAS
    {
        id: 5,
        name: 'Moletom BigBaby',
        price: 'R$ 159,90',
        description: 'Disponível: P, M, G',
        image: 'imagens/blusas/blusa1.png',
        category: 'blusas',
        badge: 'Novo',
        badgeClass: 'badge-new',
        destaque: true
    },
    {
        id: 6,
        name: 'Blusa Crewneck',
        price: 'R$ 139,90',
        description: 'Disponível: P ao GG',
        image: 'imagens/blusas/blusa2.png',
        category: 'blusas',
        badge: '',
        badgeClass: '',
        destaque: false
    },
    {
        id: 7,
        name: 'Blusa Half Zip',
        price: 'R$ 179,90',
        description: 'Disponível: M, G, GG',
        image: 'imagens/blusas/blusa3.png',
        category: 'blusas',
        badge: 'Destaque',
        badgeClass: 'badge-featured',
        destaque: true
    },

    // CORTA VENTO
    {
        id: 8,
        name: 'Corta Vento Classic',
        price: 'R$ 249,90',
        description: 'Disponível: P ao GG',
        image: 'imagens/corta-vento/corta1.png',
        category: 'corta-vento',
        badge: 'Novo',
        badgeClass: 'badge-new',
        destaque: true
    },
    {
        id: 9,
        name: 'Corta Vento Tech',
        price: 'R$ 299,90',
        description: 'Disponível: P, M, G',
        image: 'imagens/corta-vento/corta2.png',
        category: 'corta-vento',
        badge: '',
        badgeClass: '',
        destaque: false
    },

    // JAQUETAS
    {
        id: 10,
        name: 'Jaqueta Puffer',
        price: 'R$ 349,90',
        description: 'Disponível: P, M, G, GG',
        image: 'imagens/jaquetas/jaqueta1.png',
        category: 'jaquetas',
        badge: 'Destaque',
        badgeClass: 'badge-featured',
        destaque: true
    },
    {
        id: 11,
        name: 'Jaqueta Coach',
        price: 'R$ 289,90',
        description: 'Disponível: P ao G',
        image: 'imagens/jaquetas/jaqueta2.png',
        category: 'jaquetas',
        badge: '',
        badgeClass: '',
        destaque: false
    },

    // CALÇAS
    {
        id: 12,
        name: 'Calça Cargo',
        price: 'R$ 189,90',
        description: 'Disponível: 38 ao 46',
        image: 'imagens/calcas/calca1.png',
        category: 'calcas',
        badge: 'Novo',
        badgeClass: 'badge-new',
        destaque: false
    },
    {
        id: 13,
        name: 'Calça Chino',
        price: 'R$ 169,90',
        description: 'Disponível: 36 ao 44',
        image: 'imagens/calcas/calca2.png',
        category: 'calcas',
        badge: '',
        badgeClass: '',
        destaque: false
    },

    // ACESSÓRIOS
    {
        id: 14,
        name: 'Boné BigBaby',
        price: 'R$ 69,90',
        description: 'Tamanho único',
        image: 'imagens/acessorios/acessorio1.png',
        category: 'acessorios',
        badge: '',
        badgeClass: '',
        destaque: true
    },
    {
        id: 15,
        name: 'Mochila Campus',
        price: 'R$ 199,90',
        description: 'Tamanho único',
        image: 'imagens/acessorios/acessorio2.png',
        category: 'acessorios',
        badge: 'Novo',
        badgeClass: 'badge-new',
        destaque: false
    }
];

// ==========================================
// 2. CONFIGURAÇÃO DAS CATEGORIAS
// ==========================================
const categoryConfig = {
    'camisetas': {
        title: 'Camisetas',
        subtitle: 'Básicas e estampadas para o dia a dia',
        icon: 'fa-tshirt'
    },
    'blusas': {
        title: 'Blusas',
        subtitle: 'Moletons e blusas de frio',
        icon: 'fa-vest'
    },
    'corta-vento': {
        title: 'Corta Vento',
        subtitle: 'Leves e estilosos para qualquer ocasião',
        icon: 'fa-wind'
    },
    'jaquetas': {
        title: 'Jaquetas',
        subtitle: 'Aquelas peças que fecham o look',
        icon: 'fa-user-tie'
    },
    'calcas': {
        title: 'Jaquetas Femininas',
        subtitle: 'Conforto e estilo em primeiro lugar',
        icon: 'fa-socks'
    },
    'acessorios': {
        title: 'Acessórios',
        subtitle: 'Completando o visual com atitude',
        icon: 'fa-gem'
    }
};

// ==========================================
// 3. ELEMENTOS DO DOM
// ==========================================
const mainContent = document.getElementById('main-content');
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const sidebarClose = document.getElementById('sidebar-close');
const overlay = document.getElementById('overlay');
const header = document.getElementById('header');
const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const modalInfo = document.getElementById('modal-info');
const modalCloseBtn = document.getElementById('modal-close');

// ==========================================
// 4. GERENCIAMENTO DE PÁGINAS
// ==========================================
let currentPage = 'home';

function navigateTo(page) {
    currentPage = page;
    updateActiveLinks(page);
    
    switch(page) {
        case 'home':
            renderHomePage();
            break;
        case 'contato':
            renderContactPage();
            break;
        default:
            if (categoryConfig[page]) {
                renderCategoryPage(page);
            } else {
                renderHomePage();
            }
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeSidebar();
    window.location.hash = page;
}

function updateActiveLinks(page) {
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === page) {
            link.classList.add('active');
        }
    });
}

// ==========================================
// 5. RENDERIZAÇÃO DA HOME
// ==========================================
function renderHomePage() {
    const produtosDestaque = products.filter(p => p.destaque);
    
    mainContent.innerHTML = `
        <div class="home-page">
            <section class="hero">
                <div class="container">
                    <div class="hero-content">
                        <span class="hero-badge">Coleção 2024</span>
                        <h1 class="hero-title">BIGBABY DOG</h1>
                        <p class="hero-subtitle">Streetwear autêntico com atitude college</p>
                        <div class="hero-buttons">
                            <button class="btn btn-primary" onclick="navigateTo('camisetas')">
                                Ver Catálogo <i class="fas fa-arrow-right"></i>
                            </button>
                            <button class="btn btn-outline" onclick="navigateTo('corta-vento')">
                                Lançamentos <i class="fas fa-star"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section class="promos">
                <div class="container">
                    <h2 class="promos-title">Promoções da Semana</h2>
                    <p class="promos-subtitle">Ofertas especiais por tempo limitado</p>
                    <div class="promos-grid">
                        <div class="promo-card large" onclick="navigateTo('blusas')">
                            <img src="imagens/destaque/blusa_destaque.png" alt="Promo Blusas" class="promo-image">
                            <div class="promo-overlay">
                                <span class="promo-label">Até 30% OFF</span>
                                <h3 class="promo-name">Blusas e Moletons</h3>
                                <p class="promo-desc">Aqueça seu estilo sem esfriar o bolso</p>
                            </div>
                        </div>
                        <div class="promo-card" onclick="navigateTo('jaquetas')">
                            <img src="imagens/destaque/jaqueta_destaque.png" alt="Promo Jaquetas" class="promo-image">
                            <div class="promo-overlay">
                                <span class="promo-label">Lançamento</span>
                                <h3 class="promo-name">Jaquetas</h3>
                                <p class="promo-desc">Nova coleção disponível</p>
                            </div>
                        </div>
                        <div class="promo-card" onclick="navigateTo('acessorios')">
                            <img src="imagens/promos/promo-acessorios.jpg" alt="Promo Acessórios" class="promo-image">
                            <div class="promo-overlay">
                                <span class="promo-label">Compre Junto</span>
                                <h3 class="promo-name">Acessórios</h3>
                                <p class="promo-desc">Complete seu look</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="destaques">
                <div class="container">
                    <h2 class="destaques-title">🔥 Destaques</h2>
                    <p class="destaques-subtitle">As peças mais amadas da semana</p>
                    <div class="destaques-grid" id="destaques-grid">
                        ${renderProductCards(produtosDestaque.slice(0, 4))}
                    </div>
                </div>
            </section>
        </div>
    `;
    
    attachCardEvents();
}

// ==========================================
// 6. RENDERIZAÇÃO DE CATEGORIA
// ==========================================
function renderCategoryPage(category) {
    const config = categoryConfig[category];
    const categoryProducts = products.filter(p => p.category === category);
    
    mainContent.innerHTML = `
        <div class="category-page">
            <div class="container">
                <a class="category-back" onclick="navigateTo('home')">
                    <i class="fas fa-arrow-left"></i> Voltar para Home
                </a>
                <div class="category-header">
                    <h1 class="category-title">${config.title}</h1>
                    <p class="category-subtitle">${config.subtitle}</p>
                </div>
                <div class="category-grid" id="category-grid">
                    ${renderProductCards(categoryProducts)}
                </div>
            </div>
        </div>
    `;
    
    attachCardEvents();
}

// ==========================================
// 7. RENDERIZAÇÃO DE CONTATO
// ==========================================
function renderContactPage() {
    mainContent.innerHTML = `
        <div class="contact-page">
            <div class="container">
                <h1 class="contact-title">Fale com a Gente</h1>
                <p class="contact-subtitle">Faça seu pedido ou tire dúvidas</p>
                <div class="contact-cards">
                    <a href="https://instagram.com/renato._.dtk" target="_blank" class="contact-card">
                        <i class="fab fa-instagram"></i>
                        <span class="contact-card-label">Instagram</span>
                        <span class="contact-card-value">@bigbabydog</span>
                    </a>
                    <a href="https://wa.me/5500000000000" target="_blank" class="contact-card">
                        <i class="fab fa-whatsapp"></i>
                        <span class="contact-card-label">WhatsApp</span>
                        <span class="contact-card-value">Fazer Pedido</span>
                    </a>
                    <a href="mailto:contato@bigbabydog.com" class="contact-card">
                        <i class="far fa-envelope"></i>
                        <span class="contact-card-label">E-mail</span>
                        <span class="contact-card-value">contato@bigbabydog.com</span>
                    </a>
                </div>
            </div>
        </div>
    `;
}

// ==========================================
// 8. RENDERIZAÇÃO DE CARDS
// ==========================================
function renderProductCards(productList) {
    if (!productList || productList.length === 0) {
        return `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <p>Nenhum produto aqui ainda</p>
            </div>
        `;
    }
    
    return productList.map((product, index) => `
        <article class="product-card" data-product-id="${product.id}" style="animation-delay: ${index * 0.08}s">
            <div class="product-image-wrapper">
                <img 
                    src="${product.image}" 
                    alt="${product.name}" 
                    class="product-image"
                    loading="lazy"
                >
            </div>
            <div class="product-details">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${product.price}</p>
                <p class="product-description">${product.description}</p>
                ${product.badge ? `<span class="product-badge ${product.badgeClass}">${product.badge}</span>` : ''}
            </div>
        </article>
    `).join('');
}

function attachCardEvents() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            const product = products.find(p => p.id === productId);
            if (product) {
                openModal(product);
            }
        });
    });
}

// ==========================================
// 9. MODAL
// ==========================================
function openModal(product) {
    modalImage.src = product.image;
    modalImage.alt = product.name;
    modalInfo.textContent = `${product.name} - ${product.price}`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
        if (!modal.classList.contains('active')) {
            modalImage.src = '';
        }
    }, 300);
}

modalCloseBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// ==========================================
// 10. MENU LATERAL
// ==========================================
function openSidebar() {
    sidebar.classList.add('active');
    overlay.classList.add('active');
    hamburger.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', openSidebar);
sidebarClose.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

document.querySelectorAll('.sidebar-link[data-page]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const page = this.getAttribute('data-page');
        navigateTo(page);
    });
});

document.querySelector('.header-logo').addEventListener('click', function(e) {
    e.preventDefault();
    navigateTo('home');
});

// ==========================================
// 11. TECLAS
// ==========================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (modal.classList.contains('active')) closeModal();
        if (sidebar.classList.contains('active')) closeSidebar();
    }
});

// ==========================================
// 12. EFEITO SCROLL NO HEADER
// ==========================================
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 30) {
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
    } else {
        header.style.boxShadow = 'none';
    }
});

// ==========================================
// 13. INICIALIZAÇÃO
// ==========================================
function init() {
    console.log('🐕 BIGBABY DOG - Catálogo iniciado!');
    
    const hash = window.location.hash.replace('#', '');
    const validPages = ['home', 'contato', ...Object.keys(categoryConfig)];
    
    if (hash && validPages.includes(hash)) {
        navigateTo(hash);
    } else {
        navigateTo('home');
    }
}

window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    const validPages = ['home', 'contato', ...Object.keys(categoryConfig)];
    
    if (hash && validPages.includes(hash) && hash !== currentPage) {
        navigateTo(hash);
    }
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ==========================================
// 14. UTILITÁRIOS
// ==========================================
window.addProduct = function(name, price, description, image, category, badge = '', badgeClass = '', destaque = false) {
    const validCategories = Object.keys(categoryConfig);
    
    if (!name || !price || !category) {
        console.error('❌ Nome, preço e categoria são obrigatórios!');
        return null;
    }
    
    if (!validCategories.includes(category)) {
        console.error(`❌ Categoria inválida! Use: ${validCategories.join(', ')}`);
        return null;
    }
    
    const newProduct = {
        id: products.length + 1,
        name,
        price,
        description: description || '',
        image: image || '',
        category,
        badge,
        badgeClass,
        destaque
    };
    
    products.push(newProduct);
    console.log('✅ Produto adicionado:', newProduct.name);
    navigateTo(currentPage);
    
    return newProduct;
};

console.log('🐕 BIGBABY DOG pronto!');