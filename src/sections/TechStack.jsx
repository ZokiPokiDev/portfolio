import reactLogo from '../assets/react.svg';
import nestjsLogo from '../assets/nestjs.svg';
import expressLogo from '../assets/expressdotcom.svg';
import laravelLogo from '../assets/laravel.svg';
import symfonyLogo from '../assets/symfony.svg';
import codeigniterLogo from '../assets/codeigniter.svg';
import cakephpLogo from '../assets/cakephp.svg';
import fastapiLogo from '../assets/fastapi.svg';
import angularLogo from '../assets/angular.svg';
import mysqlLogo from '../assets/mysql.svg';
import postgresqlLogo from '../assets/postgresql.svg';
import mongodbLogo from '../assets/mongodb.svg';
import springLogo from '../assets/spring.svg';
import springbootLogo from '../assets/springboot.svg';
import dockerLogo from '../assets/docker.svg';
import kubernetesLogo from '../assets/kubernetes.svg';
import dotnetLogo from '../assets/dotnet.svg';
import reduxLogo from '../assets/redux.svg';
import linuxLogo from '../assets/linux.svg';
import kalilinuxLogo from '../assets/kalilinux.svg';
import langchainLogo from '../assets/langchain.svg';
import openaiLogo from '../assets/openai.svg';
import ollamaLogo from '../assets/ollama.svg';
import strapiLogo from '../assets/strapi.svg';
import wordpressLogo from '../assets/wordpress.svg';
import drupalLogo from '../assets/drupal.svg';
import proxmoxLogo from '../assets/proxmox.svg';
import javascriptLogo from '../assets/javascript.svg';
import cssLogo from '../assets/css.svg';
import sassLogo from '../assets/sass.svg';
import lessLogo from '../assets/less.svg';
import tailwindcssLogo from '../assets/tailwindcss.svg';
import postcssLogo from '../assets/postcss.svg';
import html5Logo from '../assets/html5.svg';
import flutterLogo from '../assets/flutter.svg';
import viteLogo from '../assets/vite.svg';
import nxLogo from '../assets/nx.svg';
import reactivexLogo from '../assets/reactivex.svg';
import hibernateLogo from '../assets/hibernate.svg';
import toptalLogo from '../assets/toptal.svg';
import oktaLogo from '../assets/okta.svg';
import leafletLogo from '../assets/leaflet.svg';
import jenkinsLogo from '../assets/jenkins.svg';
import gitlabLogo from '../assets/gitlab.svg';
import gitLogo from '../assets/git.svg';
import githubLogo from '../assets/github.svg';
import codeiumLogo from '../assets/codeium.svg';
import reactNativeLogo from '../assets/react-native.webp';

const techStack = [
  { name: 'React.js', logo: reactLogo },
  { name: 'Nest.js', logo: nestjsLogo },
  { name: 'Express.js', logo: expressLogo },
  { name: 'Laravel', logo: laravelLogo },
  { name: 'Symfony', logo: symfonyLogo },
  { name: 'CodeIgniter', logo: codeigniterLogo },
  { name: 'CakePHP', logo: cakephpLogo },
  { name: 'FastAPI', logo: fastapiLogo },
  { name: 'Angular', logo: angularLogo },
  { name: 'MySQL', logo: mysqlLogo },
  { name: 'PostgreSQL', logo: postgresqlLogo },
  { name: 'MongoDB', logo: mongodbLogo },
  { name: 'Spring', logo: springLogo },
  { name: 'Spring Boot', logo: springbootLogo },
  { name: 'Docker', logo: dockerLogo },
  { name: 'Kubernetes', logo: kubernetesLogo },
  { name: '.NET', logo: dotnetLogo },
  { name: 'Redux', logo: reduxLogo },
  { name: 'Linux', logo: linuxLogo },
  { name: 'Kali Linux', logo: kalilinuxLogo },
  { name: 'LangChain', logo: langchainLogo },
  { name: 'OpenAI', logo: openaiLogo },
  { name: 'Ollama', logo: ollamaLogo },
  { name: 'Strapi', logo: strapiLogo },
  { name: 'WordPress', logo: wordpressLogo },
  { name: 'Drupal', logo: drupalLogo },
  { name: 'Proxmox', logo: proxmoxLogo },
  { name: 'JavaScript', logo: javascriptLogo },
  { name: 'CSS', logo: cssLogo },
  { name: 'Sass', logo: sassLogo },
  { name: 'Less', logo: lessLogo },
  { name: 'Tailwind CSS', logo: tailwindcssLogo },
  { name: 'PostCSS', logo: postcssLogo },
  { name: 'HTML5', logo: html5Logo },
  { name: 'Flutter', logo: flutterLogo },
  { name: 'Vite', logo: viteLogo },
  { name: 'Nx', logo: nxLogo },
  { name: 'ReactiveX', logo: reactivexLogo },
  { name: 'Hibernate', logo: hibernateLogo },
  { name: 'Toptal', logo: toptalLogo },
  { name: 'Okta', logo: oktaLogo },
  { name: 'Leaflet', logo: leafletLogo },
  { name: 'Jenkins', logo: jenkinsLogo },
  { name: 'GitLab', logo: gitlabLogo },
  { name: 'Git', logo: gitLogo },
  { name: 'GitHub', logo: githubLogo },
  { name: 'Codeium', logo: codeiumLogo },
  { name: 'React Native', logo: reactNativeLogo },
];

const TechStack = () => (
  <section className="tech-stack">
    <h2>Tech Stack</h2>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5em' }}>
      {techStack.map((tech, idx) => (
        <div key={idx} style={{ textAlign: 'center' }}>
          <img src={tech.logo} alt={tech.name} style={{ width: '40px', height: '40px', marginBottom: '0.5em' }} />
          <div>{tech.name}</div>
        </div>
      ))}
    </div>
  </section>
);

export default TechStack;