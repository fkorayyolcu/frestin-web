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
    id: 'frestin-101', code: 'F-01', name: 'Sauvage Elixir', subtitle: 'Baharatlı & Odunsu • Extrait', fragranticaRef: 'Dior Sauvage Elixir', gender: 'Erkek', season: 'Kış / Sonbahar', time: 'Gece', sillage: 'Çok Yüksek',
    bottleColor: '#1E293B', liquidColor: '#93C5FD', rating: 4.9, reviewsCount: 184,
    notes: [{ name: 'Tarçın', percent: 95 }, { name: 'Lavanta', percent: 92 }, { name: 'Meyan Kökü', percent: 88 }, { name: 'Sandal Ağacı', percent: 85 }, { name: 'Kakule', percent: 84 }, { name: 'Greyfurt', percent: 80 }]
  },
  {
    id: 'frestin-102', code: 'F-02', name: 'Aventus', subtitle: 'Meyveli & Dumanlı Şipre • Extrait', fragranticaRef: 'Creed Aventus', gender: 'Erkek', season: 'Dört Mevsim', time: 'Gündüz / Ofis', sillage: 'Yüksek',
    bottleColor: '#111827', liquidColor: '#FEF08A', rating: 5.0, reviewsCount: 310,
    notes: [{ name: 'Ananas', percent: 98 }, { name: 'Huş Ağacı', percent: 94 }, { name: 'Bergamot', percent: 92 }, { name: 'Meşe Yosunu', percent: 89 }, { name: 'Misk', percent: 86 }, { name: 'Siyah Frenk Üzümü', percent: 85 }]
  },
  {
    id: 'frestin-103', code: 'F-03', name: 'Bleu de Chanel', subtitle: 'Aromatik & Narenciye • Extrait', fragranticaRef: 'Chanel Bleu de Chanel Parfum', gender: 'Erkek', season: 'Dört Mevsim', time: 'Gündüz / Gece', sillage: 'Yüksek',
    bottleColor: '#0F172A', liquidColor: '#BAE6FD', rating: 4.9, reviewsCount: 165,
    notes: [{ name: 'Limon Kabuğu', percent: 94 }, { name: 'Tütsü', percent: 90 }, { name: 'Sedir Ağacı', percent: 89 }, { name: 'Nane', percent: 85 }, { name: 'Sandal Ağacı', percent: 88 }, { name: 'Greyfurt', percent: 87 }]
  },
  {
    id: 'frestin-104', code: 'F-04', name: 'Althaïr', subtitle: 'Gurme Vanilya & Kakule • Extrait', fragranticaRef: 'Parfums de Marly Althaïr', gender: 'Unisex', season: 'Kış / Sonbahar', time: 'Gece', sillage: 'Çok Yüksek',
    bottleColor: '#7C2D12', liquidColor: '#FDE68A', rating: 5.0, reviewsCount: 142,
    notes: [{ name: 'Bourbon Vanilya', percent: 98 }, { name: 'Portakal Çiçeği', percent: 91 }, { name: 'Tarçın', percent: 90 }, { name: 'Kakule', percent: 89 }, { name: 'Pralin', percent: 87 }, { name: 'Misk', percent: 84 }]
  },
  {
    id: 'frestin-105', code: 'F-05', name: 'Acqua Di Gio Profondo', subtitle: 'Derin Okyanus & Mineral • Extrait', fragranticaRef: 'Giorgio Armani Acqua Di Gio Profondo', gender: 'Erkek', season: 'Yaz / İlkbahar', time: 'Gündüz', sillage: 'Orta - Yüksek',
    bottleColor: '#1E3A8A', liquidColor: '#BFDBFE', rating: 4.9, reviewsCount: 138,
    notes: [{ name: 'Deniz Notaları', percent: 97 }, { name: 'Bergamot', percent: 92 }, { name: 'Yeşil Mandalina', percent: 90 }, { name: 'Biberiye', percent: 85 }, { name: 'Paçuli', percent: 82 }, { name: 'Misk', percent: 80 }]
  },
  {
    id: 'frestin-106', code: 'F-06', name: 'L\'Eau Par', subtitle: 'Akuatik Nilüfer & Nane • Extrait', fragranticaRef: 'Kenzo L\'Eau Par', gender: 'Unisex', season: 'Yaz / İlkbahar', time: 'Gündüz', sillage: 'Orta - Yüksek',
    bottleColor: '#B87A1E', liquidColor: '#E0F2FE', rating: 4.8, reviewsCount: 94,
    notes: [{ name: 'Su Notaları', percent: 96 }, { name: 'Nane', percent: 92 }, { name: 'Nilüfer', percent: 90 }, { name: 'Yeşil Leylak', percent: 86 }, { name: 'Beyaz Şeftali', percent: 84 }, { name: 'Sedir Ağacı', percent: 82 }]
  },
  {
    id: 'frestin-107', code: 'F-07', name: 'Alien', subtitle: 'Gizemli Yasemin & Amber • Extrait', fragranticaRef: 'Mugler Alien', gender: 'Kadın', season: 'Kış / Sonbahar', time: 'Gece', sillage: 'Çok Yüksek',
    bottleColor: '#4C1D95', liquidColor: '#DDD6FE', rating: 4.9, reviewsCount: 176,
    notes: [{ name: 'Hint Yasemini', percent: 98 }, { name: 'Kaşmir Ağacı', percent: 93 }, { name: 'Beyaz Amber', percent: 92 }, { name: 'Odunsu Notalar', percent: 88 }]
  },
  {
    id: 'frestin-108', code: 'F-08', name: 'Libre Intense', subtitle: 'Lavanta & Madagaskar Vanilyası • Extrait', fragranticaRef: 'Yves Saint Laurent Libre Intense', gender: 'Kadın', season: 'Kış / Sonbahar', time: 'Gece / Özel Gün', sillage: 'Çok Yüksek',
    bottleColor: '#78350F', liquidColor: '#FDE047', rating: 4.9, reviewsCount: 204,
    notes: [{ name: 'Lavanta', percent: 96 }, { name: 'Portakal Çiçeği', percent: 94 }, { name: 'Vanilya', percent: 93 }, { name: 'Tonka Fasulyesi', percent: 89 }, { name: 'Orkide', percent: 86 }, { name: 'Bergamot', percent: 84 }]
  },
  {
    id: 'frestin-109', code: 'F-09', name: 'Good Girl', subtitle: 'Kakao, Kahve & Sümbülteber • Extrait', fragranticaRef: 'Carolina Herrera Good Girl', gender: 'Kadın', season: 'Kış / Sonbahar', time: 'Gece', sillage: 'Yüksek',
    bottleColor: '#1E1B4B', liquidColor: '#FBCFE8', rating: 4.8, reviewsCount: 189,
    notes: [{ name: 'Tonka Fasulyesi', percent: 95 }, { name: 'Kakao', percent: 92 }, { name: 'Sümbülteber', percent: 90 }, { name: 'Kahve', percent: 89 }, { name: 'Badem', percent: 88 }, { name: 'Yasemin', percent: 86 }]
  },
  {
    id: 'frestin-110', code: 'F-10', name: 'Lost Cherry', subtitle: 'Likörlü Vişne & Acı Badem • Extrait', fragranticaRef: 'Tom Ford Lost Cherry', gender: 'Unisex', season: 'Kış / Sonbahar', time: 'Gece', sillage: 'Yüksek',
    bottleColor: '#7F1D1D', liquidColor: '#FECDD3', rating: 4.9, reviewsCount: 158,
    notes: [{ name: 'Vişne / Kiraz', percent: 98 }, { name: 'Acı Badem', percent: 95 }, { name: 'Likör', percent: 92 }, { name: 'Tonka Fasulyesi', percent: 88 }, { name: 'Peru Balsamı', percent: 85 }, { name: 'Tarçın', percent: 83 }]
  },
  {
    id: 'frestin-111', code: 'F-11', name: 'Tobacco Vanille', subtitle: 'Zengin Tütün Yaprağı & Vanilya • Extrait', fragranticaRef: 'Tom Ford Tobacco Vanille', gender: 'Unisex', season: 'Kış', time: 'Gece', sillage: 'Çok Yüksek',
    bottleColor: '#451A03', liquidColor: '#F59E0B', rating: 5.0, reviewsCount: 220,
    notes: [{ name: 'Tütün Yaprağı', percent: 98 }, { name: 'Vanilya', percent: 96 }, { name: 'Kurutulmuş Meyveler', percent: 90 }, { name: 'Kakao', percent: 88 }, { name: 'Tonka Fasulyesi', percent: 87 }, { name: 'Baharatlar', percent: 85 }]
  },
  {
    id: 'frestin-112', code: 'F-12', name: 'Black Orchid', subtitle: 'Karanlık & Lüks Çiçeksi • Extrait', fragranticaRef: 'Tom Ford Black Orchid', gender: 'Unisex', season: 'Kış / Sonbahar', time: 'Gece', sillage: 'Çok Yüksek',
    bottleColor: '#111827', liquidColor: '#701A75', rating: 4.8, reviewsCount: 151,
    notes: [{ name: 'Trüf Mantarı', percent: 95 }, { name: 'Siyah Orkide', percent: 94 }, { name: 'Çikolata', percent: 90 }, { name: 'Paçuli', percent: 89 }, { name: 'Tütsü', percent: 86 }, { name: 'Ylang-Ylang', percent: 84 }]
  },
  {
    id: 'frestin-113', code: 'F-13', name: 'Baccarat Rouge 540', subtitle: 'Kristal Safran & Ambergris • Extrait', fragranticaRef: 'Maison Francis Kurkdjian Baccarat Rouge 540', gender: 'Unisex', season: 'Dört Mevsim', time: 'Gündüz / Gece', sillage: 'Çok Yüksek',
    bottleColor: '#991B1B', liquidColor: '#FEE2E2', rating: 5.0, reviewsCount: 340,
    notes: [{ name: 'Safran', percent: 98 }, { name: 'Acı Badem', percent: 94 }, { name: 'Yasemin', percent: 92 }, { name: 'Ambergris', percent: 95 }, { name: 'Sedir Ağacı', percent: 90 }, { name: 'Misk', percent: 88 }]
  },
  {
    id: 'frestin-114', code: 'F-14', name: 'Kirke', subtitle: 'Egzotik Meyve Fırtınası • Extrait', fragranticaRef: 'Tiziana Terenzi Kirke', gender: 'Unisex', season: 'Yaz / Dört Mevsim', time: 'Gündüz / Gece', sillage: 'Çok Yüksek',
    bottleColor: '#B45309', liquidColor: '#FEF08A', rating: 4.9, reviewsCount: 215,
    notes: [{ name: 'Çarkıfelek Meyvesi', percent: 98 }, { name: 'Şeftali', percent: 95 }, { name: 'Armut', percent: 93 }, { name: 'Ahududu', percent: 91 }, { name: 'Misk', percent: 94 }, { name: 'Vanilya', percent: 87 }]
  },
  {
    id: 'frestin-115', code: 'F-15', name: 'Delina Exclusif', subtitle: 'Türk Gülü, Litchi & Tütsü • Extrait', fragranticaRef: 'Parfums de Marly Delina', gender: 'Kadın', season: 'İlkbahar / Dört Mevsim', time: 'Gündüz / Gece', sillage: 'Çok Yüksek',
    bottleColor: '#BE185D', liquidColor: '#FBCFE8', rating: 4.9, reviewsCount: 192,
    notes: [{ name: 'Türk Gülü', percent: 98 }, { name: 'Litchi', percent: 95 }, { name: 'Ravent (Rhubarb)', percent: 92 }, { name: 'Şakayık', percent: 90 }, { name: 'Vanilya', percent: 89 }, { name: 'Beyaz Misk', percent: 88 }]
  },
  {
    id: 'frestin-116', code: 'F-16', name: 'Erba Pura', subtitle: 'Akdeniz Narenciyesi & Beyaz Misk • Extrait', fragranticaRef: 'Xerjoff Erba Pura', gender: 'Unisex', season: 'Yaz / İlkbahar', time: 'Gündüz / Gece', sillage: 'Çok Yüksek',
    bottleColor: '#0284C7', liquidColor: '#BAE6FD', rating: 4.9, reviewsCount: 178,
    notes: [{ name: 'Sicilya Portakalı', percent: 96 }, { name: 'Kalabriya Bergamotu', percent: 94 }, { name: 'Tropikal Meyveler', percent: 95 }, { name: 'Beyaz Misk', percent: 92 }, { name: 'Amber', percent: 90 }, { name: 'Madagaskar Vanilyası', percent: 89 }]
  },
  {
    id: 'frestin-117', code: 'F-17', name: 'Naxos', subtitle: 'Sicilya Balı, Tütün & Lavanta • Extrait', fragranticaRef: 'Xerjoff XJ 1861 Naxos', gender: 'Unisex', season: 'Kış / Sonbahar', time: 'Gece', sillage: 'Çok Yüksek',
    bottleColor: '#92400E', liquidColor: '#FDE047', rating: 5.0, reviewsCount: 245,
    notes: [{ name: 'Bal', percent: 98 }, { name: 'Tütün Yaprağı', percent: 96 }, { name: 'Lavanta', percent: 93 }, { name: 'Tarçın', percent: 91 }, { name: 'Vanilya', percent: 90 }, { name: 'Bergamot', percent: 88 }]
  },
  {
    id: 'frestin-118', code: 'F-18', name: 'Layton', subtitle: 'Karizmatik Elma, Kakule & Vanilya • Extrait', fragranticaRef: 'Parfums de Marly Layton', gender: 'Erkek', season: 'Kış / Sonbahar / İlkbahar', time: 'Gece / Özel Gün', sillage: 'Yüksek',
    bottleColor: '#1E3A8A', liquidColor: '#93C5FD', rating: 4.9, reviewsCount: 225,
    notes: [{ name: 'Elma', percent: 96 }, { name: 'Vanilya', percent: 94 }, { name: 'Kakule', percent: 93 }, { name: 'Lavanta', percent: 90 }, { name: 'Karabiber', percent: 87 }, { name: 'Guaiac Ağacı', percent: 86 }]
  },
  {
    id: 'frestin-119', code: 'F-19', name: 'Ganymede', subtitle: 'Mineral Süet, Safran & Mandarin • Extrait', fragranticaRef: 'Marc-Antoine Barrois Ganymede', gender: 'Unisex', season: 'Dört Mevsim', time: 'Gündüz / Gece', sillage: 'Çok Yüksek',
    bottleColor: '#854D0E', liquidColor: '#FEF9C3', rating: 4.9, reviewsCount: 164,
    notes: [{ name: 'Mineral Notalar', percent: 98 }, { name: 'Süet / Deri', percent: 95 }, { name: 'Safran', percent: 94 }, { name: 'Akigalawood', percent: 92 }, { name: 'İtalyan Mandalinası', percent: 89 }, { name: 'Menekşe Yaprağı', percent: 87 }]
  },
  {
    id: 'frestin-120', code: 'F-20', name: 'Angels\' Share', subtitle: 'Meşe Fıçıda Konyak, Tarçın & Pralin • Extrait', fragranticaRef: 'Kilian Angels\' Share', gender: 'Unisex', season: 'Kış / Sonbahar', time: 'Gece', sillage: 'Çok Yüksek',
    bottleColor: '#78350F', liquidColor: '#F59E0B', rating: 5.0, reviewsCount: 277,
    notes: [{ name: 'Konyak', percent: 98 }, { name: 'Tarçın', percent: 96 }, { name: 'Tonka Fasulyesi', percent: 94 }, { name: 'Pralin', percent: 92 }, { name: 'Meşe', percent: 90 }, { name: 'Vanilya', percent: 89 }]
  },
  {
    id: 'frestin-121', code: 'F-21', name: 'Hacivat', subtitle: 'Asil Ananas, Greyfurt & Meşe Yosunu • Extrait', fragranticaRef: 'Nishane Hacivat', gender: 'Unisex', season: 'Yaz / İlkbahar / Dört Mevsim', time: 'Gündüz / Ofis', sillage: 'Çok Yüksek',
    bottleColor: '#065F46', liquidColor: '#A7F3D0', rating: 4.9, reviewsCount: 238,
    notes: [{ name: 'Ananas', percent: 97 }, { name: 'Greyfurt', percent: 95 }, { name: 'Meşe Yosunu', percent: 94 }, { name: 'Bergamot', percent: 92 }, { name: 'Sedir Ağacı', percent: 89 }, { name: 'Paçuli', percent: 87 }]
  },
  {
    id: 'frestin-122', code: 'F-22', name: 'Ani', subtitle: 'Baharatlı Zencefil & Kremsi Vanilya • Extrait', fragranticaRef: 'Nishane Ani', gender: 'Unisex', season: 'Kış / Sonbahar', time: 'Gece', sillage: 'Çok Yüksek',
    bottleColor: '#14532D', liquidColor: '#FDE047', rating: 4.9, reviewsCount: 152,
    notes: [{ name: 'Vanilya', percent: 98 }, { name: 'Mavi Zencefil', percent: 95 }, { name: 'Kakule', percent: 93 }, { name: 'Bergamot', percent: 89 }, { name: 'Benzoin', percent: 88 }, { name: 'Sandal Ağacı', percent: 86 }]
  },
  {
    id: 'frestin-123', code: 'F-23', name: 'Oud For Greatness', subtitle: 'Mistik Oud, Safran & Muskat • Extrait', fragranticaRef: 'Initio Oud For Greatness', gender: 'Unisex', season: 'Kış / Sonbahar', time: 'Gece', sillage: 'Çok Yüksek',
    bottleColor: '#171717', liquidColor: '#FBBF24', rating: 4.9, reviewsCount: 185,
    notes: [{ name: 'Oud (Öd Ağacı)', percent: 98 }, { name: 'Safran', percent: 96 }, { name: 'Küçük Hindistan Cevizi (Muskat)', percent: 92 }, { name: 'Lavanta', percent: 89 }, { name: 'Paçuli', percent: 88 }, { name: 'Misk', percent: 87 }]
  },
  {
    id: 'frestin-124', code: 'F-24', name: 'Side Effect', subtitle: 'Rom, Tütün, Vanilya & Tarçın • Extrait', fragranticaRef: 'Initio Side Effect', gender: 'Unisex', season: 'Kış / Sonbahar', time: 'Gece', sillage: 'Çok Yüksek',
    bottleColor: '#4C0519', liquidColor: '#FDA4AF', rating: 5.0, reviewsCount: 196,
    notes: [{ name: 'Rom', percent: 97 }, { name: 'Tütün Yaprağı', percent: 96 }, { name: 'Vanilya', percent: 95 }, { name: 'Tarçın', percent: 93 }, { name: 'Safran', percent: 89 }, { name: 'Sandal Ağacı', percent: 86 }]
  },
  {
    id: 'frestin-125', code: 'F-25', name: 'Ombré Leather', subtitle: 'Siyah Deri, Kakule & Yasemin • Extrait', fragranticaRef: 'Tom Ford Ombré Leather', gender: 'Unisex', season: 'Kış / Sonbahar', time: 'Gece', sillage: 'Yüksek',
    bottleColor: '#1C1917', liquidColor: '#D97706', rating: 4.9, reviewsCount: 182,
    notes: [{ name: 'Deri', percent: 98 }, { name: 'Kakule', percent: 94 }, { name: 'Yasemin Sambac', percent: 90 }, { name: 'Paçuli', percent: 88 }, { name: 'Amber', percent: 87 }, { name: 'Meşe Yosunu', percent: 85 }]
  },
  {
    id: 'frestin-126', code: 'F-26', name: 'Imagination', subtitle: 'Seylan Çayı, Sicilya Narenciyesi & Zencefil • Extrait', fragranticaRef: 'Louis Vuitton Imagination', gender: 'Erkek', season: 'Yaz / İlkbahar / Dört Mevsim', time: 'Gündüz', sillage: 'Yüksek',
    bottleColor: '#0284C7', liquidColor: '#E0F2FE', rating: 5.0, reviewsCount: 210,
    notes: [{ name: 'Çin Siyah Çayı', percent: 97 }, { name: 'Kalabriya Bergamotu', percent: 96 }, { name: 'Nijerya Zencefili', percent: 93 }, { name: 'Ambroxan', percent: 92 }, { name: 'Portakal', percent: 90 }, { name: 'Neroli', percent: 89 }]
  },
  {
    id: 'frestin-127', code: 'F-27', name: 'Ombre Nomade', subtitle: 'Kraliyet Oudu, Tütsü, Ahududu & Gül • Extrait', fragranticaRef: 'Louis Vuitton Ombre Nomade', gender: 'Unisex', season: 'Kış / Sonbahar', time: 'Gece', sillage: 'Çok Yüksek',
    bottleColor: '#3B0764', liquidColor: '#F3E8FF', rating: 5.0, reviewsCount: 189,
    notes: [{ name: 'Oud (Öd Ağacı)', percent: 98 }, { name: 'Tütsü', percent: 96 }, { name: 'Ahududu', percent: 94 }, { name: 'Gül', percent: 92 }, { name: 'Safran', percent: 90 }, { name: 'Huş Ağacı', percent: 88 }]
  },
  {
    id: 'frestin-128', code: 'F-28', name: 'Stronger With You Intensely', subtitle: 'Karamelize Kestane, Vanilya & Tarçın • Extrait', fragranticaRef: 'Emporio Armani Stronger With You Intensely', gender: 'Erkek', season: 'Kış / Sonbahar', time: 'Gece', sillage: 'Çok Yüksek',
    bottleColor: '#7C2D12', liquidColor: '#FDBA74', rating: 4.9, reviewsCount: 240,
    notes: [{ name: 'Toffee / Karamel', percent: 97 }, { name: 'Tarçın', percent: 95 }, { name: 'Vanilya', percent: 94 }, { name: 'Kestane', percent: 93 }, { name: 'Tonka Fasulyesi', percent: 90 }, { name: 'Süet / Deri', percent: 86 }]
  },
  {
    id: 'frestin-129', code: 'F-29', name: 'Le Male Elixir', subtitle: 'Altın Bal, Tütün, Lavanta & Nane • Extrait', fragranticaRef: 'Jean Paul Gaultier Le Male Elixir', gender: 'Erkek', season: 'Kış / Sonbahar', time: 'Gece', sillage: 'Çok Yüksek',
    bottleColor: '#B45309', liquidColor: '#FEF08A', rating: 5.0, reviewsCount: 265,
    notes: [{ name: 'Bal', percent: 97 }, { name: 'Vanilya', percent: 96 }, { name: 'Tütün Yaprağı', percent: 94 }, { name: 'Lavanta', percent: 93 }, { name: 'Tonka Fasulyesi', percent: 92 }, { name: 'Nane', percent: 89 }]
  },
  {
    id: 'frestin-130', code: 'F-30', name: 'La Belle', subtitle: 'Karamelize Yeşil Armut & Vanilya • Extrait', fragranticaRef: 'Jean Paul Gaultier La Belle', gender: 'Kadın', season: 'Kış / Sonbahar / Dört Mevsim', time: 'Gece', sillage: 'Yüksek',
    bottleColor: '#881337', liquidColor: '#FECDD3', rating: 4.9, reviewsCount: 175,
    notes: [{ name: 'Armut', percent: 98 }, { name: 'Vanilya', percent: 96 }, { name: 'Vetiver', percent: 90 }, { name: 'Bergamot', percent: 88 }, { name: 'Amber', percent: 87 }, { name: 'Misk', percent: 85 }]
  },
  {
    id: 'frestin-131', code: 'F-31', name: 'Paradoxe', subtitle: 'Neroli, Beyaz Çiçekler & Bourbon Vanilya • Extrait', fragranticaRef: 'Prada Paradoxe', gender: 'Kadın', season: 'Dört Mevsim', time: 'Gündüz / Gece', sillage: 'Yüksek',
    bottleColor: '#BE123C', liquidColor: '#FFE4E6', rating: 4.9, reviewsCount: 198,
    notes: [{ name: 'Armut', percent: 94 }, { name: 'Portakal Çiçeği', percent: 96 }, { name: 'Neroli', percent: 95 }, { name: 'Bourbon Vanilya', percent: 93 }, { name: 'Amber', percent: 91 }, { name: 'Beyaz Misk', percent: 89 }]
  },
  {
    id: 'frestin-132', code: 'F-32', name: 'Black Opium', subtitle: 'Siyah Kahve, Vanilya & Beyaz Çiçekler • Extrait', fragranticaRef: 'Yves Saint Laurent Black Opium', gender: 'Kadın', season: 'Kış / Sonbahar', time: 'Gece', sillage: 'Yüksek',
    bottleColor: '#18181B', liquidColor: '#F5D0FE', rating: 4.8, reviewsCount: 230,
    notes: [{ name: 'Kahve', percent: 98 }, { name: 'Vanilya', percent: 96 }, { name: 'Armut', percent: 90 }, { name: 'Portakal Çiçeği', percent: 89 }, { name: 'Pembe Biber', percent: 87 }, { name: 'Paçuli', percent: 86 }]
  },
  {
    id: 'frestin-133', code: 'F-33', name: 'Coco Mademoiselle', subtitle: 'Zarif Portakal, Gül & Paçuli • Extrait', fragranticaRef: 'Chanel Coco Mademoiselle', gender: 'Kadın', season: 'Dört Mevsim', time: 'Gündüz / Ofis', sillage: 'Yüksek',
    bottleColor: '#D97706', liquidColor: '#FDE68A', rating: 4.9, reviewsCount: 254,
    notes: [{ name: 'Portakal', percent: 96 }, { name: 'Paçuli', percent: 95 }, { name: 'Türk Gülü', percent: 93 }, { name: 'Bergamot', percent: 92 }, { name: 'Yasemin', percent: 90 }, { name: 'Vanilya', percent: 88 }]
  },
  {
    id: 'frestin-134', code: 'F-34', name: 'Hypnotic Poison', subtitle: 'Büyüleyici Acı Badem, Hindistan Cevizi & Vanilya • Extrait', fragranticaRef: 'Dior Hypnotic Poison', gender: 'Kadın', season: 'Kış / Sonbahar', time: 'Gece', sillage: 'Çok Yüksek',
    bottleColor: '#7F1D1D', liquidColor: '#FCA5A5', rating: 4.9, reviewsCount: 212,
    notes: [{ name: 'Vanilya', percent: 98 }, { name: 'Acı Badem', percent: 96 }, { name: 'Hindistan Cevizi', percent: 92 }, { name: 'Erik', percent: 89 }, { name: 'Sümbülteber', percent: 88 }, { name: 'Sandal Ağacı', percent: 87 }]
  },
  {
    id: 'frestin-135', code: 'F-35', name: 'Black Afgano', subtitle: 'Karanlık Kenevir, Reçine, Kahve & Oud • Extrait', fragranticaRef: 'Nasomatto Black Afgano', gender: 'Unisex', season: 'Kış / Sonbahar', time: 'Gece', sillage: 'Çok Yüksek',
    bottleColor: '#09090B', liquidColor: '#3F3F46', rating: 4.9, reviewsCount: 168,
    notes: [{ name: 'Esrar / Kenevir Notaları', percent: 98 }, { name: 'Oud (Öd Ağacı)', percent: 96 }, { name: 'Tütsü', percent: 95 }, { name: 'Kahve', percent: 93 }, { name: 'Tütün Yaprağı', percent: 91 }, { name: 'Reçine', percent: 90 }]
  },
  {
    id: 'frestin-136', code: 'F-36', name: 'Megamare', subtitle: 'Fırtınalı Okyanus, Deniz Yosunu & Ambroxan • Extrait', fragranticaRef: 'Orto Parisi Megamare', gender: 'Unisex', season: 'Yaz / Dört Mevsim', time: 'Gündüz / Gece', sillage: 'Çok Yüksek',
    bottleColor: '#164E63', liquidColor: '#A5F3FC', rating: 4.9, reviewsCount: 194,
    notes: [{ name: 'Deniz Notaları', percent: 99 }, { name: 'Deniz Yosunu', percent: 96 }, { name: 'Ambroxan', percent: 95 }, { name: 'Tuzlu Mineral Notalar', percent: 94 }, { name: 'Bergamot', percent: 89 }, { name: 'Misk', percent: 88 }]
  },
  {
    id: 'frestin-137', code: 'F-37', name: 'Portrait of a Lady', subtitle: 'Görkemli Türk Gülü, Tütsü, Karanfil & Paçuli • Extrait', fragranticaRef: 'Frederic Malle Portrait of a Lady', gender: 'Unisex', season: 'Kış / Sonbahar', time: 'Gece / Özel Gün', sillage: 'Çok Yüksek',
    bottleColor: '#450A0A', liquidColor: '#FECACA', rating: 5.0, reviewsCount: 147,
    notes: [{ name: 'Türk Gülü', percent: 98 }, { name: 'Paçuli', percent: 95 }, { name: 'Tütsü', percent: 94 }, { name: 'Ahududu', percent: 91 }, { name: 'Karanfil', percent: 90 }, { name: 'Sandal Ağacı', percent: 88 }]
  },
  {
    id: 'frestin-138', code: 'F-38', name: 'Santal 33', subtitle: 'İkonik Avustralya Sandal Ağacı, Deri & Kakule • Extrait', fragranticaRef: 'Le Labo Santal 33', gender: 'Unisex', season: 'Dört Mevsim', time: 'Gündüz / Ofis', sillage: 'Yüksek',
    bottleColor: '#57534E', liquidColor: '#E7E5E4', rating: 4.8, reviewsCount: 162,
    notes: [{ name: 'Sandal Ağacı', percent: 98 }, { name: 'Deri', percent: 95 }, { name: 'Papirüs', percent: 93 }, { name: 'Virginia Sediri', percent: 91 }, { name: 'Kakule', percent: 89 }, { name: 'Menekşe', percent: 87 }]
  },
  {
    id: 'frestin-139', code: 'F-39', name: 'Gypsy Water', subtitle: 'Çam İğneleri, Ardıç Meyvesi, Tütsü & Vanilya • Extrait', fragranticaRef: 'Byredo Gypsy Water', gender: 'Unisex', season: 'İlkbahar / Yaz / Dört Mevsim', time: 'Gündüz', sillage: 'Orta - Yüksek',
    bottleColor: '#27272A', liquidColor: '#FAFAFA', rating: 4.8, reviewsCount: 143,
    notes: [{ name: 'Ardıç Meyvesi', percent: 95 }, { name: 'Çam İğnesi', percent: 94 }, { name: 'Vanilya', percent: 92 }, { name: 'Sandal Ağacı', percent: 91 }, { name: 'Bergamot', percent: 89 }, { name: 'Tütsü', percent: 88 }]
  },
  {
    id: 'frestin-140', code: 'F-40', name: 'Jazz Club', subtitle: 'Brooklyn Caz Kulübü: Rom, Puro Tütünü & Vanilya • Extrait', fragranticaRef: 'Maison Margiela Replica Jazz Club', gender: 'Erkek', season: 'Kış / Sonbahar', time: 'Gece', sillage: 'Yüksek',
    bottleColor: '#9A3412', liquidColor: '#FDBA74', rating: 4.9, reviewsCount: 159,
    notes: [{ name: 'Rom', percent: 97 }, { name: 'Tütün Yaprağı', percent: 96 }, { name: 'Vanilya', percent: 94 }, { name: 'Pembe Biber', percent: 89 }, { name: 'Vetiver', percent: 87 }, { name: 'Portakal Çiçeği', percent: 85 }]
  },
  {
    id: 'frestin-141', code: 'F-41', name: 'Grand Soir', subtitle: 'Paris Gecesi: Saf Kehribar, Benzoin & Vanilya • Extrait', fragranticaRef: 'Maison Francis Kurkdjian Grand Soir', gender: 'Unisex', season: 'Kış / Sonbahar', time: 'Gece', sillage: 'Çok Yüksek',
    bottleColor: '#B45309', liquidColor: '#FCD34D', rating: 5.0, reviewsCount: 183,
    notes: [{ name: 'Amber', percent: 99 }, { name: 'Siam Benzoini', percent: 96 }, { name: 'Vanilya', percent: 95 }, { name: 'Tonka Fasulyesi', percent: 93 }, { name: 'İspanyol Labdanumu', percent: 91 }, { name: 'Lavanta', percent: 86 }]
  },
  {
    id: 'frestin-142', code: 'F-42', name: 'Herod', subtitle: 'Kraliyet Tütünü, Tarçın, Osmanthus & Vanilya • Extrait', fragranticaRef: 'Parfums de Marly Herod', gender: 'Erkek', season: 'Kış / Sonbahar', time: 'Gece', sillage: 'Yüksek',
    bottleColor: '#451A03', liquidColor: '#FDE68A', rating: 4.9, reviewsCount: 171,
    notes: [{ name: 'Tütün Yaprağı', percent: 98 }, { name: 'Tarçın', percent: 95 }, { name: 'Vanilya', percent: 94 }, { name: 'Tütsü', percent: 90 }, { name: 'Osmanthus', percent: 88 }, { name: 'Sedir Ağacı', percent: 87 }]
  },
  {
    id: 'frestin-143', code: 'F-43', name: 'Pegasus', subtitle: 'Metalik Acı Badem, Heliotrop & Vanilya • Extrait', fragranticaRef: 'Parfums de Marly Pegasus', gender: 'Erkek', season: 'Kış / Sonbahar / İlkbahar', time: 'Gündüz / Gece', sillage: 'Yüksek',
    bottleColor: '#475569', liquidColor: '#F1F5F9', rating: 4.8, reviewsCount: 149,
    notes: [{ name: 'Acı Badem', percent: 98 }, { name: 'Heliotrop', percent: 95 }, { name: 'Vanilya', percent: 93 }, { name: 'Sandal Ağacı', percent: 90 }, { name: 'Lavanta', percent: 88 }, { name: 'Kimyon', percent: 85 }]
  },
  {
    id: 'frestin-144', code: 'F-44', name: 'Alexandria II', subtitle: 'Saray İhtişamı: Gül Ağacı, Lavanta, Elma & Laos Oudu • Extrait', fragranticaRef: 'Xerjoff Alexandria II', gender: 'Unisex', season: 'Kış / Sonbahar', time: 'Gece / Özel Gün', sillage: 'Çok Yüksek',
    bottleColor: '#713F12', liquidColor: '#FEF08A', rating: 5.0, reviewsCount: 205,
    notes: [{ name: 'Oud (Öd Ağacı)', percent: 97 }, { name: 'Lavanta', percent: 95 }, { name: 'Gül Ağacı', percent: 94 }, { name: 'Elma', percent: 92 }, { name: 'Tarçın', percent: 91 }, { name: 'Amber', percent: 90 }]
  },
  {
    id: 'frestin-145', code: 'F-45', name: 'Lira', subtitle: 'İtalyan Limonlu Kek, Karamel & Kan Portakalı • Extrait', fragranticaRef: 'Xerjoff Casamorati Lira', gender: 'Kadın', season: 'Kış / Sonbahar', time: 'Gündüz / Gece', sillage: 'Yüksek',
    bottleColor: '#A16207', liquidColor: '#FEF08A', rating: 4.9, reviewsCount: 187,
    notes: [{ name: 'Karamel', percent: 98 }, { name: 'Kan Portakalı', percent: 95 }, { name: 'Vanilya', percent: 96 }, { name: 'Bergamot', percent: 92 }, { name: 'Tarçın', percent: 90 }, { name: 'Meyan Kökü', percent: 87 }]
  },
  {
    id: 'frestin-146', code: 'F-46', name: 'Bianco Latte', subtitle: 'Sıcak Süt, Karamel, Beyaz Misk & Bal • Extrait', fragranticaRef: 'Giardini Di Toscana Bianco Latte', gender: 'Unisex', season: 'Kış / Sonbahar', time: 'Gündüz / Gece', sillage: 'Çok Yüksek',
    bottleColor: '#D6D3D1', liquidColor: '#FEF3C7', rating: 5.0, reviewsCount: 228,
    notes: [{ name: 'Karamel', percent: 99 }, { name: 'Süt / Krema', percent: 97 }, { name: 'Bal', percent: 95 }, { name: 'Vanilya', percent: 96 }, { name: 'Kumarin (Tonka)', percent: 92 }, { name: 'Beyaz Misk', percent: 90 }]
  },
  {
    id: 'frestin-147', code: 'F-47', name: 'Khamrah', subtitle: 'Hurma, Tarçın, Pralin & Kavrulmuş Tonka • Extrait', fragranticaRef: 'Lattafa Khamrah', gender: 'Unisex', season: 'Kış / Sonbahar', time: 'Gece', sillage: 'Çok Yüksek',
    bottleColor: '#92400E', liquidColor: '#F59E0B', rating: 4.9, reviewsCount: 242,
    notes: [{ name: 'Tarçın', percent: 97 }, { name: 'Hurma', percent: 96 }, { name: 'Pralin', percent: 95 }, { name: 'Vanilya', percent: 94 }, { name: 'Tonka Fasulyesi', percent: 92 }, { name: 'Mür Reçinesi', percent: 89 }]
  },
  {
    id: 'frestin-148', code: 'F-48', name: 'Cedrat Boise', subtitle: 'Sicilya Limonu, Frenk Üzümü, Deri & Odunlar • Extrait', fragranticaRef: 'Mancera Cedrat Boise', gender: 'Unisex', season: 'Yaz / İlkbahar / Dört Mevsim', time: 'Gündüz', sillage: 'Yüksek',
    bottleColor: '#CA8A04', liquidColor: '#FEF9C3', rating: 4.8, reviewsCount: 176,
    notes: [{ name: 'Sicilya Limonu', percent: 97 }, { name: 'Siyah Frenk Üzümü', percent: 95 }, { name: 'Sedir Ağacı', percent: 93 }, { name: 'Deri', percent: 91 }, { name: 'Meşe Yosunu', percent: 89 }, { name: 'Vanilya', percent: 87 }]
  },
  {
    id: 'frestin-149', code: 'F-49', name: 'Roses Vanille', subtitle: 'Lokum, Türk Gülü, Şeker & Yoğun Vanilya • Extrait', fragranticaRef: 'Mancera Roses Vanille', gender: 'Kadın', season: 'Kış / Sonbahar / Dört Mevsim', time: 'Gündüz / Gece', sillage: 'Çok Yüksek',
    bottleColor: '#BE185D', liquidColor: '#FCE7F3', rating: 4.9, reviewsCount: 193,
    notes: [{ name: 'Türk Gülü', percent: 98 }, { name: 'Vanilya', percent: 97 }, { name: 'Türk Lokumu', percent: 95 }, { name: 'Beyaz Misk', percent: 92 }, { name: 'Sedir Ağacı', percent: 88 }, { name: 'İtalyan Limonu', percent: 86 }]
  },
  {
    id: 'frestin-150', code: 'F-50', name: 'Arabians Tonka', subtitle: 'Arap Oudu, Safran, Esmer Şeker & Tonka • Extrait', fragranticaRef: 'Montale Arabians Tonka', gender: 'Unisex', season: 'Kış / Sonbahar', time: 'Gece', sillage: 'Çok Yüksek',
    bottleColor: '#18181B', liquidColor: '#FDE047', rating: 5.0, reviewsCount: 256,
    notes: [{ name: 'Tonka Fasulyesi', percent: 98 }, { name: 'Esmer Şeker', percent: 96 }, { name: 'Oud (Öd Ağacı)', percent: 95 }, { name: 'Safran', percent: 94 }, { name: 'Bulgar Gülü', percent: 92 }, { name: 'Amber', percent: 90 }]
  },
  {
    id: 'frestin-151', code: 'F-51', name: 'My Way', subtitle: 'Mısır Portakal Çiçeği, Hint Sümbülteberi & Vanilya • Extrait', fragranticaRef: 'Giorgio Armani My Way', gender: 'Kadın', season: 'İlkbahar / Yaz', time: 'Gündüz', sillage: 'Yüksek',
    bottleColor: '#DB2777', liquidColor: '#FBCFE8', rating: 4.8, reviewsCount: 167,
    notes: [{ name: 'Portakal Çiçeği', percent: 97 }, { name: 'Sümbülteber', percent: 96 }, { name: 'Yasemin', percent: 93 }, { name: 'Bergamot', percent: 91 }, { name: 'Madagaskar Vanilyası', percent: 89 }, { name: 'Beyaz Misk', percent: 88 }]
  },
  {
    id: 'frestin-152', code: 'F-52', name: 'Scandal', subtitle: 'Kan Portakalı, Süzme Bal, Gardenya & Karamel • Extrait', fragranticaRef: 'Jean Paul Gaultier Scandal', gender: 'Kadın', season: 'Kış / Sonbahar', time: 'Gece', sillage: 'Çok Yüksek',
    bottleColor: '#9D174D', liquidColor: '#F9A8D4', rating: 4.9, reviewsCount: 214,
    notes: [{ name: 'Bal', percent: 98 }, { name: 'Kan Portakalı', percent: 95 }, { name: 'Karamel', percent: 94 }, { name: 'Paçuli', percent: 92 }, { name: 'Gardenya', percent: 90 }, { name: 'Şeftali', percent: 88 }]
  }
];

