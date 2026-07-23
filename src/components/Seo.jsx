import { useEffect } from 'react';

/**
 * SEO Component - Manages metadata for SPA routes
 * 
 * Sets document title, meta descriptions, canonical URLs, and OpenGraph tags
 * for better SEO on client-side rendered pages.
 * 
 * Note: For best SEO results, combine this with server-side rendering or prerendering
 * as initial HTML will still be shared without these tags.
 */
const Seo = ({ 
  title = 'Business Modernization & AI Integration | SystemPro Tech',
  description = 'Modernize legacy software, automate business workflows, and implement secure AI and RAG solutions with an experienced European engineering partner.',
  canonical = 'https://www.system-pro.tech/',
  ogTitle,
  ogDescription,
  ogUrl,
  ogImage = 'https://www.system-pro.tech/assets/javenit-favicon-s8W2CkgX.jpeg',
  twitterTitle,
  twitterDescription,
  twitterImage
}) => {
  useEffect(() => {
    // Set document title
    document.title = title;

    // Create or update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description;

    // Create or update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;

    // OpenGraph tags
    const ogTags = [
      { property: 'og:title', content: ogTitle || title },
      { property: 'og:description', content: ogDescription || description },
      { property: 'og:url', content: ogUrl || canonical },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: ogImage },
    ];

    ogTags.forEach(({ property, content }) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.property = property;
        document.head.appendChild(tag);
      }
      tag.content = content;
    });

    // Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: twitterTitle || ogTitle || title },
      { name: 'twitter:description', content: twitterDescription || ogDescription || description },
      { name: 'twitter:image', content: twitterImage || ogImage },
    ];

    twitterTags.forEach(({ name, content }) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.name = name;
        document.head.appendChild(tag);
      }
      tag.content = content;
    });
  }, [title, description, canonical, ogTitle, ogDescription, ogUrl, ogImage, twitterTitle, twitterDescription, twitterImage]);

  return null;
};

