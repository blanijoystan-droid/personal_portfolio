import { Project, SkillCategory, ExperienceDay, Achievement, Certification, TimelineEntry } from '@/types/portfolio';

export const PERSONAL_INFO = {
  name: "BLANI JOYSTAN D'CUNHA",
  shortName: "BLANI",
  title: "Computer Science Engineer",
  subtitle: "Full Stack Developer • AI Enthusiast • Builder",
  statement: "I build software systems, explore emerging technology, and turn ideas into working products.",
  philosophy: "Student today. Engineer in progress. Builder by nature.",
  availabilityStatus: "AVAILABLE FOR SOFTWARE / FULL STACK OPPORTUNITIES",
  location: "India",
  education: {
    degree: "Computer Science and Engineering",
    status: "Undergraduate Student",
    focus: "Distributed Systems, Backend Architecture, AI & Cloud Engineering"
  },
  // Configurable URLs
  socials: {
    github: "https://github.com/blanijoystan",
    linkedin: "https://linkedin.com/in/blani-joystan-dcunha",
    email: "blanijoystandcunha@gmail.com",
    portfolioUrl: "https://blanijoystan.dev"
  },
  resume: {
    viewUrl: "/resume.pdf",
    downloadUrl: "/resume.pdf",
    filename: "Blani_Joystan_Dcunha_Resume.pdf"
  }
};

export const TIMELINE_DATA: TimelineEntry[] = [
  {
    year: "2024",
    title: "Foundations & Exploration",
    description: "Started exploring crypto, technology and software development. Built foundational computational thinking and problem solving.",
    status: "completed",
    milestone: "Computer Science Core & Algorithm Basics"
  },
  {
    year: "2025",
    title: "Expansion into Engineering",
    description: "Expanded into web development, programming languages, backend systems, and software engineering principles.",
    status: "completed",
    milestone: "Full-Stack Development & Architecture Fundamentals"
  },
  {
    year: "2026",
    title: "Production Systems & Cloud/AI",
    description: "Focused on full-stack development, AI, cloud, DevOps, event-driven architectures, and building real-world software products.",
    status: "active",
    milestone: "Event-Driven Engines, Cloud Integration, Hackathons"
  },
  {
    year: "2026+",
    title: "Software Engineering Horizons",
    description: "Building towards impactful software engineering opportunities, enterprise distributed architectures, and production-grade engineering.",
    status: "future",
    milestone: "Scalable Systems & Global Engineering Impact"
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "languages",
    name: "Languages",
    code: "LANGUAGE CORE",
    description: "Core programming languages for algorithmic problem solving and system development.",
    skills: [
      { name: "C", tag: "System" },
      { name: "C++", tag: "Algorithms" },
      { name: "Python", tag: "AI / Backend" },
      { name: "Java", tag: "Enterprise" },
      { name: "JavaScript", tag: "Web" },
      { name: "TypeScript", tag: "Type-Safe" }
    ]
  },
  {
    id: "web-backend",
    name: "Web / Backend",
    code: "BACKEND & WEB CORE",
    description: "Modern frameworks and runtime environments for responsive apps and high-throughput servers.",
    skills: [
      { name: "React", tag: "UI Library" },
      { name: "Next.js", tag: "Full-Stack Framework" },
      { name: "Node.js", tag: "Runtime" },
      { name: "Django", tag: "Python Framework" },
      { name: "FastAPI", tag: "High-Performance API" }
    ]
  },
  {
    id: "databases",
    name: "Databases",
    code: "DATABASE CORE",
    description: "Relational, document, and in-memory datastores configured for persistence and caching.",
    skills: [
      { name: "PostgreSQL", tag: "Relational / ACID" },
      { name: "MySQL", tag: "Relational" },
      { name: "MongoDB", tag: "NoSQL / Document" },
      { name: "Redis", tag: "In-Memory / Cache" }
    ]
  },
  {
    id: "cloud-devops",
    name: "Cloud / DevOps",
    code: "CLOUD & DEVOPS CORE",
    description: "Infrastructure, container orchestration, and real-time distributed messaging streams.",
    skills: [
      { name: "AWS", tag: "Cloud Infrastructure" },
      { name: "Docker", tag: "Containerization" },
      { name: "Apache Kafka", tag: "Distributed Streaming" }
    ]
  },
  {
    id: "other",
    name: "Systems & Engineering",
    code: "ENGINEERING FOUNDATION",
    description: "Foundational software engineering methodologies, version control, and system design patterns.",
    skills: [
      { name: "Git", tag: "VCS" },
      { name: "REST APIs", tag: "Protocols" },
      { name: "Distributed Systems", tag: "Architecture" },
      { name: "DSA", tag: "Data Structures & Algos" }
    ]
  }
];

