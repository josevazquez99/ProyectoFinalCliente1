import { useState } from 'react';

interface Skill {
  name: string;
  image: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  repository_url: string;
  demo_url: string;
  picture: string;
  state: string;
}

interface SkillButtonProps {
  initialSkills: Skill[];
}

const SkillButton: React.FC<SkillButtonProps> = ({ initialSkills }) => {
  const nextSkills: Skill[] = [
    { name: 'Astro', image: '/img/astro.png' },
    { name: 'Tailwind CSS', image: '/img/tailwind.png' },
    { name: 'Java', image: '/img/java.png' },
  ];

  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [previousSkills, setPreviousSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isNextSkills, setIsNextSkills] = useState<boolean>(false); // Nuevo estado para controlar la dirección

  // Función para cambiar entre las habilidades
  const toggleSkills = () => {
    if (isNextSkills) {
      setSkills(previousSkills); // Restauramos las habilidades iniciales
    } else {
      setPreviousSkills(skills); // Guardamos las habilidades actuales
      setSkills(nextSkills); // Cambiamos a las siguientes habilidades
    }
    setIsNextSkills(!isNextSkills); // Cambiamos el estado para indicar qué habilidades estamos mostrando
  };

  // Función para obtener proyectos por tecnología
  const fetchProjectsBySkill = async (tech: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/projects/tec/${tech}`);
      const data = await response.json();

      if (response.ok) {
        setProjects(
          (data.data || []).map((project: any) => ({
            id: project.id,
            name: project.name,
            description: project.description,
            start_date: project.start_date,
            end_date: project.end_date,
            repository_url: project.repository_url,
            demo_url: project.demo_url,
            picture: project.picture,
            state: project.stateProjectName || "Unknown",
          }))
        );
        setErrorMessage(null);
      } else {
        setErrorMessage(data.message || "An error occurred");
        setProjects([]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setErrorMessage("Failed to fetch projects. Please try again.");
      setProjects([]);
    }
  };

  return (
    <div>
      {/* Sección de habilidades */}
      <div className="flex flex-wrap justify-center gap-8">
        {skills.map((skill, index) => (
          <button
            key={index}
            onClick={() => fetchProjectsBySkill(skill.name)}
            className="bg-white shadow-lg rounded-lg p-6 w-48 text-center hover:bg-gray-100 transition"
          >
            <img
              src={skill.image}
              alt={skill.name}
              className="w-16 h-16 rounded-full mx-auto mb-4"
            />
            <p className="text-lg font-semibold">{skill.name}</p>
          </button>
        ))}
      </div>

      {/* Botón para cambiar habilidades */}
      <div className="flex justify-center mt-6">
        <button
          className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition duration-300"
          onClick={toggleSkills}
        >
          <svg
            className="w-6 h-6 transform transition-all duration-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isNextSkills ? 'M19 9l-7 7-7-7' : 'M5 15l7-7 7 7'} // Cambiar la dirección de la flecha
            />
          </svg>
        </button>
      </div>

      {/* Sección de proyectos */}
      <div className="mt-8">
        {errorMessage ? (
          <p className="text-center text-red-500">{errorMessage}</p>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <img
                  src={project.picture}
                  alt={project.name}
                  className="w-full h-32 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">{project.name}</h2>
                  <p className="mt-2 text-gray-600">{project.description}</p>
                  <p className="mt-4 text-sm text-gray-500">
                    <strong>Start Date:</strong> {project.start_date} <br />
                    <strong>End Date:</strong> {project.end_date}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    <strong>State:</strong> {project.state}
                  </p>
                  <div className="flex gap-4 mt-4">
                    <a
                      href={project.repository_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Repository
                    </a>
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-500 hover:underline"
                    >
                      Demo
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No projects found for the selected technology.</p>
        )}
      </div>
    </div>
  );
};

export default SkillButton;