const FRAGRANTICA_NOTE_FAMILIES = {
  'Tümü': [],
  'Narenciye & Ferah': [
    'Bergamot', 'Kalabriya Bergamotu', 'Limon', 'Sicilya Limonu', 'Limon Kabuğu', 'Portakal', 'Kan Portakalı',
    'Sicilya Portakalı', 'Mandalina', 'Yeşil Mandalina', 'İtalyan Mandalinası', 'Greyfurt', 'Misket Limonu (Lime)',
    'Yuzu', 'Neroli', 'Petitgrain', 'Mine Çiçeği (Verbena)', 'Ağaçkavunu (Citron)'
  ],
  'Meyveler & Egzotik': [
    'Ananas', 'Elma', 'Yeşil Elma', 'Armut', 'Şeftali', 'Beyaz Şeftali', 'Vişne / Kiraz', 'Çarkıfelek Meyvesi',
    'Ahududu', 'Siyah Frenk Üzümü', 'Çilek', 'Böğürtlen', 'Litchi', 'İncir', 'Hindistan Cevizi', 'Erik',
    'Hurma', 'Tropikal Meyveler', 'Kurutulmuş Meyveler', 'Karpuz', 'Kavun', 'Mango', 'Nar', 'Ravent (Rhubarb)'
  ],
  'Çiçekler & Beyaz Çiçekler': [
    'Gül', 'Türk Gülü', 'Bulgar Gülü', 'Şam Gülü', 'Yasemin', 'Hint Yasemini', 'Yasemin Sambac', 'Portakal Çiçeği',
    'Lavanta', 'Sümbülteber', 'Orkide', 'Siyah Orkide', 'Şakayık', 'İris / Süsen', 'Menekşe', 'Menekşe Yaprağı',
    'Ylang-Ylang', 'Manolya', 'Gardenya', 'Nilüfer', 'Yeşil Leylak', 'Heliotrop', 'Osmanthus', 'Frezya', 'Zambak', 'Mimoza'
  ],
  'Baharatlar & Aromatik': [
    'Tarçın', 'Safran', 'Kakule', 'Zencefil', 'Mavi Zencefil', 'Nijerya Zencefili', 'Karabiber', 'Pembe Biber',
    'Küçük Hindistan Cevizi (Muskat)', 'Karanfil', 'Kimyon', 'Yıldız Anason', 'Kişniş', 'Nane', 'Biberiye',
    'Adaçayı', 'Kekik', 'Fesleğen', 'Ardıç Meyvesi', 'Çam İğnesi', 'Çin Siyah Çayı', 'Yeşil Çay', 'Mate Çayı', 'Meyan Kökü'
  ],
  'Gurme, Tatlı & İçecekler': [
    'Vanilya', 'Bourbon Vanilya', 'Madagaskar Vanilyası', 'Karamel', 'Toffee / Karamel', 'Bal', 'Çikolata', 'Kakao',
    'Kahve', 'Pralin', 'Acı Badem', 'Badem', 'Kestane', 'Fındık', 'Süt / Krema', 'Türk Lokumu', 'Esmer Şeker',
    'Pamuk Şeker', 'Konyak', 'Rom', 'Viski', 'Likör', 'Şampanya'
  ],
  'Odunlar, Oud & Yosunlar': [
    'Oud (Öd Ağacı)', 'Sandal Ağacı', 'Sedir Ağacı', 'Virginia Sediri', 'Paçuli', 'Vetiver', 'Huş Ağacı',
    'Meşe Yosunu', 'Meşe', 'Guaiac Ağacı', 'Kaşmir Ağacı', 'Gül Ağacı', 'Akigalawood', 'Papirüs', 'Selvi',
    'Çam', 'Bambu', 'Odunsu Notalar'
  ],
  'Amber, Misk, Deri & Reçineler': [
    'Amber', 'Beyaz Amber', 'Ambergris', 'Ambroxan', 'Misk', 'Beyaz Misk', 'Tonka Fasulyesi', 'Kumarin (Tonka)',
    'Deri', 'Süet / Deri', 'Tütün Yaprağı', 'Tütsü', 'Mür Reçinesi', 'Benzoin', 'Siam Benzoini', 'İspanyol Labdanumu',
    'Peru Balsamı', 'Elemi', 'Reçine', 'Cashmeran', 'Iso E Super', 'Trüf Mantarı', 'Esrar / Kenevir Notaları',
    'Deniz Notaları', 'Su Notaları', 'Deniz Yosunu', 'Tuzlu Mineral Notalar', 'Mineral Notalar', 'Barut'
  ]
};