export const PROJECTS_DATA: Project[] = [
  {
    id: "event-driven-notification-engine",
    number: "001",
    name: "Event-Driven Notification Engine",
    subtitle: "High-Throughput Multi-Channel Notification Infrastructure",
    description: "A scalable event-driven notification system designed for multi-channel notification delivery with guaranteed ordering, retries, and rate limiting.",
    technologies: ["Node.js", "Apache Kafka", "RabbitMQ", "Redis", "PostgreSQL", "Docker"],
    problemSolved: "Traditional synchronous notification dispatch blocks web servers, lacks fault tolerance during third-party provider downtime, and causes delivery spam without unified user preferences.",
    keyFeatures: [
      "Multi-channel notifications (Email, SMS, Push, In-App)",
      "User notification preferences & opt-out rules",
      "Automated exponential backoff retries & Dead-Letter Queues (DLQ)",
      "Intelligent message routing based on priority & urgency",
      "Dynamic multi-lingual templating engine",
      "Quiet hours & frequency capping to prevent notification fatigue",
      "End-to-end delivery tracking and latency telemetry",
      "Real-time health monitoring and queue saturation alerting"
    ],
    architectureType: "kafka-streams",
    architectureNodes: [
      { id: "producer", label: "App Events", type: "source", desc: "User triggers & system state alerts" },
      { id: "kafka", label: "Kafka Event Stream", type: "queue", desc: "High-throughput ordered ingestion buffer" },
      { id: "routing", label: "Routing & Template Worker", type: "processor", desc: "Checks user prefs & renders template" },
      { id: "redis", label: "Redis Capping Cache", type: "storage", desc: "Frequency capping & quiet hour state" },
      { id: "rabbitmq", label: "Channel Queues (RabbitMQ)", type: "queue", desc: "Provider queues with retry backoff & DLQ" },
      { id: "postgres", label: "PostgreSQL Ledger", type: "storage", desc: "Audit log & delivery confirmation logs" },
      { id: "dispatch", label: "Multi-Channel Dispatcher", type: "delivery", desc: "SMS, Email, Push gateway connectors" }
    ],
    githubUrl: "https://github.com/blanijoystan/notification-engine",
    metricsOrHighlight: "Fault-tolerant architecture with Dead-Letter Queues & rate-limiting"
  },
  {
    id: "erp-analytics-integration-bridge",
    number: "002",
    name: "ERP Analytics Integration Bridge",
    subtitle: "Financial & Enterprise Data Reconciliation Pipeline",
    description: "An event-driven integration system for processing, validating, transforming, and reconciling financial and ERP data with automated circuit breaking.",
    technologies: ["Python", "Kafka", "PostgreSQL", "Redis", "Docker", "AWS"],
    problemSolved: "Disparate ERP databases and legacy financial systems often produce duplicate transactions, schema drift, and reconciliation mismatches during batch migrations.",
    keyFeatures: [
      "Streamlined data validation and strict schema enforcement",
      "Stateful transformations with schema versioning",
      "Idempotency guarantees preventing duplicate ledger posting",
      "Automated financial reconciliation engine",
      "Configurable retry mechanisms with circuit breakers",
      "Dead-letter queues for malformed transactional payloads",
      "Real-time pipeline monitoring and anomaly detection"
    ],
    architectureType: "data-pipeline",
    architectureNodes: [
      { id: "erp-source", label: "ERP Source Systems", type: "source", desc: "Raw financial transactions & journal records" },
      { id: "kafka-ingest", label: "Kafka Ingestion Topic", type: "queue", desc: "Buffer and partition by entity UUID" },
      { id: "validator", label: "Schema & Idempotency Engine", type: "processor", desc: "Verifies payload & checks Redis unique keys" },
      { id: "circuit-breaker", label: "Circuit Breaker & DLQ", type: "processor", desc: "Fails safe on database degradation" },
      { id: "reconciler", label: "Reconciliation Service", type: "processor", desc: "Verifies ledger balance consistency" },
      { id: "pg-analytics", label: "PostgreSQL Analytics Warehouse", type: "storage", desc: "Clean normalized transactional tables" },
      { id: "aws-dash", label: "AWS Cloud Telemetry", type: "delivery", desc: "CloudWatch health metrics & alerts" }
    ],
    githubUrl: "https://github.com/blanijoystan/erp-analytics-bridge",
    metricsOrHighlight: "Strict idempotency, circuit breakers, and zero data-loss guarantees"
  },
  {
    id: "hospital-queue-management-system",
    number: "003",
    name: "Hospital Queue Management System",
    subtitle: "Intelligent Patient Flow & Consultation Triage",
    description: "A web-based system designed to optimize patient waiting times, automate queue allocation, and provide real-time status visibility across departments.",
    technologies: ["React", "Node.js", "Express", "PostgreSQL", "Socket.io", "Tailwind CSS"],
    problemSolved: "Chaotic physical outpatient crowding, lack of consultation ETA visibility for patients, and inefficient doctor schedule balancing in busy clinical environments.",
    keyFeatures: [
      "Interactive digital patient check-in and automated token generation",
      "Live queue tracking dashboard for patients via mobile/screens",
      "Doctor consultation workstation with patient queue control",
      "Priority triage queue handling for emergency/critical cases",
      "Department-wise routing (Diagnostics, General, Specialist)",
      "Estimated wait time calculation based on average consultation durations"
    ],
    architectureType: "queue-system",
    architectureNodes: [
      { id: "patient-entry", label: "Patient Check-In", type: "source", desc: "Digital token creation & triage priority" },
      { id: "active-queue", label: "Dynamic Queue Engine", type: "queue", desc: "Priority queue ordering & stage transitions" },
      { id: "doctor-desk", label: "Doctor Workstation", type: "processor", desc: "Call next patient, review records, close visit" },
      { id: "consultation", label: "Appointment / Consultation", type: "delivery", desc: "Prescription generation & checkout" }
    ],
    githubUrl: "https://github.com/blanijoystan/hospital-queue-system",
    metricsOrHighlight: "Streamlined Patient → Queue → Doctor → Appointment flow"
  },
  {
    id: "offline-sos-bridge",
    number: "004",
    name: "Offline SOS Bridge",
    subtitle: "Cell Tower Mesh Emergency Network Without Internet",
    description: "An offline SOS mobile and backend application for emergency disaster situations where cellular internet infrastructure is down.",
    technologies: ["Flutter", "Dart", "Python", "Supabase", "Cellular Protocol"],
    problemSolved: "During natural disasters, riots, or remote mountain terrain failures, internet access vanishes, leaving victims unable to transmit emergency coordinates to rescue workers.",
    keyFeatures: [
      "Zero-internet emergency distress transmission",
      "Utilizes low-level cellular tower signal pings / SMS payloads without mobile data",
      "Offline coordinates mapping: both victim and rescuer locations accessible offline",
      "Battery-efficient background distress beaconing",
      "Local cached offline maps for geographic orientation",
      "Automatic data sync with Supabase cloud when back in coverage zone"
    ],
    architectureType: "offline-mesh",
    architectureNodes: [
      { id: "victim-device", label: "Victim Device (SOS Trigger)", type: "device", desc: "Captures GPS coordinates & distress status" },
      { id: "cell-tower", label: "Cell Tower Ping / SMS Carrier", type: "queue", desc: "Non-data cellular signal transmission" },
      { id: "rescuer-device", label: "Rescuer Offline HUD", type: "device", desc: "Displays victim location vector without internet" },
      { id: "supabase-sync", label: "Supabase Cloud Sync", type: "storage", desc: "Central incident logging once online" }
    ],
    githubUrl: "https://github.com/blanijoystan/offline-sos-bridge",
    metricsOrHighlight: "Zero-data emergency signaling & offline dual-location mapping"
  }
];

