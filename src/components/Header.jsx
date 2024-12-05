'use client';  // Asegura que este componente se ejecute en el cliente

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
  const pathname = usePathname();  // Obtenemos la ruta actual
  let pageTitle = '';  // Variable para almacenar el título dinámico

  // Dependiendo de la ruta actual, asignamos el título adecuado
  if (pathname === '/clientes') {
    pageTitle = 'Clientes';
  } else if (pathname === '/crear-cliente') {
    pageTitle = 'Crear Cliente';
  } 

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="flex items-center">
        {/* Envolvemos el nombre de la aplicación en un Link para que redirija a la página principal */}
        <h1 className="text-3xl">
          <Link href="/" className="hover:text-gray-200">Mi Aplicación</Link>
        </h1>

        {/* Título dinámico que se alinea justo después de la barra lateral */}
        <h2 className="text-xl ml-16">{pageTitle}</h2>  {/* ml-64 para alinear con el final de la barra lateral */}
      </div>
    </header>
  );
}
