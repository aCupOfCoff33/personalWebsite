export const resumeData = {
  personalInfo: {
    name: "Aaryan Joharapurkar",
    email: "ajoharap@uwo.ca",
    phone: "+1 (226) 504-0323",
    location: "London, ON",
    linkedin: "https://www.linkedin.com/in/aaryan-joharapurkar/",
    github: "https://github.com/aCupOfCoff33",
    resumeUrl: "/Aaryan Joharapurkar SWE Resume Neo.pdf"
  },

  workExperience: [
    {
      id: 'american-global-2025',
      company: 'American Global',
      position: 'Data Analytics & Strategy Intern',
      location: 'Oakville, ON',
      dateRange: 'May 2025 - Present',
      logo: 'https://media.licdn.com/dms/image/v2/C4E0BAQFxOWSzcQlx7w/company-logo_200_200/company-logo_200_200/0/1672776000338/american_global_llc_logo?e=2147483647&v=beta&t=6eASPMK3qET6z-fVO8yv4YWrhgf7l7wjaAwu_iF8q2s',
      highlights: [
        'ETL Schema Migration - Unified 30+ Excel sheets into a structured Sanity database.',
        'Market Selector App - Built React + LLM tool reducing manual lookup time from weeks to minutes.',
        'IoT Dashboard - Integrated Azure SSO and Sanity CMS for cost-saving device recommendations.'
      ]
    },
    {
      id: 'esdc-2024',
      company: 'Employment and Social Development Canada',
      position: 'Financial Services Officer',
      location: 'North York, ON',
      dateRange: 'May 2024 - Aug 2024',
      logo: 'https://avatars.githubusercontent.com/u/20973642?s=280&v=4',
      highlights: [
        'SAP + Power BI Automation - Created ETL workflows resolving $150K+ in suspended transactions.',
        'Accuracy Framework - Reduced financial transaction errors by 80% using analytics checks.',
        'Workflow Optimization - Improved reconciliation for 1,200+ daily transactions nationwide.'
      ]
    },
    {
      id: 'western-dev-society-2024',
      company: 'Western Developers Society',
      position: 'Vice President of Developer Operations',
      location: 'London, ON',
      dateRange: 'Sept 2023 - Present',
      logo: 'https://media.licdn.com/dms/image/v2/D4E0BAQEuc4ov6cWAtw/company-logo_200_200/company-logo_200_200/0/1736450937302/western_dev_society_logo?e=2147483647&v=beta&t=oYKXg7b_w-tYzt847EjXLG_VgKi9qecWt6vndmafe_g',
      highlights: [
        'Agile Leadership - Oversaw 120+ developers across multiple cross-functional projects.',
        'Robotics Infrastructure - Built React Native + API systems for autonomous agent software.',
        'Technical Workshops - Led Figma and JavaScript sessions for 200+ students.'
      ]
    },
    {
      id: 'ivey-fintech-2024',
      company: 'Ivey FinTech',
      position: 'Consultant Analyst',
      location: 'London, ON',
      dateRange: 'Sept 2024 - Apr 2025',
      logo: 'https://miro.medium.com/v2/resize:fit:512/1*429tXOeB5sYvQ37L-zasBQ.jpeg',
      highlights: [
        'AI Strategy Consulting - Identified automation opportunities for a national fintech client.',
        'Product Roadmapping - Delivered Figma prototypes and executive-ready strategy briefs.',
        'Market Research - Produced competitive analysis guiding product and AI initiatives.'
      ]
    },
    {
      id: 'minimart-2023',
      company: 'Minimart',
      position: 'Business Analyst',
      location: 'London, ON',
      dateRange: 'Sept 2022 - Mar 2023',
      logo: 'https://banner2.cleanpng.com/20180630/xcw/aax01zjeu.webp',
      highlights: [
        'Financial Modeling - Built cash flow and ROI models to assess expansion feasibility.',
        'Market Analysis - Segmented markets to identify 12% growth opportunities.',
        'Strategic Evaluation - Recommended changes improving profitability and efficiency.'
      ]
    }
  ],

  education: [
    {
      id: 'western-ivey',
      institution: 'Western University & Ivey Business School',
      degree: 'BESc Software Engineering + HBA Business (Dual Degree)',
      location: 'London, ON',
      dateRange: '2022 - 2027',
      gpa: '3.7/4.0',
      relevantCourses: [
        'Data Structures & Algorithms',
        'Software Construction & Design',
        'Decision Making with Analytics',
        'Corporate Strategy'
      ]
    }
  ],

  projects: [
    {
      id: 'tradeoff-hackthenorth',
      name: 'TradeOff – Hack the North 2nd Place (AWS)',
      description: 'Stock simulation game using Cerebras AI + AWS DynamoDB Streams for real-time finance.',
      technologies: ['Python', 'React', 'AWS DynamoDB', 'Cerebras API'],
      link: 'https://devpost.com/software/tradeoff'
    },
    {
      id: 'western-alumni',
      name: 'Western Alumni Network',
      description: 'React + Tailwind platform connecting 2,000+ students with 300+ alumni using Python backend.',
      technologies: ['React', 'Tailwind CSS', 'Python', 'TypeScript'],
      link: 'https://github.com/aCupOfCoff33/alumniverse'
    },
    {
      id: 'personal-website',
      name: 'Personal Portfolio Website',
      description: 'Interactive React site with motion-based design and responsive layout.',
      technologies: ['React', 'Tailwind CSS', 'Framer Motion'],
      link: 'https://github.com/aCupOfCoff33/personalWebsite'
    }
  ],

  skills: {
    languages: ['Python', 'JavaScript', 'SQL', 'Java', 'C++', 'R'],
    frameworks: ['React', 'Node.js', 'Express', 'Flask', 'Tailwind CSS'],
    tools: ['Git', 'SAP', 'Power BI', 'AWS', 'Figma', 'VS Code', 'Tableau'],
    concepts: ['ETL Pipelines', 'Data Visualization', 'Machine Learning', 'API Design', 'Agile Delivery']
  }
};

export default resumeData;