export const EXPERIENCE_DATA = {
  company: "ZETHETA",
  role: "SOFTWARE / DEVOPS ENGINEERING INTERNSHIP",
  period: "Engineering Intensive",
  summary: "Deep dive into production-grade event-driven architectures, cloud infrastructure automation, system reliability, and API development.",
  techFocus: [
    "Event-driven systems",
    "API development",
    "Cloud / infrastructure",
    "Monitoring",
    "Kafka",
    "PostgreSQL",
    "AWS",
    "Runbooks",
    "System reliability"
  ],
  pipelineSteps: [
    { step: "01", name: "Client API", detail: "REST / Gateway Ingestion" },
    { step: "02", name: "Processing", detail: "Validation & Transformation" },
    { step: "03", name: "Kafka Stream", detail: "Distributed Event Partitioning" },
    { step: "04", name: "Database", detail: "PostgreSQL Persistence" },
    { step: "05", name: "Monitoring", detail: "Telemetry & SRE Runbooks" }
  ],
  journeyDays: [
    {
      day: 1,
      phase: "Architecture Onboarding",
      title: "Distributed Infrastructure & Tooling Setup",
      summary: "Understood repository topography, local containerized services with Docker, and cloud infrastructure baselines.",
      techFocus: ["Docker", "Git", "Dev Environment"]
    },
    {
      day: 2,
      phase: "API Design",
      title: "API Development & Specification",
      summary: "Authored robust RESTful endpoints with input sanitation, request contract validation, and structured error responses.",
      techFocus: ["API Design", "Node/Python", "Contracts"]
    },
    {
      day: 3,
      phase: "Streaming Fundamentals",
      title: "Kafka Event-Driven Architecture",
      summary: "Explored topic partitions, producer/consumer group offsets, and message serialization protocols.",
      techFocus: ["Apache Kafka", "Message Broker", "Partitions"]
    },
    {
      day: 4,
      phase: "Persistence Layer",
      title: "PostgreSQL Schema & Index Optimization",
      summary: "Designed relational schemas, foreign key relationships, connection pooling, and indexing strategies.",
      techFocus: ["PostgreSQL", "Database Design", "Indexing"]
    },
    {
      day: 5,
      phase: "Cloud Provisioning",
      title: "AWS Cloud Infrastructure Exploration",
      summary: "Explored cloud services, IAM policies, compute instances, secure networking VPCs, and storage buckets.",
      techFocus: ["AWS", "IAM", "VPC", "EC2"]
    },
    {
      day: 6,
      phase: "Observability",
      title: "System Monitoring & Metric Collection",
      summary: "Integrated health check endpoints, structured logging formats, and error rate monitoring.",
      techFocus: ["Telemetry", "Metrics", "Logging"]
    },
    {
      day: 7,
      phase: "Fault Tolerance",
      title: "Retry Policies & Failure Handling",
      summary: "Implemented backoff policies, dead-letter storage, and idempotent event consumer patterns.",
      techFocus: ["Fault Tolerance", "DLQ", "Idempotency"]
    },
    {
      day: 8,
      phase: "Operations & Runbooks",
      title: "Runbooks & Incident Response Workflows",
      summary: "Documented systematic operational procedures, service recovery protocols, and outage triage checklists.",
      techFocus: ["Runbooks", "Standard Ops", "SRE"]
    },
    {
      day: 9,
      phase: "Performance & Reliability",
      title: "System Reliability & Load Stress Review",
      summary: "Audited system bottlenecks, concurrency limits, latency benchmarks, and resilience safeguards.",
      techFocus: ["System Reliability", "Benchmarking"]
    },
    {
      day: 10,
      phase: "Synthesis & Delivery",
      title: "End-to-End System Integration & Review",
      summary: "Validated complete flow: API → Processing → Kafka → PostgreSQL → Monitoring, presenting results and insights.",
      techFocus: ["Full Pipeline", "Architecture Review"]
    }
  ] as ExperienceDay[]
};

