export default async function handler(req, res) {
  const token = process.env.SHOPIER_API_TOKEN || req.headers.authorization?.replace('Bearer ', '');
  
  // Eğer API Token tanımlıysa Resmi Shopier API v1'den gerçek zamanlı stok çek
  if (token) {
    try {
      const response = await fetch('https://api.shopier.com/v1/products?limit=50', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        const products = data.map((p) => ({
          id: `shopier-${p.id}`,
          shopierId: String(p.id),
          title: p.title,
          price: Number(p.priceData?.price || p.price || 860),
          stockCount: Number(p.stockQuantity ?? p.stock ?? 1),
          inStock: Number(p.stockQuantity ?? p.stock ?? 1) > 0 && p.stockStatus !== 'outOfStock',
          url: p.url || `https://www.shopier.com/frestinperfumes/${p.id}`
        }));
        return res.status(200).json({ source: 'shopier-api', products });
      }
    } catch (e) {}
  }

  return res.status(200).json({ source: 'storefront', products: [] });
}