// SEO metadata configurations for different route types
export const seoConfig = {
  homepage: {
    title: 'AI Integration & Software Modernization Company | SystemPro Tech',
    description: 'Modernize legacy software, automate business workflows, and implement secure AI and RAG solutions with an experienced European engineering partner.',
    canonical: 'https://www.system-pro.tech/',
    ogTitle: 'AI Integration & Software Modernization | SystemPro Tech',
    ogDescription: 'Digitalization, workflow automation, system integrations, and practical AI adoption for business operations.',
    ogUrl: 'https://www.system-pro.tech/',
    ogImage: 'https://www.system-pro.tech/assets/javenit-favicon-s8W2CkgX.jpeg',
  },
  // Service pages
  services: {
    'ai-integration': {
      title: 'AI Integration Services | SystemPro Tech',
      description: 'Professional AI integration services for European businesses. Connect AI assistants, automation, and intelligence to your existing systems with our expert engineering team.',
      canonical: 'https://www.system-pro.tech/services/ai-integration',
    },
    'rag-enterprise-assistants': {
      title: 'RAG Enterprise Knowledge Assistants | SystemPro Tech',
      description: 'Private RAG assistants with document search, access control, and source citation. Deployable in Azure, AWS, or on-premises for European enterprises.',
      canonical: 'https://www.system-pro.tech/services/rag-enterprise-assistants',
    },
    'legacy-software-modernization': {
      title: 'Legacy Software Modernization | SystemPro Tech',
      description: 'Modernize legacy applications incrementally with our proven approach. Preserve business value while improving agility, performance, and maintainability.',
      canonical: 'https://www.system-pro.tech/services/legacy-software-modernization',
    },
    'business-process-automation': {
      title: 'Business Process Automation | SystemPro Tech',
      description: 'Automate business workflows and processes with our expert automation services. Improve efficiency, reduce costs, and eliminate manual errors.',
      canonical: 'https://www.system-pro.tech/services/business-process-automation',
    },
    'platform-rescue-sprint': {
      title: 'Platform Rescue Sprint | SystemPro Tech',
      description: 'Emergency platform rescue services for failing digital platforms. Rapid diagnosis, stabilization, and recovery with expert engineering intervention.',
      canonical: 'https://www.system-pro.tech/services/platform-rescue-sprint',
    },
  },
  // Industry pages
  industries: {
    'finance-ai-modernization': {
      title: 'Finance AI Modernization | SystemPro Tech',
      description: 'AI modernization services for banks and financial institutions. Transform legacy systems, automate processes, and enhance customer experiences with secure, compliant solutions.',
      canonical: 'https://www.system-pro.tech/industries/finance-ai-modernization',
    },
    'logistics-workflow-automation': {
      title: 'Logistics Workflow Automation | SystemPro Tech',
      description: 'Automate logistics workflows with AI-powered solutions. From route optimization to warehouse automation, we deliver measurable efficiency improvements.',
      canonical: 'https://www.system-pro.tech/industries/logistics-workflow-automation',
    },
    'ecommerce-systems-integration': {
      title: 'E-Commerce Systems Integration | SystemPro Tech',
      description: 'Integrate e-commerce platforms with ERP, CRM, and legacy systems. Modernize your digital commerce with scalable, secure solutions.',
      canonical: 'https://www.system-pro.tech/industries/ecommerce-systems-integration',
    },
    'education-ai-platforms': {
      title: 'Education AI Platforms | SystemPro Tech',
      description: 'AI-powered learning platforms and educational technology. Personalized learning paths, intelligent assessment, and adaptive content delivery.',
      canonical: 'https://www.system-pro.tech/industries/education-ai-platforms',
    },
  },
  // Location pages
  locations: {
    'austria-ai-integration': {
      title: 'AI Integration Austria | SystemPro Tech',
      description: 'Expert AI integration and software modernization services in Austria. Connect with our Wels office for European AI and legacy system transformation projects.',
      canonical: 'https://www.system-pro.tech/locations/austria-ai-integration',
    },
    'dach-software-modernization': {
      title: 'DACH Software Modernization | SystemPro Tech',
      description: 'Software modernization services for the DACH region (Germany, Austria, Switzerland). Legacy system transformation and digital transformation expertise.',
      canonical: 'https://www.system-pro.tech/locations/dach-software-modernization',
    },
    'germany-business-automation': {
      title: 'Business Automation Germany | SystemPro Tech',
      description: 'Business process automation and workflow optimization services in Germany. Automate operations, reduce costs, and improve efficiency with our expert team.',
      canonical: 'https://www.system-pro.tech/locations/germany-business-automation',
    },
    'switzerland-ai-consulting': {
      title: 'AI Consulting Switzerland | SystemPro Tech',
      description: 'AI consulting and strategy services in Switzerland. Expert guidance on AI adoption, implementation, and integration for Swiss businesses.',
      canonical: 'https://www.system-pro.tech/locations/switzerland-ai-consulting',
    },
  },
  // Regional campaign pages
  regions: {
    'dach-modernization': {
      title: 'DACH Modernization Services | SystemPro Tech',
      description: 'Software modernization and digital transformation services for the DACH region. Expert engineering for German, Austrian, and Swiss enterprises.',
      canonical: 'https://www.system-pro.tech/dach-modernization',
    },
    'gcc-ai-integration': {
      title: 'GCC AI Integration Services | SystemPro Tech',
      description: 'AI integration and digital transformation services for the Gulf Cooperation Council region. Expert solutions for Middle Eastern enterprises.',
      canonical: 'https://www.system-pro.tech/gcc-ai-integration',
    },
    'uk-saas-rescue': {
      title: 'UK SaaS Rescue Services | SystemPro Tech',
      description: 'SaaS platform rescue and modernization services for UK businesses. Expert engineering to stabilize and transform failing SaaS platforms.',
      canonical: 'https://www.system-pro.tech/uk-saas-rescue',
    },
    'asia-ai-integration': {
      title: 'Asia AI Integration Services | SystemPro Tech',
      description: 'AI integration and digital transformation services for Asian enterprises. Expert engineering for regional business modernization.',
      canonical: 'https://www.system-pro.tech/asia-ai-integration',
    },
  },
  // Proof and authority pages
  proof: {
    founder: {
      title: 'Zoran Panev - Founder & CEO | SystemPro Tech',
      description: 'Zoran Panev is the founder and CEO of SystemPro Tech, with over 20 years of experience in software engineering, AI integration, and digital transformation.',
      canonical: 'https://www.system-pro.tech/founder',
      ogTitle: 'Zoran Panev - Founder & CEO | SystemPro Tech',
      ogDescription: 'Experienced software engineer and AI specialist helping European businesses modernize their digital platforms.',
      ogUrl: 'https://www.system-pro.tech/founder',
    },
    'case-studies': {
      title: 'Case Studies | SystemPro Tech',
      description: 'Explore our technical case studies showcasing AI integration, legacy modernization, and digital transformation projects with measurable outcomes.',
      canonical: 'https://www.system-pro.tech/case-studies',
      ogTitle: 'Technical Case Studies | SystemPro Tech',
      ogDescription: 'Real-world examples of AI integration, software modernization, and business automation projects with concrete engineering details and measurable results.',
      ogUrl: 'https://www.system-pro.tech/case-studies',
    },
  },
};

export default Seo;
