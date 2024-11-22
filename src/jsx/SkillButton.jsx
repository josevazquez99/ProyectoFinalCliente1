import { useState } from 'react';

const SkillButton = ({ initialSkills }) => {
  const [skills, setSkills] = useState(initialSkills);

  const changeSkills = () => {
    console.log('Button clicked');
    setSkills([
      { name: 'Astro', image: '/img/astro.png' },
      { name: 'Tailwind CSS', image: '/img/tailwind.png' },
      { name: 'Java', image: '/img/java.png' },
    ]);
  };

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-8">
        {skills.map((skill, index) => (
          <div key={index} className="text-center">
            <img src={skill.image} alt={skill.name} className="w-10 h-10 rounded-full" />
            <p>{skill.name}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <button
          className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition duration-300"
          onClick={changeSkills} // Asegúrate de que este onClick esté correctamente asignado
        >
          <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l7-7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SkillButton;
