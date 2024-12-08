'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          router.push('/login');
          return;
        }

        // Fetch clients
        const clientsResponse = await fetch('https://bildy-rpmaya.koyeb.app/api/client', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!clientsResponse.ok) throw new Error('No se pudieron cargar los clientes');
        const clientsData = await clientsResponse.json();
        setClients(clientsData);

        // Fetch projects
        const projectsResponse = await fetch('https://bildy-rpmaya.koyeb.app/api/project', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!projectsResponse.ok) throw new Error('No se pudieron cargar los proyectos');
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);
        setFilteredProjects(projectsData);

        // Fetch delivery notes
        const deliveryNotesResponse = await fetch('https://bildy-rpmaya.koyeb.app/api/deliverynote', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!deliveryNotesResponse.ok) throw new Error('No se pudieron cargar los albaranes');
        const notesData = await deliveryNotesResponse.json();
        setDeliveryNotes(notesData);
      } catch (err) {
        setError(err.message || 'Hubo un problema al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredProjects(projects);
    } else {
      const lowerCaseQuery = query.toLowerCase();
      setFilteredProjects(
        projects.filter((project) =>
          project.name.toLowerCase().includes(lowerCaseQuery)
        )
      );
    }
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
  };

  const getDeliveryNotesForProject = (projectId, clientId) => {
    return deliveryNotes.filter((note) => {
      const noteProjectId = typeof note.projectId === 'object' ? note.projectId._id : note.projectId;
      const noteClientId = typeof note.clientId === 'object' ? note.clientId._id : note.clientId;
      return noteProjectId === projectId && noteClientId === clientId;
    });
  };

  const handleEditProject = (projectId) => {
    router.push(`/proyectos/${projectId}`);
  };

  const handleDeleteProject = async (projectId) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este proyecto?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/project/${projectId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('No se pudo eliminar el proyecto');

      setProjects(projects.filter((project) => project._id !== projectId));
      setFilteredProjects(filteredProjects.filter((project) => project._id !== projectId));
      setSelectedProject(null);
    } catch (err) {
      alert(err.message || 'Hubo un problema al eliminar el proyecto');
    }
  };

  if (loading) return <p className="text-center text-xl text-blue-500">Cargando...</p>;
  if (error) return <p className="text-red-500 text-center text-xl">{error}</p>;

  return (
    <div className="container mx-auto p-6 flex">
      {/* Lista de Proyectos y Barra de Búsqueda - Parte Izquierda */}
      <div className="w-1/3 bg-white rounded-lg shadow-md p-4 mr-4">
        <h2 className="text-2xl font-bold mb-4">Lista de Proyectos</h2>
        <input
          type="text"
          placeholder="Buscar proyecto..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
        />
        {filteredProjects.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600 mb-4">No se encontraron proyectos.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {filteredProjects.map((project) => (
              <li key={project._id} className="flex items-center justify-between border-b pb-2">
                <span className="font-medium">{project.name}</span>
                <button
                  className="text-blue-600 hover:text-blue-800 underline"
                  onClick={() => handleSelectProject(project)}
                >
                  Ver Detalles
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Detalles del Proyecto y Albaranes - Parte Derecha */}
      {selectedProject && (
        <div className="w-2/3 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Detalles del Proyecto</h2>
          <p><strong>Nombre:</strong> {selectedProject.name}</p>
          <p><strong>Código del Proyecto:</strong> {selectedProject.projectCode}</p>
          <p><strong>Código Interno:</strong> {selectedProject.code}</p>
          <p>
            <strong>Dirección:</strong> {[
              selectedProject.address?.street,
              selectedProject.address?.postal,
              selectedProject.address?.city,
              selectedProject.address?.province,
            ].filter(Boolean).join(', ') || 'Sin dirección'}
          </p>
          <p><strong>Email:</strong> {selectedProject.email || 'Sin email'}</p>

          {/* Información del Cliente Asociado */}
          {selectedProject.clientId && (
            <>
              <h3 className="text-xl font-bold mt-4">Cliente Asociado</h3>
              {clients.length > 0 ? (
                (() => {
                  const client = clients.find((c) => c._id === selectedProject.clientId);
                  return client ? (
                    <>
                      <p><strong>Nombre:</strong> {client.name}</p>
                      <p><strong>CIF:</strong> {client.cif || 'Sin CIF'}</p>
                      <p>
                        <strong>Dirección:</strong> {[
                          client.address?.street,
                          client.address?.postal,
                          client.address?.city,
                          client.address?.province,
                        ].filter(Boolean).join(', ') || 'Sin dirección'}
                      </p>
                    </>
                  ) : (
                    <p>No se encontró información del cliente asociado</p>
                  );
                })()
              ) : (
                <p>Cargando información del cliente...</p>
              )}
            </>
          )}

          {/* Albaranes Relacionados */}
          <h3 className="text-xl font-bold mt-6">Albaranes Relacionados</h3>
          {getDeliveryNotesForProject(selectedProject._id, selectedProject.clientId).length === 0 ? (
            <p className="text-gray-600">No se encontraron albaranes para este proyecto.</p>
          ) : (
            <ul className="space-y-2">
              {getDeliveryNotesForProject(selectedProject._id, selectedProject.clientId).map((note) => (
                <li key={note._id} className="border-b pb-2">
                  <p><strong>Descripción:</strong> {note.description}</p>
                  <p><strong>Fecha:</strong> {note.workdate}</p>
                  <p><strong>Formato:</strong> {note.format}</p>
                </li>
              ))}
            </ul>
          )}

          {/* Botones de Editar y Eliminar */}
          <div className="mt-4 flex space-x-4">
            <button
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              onClick={() => handleEditProject(selectedProject._id)}
            >
              Editar
            </button>
            <button
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
              onClick={() => handleDeleteProject(selectedProject._id)}
            >
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}