export const ACHIEVEMENTS_DATA: Achievement[] = [
  {
    id: "mec-hackathon-3rd",
    title: "3rd Place Winner",
    event: "24-Hour Hackathon",
    location: "Malnad College of Engineering, Hassan",
    award: "3RD PLACE PODIUM FINISH",
    isTopAward: true,
    badgeType: "gold",
    description: "Secured 3rd place in an intensive 24-hour hackathon competing against engineering teams, designing, building, and deploying a functional tech prototype under strict time constraints."
  },
  {
    id: "sahyadri-devhost",
    title: "Project Showcase: SOS Offline Bridge",
    event: "Sahyadri DevHost",
    location: "Sahyadri College of Engineering",
    award: "FEATURED INNOVATION",
    isTopAward: false,
    badgeType: "cyan",
    description: "Presented the Offline SOS Bridge project, demonstrating how emergency distress pings and dual victim-rescuer coordinate mapping can operate reliably without active internet connectivity."
  },
  {
    id: "singularity-hackathon",
    title: "Hackathon Participant & Builder",
    event: "Singularity Hackathon",
    award: "TECHNICAL PARTICIPATION",
    isTopAward: false,
    badgeType: "silver",
    description: "Competed in Singularity Hackathon, collaborating under pressure to build software solutions addressing modern computing and automation challenges."
  }
];

