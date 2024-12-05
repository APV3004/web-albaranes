import Link from 'next/link';

// app/page.js
export default function HomePage() {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-4 text-center">Bienvenido</h2>
          <div className="text-center">
            <Link href="/login" className="text-blue-600 hover:text-blue-400 block py-2">
              Iniciar sesión
            </Link>
            <Link href="/register" className="text-blue-600 hover:text-blue-400 block py-2 mt-4">
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    );
  }
  