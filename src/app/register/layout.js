'use client';  // Asegura que este componente se ejecute en el cliente

import '../../styles/tailwind.css';  // Asegúrate de que el archivo CSS esté importado correctamente

export default function RegisterLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Solo mostramos el contenido principal */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
