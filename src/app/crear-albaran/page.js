'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateDeliveryNotePage() {
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [newDeliveryNote, setNewDeliveryNote] = useState({
    clientId: '',
    projectId: '',
    format: 'material',
    material: '',
    hours: 0,
    description: '',
    workdate: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchClientsAndProjects = async () => {
      try {
        const [clientsRes, projectsRes] = await Promise.all([
          fetch('https://bildy-rpmaya.koyeb.app/api/client', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('https://bildy-rpmaya.koyeb.app/api/project', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!clientsRes.ok || !projectsRes.ok) {
          throw new Error('Error al cargar datos');
        }

        const [clientsData, projectsData] = await Promise.all([
          clientsRes.json(),
          projectsRes.json(),
        ]);

        setClients(clientsData);
        setProjects(projectsData);
      } catch (err) {
        setError(err.message || 'Error al cargar datos');
      }
    };

    fetchClientsAndProjects();
  }, [router]);

  const handleCreateDeliveryNote = async (e) => {
    e.preventDefault();
    const { clientId, projectId, format, description, workdate } = newDeliveryNote;

    if (!clientId || !projectId || !format || !description || !workdate) {
      setError('Completa todos los campos obligatorios!');
      return;
    }

    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/deliverynote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newDeliveryNote),
      });

      if (!response.ok) {
        throw new Error('Error al crear el albarán');
      }

      setSuccessMessage('Albarán creado con éxito');
      setTimeout(() => router.push('/albaranes'), 2000);
    } catch (err) {
      setError(err.message || 'Error al crear el albarán');
    }
  };

  const filteredProjects = projects.filter(
    (project) => project.clientId === newDeliveryNote.clientId
  );

  return (
    <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">Crear Albarán</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

      <form onSubmit={handleCreateDeliveryNote} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Cliente</label>
          <select
            value={newDeliveryNote.clientId}
            onChange={(e) =>
              setNewDeliveryNote({ ...newDeliveryNote, clientId: e.target.value, projectId: '' })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Seleccionar Cliente</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Proyecto</label>
          <select
            value={newDeliveryNote.projectId}
            onChange={(e) =>
              setNewDeliveryNote({ ...newDeliveryNote, projectId: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Seleccionar Proyecto</option>
            {filteredProjects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Formato</label>
          <select
            value={newDeliveryNote.format}
            onChange={(e) =>
              setNewDeliveryNote({ ...newDeliveryNote, format: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="material">Material</option>
            <option value="hours">Horas</option>
          </select>
        </div>

        {newDeliveryNote.format === 'material' && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">Material</label>
            <input
              type="text"
              value={newDeliveryNote.material}
              onChange={(e) =>
                setNewDeliveryNote({ ...newDeliveryNote, material: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        )}

        {newDeliveryNote.format === 'hours' && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">Horas</label>
            <input
              type="number"
              value={newDeliveryNote.hours || 0}
              onChange={(e) =>
                setNewDeliveryNote({
                  ...newDeliveryNote,
                  hours: parseInt(e.target.value, 10) || 0,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-gray-700 font-medium mb-2">Descripción</label>
          <input
            type="text"
            value={newDeliveryNote.description}
            onChange={(e) =>
              setNewDeliveryNote({ ...newDeliveryNote, description: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Fecha de Trabajo</label>
          <input
            type="date"
            value={newDeliveryNote.workdate}
            onChange={(e) =>
              setNewDeliveryNote({ ...newDeliveryNote, workdate: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => router.push('/albaranes')}
            className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}