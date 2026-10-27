import SashProductTemplate from '@/components/Sashes/SashProductTemplate';
import { singleLayerSashData } from '@/data/sashesData';
import { fetchProductOverride, applyOverrideToProduct } from '@/utils/productPricing';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata() {
  const override = await fetchProductOverride('singlelayer');
  const title = override?.title?.trim() || singleLayerSashData.title;
  return {
    title: `${title} | SashCraft Artisanal Regalia`,
    description: singleLayerSashData.tagline,
  };
}

export default async function SingleLayerSashesPage() {
  const override = await fetchProductOverride('singlelayer');
  const product = applyOverrideToProduct(singleLayerSashData, override);

  return <SashProductTemplate initialProduct={product} />;
}
