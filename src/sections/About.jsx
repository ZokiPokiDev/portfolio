import Industries from './Industries';
import Services from './Services';

const About = () => (
  <section id="about" className="about">
    <h2>About Us</h2>
    <p>
      We are a team of experienced software engineers and architects, developing software more then 15 years, specializing in building robust
      platforms and applications across diverse industries, including <strong>automotive, finance, e-commerce,
      sports, education, and SaaS</strong>. Our portfolio includes leading projects for major brands such as
      <strong> KTM, VW (Porsche), Red-Bull, DAZN, and top European job portals</strong>. We have delivered solutions
      ranging from mobile apps <strong>(Flutter, React Native)</strong> and large-scale web platforms to secure financial
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

    <h3>Innovations</h3>
    <p>
      We have a strong focus on innovation and delivering cutting-edge solutions.
      Our expertise includes building innovative platforms and applications,
      including mobile apps <strong>(Flutter, React Native)</strong> and large-scale web platforms.
      We also specialize in secure financial APIs and e-commerce systems.
    </p>
    <br />

    <h3>Security</h3>
    <p>
      We are a Cybersecurity and DevSecOps Engineers with deep expertise in securing modern infrastructures across cloud, on-premises,
      and hybrid environments. He specializes in vulnerability assessment, penetration testing, and automating security enforcement
      across CI/CD pipelines using platforms like Sophos, CrowdStrike, and Palo Alto Networks.
      His strong technical foundation includes mastery of Web Protocols <strong>(HTTP, HTTPS, FTP, SFTP)</strong>, Network Fundamentals
      <strong>(TCP/IP, UDP, ICMP, ARP)</strong>, and Security Protocols <strong>(SSH, SSL/TLS, IPSec, Kerberos)</strong>. We actively secures Email <strong>(SMTP, POP3, IMAP)</strong>,
      Remote Access <strong>(Telnet, RDP)</strong>, and implements hardening techniques for File Sharing <strong>(SMB/CIFS, NFS)</strong> and Routing Protocols <strong>(OSPF, BGP, EIGRP)</strong>.
      Skilled in securing IoT and wireless systems <strong>(MQTT, Zigbee, Bluetooth)</strong>, industrial communications <strong>(MODBUS, DNP3)</strong>,
      and virtualization tunneling <strong>(GRE, MPLS, VXLAN)</strong>, we deliver robust, scalable,
      and proactive security solutions designed for real-world threats.
    </p>
    <br />

    <Industries />
    <Services />
  </section>
);

export default About;