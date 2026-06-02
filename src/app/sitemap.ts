import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { SitemapProductApiServer } from '@/Api/controllers/ProductController';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const headersList = await headers();
    const host = headersList.get('host') || 'zmrelektronik.com';
    const protocol = headersList.get('x-forwarded-proto') || 'https';
    const baseUrl = `${protocol}://${host}`;

    let productRoutes: MetadataRoute.Sitemap = [];
    try {
        // Yeni özel sitemap API'sini kullanıyoruz (sayfalamasız, tüm ürünleri döner)
        const productRes = await SitemapProductApiServer();
        const products = Array.isArray(productRes.data) ? productRes.data : (productRes.data?.data || []);
        
        productRoutes = products.map((product: any) => ({
            url: `${baseUrl}/product/${product.productUrl}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.7,
        }));
    } catch (error) {
        console.error('Sitemap product fetch error:', error);
    }

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/faq`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        ...productRoutes,
    ];
}

