import { Footer, TopNavigation } from '@/components/common';

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TopNavigation />
      {children}
      <Footer />
    </>
  );
}
