import { notFound } from 'next/navigation';
import SashProductTemplate from '@/components/Sashes/SashProductTemplate';
import { sashesCatalog } from '@/data/sashesData';

interface SashPageProps {
  params: Promise<{
    slug: string;
  }>;
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
  const product = sashesCatalog[slug];

  if (!product) {
    notFound();
  }

  return <SashProductTemplate initialProduct={product} />;
}
