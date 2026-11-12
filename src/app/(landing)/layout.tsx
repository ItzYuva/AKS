import PreLoader from '@/app/components/PreLoader';
import LandingNavbar from '@/components/landing/LandingNavbar';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PreLoader />
      <LandingNavbar />
      <main className="pt-16">{children}</main>
    </>
  );
}
