import { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; 

// Definimos el tipo para el proyecto
interface Project {
    id: number;
    name: string;
    description: string;
    start_date: string;
}

const Projects = () => {
    const [page, setPage] = useState(0); // Página inicial
    const [posts, setPosts] = useState<Project[]>([]); // Proyectos de la página actual
    const [totalPages, setTotalPages] = useState(0); // Total de páginas disponibles
    const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda

    // URL de la API
    const url: string = "http://localhost:8080/api/v1/projects";

    // Hacemos la petición cuando cambie la página o el término de búsqueda
    useEffect(() => {
        peti(page, searchTerm);
    }, [page, searchTerm]);

    // Función para hacer la petición a la API usando el endpoint de búsqueda por nombre
    const peti = async (p = 0, search = '') => {
        if (search && search.length < 3) return;
        const requestUrl = search
            ? `${url}/${search}`
            : `${url}?size=3&page=${p}`;

        const response = await fetch(requestUrl);
        const data = await response.json();

        if (search) {
            const project = data.data ? {
                id: data.data.id,
                name: data.data.name,
                description: data.data.description,
                start_date: data.data.start_date,
            } : null;
            setPosts(project ? [project] : []);
            setTotalPages(1);
        } else {
            setPosts(data.content.map((project: any) => ({
                id: project.id,
                name: project.name,
                description: project.description,
                start_date: project.start_date,
            })) || []);
            setTotalPages(data.totalPages || 1);
        }
    };

    // Función para eliminar un proyecto
    const handleDelete = async (id: number) => {
        const response = await fetch(`${url}/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setPosts(posts.filter(project => project.id !== id));
        } else {
            console.error('Error al eliminar el proyecto');
        }
    };

    const ProjectCard = ({ project, test = false }: { project: Project; test?: boolean }) => {
        return (
            <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <h2 className="text-xl font-semibold text-gray-800">{project.name}</h2>
                <p className="mt-2 text-gray-600">{project.description}</p>
                <p className="mt-4 text-sm text-gray-500">
                    <strong>Start Date: </strong>{project.start_date}
                </p>
                {test && (
                    <button
                        onClick={() => handleDelete(project.id)}
                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all duration-300"
                    >
                        Eliminar
                    </button>
                )}
            </div>
        );
    };

    return (
        <>
            {/* Barra de búsqueda centrada */}
            <div className="mb-6 flex justify-center">
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && peti(page, searchTerm)} // Búsqueda al presionar "Enter"
                    className="w-full max-w-xs p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
            </div>

            {/* Lista de proyectos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((project) => (
                    <ProjectCard key={project.id} project={project} test={true} />
                ))}
            </div>

            {/* Botones de navegación con transiciones */}
            <div className="mt-6 flex justify-center items-center space-x-4">
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 0}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg disabled:bg-gray-300 hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
                >
                    <FaArrowLeft className="inline-block mr-2" />
                    Página anterior
                </button>

                {/* Número de página actual con diseño personalizado */}
                <div className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg rounded-full w-12 h-12 shadow-md transform transition-transform duration-300 hover:scale-110">
                    {page + 1}
                </div>

                <button
                    onClick={() => setPage(page + 1)}
                    disabled={posts.length === 0 || page === totalPages - 1}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg disabled:bg-gray-300 hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
                >
                    Página siguiente
                    <FaArrowRight className="inline-block ml-2" />
                </button>
            </div>
        </>
    );
};

export default Projects;