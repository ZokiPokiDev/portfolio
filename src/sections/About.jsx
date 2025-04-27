import Industries from './Industries';
import Services from './Services';

const About = () => (
    <section id="about" className="about">
      <h2>About Us</h2>
      <p>
        We are a team of experienced software engineers and architects, specializing in building robust 
        platforms and applications across diverse industries, including automotive, finance, e-commerce, 
        sports, education, and SaaS. Our portfolio includes leading projects for major brands such as 
        KTM, VW (Porsche), Red-Bull, DAZN, and top European job portals. We have delivered solutions 
        ranging from mobile apps (Flutter, React Native) and large-scale web platforms to secure financial 
        APIs and e-commerce systems.
      </p>
      <br />
      
      <h3>AI & Advanced Integrations</h3>
      <p>
        We have extensive experience designing and deploying AI-powered solutions. 
        Our expertise includes Retrieval-Augmented Generation (RAG) & Context-Augmented Generation 
        (CAG) with LangChain, integrating LLMs into SaaS and API platforms, and building AI PDF readers 
        and intelligent automation tools. We focus on delivering context-aware, explainable, and actionable 
        AI responses for real-world business applications.
      </p>
      <br />

      <Industries />
      <Services />
    </section>
  );
  
  export default About;