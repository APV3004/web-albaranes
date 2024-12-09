'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditClientPage() {
  const [client, setClient] = useState(null);
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [postal, setPostal] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [cif, setCif] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { clientId } = useParams();

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/client/${clientId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('No se pudo cargar la información del cliente');
        }

        const data = await response.json();
        setClient(data);
        setName(data.name);
        setStreet(data.address.street.split(', ')[0]);
        setNumber(data.address.street.split(', ')[1]);
        setPostal(data.address.postal);
        setCity(data.address.city);
        setProvince(data.address.province);
        setCif(data.cif);
      } catch (err) {
        setError(err.message || 'Hubo un problema al cargar la información del cliente');
      }
    };

    fetchClientData();
  }, [clientId, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !street || !number || !postal || !city || !province || !cif) {
      setError('Por favor, llena todos los campos obligatorios');
      return;
    }

    const updatedClientData = {
      name,
      cif,
      address: {
        street: `${street}, ${number}`,
        postal,
        city,
        province,
      },
    };

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No estás autenticado. Inicia sesión para continuar.');
        return;
      }

      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/client/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedClientData),
      });

      if (!response.ok) {
        throw new Error('No se pudo actualizar el cliente');
      }

      setShowModal(true); 
    } catch (err) {
      setError(err.message || 'Hubo un problema al actualizar el cliente');
    }
  };

  if (!client) {
    return <p className="text-center text-xl text-blue-500">Cargando...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Editar Cliente</h1>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="flex justify-center gap-6">
        <div className="w-full sm:w-2/3 lg:w-3/4 bg-gray-50 p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nombre del Cliente</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Dirección Fiscal</label>
            <div className="flex space-x-4">
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Calle"
                required
              />
              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Número"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Código Postal</label>
            <input
              type="text"
              value={postal}
              onChange={(e) => setPostal(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Ciudad</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Provincia</label>
            <input
              type="text"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">CIF</label>
            <input
              type="text"
              value={cif}
              onChange={(e) => setCif(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500 mr-4"
              onClick={() => router.push('/clientes')}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </form>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Cliente actualizado exitosamente</h2>
            <div className="flex space-x-4 justify-center">
              <button
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                onClick={() => router.push('/clientes')}
              >
                Volver a la Lista
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}