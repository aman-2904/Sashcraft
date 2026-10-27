import SashProductTemplate from '@/components/Sashes/SashProductTemplate';
import { velvetSashData } from '@/data/sashesData';
import { fetchProductOverride, applyOverrideToProduct } from '@/utils/productPricing';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata() {
  const override = await fetchProductOverride('velvetsashes');
  const title = override?.title?.trim() || velvetSashData.title;
  return {
    title: `${title} | SashCraft Artisanal Regalia`,
    description: velvetSashData.tagline,
  };
}

export default async function VelvetSashesPage() {
  const override = await fetchProductOverride('velvetsashes');
  const product = applyOverrideToProduct(velvetSashData, override);

  return <SashProductTemplate initialProduct={product} />;
}
