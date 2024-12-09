'use client'; 

import '../../styles/tailwind.css'; 

export default function ConfirmacionLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Solo mostramos el contenido principal */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
