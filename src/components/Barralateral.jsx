import { useRouter, usePathname } from 'next/navigation';

export default function Barralateral() {
  const router = useRouter();
  const pathname = usePathname(); // Obtener la ruta actual

  // Determinar el texto y la redirección según la página actual
  let buttonText = 'Añadir';
  let buttonAction = '/clientes/crear-cliente';

  if (pathname.includes('/proyectos')) {
    buttonText = 'Añadir Proyecto';
    buttonAction = '/crear-proyecto';
  } else if (pathname.includes('/albaranes')) {
    buttonText = 'Añadir Albarán';
    buttonAction = '/crear-albaran';
  } else if (pathname.includes('/clientes')) {
    buttonText = 'Añadir Cliente';
    buttonAction = '/crear-cliente';
  }

  // No mostrar el botón si estamos en una página de creación o edición
  const hideButton =
    pathname === '/crear-cliente' || 
    pathname.match(/\/clientes\/[^/]+$/) ||
    pathname === '/crear-proyecto' || 
    pathname.match(/\/proyectos\/[^/]+$/) ||
    pathname === '/crear-albaran'; 

  return (
    <aside className="bg-blue-600 text-white w-64 min-h-screen p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold">Menú</h2>
        <ul className="mt-4 space-y-2">
          <li>
            <a href="/clientes" className="text-lg hover:text-light">Clientes</a>
          </li>
          <li>
            <a href="/proyectos" className="text-lg hover:text-light">Proyectos</a>
          </li>
          <li>
            <a href="/albaranes" className="text-lg hover:text-light">Albaranes</a>
          </li>
        </ul>
      </div>
      {/* Botón dinámico */}
      {!hideButton && (
        <div className="mt-auto flex flex-col items-center">
          <div className="w-full bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
            <button
              onClick={() => router.push(buttonAction)}
              className="w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700"
              title={buttonText} // Tooltip para mayor accesibilidad
            >
              <span className="text-2xl font-bold">+</span>
            </button>
            <p className="text-sm mt-2 text-blue-600 font-medium">{buttonText}</p>
          </div>
        </div>
      )}
    </aside>
  );
}