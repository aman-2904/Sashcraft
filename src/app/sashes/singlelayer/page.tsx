import SashProductTemplate from '@/components/Sashes/SashProductTemplate';
import { singleLayerSashData } from '@/data/sashesData';

export const metadata = {
  title: 'Single Layer Heavy Fabric Sashes | SashCraft Artisanal Regalia',
  description: 'Precision-tailored 280 GSM wrinkle-free heavy matte weave ceremonial graduation stoles with chevron ends and lace options.',
};

export default function SingleLayerSashesPage() {
  return <SashProductTemplate initialProduct={singleLayerSashData} />;
}
