import SashProductTemplate from '@/components/Sashes/SashProductTemplate';
import { satinSashData } from '@/data/sashesData';

export const metadata = {
  title: 'Imperial Satin Sashes | SashCraft Artisanal Regalia',
  description: 'Handcrafted bridal-grade satin graduation and ceremonial sashes with choice of tailored hem or royal gold lace.',
};

export default function SatinSashesPage() {
  return <SashProductTemplate initialProduct={satinSashData} />;
}
