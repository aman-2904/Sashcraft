import SashProductTemplate from '@/components/Sashes/SashProductTemplate';
import { velvetSashData } from '@/data/sashesData';

export const metadata = {
  title: 'Royal Velvet Sashes | SashCraft Artisanal Regalia',
  description: 'Handcrafted 380 GSM plush royal micro-velvet ceremonial stoles and sashes with metallic gold lace and tassels.',
};

export default function VelvetSashesPage() {
  return <SashProductTemplate initialProduct={velvetSashData} />;
}
