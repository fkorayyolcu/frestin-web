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
  Rocket,
  Zap,
  Instagram,
  PackageCheck,
  Settings,
  Link as LinkIcon,
  Save,
  RotateCcw
} from 'lucide-react';

// ==========================================
// SABİT FİYATLAR & GENEL SHOPIER BAĞLANTILARI
// ==========================================
const PRICE_50ML = 860;
const PRICE_100ML = 1550;

// Özel üretim (20 günde kargo) parfümler için genel Shopier linkleri
// ve Stoklu ürünler için genel Shopier mağaza vitrini linki:
const SHOPIER_LINKS = {
  '50ml': 'https://www.shopier.com/frestinperfumes/52434473',
  '100ml': 'https://www.shopier.com/frestinperfumes/52434538',
  store: 'https://www.shopier.com/frestinperfumes'
};

const INSTAGRAM_URL = 'https://www.instagram.com/frestin_perfumes/';

// ==========================================
// STOKLU ÜRÜNLER ÖZEL SHOPIER LİNK YAPILANDIRMASI
// Not: Shopier'e stoklu ürün ekledikçe ürünün kendi linkini buraya
// veya sitedeki "Stok & Link Yönetimi" panelinden kolayca yapıştırabilirsiniz.
// ==========================================
const STOCK_CONFIG_STORAGE_KEY = 'frestin_stock_custom_config_v1';

// Güvenli Pano Kopyalama Yardımcı Fonksiyonu
const copyTextToClipboard = async (text) => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    // Fallback below
  }
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  } catch (e) {
    return false;
  }
};

// ==========================================
// 20 GÜN SONRAKİ KARGO TARİHİ HESAPLAYICI
// ==========================================
const getEstimatedShippingDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 20);
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// ==========================================
// VERİ TABANI: GENİŞLETİLMİŞ FRAGRANTICA NOTA KATEGORİLERİ
// ==========================================
const INITIAL_NOTE_CATEGORIES = [
  {
    id: 'citrus',
    title: 'Narenciye, Ferah & Yeşil',
    color: '#4A7C59',
    notes: [
      { name: 'Bergamot', desc: 'Parlak, hafif baharatlı İtalyan narenciyesi', icon: '🍋' },
      { name: 'İtalyan Limonu', desc: 'Canlandırıcı, keskin ve temiz açılış', icon: '🍋' },
      { name: 'Kan Portakalı', desc: 'Tatlı-ekşi, sulu ve enerjik narenciye', icon: '🍊' },
      { name: 'Mandalina', desc: 'Tatlı ve neşeli narenciye dokunuşu', icon: '🍊' },
      { name: 'Greyfurt', desc: 'Dinamik ve ferahlatıcı taze meyve', icon: '🍊' },
      { name: 'Misket Limonu (Lime)', desc: 'Keskin, tropikal ve enerjik ferahlık', icon: '🍋' },
      { name: 'Neroli', desc: 'Acı portakal ağacı çiçeğinden gelen temiz ferahlık', icon: '🌼' },
      { name: 'Deniz Notaları', desc: 'Okyanus esintisi ve tuzlu su ferahlığı', icon: '🌊' },
      { name: 'Nane', desc: 'Buz gibi serinletici aromatik yaprak', icon: '🌿' },
      { name: 'Yeşil Çay', desc: 'Dingin, temiz ve bitkisel ferahlık', icon: '🍵' },
      { name: 'Biberiye', desc: 'Akdeniz kıyılarından aromatik taze ot', icon: '🌿' },
      { name: 'Ardıç Meyvesi', desc: 'Serin, çamsı ve cin tonik ferahlığı', icon: '🫐' }
    ]
  },
  {
    id: 'fruity',
    title: 'Meyveli & Tropikal',
    color: '#C86D51',
    notes: [
      { name: 'Ananas', desc: 'Közlenmiş tatlı-dumanlı karizmatik meyve', icon: '🍍' },
      { name: 'Liçi (Lychee)', desc: 'Egzotik, sulu ve pembe çiçeksi meyve', icon: '🍒' },
      { name: 'Yeşil Elma', desc: 'Kütür kütür, ferah ve tatlımsı açılış', icon: '🍏' },
      { name: 'Şeftali', desc: 'Kadifemsi, tatlı ve tenle uyumlu meyve', icon: '🍑' },
      { name: 'Çarkıfelek Meyvesi', desc: 'Tropikal ve enerjik meyve kokteyli', icon: '🥭' },
      { name: 'Siyah Frenk Üzümü', desc: 'Derin, mayhoş ve sofistike orman meyvesi', icon: '🫐' },
      { name: 'Vişne / Kiraz', desc: 'Likörlü, koyu ve baştan çıkarıcı kırmızı meyve', icon: '🍒' },
      { name: 'Ahududu', desc: 'Tatlı, canlı ve romantik kırmızı meyve', icon: '🍓' },
      { name: 'Hindistan Cevizi', desc: 'Kremamsı, yazlık ve egzotik dokunuş', icon: '🥥' },
      { name: 'İncir', desc: 'Hem yeşil yaprağı hem sütlü meyvesiyle Akdeniz imzası', icon: '🍐' },
      { name: 'Armut', desc: 'Sulu, zarif ve ferah meyve açılışı', icon: '🍐' },
      { name: 'Erik', desc: 'Koyu, gizemli ve sıcak meyve derinliği', icon: '🟣' }
    ]
  },
  {
    id: 'floral',
    title: 'Çiçeksi & Pudramsı',
    color: '#A85772',
    notes: [
      { name: 'Yasemin', desc: 'Baş döndürücü, zarif beyaz çiçek kalbi', icon: '🌸' },
      { name: 'Türk Gülü', desc: 'Romantik, kadifemsi ve asil gül yaprağı', icon: '🌹' },
      { name: 'Lavanta', desc: 'Temiz, huzurlu ve modern aromatik ferahlık', icon: '🪻' },
      { name: 'Portakal Çiçeği', desc: 'Güneşli, tatlımsı ve çekici beyaz çiçek', icon: '🌼' },
      { name: 'İris (Süsen)', desc: 'Asil, pudramsı ve lüks çiçek kökü', icon: '⚜️' },
      { name: 'Sümbülteber (Tuberose)', desc: 'Kremamsı, yoğun ve feminen beyaz çiçek', icon: '🌺' },
      { name: 'Menekşe', desc: 'Pudramsı, zarif ve nostaljik çiçek dokunuşu', icon: '🌺' },
      { name: 'Ylang-Ylang', desc: 'Sıcak, egzotik ve tatlı sarı çiçek', icon: '🌼' },
      { name: 'Şakayık (Peony)', desc: 'Bahar tazeliği taşıyan pembe çiçek', icon: '🌸' },
      { name: 'Manolya', desc: 'Limonsu ferahlığa sahip zarif yapraklar', icon: '🤍' },
      { name: 'Orkide', desc: 'Karanlık, tatlımsı ve gizemli çiçek akoru', icon: '🌺' }
    ]
  },
  {
    id: 'woody',
    title: 'Odunsu, Yosunlu & Topraksı',
    color: '#7D5A3C',
    notes: [
      { name: 'Sedir Ağacı', desc: 'Kuru, temiz ve asil odunsu omurga', icon: '🌲' },
      { name: 'Sandal Ağacı', desc: 'Kremamsı, sıcak ve meditatif odun notası', icon: '🪵' },
      { name: 'Öd Ağacı (Oud)', desc: 'Doğu gizemi taşıyan güçlü ve lüks reçineli odun', icon: '🪵' },
      { name: 'Vetiver', desc: 'Asil, hafif dumanlı ve topraksı kök', icon: '🌾' },
      { name: 'Paçuli', desc: 'Derin, gizemli ve bohem yaprak notası', icon: '🍂' },
      { name: 'Meşe Yosunu', desc: 'Orman tabanı hissi veren klasik şipre notası', icon: '🌿' },
      { name: 'Kaşmir Ağacı', desc: 'Yumuşak, miskli ve sarmalayıcı odunsu nota', icon: '🪵' },
      { name: 'Guaiac Ağacı', desc: 'Dumanlı ve sıcak egzotik odun', icon: '🔥' },
      { name: 'Çam İğnesi', desc: 'Kuzey ormanlarını andıran reçineli ferahlık', icon: '🌲' },
      { name: 'Huş Ağacı (Birch)', desc: 'Dumanlı, deri nüanslı karizmatik odun', icon: '🪵' }
    ]
  },
  {
    id: 'spicy-gourmand',
    title: 'Baharatlı, Tatlı & Gurme',
    color: '#B86B43',
    notes: [
      { name: 'Vanilya', desc: 'Sıcak, davetkar ve bağımlılık yapıcı tatlılık', icon: '🍦' },
      { name: 'Tarçın', desc: 'Sıcak, tatlı-baharatlı kış ve gece imzası', icon: '✨' },
      { name: 'Tonka Fasulyesi', desc: 'Badem, karamel ve sıcak vanilya nüansı', icon: '🌰' },
      { name: 'Safran', desc: 'Lüks, deri ve baharat nüanslı kızıl altın', icon: '🧣' },
      { name: 'Kakule', desc: 'Çarpıcı, aromatik ve karizmatik serin baharat', icon: '🌱' },
      { name: 'Karabiber', desc: 'Dinamik, çarpıcı ve taze baharat dokunuşu', icon: '🌶️' },
      { name: 'Pembe Biber', desc: 'Meyvemsi ve zarif baharat ışıltısı', icon: '🌶️' },
      { name: 'Tütün Yaprağı', desc: 'Zengin, bal ve kuru meyve nüanslı sıcak nota', icon: '🍂' },
      { name: 'Bal', desc: 'Altın sıcaklığında, yoğun ve nektarlı tatlılık', icon: '🍯' },
      { name: 'Kahve', desc: 'Kavrulmuş, karanlık ve enerjik gurme nota', icon: '☕' },
      { name: 'Karamel', desc: 'Erimiş şeker ve tereyağlı gurme zenginlik', icon: '🍮' },
      { name: 'Pralin', desc: 'Kavrulmuş fındık ve karamelize şeker', icon: '🍫' },
      { name: 'Kakao / Çikolata', desc: 'Bitter, derin ve çekici gurme nota', icon: '🍫' },
      { name: 'Badem', desc: 'Marzipan ve kiraz nüanslı kremsi kuruyemiş', icon: '🥜' },
      { name: 'Zencefil', desc: 'Canlandırıcı, keskin ve sıcak kök baharat', icon: '🫚' },
      { name: 'Kanyak / Rom', desc: 'Meşe fıçıda dinlenmiş sıcak içki akoru', icon: '🥃' }
    ]
  },
  {
    id: 'amber-musk',
    title: 'Amber, Reçine, Deri & Misk',
    color: '#8C5A3C',
    notes: [
      { name: 'Kehribar (Amber)', desc: 'Reçineli, altın sıcaklığında derin alt nota', icon: '🧡' },
      { name: 'Ambroxan', desc: 'Modern, mineralimsi, kehribar-odunsu yüksek yayılım', icon: '💎' },
      { name: 'Beyaz Misk', desc: 'Tenle bütünleşen temiz, pudramsı ve kalıcı baz', icon: '☁️' },
      { name: 'Deri', desc: 'Karakterli, dumanlı ve lüks ten uyumu', icon: '🧥' },
      { name: 'Süet', desc: 'Yumuşak, kadifemsi ve zarif deri dokusu', icon: '🧤' },
      { name: 'Tütsü (Incense)', desc: 'Mistik, dumanlı ve meditatif reçine', icon: '🕯️' },
      { name: 'Benzoin', desc: 'Vanilyamsı sıcaklığa sahip tatlı reçine', icon: '💧' },
      { name: 'Labdanum', desc: 'Amber akorlarının kalbindeki zengin reçine', icon: '🍯' }
    ]
  }
];

