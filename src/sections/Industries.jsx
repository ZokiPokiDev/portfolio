import { Link } from "react-router-dom";

export const industries = [
  {
    id: "finance-ai-modernization",
    slug: "finance-ai-modernization",
    title: "Financial Services AI Modernization",
    description: "AI-powered transformation for banks, fintechs, and financial institutions.",
    summary: "We help financial services organizations modernize their platforms with AI and automation, delivering secure, compliant, and customer-centric digital banking experiences.",
    seoTitle: "Finance AI Modernization | SystemPro Tech",
    seoDescription: "AI modernization services for banks and financial institutions. Transform legacy systems, automate processes, and enhance customer experiences with secure, compliant solutions.",
    services: [
      {
        title: "AI-Powered Banking Platforms",
        description: "Modernize core banking systems with AI capabilities for better customer service and operational efficiency.",
        sensors: [],
        ai: ["Predictive Analytics", "Fraud Detection", "Customer Insights", "Risk Assessment"],
      },
      {
        title: "Digital Payment Solutions",
        description: "Build secure, scalable digital payment platforms with integrated AI for fraud prevention and customer personalization.",
        sensors: [],
        ai: ["Anomaly Detection", "Spend Analysis", "Personalized Offers"],
      },
      {
        title: "Regulatory Compliance Automation",
        description: "Automate compliance monitoring, reporting, and audit trails with AI-powered systems.",
        sensors: [],
        ai: ["Regulatory Change Tracking", "Automated Reporting", "Audit Trail Analysis"],
      },
    ],
  },
  {
    id: "logistics-workflow-automation",
    slug: "logistics-workflow-automation",
    title: "Logistics & Transportation Workflow Automation",
    description: "Automate and optimize logistics operations with AI and intelligent workflows.",
    summary: "We deliver smart logistics solutions that improve efficiency, reduce costs, and enhance visibility across your supply chain operations.",
    seoTitle: "Logistics Workflow Automation | SystemPro Tech",
    seoDescription: "Automate logistics workflows with AI-powered solutions. From route optimization to warehouse automation, we deliver measurable efficiency improvements.",
    services: [
      {
        title: "Intelligent Route Optimization",
        description: "AI-driven route planning that considers traffic, weather, delivery windows, and vehicle constraints.",
        sensors: ["GPS", "IoT Sensors"],
        ai: ["Route Optimization", "ETA Prediction", "Fuel Efficiency"],
      },
      {
        title: "Warehouse Automation",
        description: "Automate warehouse operations with robotics, computer vision, and AI-powered inventory management.",
        sensors: ["LiDAR", "RGB Camera", "Barcode Scanners"],
        ai: ["Object Detection", "Inventory Prediction", "Space Optimization"],
      },
      {
        title: "Fleet Management Systems",
        description: "Comprehensive fleet monitoring, maintenance prediction, and driver behavior analysis.",
        sensors: ["Telematics", "IoT Devices"],
        ai: ["Predictive Maintenance", "Driver Scoring", "Fuel Consumption Analysis"],
      },
    ],
  },
  {
    id: "ecommerce-systems-integration",
    slug: "ecommerce-systems-integration",
    title: "E-Commerce Systems Integration",
    description: "Integrate and modernize e-commerce platforms for seamless multi-channel retail experiences.",
    summary: "We help B2B and B2C businesses connect their e-commerce systems with ERP, CRM, and other business applications for unified customer experiences.",
    seoTitle: "E-Commerce Systems Integration | SystemPro Tech",
    seoDescription: "Integrate e-commerce platforms with ERP, CRM, and legacy systems. Modernize your digital commerce with scalable, secure solutions.",
    services: [
      {
        title: "Platform Integration Services",
        description: "Connect e-commerce platforms with existing business systems including ERP, CRM, and inventory management.",
        sensors: [],
        ai: ["Demand Forecasting", "Personalized Recommendations", "Dynamic Pricing"],
      },
      {
        title: "Omnichannel Experience Design",
        description: "Create consistent customer experiences across web, mobile, social, and in-store channels.",
        sensors: [],
        ai: ["Customer Journey Analysis", "Channel Attribution", "Personalization"],
      },
      {
        title: "Order & Fulfillment Automation",
        description: "Automate order processing, fulfillment, shipping, and returns management.",
        sensors: ["Barcode Scanners", "IoT Devices"],
        ai: ["Fraud Detection", "Inventory Optimization", "Shipping Optimization"],
      },
    ],
  },
  {
    id: "education-ai-platforms",
    slug: "education-ai-platforms",
    title: "Education AI Platforms",
    description: "Transform learning and teaching with AI-powered educational technology solutions.",
    summary: "We build intelligent learning platforms, assessment systems, and educational tools that personalize the learning experience and improve outcomes.",
    seoTitle: "Education AI Platforms | SystemPro Tech",
    seoDescription: "AI-powered learning platforms and educational technology. Personalized learning paths, intelligent assessment, and adaptive content delivery.",
    services: [
      {
        title: "Adaptive Learning Platforms",
        description: "AI-driven platforms that adapt content and difficulty based on individual student performance and learning styles.",
        sensors: [],
        ai: ["Learning Style Analysis", "Knowledge Gap Identification", "Personalized Content"],
      },
      {
        title: "Intelligent Assessment Systems",
        description: "Automate grading and feedback with AI that understands context and provides actionable insights.",
        sensors: [],
        ai: ["Automated Grading", "Plagiarism Detection", "Feedback Generation"],
      },
      {
        title: "E-Learning Content Creation",
        description: "Use AI to create interactive, engaging, and accessible learning content at scale.",
        sensors: [],
        ai: ["Content Generation", "Video Analysis", "Accessibility Optimization"],
      },
    ],
  },
];

const Industries = () => (
  <section id="industries" className="industries box-card">
    <h3>Industries</h3>
    <ul>
      {industries.map((industry, idx) => (
        <li key={idx}>
          <Link to={`/industries/${industry.slug}`} style={{ color: '#1a73e8' }}>
            {industry.title}
          </Link>
        </li>
      ))}
    </ul>
  </section>
);

export default Industries;
