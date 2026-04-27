import { Header } from './Header';
import { Footer } from './Footer';
import { Outlet } from 'react-router-dom';

export const AppShell = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-950 font-sans text-gray-100">
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
