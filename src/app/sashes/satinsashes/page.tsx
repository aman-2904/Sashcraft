import SashProductTemplate from '@/components/Sashes/SashProductTemplate';
import { satinSashData } from '@/data/sashesData';
import { fetchProductOverride, applyOverrideToProduct } from '@/utils/productPricing';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata() {
  const override = await fetchProductOverride('satinsashes');
  const title = override?.title?.trim() || satinSashData.title;
  return {
    title: `${title} | SashCraft Artisanal Regalia`,
    description: satinSashData.tagline,
  };
}

export default async function SatinSashesPage() {
  const override = await fetchProductOverride('satinsashes');
  const product = applyOverrideToProduct(satinSashData, override);

  return <SashProductTemplate initialProduct={product} />;
}
