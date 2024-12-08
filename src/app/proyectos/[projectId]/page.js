'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditProjectPage() {
  const [clients, setClients] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();
  const { projectId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          router.push('/login');
          return;
        }

        const projectResponse = await fetch(`https://bildy-rpmaya.koyeb.app/api/project/one/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!projectResponse.ok) {
          throw new Error('No se pudieron cargar los detalles del proyecto');
        }
        const projectData = await projectResponse.json();
        setProject(projectData);

        const clientsResponse = await fetch('https://bildy-rpmaya.koyeb.app/api/client', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!clientsResponse.ok) {
          throw new Error('No se pudieron cargar los clientes');
        }
        const clientsData = await clientsResponse.json();
        setClients(clientsData);
      } catch (err) {
        setError(err.message || 'Hubo un problema al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, projectId]);

  const handleInputChange = (field, value) => {
    setProject((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field, value) => {
    setProject((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No estás autenticado. Inicia sesión para continuar.');
        return;
      }

      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/project/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(project),
      });

      if (!response.ok) {
        throw new Error('No se pudo actualizar el proyecto.');
      }

      setShowConfirmation(true);

      // Redirige a la página de proyectos después de 2 segundos
      setTimeout(() => {
        setShowConfirmation(false);
        router.push('/proyectos');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Hubo un problema al actualizar el proyecto.');
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Editar Proyecto</h1>

      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Cambios guardados exitosamente</h2>
            <p>Redirigiendo a la lista de proyectos...</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre del Proyecto</label>
          <input
            type="text"
            value={project.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Código del Proyecto</label>
          <input
            type="text"
            value={project.projectCode || ''}
            onChange={(e) => handleInputChange('projectCode', e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Código Interno</label>
          <input
            type="text"
            value={project.code || ''}
            onChange={(e) => handleInputChange('code', e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <input
            type="email"
            value={project.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Dirección del Proyecto</label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={project.address?.street || ''}
              onChange={(e) => handleAddressChange('street', e.target.value)}
              placeholder="Calle"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={project.address?.postal || ''}
              onChange={(e) => handleAddressChange('postal', e.target.value)}
              placeholder="Código Postal"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={project.address?.city || ''}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              placeholder="Ciudad"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={project.address?.province || ''}
              onChange={(e) => handleAddressChange('province', e.target.value)}
              placeholder="Provincia"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Cliente Asociado</label>
          <select
            value={project.clientId || ''}
            onChange={(e) => handleInputChange('clientId', e.target.value)}
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
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}