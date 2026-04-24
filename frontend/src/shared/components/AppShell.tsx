import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';

export const AppShell = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 font-sans text-gray-900">
      <Header />

      <main className="flex-grow pb-12 pt-24">
        <div className="container mx-auto px-4">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};
