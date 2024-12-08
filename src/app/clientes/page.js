'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('https://bildy-rpmaya.koyeb.app/api/client', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('No se pudieron cargar los clientes');
        }

        const data = await response.json();
        setClients(data);
        setFilteredClients(data);
      } catch (err) {
        setError(err.message || 'Error al obtener los clientes');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [router]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredClients(clients);
    } else {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = clients.filter((client) =>
        client.name.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredClients(filtered);
    }
  };

  const handleEditClient = (clientId) => {
    router.push(`/clientes/${clientId}`);
  };

  const handleDeleteClient = async (clientId) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este cliente?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/client/${clientId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('No se pudo eliminar el cliente');
      }

      setClients(clients.filter((client) => client._id !== clientId));
      setFilteredClients(filteredClients.filter((client) => client._id !== clientId));
      alert('Cliente eliminado exitosamente');
      setSelectedClient(null);
    } catch (err) {
      alert(err.message || 'Hubo un problema al eliminar el cliente');
    }
  };

  if (loading) return <p className="text-center text-xl text-blue-500">Cargando...</p>;
  if (error) return <p className="text-red-500 text-center text-xl">{error}</p>;

  return (
    <div className="container mx-auto p-6 flex">
      {/* Lista de Clientes - Parte Izquierda */}
      <div className="w-1/3 bg-white rounded-lg shadow-md p-4 mr-4">
        <h2 className="text-2xl font-bold mb-4">Lista de Clientes</h2>

        {/* Barra de Búsqueda */}
        <input
          type="text"
          placeholder="Buscar cliente por nombre..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
        />

        {filteredClients.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600 mb-4">No se encontraron clientes.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {filteredClients.map((client) => (
              <li key={client._id || client.id} className="flex items-center justify-between border-b pb-2">
                <span className="font-medium">{client.name}</span>
                <button
                  className="text-blue-600 hover:text-blue-800 underline"
                  onClick={() => setSelectedClient(client)}
                >
                  Ver Detalles
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Detalles del Cliente - Parte Derecha */}
      {selectedClient && (
        <div className="w-2/3 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Detalles del Cliente</h2>
          <p><strong>Nombre:</strong> {selectedClient.name}</p>
          <p><strong>CIF:</strong> {selectedClient.cif}</p>
          <p>
            <strong>Dirección:</strong> {[
              selectedClient.address.street,
              selectedClient.address.number,
              selectedClient.address.postal,
              selectedClient.address.city,
              selectedClient.address.province,
            ]
              .filter(Boolean)
              .join(', ')}
          </p>

          {/* Botones de Editar y Eliminar */}
          <div className="mt-4 flex space-x-4">
            <button
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              onClick={() => handleEditClient(selectedClient._id || selectedClient.id)}
            >
              Editar
            </button>
            <button
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
              onClick={() => handleDeleteClient(selectedClient._id || selectedClient.id)}
            >
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}