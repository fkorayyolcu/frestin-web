import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Search,
  Check,
  X,
  Plus,
  Minus,
  Star,
  Sliders,
  ArrowRight,
  ShieldCheck,
  Truck,
  CreditCard,
  Award,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Layers,
  ExternalLink,
  Copy,
  CheckCircle2,
  Zap,
  Instagram,
  PackageCheck,
  RotateCcw
} from 'lucide-react';

// ==========================================
// SABİT FİYATLAR & GENEL SHOPIER BAĞLANTILARI
// ==========================================
const PRICE_50ML = 860;
const PRICE_100ML = 1550;

const SHOPIER_LINKS = {
  '50ml': 'https://www.shopier.com/frestinperfumes/52434473',
  '100ml': 'https://www.shopier.com/frestinperfumes/52434538',
  store: 'https://www.shopier.com/frestinperfumes'
};

const INSTAGRAM_URL = 'https://www.instagram.com/frestin_perfumes/';

const INITIAL_CATALOG = [
  {
    id: 'frestin-101',
    code: 'F-01',
    name: 'Frestin Althaïr',
    subtitle: 'Bourbon Vanilya & Tarçın • Extrait de Parfum',
    fragranticaRef: 'Parfums de Marly Althaïr',
    gender: 'Unisex',
    inStock: true,
    stockCount: 5,
    shopierLink50: 'https://www.shopier.com/frestinperfumes/52434473',
    shopierLink100: 'https://www.shopier.com/frestinperfumes/52434538',
    bottleColor: '#7C1D1D',
    liquidColor: '#F0D4A3',
    rating: 4.9,
    reviewsCount: 42,
    matchPercent: 98,
    notes: [
      { name: 'Deri', percent: 80, color: '#7F5539' },
      { name: 'Narenciye', percent: 76, color: '#E9C46A' }
    ],
    pyramid: {
      top: ['Kan Portakalı', 'Greyfurt', 'Yeşil Elma'],
      heart: ['Tarçın', 'Türk Gülü'],
      base: ['Kehribar (Amber)', 'Deri', 'Tonka Fasulyesi', 'Paçuli']
    }
  },
  {
    id: 'frestin-102',
    code: 'F-02',
    name: "Frestin L'Eau Par",
    subtitle: 'Ferah & Akuatik • Extrait de Parfum',
    fragranticaRef: 'Acqua di Giò Profondo & Fresh Series',
    gender: 'Erkek',
    inStock: true,
    stockCount: 4,
    shopierLink50: 'https://www.shopier.com/frestinperfumes/52434473',
    shopierLink100: 'https://www.shopier.com/frestinperfumes/52434538',
    bottleColor: '#1E293B',
    liquidColor: '#DCE7EB',
    rating: 4.8,
    reviewsCount: 35,
    matchPercent: 95,
    notes: [
      { name: 'Deniz Notaları', percent: 88, color: '#457B9D' },
      { name: 'Bergamot', percent: 82, color: '#E9C46A' }
    ],
    pyramid: {
      top: ['Deniz Notaları', 'Bergamot', 'Akuatik Akor'],
      heart: ['Biberiye', 'Selin', 'Lavanta'],
      base: ['Misk', 'Paçuli', 'Amber']
    }
  },
  {
    id: 'frestin-103',
    code: 'F-03',
    name: 'Frestin Bordo 50ml',
    subtitle: 'Signature Rouge Serisi • Extrait de Parfum',
    fragranticaRef: 'Baccarat Rouge 540 Inspiration',
    gender: 'Unisex',
    inStock: true,
    stockCount: 6,
    shopierLink50: 'https://www.shopier.com/frestinperfumes/52434473',
    shopierLink100: 'https://www.shopier.com/frestinperfumes/52434538',
    bottleColor: '#6E1E26',
    liquidColor: '#F2D4A3',
    rating: 5.0,
    reviewsCount: 68,
    matchPercent: 99,
    notes: [
      { name: 'Safran', percent: 92, color: '#D4A373' },
      { name: 'Yasemin', percent: 85, color: '#FEFAE0' }
    ],
    pyramid: {
      top: ['Safran', 'Yasemin'],
      heart: ['Amberwood', 'Ambregris'],
      base: ['Köpknar Reçinesi', 'Sedir']
    }
  },
  {
    id: 'frestin-104',
    code: 'F-04',
    name: 'Frestin Profondo',
    subtitle: 'Derin & Ferah • Extrait de Parfum',
    fragranticaRef: 'Alien & Profondo Mix',
    gender: 'Kadın',
    inStock: true,
    stockCount: 3,
    shopierLink50: 'https://www.shopier.com/frestinperfumes/52434473',
    shopierLink100: 'https://www.shopier.com/frestinperfumes/52434538',
    bottleColor: '#1F242D',
    liquidColor: '#F7E6D0',
    rating: 4.9,
    reviewsCount: 29,
    matchPercent: 97,
    notes: [
      { name: 'Yasemin', percent: 90, color: '#E9C46A' },
      { name: 'Cashmeran', percent: 84, color: '#A3A380' }
    ],
    pyramid: {
      top: ['Zambak', 'Yasemin'],
      heart: ['Cashmeran Notaları'],
      base: ['Beyaz Amber', 'Misk']
    }
  }
];

const INITIAL_NOTE_CATEGORIES = [
  'Bergamot', 'Limon', 'Portakal', 'Lavanta', 'Tarçın', 'Vanilya', 'Amber', 'Misk', 'Sedir Ağacı', 'Paçuli', 'Gül', 'Yasemin', 'Deri', 'Tütün', 'Karamel', 'Oud'
];

const getEstimatedShippingDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 20);
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
};

