import './globals.css';
import Sidebar from '../components/Sidebar';

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
      <body>
        <div className="flex">
          <Sidebar />
          <main className="flex-grow p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