export const CERTIFICATIONS_DATA: Certification[] = [
  {
    id: "anthropic-ai-fluency",
    title: "AI Fluency: Framework & Foundations",
    issuer: "Anthropic Education",
    description: "Comprehensive foundational certification on Large Language Models, prompt architectures, safety guardrails, and enterprise AI integration principles.",
    skills: ["AI Systems", "Prompt Engineering", "LLM Foundations", "Safety"],
    verifyUrl: "https://anthropic.com"
  },
  {
    id: "ibm-credentials",
    title: "IBM Learning & Certification Achievements",
    issuer: "IBM",
    description: "Professional learning tracks covering cloud computing concepts, enterprise software architecture, and modern programming practices.",
    skills: ["Cloud Foundations", "Enterprise IT", "Software Engineering"],
    verifyUrl: "https://www.ibm.com/training"
  },
  {
    id: "deloitte-data-analytics",
    title: "Data Analytics Certificate",
    issuer: "Deloitte",
    description: "Practical certificate in data analytics methodologies, dataset exploration, statistical interpretation, and business intelligence insights.",
    skills: ["Data Analytics", "Data Modeling", "Business Intelligence", "Problem Solving"],
    verifyUrl: "https://www.deloitte.com"
  }
];

export const SYSTEM_NODES = [
  { id: "home", label: "BLANI CORE", code: "CORE-00", coordinates: [0, 0, 0] },
  { id: "about", label: "ABOUT NODE", code: "BIO-01", coordinates: [-4, 2, -2] },
  { id: "skills", label: "TECH LAB", code: "SKL-02", coordinates: [-6, -1, 3] },
  { id: "projects", label: "PROJECT ARCHIVE", code: "PRJ-03", coordinates: [5, 2, 2] },
  { id: "experience", label: "ZETHETA EXP", code: "EXP-04", coordinates: [4, -3, -3] },
  { id: "achievements", label: "ACHIEVEMENT VAULT", code: "ACH-05", coordinates: [0, 4, 3] },
  { id: "certifications", label: "CREDENTIAL ARCHIVE", code: "CRT-06", coordinates: [-3, -4, 1] },
  { id: "contact", label: "COMM GATEWAY", code: "COM-07", coordinates: [0, -5, -2] }
];
