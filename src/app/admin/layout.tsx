import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SashCraft Admin Console | Supreme Executive Portal',
  description: 'Supabase-authenticated admin management dashboard and pricing control center for SashCraft.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-[#090c13] text-gray-100 overflow-y-auto flex flex-col selection:bg-amber-500 selection:text-black">
      {children}
    </div>
  );
}
