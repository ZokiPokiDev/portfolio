import { Link } from "react-router-dom";

export const services = [
  {
    id: 1,
    slug: "ai-integration",
    title: "AI Integration Services",
    description: "Seamlessly integrate artificial intelligence into your existing business systems and workflows.",
    summary: "We build production-grade AI solutions that connect with your current infrastructure, from CRM and ERP systems to custom applications. Our integrations are secure, scalable, and designed for European compliance standards including GDPR.",
    seoTitle: "AI Integration Services | SystemPro Tech",
    seoDescription: "Professional AI integration services for European businesses. Connect AI assistants, automation, and intelligence to your existing systems with our expert engineering team.",
    custom: [
      {
        title: "Enterprise AI Integration",
        description: "Connect AI capabilities to your existing enterprise systems including CRM, ERP, and line-of-business applications.",
        points: [
          {
            title: "System Integration",
            values: [
              "API-first integration with existing platforms",
              "Legacy system compatibility",
              "Real-time data synchronization",
              "Event-driven architecture",
              "Microservices integration patterns"
            ],
          },
          {
            title: "AI Capabilities",
            values: [
              "Natural language processing",
              "Predictive analytics",
              "Computer vision",
              "Automated decision making",
              "Intelligent document processing"
            ],
          },
          {
            title: "Security & Compliance",
            values: [
              "GDPR compliant implementations",
              "Enterprise-grade security",
              "Data privacy by design",
              "Access control integration",
              "Audit logging and monitoring"
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    slug: "rag-enterprise-assistants",
    title: "RAG Enterprise Knowledge Assistants",
    description: "Build private, secure RAG assistants that search internal documents and preserve access permissions.",
    summary: "We implement Retrieval-Augmented Generation solutions that can be deployed inside Azure, AWS, or customer-controlled environments. Our assistants cite source documents, respect access controls, and integrate with your existing knowledge bases.",
    seoTitle: "RAG Enterprise Assistants | SystemPro Tech",
    seoDescription: "Private RAG assistants with document search, access control, and source citation. Deployable in Azure, AWS, or on-premises for European enterprises.",
    custom: [
      {
        title: "Secure Document Processing",
        description: "Ingest and index internal documents with proper access controls and data governance.",
        points: [
          {
            title: "Document Sources",
            values: [
              "SharePoint and Office 365",
              "Enterprise document management systems",
              "Database and knowledge base integration",
              "Email and communication archives",
              "Custom data sources"
            ],
          },
          {
            title: "Access Control",
            values: [
              "Role-based document access",
              "Department-level permissions",
              "User-level restrictions",
              "Document classification support",
              "Audit trails for all accesses"
            ],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    slug: "legacy-software-modernization",
    title: "Legacy Software Modernization",
    description: "Transform outdated systems into modern, scalable, and maintainable applications.",
    summary: "We modernize monolithic applications, mainframe systems, and aging platforms through incremental evolution rather than risky big-bang rewrites. Our approach preserves business value while improving agility, performance, and maintainability.",
    seoTitle: "Legacy Software Modernization | SystemPro Tech",
    seoDescription: "Modernize legacy applications incrementally with our proven approach. Preserve business value while improving agility, performance, and maintainability.",
    custom: [
      {
        title: "Modernization Strategy",
        description: "Assess your current state and create a roadmap for modernization.",
        points: [
          {
            title: "Assessment Phase",
            values: [
              "Application portfolio analysis",
              "Technical debt evaluation",
              "Business value mapping",
              "Risk assessment",
              "Modernization roadmap"
            ],
          },
        ],
      },
    ],
  },
  {
    id: 4,
    slug: "business-process-automation",
    title: "Business Process Automation",
    description: "Automate repetitive tasks and workflows to improve efficiency and reduce operational costs.",
    summary: "We identify automation opportunities across your business processes and implement solutions that integrate with your existing systems. From simple task automation to complex workflow orchestration, we deliver measurable efficiency gains.",
    seoTitle: "Business Process Automation | SystemPro Tech",
    seoDescription: "Automate business workflows and processes with our expert automation services. Improve efficiency, reduce costs, and eliminate manual errors.",
    custom: [
      {
        title: "Process Discovery & Analysis",
        description: "Identify automation opportunities through process mining and analysis.",
        points: [
          {
            title: "Discovery Methods",
            values: [
              "Process mining from system logs",
              "User activity analysis",
              "Stakeholder interviews",
              "Value stream mapping",
              "Pain point identification"
            ],
          },
        ],
      },
    ],
  },
  {
    id: 5,
    slug: "platform-rescue-sprint",
    title: "Platform Rescue Sprint",
    description: "Rapid intervention to stabilize and recover failing digital platforms and applications.",
    summary: "When your critical platform is at risk of failure, we provide emergency response to diagnose issues, implement fixes, and restore stability. Our rescue sprints typically run 2-4 weeks and deliver immediate stabilization followed by a roadmap for long-term recovery.",
    seoTitle: "Platform Rescue Sprint | SystemPro Tech",
    seoDescription: "Emergency platform rescue services for failing digital platforms. Rapid diagnosis, stabilization, and recovery with expert engineering intervention.",
    custom: [
      {
        title: "Emergency Assessment",
        description: "Quick diagnosis of platform issues and root cause analysis.",
        points: [
          {
            title: "Rapid Diagnosis",
            values: [
              "24-48 hour initial assessment",
              "Production incident analysis",
              "Performance bottleneck identification",
              "Security vulnerability scanning",
              "Architecture review"
            ],
          },
        ],
      },
    ],
  },
];

const Services = () => (
  <section id="services" className="services box-card">
    <h3>Services</h3>
    <ul>
      {services.map((service, idx) => (
        <li key={idx}>
          <Link to={`/services/${service.slug}`} style={{ color: '#1a73e8' }}>
            {service.title}
          </Link>
        </li>
      ))}
    </ul>
  </section>
);

export default Services;
