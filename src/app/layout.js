'use client'; 

import { usePathname } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Barralateral from '../components/Barralateral';
import '../styles/tailwind.css'; 

export default function RootLayout({ children }) {
  const pathname = usePathname();  
  const noSidebarRoutes = ['/', '/login', '/register', '/confirmacion'];  // Rutas donde no se muestra la barra lateral

  // Determina si debe mostrar la barra lateral
  const showSidebar = !noSidebarRoutes.includes(pathname);

  return (
    <html lang="es">
      <body className="font-sans bg-background flex flex-col min-h-screen">
        {/* Siempre se muestra el Header */}
        <Header />

        <div className="flex flex-1">
          {/* Muestra la barra lateral solo si la ruta no está en las excepciones */}
          {showSidebar && <Barralateral />}

          {/* El contenido principal */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>

        {/* Siempre se muestra el Footer */}
        <Footer />
      </body>
    </html>
  );
}
