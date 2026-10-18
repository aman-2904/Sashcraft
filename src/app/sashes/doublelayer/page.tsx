import SashProductTemplate from '@/components/Sashes/SashProductTemplate';
import { doubleLayerSashData } from '@/data/sashesData';

export const metadata = {
  title: 'Double Layer Heavy Fabric Sashes | SashCraft Artisanal Regalia',
  description: 'Dual-faced 350 GSM architectural twill fabric ceremonial stoles with contrast reveal and golden lace options.',
};

export default function DoubleLayerSashesPage() {
  return <SashProductTemplate initialProduct={doubleLayerSashData} />;
}
