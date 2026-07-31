// ============================================================
// DADOS DOS PRODUTOS - BIGBABYDOG
// Array com 10 produtos para o catálogo
// ============================================================

const PRODUTOS = [
    {
        id: 1,
        nome: "Camiseta Caveira",
        categoria: "camiseta",
        preco: 89.90,
        precoAntigo: null,
        descricao: "Camiseta 100% algodão com estampa exclusiva de caveira cyberpunk. Estilo urbano e atitude para o seu dia a dia. Corte moderno, costura reforçada e estampa de alta durabilidade.",
        imagens: [
            "https://placehold.co/600x800/1a1a2e/b366ff?text=Camiseta+Caveira",
            "https://placehold.co/600x800/1a1a2e/b366ff?text=Costas+Caveira",
            "https://placehold.co/600x800/1a1a2e/b366ff?text=Detalhe+Caveira"
        ],
        tamanhos: ["P", "M", "G", "GG"],
        destaque: true,
        novo: false
    },
    {
        id: 2,
        nome: "Moletom Fênix",
        categoria: "moletom",
        preco: 159.90,
        precoAntigo: null,
        descricao: "Moletom quentinho com design da Fênix flamejante. Capuz forrado, bolso canguru e punhos elásticos. Perfeito para os dias frios com muito estilo.",
        imagens: [
            "https://placehold.co/600x800/1a1a2e/b366ff?text=Moletom+Fenix",
            "https://placehold.co/600x800/1a1a2e/b366ff?text=Costas+Fenix",
            "https://placehold.co/600x800/1a1a2e/b366ff?text=Detalhe+Fenix"
        ],
        tamanhos: ["P", "M", "G", "GG"],
        destaque: true,
        novo: false
    },
    {
        id: 3,
        nome: "Tênis Phantom",
        categoria: "tenis",
        preco: 299.90,
        precoAntigo: 349.90,
        descricao: "Tênis Phantom com solado robusto e design futurista. Cabedal em mesh respirável, entressola com amortecimento responsivo. Conforto e estilo para qualquer ocasião.",
        imagens: [
            "https://placehold.co/600x800/1a1a2e/b366ff?text=Tenis+Phantom",
            "https://placehold.co/600x800/1a1a2e/b366ff?text=Lateral+Phantom",
            "https://placehold.co/600x800/1a1a2e/b366ff?text=Solado+Phantom"
        ],
        tamanhos: ["38", "39", "40", "41", "42", "43"],
        destaque: true,
        novo: false
    },
    {
        id: 4,
        nome: "Calça Cyberpunk",
        categoria: "calca",
        preco: 189.90,
        precoAntigo: null,
        descricao: "Calça cargo com múltiplos bolsos e fit moderno. Tecido resistente com elastano para maior conforto. Fechamento por zíper e botão, passantes largos.",
        imagens: [
            "https://placehold.co/600x800/1a1a2e/b366ff?text=Calca+Cyberpunk",
            "https://placehold.co/600x800/1a1a2e/b366ff?text=Costas+Calca",
            "https://placehold.co/600x800/1a1a2e/b366ff?text=Detalhe+Calca"
        ],
        tamanhos: ["P", "M", "G", "GG"],
        destaque: false,
        novo: true
    },
    {
        id: 5,
        nome: "Camiseta Neon",
        categoria: "camiseta",
        preco: 79.90,
        precoAntigo: 99.90,
        descricao: "Camiseta com estampa que brilha no escuro! Efeito neon real que se destaca em festas e eventos. Algodão premium, lavagem resistente.",
        imagens: [
            "https://placehold.co/600x800/1a1a2e/b366ff?text=Camiseta+Neon",
            "https://placehold.co/600x800/1a1a2e/b366ff?text=Neon+no+Escuro",
            "https://placehold.co/600x800/1a1a2e/b366ff?text=Detalhe+Neon"
        ],
        tamanhos: ["P", "M", "G", "GG"],
        destaque: false,
        novo: false
    },
    {
        id: 6,
        nome: "Moletom Void",
        categoria: "moletom",
        preco: 179.90,
        precoAntigo: 219.90,
        descricao: "Moletom preto absoluto com bordado minimalista. Conforto máximo, forro felpudo interno, capuz com cordão personalizado. Peça essencial do guarda-roupa.",
        imagens: [
            "https://placehold.co/600x800/1a1a2e/b366ff?text=Moletom+Void",
            "https://placehold.co/600x800/1a1a2e/b366ff?text=Costas+Void",
            "https://placehold.co/600x800/1a1a2e/b366ff?text=Bordado+Void"
        ],
        tamanhos: ["P", "M", "G", "GG"],
        destaque: false,
        novo: true
    },
    {
        id: 7,
        nome: "Tênis Matrix",
        categoria: "tenis",
        preco: 349.90,
        precoAntigo: null,
        descricao: "Tênis high-top com design Matrix. Solado tratorado, cano alto acolchoado, fita de velcro estratégica. Máximo conforto e estilo ousado.",
        imagens: [
            "https://placehold.co/600x800/1a1a2e/b366ff?text=Tenis+Matrix",
            "https://placehold.co/600x800/1a1a2e/b366ff?text=Lateral+Matrix",
            "https://placehold.co/600x800/1a1a2e/b366ff?text=Detalhe+Matrix"
        ],
        tamanhos: ["38", "39", "40", "41", "42", "43"],
        destaque: false,
        novo: false
    },
    {
        id: 8,
        nome: "Boné Holográfico",
        categoria: "acessorio",
        preco: 69.90,
        precoAntigo: null,
        descricao: "Boné com efeito holográfico que muda de cor conforme o ângulo. Fecho ajustável, aba curva, bordado lateral. Acessório que não passa despercebido.",
        imagens: [
            "https://placehold.co/600x800/1a1a2e/b366ff?text=Bone+Holografico",
            "https://placehold.co/600x800/1a1a2e/b366ff?text=Lateral+Bone",
            "https://placehold.co/600x800/1a1a2e/b366ff?text=Detalhe+Bone"
        ],
        tamanhos: ["Único"],
        destaque: false,
        novo: true
    },
    {
        id: 9,
        nome: "Calça Techwear",
        categoria: "calca",
        preco: 219.90,
        precoAntigo: 259.90,
        descricao: "Calça techwear com design utilitário. Tecido impermeável, bolsos estratégicos, joelheiros articulados. Estética futurista com funcionalidade real.",
        imagens: [
            "https://placehold.co/600x800/1a1a2e/b366ff?text=Calca+Techwear",
            "https://placehold.co/600x800/1a1a2e/b366ff?text=Costas+Techwear",
            "https://placehold.co/600x800/1a1a2e/b366ff?text=Bolsos+Techwear"
        ],
        tamanhos: ["P", "M", "G", "GG"],
        destaque: false,
        novo: false
    },
    {
        id: 10,
        nome: "Pulseira LED",
        categoria: "acessorio",
        preco: 49.90,
        precoAntigo: null,
        descricao: "Pulseira com LED integrado e modo piscante. Bateria recarregável via USB, ajuste universal. Ideal para festivais, raves e rolês noturnos.",
        imagens: [
            "https://placehold.co/600x800/1a1a2e/b366ff?text=Pulseira+LED",
            "https://placehold.co/600x800/1a1a2e/b366ff?text=LED+Aceso",
            "https://placehold.co/600x800/1a1a2e/b366ff?text=Detalhe+LED"
        ],
        tamanhos: ["Único"],
        destaque: false,
        novo: true
    }
];