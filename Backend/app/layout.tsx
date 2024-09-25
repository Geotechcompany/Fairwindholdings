import './globals.css';

export const metadata = {
  title: 'Dashboard',
  description: 'Trading dashboard with stats and account summary',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}