// ==========================================
// FRESTIN LOGO BİLEŞENİ
// ==========================================
const FrestinBrandLogo = ({ size = 'md', showText = true }) => {
  const dimensions = {
    sm: { box: 'w-9 h-9', title: 'text-lg', sub: 'text-[8px]' },
    md: { box: 'w-11 h-11', title: 'text-2xl', sub: 'text-[9.5px]' },
    lg: { box: 'w-14 h-14', title: 'text-3xl', sub: 'text-[11px]' }
  }[size] || { box: 'w-11 h-11', title: 'text-2xl', sub: 'text-[9.5px]' };

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
  const [catalog, setCatalog] = useState(INITIAL_CATALOG);

  // Fragrantica Tüm Notalar listesi (kullanıcı da yeni nota ekleyebilir)
  const [customAddedNotes, setCustomAddedNotes] = useState([]);
  const [activeNoteCategory, setActiveNoteCategory] = useState('Tümü');
  const [noteSearchQuery, setNoteSearchQuery] = useState('');

  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [customBrandName, setCustomBrandName] = useState('');
  const [customFragranceName, setCustomFragranceName] = useState('');
  const [customGender, setCustomGender] = useState('Unisex');
  const [customNotesInput, setCustomNotesInput] = useState('');

  const [selectedRefIds, setSelectedRefIds] = useState([INITIAL_CATALOG[12].id, INITIAL_CATALOG[3].id]);
  const [refSearchQuery, setRefSearchQuery] = useState('');
  const [refGenderFilter, setRefGenderFilter] = useState('Tümü');

  const [likedNotes, setLikedNotes] = useState(['Safran', 'Vanilya', 'Amber']);
  const [dislikedNotes, setDislikedNotes] = useState([]);
  const [noteSelectionMode, setNoteSelectionMode] = useState('like');

  // Kişiselleştirme Tercihleri
  const [prefGender, setPrefGender] = useState('Tümü');
  const [prefSeason, setPrefSeason] = useState('Tümü');
  const [prefTime, setPrefTime] = useState('Tümü');
  const [prefSillage, setPrefSillage] = useState('Tümü');

  const [selectedSizes, setSelectedSizes] = useState({});
  const [detailModalProduct, setDetailModalProduct] = useState(null);

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Tüm notaların birleşik listesi
  const allAvailableNotes = useMemo(() => {
    const base = Object.values(FRAGRANTICA_NOTE_FAMILIES).flat();
    return Array.from(new Set([...customAddedNotes, ...base]));
  }, [customAddedNotes]);

  const displayedNotes = useMemo(() => {
    const source =
      activeNoteCategory === 'Tümü'
        ? allAvailableNotes
        : [...customAddedNotes, ...(FRAGRANTICA_NOTE_FAMILIES[activeNoteCategory] || [])];
    if (!noteSearchQuery.trim()) return source;
    return allAvailableNotes.filter((n) => n.toLowerCase().includes(noteSearchQuery.toLowerCase()));
  }, [activeNoteCategory, allAvailableNotes, customAddedNotes, noteSearchQuery]);

  // Kullanıcının yazdığı özel notayı anında ekleme
  const handleQuickAddNote = (noteText) => {
    const clean = noteText.trim();
    if (!clean) return;
    if (!allAvailableNotes.some((n) => n.toLowerCase() === clean.toLowerCase())) {
      setCustomAddedNotes((prev) => [clean, ...prev]);
    }
    if (noteSelectionMode === 'like') {
      if (!likedNotes.includes(clean)) setLikedNotes((prev) => [...prev, clean]);
      setDislikedNotes((prev) => prev.filter((n) => n !== clean));
    } else {
      if (!dislikedNotes.includes(clean)) setDislikedNotes((prev) => [...prev, clean]);
      setLikedNotes((prev) => prev.filter((n) => n !== clean));
    }
    setNoteSearchQuery('');
    setToastMessage(`"${clean}" notası ${noteSelectionMode === 'like' ? 'sevdiğiniz' : 'istemediğiniz'} notalara eklendi!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Kullanıcının arama kutusuna yazdığı parfümü tek tıkla eklemesi
  const handleQuickAddPerfumeFromSearch = (rawQuery) => {
    const clean = rawQuery.trim();
    if (!clean) return;
    const newId = `custom-${Date.now()}`;
    const newProduct = {
      id: newId,
      code: `F-ÖZEL`,
      name: clean,
      subtitle: `${prefGender === 'Tümü' ? 'Unisex' : prefGender} • Özel Fragrantica Eşleşmesi`,
      fragranticaRef: clean,
      gender: prefGender === 'Tümü' ? 'Unisex' : prefGender,
      season: prefSeason === 'Tümü' ? 'Dört Mevsim' : prefSeason,
      time: prefTime === 'Tümü' ? 'Gündüz / Gece' : prefTime,
      sillage: 'Çok Yüksek',
      bottleColor: '#7C1D1D',
      liquidColor: '#F0D4A3',
      rating: 5.0,
      reviewsCount: 12,
      notes: likedNotes.length > 0 ? likedNotes.slice(0, 4).map((n) => ({ name: n, percent: 95 })) : [{ name: 'Özel Esans Harmanı', percent: 96 }]
    };
    setCatalog((prev) => [newProduct, ...prev]);
    setSelectedRefIds((prev) => [newId, ...prev]);
    setRefSearchQuery('');
    setToastMessage(`"${clean}" Fragrantica referans listenize eklendi ve eşleştirildi!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddCustomPerfume = (e) => {
    e.preventDefault();
    if (!customFragranceName.trim()) return;
    const fullName = customBrandName.trim() ? `${customBrandName.trim()} ${customFragranceName.trim()}` : customFragranceName.trim();
    const newId = `custom-${Date.now()}`;
    const parsedNotes = customNotesInput
      ? customNotesInput
          .split(',')
          .map((n) => n.trim())
          .filter(Boolean)
      : [];

    if (parsedNotes.length > 0) {
      setCustomAddedNotes((prev) => Array.from(new Set([...parsedNotes, ...prev])));
      setLikedNotes((prev) => Array.from(new Set([...prev, ...parsedNotes])));
    }

    const newProduct = {
      id: newId,
      code: `F-${catalog.length + 1}`,
      name: customFragranceName.trim(),
      subtitle: `${customGender} • Extrait de Parfum`,
      fragranticaRef: fullName,
      gender: customGender,
      season: 'Dört Mevsim',
      time: 'Gündüz / Gece',
      sillage: 'Çok Yüksek',
      bottleColor: '#7C1D1D',
      liquidColor: '#F0D4A3',
      rating: 5.0,
      reviewsCount: 1,
      notes: parsedNotes.length > 0 ? parsedNotes.map((n) => ({ name: n, percent: 95 })) : [{ name: 'Özel Nota', percent: 95 }]
    };
    setCatalog([newProduct, ...catalog]);
    setSelectedRefIds([newId, ...selectedRefIds]);
    setShowAddCustomModal(false);
    setCustomBrandName('');
    setCustomFragranceName('');
    setCustomNotesInput('');
    setToastMessage(`"${fullName}" parfümü ve notaları başarıyla eklendi!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Akıllı Parfüm Eşleştirme Motoru
  const matchedPerfumes = useMemo(() => {
    const selectedRefObjects = catalog.filter((c) => selectedRefIds.includes(c.id));
    const refNotesSet = new Set(
      selectedRefObjects.flatMap((p) => p.notes.map((n) => n.name.toLowerCase()))
    );

    return catalog
      .map((item) => {
        let score = 68;
        const itemNoteNames = item.notes.map((n) => n.name.toLowerCase());
        const matchedNotePills = [];

        // 1. Seçilen referans parfümlerden biri mi?
        if (selectedRefIds.includes(item.id)) {
          score += 26;
        }

        // 2. Referans parfümlerle ortak notalar
        item.notes.forEach((n) => {
          if (refNotesSet.has(n.name.toLowerCase())) {
            score += 5;
            matchedNotePills.push(n.name);
          }
        });

        // 3. Kullanıcının sevdiği notalar
        likedNotes.forEach((liked) => {
          const likedLow = liked.toLowerCase();
          if (itemNoteNames.some((inote) => inote.includes(likedLow) || likedLow.includes(inote))) {
            score += 9;
            if (!matchedNotePills.includes(liked)) matchedNotePills.push(liked);
          }
        });

        // 4. Kullanıcının istemediği notalar (Ceza puanı)
        let hasDisliked = false;
        dislikedNotes.forEach((dis) => {
          const disLow = dis.toLowerCase();
          if (itemNoteNames.some((inote) => inote.includes(disLow) || disLow.includes(inote))) {
            score -= 35;
            hasDisliked = true;
          }
        });

        // 5. Kişiselleştirme filtreleri (Cinsiyet, Mevsim, Zaman, Yoğunluk)
        if (prefGender !== 'Tümü') {
          if (item.gender === prefGender) score += 6;
          else if (item.gender === 'Unisex') score += 2;
          else score -= 18;
        }
        if (prefSeason !== 'Tümü' && item.season) {
          if (item.season.includes(prefSeason) || item.season.includes('Dört Mevsim')) score += 5;
          else score -= 8;
        }
        if (prefTime !== 'Tümü' && item.time) {
          if (item.time.includes(prefTime)) score += 4;
        }
        if (prefSillage !== 'Tümü' && item.sillage) {
          if (item.sillage.includes(prefSillage)) score += 4;
        }

        const finalMatch = Math.max(45, Math.min(99, Math.round(score)));
        return {
          ...item,
          calculatedMatch: finalMatch,
          matchedNotePills: Array.from(new Set(matchedNotePills)),
          hasDisliked
        };
      })
      .sort((a, b) => b.calculatedMatch - a.calculatedMatch);
  }, [catalog, selectedRefIds, likedNotes, dislikedNotes, prefGender, prefSeason, prefTime, prefSillage]);

  const getSelectedSize = (productId) => selectedSizes[productId] || '50ml';
  const setSelectedSize = (productId, size) => setSelectedSizes((prev) => ({ ...prev, [productId]: size }));

  const addToCart = (product, size) => {
    const price = size === '100ml' ? PRICE_100ML : PRICE_50ML;
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
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E1C] flex flex-col font-sans selection:bg-[#E6482E] selection:text-white">
      {/* NAVİGASYON HEADER */}
      <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E6E0D6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
          <button onClick={() => setActiveTab('home')} className="text-left group focus:outline-none shrink-0">
            <FrestinBrandLogo size="md" showText={true} />
          </button>

          <nav className="hidden lg:flex items-center bg-[#F3EFE6] p-1.5 rounded-full border border-[#E6E0D6] gap-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'home' ? 'bg-[#1E1E1C] text-[#FAF7F2] shadow-sm' : 'text-[#5A5751] hover:text-[#1E1E1C]'
              }`}
            >
              <span>Ana Sayfa</span>
            </button>
            <button
              onClick={() => setActiveTab('finder')}
              className={`relative flex items-center gap-2.5 px-6 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'finder'
                  ? 'bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#EA580C] text-white shadow-lg shadow-[#EA580C]/30 ring-2 ring-[#FDE68A]'
                  : 'bg-gradient-to-r from-[#FEF3C7] via-[#FDE68A] to-[#FFEDD5] text-[#78350F] hover:brightness-95 border border-[#F59E0B]/40 shadow-xs'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${activeTab === 'finder' ? 'text-[#FEF08A] animate-pulse' : 'text-[#D97706]'}`} />
              <span>Parfümünü Bul</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1E1E1C] text-[#FDE68A] font-extrabold tracking-wider uppercase">
                Fragrantica AI
              </span>
            </button>
            <button
              onClick={() => setActiveTab('instock')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'instock' ? 'bg-[#4A7C59] text-white shadow-sm' : 'text-[#4A7C59] hover:bg-[#4A7C59]/10'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Stoklu Ürünlerimiz</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E9C46A] text-[#1E1E1C] font-bold">Hemen Teslim</span>
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#833AB4]/10 via-[#FD1D1D]/10 to-[#FCB045]/10 text-[#1E1E1C] border border-[#DED8CE] px-3.5 py-2 rounded-full text-xs font-bold transition-all"
            >
              <Instagram className="w-4 h-4 text-[#C13584]" />
              <span className="hidden sm:inline">@frestin_perfumes</span>
            </a>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-white text-[#1E1E1C] border border-[#DED8CE] px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all shadow-sm"
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
        <div className="flex lg:hidden border-t border-[#E6E0D6] bg-[#F3EFE6] px-2 py-1.5 gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 whitespace-nowrap ${
              activeTab === 'home' ? 'bg-[#1E1E1C] text-white' : 'text-[#5A5751]'
            }`}
          >
            Ana Sayfa
          </button>
          <button
            onClick={() => setActiveTab('finder')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1.5 whitespace-nowrap shadow-sm ${
              activeTab === 'finder'
                ? 'bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#EA580C] text-white ring-1 ring-[#FDE68A]'
                : 'bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] text-[#78350F] border border-[#F59E0B]/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Parfümünü Bul</span>
          </button>
          <button
            onClick={() => setActiveTab('instock')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 whitespace-nowrap ${
              activeTab === 'instock' ? 'bg-[#4A7C59] text-white' : 'text-[#4A7C59]'
            }`}
          >
            Stoklu Ürünler
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

      {/* ================= ANA SAYFA ================= */}
      {activeTab === 'home' && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#191716] via-[#261D1A] to-[#3B231A] text-white shadow-2xl border border-[#E86F38]/25">
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
                    className="px-6 py-4 rounded-2xl bg-gradient-to-r from-[#E62E2D] via-[#EF5B35] to-[#F7943C] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xl cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Hemen Teslim Stoklu Parfümler</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('finder')}
                    className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#F89843]" />
                    <span>Kendi Parfümünü Bul</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="relative w-full max-w-md bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#F89843]">İmza Koleksiyonumuz</span>
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#4A7C59] text-white font-bold">50 ml & 100 ml</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div onClick={() => setActiveTab('finder')} className="bg-black/25 p-4 rounded-2xl border border-white/10 cursor-pointer text-center group">
                      <RealFrestinBottleCardSVG labelColor="#7C1D1D" liquidTint="#F0D4A3" title="ALTHAIR" subLabel="ALTHAÏR" />
                      <div className="text-xs font-bold text-white mt-1">Althaïr</div>
                    </div>
                    <div onClick={() => setActiveTab('finder')} className="bg-black/25 p-4 rounded-2xl border border-white/10 cursor-pointer text-center group">
                      <RealFrestinBottleCardSVG labelColor="#B87A1E" liquidTint="#E8D5A7" title="LEAUPAR" subLabel="L'EAU PAR" />
                      <div className="text-xs font-bold text-white mt-1">L&apos;Eau Par</div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('finder')}
                    className="w-full mt-5 py-3.5 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#EA580C] to-[#D97706] text-white hover:brightness-110 text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Fragrantica İle Kendi Parfümünü Bul</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ================= PARFÜMÜNÜ BUL (GÖSTERİŞLİ & TAM KİŞİSELLEŞTİRİLEBİLİR) ================= */}
      {activeTab === 'finder' && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* LÜKS HERO BAŞLIK KARTI */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#171210] via-[#2A1B12] to-[#432312] text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-[#F59E0B]/40">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-[#F59E0B]/25 to-[#EA580C]/5 blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#F59E0B]/25 to-[#EA580C]/25 border border-[#F59E0B]/50 text-[#FDE68A] text-xs font-extrabold tracking-wider uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
                  <span>KİŞİYE ÖZEL FRAGRANTICA KOKU LABORATUVARI</span>
                </div>
                <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold leading-tight">
                  Hayalinizdeki Parfümü ve Notaları <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDE68A] via-[#F59E0B] to-[#FB923C]">Sınırsızca Tasarlayın</span>
                </h1>
                <p className="text-xs sm:text-sm text-[#E7E0D6] leading-relaxed">
                  Fragrantica dünyasındaki tüm parfümleri ve yüzlerce koku notasını seçin. Listede bulamadığınız <strong>herhangi bir parfümü veya notayı doğrudan arama kutusuna yazarak tek tıkla kendiniz ekleyin</strong>; size en uygun Frestin Extrait karşılığını anında bulalım.
                </p>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
                <button
                  onClick={() => setShowAddCustomModal(true)}
                  className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[#F59E0B] to-[#EA580C] hover:brightness-110 text-[#1E1E1C] font-extrabold text-xs flex items-center gap-2 shadow-xl cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Özel Parfüm & Nota Tanımla</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedRefIds([]);
                    setLikedNotes([]);
                    setDislikedNotes([]);
                    setPrefGender('Tümü');
                    setPrefSeason('Tümü');
                    setPrefTime('Tümü');
                    setPrefSillage('Tümü');
                  }}
                  className="px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Sıfırla</span>
                </button>
              </div>
            </div>

            {/* KİŞİSEL KOKU PROFİLİ ÖZET BARI */}
            <div className="relative z-10 mt-6 pt-5 border-t border-white/15 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/30 rounded-2xl p-3.5 border border-white/10">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#FBBF24] mb-1.5">
                  1. Seçtiğiniz Referans Parfümler ({selectedRefIds.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRefIds.length === 0 ? (
                    <span className="text-xs text-white/50">Henüz parfüm seçilmedi</span>
                  ) : (
                    catalog
                      .filter((c) => selectedRefIds.includes(c.id))
                      .map((p) => (
                        <span
                          key={p.id}
                          onClick={() => setSelectedRefIds(selectedRefIds.filter((id) => id !== p.id))}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F59E0B]/25 border border-[#F59E0B]/50 text-[#FEF3C7] text-[11px] font-semibold cursor-pointer hover:bg-red-500/30"
                        >
                          {p.fragranticaRef} <X className="w-3 h-3" />
                        </span>
                      ))
                  )}
                </div>
              </div>

              <div className="bg-black/30 rounded-2xl p-3.5 border border-white/10">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#4ADE80] mb-1.5">
                  2. Sevdiğiniz Notalar ({likedNotes.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {likedNotes.length === 0 ? (
                    <span className="text-xs text-white/50">Nota seçilmedi</span>
                  ) : (
                    likedNotes.map((n) => (
                      <span
                        key={n}
                        onClick={() => setLikedNotes(likedNotes.filter((item) => item !== n))}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#22C55E]/25 border border-[#4ADE80]/40 text-[#DCFCE7] text-[11px] font-semibold cursor-pointer"
                      >
                        + {n} <X className="w-3 h-3" />
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-black/30 rounded-2xl p-3.5 border border-white/10">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#F87171] mb-1.5">
                  3. İstemediğiniz Notalar ({dislikedNotes.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {dislikedNotes.length === 0 ? (
                    <span className="text-xs text-white/50">Hariç tutulan nota yok</span>
                  ) : (
                    dislikedNotes.map((n) => (
                      <span
                        key={n}
                        onClick={() => setDislikedNotes(dislikedNotes.filter((item) => item !== n))}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EF4444]/25 border border-[#F87171]/40 text-[#FEE2E2] text-[11px] font-semibold cursor-pointer"
                      >
                        - {n} <X className="w-3 h-3" />
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* SOL PANEL: PARFÜM, NOTA VE KİŞİSELLEŞTİRME SEÇİCİLERİ */}
            <div className="lg:col-span-5 space-y-6">
              {/* ADIM 1: FRAGRANTICA PARFÜM SEÇİMİ & SERBEST EKLEME */}
              <div className="bg-white rounded-3xl p-6 border-2 border-[#F59E0B]/30 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D97706]">ADIM 1 • FRAGRANTICA ARŞİVİ</span>
                    <h2 className="font-serif-luxury text-xl font-bold text-[#1E1E1C]">Beğendiğiniz Parfümleri Seçin veya Yazın</h2>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#92400E]">{catalog.length}+ Parfüm</span>
                </div>

                {/* Cinsiyet Filtresi */}
                <div className="flex bg-[#F3EFE6] p-1 rounded-xl gap-1">
                  {['Tümü', 'Kadın', 'Erkek', 'Unisex'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setRefGenderFilter(g)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        refGenderFilter === g ? 'bg-[#1E1E1C] text-white shadow-xs' : 'text-[#78756E] hover:text-[#1E1E1C]'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>

                {/* Arama ve Anında Özel Parfüm Ekleme Kutusu */}
                <div className="space-y-2">
                  <div className="relative flex gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-[#78756E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Fragrantica'dan marka veya parfüm yazın (Örn: Dior Homme Intense)..."
                        value={refSearchQuery}
                        onChange={(e) => setRefSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && refSearchQuery.trim()) {
                            e.preventDefault();
                            handleQuickAddPerfumeFromSearch(refSearchQuery);
                          }
                        }}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#DED8CE] bg-[#FAF7F2] text-xs focus:outline-none focus:border-[#D97706]"
                      />
                    </div>
                    {refSearchQuery.trim() && (
                      <button
                        onClick={() => handleQuickAddPerfumeFromSearch(refSearchQuery)}
                        className="px-3.5 py-2 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Ekle</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-[#78756E]">
                    💡 Aradığınız parfüm listede yoksa adını yukarıya yazıp <strong>Enter</strong>&apos;a veya <strong>+ Ekle</strong> butonuna basın!
                  </p>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {catalog
                    .filter((p) => {
                      const matchesGender = refGenderFilter === 'Tümü' || p.gender === refGenderFilter;
                      const matchesSearch =
                        p.name.toLowerCase().includes(refSearchQuery.toLowerCase()) ||
                        p.fragranticaRef.toLowerCase().includes(refSearchQuery.toLowerCase()) ||
                        p.notes.some((n) => n.name.toLowerCase().includes(refSearchQuery.toLowerCase()));
                      return matchesGender && matchesSearch;
                    })
                    .map((item) => {
                      const isSelected = selectedRefIds.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedRefIds(selectedRefIds.filter((id) => id !== item.id));
                            } else {
                              setSelectedRefIds([...selectedRefIds, item.id]);
                            }
                          }}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                            isSelected
                              ? 'bg-gradient-to-r from-[#1E1E1C] to-[#3B2314] text-white border-[#F59E0B] shadow-md'
                              : 'bg-[#FAF7F2] hover:bg-[#FEF3C7]/50 border-[#E6E0D6] text-[#1E1E1C]'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold truncate">{item.fragranticaRef}</span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                  isSelected ? 'bg-[#F59E0B]/30 text-[#FDE68A]' : 'bg-[#E6E0D6] text-[#5A5751]'
                                }`}
                              >
                                {item.gender}
                              </span>
                            </div>
                            <div className={`text-[10px] truncate mt-0.5 ${isSelected ? 'text-[#FDE68A]' : 'text-[#78756E]'}`}>
                              Notalar: {item.notes.map((n) => n.name).join(', ')}
                            </div>
                          </div>
                          {isSelected ? (
                            <CheckCircle2 className="w-5 h-5 text-[#FBBF24] shrink-0" />
                          ) : (
                            <Plus className="w-4 h-4 text-[#78756E] shrink-0" />
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* ADIM 2: TÜM FRAGRANTICA NOTALARI & KENDİ NOTANI YAZ */}
              <div className="bg-white rounded-3xl p-6 border-2 border-[#F59E0B]/30 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D97706]">ADIM 2 • KOKU NOTASI ANSİKLOPEDİSİ</span>
                    <h2 className="font-serif-luxury text-xl font-bold text-[#1E1E1C]">Notaları Seçin veya Kendiniz Yazın</h2>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#92400E]">{allAvailableNotes.length}+ Nota</span>
                </div>

                {/* Sevdiğim / İstemediğim Mod Seçici */}
                <div className="flex bg-[#F3EFE6] p-1 rounded-xl gap-1">
                  <button
                    onClick={() => setNoteSelectionMode('like')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      noteSelectionMode === 'like' ? 'bg-[#4A7C59] text-white shadow-sm' : 'text-[#78756E]'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Sevdiğim Notalar ({likedNotes.length})</span>
                  </button>
                  <button
                    onClick={() => setNoteSelectionMode('dislike')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      noteSelectionMode === 'dislike' ? 'bg-[#C0392B] text-white shadow-sm' : 'text-[#78756E]'
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>İstemediğim Notalar ({dislikedNotes.length})</span>
                  </button>
                </div>

                {/* Nota Arama ve Serbest Nota Yazıp Ekleme */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-[#78756E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Nota ara veya kendi istediğin notayı yaz (Örn: Kavrulmuş Kahve, Ihlamur)..."
                        value={noteSearchQuery}
                        onChange={(e) => setNoteSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && noteSearchQuery.trim()) {
                            e.preventDefault();
                            handleQuickAddNote(noteSearchQuery);
                          }
                        }}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#DED8CE] bg-[#FAF7F2] text-xs focus:outline-none focus:border-[#D97706]"
                      />
                    </div>
                    {noteSearchQuery.trim() && (
                      <button
                        onClick={() => handleQuickAddNote(noteSearchQuery)}
                        className={`px-3.5 py-2 rounded-xl text-white text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer ${
                          noteSelectionMode === 'like' ? 'bg-[#4A7C59]' : 'bg-[#C0392B]'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Notayı Ekle</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Nota Ailesi Sekmeleri */}
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {Object.keys(FRAGRANTICA_NOTE_FAMILIES).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveNoteCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap cursor-pointer transition-all ${
                        activeNoteCategory === cat
                          ? 'bg-[#D97706] text-white shadow-xs'
                          : 'bg-[#FAF7F2] text-[#5A5751] border border-[#E6E0D6] hover:bg-[#FEF3C7]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Nota Etiketleri */}
                <div className="flex flex-wrap gap-1.5 max-h-60 overflow-y-auto p-1">
                  {displayedNotes.map((note) => {
                    const isLiked = likedNotes.includes(note);
                    const isDisliked = dislikedNotes.includes(note);
                    return (
                      <button
                        key={note}
                        onClick={() => {
                          if (noteSelectionMode === 'like') {
                            setLikedNotes(isLiked ? likedNotes.filter((n) => n !== note) : [...likedNotes, note]);
                            setDislikedNotes(dislikedNotes.filter((n) => n !== note));
                          } else {
                            setDislikedNotes(isDisliked ? dislikedNotes.filter((n) => n !== note) : [...dislikedNotes, note]);
                            setLikedNotes(likedNotes.filter((n) => n !== note));
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          isLiked
                            ? 'bg-[#4A7C59] text-white font-bold shadow-xs ring-2 ring-[#4A7C59]/30'
                            : isDisliked
                            ? 'bg-[#C0392B] text-white font-bold line-through shadow-xs'
                            : 'bg-[#FAF7F2] hover:bg-[#FEF3C7] border border-[#E6E0D6] text-[#1E1E1C]'
                        }`}
                      >
                        {isLiked && '✓ '}
                        {isDisliked && '✕ '}
                        {note}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ADIM 3: KİŞİSEL KULLANIM ÖZELLEŞTİRMELERİ */}
              <div className="bg-white rounded-3xl p-6 border-2 border-[#F59E0B]/30 shadow-md space-y-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D97706]">ADIM 3 • KİŞİSEL KOKU KARAKTERİ</span>
                  <h2 className="font-serif-luxury text-xl font-bold text-[#1E1E1C]">Kullanım Tercihlerinizi Özelleştirin</h2>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#5A5751] mb-1">Koku Cinsiyet Tercihi</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {['Tümü', 'Kadın', 'Erkek', 'Unisex'].map((val) => (
                        <button
                          key={val}
                          onClick={() => setPrefGender(val)}
                          className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                            prefGender === val ? 'bg-[#1E1E1C] text-[#FDE68A] border-[#1E1E1C]' : 'bg-[#FAF7F2] text-[#5A5751] border-[#E6E0D6]'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#5A5751] mb-1">Mevsim Tercihi</label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                      {['Tümü', 'Kış', 'Yaz', 'İlkbahar', 'Sonbahar'].map((val) => (
                        <button
                          key={val}
                          onClick={() => setPrefSeason(val)}
                          className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                            prefSeason === val ? 'bg-[#D97706] text-white border-[#D97706]' : 'bg-[#FAF7F2] text-[#5A5751] border-[#E6E0D6]'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#5A5751] mb-1">Kullanım Zamanı</label>
                      <select
                        value={prefTime}
                        onChange={(e) => setPrefTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#DED8CE] bg-[#FAF7F2] text-xs font-semibold"
                      >
                        <option value="Tümü">Tüm Zamanlar</option>
                        <option value="Gündüz">Gündüz / Ofis</option>
                        <option value="Gece">Gece / Özel Davet</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#5A5751] mb-1">Yayılım (Sillage)</label>
                      <select
                        value={prefSillage}
                        onChange={(e) => setPrefSillage(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#DED8CE] bg-[#FAF7F2] text-xs font-semibold"
                      >
                        <option value="Tümü">Fark Etmez</option>
                        <option value="Çok Yüksek">Çok Yüksek (İmza Koku)</option>
                        <option value="Yüksek">Yüksek Kalıcılık</option>
                        <option value="Orta">Orta / Ferah</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SAĞ PANEL: CANLI EŞLEŞME SONUÇLARI */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#F59E0B]/30 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6E0D6] pb-4">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#D97706]">SİZE ÖZEL FRESTIN EXTRAIT EŞLEŞMELERİ</span>
                    <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1E1E1C]">
                      Koku Profilinize En Uygun Parfümler
                    </h2>
                  </div>
                  <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] text-[#78350F] border border-[#F59E0B]/40 shrink-0">
                    {matchedPerfumes.length} Sonuç Sıralandı
                  </span>
                </div>

                <div className="space-y-5">
                  {matchedPerfumes.slice(0, 12).map((item, idx) => {
                    const selectedSize = getSelectedSize(item.id);
                    const isTopMatch = idx === 0;
                    return (
                      <div
                        key={item.id}
                        className={`p-5 sm:p-6 rounded-3xl border transition-all flex flex-col md:flex-row items-center gap-6 ${
                          isTopMatch
                            ? 'bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7]/60 to-[#FAF7F2] border-2 border-[#F59E0B] shadow-lg'
                            : 'bg-[#FAF7F2] border-[#E6E0D6] hover:border-[#D97706]/50'
                        }`}
                      >
                        <div className="w-32 shrink-0 flex flex-col items-center justify-center">
                          {isTopMatch && (
                            <span className="mb-2 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#D97706] to-[#EA580C] text-white shadow-xs">
                              ★ En İyi Eşleşme
                            </span>
                          )}
                          <RealFrestinBottleCardSVG
                            labelColor={item.bottleColor}
                            liquidTint={item.liquidColor}
                            title={item.code}
                            subLabel={item.name.slice(0, 12)}
                          />
                        </div>

                        <div className="flex-1 space-y-3 w-full">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-3 py-1 rounded-full bg-[#4A7C59] text-white font-extrabold shadow-xs">
                                %{item.calculatedMatch} Uyum
                              </span>
                              <span className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-[#E6E0D6] text-[#5A5751] font-semibold">
                                {item.gender} • {item.season || 'Dört Mevsim'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-bold text-[#1E1E1C]">
                              <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                              <span>{item.rating}</span>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-serif-luxury text-2xl font-bold text-[#1E1E1C]">{item.name}</h3>
                            <p className="text-xs text-[#78756E] mt-0.5">
                              Fragrantica Referansı: <strong className="text-[#1E1E1C]">{item.fragranticaRef}</strong>
                            </p>
                          </div>

                          {/* Notalar Gösterimi */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {item.notes.map((n) => {
                              const isHighlighted = item.matchedNotePills?.includes(n.name) || likedNotes.includes(n.name);
                              return (
                                <span
                                  key={n.name}
                                  className={`text-[11px] px-2.5 py-1 rounded-lg font-medium ${
                                    isHighlighted
                                      ? 'bg-[#D97706] text-white font-bold shadow-2xs'
                                      : 'bg-white border border-[#E6E0D6] text-[#5A5751]'
                                  }`}
                                >
                                  {isHighlighted && '★ '}
                                  {n.name}
                                </span>
                              );
                            })}
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E6E0D6]">
                            <div className="flex bg-white p-1 rounded-xl border border-[#E6E0D6]">
                              <button
                                onClick={() => setSelectedSize(item.id, '50ml')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                                  selectedSize === '50ml' ? 'bg-[#1E1E1C] text-white' : 'text-[#78756E]'
                                }`}
                              >
                                50ml ({PRICE_50ML}₺)
                              </button>
                              <button
                                onClick={() => setSelectedSize(item.id, '100ml')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                                  selectedSize === '100ml' ? 'bg-[#1E1E1C] text-white' : 'text-[#78756E]'
                                }`}
                              >
                                100ml ({PRICE_100ML}₺)
                              </button>
                            </div>
                            <button
                              onClick={() => addToCart(item, selectedSize)}
                              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#EA580C] hover:brightness-110 text-white text-xs font-extrabold flex items-center gap-2 shadow-md cursor-pointer"
                            >
                              <ShoppingBag className="w-4 h-4" />
                              <span>Sepete Ekle</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ================= STOKLU ÜRÜNLER ================= */}
      {activeTab === 'instock' && (
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <div className="bg-gradient-to-br from-[#2B4C36] via-[#3B6447] to-[#4A7C59] text-white rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-6">
            <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold max-w-2xl mx-auto">Hazır Stoklu Ürünlerimiz Shopier Mağazamızda!</h1>
            <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto">Tüm hazır stoklu parfümlerimizi Shopier üzerinden hemen inceleyebilir ve 256-bit SSL güvencesiyle sipariş verebilirsiniz.</p>
            <a href={SHOPIER_LINKS.store} target="_blank" rel="noopener noreferrer" className="inline-flex px-8 py-4 rounded-2xl bg-[#1E1E1C] text-white text-sm font-bold items-center gap-3 shadow-xl">
              <ShoppingBag className="w-5 h-5 text-[#E9C46A]" />
              <span>Shopier Mağazamıza Git</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </main>
      )}

      {/* ================= YENİ ÖZEL PARFÜM EKLEME MODALI ================= */}
      {showAddCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#E6E0D6] space-y-6 relative">
            <button onClick={() => setShowAddCustomModal(false)} className="absolute top-5 right-5 p-2 rounded-full bg-[#FAF7F2]">
              <X className="w-5 h-5" />
            </button>
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#E86F38] uppercase">FRAGRANTICA VERİTABANI EKLEME</span>
              <h3 className="font-serif-luxury text-2xl font-bold text-[#1E1E1C]">Listede Olmayan Parfümü Ekle</h3>
            </div>
            <form onSubmit={handleAddCustomPerfume} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1E1E1C] mb-1">Marka</label>
                <input type="text" placeholder="Örn: Tom Ford" value={customBrandName} onChange={(e) => setCustomBrandName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-[#DED8CE] bg-[#FAF7F2] text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1E1E1C] mb-1">Parfüm Adı *</label>
                <input type="text" required placeholder="Örn: Oud Wood" value={customFragranceName} onChange={(e) => setCustomFragranceName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-[#DED8CE] bg-[#FAF7F2] text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1E1E1C] mb-1">Cinsiyet</label>
                <select value={customGender} onChange={(e) => setCustomGender(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-[#DED8CE] bg-[#FAF7F2] text-xs">
                  <option value="Unisex">Unisex</option>
                  <option value="Erkek">Erkek</option>
                  <option value="Kadın">Kadın</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1E1E1C] mb-1">Notalar</label>
                <input type="text" placeholder="Vanilya, Odunsu Notalar" value={customNotesInput} onChange={(e) => setCustomNotesInput(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-[#DED8CE] bg-[#FAF7F2] text-xs" />
              </div>
              <button type="submit" className="w-full py-3.5 rounded-2xl bg-[#E86F38] text-white font-bold text-xs flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" /> Parfümü Listeye Ekle ve Eşleştir
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= SEPET ÇEKMECESİ ================= */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col justify-between p-6 shadow-2xl">
            <div className="space-y-6 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#E6E0D6] pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#E86F38]" />
                  <h2 className="font-serif-luxury text-2xl font-bold text-[#1E1E1C]">Sepetiniz</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-full bg-[#FAF7F2]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {cart.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <p className="text-sm font-medium text-[#78756E]">Sepetinizde ürün bulunmuyor.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.cartItemId} className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6E0D6] flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-bold text-[#1E1E1C]">{item.name}</div>
                        <div className="text-xs text-[#78756E]">{item.size} • {item.price} TL</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateCartQty(item.cartItemId, -1)} className="p-1 bg-white border border-[#E6E0D6]"><Minus className="w-3.5 h-3.5" /></button>
                        <span className="text-xs font-bold w-6 text-center">{item.qty}</span>
                        <button onClick={() => updateCartQty(item.cartItemId, 1)} className="p-1 bg-white border border-[#E6E0D6]"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="pt-6 border-t border-[#E6E0D6] space-y-4">
                <div className="flex justify-between text-sm font-bold text-[#1E1E1C]">
                  <span>Toplam:</span>
                  <span className="text-[#E86F38] text-base">{cartTotal} TL</span>
                </div>
                <a href={SHOPIER_LINKS.store} target="_blank" rel="noopener noreferrer" onClick={() => setIsCartOpen(false)} className="w-full py-3.5 rounded-2xl bg-[#4A7C59] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg">
                  <span>Shopier ile Güvenli Ödeme Yap</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#F3EFE6] border-t border-[#E6E0D6] mt-16 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78756E]">
          <div className="flex items-center gap-3">
            <FrestinBrandLogo size="sm" showText={true} />
            <div>© {new Date().getFullYear()} Frestin Perfume • Senin Kokun, Senin İmzan.</div>
          </div>
          <a href={SHOPIER_LINKS.store} target="_blank" rel="noopener noreferrer" className="text-[#4A7C59] font-bold flex items-center gap-1">
            <span>Shopier Mağazamız</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </footer>
    </div>
  );
}
