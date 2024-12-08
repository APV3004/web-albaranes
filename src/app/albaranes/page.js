'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeliveryNotesPage() {
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDeliveryNotes, setFilteredDeliveryNotes] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          router.push('/login');
          return;
        }

        // Fetch delivery notes
        const deliveryNotesResponse = await fetch('https://bildy-rpmaya.koyeb.app/api/deliverynote', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!deliveryNotesResponse.ok) throw new Error('Error al cargar los albaranes');
        const deliveryNotesData = await deliveryNotesResponse.json();
        setDeliveryNotes(deliveryNotesData);
        setFilteredDeliveryNotes(deliveryNotesData);

        // Fetch clients
        const clientsResponse = await fetch('https://bildy-rpmaya.koyeb.app/api/client', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!clientsResponse.ok) throw new Error('Error al cargar los clientes');
        const clientsData = await clientsResponse.json();
        setClients(clientsData);

        // Fetch projects
        const projectsResponse = await fetch('https://bildy-rpmaya.koyeb.app/api/project', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!projectsResponse.ok) throw new Error('Error al cargar los proyectos');
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);
      } catch (err) {
        setError(err.message || 'Error al obtener los datos');
      }
    };

    fetchData();
  }, [router]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredDeliveryNotes(deliveryNotes);
    } else {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = deliveryNotes.filter((note) => {
        const clientName = getClientName(note.clientId).toLowerCase();
        const projectName = getProjectName(note.projectId).toLowerCase();
        const description = note.description.toLowerCase();
        return (
          clientName.includes(lowerCaseQuery) ||
          projectName.includes(lowerCaseQuery) ||
          description.includes(lowerCaseQuery)
        );
      });
      setFilteredDeliveryNotes(filtered);
    }
  };

  const getClientName = (clientId) => {
    const client = clients.find((c) => c._id === clientId);
    return client ? client.name : 'Cliente desconocido';
  };

  const getProjectName = (projectId) => {
    if (!projectId || typeof projectId !== 'object') return 'Proyecto desconocido';
    const project = projects.find((p) => p._id === projectId._id || p._id === projectId);
    return project ? project.name : 'Proyecto desconocido';
  };

  const handleDeleteDeliveryNote = async (noteId) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este albarán?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/deliverynote/${noteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Error al eliminar el albarán');

      setDeliveryNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
      setFilteredDeliveryNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
      alert('Albarán eliminado con éxito');
    } catch (err) {
      setError(err.message || 'Error al eliminar el albarán');
    }
  };

  const handlePrintPDF = async (noteId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/deliverynote/pdf/${noteId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Error al generar el PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `albaran_${noteId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'Error al generar el PDF');
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">Gestión de Albaranes</h1>

      {/* Barra de Búsqueda */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por cliente, proyecto o descripción..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-400"
        />
      </div>

      {filteredDeliveryNotes.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No se encontraron albaranes.</p>
      ) : (
        <table className="min-w-full border-collapse border border-gray-300 rounded-lg shadow">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="px-4 py-2 border-b">Cliente</th>
              <th className="px-4 py-2 border-b">Proyecto</th>
              <th className="px-4 py-2 border-b">Descripción</th>
              <th className="px-4 py-2 border-b">Fecha</th>
              <th className="px-4 py-2 border-b">Formato</th>
              <th className="px-4 py-2 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeliveryNotes.map((note) => (
              <tr
                key={note._id}
                className="even:bg-gray-100 hover:bg-gray-200 transition duration-200"
              >
                <td className="px-4 py-2 border-b text-gray-700">{getClientName(note.clientId)}</td>
                <td className="px-4 py-2 border-b text-gray-700">{getProjectName(note.projectId)}</td>
                <td className="px-4 py-2 border-b text-gray-700">{note.description}</td>
                <td className="px-4 py-2 border-b text-gray-700">{note.workdate}</td>
                <td className="px-4 py-2 border-b text-gray-700 capitalize">{note.format}</td>
                <td className="px-4 py-2 border-b text-center space-y-2">
                  <button
                    onClick={() => handlePrintPDF(note._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200"
                  >
                    Imprimir PDF
                  </button>
                  <button
                    onClick={() => handleDeleteDeliveryNote(note._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200"
                  >
                    Eliminar
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