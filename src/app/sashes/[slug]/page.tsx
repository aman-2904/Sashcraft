import { notFound } from 'next/navigation';
import SashProductTemplate from '@/components/Sashes/SashProductTemplate';
import { sashesCatalog } from '@/data/sashesData';
import { fetchProductOverride, applyOverrideToProduct } from '@/utils/productPricing';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface SashPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: SashPageProps) {
  const { slug } = await params;
  const baseProduct = sashesCatalog[slug];
  if (!baseProduct) return { title: 'Product Not Found | SashCraft' };

  const override = await fetchProductOverride(slug);
  const title = override?.title?.trim() || baseProduct.title;

  return {
    title: `${title} | SashCraft Artisanal Regalia`,
    description: baseProduct.tagline,
  };
}

export async function generateStaticParams() {
  return [
    { slug: 'satinsashes' },
    { slug: 'velvetsashes' },
    { slug: 'doublelayer' },
    { slug: 'singlelayer' },
  ];
}

export default async function DynamicSashPage({ params }: SashPageProps) {
  const { slug } = await params;
  const baseProduct = sashesCatalog[slug];

  if (!baseProduct) {
    notFound();
  }

  const override = await fetchProductOverride(slug);
  const product = applyOverrideToProduct(baseProduct, override);

  return <SashProductTemplate initialProduct={product} />;
}
