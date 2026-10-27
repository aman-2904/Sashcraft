import SashProductTemplate from '@/components/Sashes/SashProductTemplate';
import { doubleLayerSashData } from '@/data/sashesData';
import { fetchProductOverride, applyOverrideToProduct } from '@/utils/productPricing';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata() {
  const override = await fetchProductOverride('doublelayer');
  const title = override?.title?.trim() || doubleLayerSashData.title;
  return {
    title: `${title} | SashCraft Artisanal Regalia`,
    description: doubleLayerSashData.tagline,
  };
}

export default async function DoubleLayerSashesPage() {
  const override = await fetchProductOverride('doublelayer');
  const product = applyOverrideToProduct(doubleLayerSashData, override);

  return <SashProductTemplate initialProduct={product} />;
}
