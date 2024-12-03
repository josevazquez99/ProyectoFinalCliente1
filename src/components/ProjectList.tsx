import { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; 

interface Project {
    id: number;
    name: string;
    description: string;
    start_date: string;
}

const Projects = () => {
    const [page, setPage] = useState(0);
    const [posts, setPosts] = useState<Project[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const url: string = "http://localhost:8080/api/v1/projects";

    useEffect(() => {
        peti(page, searchTerm);
    }, [page, searchTerm]);

    const peti = async (p = 0, search = '') => {
        if (search && search.length < 3) return; // Evita búsquedas demasiado cortas

        // Si hay búsqueda, ajusta la URL de la petición
        const requestUrl = search
            ? `${url}/${search}?page=${p}&size=3` // Agrega paginación en la búsqueda
            : `${url}?page=${p}&size=3`; // Paginación normal

        const response = await fetch(requestUrl);
        const data = await response.json();

        if (search) {
            setPosts(data.content || []); // Proyectos de la búsqueda
            setTotalPages(data.totalPages || 1); // Total de páginas en la búsqueda
        } else {
            setPosts(data.content || []); // Proyectos de la página actual
            setTotalPages(data.totalPages || 1); // Total de páginas en la paginación normal
        }
    };

    const handleDelete = async (id: number) => {
        const response = await fetch(`${url}/${id}`, { method: 'DELETE' });

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
            <div className="mb-6 flex justify-center">
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && peti(page, searchTerm)}
                    className="w-full max-w-xs p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((project) => (
                    <ProjectCard key={project.id} project={project} test={true} />
                ))}
            </div>

            <div className="mt-6 flex justify-center items-center space-x-4">
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 0}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg disabled:bg-gray-300 hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
                >
                    <FaArrowLeft className="inline-block mr-2" />
                    Página anterior
                </button>

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
