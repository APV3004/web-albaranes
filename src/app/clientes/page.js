'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Verificar si el token está almacenado
        if (!token) {
          router.push('/login'); // Redirigir si no hay token
          return;
        }

        const response = await fetch('https://bildy-rpmaya.koyeb.app/api/client', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('No se pudieron cargar los clientes');
        }

        const data = await response.json();
        setClients(data);
      } catch (err) {
        setError(err.message || 'Error al obtener los clientes');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [router]);

  if (loading) return <p className="text-center text-xl text-blue-500">Cargando...</p>;
  if (error) return <p className="text-red-500 text-center text-xl">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">Lista de Clientes</h1>

      {clients.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">Aún no tienes clientes registrados.</p>
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => router.push('/crear-cliente')}
          >
            Crear mi primer cliente
          </button>
        </div>
      ) : (
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Nombre</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Correo</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Teléfono</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{client.name}</td>
                <td className="px-4 py-2">{client.email}</td>
                <td className="px-4 py-2">{client.phone}</td>
                <td className="px-4 py-2">
                  <button
                    className="text-blue-600 hover:text-blue-800 underline"
                    onClick={() => router.push(`/clients/${client.id}`)}
                  >
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