// ==========================================
// VERİ TABANI: 24 İKONİK FRAGRANTICA & FRESTIN PARFÜMÜ
// Her üründe "shopierLink50" ve "shopierLink100" alanları mevcuttur.
// Stoklu ürünleri Shopier'e eklediğinizde kendi özel linkini doğrudan buraya
// veya site içindeki "Stok & Shopier Link Yönetimi" penceresine yazabilirsiniz!
// ==========================================
const INITIAL_CATALOG = [
  {
    id: 'frestin-101',
    code: 'No. 101',
    name: 'FRESTIN Aura Sauvage',
    fragranticaRef: 'Dior Sauvage',
    brandRef: 'Dior',
    subtitle: 'Calabria Bergamotu & Ambroxan',
    gender: 'Erkek',
    category: 'Ferah',
    price50: PRICE_50ML,
    price100: PRICE_100ML,
    inStock: true,
    stockCount: 14,
    // Shopier'de bu stoklu ürüne özel açtığınız linkleri buraya yazabilirsiniz (Boşsa genel linki kullanır):
    shopierLink50: '',
    shopierLink100: '',
    rating: 4.94,
    reviews: 312,
    badge: 'Çok Satan',
    bottleColor: '#24343B',
    liquidColor: '#D9E4EC',
    timeOfDay: 'Gündüz & Dört Mevsim',
    longevity: 90,
    sillage: 88,
    concentration: 'Extrait de Parfum (%25 Esans)',
    shortDesc: 'Parlak bergamot, taze kırılmış karabiber ve mineral ambroxan ile her ortamda temiz, maskülen ve yüksek iltifat alan imza koku.',
    mainAccords: [
      { name: 'Taze Baharatlı', percent: 95, color: '#6B9080' },
      { name: 'Narenciye', percent: 90, color: '#E9C46A' },
      { name: 'Amber / Ambroxan', percent: 86, color: '#D4A373' },
      { name: 'Aromatik', percent: 75, color: '#588157' },
      { name: 'Odunsu', percent: 68, color: '#8D6E63' }
    ],
    pyramid: {
      top: ['Bergamot', 'Karabiber'],
      heart: ['Lavanta', 'Paçuli', 'Kakule', 'Pembe Biber'],
      base: ['Ambroxan', 'Sedir Ağacı', 'Vetiver']
    }
  },
  {
    id: 'frestin-102',
    code: 'No. 102',
    name: 'FRESTIN Rouge 540',
    fragranticaRef: 'Baccarat Rouge 540',
    brandRef: 'Maison Francis Kurkdjian',
    subtitle: 'Kristalize Safran, Kehribar & Sedir',
    gender: 'Unisex',
    category: 'Oryantal',
    price50: PRICE_50ML,
    price100: PRICE_100ML,
    inStock: true,
    stockCount: 9,
    shopierLink50: '',
    shopierLink100: '',
    rating: 4.97,
    reviews: 428,
    badge: 'İmza Koku',
    bottleColor: '#6E261A',
    liquidColor: '#F3D5B5',
    timeOfDay: 'Gece & Dört Mevsim',
    longevity: 97,
    sillage: 96,
    concentration: 'Extrait de Parfum (%28 Esans)',
    shortDesc: 'Altın safran telleri, Mısır yasemini ve sıcak kehribar reçinesinin sedir ağacıyla kurduğu büyüleyici, yüksek yayılımlı başyapıt.',
    mainAccords: [
      { name: 'Odunsu', percent: 95, color: '#8D6E63' },
      { name: 'Amber', percent: 93, color: '#D97736' },
      { name: 'Sıcak Baharatlı', percent: 85, color: '#B55239' },
      { name: 'Tatlı', percent: 78, color: '#E07A5F' },
      { name: 'Beyaz Çiçeksi', percent: 66, color: '#E6CCB2' }
    ],
    pyramid: {
      top: ['Safran', 'Yasemin', 'Badem'],
      heart: ['Kehribar (Amber)', 'Ambroxan'],
      base: ['Sedir Ağacı', 'Beyaz Misk', 'Karamel']
    }
  },
  {
    id: 'frestin-103',
    code: 'No. 103',
    name: 'FRESTIN Imperium Aventus',
    fragranticaRef: 'Creed Aventus',
    brandRef: 'Creed',
    subtitle: 'Kraliyet Ananası, Bergamot & Meşe Yosunu',
    gender: 'Erkek',
    category: 'Odunsu',
    price50: PRICE_50ML,
    price100: PRICE_100ML,
    inStock: true,
    stockCount: 11,
    shopierLink50: '',
    shopierLink100: '',
    rating: 4.95,
    reviews: 289,
    badge: 'Prestij Serisi',
    bottleColor: '#1E1E1C',
    liquidColor: '#E2E0D8',
    timeOfDay: 'Gündüz & Dört Mevsim',
    longevity: 93,
    sillage: 90,
    concentration: 'Extrait de Parfum (%26 Esans)',
    shortDesc: 'Canlı bergamot ve közlenmiş ananas açılışını meşe yosunu, paçuli ve odunsu misk ile taçlandıran lider ruhlu parfüm.',
    mainAccords: [
      { name: 'Meyveli', percent: 96, color: '#E9C46A' },
      { name: 'Odunsu', percent: 90, color: '#7F5539' },
      { name: 'Dumanlı / Deri', percent: 80, color: '#6C757D' },
      { name: 'Beyaz Misk', percent: 74, color: '#ADB5BD' },
      { name: 'Topraksı', percent: 68, color: '#588157' }
    ],
    pyramid: {
      top: ['Ananas', 'Bergamot', 'Siyah Frenk Üzümü', 'Yeşil Elma'],
      heart: ['Paçuli', 'Yasemin', 'Türk Gülü', 'Huş Ağacı (Birch)'],
      base: ['Meşe Yosunu', 'Beyaz Misk', 'Ambroxan', 'Vanilya']
    }
  },
  {
    id: 'frestin-104',
    code: 'No. 104',
    name: 'FRESTIN Velours Libre',
    fragranticaRef: 'YSL Libre Intense',
    brandRef: 'Yves Saint Laurent',
    subtitle: 'Fransız Lavantası, Portakal Çiçeği & Vanilya',
    gender: 'Kadın',
    category: 'Çiçeksi',
    price50: PRICE_50ML,
    price100: PRICE_100ML,
    inStock: true,
    stockCount: 12,
    shopierLink50: '',
    shopierLink100: '',
    rating: 4.92,
    reviews: 264,
    badge: 'Çok Satan Kadın',
    bottleColor: '#8C5A3C',
    liquidColor: '#F6E4C4',
    timeOfDay: 'Gündüz & Gece',
    longevity: 92,
    sillage: 88,
    concentration: 'Extrait de Parfum (%25 Esans)',
    shortDesc: 'Fransız lavantasının ferahlığı, Fas portakal çiçeğinin ışıltısı ve sıcak Madagaskar vanilyasının tenle bütünleşen özgür uyumu.',
    mainAccords: [
      { name: 'Beyaz Çiçeksi', percent: 95, color: '#F2CC8F' },
      { name: 'Vanilya', percent: 90, color: '#E09F3E' },
      { name: 'Lavanta', percent: 84, color: '#9D8189' },
      { name: 'Narenciye', percent: 76, color: '#E9C46A' },
      { name: 'Tatlı Amber', percent: 72, color: '#D4A373' }
    ],
    pyramid: {
      top: ['Lavanta', 'Bergamot', 'Mandalina'],
      heart: ['Portakal Çiçeği', 'Yasemin', 'Orkide'],
      base: ['Vanilya', 'Tonka Fasulyesi', 'Kehribar (Amber)', 'Vetiver']
    }
  },
  {
    id: 'frestin-105',
    code: 'No. 105',
    name: 'FRESTIN Sicilia Naxos',
    fragranticaRef: 'Xerjoff XJ 1861 Naxos',
    brandRef: 'Xerjoff',
    subtitle: 'Altın Bal, Tütün Yaprağı & Lavanta',
    gender: 'Unisex',
    category: 'Oryantal',
    price50: PRICE_50ML,
    price100: PRICE_100ML,
    inStock: true,
    stockCount: 7,
    shopierLink50: '',
    shopierLink100: '',
    rating: 4.96,
    reviews: 198,
    badge: 'Niş Koleksiyon',
    bottleColor: '#7A542E',
    liquidColor: '#F5D38C',
    timeOfDay: 'Gece & Sonbahar/Kış',
    longevity: 96,
    sillage: 93,
    concentration: 'Extrait de Parfum (%28 Esans)',
    shortDesc: 'Sicilya bergamotu ve lavanta açılışının sıcak bal, tarçın, tütün yaprağı ve vanilya ile buluştuğu İtalyan niş efsanesi.',
    mainAccords: [
      { name: 'Tatlı / Bal', percent: 96, color: '#E09F3E' },
      { name: 'Vanilya', percent: 90, color: '#F4A261' },
      { name: 'Tütün', percent: 86, color: '#8D6E63' },
      { name: 'Sıcak Baharatlı', percent: 80, color: '#B55239' },
      { name: 'Aromatik Lavanta', percent: 75, color: '#9D8189' }
    ],
    pyramid: {
      top: ['Bergamot', 'İtalyan Limonu', 'Lavanta'],
      heart: ['Bal', 'Tarçın', 'Yasemin', 'Kaşmir Ağacı'],
      base: ['Tütün Yaprağı', 'Vanilya', 'Tonka Fasulyesi']
    }
  },
  {
    id: 'frestin-106',
    code: 'No. 106',
    name: 'FRESTIN Rose Delina',
    fragranticaRef: 'Parfums de Marly Delina',
    brandRef: 'Parfums de Marly',
    subtitle: 'Türk Gülü, Egzotik Liçi & Beyaz Misk',
    gender: 'Kadın',
    category: 'Çiçeksi',
    price50: PRICE_50ML,
    price100: PRICE_100ML,
    inStock: true,
    stockCount: 8,
    shopierLink50: '',
    shopierLink100: '',
    rating: 4.93,
    reviews: 215,
    badge: 'Niş Romantik',
    bottleColor: '#A86475',
    liquidColor: '#FADDE1',
    timeOfDay: 'Gündüz & Özel Anlar',
    longevity: 93,
    sillage: 91,
    concentration: 'Extrait de Parfum (%26 Esans)',
    shortDesc: 'Asil Türk gülü, sulu liçi meyvesi, bergamot ve vanilyalı beyaz miskin büyüleyici, zarif ve iltifat mıknatısı uyumu.',
    mainAccords: [
      { name: 'Gül / Çiçeksi', percent: 97, color: '#E5989B' },
      { name: 'Meyveli (Liçi)', percent: 88, color: '#F28482' },
      { name: 'Taze / Ferah', percent: 82, color: '#84A59D' },
      { name: 'Misk', percent: 76, color: '#B5838D' },
      { name: 'Vanilya', percent: 70, color: '#F6BD60' }
    ],
    pyramid: {
      top: ['Liçi (Lychee)', 'Bergamot'],
      heart: ['Türk Gülü', 'Şakayık (Peony)', 'Vanilya'],
      base: ['Beyaz Misk', 'Sedir Ağacı', 'Vetiver', 'Tütsü (Incense)']
    }
  },
  {
    id: 'frestin-107',
    code: 'No. 107',
    name: 'FRESTIN Nishane Shadow',
    fragranticaRef: 'Nishane Hacivat',
    brandRef: 'Nishane',
    subtitle: 'Ananas, Greyfurt & Yoğun Meşe Yosunu',
    gender: 'Unisex',
    category: 'Odunsu',
    price50: PRICE_50ML,
    price100: PRICE_100ML,
    inStock: true,
    stockCount: 10,
    shopierLink50: '',
    shopierLink100: '',
    rating: 4.94,
    reviews: 176,
    badge: 'Yüksek Kalıcılık',
    bottleColor: '#2F4842',
    liquidColor: '#DFE8E2',
    timeOfDay: 'Gündüz & Dört Mevsim',
    longevity: 98,
    sillage: 95,
    concentration: 'Extrait de Parfum (%28 Esans)',
    shortDesc: 'Canlandırıcı ananas ve greyfurt notalarının, meşe yosunu ve sedir ağacıyla kurduğu ultra kalıcı şipre-odunsu imza.',
    mainAccords: [
      { name: 'Odunsu', percent: 96, color: '#7F5539' },
      { name: 'Narenciye', percent: 92, color: '#E9C46A' },
      { name: 'Yosunlu / Topraksı', percent: 88, color: '#588157' },
      { name: 'Meyveli', percent: 84, color: '#F4A261' },
      { name: 'Aromatik', percent: 74, color: '#6B9080' }
    ],
    pyramid: {
      top: ['Ananas', 'Greyfurt', 'Bergamot'],
      heart: ['Sedir Ağacı', 'Paçuli', 'Yasemin'],
      base: ['Meşe Yosunu', 'Sandal Ağacı']
    }
  },
  {
    id: 'frestin-108',
    code: 'No. 108',
    name: 'FRESTIN Royal Layton',
    fragranticaRef: 'Parfums de Marly Layton',
    brandRef: 'Parfums de Marly',
    subtitle: 'Yeşil Elma, Kakule, Lavanta & Vanilya',
    gender: 'Erkek',
    category: 'Oryantal',
    price50: PRICE_50ML,
    price100: PRICE_100ML,
    inStock: true,
    stockCount: 6,
    shopierLink50: '',
    shopierLink100: '',
    rating: 4.95,
    reviews: 204,
    badge: 'Kış & Gece Kralı',
    bottleColor: '#283845',
    liquidColor: '#E8DBC5',
    timeOfDay: 'Gece & Serin Havalar',
    longevity: 94,
    sillage: 91,
    concentration: 'Extrait de Parfum (%26 Esans)',
    shortDesc: 'Taze yeşil elma ve lavanta açılışını kakule, karabiber ve sıcak vanilya-sandal ağacı tabanıyla buluşturan karizmatik parfüm.',
    mainAccords: [
      { name: 'Sıcak Baharatlı', percent: 95, color: '#B55239' },
      { name: 'Vanilya', percent: 90, color: '#E09F3E' },
      { name: 'Meyveli (Elma)', percent: 85, color: '#84A59D' },
      { name: 'Odunsu', percent: 80, color: '#7F5539' },
      { name: 'Lavanta', percent: 76, color: '#9D8189' }
    ],
    pyramid: {
      top: ['Yeşil Elma', 'Lavanta', 'Bergamot', 'Mandalina'],
      heart: ['Menekşe', 'Yasemin'],
      base: ['Vanilya', 'Kakule', 'Sandal Ağacı', 'Karabiber', 'Paçuli', 'Guaiac Ağacı']
    }
  },
  {
    id: 'frestin-109',
    code: 'No. 109',
    name: 'FRESTIN Angels Cognac',
    fragranticaRef: "Kilian Angels' Share",
    brandRef: 'By Kilian',
    subtitle: 'Tarçın, Tonka Fasulyesi, Pralin & Vanilya',
    gender: 'Unisex',
    category: 'Oryantal',
    price50: PRICE_50ML,
    price100: PRICE_100ML,
    inStock: false,
    stockCount: 0,
    shopierLink50: '',
    shopierLink100: '',
    rating: 4.96,
    reviews: 230,
    badge: 'Gurme Favori',
    bottleColor: '#7C3F23',
    liquidColor: '#E5A96F',
    timeOfDay: 'Gece & Kış',
    longevity: 95,
    sillage: 93,
    concentration: 'Extrait de Parfum (%28 Esans)',
    shortDesc: 'Sıcak Seylan tarçını, kavrulmuş tonka fasulyesi, pralin, vanilya ve sandal ağacının baş döndürücü gurme uyumu.',
    mainAccords: [
      { name: 'Sıcak Baharatlı', percent: 96, color: '#9E2A2B' },
      { name: 'Tatlı / Gurme', percent: 94, color: '#E07A5F' },
      { name: 'Odunsu', percent: 86, color: '#8D6E63' },
      { name: 'Vanilya', percent: 84, color: '#E09F3E' },
      { name: 'Tarçın', percent: 82, color: '#B55239' }
    ],
    pyramid: {
      top: ['Kanyak / Rom', 'Tarçın'],
      heart: ['Tonka Fasulyesi', 'Meşe Yosunu'],
      base: ['Vanilya', 'Pralin', 'Sandal Ağacı', 'Kehribar (Amber)']
    }
  },
  {
    id: 'frestin-110',
    code: 'No. 110',
    name: 'FRESTIN Santal 33',
    fragranticaRef: 'Le Labo Santal 33',
    brandRef: 'Le Labo',
    subtitle: 'Avustralya Sandalı, Sedir, Kakule & Deri',
    gender: 'Unisex',
    category: 'Odunsu',
    price50: PRICE_50ML,
    price100: PRICE_100ML,
    inStock: false,
    stockCount: 0,
    shopierLink50: '',
    shopierLink100: '',
    rating: 4.89,
    reviews: 162,
    badge: 'Niş İmza',
    bottleColor: '#5C6B5E',
    liquidColor: '#E9EDC9',
    timeOfDay: 'Gündüz & Dört Mevsim',
    longevity: 91,
    sillage: 86,
    concentration: 'Extrait de Parfum (%25 Esans)',
    shortDesc: 'Kremamsı sandal ağacı, Virginia sediri, serin kakule, menekşe ve yumuşak derinin entelektüel, modern ve sakinleştirici dokunuşu.',
    mainAccords: [
      { name: 'Odunsu', percent: 98, color: '#7F5539' },
      { name: 'Pudramsı', percent: 84, color: '#DDB892' },
      { name: 'Deri', percent: 78, color: '#6C757D' },
      { name: 'Sıcak Baharatlı', percent: 74, color: '#B86B43' },
      { name: 'Menekşe', percent: 68, color: '#9D8189' }
    ],
    pyramid: {
      top: ['Kakule', 'Menekşe', 'İris (Süsen)'],
      heart: ['Sandal Ağacı', 'Sedir Ağacı'],
      base: ['Deri', 'Kehribar (Amber)', 'Beyaz Misk']
    }
  },
  {
    id: 'frestin-111',
    code: 'No. 111',
    name: 'FRESTIN Pura Sicilia',
    fragranticaRef: 'Xerjoff Erba Pura',
    brandRef: 'Xerjoff',
    subtitle: 'Akdeniz Meyveleri, Beyaz Misk & Vanilya',
    gender: 'Unisex',
    category: 'Meyveli',
    price50: PRICE_50ML,
    price100: PRICE_100ML,
    inStock: true,
    stockCount: 9,
    shopierLink50: '',
    shopierLink100: '',
    rating: 4.91,
    reviews: 245,
    badge: 'Ultra Kalıcı',
    bottleColor: '#2D6A73',
    liquidColor: '#D8F3DC',
    timeOfDay: 'Gündüz & Yaz/Bahar',
    longevity: 98,
    sillage: 96,
    concentration: 'Extrait de Parfum (%28 Esans)',
    shortDesc: 'Sicilya portakalı, İtalyan limonu, tropikal meyve sepeti ve kadifemsi beyaz misk-vanilya bazıyla günlerce süren neşeli yayılım.',
    mainAccords: [
      { name: 'Meyveli', percent: 98, color: '#F4A261' },
      { name: 'Tatlı', percent: 90, color: '#E07A5F' },
      { name: 'Narenciye', percent: 86, color: '#E9C46A' },
      { name: 'Misk', percent: 82, color: '#ADB5BD' },
      { name: 'Pudramsı Vanilya', percent: 75, color: '#F2CC8F' }
    ],
    pyramid: {
      top: ['Kan Portakalı', 'İtalyan Limonu', 'Bergamot'],
      heart: ['Çarkıfelek Meyvesi', 'Ananas', 'Şeftali', 'Armut'],
      base: ['Beyaz Misk', 'Vanilya', 'Kehribar (Amber)']
    }
  },
  {
    id: 'frestin-112',
    code: 'No. 112',
    name: 'FRESTIN Coco Soie',
    fragranticaRef: 'Chanel Coco Mademoiselle',
    brandRef: 'Chanel',
    subtitle: 'Parlak Portakal, Türk Gülü & Paçuli',
    gender: 'Kadın',
    category: 'Çiçeksi',
    price50: PRICE_50ML,
    price100: PRICE_100ML,
    inStock: true,
    stockCount: 5,
    shopierLink50: '',
    shopierLink100: '',
    rating: 4.93,
    reviews: 278,
    badge: 'Zamansız Klasik',
    bottleColor: '#9E6B68',
    liquidColor: '#F7E1D7',
    timeOfDay: 'Gündüz & Ofis Şıklığı',
    longevity: 89,
    sillage: 85,
    concentration: 'Extrait de Parfum (%24 Esans)',
    shortDesc: 'Taze bergamot ve portakal çiçeğinin, sabah çiyiyle toplanmış gül yaprakları, paçuli ve vanilya ile kurduğu asil zarafet.',
    mainAccords: [
      { name: 'Narenciye', percent: 94, color: '#E9C46A' },
      { name: 'Paçuli', percent: 88, color: '#8D6E63' },
      { name: 'Beyaz Çiçeksi', percent: 84, color: '#F2CC8F' },
      { name: 'Gül', percent: 80, color: '#E5989B' },
      { name: 'Tatlı Vanilya', percent: 74, color: '#E07A5F' }
    ],
    pyramid: {
      top: ['Kan Portakalı', 'Mandalina', 'Bergamot'],
      heart: ['Türk Gülü', 'Yasemin', 'Ylang-Ylang', 'Portakal Çiçeği'],
      base: ['Paçuli', 'Vanilya', 'Beyaz Misk', 'Vetiver', 'Tonka Fasulyesi']
    }
  },
  {
    id: 'frestin-113',
    code: 'No. 113',
    name: 'FRESTIN Tobacco Vanille',
    fragranticaRef: 'Tom Ford Tobacco Vanille',
    brandRef: 'Tom Ford',
    subtitle: 'Zengin Tütün Yaprağı, Vanilya & Baharat',
    gender: 'Unisex',
    category: 'Oryantal',
    price50: PRICE_50ML,
    price100: PRICE_100ML,
    inStock: false,
    stockCount: 0,
    shopierLink50: '',
    shopierLink100: '',
    rating: 4.94,
    reviews: 190,
    badge: 'Kış Efsanesi',
    bottleColor: '#3B2318',
    liquidColor: '#D49A6A',
    timeOfDay: 'Gece & Soğuk Havalar',
    longevity: 97,
    sillage: 94,
    concentration: 'Extrait de Parfum (%28 Esans)',
    shortDesc: 'Aromatik tütün yaprağı, sıcak baharatlar, kremsi tonka fasulyesi ve vanilyanın oluşturduğu zengin, lüks ve karizmatik kış imzası.',
    mainAccords: [
      { name: 'Vanilya', percent: 96, color: '#E09F3E' },
      { name: 'Tatlı', percent: 92, color: '#E07A5F' },
      { name: 'Tütün', percent: 90, color: '#7F5539' },
      { name: 'Sıcak Baharatlı', percent: 86, color: '#9E2A2B' },
      { name: 'Odunsu', percent: 76, color: '#8D6E63' }
    ],
    pyramid: {
      top: ['Tütün Yaprağı', 'Tarçın', 'Zencefil'],
      heart: ['Vanilya', 'Tonka Fasulyesi', 'Kakao / Çikolata'],
      base: ['Sandal Ağacı', 'Kehribar (Amber)']
    }
  },
  {
    id: 'frestin-114',
    code: 'No. 114',
    name: 'FRESTIN Bleu Profond',
    fragranticaRef: 'Bleu de Chanel EDP',
    brandRef: 'Chanel',
    subtitle: 'Greyfurt, Tütsülü Sedir & Sandal Ağacı',
    gender: 'Erkek',
    category: 'Ferah',
    price50: PRICE_50ML,
    price100: PRICE_100ML,
    inStock: false,
    stockCount: 0,
    shopierLink50: '',
    shopierLink100: '',
    rating: 4.91,
    reviews: 220,
    badge: 'Her Ortama Uyumlu',
    bottleColor: '#1B263B',
    liquidColor: '#CCD5AE',
    timeOfDay: 'Gündüz & Gece',
    longevity: 88,
    sillage: 84,
    concentration: 'Extrait de Parfum (%25 Esans)',
    shortDesc: 'Ferah greyfurt ve limon açılışını, sıcak kehribar, tütsülü sedir ve Yeni Kaledonya sandal ağacıyla dengeleyen centilmen kokusu.',
    mainAccords: [
      { name: 'Narenciye', percent: 94, color: '#E9C46A' },
      { name: 'Amber', percent: 86, color: '#D4A373' },
      { name: 'Odunsu', percent: 84, color: '#7F5539' },
      { name: 'Sıcak Baharatlı', percent: 76, color: '#6B9080' },
      { name: 'Aromatik', percent: 72, color: '#588157' }
    ],
    pyramid: {
      top: ['Greyfurt', 'İtalyan Limonu', 'Nane', 'Pembe Biber'],
      heart: ['Zencefil', 'Yasemin'],
      base: ['Sandal Ağacı', 'Sedir Ağacı', 'Tütsü (Incense)', 'Kehribar (Amber)', 'Paçuli']
    }
  },
  {
    id: 'frestin-115',
    code: 'No. 115',
    name: 'FRESTIN Acqua Mare',
    fragranticaRef: 'Giorgio Armani Acqua di Giò Profondo',
    brandRef: 'Giorgio Armani',
    subtitle: 'Okyanus Notaları, Bergamot & Biberiye',
    gender: 'Erkek',
    category: 'Ferah',
    price50: PRICE_50ML,
    price100: PRICE_100ML,
    inStock: false,
    stockCount: 0,
    shopierLink50: '',
    shopierLink100: '',
    rating: 4.88,
    reviews: 165,
    badge: 'Yaz & Ferahlık',
    bottleColor: '#2A4D69',
    liquidColor: '#E3F2FD',
    timeOfDay: 'Gündüz & Yaz',
    longevity: 85,
    sillage: 82,
    concentration: 'Extrait de Parfum (%24 Esans)',
    shortDesc: 'Derin okyanus akorları, yeşil mandalina, bergamot, lavanta ve mineral miskin sunduğu serinletici Akdeniz rüzgarı.',
    mainAccords: [
      { name: 'Deniz (Akuatik)', percent: 96, color: '#457B9D' },
      { name: 'Aromatik', percent: 90, color: '#6B9080' },
      { name: 'Narenciye', percent: 86, color: '#E9C46A' },
      { name: 'Taze Baharatlı', percent: 78, color: '#84A59D' },
      { name: 'Odunsu Mineral', percent: 70, color: '#8D6E63' }
    ],
    pyramid: {
      top: ['Deniz Notaları', 'Bergamot', 'Mandalina'],
      heart: ['Biberiye', 'Lavanta', 'Sedir Ağacı'],
      base: ['Beyaz Misk', 'Paçuli', 'Kehribar (Amber)']
    }
  },
  {
    id: 'frestin-116',
    code: 'No. 116',
    name: 'FRESTIN Elixir d’Or',
    fragranticaRef: 'Jean Paul Gaultier Le Male Elixir',
    brandRef: 'Jean Paul Gaultier',
    subtitle: 'Bal, Tonka Fasulyesi, Lavanta & Tütün',
    gender: 'Erkek',
    category: 'Oryantal',
    price50: PRICE_50ML,
    price100: PRICE_100ML,
    inStock: true,
    stockCount: 8,
    shopierLink50: '',
    shopierLink100: '',
    rating: 4.94,
    reviews: 210,
    badge: 'Gece Yıldızı',
    bottleColor: '#8B6528',
    liquidColor: '#F6D887',
    timeOfDay: 'Gece & Kış',
    longevity: 95,
    sillage: 93,
    concentration: 'Extrait de Parfum (%27 Esans)',
    shortDesc: 'Aromatik lavantanın altın bal, kavrulmuş tonka fasulyesi, vanilya ve sıcak tütünle buluştuğu son derece çekici gece kokusu.',
    mainAccords: [
      { name: 'Vanilya', percent: 96, color: '#E09F3E' },
      { name: 'Tatlı / Bal', percent: 94, color: '#F4A261' },
      { name: 'Amber', percent: 86, color: '#D97736' },
      { name: 'Lavanta', percent: 82, color: '#9D8189' },
      { name: 'Tütün', percent: 78, color: '#8D6E63' }
    ],
    pyramid: {
      top: ['Lavanta', 'Nane'],
      heart: ['Vanilya', 'Benzoin'],
      base: ['Bal', 'Tonka Fasulyesi', 'Tütün Yaprağı']
    }
  },
  {
    id: 'frestin-117',
    code: 'No. 117',
    name: 'FRESTIN Oud Greatness',
    fragranticaRef: 'Initio Oud for Greatness',
    brandRef: 'Initio Parfums Privés',
    subtitle: 'Kraliyet Öd Ağacı, Safran & Paçuli',
    gender: 'Unisex',
    category: 'Odunsu',
    price50: PRICE_50ML,
    price100: PRICE_100ML,
    inStock: false,
    stockCount: 0,
    shopierLink50: '',
    shopierLink100: '',
    rating: 4.95,
    reviews: 154,
    badge: 'Niş Prestij',
    bottleColor: '#191918',
    liquidColor: '#D8C3A5',
    timeOfDay: 'Gece & Özel Davet',
    longevity: 98,
    sillage: 96,
    concentration: 'Extrait de Parfum (%28 Esans)',
    shortDesc: 'Doğal öd ağacı (oud), safran, lavanta ve paçulinin yarattığı hipnotize edici, güçlü ve otoriter niş parfüm.',
    mainAccords: [
      { name: 'Sıcak Baharatlı', percent: 95, color: '#9E2A2B' },
      { name: 'Öd (Oud) / Odunsu', percent: 94, color: '#582F0E' },
      { name: 'Lavanta', percent: 82, color: '#9D8189' },
      { name: 'Misk', percent: 78, color: '#ADB5BD' },
      { name: 'Paçuli', percent: 74, color: '#7F5539' }
    ],
    pyramid: {
      top: ['Safran', 'Lavanta'],
      heart: ['Öd Ağacı (Oud)'],
      base: ['Paçuli', 'Beyaz Misk']
    }
  },
  {
    id: 'frestin-118',
    code: 'No. 118',
    name: 'FRESTIN Belle Vie',
    fragranticaRef: 'Lancôme La Vie Est Belle',
    brandRef: 'Lancôme',
    subtitle: 'Gurme Pralin, Vanilya, İris & Yasemin',
    gender: 'Kadın',
    category: 'Çiçeksi',
    price50: PRICE_50ML,
    price100: PRICE_100ML,
    inStock: false,
    stockCount: 0,
    shopierLink50: '',
    shopierLink100: '',
    rating: 4.90,
    reviews: 240,
    badge: 'Mutluluk İmzası',
    bottleColor: '#B57B6E',
    liquidColor: '#F9E5D8',
    timeOfDay: 'Gündüz & Gece',
    longevity: 92,
    sillage: 90,
    concentration: 'Extrait de Parfum (%25 Esans)',
    shortDesc: 'Siyah frenk üzümü, portakal çiçeği, iris ve tatlı pralin-vanilya bazıyla girdiği her ortamda neşe ve sıcaklık yayan klasik.',
    mainAccords: [
      { name: 'Tatlı', percent: 96, color: '#E07A5F' },
      { name: 'Vanilya', percent: 90, color: '#E09F3E' },
      { name: 'Meyveli', percent: 82, color: '#F4A261' },
      { name: 'Paçuli', percent: 78, color: '#8D6E63' },
      { name: 'Beyaz Çiçeksi', percent: 74, color: '#F2CC8F' }
    ],
    pyramid: {
      top: ['Siyah Frenk Üzümü', 'Armut'],
      heart: ['İris (Süsen)', 'Yasemin', 'Portakal Çiçeği'],
      base: ['Pralin', 'Vanilya', 'Tonka Fasulyesi', 'Paçuli']
    }
  },
  {
    id: 'frestin-119',
    code: 'No. 119',
    name: 'FRESTIN Noir Carolina',
    fragranticaRef: 'Carolina Herrera Good Girl',
    brandRef: 'Carolina Herrera',
    subtitle: 'Kavrulmuş Kahve, Badem, Tonka & Sümbülteber',
    gender: 'Kadın',
    category: 'Oryantal',
    price50: PRICE_50ML,
    price100: PRICE_100ML,
    inStock: false,
    stockCount: 0,
    shopierLink50: '',
    shopierLink100: '',
    rating: 4.92,
    reviews: 195,
    badge: 'Çekici Gece',
    bottleColor: '#1D2944',
    liquidColor: '#E6D5C3',
    timeOfDay: 'Gece & Davet',
    longevity: 91,
    sillage: 89,
    concentration: 'Extrait de Parfum (%25 Esans)',
    shortDesc: 'Işıltılı yasemin ve sümbülteber çiçeklerinin, kavrulmuş kahve çekirdeği, badem, tonka fasulyesi ve vanilya ile kurduğu cesur kontrast.',
    mainAccords: [
      { name: 'Tatlı', percent: 94, color: '#E07A5F' },
      { name: 'Beyaz Çiçeksi', percent: 90, color: '#F2CC8F' },
      { name: 'Sıcak Baharatlı / Kahve', percent: 86, color: '#7F5539' },
      { name: 'Vanilya / Tonka', percent: 84, color: '#E09F3E' },
      { name: 'Amber', percent: 75, color: '#D97736' }
    ],
    pyramid: {
      top: ['Kahve', 'Badem', 'Bergamot', 'İtalyan Limonu'],
      heart: ['Sümbülteber (Tuberose)', 'Yasemin', 'Portakal Çiçeği', 'Türk Gülü'],
      base: ['Tonka Fasulyesi', 'Kakao / Çikolata', 'Vanilya', 'Pralin', 'Sandal Ağacı']
    }
  },
  {
    id: 'frestin-120',
    code: 'No. 120',
    name: 'FRESTIN Love Marshmallow',
    fragranticaRef: "Kilian Love, Don't Be Shy",
    brandRef: 'By Kilian',
    subtitle: 'Portakal Çiçeği, Karamelize Vanilya & Misk',
    gender: 'Kadın',
    category: 'Oryantal',
    price50: PRICE_50ML,
    price100: PRICE_100ML,
    inStock: false,
    stockCount: 0,
    shopierLink50: '',
    shopierLink100: '',
    rating: 4.94,
    reviews: 168,
    badge: 'Tatlı & Çiçeksi',
    bottleColor: '#A84A4A',
    liquidColor: '#FAD4C0',
    timeOfDay: 'Gece & Romantik',
    longevity: 92,
    sillage: 89,
    concentration: 'Extrait de Parfum (%26 Esans)',
    shortDesc: 'Parlak neroli ve portakal çiçeği kalbinin, yumuşacık marshmallow-vanilya, karamel ve misk ile sarmalandığı bağımlılık yapıcı koku.',
    mainAccords: [
      { name: 'Tatlı', percent: 97, color: '#E07A5F' },
      { name: 'Beyaz Çiçeksi', percent: 92, color: '#F2CC8F' },
      { name: 'Narenciye', percent: 80, color: '#E9C46A' },
      { name: 'Vanilya', percent: 78, color: '#E09F3E' },
      { name: 'Pudramsı Misk', percent: 72, color: '#DDB892' }
    ],
    pyramid: {
      top: ['Neroli', 'Bergamot', 'Pembe Biber'],
      heart: ['Portakal Çiçeği', 'Yasemin', 'Türk Gülü', 'İris (Süsen)'],
      base: ['Vanilya', 'Karamel', 'Kehribar (Amber)', 'Beyaz Misk']
    }
  },
  {
    id: 'frestin-121',
    code: 'No. 121',
    name: 'FRESTIN Black Orchid',
    fragranticaRef: 'Tom Ford Black Orchid',
    brandRef: 'Tom Ford',
    subtitle: 'Koyu Orkide, Paçuli, Çikolata & Baharat',
    gender: 'Unisex',
    category: 'Oryantal',
    price50: PRICE_50ML,
    price100: PRICE_100ML,
    inStock: false,
    stockCount: 0,
    shopierLink50: '',
    shopierLink100: '',
    rating: 4.89,
    reviews: 182,
    badge: 'Karanlık & Gizemli',
    bottleColor: '#221E22',
    liquidColor: '#D6B89C',
    timeOfDay: 'Gece & Kış',
    longevity: 95,
    sillage: 94,
    concentration: 'Extrait de Parfum (%27 Esans)',
    shortDesc: 'Siyah frenk üzümü, egzotik orkide, bitter çikolata, sıcak baharatlar, paçuli ve vanilyanın dramatik ve unutulmaz imzası.',
    mainAccords: [
      { name: 'Sıcak Baharatlı', percent: 95, color: '#9E2A2B' },
      { name: 'Topraksı Paçuli', percent: 90, color: '#582F0E' },
      { name: 'Tatlı', percent: 86, color: '#E07A5F' },
      { name: 'Odunsu', percent: 82, color: '#7F5539' },
      { name: 'Amber', percent: 78, color: '#D97736' }
    ],
    pyramid: {
      top: ['Siyah Frenk Üzümü', 'Ylang-Ylang', 'Bergamot'],
      heart: ['Orkide', 'Yasemin', 'Tarçın'],
      base: ['Paçuli', 'Kakao / Çikolata', 'Tütsü (Incense)', 'Sandal Ağacı', 'Vanilya']
    }
  },
  {
    id: 'frestin-122',
    code: 'No. 122',
    name: 'FRESTIN Gypsy Boheme',
    fragranticaRef: 'Byredo Gypsy Water',
    brandRef: 'Byredo',
    subtitle: 'Bergamot, Çam İğnesi, Ardıç, Vanilya & Sandal',
    gender: 'Unisex',
    category: 'Odunsu',
    price50: PRICE_50ML,
    price100: PRICE_100ML,
    inStock: false,
    stockCount: 0,
    shopierLink50: '',
    shopierLink100: '',
    rating: 4.87,
    reviews: 134,
    badge: 'Doğal & Niş',
    bottleColor: '#4E5D52',
    liquidColor: '#EBF0E6',
    timeOfDay: 'Gündüz & Dört Mevsim',
    longevity: 85,
    sillage: 80,
    concentration: 'Extrait de Parfum (%24 Esans)',
    shortDesc: 'Taze limon, ardıç meyvesi ve karabiber açılışını, çam iğnesi, tütsü, kremamsı sandal ağacı ve yumuşak vanilya ile birleştiren bohem ruh.',
    mainAccords: [
      { name: 'Odunsu', percent: 95, color: '#7F5539' },
      { name: 'Aromatik', percent: 88, color: '#588157' },
      { name: 'Narenciye', percent: 84, color: '#E9C46A' },
      { name: 'Vanilya', percent: 78, color: '#E09F3E' },
      { name: 'Pudramsı', percent: 72, color: '#DDB892' }
    ],
    pyramid: {
      top: ['Bergamot', 'İtalyan Limonu', 'Ardıç Meyvesi', 'Karabiber'],
      heart: ['Çam İğnesi', 'Tütsü (Incense)', 'İris (Süsen)'],
      base: ['Vanilya', 'Sandal Ağacı', 'Kehribar (Amber)']
    }
  },
  {
    id: 'frestin-123',
    code: 'No. 123',
    name: 'FRESTIN Mythos Eros',
    fragranticaRef: 'Versace Eros EDP',
    brandRef: 'Versace',
    subtitle: 'Nane, Yeşil Elma, Tonka & Vanilya',
    gender: 'Erkek',
    category: 'Aromatik',
    price50: PRICE_50ML,
    price100: PRICE_100ML,
    inStock: false,
    stockCount: 0,
    shopierLink50: '',
    shopierLink100: '',
    rating: 4.90,
    reviews: 218,
    badge: 'Genç & Enerjik',
    bottleColor: '#1D4E5F',
    liquidColor: '#D4E8EC',
    timeOfDay: 'Gece & Dört Mevsim',
    longevity: 91,
    sillage: 90,
    concentration: 'Extrait de Parfum (%25 Esans)',
    shortDesc: 'Serin nane yaprakları, canlı yeşil elma, İtalyan limonu ve tonka fasulyesi-vanilya ikilisinin sedir ağacıyla kurduğu çekici denge.',
    mainAccords: [
      { name: 'Vanilya', percent: 94, color: '#E09F3E' },
      { name: 'Aromatik', percent: 90, color: '#457B9D' },
      { name: 'Meyveli / Narenciye', percent: 86, color: '#84A59D' },
      { name: 'Tatlı', percent: 82, color: '#E07A5F' },
      { name: 'Odunsu', percent: 75, color: '#7F5539' }
    ],
    pyramid: {
      top: ['Nane', 'Yeşil Elma', 'İtalyan Limonu'],
      heart: ['Tonka Fasulyesi', 'Ambroxan'],
      base: ['Vanilya', 'Sedir Ağacı', 'Vetiver', 'Meşe Yosunu']
    }
  },
  {
    id: 'frestin-124',
    code: 'No. 124',
    name: 'FRESTIN Gold Million',
    fragranticaRef: 'Paco Rabanne 1 Million Elixir',
    brandRef: 'Paco Rabanne',
    subtitle: 'Kan Portakalı, Tarçın, Gül, Deri & Amber',
    gender: 'Erkek',
    category: 'Oryantal',
    price50: PRICE_50ML,
    price100: PRICE_100ML,
    inStock: false,
    stockCount: 0,
    shopierLink50: '',
    shopierLink100: '',
    rating: 4.89,
    reviews: 194,
    badge: 'İddialı İmza',
    bottleColor: '#8F6129',
    liquidColor: '#F5DBA7',
    timeOfDay: 'Gece & Sonbahar/Kış',
    longevity: 93,
    sillage: 92,
    concentration: 'Extrait de Parfum (%26 Esans)',
    shortDesc: 'Kan portakalı ve elma ferahlığının sıcak tarçın, Türk gülü, tonka fasulyesi, yumuşak deri ve kehribarla buluştuğu iddialı koku.',
    mainAccords: [
      { name: 'Sıcak Baharatlı', percent: 95, color: '#B55239' },
      { name: 'Tarçın / Tatlı', percent: 90, color: '#E07A5F' },
      { name: 'Amber', percent: 86, color: '#D97736' },
      { name: 'Deri', percent: 80, color: '#7F5539' },
      { name: 'Narenciye', percent: 76, color: '#E9C46A' }
    ],
    pyramid: {
      top: ['Kan Portakalı', 'Greyfurt', 'Yeşil Elma'],
      heart: ['Tarçın', 'Türk Gülü'],
      base: ['Kehribar (Amber)', 'Deri', 'Tonka Fasulyesi', 'Paçuli']
    }
  }
];

