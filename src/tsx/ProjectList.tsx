import { useState, useEffect } from 'react';

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

    // Hacer la petición cuando cambie la página o el término de búsqueda
    useEffect(() => {
        peti(page, searchTerm);
    }, [page, searchTerm]);

    // Función para hacer la petición a la API usando el endpoint de búsqueda por nombre
    const peti = async (p = 0, search = '') => {
        // Si hay un término de búsqueda, hacer la petición con el endpoint 
        const requestUrl = search 
            ? `${url}/${search}`  // Buscamos por nombre
            : `${url}?size=3&page=${p}`;  // Si no hay búsqueda, mostrar los proyectos paginados

        const response = await fetch(requestUrl);
        const data = await response.json();

        if (search) {
            // Si estamos buscando por nombre
            const project = data.data ? {
                id: data.data.id,  
                name: data.data.name,
                description: data.data.description,
                start_date: data.data.start_date,
            } : null;
            setPosts(project ? [project] : []);  
            setTotalPages(1);  // No hay paginación en este caso, ya que estamos buscando por nombre
        } else {
            // Si no estamos buscando, normalizamos la respuesta para paginación
            setPosts(data.content.map((project: any) => ({
                id: project.id,  
                name: project.name,
                description: project.description,
                start_date: project.start_date,
            })) || []); 
            setTotalPages(data.totalPages || 1); // Si no hay paginación, asignamos 1 página por defecto
        }
    };

    // Función para eliminar un proyecto
    const handleDelete = async (id: number) => {
        const response = await fetch(`${url}/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            // Eliminar el proyecto de la lista localmente después de la eliminación
            setPosts(posts.filter(project => project.id !== id));
        } else {
            console.error('Error al eliminar el proyecto');
        }
    };

    // Función para manejar la búsqueda al presionar "Enter"
    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            peti(page, searchTerm); // Realizamos la búsqueda cuando se presiona "Enter"
        }
    };

    return (
        <>
            {/* Barra de búsqueda centrada y pequeña */}
            <div className="mb-6 flex justify-center">
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearch} // Detectamos la tecla "Enter"
                    className="w-full max-w-xs p-2 border border-gray-300 rounded-md"
                />
            </div>

            {/* Lista de proyectos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map(({ id, name, description, start_date }, index) => {
                    return (
                        <div key={id} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                            <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
                            <p className="mt-2 text-gray-600">{description}</p>
                            <p className="mt-4 text-sm text-gray-500">
                                <strong>Start Date: </strong>{start_date}
                            </p>
                            <button
                                onClick={() => handleDelete(id)} 
                                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                            >
                                Eliminar
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Botones de navegación */}
            <div className="mt-6 flex justify-between items-center">
                <button 
                    onClick={() => setPage(page - 1)} 
                    disabled={page === 0}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-300"
                >
                    Página anterior
                </button>

                {/* Mostramos el número de página actual */}
                <b>{page + 1}</b>

                {/* Botón de "Página siguiente" */}
                <button 
                    onClick={() => setPage(page + 1)} 
                    disabled={posts.length === 0 || page === totalPages - 1}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-300"
                >
                    Página siguiente
                </button>
            </div>
        </>
    );
};

export default Projects;
