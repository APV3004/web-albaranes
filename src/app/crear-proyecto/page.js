'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CreateProjectPage() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [name, setName] = useState('');
  const [projectCode, setProjectCode] = useState('');
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [projectStreet, setProjectStreet] = useState('');
  const [projectPostal, setProjectPostal] = useState('');
  const [projectCity, setProjectCity] = useState('');
  const [projectProvince, setProjectProvince] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

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

        const clientId = searchParams.get('clientId');
        if (clientId) {
          const client = data.find((c) => c._id === clientId);
          if (client) {
            setSelectedClient(client);
            setClientAddress(`${client.address?.street || ''}, ${client.address?.city || ''}, ${client.address?.province || ''}, ${client.address?.postal || ''}`);
          }
        }
      } catch (err) {
        setError(err.message || 'Hubo un problema al cargar los clientes');
      }
    };

    fetchClients();
  }, [router, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !projectCode || !code || !selectedClient) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const projectData = {
      name,
      projectCode,
      code,
      email,
      projectAddress: {
        street: projectStreet,
        postal: projectPostal,
        city: projectCity,
        province: projectProvince,
      },
      clientId: selectedClient._id,
    };

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No estás autenticado. Inicia sesión para continuar.');
        return;
      }

      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error('No se pudo crear el proyecto.');
      }

      setSuccessMessage('Proyecto creado exitosamente');
    } catch (err) {
      setError(err.message || 'Hubo un problema al crear el proyecto.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Crear Proyecto</h1>
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Proyecto creado exitosamente</h2>
            <div className="flex justify-center">
              <button
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                onClick={() => router.push('/proyectos')}
              >
                Ir a la Lista de Proyectos
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Seleccionar Cliente</label>
          <select
            value={selectedClient?._id || ''}
            onChange={(e) => {
              const client = clients.find((client) => client._id === e.target.value);
              setSelectedClient(client);
              setClientAddress(
                `${client.address?.street || ''}, ${client.address?.city || ''}, ${client.address?.province || ''}, ${client.address?.postal || ''}`
              );
            }}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="" disabled>
              Selecciona un cliente
            </option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Dirección del Cliente</label>
          <p className="mt-1 text-gray-500">{clientAddress || 'No hay dirección asociada al cliente seleccionado'}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Código del Proyecto</label>
          <input
            type="text"
            value={projectCode}
            onChange={(e) => setProjectCode(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Ejemplo: 001"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Código Interno</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Código Interno"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre del Proyecto</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Dirección del Proyecto</label>
          <input
            type="text"
            value={projectStreet}
            onChange={(e) => setProjectStreet(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Calle del Proyecto"
          />
          <div className="flex space-x-4 mt-2">
            <input
              type="text"
              value={projectPostal}
              onChange={(e) => setProjectPostal(e.target.value)}
              className="mt-1 block w-1/3 px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Código Postal"
            />
            <input
              type="text"
              value={projectCity}
              onChange={(e) => setProjectCity(e.target.value)}
              className="mt-1 block w-1/3 px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Ciudad"
            />
            <input
              type="text"
              value={projectProvince}
              onChange={(e) => setProjectProvince(e.target.value)}
              className="mt-1 block w-1/3 px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Provincia"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Crear Proyecto
          </button>
        </div>
      </form>
    </div>
  );
}