// ==========================================
// FRESTIN LOGO BİLEŞENİ
// ==========================================
const FrestinBrandLogo = ({ size = 'md', showText = true }) => {
  // Logo yüksekliği tam olarak yanındaki FRESTIN + PERFUME yazı bloğunun toplam yüksekliğiyle eşleşir
  const dimensions =
    size === 'lg'
      ? { box: 'w-14 h-14 sm:w-16 sm:h-16', title: 'text-3xl sm:text-4xl', sub: 'text-[10px] sm:text-xs' }
      : size === 'sm'
      ? { box: 'w-8 h-8', title: 'text-lg', sub: 'text-[8px]' }
      : { box: 'w-10 h-10 sm:w-11 sm:h-11', title: 'text-xl sm:text-2xl', sub: 'text-[9px] sm:text-[10px]' };

  return (
    <div className="inline-flex items-center gap-3 select-none">
      <div
        className={`${dimensions.box} rounded-full overflow-hidden shadow-md border border-[#E86F38]/40 shrink-0 relative flex items-center justify-center bg-gradient-to-tr from-[#E62E2D] via-[#EF5B35] to-[#F7943C]`}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="frestinLogoGrad" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#F52828" />
              <stop offset="55%" stopColor="#F25C33" />
              <stop offset="100%" stopColor="#F89843" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="98" fill="url(#frestinLogoGrad)" />
          <g fill="#2B0E0A">
            <path d="M76 46 L101 18 L128 20 L132 45 L146 53 C146 53 122 54 102 49 C85 45 72 48 76 46 Z" />
            <path d="M96 46 C94 55 96 62 100 66 C100 72 97 82 96 95 L96 122 L147 122 L148 85 C152 80 150 68 140 52 Z" />
            <path d="M56 122 L58 106 C51 98 48 86 52 75 C56 64 68 58 79 57 L81 62 C86 66 91 71 95 73 C94 78 96 82 100 86 C97 92 95 98 95 104 L98 122 Z" />
          </g>
          <text x="100" y="147" textAnchor="middle" fill="#140907" fontSize="22" fontWeight="800" letterSpacing="2" fontFamily="serif">
            FRESTIN
          </text>
          <text x="100" y="163" textAnchor="middle" fill="#140907" fontSize="10" fontWeight="500" letterSpacing="5" fontFamily="sans-serif">
            PERFUME
          </text>
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col justify-between leading-none py-0.5 text-left">
          <div className={`font-serif-luxury ${dimensions.title} font-bold tracking-[0.16em] text-[#1E1E1C] leading-none`}>
            FRESTIN
          </div>
          <div className={`${dimensions.sub} tracking-[0.34em] text-[#78756E] uppercase font-semibold leading-none mt-1.5`}>
            PERFUME
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// ŞİŞE SVG BİLEŞENİ
// ==========================================
const RealFrestinBottleCardSVG = ({ labelColor = '#6E1E26', borderColor = '#D5B07C', liquidTint = '#E8D5C4', title = 'FRESTIN', subLabel = '50 ml' }) => {
  return (
    <div className="relative w-40 h-52 flex items-center justify-center select-none mx-auto">
      <svg viewBox="0 0 180 230" className="w-full h-full drop-shadow-xl">
        <defs>
          <linearGradient id={`real-liq-${title}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={liquidTint} stopOpacity="0.88" />
            <stop offset="100%" stopColor="#C9A66B" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id="goldBand" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#B68D40" />
            <stop offset="50%" stopColor="#F4E29F" />
            <stop offset="100%" stopColor="#9E742B" />
          </linearGradient>
        </defs>
        <ellipse cx="90" cy="216" rx="58" ry="7" fill="rgba(20,20,18,0.16)" />
        <rect x="65" y="14" width="50" height="7" rx="1.5" fill="url(#goldBand)" />
        <rect x="65" y="21" width="50" height="36" rx="2" fill="#141413" />
        <rect x="71" y="21" width="5" height="36" fill="rgba(255,255,255,0.16)" />
        <rect x="104" y="21" width="3" height="36" fill="rgba(255,255,255,0.08)" />
        <rect x="67" y="57" width="46" height="9" rx="1" fill="url(#goldBand)" />
        <rect x="26" y="66" width="128" height="144" rx="8" fill="#FAF8F5" stroke="#C8C2B8" strokeWidth="2.5" />
        <path d="M34 80 Q90 84 146 80 L146 190 Q146 196 138 196 L42 196 Q34 196 34 190 Z" fill={`url(#real-liq-${title})`} />
        <rect x="28" y="196" width="124" height="12" rx="3" fill="rgba(255,255,255,0.75)" />
        <line x1="90" y1="66" x2="85" y2="194" stroke="rgba(90,90,85,0.35)" strokeWidth="1.6" />
        <rect x="45" y="92" width="90" height="90" rx="3" fill={labelColor} stroke={borderColor} strokeWidth="2" />
        <rect x="49" y="96" width="82" height="82" rx="2" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
        <text x="90" y="112" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="700" letterSpacing="2" fontFamily="serif">FRESTIN</text>
        <g fill="#160B09" transform="translate(56, 114) scale(0.35)">
          <path d="M76 26 L101 0 L128 2 L132 25 L146 33 C146 33 122 34 102 29 C85 25 72 28 76 26 Z" />
          <path d="M96 26 C94 35 96 42 100 46 C100 52 97 62 96 75 L96 112 L147 112 L148 65 C152 60 150 48 140 32 Z" />
          <path d="M50 112 L54 90 C47 82 44 70 48 59 C52 48 64 42 75 41 L79 48 C84 52 91 57 95 59 C94 64 96 68 100 72 C97 78 95 84 95 90 L98 112 Z" />
        </g>
        <text x="90" y="170" textAnchor="middle" fill="#F5E6D3" fontSize="8.5" fontWeight="600" letterSpacing="1.2" fontFamily="serif">{subLabel}</text>
      </svg>
    </div>
  );
};

// ==========================================
// ANA UYGULAMA BİLEŞENİ
// ==========================================
export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const [catalog] = useState(INITIAL_CATALOG);

  const [selectedRefIds, setSelectedRefIds] = useState(['frestin-101', 'frestin-102']);
  const [refSearchQuery, setRefSearchQuery] = useState('');
  const [likedNotes, setLikedNotes] = useState(['Bergamot', 'Sedir Ağacı', 'Vanilya']);
  const [dislikedNotes, setDislikedNotes] = useState([]);
  const [noteSelectionMode, setNoteSelectionMode] = useState('like');

  const [selectedSizes, setSelectedSizes] = useState({});
  const [detailModalProduct, setDetailModalProduct] = useState(null);

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [shopierRedirectModal, setShopierRedirectModal] = useState(null);

  const getSelectedSize = (productId) => selectedSizes[productId] || '50ml';
  const setSelectedSize = (productId, size) => setSelectedSizes((prev) => ({ ...prev, [productId]: size }));

  const addToCart = (product, size) => {
    const price = product.customPrice || (size === '100ml' ? PRICE_100ML : PRICE_50ML);
    const cartItemId = `${product.id}-${size}`;
    const existing = cart.find((i) => i.cartItemId === cartItemId);
    if (existing) {
      setCart(cart.map((i) => (i.cartItemId === cartItemId ? { ...i, qty: i.qty + 1 } : i)));
    } else {
      setCart([...cart, { ...product, size, price, qty: 1, cartItemId }]);
    }
    setToastMessage(`${product.name} (${size}) sepetinize eklendi!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const updateCartQty = (cartItemId, delta) => {
    setCart(
      cart
        .map((i) => (i.cartItemId === cartItemId ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);
  const cartSubtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart]);
  const cartTotal = cartSubtotal;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E1C] flex flex-col font-sans selection:bg-[#E6482E] selection:text-white">
      {/* NAVİGASYON HEADER */}
      <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E6E0D6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
          <button onClick={() => setActiveTab('home')} className="text-left group focus:outline-none shrink-0">
            <FrestinBrandLogo size="md" showText={true} />
          </button>

          <nav className="hidden lg:flex items-center bg-[#F3EFE6] p-1.5 rounded-full border border-[#E6E0D6]">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'home' ? 'bg-[#1E1E1C] text-[#FAF7F2] shadow-sm' : 'text-[#5A5751] hover:text-[#1E1E1C]'
              }`}
            >
              <span>Ana Sayfa</span>
            </button>
            <button
              onClick={() => setActiveTab('finder')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'finder' ? 'bg-[#1E1E1C] text-[#FAF7F2] shadow-sm' : 'text-[#5A5751] hover:text-[#1E1E1C]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D99B72]" />
              <span>Parfümünü Bul</span>
            </button>
            <button
              onClick={() => setActiveTab('instock')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'instock' ? 'bg-[#4A7C59] text-white shadow-sm' : 'text-[#4A7C59] hover:bg-[#4A7C59]/10'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Stoklu Ürünlerimiz</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E9C46A] text-[#1E1E1C] font-bold">Hemen Teslim</span>
            </button>
            <button
              onClick={() => setActiveTab('store')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'store' ? 'bg-[#1E1E1C] text-[#FAF7F2] shadow-sm' : 'text-[#5A5751] hover:text-[#1E1E1C]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Tüm Parfümler ({catalog.length}+)</span>
            </button>
            <button
              onClick={() => setActiveTab('process')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'process' ? 'bg-[#1E1E1C] text-[#FAF7F2] shadow-sm' : 'text-[#5A5751] hover:text-[#1E1E1C]'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-[#B86B43]" />
              <span>Üretim & Teslimat</span>
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#833AB4]/10 via-[#FD1D1D]/10 to-[#FCB045]/10 hover:from-[#833AB4] hover:to-[#FCB045] text-[#1E1E1C] hover:text-white border border-[#DED8CE] px-3.5 py-2 rounded-full text-xs font-bold transition-all"
              title="Instagram'da Bizi Takip Edin"
            >
              <Instagram className="w-4 h-4 text-[#C13584]" />
              <span className="hidden sm:inline">@frestin_perfumes</span>
            </a>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-white hover:bg-[#F3EFE6] text-[#1E1E1C] border border-[#DED8CE] px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 text-[#B86B43]" />
              <span className="hidden sm:inline">Sepetim</span>
              <span className="bg-[#1E1E1C] text-[#FAF7F2] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobil Sekmeler */}
        <div className="flex lg:hidden border-t border-[#E6E0D6] bg-[#F3EFE6] px-2 py-1.5 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex-1 py-2 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 whitespace-nowrap ${
              activeTab === 'home' ? 'bg-[#1E1E1C] text-white' : 'text-[#5A5751]'
            }`}
          >
            Ana Sayfa
          </button>
          <button
            onClick={() => setActiveTab('finder')}
            className={`flex-1 py-2 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 whitespace-nowrap ${
              activeTab === 'finder' ? 'bg-[#1E1E1C] text-white' : 'text-[#5A5751]'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#D99B72]" /> Parfümünü Bul
          </button>
          <button
            onClick={() => setActiveTab('instock')}
            className={`flex-1 py-2 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 whitespace-nowrap ${
              activeTab === 'instock' ? 'bg-[#4A7C59] text-white' : 'text-[#4A7C59]'
            }`}
          >
            <Zap className="w-3 h-3" /> Stoklu Ürünler
          </button>
          <button
            onClick={() => setActiveTab('store')}
            className={`flex-1 py-2 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 whitespace-nowrap ${
              activeTab === 'store' ? 'bg-[#1E1E1C] text-white' : 'text-[#5A5751]'
            }`}
          >
            <ShoppingBag className="w-3 h-3" /> Mağaza
          </button>
          <button
            onClick={() => setActiveTab('process')}
            className={`flex-1 py-2 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 whitespace-nowrap ${
              activeTab === 'process' ? 'bg-[#1E1E1C] text-white' : 'text-[#5A5751]'
            }`}
          >
            <Clock className="w-3 h-3" /> Teslimat
          </button>
        </div>
      </header>

      {/* TOAST BİLDİRİMİ */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E1E1C] text-[#FAF7F2] px-5 py-3.5 rounded-2xl shadow-xl border border-[#B86B43]/40 flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-[#B86B43] flex items-center justify-center text-white shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* ================= İLGİ ÇEKİCİ AÇILIŞ SAYFASI (ANA SAYFA) ================= */}
      {activeTab === 'home' && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          {/* HERO ALANI */}
          <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#191716] via-[#261D1A] to-[#3B231A] text-white shadow-2xl border border-[#E86F38]/25">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-[#F52828]/20 to-[#F89843]/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#E86F38]/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-12 lg:p-16">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#F89843] text-xs font-bold tracking-wider uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Yüksek Esans Oranı • Extrait de Parfum</span>
                </div>

                <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.12] tracking-tight">
                  Senin Kokun, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F54E38] via-[#F89843] to-[#F4D092]">
                    Senin İmzan.
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-[#DED8CE] leading-relaxed max-w-xl">
                  Amacımız en düşük fiyata parfüm satmak değil; dünyaca ünlü esans üreticilerinden seçilmiş en saf notaları, kokunun kimyasını bozmadan yüksek esans oranıyla kristal şişelerimizde buluşturmaktır.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('instock')}
                    className="px-6 py-4 rounded-2xl bg-gradient-to-r from-[#E62E2D] via-[#EF5B35] to-[#F7943C] hover:opacity-95 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xl transition-all cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Hemen Teslim Stoklu Parfümler</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('finder')}
                    className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#F89843]" />
                    <span>Kendi Parfümünü Bul</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-lg">
                  <div>
                    <div className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#F89843]">%28</div>
                    <div className="text-[11px] text-[#C8C2B8]">Saf Extrait Esans</div>
                  </div>
                  <div>
                    <div className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#F89843]">1. Sınıf</div>
                    <div className="text-[11px] text-[#C8C2B8]">Kristal Şişe & Valf</div>
                  </div>
                  <div>
                    <div className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#F89843]">24 Saat</div>
                    <div className="text-[11px] text-[#C8C2B8]">Stoktan Hızlı Kargo</div>
                  </div>
                </div>
              </div>

              {/* SAĞ VİTRİN: İMZA ŞİŞELERİMİZ */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="relative w-full max-w-md bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#F89843]">İmza Koleksiyonumuz</span>
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#4A7C59] text-white font-bold">50 ml & 100 ml</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div
                      onClick={() => setDetailModalProduct(catalog[0])}
                      className="bg-black/25 hover:bg-black/40 p-4 rounded-2xl border border-white/10 cursor-pointer transition-all text-center group"
                    >
                      <div className="group-hover:scale-105 transition-transform">
                        <RealFrestinBottleCardSVG labelColor="#7C1D1D" liquidTint="#F0D4A3" title="ALTHAIR" subLabel="ALTHAÏR" />
                      </div>
                      <div className="text-xs font-bold text-white mt-1">Frestin Althaïr</div>
                      <div className="text-[10px] text-[#D6CFC2]">Bourbon Vanilya & Tarçın</div>
                    </div>

                    <div
                      onClick={() => setDetailModalProduct(catalog[1])}
                      className="bg-black/25 hover:bg-black/40 p-4 rounded-2xl border border-white/10 cursor-pointer transition-all text-center group"
                    >
                      <div className="group-hover:scale-105 transition-transform">
                        <RealFrestinBottleCardSVG labelColor="#B87A1E" liquidTint="#E8D5A7" title="LEAUPAR" subLabel="L'EAU PAR" />
                      </div>
                      <div className="text-xs font-bold text-white mt-1">Frestin L&apos;Eau Par</div>
                      <div className="text-[10px] text-[#D6CFC2]">Ferah & Akuatik</div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('store')}
                    className="w-full mt-5 py-3 rounded-xl bg-white text-[#1E1E1C] hover:bg-[#FAF7F2] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Tüm Koleksiyonu Keşfet</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* NEDEN FRESTIN ÖZELLİK KARTLARI */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#E6E0D6] shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E86F38]/15 text-[#E86F38] flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif-luxury text-xl font-bold text-[#1E1E1C]">Saf Esans Kalitesi</h3>
                <p className="text-xs text-[#5A5751] leading-relaxed">
                  Bekledikçe kokunun kimyasını bozan sentetik sabitleyiciler eklemiyoruz; kalıcılığımız doğrudan esans kalitemizden gelir.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E6E0D6] shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#4A7C59]/15 text-[#4A7C59] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif-luxury text-xl font-bold text-[#1E1E1C]">Özel Şişe & Valf Seçimi</h3>
                <p className="text-xs text-[#5A5751] leading-relaxed">
                  Elinize aldığınız anda ağırlığını ve kalitesini hissettiren kristal şişelerimiz ve kusursuz püskürtme yapan valflerimizle sunulur.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E6E0D6] shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#B86B43]/15 text-[#B86B43] flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif-luxury text-xl font-bold text-[#1E1E1C]">Shopier Güvencesiyle</h3>
                <p className="text-xs text-[#5A5751] leading-relaxed">
                  Tüm siparişlerinizi 256-bit SSL korumalı Shopier altyapısıyla kredi/banka kartınızla güvenle oluşturabilirsiniz.
                </p>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ================= PARFÜMÜNÜ BUL ================= */}
      {activeTab === 'finder' && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="bg-gradient-to-r from-[#1E1E1C] to-[#2D2825] text-white rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E86F38]/20 text-[#F89843] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AKILLI KOKU EŞLEŞTİRME MOTORU</span>
              </div>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold">Sevdiğiniz Parfümlere En Yakın Frestin Notalarını Bulun</h1>
              <p className="text-xs sm:text-sm text-[#D6CFC2] leading-relaxed">
                Beğendiğiniz markalı parfümleri seçin veya sevdiğiniz nota notalarını ekleyin; yüksek esans oranına sahip eşsiz Frestin karşılığını saniyeler içinde keşfedin.
              </p>
            </div>
            <button onClick={() => setActiveTab('store')} className="px-6 py-3.5 rounded-2xl bg-[#E86F38] hover:bg-[#D45E2B] text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-all shrink-0">
              <span>Tüm Parfümleri İncele</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-[#E6E0D6] shadow-xs space-y-4">
                <h2 className="font-serif-luxury text-xl font-bold text-[#1E1E1C] flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#E86F38]" />
                  <span>Beğendiğiniz Parfümleri Seçin</span>
                </h2>
                <input
                  type="text"
                  placeholder="Parfüm adı veya marka ara..."
                  value={refSearchQuery}
                  onChange={(e) => setRefSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DED8CE] bg-[#FAF7F2] text-xs focus:outline-none focus:border-[#E86F38]"
                />
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {catalog
                    .filter((p) => p.name.toLowerCase().includes(refSearchQuery.toLowerCase()) || p.fragranticaRef.toLowerCase().includes(refSearchQuery.toLowerCase()))
                    .map((item) => {
                      const isSelected = selectedRefIds.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            if (isSelected) {
                              if (selectedRefIds.length > 1) setSelectedRefIds(selectedRefIds.filter((id) => id !== item.id));
                            } else {
                              setSelectedRefIds([...selectedRefIds, item.id]);
                            }
                          }}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                            isSelected ? 'bg-[#1E1E1C] text-white border-[#1E1E1C]' : 'bg-[#FAF7F2] hover:bg-[#F3EFE6] border-[#E6E0D6] text-[#1E1E1C]'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-bold">{item.name}</div>
                            <div className={`text-[10px] ${isSelected ? 'text-[#D6CFC2]' : 'text-[#78756E]'}`}>{item.fragranticaRef}</div>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#F89843]" />}
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-[#E6E0D6] shadow-xs space-y-4">
                <h2 className="font-serif-luxury text-xl font-bold text-[#1E1E1C] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#E86F38]" />
                  <span>Notalar & Tercihler</span>
                </h2>
                <div className="flex bg-[#F3EFE6] p-1 rounded-xl">
                  <button onClick={() => setNoteSelectionMode('like')} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${noteSelectionMode === 'like' ? 'bg-[#4A7C59] text-white' : 'text-[#78756E]'}`}>
                    Sevdiğim Notalar
                  </button>
                  <button onClick={() => setNoteSelectionMode('dislike')} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${noteSelectionMode === 'dislike' ? 'bg-[#C0392B] text-white' : 'text-[#78756E]'}`}>
                    İstemediğim Notalar
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                  {INITIAL_NOTE_CATEGORIES.map((note) => {
                    const isLiked = likedNotes.includes(note);
                    const isDisliked = dislikedNotes.includes(note);
                    return (
                      <button
                        key={note}
                        onClick={() => {
                          if (noteSelectionMode === 'like') {
                            setLikedNotes(isLiked ? likedNotes.filter((n) => n !== note) : [...likedNotes, note]);
                            if (isDisliked) setDislikedNotes(dislikedNotes.filter((n) => n !== note));
                          } else {
                            setDislikedNotes(isDisliked ? dislikedNotes.filter((n) => n !== note) : [...dislikedNotes, note]);
                            if (isLiked) setLikedNotes(likedNotes.filter((n) => n !== note));
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                          isLiked ? 'bg-[#4A7C59] text-white font-bold' : isDisliked ? 'bg-[#C0392B] text-white font-bold' : 'bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#E6E0D6] text-[#5A5751]'
                        }`}
                      >
                        {note} {isLiked ? '✓' : isDisliked ? '✕' : ''}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6E0D6] shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-[#E6E0D6] pb-4">
                  <div>
                    <span className="text-xs font-bold text-[#E86F38] uppercase tracking-wider">SİZİN İÇİN ÖZEL ÖNERİLENLER</span>
                    <h2 className="font-serif-luxury text-2xl font-bold text-[#1E1E1C]">Eşleşen Frestin Parfümleri</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ================= STOKLU ÜRÜNLER (DOĞRUDAN SHOPIER YÖNLENDİRME) ================= */}
      {activeTab === 'instock' && (
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <div className="bg-gradient-to-br from-[#2B4C36] via-[#3B6447] to-[#4A7C59] text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/15 text-center space-y-6 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#E9C46A]/15 blur-3xl pointer-events-none" />
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-[#E9C46A] text-xs font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4 fill-current" />
              <span>20 Gün Beklemeden • 24 Saatte Kargoda</span>
            </div>

            <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold max-w-2xl mx-auto leading-tight">
              Hazır Stoklu Ürünlerimiz Shopier Mağazamızda!
            </h1>

            <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto leading-relaxed">
              Anlık güncellenen tüm hazır stoklu parfümlerimizi, güncel adetlerini ve fiyatlarını doğrudan resmi <strong>Shopier</strong> mağazamız üzerinden inceleyebilir ve 256-bit SSL güvencesiyle hemen sipariş verebilirsiniz.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={SHOPIER_LINKS.store}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#1E1E1C] hover:bg-black text-white text-sm sm:text-base font-bold flex items-center justify-center gap-3 shadow-xl transition-all"
              >
                <ShoppingBag className="w-5 h-5 text-[#E9C46A]" />
                <span>Shopier Mağazamıza Git (Tüm Stoklu Ürünler)</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* HIZLI SHOPIER SİPARİŞ KARTLARI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href={SHOPIER_LINKS.store}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-6 rounded-3xl border border-[#E6E0D6] hover:border-[#4A7C59] shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#4A7C59]/15 text-[#4A7C59] flex items-center justify-center">
                  <PackageCheck className="w-6 h-6" />
                </div>
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#4A7C59]">Anlık Güncel Liste</span>
                <h3 className="font-serif-luxury text-2xl font-bold text-[#1E1E1C] group-hover:text-[#4A7C59] transition-colors">
                  Tüm Stoklu Parfümleri Gör
                </h3>
                <p className="text-xs text-[#5A5751] leading-relaxed">
                  Şu an stokta hazır bulunan ve aynı gün / ertesi gün kargoya teslim edilen tüm parfümlerimizi Shopier vitrinimizde görüntüleyin.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E6E0D6] flex items-center justify-between text-xs font-bold text-[#4A7C59]">
                <span>Shopier Vitrinini Aç</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </a>

            <a
              href={SHOPIER_LINKS['50ml']}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-6 rounded-3xl border border-[#E6E0D6] hover:border-[#E86F38] shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#E86F38]/15 text-[#E86F38] flex items-center justify-center font-bold text-sm">
                  50ml
                </div>
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#E86F38]">{PRICE_50ML} TL • Hızlı Sipariş</span>
                <h3 className="font-serif-luxury text-2xl font-bold text-[#1E1E1C] group-hover:text-[#E86F38] transition-colors">
                  50 ml Frestin Parfüm Siparişi
                </h3>
                <p className="text-xs text-[#5A5751] leading-relaxed">
                  50 ml kristal şişe parfüm siparişinizi doğrudan Shopier ödeme sayfası üzerinden güvenle oluşturun.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E6E0D6] flex items-center justify-between text-xs font-bold text-[#E86F38]">
                <span>50 ml Shopier Sayfasına Git</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </a>

            <a
              href={SHOPIER_LINKS['100ml']}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-6 rounded-3xl border border-[#E6E0D6] hover:border-[#B86B43] shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#B86B43]/15 text-[#B86B43] flex items-center justify-center font-bold text-sm">
                  100ml
                </div>
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#B86B43]">{PRICE_100ML} TL • Avantajlı Boy</span>
                <h3 className="font-serif-luxury text-2xl font-bold text-[#1E1E1C] group-hover:text-[#B86B43] transition-colors">
                  100 ml Frestin Parfüm Siparişi
                </h3>
                <p className="text-xs text-[#5A5751] leading-relaxed">
                  100 ml avantajlı boy kristal şişe parfüm siparişinizi doğrudan Shopier ödeme sayfası üzerinden oluşturun.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E6E0D6] flex items-center justify-between text-xs font-bold text-[#B86B43]">
                <span>100 ml Shopier Sayfasına Git</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </a>
          </div>
        </main>
      )}

      {/* ================= TÜM PARFÜMLER (MAĞAZA) ================= */}
      {activeTab === 'store' && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E0D6] pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#E86F38]">FRESTIN İMZA KOLEKSİYONU</span>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#1E1E1C]">Tüm Parfümlerimiz</h1>
            </div>
            <a
              href={SHOPIER_LINKS.store}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl bg-[#4A7C59] hover:bg-[#3A6347] text-white text-xs font-bold flex items-center gap-2 self-start sm:self-auto shadow-sm"
            >
              <span>Shopier Mağazamızda Gör</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {catalog.map((product) => {
              const selectedSize = getSelectedSize(product.id);
              const finalShopierLink =
                selectedSize === '100ml'
                  ? product.shopierLink100 || SHOPIER_LINKS['100ml']
                  : product.shopierLink50 || SHOPIER_LINKS['50ml'];
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border border-[#E6E0D6] hover:border-[#E86F38] transition-all shadow-xs hover:shadow-xl flex flex-col overflow-hidden group"
                >
                  <div
                    onClick={() => setDetailModalProduct(product)}
                    className="relative bg-[#F3EFE6]/70 pt-8 pb-6 px-4 flex flex-col items-center cursor-pointer"
                  >
                    <div className="group-hover:scale-105 transition-transform duration-300">
                      <RealFrestinBottleCardSVG
                        labelColor={product.bottleColor}
                        liquidTint={product.liquidColor}
                        title={product.code}
                        subLabel={product.name.replace('Frestin ', '').slice(0, 14)}
                      />
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#78756E] mb-1">
                        <span className="truncate max-w-[140px]">{product.fragranticaRef}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <Star className="w-3.5 h-3.5 fill-[#E9C46A] text-[#E9C46A]" />
                          <span className="font-bold text-[#1E1E1C]">{product.rating}</span>
                        </div>
                      </div>
                      <h3
                        onClick={() => setDetailModalProduct(product)}
                        className="font-serif-luxury text-xl font-bold text-[#1E1E1C] cursor-pointer hover:text-[#E86F38] transition-colors"
                      >
                        {product.name}
                      </h3>
                      <p className="text-xs text-[#5A5751] mt-1">{product.subtitle}</p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-[#E6E0D6]">
                      <div className="flex bg-[#F3EFE6] p-1 rounded-xl">
                        <button
                          onClick={() => setSelectedSize(product.id, '50ml')}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            selectedSize === '50ml' ? 'bg-white text-[#1E1E1C] shadow-xs' : 'text-[#78756E]'
                          }`}
                        >
                          50ml ({PRICE_50ML}₺)
                        </button>
                        <button
                          onClick={() => setSelectedSize(product.id, '100ml')}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            selectedSize === '100ml' ? 'bg-white text-[#1E1E1C] shadow-xs' : 'text-[#78756E]'
                          }`}
                        >
                          100ml ({PRICE_100ML}₺)
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={finalShopierLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 px-3 rounded-xl bg-[#4A7C59] hover:bg-[#3A6347] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition-all"
                        >
                          <span>Shopier Al</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <button
                          onClick={() => addToCart(product, selectedSize)}
                          className="py-2.5 px-3 rounded-xl bg-[#1E1E1C] hover:bg-[#333] text-white text-xs font-bold flex items-center justify-center gap-1 transition-all"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Sepete Ekle</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* ================= ÜRETİM & TESLİMAT ================= */}
      {activeTab === 'process' && (
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B86B43]">ŞEFFAF ÜRETİM VE KALİTE GÜVENCESİ</span>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#1E1E1C]">Siparişiniz Nasıl Hazırlanıyor?</h1>
            <p className="text-xs sm:text-sm text-[#78756E] max-w-2xl mx-auto">
              Stoklu ürünlerimiz 24 saat içinde kargoya verilirken; özel üretim talepleriniz atölyemizde özenle hazırlanmaktadır.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#E6E0D6] shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#E86F38]/10 text-[#E86F38] flex items-center justify-center font-bold text-lg">01</div>
              <h3 className="font-serif-luxury text-xl font-bold text-[#1E1E1C]">Özenle Seçilen Esanslar</h3>
              <p className="text-xs text-[#5A5751] leading-relaxed">
                Her parfüm için dünyaca ünlü esans üreticilerinden en saf bileşenleri tedarik ediyor, kimyayı bozan sentetik katkılar kullanmıyoruz.
              </p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-[#E6E0D6] shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#4A7C59]/10 text-[#4A7C59] flex items-center justify-center font-bold text-lg">02</div>
              <h3 className="font-serif-luxury text-xl font-bold text-[#1E1E1C]">Yüksek Extrait Oranı</h3>
              <p className="text-xs text-[#5A5751] leading-relaxed">
                %25 ila %28 oranında saf esans yoğunluğu ile gün boyu süren kalıcılık ve güçlü silaj (yayılım) sağlıyoruz.
              </p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-[#E6E0D6] shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#B86B43]/10 text-[#B86B43] flex items-center justify-center font-bold text-lg">03</div>
              <h3 className="font-serif-luxury text-xl font-bold text-[#1E1E1C]">Kristal Şişe & Kargolama</h3>
              <p className="text-xs text-[#5A5751] leading-relaxed">
                Ağır kristal şişelerimiz ve kusursuz valflerimizle paketlenerek güvenle adresinize ulaştırılır.
              </p>
            </div>
          </div>
        </main>
      )}

      {/* ================= ÜRÜN DETAY MODALI ================= */}
      {detailModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E6E0D6] space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setDetailModalProduct(null)} className="absolute top-5 right-5 p-2 rounded-full bg-[#FAF7F2] hover:bg-[#E6E0D6]">
              <X className="w-5 h-5 text-[#1E1E1C]" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-5 bg-[#FAF7F2] p-6 rounded-2xl flex items-center justify-center">
                <RealFrestinBottleCardSVG labelColor={detailModalProduct.bottleColor} liquidTint={detailModalProduct.liquidTint} title={detailModalProduct.code} subLabel={detailModalProduct.name.replace('Frestin ', '')} />
              </div>
              <div className="md:col-span-7 space-y-4">
                <div>
                  <span className="text-xs font-bold text-[#E86F38] uppercase tracking-wider">{detailModalProduct.gender} • {detailModalProduct.fragranticaRef}</span>
                  <h2 className="font-serif-luxury text-3xl font-bold text-[#1E1E1C] mt-1">{detailModalProduct.name}</h2>
                  <p className="text-xs text-[#78756E] mt-1">{detailModalProduct.subtitle}</p>
                </div>

                <div className="space-y-2 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6E0D6]">
                  <div className="text-xs font-bold text-[#1E1E1C]">Koku Piramidi:</div>
                  <div className="text-xs text-[#5A5751] space-y-1">
                    <div><strong>Üst Notalar:</strong> {detailModalProduct.pyramid.top.join(', ')}</div>
                    <div><strong>Kalp Notalar:</strong> {detailModalProduct.pyramid.heart.join(', ')}</div>
                    <div><strong>Alt Notalar:</strong> {detailModalProduct.pyramid.base.join(', ')}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex bg-[#F3EFE6] p-1 rounded-xl">
                    <button onClick={() => setSelectedSize(detailModalProduct.id, '50ml')} className={`flex-1 py-2 rounded-lg text-xs font-bold ${getSelectedSize(detailModalProduct.id) === '50ml' ? 'bg-white text-[#1E1E1C]' : 'text-[#78756E]'}`}>
                      50 ml ({PRICE_50ML} TL)
                    </button>
                    <button onClick={() => setSelectedSize(detailModalProduct.id, '100ml')} className={`flex-1 py-2 rounded-lg text-xs font-bold ${getSelectedSize(detailModalProduct.id) === '100ml' ? 'bg-white text-[#1E1E1C]' : 'text-[#78756E]'}`}>
                      100 ml ({PRICE_100ML} TL)
                    </button>
                  </div>

                  <div className="flex gap-2">
                    {detailModalProduct.inStock && (
                      <button
                        onClick={() => {
                          const size = getSelectedSize(detailModalProduct.id);
                          const url = size === '100ml' ? (detailModalProduct.shopierLink100 || SHOPIER_LINKS['100ml']) : (detailModalProduct.shopierLink50 || SHOPIER_LINKS['50ml']);
                          setDetailModalProduct(null);
                          setShopierRedirectModal({ product: detailModalProduct, size, url });
                        }}
                        className="flex-1 py-3 rounded-xl bg-[#4A7C59] hover:bg-[#3A6347] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <span>Shopier&apos;den Hemen Al</span>
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        addToCart(detailModalProduct, getSelectedSize(detailModalProduct.id));
                        setDetailModalProduct(null);
                      }}
                      className="flex-1 py-3 rounded-xl bg-[#1E1E1C] hover:bg-[#333] text-white text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Sepete Ekle</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SEPET ÇEKMECESİ ================= */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col justify-between p-6 sm:p-8 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="space-y-6 flex-1 overflow-y-auto pr-1">
              <div className="flex items-center justify-between border-b border-[#E6E0D6] pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#E86F38]" />
                  <h2 className="font-serif-luxury text-2xl font-bold text-[#1E1E1C]">Alışveriş Sepetiniz</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-full bg-[#FAF7F2] hover:bg-[#E6E0D6]">
                  <X className="w-5 h-5 text-[#1E1E1C]" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#FAF7F2] flex items-center justify-center mx-auto text-[#78756E]">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium text-[#78756E]">Sepetinizde henüz ürün bulunmuyor.</p>
                  <button onClick={() => { setIsCartOpen(false); setActiveTab('store'); }} className="px-6 py-2.5 rounded-xl bg-[#1E1E1C] text-white text-xs font-bold">
                    Koleksiyona Göz Atın
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.cartItemId} className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6E0D6] flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-[#1E1E1C]">{item.name}</div>
                        <div className="text-xs text-[#78756E]">{item.size} • {item.price} TL</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateCartQty(item.cartItemId, -1)} className="p-1 rounded-lg bg-white border border-[#E6E0D6]">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold w-6 text-center">{item.qty}</span>
                        <button onClick={() => updateCartQty(item.cartItemId, 1)} className="p-1 rounded-lg bg-white border border-[#E6E0D6]">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-6 border-t border-[#E6E0D6] space-y-4">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-[#78756E]">
                    <span>Ara Toplam:</span>
                    <span className="font-bold text-[#1E1E1C]">{cartSubtotal} TL</span>
                  </div>
                  <div className="flex justify-between text-[#78756E]">
                    <span>Kargo:</span>
                    <span className="font-bold text-[#4A7C59]">Ücretsiz Kargo</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#1E1E1C] pt-2 border-t border-[#E6E0D6]">
                    <span>Toplam Tutar:</span>
                    <span className="text-[#E86F38] text-base">{cartTotal} TL</span>
                  </div>
                </div>

                <a
                  href={SHOPIER_LINKS.store}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3.5 rounded-2xl bg-[#4A7C59] hover:bg-[#3A6347] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <span>Shopier ile Güvenli Ödeme Yap</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= SHOPIER YÖNLENDİRME MODALI ================= */}
      {shopierRedirectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E6E0D6] space-y-6 relative">
            <button onClick={() => setShopierRedirectModal(null)} className="absolute top-5 right-5 p-2 rounded-full bg-[#FAF7F2] hover:bg-[#E6E0D6]">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#4A7C59]/10 text-[#4A7C59] flex items-center justify-center shrink-0">
                <ExternalLink className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A7C59]">Shopier Güvenli Ödeme Yönlendirmesi</span>
                <h3 className="font-serif-luxury text-2xl font-bold text-[#1E1E1C]">
                  {shopierRedirectModal.product.name} ({shopierRedirectModal.size})
                </h3>
              </div>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6E0D6] space-y-3 text-xs text-[#5A5751]">
              <div className="flex items-center justify-between font-bold text-[#1E1E1C] text-sm pb-2 border-b border-[#E6E0D6]">
                <span>Seçilen Boyut & Fiyat:</span>
                <span className="text-[#4A7C59]">{shopierRedirectModal.size === '100ml' ? PRICE_100ML : PRICE_50ML} TL</span>
              </div>
              <p>Shopier&apos;e yönlendirildiğinizde sipariş notu olarak eklenmesini istediğiniz özel kod:</p>
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-[#DED8CE]">
                <code className="font-mono font-bold text-[#1E1E1C]">{shopierRedirectModal.product.code} - {shopierRedirectModal.size}</code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${shopierRedirectModal.product.code} - ${shopierRedirectModal.size}`);
                    setToastMessage('Sipariş kodu kopyalandı!');
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#1E1E1C] text-white text-[11px] font-bold flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Kopyala</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href={shopierRedirectModal.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShopierRedirectModal(null)}
                className="w-full py-3.5 rounded-2xl bg-[#4A7C59] hover:bg-[#3A6347] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>Shopier Ödeme Sayfasına Git</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href={SHOPIER_LINKS.store}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShopierRedirectModal(null)}
                className="w-full py-2.5 rounded-xl border border-[#DED8CE] hover:border-[#4A7C59] text-[#4A7C59] font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Shopier Mağaza Vitrini</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#F3EFE6] border-t border-[#E6E0D6] mt-16 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78756E]">
          <div className="flex items-center gap-3">
            <FrestinBrandLogo size="sm" showText={true} />
            <span className="hidden sm:inline text-[#DED8CE]">|</span>
            <div>© {new Date().getFullYear()} Frestin Perfume • Senin Kokun, Senin İmzan.</div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-[#C13584] hover:underline font-bold flex items-center gap-1">
              <Instagram className="w-3.5 h-3.5" />
              <span>@frestin_perfumes</span>
            </a>
            <a href={SHOPIER_LINKS.store} target="_blank" rel="noopener noreferrer" className="text-[#4A7C59] hover:underline font-bold flex items-center gap-1">
              <span>Shopier Mağazamız</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
