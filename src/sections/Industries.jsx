import { Link } from "react-router-dom";

export const industries = [
    {
        id: "automotive",
        title: "Automotive",
        description: "Real-time monitoring, telematics, and seamless integration with customer and dealer systems.",
        summary: "We empower automotive leaders with connected vehicle platforms, digital showrooms, and advanced analytics. Our solutions streamline operations, enhance customer experiences, and enable smart mobility.",
        services: [
            {
                title: "Connected Vehicle Platforms",
                description: "Integration of IoT, telematics, and cloud services for real-time vehicle monitoring, diagnostics, and predictive maintenance.",
            },
            {
                title: "Dealer & E-Commerce Solutions",
                description: "Custom digital showrooms, inventory management, and online sales portals for automotive brands and dealerships.",
            },
            {
                title: "Fleet Management & Analytics",
                description: "Comprehensive fleet tracking, route optimization, and data-driven insights for commercial operators.",
            },
        ],
    },
    {
        id: "finance",
        title: "Finance",
        description: "Revolutionizing banking and financial services with secure, scalable, and user-centric digital solutions.",
        summary: "We help banks and fintechs modernize their platforms, deliver seamless digital banking experiences, and ensure compliance with industry standards.",
        image: '',
        services: [
            {
                title: "Mobile Payment Integration",
                description: `We have successfully delivered cloud-native solutions for our clients, ensuring maximum flexibility and security.`,
                custom: [
                    {
                        title: "Challenge",
                        description: "Seamless backend integration",
                        image: "",
                        text: "Our client, a licensed bank, was faced with the challenge of seamlessly integrating their existing banking backend with native apps for mobile payments. They needed to provide payment and credit card functionalities in a user-friendly manner for customers possessing a credit card, amidst a growing demand for real-time and transparent banking operations."
                    },
                    {
                        title: "Idea",
                        description: "Implementation of middleware",
                        image: "",
                        text: "We have suggested the implementation of middleware to bridge the banking backend and the native apps, allowing a smooth flow of data. Leveraging technologies like React.js for the frontend and Nest.js for the backend."
                    },
                    {
                        title: "Solution",
                        description: "Credit card app enhances customer experience",
                        image: "",
                        text: "We have implemented the proposed middleware and web portal. This new credit card app enabled a comprehensive overview of personal limits, real-time transactions, easy access to monthly statements, secure online payment authorizations, and more, all within a single platform. This successful collaboration helped to enhance the customer banking experience and strengthened our client's digital transformation journey in the banking sector."
                    }
                ],
            },
            {
                title: "Digital banking enhancement",
                description: `In a world that is becoming increasingly digital, our client was faced with the challenge of optimizing their digital banking services and making them more scalable. This endeavor required solutions that allowed for a smooth and secure interaction of customers with the services.`,
                custom: [
                    {
                        title: "Challenge",
                        description: "Better scalability & communication",
                        image: "",
                        text: "Our clients needed to address scalability for their single sign-on (SSO) service, create a communication portal for their telebanking, upgrade the Elastic Search Clusters for the booking backend, and develop a Whitelabel application for aggregating bank connections.",
                    },
                    {
                        title: "Idea",
                        description: "Spring Boot and Redis for higher scalability",
                        image: "",
                        text: "We have planned to enhance the scalability of the SSO service using Spring Boot and Redis, design a communication application for their telebanking, upgrade the Elastic Search instances, and develop a Whitelabel applications.",
                    },
                    {
                        title: "Solution",
                        description: "Optimized operations and customer experience",
                        image: "",
                        text: "The SSO service was successfully scaled and deployed, and a communication application was implemented for their telebanking. The Elastic Search instances were upgraded, improving performance, and a proof-of-concept Whitelabel application was developed for bank connections. The collaboration with our client significantly enhanced their digital banking services.",
                    },
                ]
            },
            {
                title: "Financial services through CRM",
                description: `The changing financial industry demands innovative approaches to customer service and data management. Efficient processes and a seamless customer experience are key to sustainable success. Therefore, our client was looking for innovative, tailored solutions that meet these requirements.`,
                custom: [
                    {
                        title: "Solution",
                        description: "Optimized operations and customer experience",
                        image: "",
                        text: "The CRM and CRM Bridge implementation improved customer management and data synchronization efficiency. Custom surveys and the contract tool streamlined customer engagement and contract creation. The third-party contract adapter simplified in-app contract management. A comprehensive notification system kept customers informed via in-app notifications, emails, and SMS. These advancements optimized our client's operations and customer experience.",
                    }
                ],
            },
        ]
    },
    {
        id: "e-commerce",
        title: "E-Commerce",
        description: "B2B and B2C solutions",
        summary: "The changing e-commerce landscape requires innovative solutions to meet customer needs and stay competitive. Therefore, our client sought tailored, technology-driven solutions to enhance their operations and customer experience.",
        services: [
            {
                title: "Progressive web app improved SAP Commerce solution",
                description: `SAP is a leading software company around the world, and with its SAP Customer Experience, it has been recognized by Gartner as a leader in digital commerce.
                    Since the company follows and aligns with the latest trends in technology, they've decided to add progressive web apps (PWAs) to its flagship product, SAP Commerce Cloud.
                    Thanks to PWA, SAP Commerce Cloud has improved and enriched its customer experience (CX). Moreover, PWA provides a native app-like experience with many features, like home screen installation, push notifications, offline mode, and client-side caching.`,
                custom: [
                    {
                        title: "Challenge",
                        description: "Optimized operations and customer experience",
                        image: "",
                        text: "The client needed to improve their SAP Commerce Cloud solution by adding progressive web apps (PWAs) to enhance the customer experience and provide a native app-like experience with features such as home screen installation, push notifications, offline mode, and client-side caching.",
                    },
                    {
                        title: "Idea",
                        description: "How did we tackle the technology challenge?",
                        image: "",
                        text: "We proposed to implement progressive web apps (PWAs) to enhance the SAP Commerce Cloud solution. This would provide a native app-like experience with features such as home screen installation, push notifications, offline mode, and client-side caching. The PWA would improve the customer experience and provide a more engaging and personalized shopping experience.",
                    },
                    {
                        title: "Solution",
                        description: "What did we achieve?",
                        image: "",
                        text: "The PWA was successfully implemented, enhancing the SAP Commerce Cloud solution with a native app-like experience. The PWA provided features such as home screen installation, push notifications, offline mode, and client-side caching, improving the customer experience and providing a more engaging and personalized shopping experience.",
                    }
                ]
            },
            {
                title: "Turning an 80-year-old industry role model into a digital pioneer",
                description: `The client, a leading company in the industry, was looking to transform their business model and improve their customer experience. They were interested in exploring new technologies and solutions to enhance their operations and provide a better experience to their customers.`,
                custom: [
                    {
                        title: "Challenge",
                        description: "Helping our partner stay ahead of the curve",
                        image: "",
                        text: `For a company facing expansion becoming a digital pioneer in the sector was an essential step for staying ahead of the curve.
                            Because of that, they asked us to create a partner portal incorporating the functionality of eCommerce.
                            The goal of this investment was to cover all of their customer groups from contract distributors to end consumers.`,
                    },
                    {
                        title: "Solution",
                        description: "Strengthening a growing brand",
                        image: "",
                        text: `Using SAP Commerce and Spartacus storefront.
                            The system now provides a cohesive, seamless experience to both partners and end users, 
                            strengthening both sides, positioning and confirming their status as a digital pioneer in the industry.`,
                    }
                ]
            }
        ],
    },
    {
        id: "sports-and-entertainment",
        title: "Sports & Entertainment",
        description: "Digital fan engagement, ticketing, and content delivery for sports clubs, venues, and media companies.",
        summary: "We enable organizations to connect with fans, monetize content, and deliver immersive experiences through modern digital platforms.",
        services: [
            {
                title: "Fan Engagement Platforms",
                description: "Mobile apps and web portals for real-time scores, social interaction, and loyalty programs.",
            },
            {
                title: "Streaming & Media Delivery",
                description: "High-quality live and on-demand video streaming with robust analytics and monetization features.",
            },
            {
                title: "Event Management",
                description: "End-to-end solutions for ticketing, scheduling, and attendee engagement.",
            },
        ],
    },
    {
        id: "education",
        title: "Education",
        description: "Transforming learning with digital classrooms, e-learning platforms, and AI-powered assessment tools.",
        summary: "We partner with educational institutions and ed-tech innovators to deliver accessible, engaging, and data-driven learning experiences.",
        services: [
            {
                title: "E-Learning Platforms",
                description: "Custom LMS, virtual classrooms, and mobile learning apps for schools and enterprises.",
            },
            {
                title: "AI Assessment & Analytics",
                description: "Automated grading, personalized feedback, and learning analytics to improve outcomes.",
            },
            {
                title: "Content Management",
                description: "Tools for curriculum creation, distribution, and collaboration among educators and students.",
            },
        ],
    },
    {
        id: "saas-and-platforms",
        title: "SaaS & Platforms",
        description: "Design, development, and scaling of robust SaaS products and cloud-native platforms.",
        summary: "We accelerate SaaS growth with secure, multi-tenant architectures, API-first development, and seamless integrations.",
        services: [
            {
                title: "SaaS Product Engineering",
                description: "End-to-end product development, from MVP to enterprise-grade SaaS solutions.",
            },
            {
                title: "API & Integration Services",
                description: "RESTful and GraphQL API design, third-party integrations, and developer portal creation.",
            },
            {
                title: "Cloud Infrastructure & DevOps",
                description: "Automated CI/CD, containerization, and cloud cost optimization for scalable platforms.",
            },
        ],
    },
    {
        id: "telecommunications",
        title: "Telecommunications",
        description: "Modernizing telecom operations with OSS/BSS, network automation, and customer self-service portals.",
        summary: "We help telecom operators and service providers innovate, reduce costs, and enhance customer satisfaction through digital transformation.",
        services: [
            {
                title: "OSS/BSS Digitalization",
                description: "Custom solutions for billing, provisioning, and network management.",
            },
            {
                title: "Customer Portals & Apps",
                description: "Self-service portals and mobile apps for account management, support, and onboarding.",
            },
            {
                title: "Network Automation",
                description: "AI-driven monitoring, predictive maintenance, and automated incident response.",
            },
        ],
    },
    {
        id: "transport-and-logistics",
        title: "Transport & Logistics",
        description: "Reliable vehicle detection and classification",
        summary: `Vehicle detection is a strategically important issue for the customer. 
            Therefore, we had only two months for the proof of concept to show that we will achieve the required high recognition accuracy. 
            We were so convincing that the customer ultimately invested a significant budget in this pioneering project. 
            And it was worth it, as our work resulted in a patent application for the customer.`,
        image: '',
        services: [
            {
                title: "Vehicle Detection",
                description: `We have successfully delivered cloud-native solutions for our clients, ensuring maximum flexibility and security.`,
                sensors: ['LiDAR', 'RGB Camera', "Stereo Camera", "CTV"],
                ai: ["Object Detection", "Image Classification"]
            },
            { title: "Revolutionary robotics solution for SMEs", description: `We have successfully delivered cloud-native solutions for our clients, ensuring maximum flexibility and security. ` },
            { title: "Efficient intralogistics workflows", description: `We have successfully delivered cloud-native solutions for our clients, ensuring maximum flexibility and security. ` },
            { title: "Maximum Flexibility and Security with cloud-native architecture", description: `We have successfully delivered cloud-native solutions for our clients, ensuring maximum flexibility and security. ` },
            {
                title: "Digitalized fire department",
                description: `The fire department needed a digital platform to manage all their tasks and workflows. `,
                sensors: ['many sensors per vehicle'],
            },
            { title: "Digital fleet management", description: `Modern B2B vehicles can be connected via online interfaces just like private cars for software updates, remote maintenance or for fleet management applications. ` },
        ]
    }
];

const Industries = () => (
    <section className="industries box-card">
        <h2>Industries</h2>
        <ul>
            {industries.map((industry, idx) => (
                <li key={idx}>
                    <Link to={`/industries/${industry.id}`} style={{ color: '#1a73e8' }}>
                        {industry.title}
                    </Link>
                </li>
            ))}
        </ul>
    </section>
);

export default Industries;