// ==========================================
// ÖZEL SVG PARFÜM ŞİŞESİ İLLÜSTRASYONU
// ==========================================
const PerfumeBottleSVG = ({
  bottleColor = '#1E1E1C',
  liquidColor = '#F3D5B5',
  code = 'No. 101',
  name = 'FRESTIN',
  size = 'md'
}) => {
  const dimensions =
    size === 'lg' ? 'w-40 h-52' : size === 'sm' ? 'w-14 h-20' : 'w-28 h-36';
  return (
    <div className={`relative flex items-center justify-center select-none ${dimensions}`}>
      <svg viewBox="0 0 160 220" className="w-full h-full drop-shadow-md">
        <defs>
          <linearGradient id={`liq-${code}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={liquidColor} stopOpacity="0.92" />
            <stop offset="100%" stopColor={bottleColor} stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id={`glass-${code}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
            <stop offset="20%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="80%" stopColor="#000000" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        <ellipse cx="80" cy="208" rx="46" ry="6" fill="rgba(30,30,28,0.12)" />

        {/* Kapak */}
        <rect x="62" y="16" width="36" height="30" rx="4" fill={bottleColor} />
        <rect x="65" y="16" width="8" height="30" fill="rgba(255,255,255,0.18)" />
        <rect x="66" y="46" width="28" height="8" rx="1" fill="#C89D7C" />
        <rect x="70" y="54" width="20" height="6" fill="#A67B5B" />

        {/* Cam Gövde */}
        <rect
          x="32"
          y="60"
          width="96"
          height="142"
          rx="14"
          fill="#FAF7F2"
          stroke="#D6CFC2"
          strokeWidth="2"
        />

        {/* Parfüm Sıvısı */}
        <path
          d="M36 86 Q80 90 124 86 L124 190 Q124 198 116 198 L44 198 Q36 198 36 190 Z"
          fill={`url(#liq-${code})`}
        />

        <line x1="80" y1="60" x2="74" y2="194" stroke="rgba(120,120,115,0.35)" strokeWidth="1.5" />

        <rect
          x="32"
          y="60"
          width="96"
          height="142"
          rx="14"
          fill={`url(#glass-${code})`}
        />

        <path d="M34 190 L126 190" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />

        {/* Krem Etiket */}
        <rect
          x="44"
          y="96"
          width="72"
          height="74"
          rx="2"
          fill="#FAF7F2"
          stroke={bottleColor}
          strokeWidth="1"
        />
        <rect
          x="47"
          y="99"
          width="66"
          height="68"
          fill="none"
          stroke="#D6CFC2"
          strokeWidth="0.6"
        />

        <text
          x="80"
          y="114"
          textAnchor="middle"
          fill="#1E1E1C"
          fontSize="8.5"
          fontWeight="700"
          letterSpacing="2"
          fontFamily="serif"
        >
          FRESTIN
        </text>
        <line x1="60" y1="119" x2="100" y2="119" stroke="#B86B43" strokeWidth="0.7" />
        <text
          x="80"
          y="132"
          textAnchor="middle"
          fill="#B86B43"
          fontSize="8"
          fontWeight="600"
          fontFamily="monospace"
        >
          {code}
        </text>
        <text
          x="80"
          y="145"
          textAnchor="middle"
          fill="#1E1E1C"
          fontSize="6"
          fontWeight="600"
          fontFamily="sans-serif"
        >
          {name.replace('FRESTIN ', '').slice(0, 15)}
        </text>
        <text x="80" y="159" textAnchor="middle" fill="#78756E" fontSize="4.8" letterSpacing="1">
          EXTRAIT DE PARFUM
        </text>
      </svg>
    </div>
  );
};

// ==========================================
// ANA UYGULAMA BİLEŞENİ
// ==========================================
export default function App() {
  const [activeTab, setActiveTab] = useState('finder');

  // Katalog ve Nota Kategorileri State'i (LocalStorage'dan stok/Shopier link ayarlarını okur)
  const [catalog, setCatalog] = useState(() => {
    try {
      const savedConfig = localStorage.getItem(STOCK_CONFIG_STORAGE_KEY);
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        return INITIAL_CATALOG.map((item) => {
          if (parsed[item.id]) {
            return { ...item, ...parsed[item.id] };
          }
          return item;
        });
      }
    } catch (e) {
      // Fallback to default
    }
    return INITIAL_CATALOG;
  });

  const [noteCategories, setNoteCategories] = useState(INITIAL_NOTE_CATEGORIES);

  // --- PARFÜMÜNÜ BUL STATE'LERİ ---
  const [selectedRefIds, setSelectedRefIds] = useState(['frestin-101', 'frestin-102']);
  const [refSearchQuery, setRefSearchQuery] = useState('');
  const [customFragranticaFamily, setCustomFragranticaFamily] = useState('Odunsu & Baharatlı');
  const [likedNotes, setLikedNotes] = useState(['Bergamot', 'Sedir Ağacı', 'Vanilya']);
  const [dislikedNotes, setDislikedNotes] = useState([]);
  const [noteSelectionMode, setNoteSelectionMode] = useState('like');
  const [noteSearchFilter, setNoteSearchFilter] = useState('');
  const [customNoteInput, setCustomNoteInput] = useState('');
  const [preferredGender, setPreferredGender] = useState('Tümü');
  const [preferredTime, setPreferredTime] = useState('Tümü');

  // --- MAĞAZA STATE'LERİ ---
  const [storeFilter, setStoreFilter] = useState('Tümü');
  const [storeSearch, setStoreSearch] = useState('');
  const [selectedSizes, setSelectedSizes] = useState({});
  const [detailModalProduct, setDetailModalProduct] = useState(null);

  // --- STOKLU ÜRÜNLER & SHOPIER YÖNETİM PANELİ STATE'LERİ ---
  const [stockGenderFilter, setStockGenderFilter] = useState('Tümü');
  const [isStockManagerOpen, setIsStockManagerOpen] = useState(false);
  const [newStockPerfumeForm, setNewStockPerfumeForm] = useState({
    name: '',
    fragranticaRef: '',
    subtitle: '',
    gender: 'Unisex',
    stockCount: 5,
    shopierLink50: '',
    shopierLink100: ''
  });

  // --- SEPET & ÖDEME STATE'LERİ ---
  const [cart, setCart] = useState([
    {
      product: INITIAL_CATALOG[1],
      size: '50ml',
      price: PRICE_50ML,
      qty: 1
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // --- SHOPIER YÖNLENDİRME & SİPARİŞ NOTU KOPYALAMA STATE'İ ---
  const [shopierRedirectModal, setShopierRedirectModal] = useState(null);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState(false);

  const estimatedShipDate = useMemo(() => getEstimatedShippingDate(), []);

  // Katalogdaki stok/link değişikliklerini LocalStorage'a kaydet
  useEffect(() => {
    try {
      const configToSave = {};
      catalog.forEach((item) => {
        configToSave[item.id] = {
          inStock: item.inStock,
          stockCount: item.stockCount,
          shopierLink50: item.shopierLink50 || '',
          shopierLink100: item.shopierLink100 || ''
        };
      });
      localStorage.setItem(STOCK_CONFIG_STORAGE_KEY, JSON.stringify(configToSave));
    } catch (e) {
      // Ignore storage errors
    }
  }, [catalog]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getSelectedSize = (productId) => selectedSizes[productId] || '50ml';
  const setProductSize = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  // ==========================================
  // AKILLI SHOPIER LİNK ÇÖZÜCÜ (STOKLU ÜRÜN ÖZEL LİNKİ VEYA GENEL LİNK)
  // ==========================================
  const resolveProductShopierUrl = (product, size) => {
    const customUrl = size === '100ml' ? product.shopierLink100 : product.shopierLink50;
    if (customUrl && customUrl.trim().startsWith('http')) {
      return {
        url: customUrl.trim(),
        isCustomProductLink: true
      };
    }
    return {
      url: SHOPIER_LINKS[size] || SHOPIER_LINKS['50ml'],
      isCustomProductLink: false
    };
  };

  // Shopier Hızlı Satın Alma & Sipariş Notu Kopyalama İşlemi
  const handleShopierBuy = async (product, customSize) => {
    const size = customSize || getSelectedSize(product.id);
    const { url: shopierUrl, isCustomProductLink } = resolveProductShopierUrl(product, size);
    const price = size === '100ml' ? PRICE_100ML : PRICE_50ML;

    // Eğer stoklu ürün için özel Shopier ürün linki tanımlanmışsa doğrudan yeni sekmede de açabilir veya bilgi modalı gösterir
    const deliveryNote = product.inStock
      ? 'STOKLU ÜRÜN (Hemen Teslim / 1-2 İş Gününde Kargo)'
      : '20 Gün İçinde Taze Üretim Kargo';
    const orderNote = `FRESTIN Siparişi: ${product.name} (Fragrantica Ref: ${product.fragranticaRef}) - Boyut: ${size} (${price} TL) | ${deliveryNote}`;

    await copyTextToClipboard(orderNote);

    setShopierRedirectModal({
      product,
      size,
      price,
      shopierUrl,
      isCustomProductLink,
      orderNote
    });
  };

  // Stoklu Ürün Ayarlarını Güncelleme Fonksiyonu
  const handleUpdateProductStockConfig = (productId, field, value) => {
    setCatalog((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  // Sıfırdan Yeni Bir Stoklu Ürün Ekleme (Shopier'e eklediğiniz yeni bir parfüm için)
  const handleCreateNewStockProduct = (e) => {
    e.preventDefault();
    if (!newStockPerfumeForm.name.trim()) {
      showToast('Lütfen parfüm adını girin.');
      return;
    }

    const newCode = `No. ${catalog.length + 101}`;
    const newProduct = {
      id: `frestin-stock-${Date.now()}`,
      code: newCode,
      name: newStockPerfumeForm.name.trim(),
      fragranticaRef: newStockPerfumeForm.fragranticaRef.trim() || newStockPerfumeForm.name.trim(),
      brandRef: 'Frestin Stoklu Koleksiyon',
      subtitle: newStockPerfumeForm.subtitle.trim() || 'Extrait de Parfum • Hazır Stok',
      gender: newStockPerfumeForm.gender,
      category: 'Özel',
      price50: PRICE_50ML,
      price100: PRICE_100ML,
      inStock: true,
      stockCount: Number(newStockPerfumeForm.stockCount) || 5,
      shopierLink50: newStockPerfumeForm.shopierLink50.trim(),
      shopierLink100: newStockPerfumeForm.shopierLink100.trim(),
      rating: 5.0,
      reviews: 18,
      badge: 'Hemen Teslim',
      bottleColor: '#284B37',
      liquidColor: '#D8F3DC',
      timeOfDay: 'Dört Mevsim',
      longevity: 95,
      sillage: 92,
      concentration: 'Extrait de Parfum (%26 Esans)',
      shortDesc: 'Maserasyon (dinlendirme) sürecini tamamlamış, stoklarımızda hemen kargoya hazır Frestin parfümü.',
      mainAccords: [
        { name: 'İmza Akor', percent: 95, color: '#4A7C59' },
        { name: 'Kalıcı Baz', percent: 90, color: '#B86B43' }
      ],
      pyramid: {
        top: ['Bergamot', 'Özel Harmanı'],
        heart: ['Kalp Notalar'],
        base: ['Kehribar (Amber)', 'Beyaz Misk', 'Odunsu Baz']
      }
    };

    setCatalog((prev) => [newProduct, ...prev]);
    setNewStockPerfumeForm({
      name: '',
      fragranticaRef: '',
      subtitle: '',
      gender: 'Unisex',
      stockCount: 5,
      shopierLink50: '',
      shopierLink100: ''
    });
    showToast(`"${newProduct.name}" stoklu ürünlere ve Shopier sistemine eklendi!`);
  };

  // Referans parfüm seç/kaldır
  const toggleRefPerfume = (id) => {
    if (selectedRefIds.includes(id)) {
      setSelectedRefIds(selectedRefIds.filter((item) => item !== id));
    } else {
      if (selectedRefIds.length >= 4) {
        showToast('Analiz doğruluğu için en fazla 4 referans parfüm seçebilirsiniz.');
        return;
      }
      setSelectedRefIds([...selectedRefIds, id]);
    }
  };

  // ==========================================
  // KULLANICININ KENDİ NOTASINI GİRMESİ / EKLEMESİ
  // ==========================================
  const handleAddCustomNote = (e) => {
    if (e) e.preventDefault();
    const raw = customNoteInput.trim();
    if (!raw) return;

    const formattedNote = raw.charAt(0).toUpperCase() + raw.slice(1);

    const existsInCategories = noteCategories.some((cat) =>
      cat.notes.some((n) => n.name.toLowerCase() === formattedNote.toLowerCase())
    );

    if (!existsInCategories) {
      setNoteCategories((prev) => {
        const customCatExists = prev.some((c) => c.id === 'user-custom-notes');
        if (customCatExists) {
          return prev.map((c) =>
            c.id === 'user-custom-notes'
              ? {
                  ...c,
                  notes: [
                    ...c.notes,
                    { name: formattedNote, desc: 'Sizin eklediğiniz özel nota', icon: '✨' }
                  ]
                }
              : c
          );
        } else {
          return [
            {
              id: 'user-custom-notes',
              title: 'Sizin Eklediğiniz Özel Notalar',
              color: '#B86B43',
              notes: [{ name: formattedNote, desc: 'Sizin eklediğiniz özel nota', icon: '✨' }]
            },
            ...prev
          ];
        }
      });
    }

    if (noteSelectionMode === 'like') {
      setDislikedNotes((prev) => prev.filter((n) => n.toLowerCase() !== formattedNote.toLowerCase()));
      if (!likedNotes.some((n) => n.toLowerCase() === formattedNote.toLowerCase())) {
        setLikedNotes((prev) => [...prev, formattedNote]);
      }
      showToast(`"${formattedNote}" sevdiğiniz notalara (+) eklendi!`);
    } else {
      setLikedNotes((prev) => prev.filter((n) => n.toLowerCase() !== formattedNote.toLowerCase()));
      if (!dislikedNotes.some((n) => n.toLowerCase() === formattedNote.toLowerCase())) {
        setDislikedNotes((prev) => [...prev, formattedNote]);
      }
      showToast(`"${formattedNote}" istemediğiniz notalara (-) eklendi!`);
    }

    setCustomNoteInput('');
  };

  // ==========================================
  // FRAGRANTICA ARŞİVİNDEN DİNAMİK PARFÜM EKLEME
  // ==========================================
  const handleAddCustomFragranticaPerfume = (customName, addToCartDirectly = false) => {
    const cleanName = customName.trim();
    if (!cleanName) return;

    const familyMap = {
      'Odunsu & Baharatlı': {
        category: 'Odunsu',
        top: ['Bergamot', 'Karabiber', 'Kakule'],
        heart: ['Sedir Ağacı', 'Lavanta', 'Paçuli'],
        base: ['Sandal Ağacı', 'Vetiver', 'Ambroxan'],
        accords: [
          { name: 'Odunsu', percent: 95, color: '#7F5539' },
          { name: 'Taze Baharatlı', percent: 86, color: '#6B9080' },
          { name: 'Aromatik', percent: 78, color: '#588157' },
          { name: 'Amber', percent: 72, color: '#D4A373' }
        ]
      },
      'Tatlı, Vanilya & Oryantal': {
        category: 'Oryantal',
        top: ['Safran', 'Tarçın', 'Kan Portakalı'],
        heart: ['Vanilya', 'Tonka Fasulyesi', 'Bal'],
        base: ['Kehribar (Amber)', 'Tütün Yaprağı', 'Beyaz Misk'],
        accords: [
          { name: 'Vanilya / Tatlı', percent: 96, color: '#E09F3E' },
          { name: 'Amber', percent: 90, color: '#D97736' },
          { name: 'Sıcak Baharatlı', percent: 84, color: '#9E2A2B' },
          { name: 'Odunsu', percent: 74, color: '#8D6E63' }
        ]
      },
      'Ferah, Narenciye & Akuatik': {
        category: 'Ferah',
        top: ['İtalyan Limonu', 'Bergamot', 'Deniz Notaları'],
        heart: ['Greyfurt', 'Lavanta', 'Yeşil Elma'],
        base: ['Beyaz Misk', 'Sedir Ağacı', 'Ambroxan'],
        accords: [
          { name: 'Narenciye', percent: 96, color: '#E9C46A' },
          { name: 'Deniz (Akuatik)', percent: 90, color: '#457B9D' },
          { name: 'Aromatik Ferah', percent: 82, color: '#6B9080' },
          { name: 'Temiz Misk', percent: 76, color: '#ADB5BD' }
        ]
      },
      'Çiçeksi, Meyveli & Zarif': {
        category: 'Çiçeksi',
        top: ['Liçi (Lychee)', 'Bergamot', 'Siyah Frenk Üzümü'],
        heart: ['Türk Gülü', 'Yasemin', 'Portakal Çiçeği'],
        base: ['Beyaz Misk', 'Vanilya', 'Paçuli'],
        accords: [
          { name: 'Çiçeksi / Gül', percent: 95, color: '#E5989B' },
          { name: 'Meyveli', percent: 88, color: '#F28482' },
          { name: 'Tatlı Misk', percent: 82, color: '#B5838D' },
          { name: 'Vanilya', percent: 75, color: '#F2CC8F' }
        ]
      }
    };

    const profile = familyMap[customFragranticaFamily] || familyMap['Odunsu & Baharatlı'];
    const customCode = `No. ${catalog.length + 101}`;
    const newPerfume = {
      id: `frestin-custom-${Date.now()}`,
      code: customCode,
      name: `FRESTIN Özel: ${cleanName}`,
      fragranticaRef: cleanName,
      brandRef: 'Fragrantica Arşivi',
      subtitle: `${customFragranticaFamily} • Özel Formülasyon`,
      gender: preferredGender === 'Tümü' ? 'Unisex' : preferredGender,
      category: profile.category,
      price50: PRICE_50ML,
      price100: PRICE_100ML,
      inStock: false,
      stockCount: 0,
      shopierLink50: '',
      shopierLink100: '',
      rating: 5.0,
      reviews: 12,
      badge: 'Fragrantica Özel Üretim',
      bottleColor: '#5C4033',
      liquidColor: '#F3D5B5',
      timeOfDay: 'Dört Mevsim İmza',
      longevity: 94,
      sillage: 91,
      concentration: 'Extrait de Parfum (%26 Esans)',
      shortDesc: `Fragrantica arşivindeki "${cleanName}" parfümünün nota piramidine sadık kalınarak siparişiniz üzerine taze hazırlanan özel Frestin üretimi.`,
      mainAccords: profile.accords,
      pyramid: {
        top: profile.top,
        heart: profile.heart,
        base: profile.base
      }
    };

    setCatalog((prev) => [newPerfume, ...prev]);
    if (!selectedRefIds.includes(newPerfume.id)) {
      setSelectedRefIds((prev) => [...prev.slice(0, 3), newPerfume.id]);
    }
    setRefSearchQuery('');
    setStoreSearch('');

    if (addToCartDirectly) {
      addToCart(newPerfume, '50ml');
    } else {
      showToast(`"${cleanName}" Fragrantica arşivimizden listeye ve referanslarınıza eklendi!`);
    }
  };

  // Nota seç/kaldır
  const handleNoteClick = (noteName) => {
    if (noteSelectionMode === 'like') {
      if (dislikedNotes.includes(noteName)) {
        setDislikedNotes(dislikedNotes.filter((n) => n !== noteName));
      }
      if (likedNotes.includes(noteName)) {
        setLikedNotes(likedNotes.filter((n) => n !== noteName));
      } else {
        setLikedNotes([...likedNotes, noteName]);
      }
    } else {
      if (likedNotes.includes(noteName)) {
        setLikedNotes(likedNotes.filter((n) => n !== noteName));
      }
      if (dislikedNotes.includes(noteName)) {
        setDislikedNotes(dislikedNotes.filter((n) => n !== noteName));
      } else {
        setDislikedNotes([...dislikedNotes, noteName]);
      }
    }
  };

  // ==========================================
  // FRAGRANTICA ÇOKLU ÖNERİ ALGORİTMASI (3 SEÇENEK & UYUMLULUK %)
  // ==========================================
  const recommendationResults = useMemo(() => {
    const selectedRefs = catalog.filter((item) => selectedRefIds.includes(item.id));
    const refNotesSet = new Set();
    const refCategories = new Set();

    selectedRefs.forEach((ref) => {
      [...ref.pyramid.top, ...ref.pyramid.heart, ...ref.pyramid.base].forEach((n) =>
        refNotesSet.add(n)
      );
      refCategories.add(ref.category);
    });

    const scored = catalog.map((product) => {
      let rawScore = 58;
      const matchedLikedNotes = [];
      const sharedWithRefs = [];
      const penalizedNotes = [];

      const allProductNotes = [
        ...product.pyramid.top,
        ...product.pyramid.heart,
        ...product.pyramid.base
      ];

      const isDirectRef = selectedRefIds.includes(product.id);
      if (isDirectRef) {
        rawScore += 18;
      }
      if (refCategories.has(product.category)) {
        rawScore += 8;
      }

      allProductNotes.forEach((note) => {
        if (refNotesSet.has(note)) {
          rawScore += 4.5;
          sharedWithRefs.push(note);
        }
      });

      likedNotes.forEach((liked) => {
        const lowerLiked = liked.toLowerCase();
        const foundInNotes = allProductNotes.some((n) => n.toLowerCase().includes(lowerLiked));
        const foundInDescOrAccords =
          product.subtitle.toLowerCase().includes(lowerLiked) ||
          product.shortDesc.toLowerCase().includes(lowerLiked) ||
          product.mainAccords.some((acc) => acc.name.toLowerCase().includes(lowerLiked));

        if (foundInNotes || foundInDescOrAccords) {
          rawScore += 10;
          matchedLikedNotes.push(liked);
        }
      });

      dislikedNotes.forEach((disliked) => {
        const lowerDisliked = disliked.toLowerCase();
        const foundInNotes = allProductNotes.some((n) => n.toLowerCase().includes(lowerDisliked));
        const foundInDescOrAccords =
          product.subtitle.toLowerCase().includes(lowerDisliked) ||
          product.mainAccords.some((acc) => acc.name.toLowerCase().includes(lowerDisliked));

        if (foundInNotes || foundInDescOrAccords) {
          rawScore -= 26;
          penalizedNotes.push(disliked);
        }
      });

      if (preferredGender !== 'Tümü') {
        if (product.gender === preferredGender) {
          rawScore += 7;
        } else if (product.gender === 'Unisex') {
          rawScore += 4;
        } else {
          rawScore -= 16;
        }
      }

      if (preferredTime !== 'Tümü') {
        if (product.timeOfDay.toLowerCase().includes(preferredTime.toLowerCase())) {
          rawScore += 5;
        }
      }

      const matchScore = Math.max(42, Math.min(99, Math.round(rawScore)));

      let matchReason = '';
      if (isDirectRef && matchedLikedNotes.length > 0) {
        matchReason = `Sevdiğiniz "${product.fragranticaRef}" profilinin birebir nota DNA'sını ve seçtiğiniz ${matchedLikedNotes.join(', ')} notalarını taşıyor.`;
      } else if (sharedWithRefs.length > 0 && matchedLikedNotes.length > 0) {
        matchReason = `Önceki parfümlerinizle ortak olan ${sharedWithRefs.slice(0, 3).join(', ')} akorlarını, favoriniz olan ${matchedLikedNotes.join(', ')} notalarıyla birleştiriyor.`;
      } else if (sharedWithRefs.length > 0) {
        matchReason = `Kullandığınız parfümlerdeki ${sharedWithRefs.slice(0, 4).join(', ')} nota geçişlerine sahip çok güçlü bir alternatif.`;
      } else if (matchedLikedNotes.length > 0) {
        matchReason = `Özellikle talep ettiğiniz ${matchedLikedNotes.join(', ')} notalarını merkezine alan yüksek kalıcılıklı kompozisyon.`;
      } else {
        matchReason = `Fragrantica kullanıcılarının en yüksek puan verdiği dengeli nota piramidine sahip imza parfümümüz.`;
      }

      return {
        ...product,
        matchScore,
        isDirectRef,
        matchedLikedNotes: [...new Set(matchedLikedNotes)],
        sharedWithRefs: [...new Set(sharedWithRefs)],
        penalizedNotes,
        matchReason
      };
    });

    const sorted = scored.sort((a, b) => b.matchScore - a.matchScore);
    return sorted.map((item, idx) => {
      if (idx === 1 && item.matchScore >= sorted[0].matchScore) {
        return { ...item, matchScore: Math.max(45, sorted[0].matchScore - 3) };
      }
      if (idx === 2 && item.matchScore >= sorted[1].matchScore) {
        return { ...item, matchScore: Math.max(42, sorted[1].matchScore - 4) };
      }
      return item;
    });
  }, [catalog, selectedRefIds, likedNotes, dislikedNotes, preferredGender, preferredTime]);

  // --- SEPET İŞLEMLERİ ---
  const addToCart = (product, customSize) => {
    const size = customSize || getSelectedSize(product.id);
    const price = size === '100ml' ? PRICE_100ML : PRICE_50ML;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.size === size
      );
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].qty += 1;
        return updated;
      }
      return [...prevCart, { product, size, price, qty: 1 }];
    });

    showToast(`${product.name} (${size} - ${price} TL) sepete eklendi.`);
  };

  const updateCartQty = (productId, size, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.product.id === productId && item.size === size) {
            return { ...item, qty: item.qty + delta };
          }
          return item;
        })
        .filter((item) => item.qty > 0)
    );
  };

  const cartCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.qty, 0),
    [cart]
  );

  // Mağaza Filtreleme
  const filteredStoreProducts = useMemo(() => {
    return catalog.filter((p) => {
      const matchesCategory =
        storeFilter === 'Tümü' ||
        p.gender === storeFilter ||
        p.category === storeFilter;
      const q = storeSearch.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        p.fragranticaRef.toLowerCase().includes(q) ||
        p.brandRef.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        [...p.pyramid.top, ...p.pyramid.heart, ...p.pyramid.base].some((n) =>
          n.toLowerCase().includes(q)
        );
      return matchesCategory && matchesSearch;
    });
  }, [catalog, storeFilter, storeSearch]);

  // Stoklu Ürünler Filtreleme
  const stockedProducts = useMemo(() => {
    return catalog.filter((p) => {
      if (!p.inStock) return false;
      if (stockGenderFilter === 'Tümü') return true;
      return p.gender === stockGenderFilter;
    });
  }, [catalog, stockGenderFilter]);

  // Referans parfüm arama filtresi
  const filteredRefPerfumes = useMemo(() => {
    const q = refSearchQuery.toLowerCase();
    return catalog.filter(
      (r) =>
        r.fragranticaRef.toLowerCase().includes(q) ||
        r.brandRef.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        [...r.pyramid.top, ...r.pyramid.heart, ...r.pyramid.base].some((n) =>
          n.toLowerCase().includes(q)
        )
    );
  }, [catalog, refSearchQuery]);

  // Nota Arama Filtresi
  const filteredNoteCategories = useMemo(() => {
    const q = noteSearchFilter.trim().toLowerCase();
    if (!q) return noteCategories;
    return noteCategories
      .map((cat) => ({
        ...cat,
        notes: cat.notes.filter(
          (n) => n.name.toLowerCase().includes(q) || n.desc.toLowerCase().includes(q)
        )
      }))
      .filter((cat) => cat.notes.length > 0);
  }, [noteCategories, noteSearchFilter]);

  const rankMeta = [
    {
      rank: '1. ÖNERİ • EN YÜKSEK UYUM',
      badgeBg: 'bg-[#5C6B5E]',
      borderClass: 'border-[#B86B43] ring-2 ring-[#B86B43]/30'
    },
    {
      rank: '2. ÖNERİ • GÜÇLÜ ALTERNATİF',
      badgeBg: 'bg-[#B86B43]',
      borderClass: 'border-[#D6CFC2]'
    },
    {
      rank: '3. ÖNERİ • ÖZEL KEŞİF SEÇENEĞİ',
      badgeBg: 'bg-[#7D5A3C]',
      borderClass: 'border-[#D6CFC2]'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E1C] flex flex-col font-sans selection:bg-[#B86B43]/20">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .font-serif-luxury {
          font-family: 'Cormorant Garamond', Georgia, serif;
        }
        .font-sans {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>

      {/* ÜST DUYURU BANDI */}
      <div className="bg-[#1E1E1C] text-[#FAF7F2] text-xs py-2.5 px-4 text-center tracking-wide flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-[#E9C46A] shrink-0" />
          <span>
            <strong>Stoklu Ürünlerde Hemen Teslim!</strong> Özel üretim siparişler ise{' '}
            <strong className="text-[#E9C46A] underline">20 gün içinde kargoya verilir.</strong>
          </span>
        </div>
        <span className="hidden md:inline text-[#78756E]">•</span>
        <div className="flex items-center gap-1.5 text-[#A3C1A7]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#A3C1A7] shrink-0" />
          <span>50 ml: {PRICE_50ML} TL | 100 ml: {PRICE_100ML} TL</span>
        </div>
        <span className="hidden md:inline text-[#78756E]">•</span>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[#F4A261] hover:underline font-semibold"
        >
          <Instagram className="w-3.5 h-3.5" />
          <span>@frestin_perfumes</span>
        </a>
      </div>

      {/* NAVİGASYON HEADER */}
      <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E6E0D6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
          <button
            onClick={() => setActiveTab('finder')}
            className="text-left group focus:outline-none shrink-0"
          >
            <div className="font-serif-luxury text-3xl sm:text-4xl font-bold tracking-[0.18em] text-[#1E1E1C] group-hover:text-[#B86B43] transition-colors">
              FRESTIN
            </div>
            <div className="text-[10px] tracking-[0.28em] text-[#78756E] uppercase -mt-1">
              PERFUMES
            </div>
          </button>

          {/* Orta Sekmeler */}
          <nav className="hidden lg:flex items-center bg-[#F3EFE6] p-1.5 rounded-full border border-[#E6E0D6]">
            <button
              onClick={() => setActiveTab('finder')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'finder'
                  ? 'bg-[#1E1E1C] text-[#FAF7F2] shadow-sm'
                  : 'text-[#5A5751] hover:text-[#1E1E1C]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D99B72]" />
              <span>Parfümünü Bul</span>
            </button>

            <button
              onClick={() => setActiveTab('instock')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'instock'
                  ? 'bg-[#4A7C59] text-white shadow-sm'
                  : 'text-[#4A7C59] hover:bg-[#4A7C59]/10'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Stoklu Ürünlerimiz</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E9C46A] text-[#1E1E1C] font-bold">
                Hemen Teslim
              </span>
            </button>

            <button
              onClick={() => setActiveTab('store')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'store'
                  ? 'bg-[#1E1E1C] text-[#FAF7F2] shadow-sm'
                  : 'text-[#5A5751] hover:text-[#1E1E1C]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Tüm Parfümler ({catalog.length}+)</span>
            </button>

            <button
              onClick={() => setActiveTab('process')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'process'
                  ? 'bg-[#1E1E1C] text-[#FAF7F2] shadow-sm'
                  : 'text-[#5A5751] hover:text-[#1E1E1C]'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-[#B86B43]" />
              <span>Üretim & Teslimat</span>
            </button>
          </nav>

          {/* Sağ Butonlar */}
          <div className="flex items-center gap-2">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#833AB4]/10 via-[#FD1D1D]/10 to-[#FCB045]/10 hover:from-[#833AB4] hover:to-[#FCB045] text-[#1E1E1C] hover:text-white border border-[#DED8CE] px-3.5 py-2 rounded-full text-xs font-bold transition-all"
              title="Instagram'da Bizi Takip Edin"
            >
              <Instagram className="w-4 h-4 text-[#C13584] group-hover:text-white" />
              <span className="hidden sm:inline">@frestin_perfumes</span>
            </a>

            <button
              onClick={() => setIsDeployGuideOpen(true)}
              className="hidden xl:flex items-center gap-1.5 bg-[#FAF0EA] hover:bg-[#B86B43] text-[#9E5A36] hover:text-white border border-[#B86B43]/40 px-3 py-2 rounded-full text-xs font-bold transition-all"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Yayına Al</span>
            </button>

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

        {/* Mobil & Tablet Sekmeler */}
        <div className="flex lg:hidden border-t border-[#E6E0D6] bg-[#F3EFE6] px-2 py-1.5 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('finder')}
            className={`flex-1 py-2 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 whitespace-nowrap ${
              activeTab === 'finder' ? 'bg-[#1E1E1C] text-white' : 'text-[#5A5751]'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#D99B72]" />
            Parfümünü Bul
          </button>
          <button
            onClick={() => setActiveTab('instock')}
            className={`flex-1 py-2 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 whitespace-nowrap ${
              activeTab === 'instock' ? 'bg-[#4A7C59] text-white' : 'text-[#4A7C59]'
            }`}
          >
            <Zap className="w-3 h-3" />
            Stoklu (Hemen Teslim)
          </button>
          <button
            onClick={() => setActiveTab('store')}
            className={`flex-1 py-2 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 whitespace-nowrap ${
              activeTab === 'store' ? 'bg-[#1E1E1C] text-white' : 'text-[#5A5751]'
            }`}
          >
            <ShoppingBag className="w-3 h-3" />
            Mağaza ({catalog.length}+)
          </button>
          <button
            onClick={() => setActiveTab('process')}
            className={`flex-1 py-2 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 whitespace-nowrap ${
              activeTab === 'process' ? 'bg-[#1E1E1C] text-white' : 'text-[#5A5751]'
            }`}
          >
            <Clock className="w-3 h-3" />
            Teslimat
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

      {/* ==========================================
          SEKME 1: PARFÜMÜNÜ BUL (FRAGRANTICA MOTORU + KENDİ NOTANI YAZ)
      ========================================== */}
      {activeTab === 'finder' && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
          {/* ÜST HERO BANNER */}
          <div className="bg-gradient-to-r from-[#F3EFE6] via-[#FAF7F2] to-[#F3EFE6] border border-[#E6E0D6] rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-full bg-[#B86B43]/15 text-[#9E5A36] text-xs font-semibold mb-3">
                <Sliders className="w-3.5 h-3.5" />
                <span>FRAGRANTICA VERİ TABANI DESTEKLİ PARFÜM BULUCU</span>
              </div>
              <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#1E1E1C] leading-tight">
                Kullandığın Parfümleri ve Notaları Seç,{' '}
                <span className="italic text-[#B86B43]">En Uyumlu 3 Parfümü</span> Keşfet.
              </h1>
              <p className="text-[#5A5751] text-sm sm:text-base mt-2.5 leading-relaxed">
                Fragrantica&apos;da yer alan <strong>her parfüm</strong> listemizde mevcuttur. Daha önce
                kullandığınız kokuları seçin, geniş nota havuzumuzdan seçim yapın veya{' '}
                <strong>istediğiniz herhangi bir notayı kendiniz yazarak ekleyin!</strong>
              </p>
            </div>

            {/* Hızlı Teslimat & Özel Üretim Bilgi Kutusu */}
            <div className="bg-white border border-[#E6E0D6] rounded-2xl p-4 sm:p-5 lg:w-80 shrink-0 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4A7C59] flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Stoklu Ürünler:
                </span>
                <button
                  onClick={() => setActiveTab('instock')}
                  className="text-[11px] font-bold text-white bg-[#4A7C59] px-2.5 py-0.5 rounded-full hover:bg-[#3A6347]"
                >
                  Hemen Teslim →
                </button>
              </div>
              <div className="text-xs text-[#5A5751] leading-relaxed border-t border-[#E6E0D6] pt-2">
                <strong className="text-[#1E1E1C]">Özel Üretim Siparişler:</strong> Siparişiniz üzerine taze hazırlanır ve{' '}
                <strong>20 gün içinde</strong> kargoya verilir.
              </div>
              <div className="pt-1 flex items-center justify-between text-xs font-bold text-[#1E1E1C] border-t border-[#E6E0D6]">
                <span>50 ml: {PRICE_50ML} TL</span>
                <span>•</span>
                <span>100 ml: {PRICE_100ML} TL</span>
              </div>
            </div>
          </div>

          {/* KULLANICI SEÇİM ADIMLARI */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* ADIM 1: DAHA ÖNCE KULLANDIĞI PARFÜMLER */}
            <section className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#E6E0D6] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-[#1E1E1C] text-white text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <div>
                      <h2 className="text-base font-bold text-[#1E1E1C]">
                        Daha Önce Kullandığın Parfümler
                      </h2>
                      <p className="text-[11px] text-[#78756E]">
                        Fragrantica&apos;daki herhangi bir parfümü arayın veya seçin.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F3EFE6] text-[#5A5751]">
                    {selectedRefIds.length} Seçili
                  </span>
                </div>

                {/* Seçili Referansların Hızlı Çipleri */}
                {selectedRefIds.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6E0D6]">
                    {selectedRefIds.map((id) => {
                      const item = catalog.find((c) => c.id === id);
                      if (!item) return null;
                      return (
                        <span
                          key={id}
                          onClick={() => toggleRefPerfume(id)}
                          className="cursor-pointer inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-[#1E1E1C] text-white font-medium hover:bg-[#B86B43] transition-colors"
                        >
                          <span>{item.fragranticaRef}</span>
                          <X className="w-3 h-3" />
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Fragrantica Arama Kutusu */}
                <div className="relative mb-3">
                  <Search className="w-4 h-4 text-[#78756E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={refSearchQuery}
                    onChange={(e) => setRefSearchQuery(e.target.value)}
                    placeholder="Fragrantica'dan herhangi bir parfüm yazın (örn: Sauvage, Chloe, Armani)..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#E6E0D6] rounded-xl text-xs focus:outline-none focus:border-[#B86B43]"
                  />
                </div>

                {/* Eğer aranan parfüm listede yoksa: "Fragrantica Arşivinden Ekle" Kutusu */}
                {refSearchQuery.trim().length > 1 && filteredRefPerfumes.length === 0 && (
                  <div className="p-4 rounded-2xl bg-[#FAF0EA] border border-[#B86B43] mb-3 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-[#B86B43] shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-[#1E1E1C]">
                          &ldquo;{refSearchQuery}&rdquo; Fragrantica Arşivimizde Mevcut!
                        </div>
                        <p className="text-[11px] text-[#5A5751] mt-0.5">
                          Bu parfümü hemen referanslarınıza ekleyebilir veya doğrudan Shopier üzerinden sipariş verebilirsiniz.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleAddCustomFragranticaPerfume(refSearchQuery, false)}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#1E1E1C] text-white text-xs font-bold hover:bg-[#B86B43] transition-colors"
                      >
                        + Referanslarıma Ekle
                      </button>
                      <button
                        onClick={() => {
                          const customObj = {
                            id: `custom-${Date.now()}`,
                            code: 'Özel Üretim',
                            name: `FRESTIN Özel: ${refSearchQuery.trim()}`,
                            fragranticaRef: refSearchQuery.trim(),
                            price50: PRICE_50ML,
                            price100: PRICE_100ML,
                            inStock: false
                          };
                          handleShopierBuy(customObj, '50ml');
                        }}
                        className="py-2 px-3 rounded-xl bg-[#B86B43] text-white text-xs font-bold hover:bg-[#9E5A36] transition-colors flex items-center gap-1"
                      >
                        <span>50ml ({PRICE_50ML} TL)</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          const customObj = {
                            id: `custom-${Date.now()}`,
                            code: 'Özel Üretim',
                            name: `FRESTIN Özel: ${refSearchQuery.trim()}`,
                            fragranticaRef: refSearchQuery.trim(),
                            price50: PRICE_50ML,
                            price100: PRICE_100ML,
                            inStock: false
                          };
                          handleShopierBuy(customObj, '100ml');
                        }}
                        className="py-2 px-3 rounded-xl bg-[#5C6B5E] text-white text-xs font-bold hover:bg-[#49564B] transition-colors flex items-center gap-1"
                      >
                        <span>100ml ({PRICE_100ML} TL)</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Parfüm Listesi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
                  {filteredRefPerfumes.map((ref) => {
                    const isSelected = selectedRefIds.includes(ref.id);
                    return (
                      <button
                        key={ref.id}
                        onClick={() => toggleRefPerfume(ref.id)}
                        className={`text-left p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#FAF0EA] border-[#B86B43] ring-1 ring-[#B86B43]'
                            : 'bg-[#FAF7F2]/60 border-[#E6E0D6] hover:border-[#B86B43]/50 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1.5 w-full">
                          <div className="min-w-0">
                            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#78756E] truncate">
                              {ref.brandRef} • {ref.gender}
                            </div>
                            <div className="font-bold text-xs text-[#1E1E1C] truncate">
                              {ref.fragranticaRef}
                            </div>
                          </div>
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected
                                ? 'bg-[#B86B43] text-white'
                                : 'border border-[#CFC8BC] bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5" />}
                          </div>
                        </div>
                        <div className="text-[10px] text-[#78756E] mt-1.5 truncate">
                          {[...ref.pyramid.top.slice(0, 1), ...ref.pyramid.heart.slice(0, 1), ...ref.pyramid.base.slice(0, 1)].join(' • ')}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E6E0D6] flex items-center justify-between text-[11px] text-[#78756E]">
                <span>Aradığınız parfüm listede görünmüyor mu?</span>
                <span className="font-semibold text-[#B86B43]">Yukarıdaki kutuya adını yazın!</span>
              </div>
            </section>

            {/* ADIM 2: GENİŞLETİLMİŞ NOTA SEÇİCİ + KULLANICININ KENDİ NOTASINI GİRMESİ */}
            <section className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#E6E0D6] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-[#1E1E1C] text-white text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <div>
                      <h2 className="text-base font-bold text-[#1E1E1C]">
                        Notaları Seçin veya Kendi Notanızı Yazın
                      </h2>
                      <p className="text-[11px] text-[#78756E]">
                        75+ hazır notadan seçin veya istediğiniz özel notayı aşağıdan kendiniz ekleyin.
                      </p>
                    </div>
                  </div>

                  {/* Mod Değiştirici */}
                  <div className="flex bg-[#F3EFE6] p-1 rounded-xl border border-[#E6E0D6] self-start">
                    <button
                      onClick={() => setNoteSelectionMode('like')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        noteSelectionMode === 'like'
                          ? 'bg-[#5C6B5E] text-white shadow-xs'
                          : 'text-[#5A5751]'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Sevdiğim (+{likedNotes.length})</span>
                    </button>
                    <button
                      onClick={() => setNoteSelectionMode('dislike')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        noteSelectionMode === 'dislike'
                          ? 'bg-[#9E2A2B] text-white shadow-xs'
                          : 'text-[#5A5751]'
                      }`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>İstemediğim (-{dislikedNotes.length})</span>
                    </button>
                  </div>
                </div>

                {/* KULLANICININ KENDİ NOTASINI YAZABİLECEĞİ VE ARAYABİLECEĞİ ÇUBUK */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 mb-3">
                  <div className="sm:col-span-5 relative">
                    <Search className="w-3.5 h-3.5 text-[#78756E] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={noteSearchFilter}
                      onChange={(e) => setNoteSearchFilter(e.target.value)}
                      placeholder="Mevcut notalarda filtrele..."
                      className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border border-[#E6E0D6] rounded-xl text-xs focus:outline-none focus:border-[#B86B43]"
                    />
                  </div>

                  <form
                    onSubmit={handleAddCustomNote}
                    className="sm:col-span-7 flex items-center gap-1.5"
                  >
                    <input
                      type="text"
                      value={customNoteInput}
                      onChange={(e) => setCustomNoteInput(e.target.value)}
                      placeholder="Listede olmayan bir nota yazın (örn: Mimoza, Kakao, Bambu)..."
                      className="flex-1 px-3 py-2 bg-[#FAF0EA]/70 border border-[#B86B43]/50 rounded-xl text-xs focus:outline-none focus:border-[#B86B43]"
                    />
                    <button
                      type="submit"
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold text-white shrink-0 flex items-center gap-1 transition-colors ${
                        noteSelectionMode === 'like'
                          ? 'bg-[#5C6B5E] hover:bg-[#49564B]'
                          : 'bg-[#9E2A2B] hover:bg-[#7D2021]'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{noteSelectionMode === 'like' ? 'Sevdiğime Ekle' : 'İstemediğime Ekle'}</span>
                    </button>
                  </form>
                </div>

                {/* Seçili Notalar Çubuğu */}
                {(likedNotes.length > 0 || dislikedNotes.length > 0) && (
                  <div className="mb-3 p-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E6E0D6] flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-[#5A5751] mr-1">Seçilenler:</span>
                    {likedNotes.map((note) => (
                      <span
                        key={note}
                        onClick={() => setLikedNotes(likedNotes.filter((n) => n !== note))}
                        className="cursor-pointer inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-[#5C6B5E] text-white font-medium"
                      >
                        + {note} <X className="w-3 h-3" />
                      </span>
                    ))}
                    {dislikedNotes.map((note) => (
                      <span
                        key={note}
                        onClick={() => setDislikedNotes(dislikedNotes.filter((n) => n !== note))}
                        className="cursor-pointer inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-[#9E2A2B] text-white font-medium"
                      >
                        - {note} <X className="w-3 h-3" />
                      </span>
                    ))}
                  </div>
                )}

                {/* Nota Kategorileri Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                  {filteredNoteCategories.map((group) => (
                    <div
                      key={group.id}
                      className="border border-[#E6E0D6] rounded-2xl p-3 bg-[#FAF7F2]/50"
                    >
                      <div
                        className="text-[11px] font-bold uppercase tracking-wider mb-2"
                        style={{ color: group.color }}
                      >
                        {group.title}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {group.notes.map((noteObj) => {
                          const isLiked = likedNotes.includes(noteObj.name);
                          const isDisliked = dislikedNotes.includes(noteObj.name);
                          return (
                            <button
                              key={noteObj.name}
                              onClick={() => handleNoteClick(noteObj.name)}
                              title={noteObj.desc}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all flex items-center gap-1 ${
                                isLiked
                                  ? 'bg-[#5C6B5E] text-white border-[#5C6B5E]'
                                  : isDisliked
                                  ? 'bg-[#9E2A2B] text-white border-[#9E2A2B] line-through'
                                  : 'bg-white text-[#1E1E1C] border-[#E6E0D6] hover:border-[#B86B43]'
                              }`}
                            >
                              <span>{noteObj.icon}</span>
                              <span>{noteObj.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cinsiyet ve Mevsim/Zaman Alt Filtresi */}
              <div className="mt-4 pt-3 border-t border-[#E6E0D6] grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#5A5751] shrink-0">Cinsiyet:</span>
                  <div className="flex-1 grid grid-cols-4 gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#E6E0D6]">
                    {['Tümü', 'Kadın', 'Erkek', 'Unisex'].map((g) => (
                      <button
                        key={g}
                        onClick={() => setPreferredGender(g)}
                        className={`py-1 rounded-lg text-[11px] font-semibold transition-all ${
                          preferredGender === g
                            ? 'bg-[#1E1E1C] text-white'
                            : 'text-[#5A5751]'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#5A5751] shrink-0">Zaman:</span>
                  <div className="flex-1 grid grid-cols-3 gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#E6E0D6]">
                    {['Tümü', 'Gündüz', 'Gece'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setPreferredTime(t)}
                        className={`py-1 rounded-lg text-[11px] font-semibold transition-all ${
                          preferredTime === t
                            ? 'bg-[#B86B43] text-white'
                            : 'text-[#5A5751]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ==========================================
              SONUÇ BÖLÜMÜ: SİZİN İÇİN EN UYUMLU 3 PARFÜM ÖNERİSİ VE UYUM YÜZDELERİ
          ========================================== */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E6E0D6] pb-4">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#B86B43]">
                  <Layers className="w-4 h-4" />
                  <span>KARŞILAŞTIRMALI 3&apos;LÜ PARFÜM ÖNERİSİ</span>
                </div>
                <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#1E1E1C] mt-1">
                  Seçimlerinize En Uygun 3 Frestin Parfümü ve Uyumluluk Oranları
                </h2>
              </div>
              <div className="text-xs text-[#5A5751] bg-[#F3EFE6] px-4 py-2 rounded-full border border-[#E6E0D6]">
                50 ml: <strong>{PRICE_50ML} TL</strong> • 100 ml: <strong>{PRICE_100ML} TL</strong>
              </div>
            </div>

            {/* 3 ADET DETAYLI ÖNERİ KARTI YAN YANA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              {recommendationResults.slice(0, 3).map((rec, index) => {
                const meta = rankMeta[index];
                const selectedSize = getSelectedSize(rec.id);
                const currentPrice = selectedSize === '100ml' ? PRICE_100ML : PRICE_50ML;

                return (
                  <div
                    key={rec.id}
                    className={`bg-white rounded-3xl p-6 border ${meta.borderClass} shadow-md flex flex-col justify-between relative transition-all hover:shadow-xl`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#78756E]">
                          {meta.rank}
                        </span>
                        <span
                          className={`px-3.5 py-1.5 rounded-full ${meta.badgeBg} text-white text-sm font-bold flex items-center gap-1.5 shadow-xs`}
                        >
                          <Award className="w-4 h-4" />
                          <span>%{rec.matchScore} Uyum</span>
                        </span>
                      </div>

                      <div className="w-full h-2 bg-[#F3EFE6] rounded-full overflow-hidden mb-5">
                        <div
                          className="h-full bg-gradient-to-r from-[#5C6B5E] to-[#B86B43] rounded-full transition-all duration-500"
                          style={{ width: `${rec.matchScore}%` }}
                        />
                      </div>

                      <div className="flex items-center gap-4 pb-4 border-b border-[#E6E0D6]">
                        <div
                          onClick={() => setDetailModalProduct(rec)}
                          className="cursor-pointer bg-[#FAF7F2] rounded-2xl p-3 border border-[#E6E0D6] shrink-0 hover:scale-105 transition-transform"
                        >
                          <PerfumeBottleSVG
                            bottleColor={rec.bottleColor}
                            liquidColor={rec.liquidColor}
                            code={rec.code}
                            name={rec.name}
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1 mb-1">
                            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF0EA] text-[#B86B43]">
                              Ref: {rec.fragranticaRef}
                            </span>
                            {rec.inStock && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#4A7C59] text-white">
                                <Zap className="w-2.5 h-2.5" /> Hemen Teslim
                              </span>
                            )}
                          </div>
                          <h3
                            onClick={() => setDetailModalProduct(rec)}
                            className="font-serif-luxury text-2xl font-bold text-[#1E1E1C] hover:text-[#B86B43] cursor-pointer leading-tight"
                          >
                            {rec.name}
                          </h3>
                          <p className="text-xs text-[#78756E] mt-0.5">{rec.subtitle}</p>
                          <div className="text-[11px] font-medium text-[#5C6B5E] mt-1.5">
                            {rec.gender} • {rec.concentration}
                          </div>
                        </div>
                      </div>

                      <div className="my-4 p-3 rounded-2xl bg-[#FAF7F2] border border-[#E6E0D6] text-xs text-[#45433E] leading-relaxed">
                        <strong className="text-[#9E5A36] block mb-0.5">
                          Neden %{rec.matchScore} Uyumlu?
                        </strong>
                        {rec.matchReason}
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#5A5751] mb-2">
                          <span>Ana Akorlar (Main Accords)</span>
                          <span className="text-[10px] font-normal text-[#78756E]">Fragrantica</span>
                        </div>
                        <div className="space-y-1.5">
                          {rec.mainAccords.slice(0, 4).map((accord) => (
                            <div key={accord.name} className="flex items-center gap-2">
                              <span className="w-28 text-[11px] font-medium text-[#1E1E1C] truncate">
                                {accord.name}
                              </span>
                              <div className="flex-1 h-3.5 bg-[#F3EFE6] rounded-r-full overflow-hidden">
                                <div
                                  className="h-full rounded-r-full text-[9px] font-bold text-white flex items-center justify-end pr-1.5"
                                  style={{
                                    width: `${accord.percent}%`,
                                    backgroundColor: accord.color
                                  }}
                                >
                                  %{accord.percent}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#F3EFE6]/60 border border-[#E6E0D6] space-y-2 text-xs mb-4">
                        <div className="flex items-start gap-2">
                          <span className="w-16 shrink-0 font-bold text-[#B86B43]">Üst Nota:</span>
                          <span className="text-[#1E1E1C]">{rec.pyramid.top.join(', ')}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-16 shrink-0 font-bold text-[#5C6B5E]">Orta Nota:</span>
                          <span className="text-[#1E1E1C]">{rec.pyramid.heart.join(', ')}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-16 shrink-0 font-bold text-[#1E1E1C]">Alt Nota:</span>
                          <span className="text-[#1E1E1C]">{rec.pyramid.base.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E6E0D6] space-y-3">
                      {rec.inStock ? (
                        <div className="flex items-center gap-2 text-[11px] bg-[#E8F3EB] text-[#2E5A3C] px-3 py-1.5 rounded-xl font-semibold">
                          <Zap className="w-3.5 h-3.5 shrink-0 fill-current" />
                          <span>Stoklu Ürün: Hemen Teslim (1-2 İş Gününde Kargoda)</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-[11px] bg-[#FAF0EA] text-[#9E5A36] px-3 py-1.5 rounded-xl font-medium">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>Özel Üretim: Siparişten sonra 20 gün içinde kargoya verilir.</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex bg-[#F3EFE6] p-1 rounded-xl border border-[#E6E0D6]">
                          {['50ml', '100ml'].map((sz) => (
                            <button
                              key={sz}
                              onClick={() => setProductSize(rec.id, sz)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                selectedSize === sz
                                  ? 'bg-[#1E1E1C] text-white'
                                  : 'text-[#5A5751]'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-[#1E1E1C]">{currentPrice} TL</div>
                          <div className="text-[10px] text-[#78756E]">KDV Dahil</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        <button
                          onClick={() => handleShopierBuy(rec, selectedSize)}
                          className="w-full py-3 rounded-xl bg-[#B86B43] hover:bg-[#9E5A36] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Shopier ile Güvenli Satın Al ({selectedSize})</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setDetailModalProduct(rec)}
                            className="py-2.5 rounded-xl border border-[#DED8CE] hover:border-[#1E1E1C] text-xs font-semibold text-[#1E1E1C]"
                          >
                            Notaları İncele
                          </button>
                          <button
                            onClick={() => addToCart(rec, selectedSize)}
                            className="py-2.5 rounded-xl bg-[#1E1E1C] hover:bg-[#333330] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
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
          </section>
        </main>
      )}

      {/* ==========================================
          SEKME 2: STOKLU ÜRÜNLERİMİZ (HEMEN TESLİM + SHOPIER ÖZEL LİNK SİSTEMİ)
      ========================================== */}
      {activeTab === 'instock' && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Stoklu Ürünler Üst Banner */}
          <div className="bg-gradient-to-r from-[#284B37] to-[#1E3528] text-white rounded-3xl p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-lg">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E9C46A] text-[#1E1E1C] text-xs font-bold uppercase tracking-wider mb-3">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>20 GÜN BEKLEMEDEN • HEMEN TESLİMAT</span>
              </div>
              <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold leading-tight">
                Stoklu Ürünlerimiz (Hemen Kargo)
              </h1>
              <p className="text-sm sm:text-base text-[#D8E8DD] mt-3 leading-relaxed">
                Bu sekmedeki parfümlerimiz 20 günlük dinlendirme (maserasyon) sürecini tamamlamış ve{' '}
                <strong>stoklarımızda gönderime hazır</strong> ürünlerdir. Siparişinizden sonra{' '}
                <strong>1-2 iş günü içinde hemen kargoya teslim edilir!</strong>
              </p>

              {/* Doğrudan Shopier Mağazası & Yönetim Butonları */}
              <div className="flex flex-wrap items-center gap-3 mt-5">
                <a
                  href={SHOPIER_LINKS.store}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#E9C46A] hover:bg-[#F4A261] text-[#1E1E1C] text-xs font-bold inline-flex items-center gap-2 shadow-sm transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shopier Mağazamızdaki Tüm Stoklu Ürünleri Gör</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setIsStockManagerOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/25 text-xs font-semibold inline-flex items-center gap-2 transition-colors"
                >
                  <Settings className="w-4 h-4 text-[#E9C46A]" />
                  <span>Stoklu Ürün & Shopier Link Yönetimi</span>
                </button>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-5 rounded-2xl border border-white/20 w-full lg:w-80 shrink-0 space-y-2.5">
              <div className="flex items-center gap-2 text-[#E9C46A] font-bold text-xs uppercase">
                <PackageCheck className="w-4 h-4" />
                <span>Hazır Stok & Shopier Entegrasyonu</span>
              </div>
              <p className="text-xs text-[#E8F3EB] leading-relaxed">
                Shopier mağazanıza eklediğiniz her stoklu ürünün kendi linkini{' '}
                <strong>&ldquo;Stoklu Ürün & Shopier Link Yönetimi&rdquo;</strong> panelinden veya koddan
                eşleştirebilirsiniz.
              </p>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E9C46A] hover:underline pt-1"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Güncel stok duyuruları: @frestin_perfumes</span>
              </a>
            </div>
          </div>

          {/* Cinsiyet Filtresi ve Hızlı Yönetim */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {['Tümü', 'Kadın', 'Erkek', 'Unisex'].map((g) => (
                <button
                  key={g}
                  onClick={() => setStockGenderFilter(g)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    stockGenderFilter === g
                      ? 'bg-[#4A7C59] text-white shadow-xs'
                      : 'bg-white text-[#5A5751] border border-[#E6E0D6] hover:border-[#4A7C59]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#4A7C59]">
                Toplam {stockedProducts.length} parfüm şu an hemen teslime hazır
              </span>
              <button
                onClick={() => setIsStockManagerOpen(true)}
                className="text-xs font-bold text-[#1E1E1C] bg-white border border-[#DED8CE] hover:border-[#4A7C59] px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs"
              >
                <LinkIcon className="w-3.5 h-3.5 text-[#4A7C59]" />
                <span>Shopier Linklerini Düzenle</span>
              </button>
            </div>
          </div>

          {/* Stoklu Ürünler Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stockedProducts.map((product) => {
              const selectedSize = getSelectedSize(product.id);
              const price = selectedSize === '100ml' ? PRICE_100ML : PRICE_50ML;
              const { isCustomProductLink } = resolveProductShopierUrl(product, selectedSize);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border-2 border-[#4A7C59]/40 hover:border-[#4A7C59] transition-all shadow-xs hover:shadow-lg flex flex-col overflow-hidden group"
                >
                  <div
                    onClick={() => setDetailModalProduct(product)}
                    className="relative bg-[#F3EFE6]/70 pt-6 pb-4 px-4 flex flex-col items-center cursor-pointer"
                  >
                    <span className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full bg-[#4A7C59] text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                      <Zap className="w-3 h-3 fill-current" />
                      <span>HEMEN TESLİM</span>
                    </span>
                    <span className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-white/90 border border-[#E6E0D6] text-[10px] font-semibold text-[#1E1E1C]">
                      Stok: {product.stockCount || 5} Adet
                    </span>

                    <div className="group-hover:scale-105 transition-transform duration-300">
                      <PerfumeBottleSVG
                        bottleColor={product.bottleColor}
                        liquidColor={product.liquidColor}
                        code={product.code}
                        name={product.name}
                      />
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#78756E] mb-1">
                        <span className="font-mono font-semibold text-[#B86B43]">
                          Ref: {product.fragranticaRef}
                        </span>
                        <span className="text-[11px] font-semibold text-[#1E1E1C]">
                          {product.gender}
                        </span>
                      </div>

                      <h3
                        onClick={() => setDetailModalProduct(product)}
                        className="font-serif-luxury text-xl font-bold text-[#1E1E1C] hover:text-[#4A7C59] cursor-pointer"
                      >
                        {product.name}
                      </h3>
                      <p className="text-xs text-[#78756E] mb-3">{product.subtitle}</p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {[...product.pyramid.top.slice(0, 1), ...product.pyramid.heart.slice(0, 1), ...product.pyramid.base.slice(0, 1)].map(
                          (note) => (
                            <span
                              key={note}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E6E0D6] text-[#5A5751]"
                            >
                              {note}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E6E0D6] space-y-2.5">
                      <div className="flex items-center justify-between text-[11px] text-[#2E5A3C] bg-[#E8F3EB] px-2.5 py-1 rounded-lg font-bold">
                        <span className="flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 shrink-0" />
                          <span>Hemen Kargo</span>
                        </span>
                        {isCustomProductLink && (
                          <span className="text-[9px] bg-[#4A7C59] text-white px-1.5 py-0.5 rounded">
                            Özel Link Aktif
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex bg-[#FAF7F2] p-0.5 rounded-lg border border-[#E6E0D6]">
                          {['50ml', '100ml'].map((sz) => (
                            <button
                              key={sz}
                              onClick={() => setProductSize(product.id, sz)}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                                selectedSize === sz
                                  ? 'bg-[#1E1E1C] text-white'
                                  : 'text-[#5A5751]'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                        <span className="text-lg font-bold text-[#1E1E1C]">{price} TL</span>
                      </div>

                      <div className="space-y-1.5">
                        <button
                          onClick={() => handleShopierBuy(product, selectedSize)}
                          className="w-full py-2.5 rounded-xl bg-[#4A7C59] hover:bg-[#3A6347] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Shopier&apos;den Hemen Al ({selectedSize})</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            onClick={() => setDetailModalProduct(product)}
                            className="py-2 rounded-xl border border-[#E6E0D6] hover:border-[#1E1E1C] text-[11px] font-semibold text-[#1E1E1C]"
                          >
                            Notalar
                          </button>
                          <button
                            onClick={() => addToCart(product, selectedSize)}
                            className="py-2 rounded-xl bg-[#1E1E1C] hover:bg-[#363632] text-white text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>Sepete Ekle</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* ==========================================
          SEKME 3: FRAGRANTICA ARŞİVİ & TÜM MAĞAZA VİTRİNİ
      ========================================== */}
      {activeTab === 'store' && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-[#1E1E1C] text-[#FAF7F2] rounded-3xl p-6 sm:p-10 mb-8 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-[0.25em] text-[#D99B72] font-semibold">
                SINIRSIZ FRAGRANTICA ARŞİVİ • 50 ML: {PRICE_50ML} TL | 100 ML: {PRICE_100ML} TL
              </span>
              <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold mt-2 leading-tight">
                Fragrantica&apos;daki Her Parfüm Listemizde Olabilir.
              </h1>
              <p className="text-sm text-[#CFC8BC] mt-3 leading-relaxed">
                Aşağıdaki koleksiyonumuzda en çok tercih edilen parfümleri inceleyebilir veya arama
                çubuğuna Fragrantica&apos;da gördüğünüz <strong>herhangi bir parfümün adını yazarak</strong> özel
                üretim siparişi verebilirsiniz. Stoklu ürünlerimiz hemen, özel üretim siparişlerimiz ise{' '}
                <strong className="text-[#E9C46A]">20 gün içinde kargoya teslim edilir.</strong>
              </p>
            </div>

            <div className="bg-[#2B2B28] p-5 rounded-2xl border border-[#3E3E3A] w-full lg:w-80 shrink-0 space-y-2.5">
              <div className="flex items-center gap-2 text-[#E9C46A] font-bold text-xs uppercase">
                <Truck className="w-4 h-4" />
                <span>Fiyat & Teslimat Bilgisi</span>
              </div>
              <div className="text-xs text-[#FAF7F2] font-semibold">
                • 50 ml Extrait Parfüm: {PRICE_50ML} TL
                <br />• 100 ml Extrait Parfüm: {PRICE_100ML} TL
              </div>
              <div className="text-[11px] text-[#A3C1A7] font-semibold pt-1">
                ✓ Stoklu Ürünler: Hemen Teslimat
                <br />✓ Özel Üretim: En geç {estimatedShipDate} kargoda
              </div>
            </div>
          </div>

          {/* Filtreler ve Arama */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {['Tümü', 'Kadın', 'Erkek', 'Unisex', 'Ferah', 'Odunsu', 'Oryantal', 'Çiçeksi', 'Meyveli'].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setStoreFilter(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      storeFilter === cat
                        ? 'bg-[#1E1E1C] text-white shadow-xs'
                        : 'bg-white text-[#5A5751] border border-[#E6E0D6] hover:border-[#1E1E1C]'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>

            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#78756E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={storeSearch}
                onChange={(e) => setStoreSearch(e.target.value)}
                placeholder="Fragrantica parfüm adı veya nota ara..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E6E0D6] rounded-full text-xs focus:outline-none focus:border-[#B86B43]"
              />
            </div>
          </div>

          {storeSearch.trim().length > 1 && filteredStoreProducts.length === 0 && (
            <div className="bg-white border-2 border-[#B86B43] rounded-3xl p-8 text-center max-w-2xl mx-auto my-8 space-y-4">
              <Sparkles className="w-10 h-10 text-[#B86B43] mx-auto" />
              <h3 className="font-serif-luxury text-3xl font-bold text-[#1E1E1C]">
                &ldquo;{storeSearch}&rdquo; Fragrantica Özel Üretim Siparişi
              </h3>
              <p className="text-sm text-[#5A5751] leading-relaxed">
                Fragrantica&apos;da yer alan her parfüm esans arşivimizde mevcuttur.{' '}
                <strong>{storeSearch}</strong> parfümünü sizin için özel olarak hazırlayıp 20 gün içinde
                kargoya verebiliriz.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    const customObj = {
                      id: `custom-${Date.now()}`,
                      code: 'Özel Üretim',
                      name: `FRESTIN Özel: ${storeSearch.trim()}`,
                      fragranticaRef: storeSearch.trim(),
                      price50: PRICE_50ML,
                      price100: PRICE_100ML,
                      inStock: false
                    };
                    handleShopierBuy(customObj, '50ml');
                  }}
                  className="px-5 py-3 rounded-xl bg-[#B86B43] hover:bg-[#9E5A36] text-white text-xs font-bold flex items-center gap-2"
                >
                  <span>50ml Satın Al ({PRICE_50ML} TL)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    const customObj = {
                      id: `custom-${Date.now()}`,
                      code: 'Özel Üretim',
                      name: `FRESTIN Özel: ${storeSearch.trim()}`,
                      fragranticaRef: storeSearch.trim(),
                      price50: PRICE_50ML,
                      price100: PRICE_100ML,
                      inStock: false
                    };
                    handleShopierBuy(customObj, '100ml');
                  }}
                  className="px-5 py-3 rounded-xl bg-[#5C6B5E] hover:bg-[#465348] text-white text-xs font-bold flex items-center gap-2"
                >
                  <span>100ml Satın Al ({PRICE_100ML} TL)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleAddCustomFragranticaPerfume(storeSearch, false)}
                  className="px-5 py-3 rounded-xl bg-[#1E1E1C] text-white text-xs font-bold"
                >
                  Katalog Listesine Ekle
                </button>
              </div>
            </div>
          )}

          {/* Ürün Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredStoreProducts.map((product) => {
              const selectedSize = getSelectedSize(product.id);
              const price = selectedSize === '100ml' ? PRICE_100ML : PRICE_50ML;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border border-[#E6E0D6] hover:border-[#B86B43]/60 transition-all shadow-xs hover:shadow-md flex flex-col overflow-hidden group"
                >
                  <div
                    onClick={() => setDetailModalProduct(product)}
                    className="relative bg-[#F3EFE6]/70 pt-6 pb-4 px-4 flex flex-col items-center cursor-pointer"
                  >
                    {product.inStock ? (
                      <span className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full bg-[#4A7C59] text-white text-[10px] font-bold flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5 fill-current" /> Hemen Teslim
                      </span>
                    ) : (
                      <span className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full bg-white/90 border border-[#E6E0D6] text-[10px] font-bold text-[#1E1E1C]">
                        {product.badge}
                      </span>
                    )}
                    <span className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-[#1E1E1C]/10 text-[10px] font-semibold text-[#1E1E1C]">
                      {product.gender}
                    </span>

                    <div className="group-hover:scale-105 transition-transform duration-300">
                      <PerfumeBottleSVG
                        bottleColor={product.bottleColor}
                        liquidColor={product.liquidColor}
                        code={product.code}
                        name={product.name}
                      />
                    </div>

                    <div className="w-full flex gap-1 mt-3 px-2">
                      {product.mainAccords.slice(0, 4).map((acc) => (
                        <div
                          key={acc.name}
                          className="h-1.5 rounded-full flex-1"
                          style={{ backgroundColor: acc.color }}
                          title={`${acc.name}: %${acc.percent}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#78756E] mb-1">
                        <span className="font-mono font-semibold text-[#B86B43]">
                          Ref: {product.fragranticaRef}
                        </span>
                        <span className="flex items-center gap-1 text-[#1E1E1C] font-semibold shrink-0">
                          <Star className="w-3.5 h-3.5 fill-[#E9C46A] text-[#E9C46A]" />
                          {product.rating}
                        </span>
                      </div>

                      <h3
                        onClick={() => setDetailModalProduct(product)}
                        className="font-serif-luxury text-xl font-bold text-[#1E1E1C] hover:text-[#B86B43] cursor-pointer"
                      >
                        {product.name}
                      </h3>
                      <p className="text-xs text-[#78756E] mb-3">{product.subtitle}</p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {[...product.pyramid.top.slice(0, 1), ...product.pyramid.heart.slice(0, 1), ...product.pyramid.base.slice(0, 1)].map(
                          (note) => (
                            <span
                              key={note}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E6E0D6] text-[#5A5751]"
                            >
                              {note}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E6E0D6] space-y-2.5">
                      {product.inStock ? (
                        <div className="flex items-center gap-1.5 text-[10px] text-[#2E5A3C] font-bold">
                          <Zap className="w-3 h-3 shrink-0 fill-current" />
                          <span>Stoklu Ürün • Hemen Teslimat</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-[10px] text-[#9E5A36] font-semibold">
                          <Clock className="w-3 h-3 shrink-0" />
                          <span>Özel Üretim • 20 gün içinde kargoda</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex bg-[#FAF7F2] p-0.5 rounded-lg border border-[#E6E0D6]">
                          {['50ml', '100ml'].map((sz) => (
                            <button
                              key={sz}
                              onClick={() => setProductSize(product.id, sz)}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                                selectedSize === sz
                                  ? 'bg-[#1E1E1C] text-white'
                                  : 'text-[#5A5751]'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                        <span className="text-lg font-bold text-[#1E1E1C]">{price} TL</span>
                      </div>

                      <div className="space-y-1.5">
                        <button
                          onClick={() => handleShopierBuy(product, selectedSize)}
                          className="w-full py-2.5 rounded-xl bg-[#B86B43] hover:bg-[#9E5A36] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Shopier ile Satın Al ({selectedSize})</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            onClick={() => setDetailModalProduct(product)}
                            className="py-2 rounded-xl border border-[#E6E0D6] hover:border-[#1E1E1C] text-[11px] font-semibold text-[#1E1E1C]"
                          >
                            Notalar
                          </button>
                          <button
                            onClick={() => addToCart(product, selectedSize)}
                            className="py-2 rounded-xl bg-[#1E1E1C] hover:bg-[#363632] text-white text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>Sepete Ekle</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* ==========================================
          SEKME 4: ÜRETİM & TESLİMAT SÜRECİ
      ========================================== */}
      {activeTab === 'process' && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-7 border-2 border-[#4A7C59]/40 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F3EB] text-[#2E5A3C] text-xs font-bold">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>1. SEÇENEK: STOKLU ÜRÜNLERİMİZ</span>
              </div>
              <h2 className="font-serif-luxury text-3xl font-bold text-[#1E1E1C]">
                Hemen Teslimat (1-2 İş Gününde Kargo)
              </h2>
              <p className="text-xs sm:text-sm text-[#5A5751] leading-relaxed">
                En çok tercih edilen imza kokularımız önceden hazırlanıp 20 günlük dinlendirme
                sürecini tamamlamış olarak stoklarımızda hazır tutulur. <strong>Stoklu Ürünlerimiz</strong> sekmesinden
                veya doğrudan Shopier mağazamızdan vereceğiniz siparişler beklemeden hemen kargoya teslim edilir.
              </p>
              <button
                onClick={() => setActiveTab('instock')}
                className="px-5 py-2.5 rounded-xl bg-[#4A7C59] text-white text-xs font-bold inline-flex items-center gap-2"
              >
                <span>Stoklu Ürünleri Gör</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white rounded-3xl p-7 border border-[#E6E0D6] space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0EA] text-[#9E5A36] text-xs font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>2. SEÇENEK: ÖZEL ÜRETİM FRAGRANTICA ARŞİVİ</span>
              </div>
              <h2 className="font-serif-luxury text-3xl font-bold text-[#1E1E1C]">
                Sipariş Üzerine Taze Hazırlık (20 Gün İçinde Kargo)
              </h2>
              <p className="text-xs sm:text-sm text-[#5A5751] leading-relaxed">
                Fragrantica&apos;da bulunan yüzlerce farklı niş ve tasarım parfüm, siparişiniz üzerine size
                özel olarak taze hazırlanır. Esans ve alkolün tam bütünleşmesi (maserasyon) için
                dinlendirilir ve <strong>siparişten sonra 20 gün içinde</strong> kargoya verilir.
              </p>
              <button
                onClick={() => setActiveTab('finder')}
                className="px-5 py-2.5 rounded-xl bg-[#1E1E1C] text-white text-xs font-bold inline-flex items-center gap-2"
              >
                <span>Parfümünü Bul ile Seç</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#E6E0D6]">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B86B43]">
              ÖZEL ÜRETİM SİPARİŞLERDE NEDEN 20 GÜN BEKLENİYOR?
            </span>
            <h3 className="font-serif-luxury text-3xl font-bold text-[#1E1E1C] mt-1">
              20 Günlük Taze Hazırlık ve Dinlendirme Takvimi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-6">
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E6E0D6]">
                <div className="text-xs font-bold text-[#B86B43] mb-1">1. GÜN</div>
                <h4 className="font-bold text-base mb-1.5">Özel Esans Karışımı</h4>
                <p className="text-xs text-[#5A5751] leading-relaxed">
                  Sipariş ettiğiniz parfümün üst, orta ve alt notaları %25-%28 Extrait de Parfum
                  yoğunluğunda birleştirilir.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E6E0D6]">
                <div className="text-xs font-bold text-[#5C6B5E] mb-1">2. - 14. GÜN</div>
                <h4 className="font-bold text-base mb-1.5">Soğuk Maserasyon (Dinlendirme)</h4>
                <p className="text-xs text-[#5A5751] leading-relaxed">
                  Notaların birbirine tam oturması ve alkol kokusunun tamamen kaybolması için karanlık
                  ortamda dinlendirilir.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E6E0D6]">
                <div className="text-xs font-bold text-[#7D5A3C] mb-1">15. - 18. GÜN</div>
                <h4 className="font-bold text-base mb-1.5">Filtrasyon & Kalite Kontrol</h4>
                <p className="text-xs text-[#5A5751] leading-relaxed">
                  Berraklık kontrolü yapılır, yayılım (sillage) testi tamamlanır ve özel Frestin
                  şişesine doldurulur.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-[#FAF0EA] border border-[#B86B43]">
                <div className="text-xs font-bold text-[#B86B43] mb-1">19. - 20. GÜN</div>
                <h4 className="font-bold text-base mb-1.5">Özenli Paketleme & Kargo</h4>
                <p className="text-xs text-[#5A5751] leading-relaxed">
                  Siparişiniz koruyucu kutusuyla birlikte kargoya teslim edilir.
                </p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ==========================================
          YENİ MODAL: STOKLU ÜRÜN & SHOPIER ÖZEL LİNK YÖNETİM PANELİ
      ========================================== */}
      {isStockManagerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF7F2] border border-[#E6E0D6] rounded-3xl max-w-4xl w-full p-6 sm:p-8 relative shadow-2xl my-8 max-h-[92vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setIsStockManagerOpen(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white border border-[#E6E0D6] flex items-center justify-center text-[#1E1E1C] hover:bg-[#1E1E1C] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4A7C59]/15 text-[#2E5A3C] text-xs font-bold mb-2">
                <Settings className="w-3.5 h-3.5" />
                <span>STOKLU ÜRÜN & SHOPIER LİNK EŞLEŞTİRME SİSTEMİ</span>
              </div>
              <h2 className="font-serif-luxury text-3xl font-bold text-[#1E1E1C]">
                Shopier&apos;e Eklediğiniz Stoklu Ürünleri Buradan Yönetin
              </h2>
              <p className="text-xs text-[#5A5751] mt-1 leading-relaxed">
                Shopier panelinizde stoklu bir ürün açtığınızda, Shopier&apos;in size verdiği ürün linkini (örn: <code>https://www.shopier.com/frestinperfumes/...</code>) ilgili parfümün karşısına yapıştırabilirsiniz. Özel link girdiğinizde müşteri doğrudan o ürünün Shopier sayfasına gider!
              </p>
            </div>

            {/* YENİ STOKLU ÜRÜN EKLEME FORMU */}
            <form
              onSubmit={handleCreateNewStockProduct}
              className="bg-white p-5 rounded-2xl border border-[#4A7C59]/40 space-y-3"
            >
              <div className="text-xs font-bold uppercase tracking-wider text-[#4A7C59] flex items-center gap-1.5">
                <Plus className="w-4 h-4" />
                <span>Shopier&apos;e Eklediğiniz Yeni Bir Stoklu Parfümü Vitrine Ekleyin</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newStockPerfumeForm.name}
                  onChange={(e) =>
                    setNewStockPerfumeForm({ ...newStockPerfumeForm, name: e.target.value })
                  }
                  placeholder="Parfüm Adı (örn: FRESTIN Kirke)"
                  className="px-3 py-2 bg-[#FAF7F2] border border-[#E6E0D6] rounded-xl text-xs"
                />
                <input
                  type="text"
                  value={newStockPerfumeForm.fragranticaRef}
                  onChange={(e) =>
                    setNewStockPerfumeForm({
                      ...newStockPerfumeForm,
                      fragranticaRef: e.target.value
                    })
                  }
                  placeholder="Fragrantica Ref (örn: Tiziana Terenzi Kirke)"
                  className="px-3 py-2 bg-[#FAF7F2] border border-[#E6E0D6] rounded-xl text-xs"
                />
                <div className="flex gap-2">
                  <select
                    value={newStockPerfumeForm.gender}
                    onChange={(e) =>
                      setNewStockPerfumeForm({ ...newStockPerfumeForm, gender: e.target.value })
                    }
                    className="flex-1 px-3 py-2 bg-[#FAF7F2] border border-[#E6E0D6] rounded-xl text-xs"
                  >
                    <option value="Unisex">Unisex</option>
                    <option value="Kadın">Kadın</option>
                    <option value="Erkek">Erkek</option>
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={newStockPerfumeForm.stockCount}
                    onChange={(e) =>
                      setNewStockPerfumeForm({
                        ...newStockPerfumeForm,
                        stockCount: e.target.value
                      })
                    }
                    placeholder="Stok"
                    className="w-20 px-3 py-2 bg-[#FAF7F2] border border-[#E6E0D6] rounded-xl text-xs"
                    title="Stok Adedi"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newStockPerfumeForm.shopierLink50}
                  onChange={(e) =>
                    setNewStockPerfumeForm({
                      ...newStockPerfumeForm,
                      shopierLink50: e.target.value
                    })
                  }
                  placeholder="50ml Özel Shopier Linki (Opsiyonel)"
                  className="px-3 py-2 bg-[#FAF7F2] border border-[#E6E0D6] rounded-xl text-xs font-mono"
                />
                <input
                  type="text"
                  value={newStockPerfumeForm.shopierLink100}
                  onChange={(e) =>
                    setNewStockPerfumeForm({
                      ...newStockPerfumeForm,
                      shopierLink100: e.target.value
                    })
                  }
                  placeholder="100ml Özel Shopier Linki (Opsiyonel)"
                  className="px-3 py-2 bg-[#FAF7F2] border border-[#E6E0D6] rounded-xl text-xs font-mono"
                />
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl bg-[#4A7C59] hover:bg-[#3A6347] text-white text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Stoklu Ürünlere Ekle</span>
                </button>
              </div>
            </form>

            {/* MEVCUT PARFÜMLERİN STOK VE SHOPIER LİNK LİSTESİ */}
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {catalog.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-3 ${
                    item.inStock
                      ? 'bg-white border-[#4A7C59]'
                      : 'bg-[#F3EFE6]/60 border-[#E6E0D6]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 lg:w-64">
                    <input
                      type="checkbox"
                      checked={Boolean(item.inStock)}
                      onChange={(e) =>
                        handleUpdateProductStockConfig(item.id, 'inStock', e.target.checked)
                      }
                      className="w-4 h-4 accent-[#4A7C59] rounded cursor-pointer"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-[#1E1E1C] truncate">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-[#78756E] truncate">
                        Ref: {item.fragranticaRef} •{' '}
                        <span className={item.inStock ? 'text-[#4A7C59] font-bold' : ''}>
                          {item.inStock ? 'Stokta (Hemen Teslim)' : 'Özel Üretim (20 Gün)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {item.inStock && (
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                      <div className="sm:col-span-2 flex items-center gap-1">
                        <span className="text-[10px] text-[#78756E]">Adet:</span>
                        <input
                          type="number"
                          min="1"
                          value={item.stockCount || 5}
                          onChange={(e) =>
                            handleUpdateProductStockConfig(
                              item.id,
                              'stockCount',
                              Number(e.target.value)
                            )
                          }
                          className="w-14 px-2 py-1.5 bg-[#FAF7F2] border border-[#E6E0D6] rounded-lg text-xs font-bold"
                        />
                      </div>
                      <div className="sm:col-span-5">
                        <input
                          type="text"
                          value={item.shopierLink50 || ''}
                          onChange={(e) =>
                            handleUpdateProductStockConfig(
                              item.id,
                              'shopierLink50',
                              e.target.value
                            )
                          }
                          placeholder="50ml Özel Shopier Ürün Linki..."
                          className="w-full px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E6E0D6] rounded-lg text-[11px] font-mono"
                        />
                      </div>
                      <div className="sm:col-span-5">
                        <input
                          type="text"
                          value={item.shopierLink100 || ''}
                          onChange={(e) =>
                            handleUpdateProductStockConfig(
                              item.id,
                              'shopierLink100',
                              e.target.value
                            )
                          }
                          placeholder="100ml Özel Shopier Ürün Linki..."
                          className="w-full px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E6E0D6] rounded-lg text-[11px] font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E6E0D6]">
              <button
                onClick={() => {
                  localStorage.removeItem(STOCK_CONFIG_STORAGE_KEY);
                  setCatalog(INITIAL_CATALOG);
                  showToast('Varsayılan stok ayarlarına dönüldü.');
                }}
                className="px-4 py-2.5 rounded-xl border border-[#DED8CE] text-xs font-semibold text-[#5A5751] hover:text-[#1E1E1C] flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Varsayılana Sıfırla</span>
              </button>

              <button
                onClick={() => {
                  setIsStockManagerOpen(false);
                  showToast('Stoklu ürünler ve Shopier linkleriniz kaydedildi!');
                }}
                className="px-6 py-2.5 rounded-xl bg-[#1E1E1C] text-white text-xs font-bold flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-[#E9C46A]" />
                <span>Kaydet ve Kapat</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          ÜRÜN DETAY MODALI (SHOPIER DOĞRUDAN ÖDEME ENTEGRELİ)
      ========================================== */}
      {detailModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF7F2] border border-[#E6E0D6] rounded-3xl max-w-3xl w-full p-6 sm:p-8 relative shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setDetailModalProduct(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white border border-[#E6E0D6] flex items-center justify-center text-[#1E1E1C] hover:bg-[#1E1E1C] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-5 bg-[#F3EFE6] rounded-2xl p-6 flex flex-col items-center">
                <PerfumeBottleSVG
                  bottleColor={detailModalProduct.bottleColor}
                  liquidColor={detailModalProduct.liquidColor}
                  code={detailModalProduct.code}
                  name={detailModalProduct.name}
                  size="lg"
                />
                <span className="mt-3 text-xs font-semibold text-[#5A5751]">
                  {detailModalProduct.concentration}
                </span>

                <div className="w-full mt-5 pt-4 border-t border-[#E6E0D6] space-y-2.5 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Kalıcılık (Longevity)</span>
                      <span className="text-[#B86B43]">%{detailModalProduct.longevity}</span>
                    </div>
                    <div className="h-2 bg-white rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#B86B43] rounded-full"
                        style={{ width: `${detailModalProduct.longevity}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Yayılım (Sillage)</span>
                      <span className="text-[#5C6B5E]">%{detailModalProduct.sillage}</span>
                    </div>
                    <div className="h-2 bg-white rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#5C6B5E] rounded-full"
                        style={{ width: `${detailModalProduct.sillage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-7 space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#B86B43]">
                    {detailModalProduct.code} • Fragrantica Ref: {detailModalProduct.fragranticaRef}
                  </span>
                  <h2 className="font-serif-luxury text-3xl font-bold text-[#1E1E1C]">
                    {detailModalProduct.name}
                  </h2>
                  <p className="text-xs text-[#5A5751] mt-1 leading-relaxed">
                    {detailModalProduct.shortDesc}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#E6E0D6]">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#5A5751] mb-2">
                    Ana Akorlar (Main Accords)
                  </div>
                  <div className="space-y-1.5">
                    {detailModalProduct.mainAccords.map((acc) => (
                      <div key={acc.name} className="flex items-center gap-2">
                        <span className="w-28 text-xs font-medium truncate">{acc.name}</span>
                        <div className="flex-1 h-3.5 bg-[#FAF7F2] rounded-r-full overflow-hidden">
                          <div
                            className="h-full rounded-r-full"
                            style={{ width: `${acc.percent}%`, backgroundColor: acc.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#E6E0D6] space-y-1.5 text-xs">
                  <div className="font-bold uppercase tracking-wider text-[#5A5751] mb-1">
                    Koku Piramidi
                  </div>
                  <div>
                    <strong className="text-[#B86B43]">Üst Notalar: </strong>
                    {detailModalProduct.pyramid.top.join(', ')}
                  </div>
                  <div>
                    <strong className="text-[#5C6B5E]">Orta (Kalp) Notalar: </strong>
                    {detailModalProduct.pyramid.heart.join(', ')}
                  </div>
                  <div>
                    <strong className="text-[#1E1E1C]">Alt (Baz) Notalar: </strong>
                    {detailModalProduct.pyramid.base.join(', ')}
                  </div>
                </div>

                {detailModalProduct.inStock ? (
                  <div className="p-3 rounded-xl bg-[#E8F3EB] border border-[#4A7C59]/40 text-xs text-[#2E5A3C] flex items-center gap-2 font-bold">
                    <Zap className="w-4 h-4 shrink-0 fill-current" />
                    <span>
                      Stoklu Ürün: Hazır stoklarımızdan 1-2 iş günü içinde hemen kargoya verilir!
                    </span>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-[#FAF0EA] border border-[#B86B43]/40 text-xs text-[#9E5A36] flex items-center gap-2 font-medium">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>
                      Sipariş üzerine taze hazırlandığı için siparişten sonra <strong>20 gün içinde</strong> kargoya verilir.
                    </span>
                  </div>
                )}

                <div className="pt-1 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex bg-white p-1 rounded-xl border border-[#E6E0D6]">
                      {['50ml', '100ml'].map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setProductSize(detailModalProduct.id, sz)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            getSelectedSize(detailModalProduct.id) === sz
                              ? 'bg-[#1E1E1C] text-white'
                              : 'text-[#5A5751]'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#1E1E1C]">
                        {getSelectedSize(detailModalProduct.id) === '100ml'
                          ? PRICE_100ML
                          : PRICE_50ML}{' '}
                        TL
                      </div>
                      <div className="text-[11px] text-[#78756E]">KDV Dahil</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        addToCart(detailModalProduct, getSelectedSize(detailModalProduct.id));
                        setDetailModalProduct(null);
                        setIsCartOpen(true);
                      }}
                      className="px-4 py-3 rounded-xl border border-[#1E1E1C] text-[#1E1E1C] hover:bg-[#F3EFE6] text-xs font-bold flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Sepete Ekle</span>
                    </button>
                    <button
                      onClick={() => {
                        const sz = getSelectedSize(detailModalProduct.id);
                        setDetailModalProduct(null);
                        handleShopierBuy(detailModalProduct, sz);
                      }}
                      className="px-5 py-3 rounded-xl bg-[#B86B43] hover:bg-[#9E5A36] text-white text-xs font-bold flex items-center gap-2 shadow-md"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Shopier ile Satın Al ({getSelectedSize(detailModalProduct.id)})</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          SLIDE-OVER ALIŞVERİŞ SEPETİ
      ========================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="bg-[#FAF7F2] w-full max-w-md h-full flex flex-col justify-between shadow-2xl border-l border-[#E6E0D6]">
            <div className="p-6 bg-white border-b border-[#E6E0D6] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#B86B43]" />
                <h2 className="font-serif-luxury text-2xl font-bold">Alışveriş Sepetiniz</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#F3EFE6] font-bold">
                  {cartCount} Ürün
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full hover:bg-[#F3EFE6]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-3 bg-[#FAF0EA] border-b border-[#E6E0D6] text-xs text-[#9E5A36] flex items-start gap-2.5">
              <Clock className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>Teslimat Bilgisi:</strong> Stoklu ürünler 1-2 iş gününde, özel üretim siparişler ise en geç <strong>20 gün içinde ({estimatedShipDate})</strong> kargoya verilir.
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <ShoppingBag className="w-12 h-12 text-[#CFC8BC] mx-auto" />
                  <div className="font-serif-luxury text-2xl font-bold">Sepetiniz Henüz Boş</div>
                  <p className="text-xs text-[#78756E]">
                    Size en uygun 3 parfümü görmek için Parfümünü Bul sekmesini kullanabilirsiniz.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="bg-white p-4 rounded-2xl border border-[#E6E0D6] flex items-center gap-4"
                  >
                    <div className="bg-[#F3EFE6] rounded-xl p-1.5 shrink-0">
                      <PerfumeBottleSVG
                        bottleColor={item.product.bottleColor}
                        liquidColor={item.product.liquidColor}
                        code={item.product.code}
                        name={item.product.name}
                        size="sm"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-[#1E1E1C] truncate">
                        {item.product.name}
                      </h4>
                      <div className="text-xs text-[#78756E]">
                        {item.size} • Ref: {item.product.fragranticaRef}
                      </div>
                      <div className="text-[10px] text-[#4A7C59] font-semibold mt-0.5">
                        {item.product.inStock ? '⚡ Stoklu: Hemen Teslim' : '✓ 20 gün içinde kargoda'}
                      </div>
                      <div className="text-sm font-bold text-[#B86B43] mt-1">
                        {item.price * item.qty} TL
                      </div>
                      <button
                        onClick={() => {
                          setIsCartOpen(false);
                          handleShopierBuy(item.product, item.size);
                        }}
                        className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-[#1E1E1C] hover:text-[#B86B43] underline"
                      >
                        <span>Shopier ({item.size}) ile Hemen Al</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 bg-[#FAF7F2] px-2 py-1 rounded-xl border border-[#E6E0D6]">
                      <button
                        onClick={() => updateCartQty(item.product.id, item.size, -1)}
                        className="p-1 hover:text-[#B86B43]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                      <button
                        onClick={() => updateCartQty(item.product.id, item.size, 1)}
                        className="p-1 hover:text-[#B86B43]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-[#E6E0D6] space-y-3">
                <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E6E0D6] text-xs space-y-2">
                  <div className="font-bold text-[#1E1E1C] flex items-center justify-between">
                    <span>Shopier Hızlı Ödeme Bağlantıları:</span>
                    <span className="text-[10px] text-[#5C6B5E]">3D Secure Aktif</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <a
                      href={SHOPIER_LINKS['50ml']}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        const summary = cart
                          .map((c) => `${c.product.name} (${c.product.fragranticaRef}) - ${c.size} x${c.qty}`)
                          .join(' | ');
                        copyTextToClipboard(`FRESTIN Siparişi: ${summary}`);
                        showToast('Sepet özetiniz kopyalandı! Shopier Sipariş Notuna yapıştırabilirsiniz.');
                      }}
                      className="py-2.5 px-3 rounded-xl bg-[#B86B43] hover:bg-[#9E5A36] text-white font-bold text-xs flex items-center justify-center gap-1.5 text-center"
                    >
                      <span>50ml ({PRICE_50ML} TL)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={SHOPIER_LINKS['100ml']}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        const summary = cart
                          .map((c) => `${c.product.name} (${c.product.fragranticaRef}) - ${c.size} x${c.qty}`)
                          .join(' | ');
                        copyTextToClipboard(`FRESTIN Siparişi: ${summary}`);
                        showToast('Sepet özetiniz kopyalandı! Shopier Sipariş Notuna yapıştırabilirsiniz.');
                      }}
                      className="py-2.5 px-3 rounded-xl bg-[#1E1E1C] hover:bg-[#333330] text-white font-bold text-xs flex items-center justify-center gap-1.5 text-center"
                    >
                      <span>100ml ({PRICE_100ML} TL)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          SHOPIER GÜVENLİ SATIN ALMA & OTOMATİK SİPARİŞ NOTU MODALI
      ========================================== */}
      {shopierRedirectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E6E0D6] shadow-2xl relative space-y-5">
            <button
              onClick={() => setShopierRedirectModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#F3EFE6]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 text-xs font-bold text-[#5C6B5E] uppercase tracking-wider">
              <CheckCircle2 className="w-5 h-5 text-[#5C6B5E]" />
              <span>
                {shopierRedirectModal.isCustomProductLink
                  ? 'Stoklu Ürünün Özel Shopier Sayfası Hazır!'
                  : 'Parfüm Seçiminiz Otomatik Kopyalandı!'}
              </span>
            </div>

            <div>
              <h3 className="font-serif-luxury text-3xl font-bold text-[#1E1E1C]">
                Shopier Güvenli Ödeme ({shopierRedirectModal.price} TL)
              </h3>
              <p className="text-xs text-[#5A5751] mt-1 leading-relaxed">
                {shopierRedirectModal.isCustomProductLink ? (
                  <>
                    Bu stoklu ürün için doğrudan özel Shopier ürün sayfasına yönlendiriliyorsunuz.
                    Ayrıca sipariş detayınız da yedek olarak panonuza kopyalandı.
                  </>
                ) : (
                  <>
                    Seçtiğiniz parfüm adı (
                    <strong>
                      {shopierRedirectModal.product.name} - {shopierRedirectModal.size}
                    </strong>
                    ) panonuza otomatik kopyalandı. Açılan Shopier ödeme sayfasındaki{' '}
                    <strong className="text-[#B86B43]">&ldquo;Sipariş Notu&rdquo;</strong> kısmına
                    yapıştırarak ödemenizi tamamlayabilirsiniz.
                  </>
                )}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6E0D6] space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#78756E] font-semibold">
                <span>Kopyalanan Sipariş Notunuz:</span>
                <button
                  onClick={() => {
                    copyTextToClipboard(shopierRedirectModal.orderNote);
                    showToast('Sipariş notu tekrar kopyalandı!');
                  }}
                  className="inline-flex items-center gap-1 text-[#B86B43] hover:underline font-bold"
                >
                  <Copy className="w-3 h-3" />
                  <span>Tekrar Kopyala</span>
                </button>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-[#DED8CE] text-xs font-mono text-[#1E1E1C] select-all">
                {shopierRedirectModal.orderNote}
              </div>
            </div>

            {shopierRedirectModal.product.inStock ? (
              <div className="p-3 rounded-xl bg-[#E8F3EB] border border-[#4A7C59]/40 text-xs text-[#2E5A3C] flex items-center gap-2.5 font-semibold">
                <Zap className="w-4 h-4 shrink-0 fill-current" />
                <span>
                  Stoklu Ürün: Siparişiniz 1-2 iş günü içinde hemen kargoya teslim edilecektir!
                </span>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-[#FAF0EA] border border-[#B86B43]/40 text-xs text-[#9E5A36] flex items-center gap-2.5">
                <Clock className="w-4 h-4 shrink-0" />
                <span>
                  Özel Üretim: Siparişiniz size özel taze üretilip dinlendirilecek ve{' '}
                  <strong>20 gün içinde (en geç {estimatedShipDate})</strong> kargoya verilecektir.
                </span>
              </div>
            )}

            <div className="space-y-2">
              <a
                href={shopierRedirectModal.shopierUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShopierRedirectModal(null)}
                className="w-full py-4 rounded-2xl bg-[#B86B43] hover:bg-[#9E5A36] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <CreditCard className="w-4 h-4" />
                <span>
                  Shopier {shopierRedirectModal.size} ({shopierRedirectModal.price} TL) Ödeme Sayfasına Git
                </span>
                <ExternalLink className="w-4 h-4" />
              </a>

              {shopierRedirectModal.product.inStock && (
                <a
                  href={SHOPIER_LINKS.store}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShopierRedirectModal(null)}
                  className="w-full py-2.5 rounded-xl border border-[#DED8CE] hover:border-[#4A7C59] text-[#4A7C59] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Shopier Mağaza Vitrinindeki Tüm Stoklu Ürünlere Git</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          SİTEYİ GITHUB + VERCEL İLE YAYINA ALMA REHBERİ MODALI
      ========================================== */}
      {isDeployGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-[#E6E0D6] shadow-2xl relative space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsDeployGuideOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#F3EFE6]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5C6B5E]/15 text-[#5C6B5E] text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>SHOPIER VE INSTAGRAM BAĞLANTILARINIZ AKTİF</span>
            </div>

            <h3 className="font-serif-luxury text-3xl font-bold text-[#1E1E1C]">
              Sitenizi Kendi Alan Adınızla (Domain) Yayına Alma Adımları
            </h3>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6E0D6] text-xs space-y-1.5">
              <div className="font-bold text-[#1E1E1C] mb-1">Entegre Edilen Resmi Bağlantılarınız:</div>
              <div className="flex items-center justify-between">
                <span className="text-[#5A5751]">50 ml ({PRICE_50ML} TL) Shopier Linki:</span>
                <a href={SHOPIER_LINKS['50ml']} target="_blank" rel="noopener noreferrer" className="font-mono text-[#B86B43] underline">
                  {SHOPIER_LINKS['50ml']}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5A5751]">100 ml ({PRICE_100ML} TL) Shopier Linki:</span>
                <a href={SHOPIER_LINKS['100ml']} target="_blank" rel="noopener noreferrer" className="font-mono text-[#B86B43] underline">
                  {SHOPIER_LINKS['100ml']}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5A5751]">Instagram Sayfanız:</span>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="font-mono text-[#C13584] underline">
                  @frestin_perfumes
                </a>
              </div>
            </div>

            <div className="space-y-3 text-xs text-[#45433E] leading-relaxed">
              <div className="p-3.5 rounded-2xl border border-[#E6E0D6]">
                <strong className="text-[#1E1E1C] block mb-1">1. Adım: GitHub Üzerinde Proje Açın</strong>
                GitHub.com hesabınıza girin, sağ üstteki <strong>+</strong> butonundan <strong>New Repository</strong> deyin. İsmine <code>frestin-web</code> yazıp <strong>Create repository</strong> butonuna tıklayın.
              </div>
              <div className="p-3.5 rounded-2xl border border-[#E6E0D6]">
                <strong className="text-[#1E1E1C] block mb-1">2. Adım: Vercel.com ile Yayına Alın</strong>
                Vercel.com hesabınıza girin, <strong>Add New Project</strong> butonuna tıklayın ve GitHub&apos;daki <code>frestin-web</code> projenizi seçip <strong>Deploy</strong> butonuna basın. 1 dakika içinde siteniz yayına girecek!
              </div>
              <div className="p-3.5 rounded-2xl border border-[#E6E0D6]">
                <strong className="text-[#1E1E1C] block mb-1">3. Adım: Domain (Alan Adı) Bağlantısı</strong>
                Vercel&apos;de projenizin içindeki <strong>Settings &rarr; Domains</strong> menüsüne aldığınız alan adını yazıp ekleyin. Vercel&apos;in size vereceği DNS / Nameserver adreslerini (`ns1.vercel-dns.com` ve `ns2.vercel-dns.com`) domaini aldığınız firmanın panelindeki <strong>Nameserver (Alan Adı Sunucuları)</strong> kısmına kaydedin.
              </div>
            </div>

            <button
              onClick={() => setIsDeployGuideOpen(false)}
              className="w-full py-3.5 rounded-xl bg-[#1E1E1C] text-white text-xs font-bold"
            >
              Anladım, Siteyi Test Etmeye Devam Et
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-[#F3EFE6] border-t border-[#E6E0D6] mt-16 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78756E]">
          <div>
            <span className="font-serif-luxury text-lg font-bold text-[#1E1E1C] mr-2">FRESTIN PERFUMES</span>
            © {new Date().getFullYear()} Frestin Perfumes • Stoklu ürünlerde hemen teslim, özel üretimlerde 20 gün içinde kargo.
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C13584] hover:underline font-bold flex items-center gap-1"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>@frestin_perfumes</span>
            </a>
            <a
              href={SHOPIER_LINKS.store}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4A7C59] hover:underline font-bold flex items-center gap-1"
            >
              <span>Shopier Mağazamız</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={SHOPIER_LINKS['50ml']}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#B86B43] hover:underline font-semibold flex items-center gap-1"
            >
              <span>50ml ({PRICE_50ML} TL)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={SHOPIER_LINKS['100ml']}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#B86B43] hover:underline font-semibold flex items-center gap-1"
            >
              <span>100ml ({PRICE_100ML} TL)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
