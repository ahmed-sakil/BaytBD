"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding BaytBD Group database...');
    // 1. Create Super Admin
    const adminPassword = await bcryptjs_1.default.hash('Admin@123456', 10);
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@baytbd.com' },
        update: {},
        create: {
            name: 'BaytBD Super Administrator',
            email: 'admin@baytbd.com',
            passwordHash: adminPassword,
            role: client_1.Role.SUPER_ADMIN,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        },
    });
    console.log(`Created admin user: ${adminUser.email}`);
    // 2. Global Site Settings
    const settings = [
        { key: 'company_name', value: 'BaytBD Group of Companies', description: 'Official corporate title' },
        { key: 'tagline', value: 'One Group. Three Businesses. One Digital Ecosystem.', description: 'Corporate tagline' },
        { key: 'primary_phone', value: '+880 2 8878901', description: 'Headquarters telephone' },
        { key: 'hotline', value: '+880 1800-BAYTBD (229823)', description: 'Customer support hotline' },
        { key: 'primary_email', value: 'info@baytbd.com', description: 'Official general email' },
        { key: 'corporate_address', value: 'Bayt Tower, Level 14, Gulshan-2, Dhaka-1212, Bangladesh', description: 'Corporate HQ address' },
        { key: 'agro_email', value: 'agro@baytbd.com', description: 'Agro vertical email' },
        { key: 'development_email', value: 'development@baytbd.com', description: 'Real estate vertical email' },
        { key: 'it_email', value: 'it@baytbd.com', description: 'IT vertical email' },
    ];
    for (const s of settings) {
        await prisma.siteSetting.upsert({
            where: { key: s.key },
            update: { value: s.value },
            create: s,
        });
    }
    // 3. Bayt Agro Categories & Products
    const organicCat = await prisma.category.upsert({
        where: { slug: 'organic-grains-pulses' },
        update: {},
        create: {
            name: 'Organic Grains & Pulses',
            slug: 'organic-grains-pulses',
            description: 'Premium naturally cultivated grains and pulses from our certified northern farms.',
            image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
        },
    });
    const dairyCat = await prisma.category.upsert({
        where: { slug: 'dairy-fresh' },
        update: {},
        create: {
            name: 'Dairy & Natural Farm Produce',
            slug: 'dairy-fresh',
            description: 'Fresh dairy items and natural honey sourced with zero additives.',
            image: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=600&q=80',
        },
    });
    const inputsCat = await prisma.category.upsert({
        where: { slug: 'agro-inputs-fertilizer' },
        update: {},
        create: {
            name: 'Bio-Fertilizers & Agro Supplies',
            slug: 'agro-inputs-fertilizer',
            description: 'Sustainable eco-friendly bio-fertilizers and high-yield certified seeds.',
            image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
        },
    });
    // Agro Products
    await prisma.product.upsert({
        where: { slug: 'bayt-pure-mustard-oil-5l' },
        update: {},
        create: {
            name: 'Bayt Agro Cold-Pressed Premium Mustard Oil (5L)',
            slug: 'bayt-pure-mustard-oil-5l',
            sku: 'AGRO-OIL-001',
            price: 1350,
            discountPrice: 1250,
            stockQuantity: 150,
            unit: 'bottle (5L)',
            description: '100% natural, first-press cold extracted mustard oil produced from selected organic mustard seeds. Retains natural pungency, aroma, and rich antioxidants.',
            specifications: {
                extraction: 'Wood-pressed (Ghani) cold extract',
                packaging: 'Food-grade BPA free 5L canister',
                shelfLife: '12 Months',
                certifications: 'BSTI & Organic Farm Certified',
            },
            benefits: ['Preserves natural antioxidants and Omega-3', 'Zero chemical processing or bleaching', 'Pure traditional aroma and flavor'],
            isFeatured: true,
            categoryId: organicCat.id,
            images: {
                create: [
                    { imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', isPrimary: true, sortOrder: 0 },
                ],
            },
        },
    });
    await prisma.product.upsert({
        where: { slug: 'bayt-organic-kalijira-aromatic-rice-5kg' },
        update: {},
        create: {
            name: 'Bayt Agro Premium Kalijira Polao Rice (5kg)',
            slug: 'bayt-organic-kalijira-aromatic-rice-5kg',
            sku: 'AGRO-RICE-002',
            price: 680,
            discountPrice: 620,
            stockQuantity: 280,
            unit: 'bag (5kg)',
            description: 'Finest quality aromatic Kalijira rice grown in the fertile soils of Dinajpur. Known for its delicate texture, exquisite fragrance, and authentic taste.',
            specifications: {
                origin: 'Dinajpur, Bangladesh',
                aging: 'Naturally aged for 6 months',
                grainLength: 'Short delicate grain',
            },
            benefits: ['100% unadulterated aromatic grain', 'Ideal for biryani, polao, and festive desserts', 'Direct from contract farmers'],
            isFeatured: true,
            categoryId: organicCat.id,
            images: {
                create: [
                    { imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', isPrimary: true, sortOrder: 0 },
                ],
            },
        },
    });
    await prisma.product.upsert({
        where: { slug: 'bayt-sundarban-raw-honey-1kg' },
        update: {},
        create: {
            name: 'Bayt Raw Wildflower & Mangrove Honey (1kg)',
            slug: 'bayt-sundarban-raw-honey-1kg',
            sku: 'AGRO-HNY-003',
            price: 1100,
            discountPrice: 990,
            stockQuantity: 90,
            unit: 'jar (1kg)',
            description: 'Raw, unprocessed honey harvested directly from ethical forest collectors in the Sundarbans mangrove biosphere. Unpasteurized to preserve active pollen and enzymes.',
            specifications: {
                origin: 'Sundarbans Mangrove Forest',
                moisture: 'Below 19% naturally',
                processing: 'Raw cold-filtered',
            },
            benefits: ['High therapeutic pollen concentration', 'No added sugars, preservatives, or heating', 'Rich deep amber flavor profile'],
            isFeatured: true,
            categoryId: dairyCat.id,
            images: {
                create: [
                    { imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80', isPrimary: true, sortOrder: 0 },
                ],
            },
        },
    });
    await prisma.product.upsert({
        where: { slug: 'bayt-eco-organic-compost-25kg' },
        update: {},
        create: {
            name: 'Bayt Bio-Enriched Organic Compost Fertilizer (25kg)',
            slug: 'bayt-eco-organic-compost-25kg',
            sku: 'AGRO-FERT-004',
            price: 550,
            discountPrice: null,
            stockQuantity: 400,
            unit: 'sack (25kg)',
            description: 'Advanced aerobic fermented bio-compost enriched with beneficial nitrogen-fixing microbes, mycorrhizae, and balanced trace minerals for commercial agriculture.',
            specifications: {
                organicCarbon: '> 18%',
                pH: '6.5 - 7.5',
                npkRatio: 'Balanced trace organic composition',
            },
            benefits: ['Enhances soil microbial flora and moisture holding', 'Reduces dependence on synthetic chemical inputs', 'Eco-friendly and sustainable'],
            isFeatured: false,
            categoryId: inputsCat.id,
            images: {
                create: [
                    { imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80', isPrimary: true, sortOrder: 0 },
                ],
            },
        },
    });
    // 4. Bayt Development (Real Estate Projects)
    await prisma.developmentProject.upsert({
        where: { slug: 'bayt-horizon-residences-gulshan' },
        update: {},
        create: {
            title: 'Bayt Horizon Residences',
            slug: 'bayt-horizon-residences-gulshan',
            projectType: client_1.ProjectType.RESIDENTIAL,
            status: client_1.ProjectStatus.ONGOING,
            location: 'Road 71, Gulshan-2, Dhaka',
            city: 'Dhaka',
            landArea: '18 Kathas',
            numberOfFloors: 'G + 16 Floors',
            units: '32 Ultra-Luxury Condominiums',
            parking: '64 Dedicated Basement Spots',
            completionDate: 'June 2027',
            featuredImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
            description: 'An architectural masterpiece overlooking the serene Gulshan lake, Bayt Horizon combines modern Scandinavian minimalism with opulent private living. Featuring double-height lobbies, private elevator lobbies, and smart climate control.',
            features: ['Panoramic floor-to-ceiling soundproof German glazing', 'VRF centralized air-conditioning system', 'Private infinity edge rooftop pool', 'Three-tier biometric security screening'],
            facilities: ['Infinity Rooftop Pool', 'State-of-the-art Gym & Spa', 'Executive Business Lounge', '24/7 Redundant Power Backup', 'EV Charging Station'],
            isFeatured: true,
            images: {
                create: [
                    { imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80', caption: 'Exterior Skyline View', category: 'EXTERIOR' },
                    { imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80', caption: 'Living Lounge & Balcony', category: 'INTERIOR' },
                    { imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80', caption: 'Master Suite & Dressing Room', category: 'INTERIOR' },
                ],
            },
        },
    });
    await prisma.developmentProject.upsert({
        where: { slug: 'bayt-civic-tower-commercial' },
        update: {},
        create: {
            title: 'Bayt Civic Centre & Corporate Tower',
            slug: 'bayt-civic-tower-commercial',
            projectType: client_1.ProjectType.COMMERCIAL,
            status: client_1.ProjectStatus.COMPLETED,
            location: 'Plot 4, Motijheel C/A, Dhaka',
            city: 'Dhaka',
            landArea: '25 Kathas',
            numberOfFloors: 'B3 + G + 24 Floors',
            units: 'Grade-A Corporate Floorplates',
            parking: '140 Vehicles (Triple Basement)',
            completionDate: 'March 2024',
            featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
            description: 'A LEED Platinum certified corporate high-rise catering to multinational financial institutions, consulting firms, and telecom leaders in the heart of Dhaka’s business district.',
            features: ['LEED Platinum Green Building certified', 'High-speed destination-dispatch elevators', 'Intelligent building management system (BMS)', 'Advanced fire suppression with dedicated refuge areas'],
            facilities: ['Helipad at Rooftop', '500-Seat Auditorium & Conference Center', 'Multi-cuisine Cafeteria', 'Full Fiber-Optic Backbone', 'ATM & Bank Booths'],
            isFeatured: true,
            images: {
                create: [
                    { imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80', caption: 'Tower Facade at Sunset', category: 'EXTERIOR' },
                    { imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80', caption: 'Grand Reception & Lobby', category: 'INTERIOR' },
                ],
            },
        },
    });
    await prisma.developmentProject.upsert({
        where: { slug: 'bayt-green-villas-gazipur' },
        update: {},
        create: {
            title: 'Bayt Green Valley Eco-Villas',
            slug: 'bayt-green-villas-gazipur',
            projectType: client_1.ProjectType.RESIDENTIAL,
            status: client_1.ProjectStatus.UPCOMING,
            location: 'Near Bhawal National Forest, Gazipur',
            city: 'Gazipur',
            landArea: '45 Bighas',
            numberOfFloors: 'Duplex & Triplex Villas',
            units: '60 Contemporary Lakeview Villas',
            parking: 'Private Driveways & Garages',
            completionDate: 'December 2028',
            featuredImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80',
            description: 'Exclusive gated community villas designed around a natural rainwater lake and lush canopy forests. Eco-conscious construction using solar micro-grids and organic community farming.',
            features: ['Solar-powered sustainable community microgrid', 'Private organic vegetable gardening patch for each villa', 'Natural freshwater lake with boating dock', 'Jogging trail and cycling path across 45 bighas'],
            facilities: ['Lakeside Clubhouse', 'Organic Farmers Market', 'Tennis & Badminton Courts', 'Daycare & Wellness Clinic', 'Golf Putting Green'],
            isFeatured: true,
            images: {
                create: [
                    { imageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80', caption: 'Eco Villa Architectural Render', category: 'EXTERIOR' },
                ],
            },
        },
    });
    // 5. Bayt IT Services & Projects
    await prisma.iTService.upsert({
        where: { slug: 'enterprise-custom-software' },
        update: {},
        create: {
            title: 'Custom Enterprise Software Engineering',
            slug: 'enterprise-custom-software',
            shortDesc: 'Bespoke ERP, CRM, and mission-critical cloud software systems built for high throughput and scalability.',
            fullDesc: 'We architect and build tailored enterprise systems that automate complex corporate workflows, streamline supply chains, and modernize legacy IT infrastructures. Backed by domain expertise in banking, logistics, retail, and manufacturing.',
            iconName: 'Code2',
            features: ['Microservices & Event-Driven Architecture', 'Legacy Modernization & Cloud Migration', 'End-to-end Automated CI/CD Pipelines', 'Strict ISO 27001 Security Compliance'],
            technologies: ['Node.js', 'Go', 'Python', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS'],
            isFeatured: true,
            sortOrder: 1,
        },
    });
    await prisma.iTService.upsert({
        where: { slug: 'cloud-devops-infrastructure' },
        update: {},
        create: {
            title: 'Cloud Architecture & DevOps Operations',
            slug: 'cloud-devops-infrastructure',
            shortDesc: 'High-availability cloud migrations, automated multi-region deployments, and 24/7 infrastructure observability.',
            fullDesc: 'Maximize uptime and reduce cloud expenditure with our battle-tested DevOps engineering. From infrastructure-as-code (Terraform) to zero-downtime Kubernetes deployments and disaster recovery orchestration.',
            iconName: 'Cloud',
            features: ['Zero-Downtime Multi-Region Deployments', 'Cost Optimization & FinOps Auditing', 'Infrastructure as Code (Terraform & Ansible)', 'Real-time Datadog & Prometheus Telemetry'],
            technologies: ['AWS', 'Google Cloud', 'Terraform', 'Kubernetes', 'Prometheus', 'Grafana'],
            isFeatured: true,
            sortOrder: 2,
        },
    });
    await prisma.iTService.upsert({
        where: { slug: 'ai-automation-data-solutions' },
        update: {},
        create: {
            title: 'AI, Machine Learning & Intelligent Automation',
            slug: 'ai-automation-data-solutions',
            shortDesc: 'Practical enterprise AI solutions: Computer vision, conversational agents, predictive forecasting, and process automation.',
            fullDesc: 'Transform raw enterprise data into actionable predictive insights. We build custom machine learning pipelines, LLM-powered internal document search engines, and computer vision systems for quality control.',
            iconName: 'Cpu',
            features: ['Custom RAG & Enterprise Knowledge LLMs', 'Predictive Supply Chain & Demand Forecasting', 'OCR & Automated Document Processing', 'Computer Vision Quality Inspection'],
            technologies: ['PyTorch', 'TensorFlow', 'OpenAI', 'Gemini APIs', 'LangChain', 'FastAPI'],
            isFeatured: true,
            sortOrder: 3,
        },
    });
    // IT Projects / Case Studies
    await prisma.iTProject.upsert({
        where: { slug: 'fintech-core-banking-gateway' },
        update: {},
        create: {
            title: 'Next-Gen Unified Digital Banking & Payment Engine',
            slug: 'fintech-core-banking-gateway',
            industry: 'FinTech & Banking',
            clientName: 'Premier Commercial Bank Ltd.',
            technologies: ['Node.js', 'Go', 'PostgreSQL', 'Redis', 'Kafka', 'Docker'],
            featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
            summary: 'Architected and delivered a sub-100ms transactional routing gateway handling over 1.2 million daily mobile banking transactions with 99.999% uptime.',
            challenges: 'Legacy mainframe systems were failing under peak hour mobile app transactions, causing high drop-off rates and transaction reconciliation errors.',
            solutions: 'Deployed a decoupled event-driven architecture using Apache Kafka and Redis cluster with distributed transaction locks and automated anomaly detection.',
            results: '99.999% platform availability maintained during Eid and festival peaks; reduced transaction settlement times from 3.5 seconds to 120 milliseconds.',
            liveUrl: 'https://baytbd.com/it/case-studies/banking-gateway',
            isFeatured: true,
            sortOrder: 1,
        },
    });
    // 6. Leadership & Team
    const team = [
        {
            name: 'Engr. Tariqul Islam',
            role: 'Group Chairman & Founder',
            department: client_1.Department.EXECUTIVE,
            bio: 'Visionary industrialist with over 28 years of leadership across agricultural supply chains, large-scale civil infrastructure, and emerging tech enterprises.',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
            skills: ['Strategic Corporate Governance', 'Real Estate Development', 'Macro Investment'],
            socials: { linkedin: 'https://linkedin.com', email: 'chairman@baytbd.com' },
            sortOrder: 1,
        },
        {
            name: 'Dr. Shahana Rahman',
            role: 'Managing Director, Bayt Agro',
            department: client_1.Department.AGRO,
            bio: 'Leading agronomist and supply chain pioneer dedicated to chemical-free agriculture, ethical farming partnerships, and cold-chain innovations across Bangladesh.',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
            skills: ['Agricultural Biotechnology', 'Cold-Chain Logistics', 'Organic Standards'],
            socials: { linkedin: 'https://linkedin.com', email: 'shahana@baytbd.com' },
            sortOrder: 2,
        },
        {
            name: 'Arch. Mahmudul Hasan, MIAB',
            role: 'Chief Architect & Director, Bayt Development',
            department: client_1.Department.DEVELOPMENT,
            bio: 'Award-winning architectural director with extensive portfolio in sustainable commercial skyscrapers and luxury residential landmarks.',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
            skills: ['LEED Green Building', 'Urban Planning', 'Structural Aesthetics'],
            socials: { linkedin: 'https://linkedin.com', email: 'hasan@baytbd.com' },
            sortOrder: 3,
        },
        {
            name: 'Samiur Rashid',
            role: 'Chief Technology Officer (CTO), Bayt IT',
            department: client_1.Department.IT,
            bio: 'Former Silicon Valley software architect leading Bayt IT’s engineering teams in cloud scalability, AI automation, and high-security enterprise solutions.',
            image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
            skills: ['Distributed Systems', 'Cloud Security', 'AI & Machine Learning'],
            socials: { linkedin: 'https://linkedin.com', email: 'samiur@baytbd.com' },
            sortOrder: 4,
        },
    ];
    for (const t of team) {
        await prisma.teamMember.create({ data: t });
    }
    // 7. News & Announcements
    await prisma.newsArticle.upsert({
        where: { slug: 'baytbd-unveils-integrated-digital-ecosystem' },
        update: {},
        create: {
            title: 'BaytBD Group Unveils Integrated Digital Ecosystem for Agro, Development & IT',
            slug: 'baytbd-unveils-integrated-digital-ecosystem',
            category: client_1.Department.CORPORATE,
            content: 'BaytBD Group of Companies has officially announced the launch of its integrated digital platform, bringing together its core business verticals under one unified technological umbrella. This digital milestone facilitates direct-to-consumer organic agricultural commerce, transparent property discovery, and state-of-the-art enterprise technology services.',
            excerpt: 'A historic milestone unifying Bayt Agro, Bayt Development, and Bayt IT into a centralized technological ecosystem.',
            featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
            isPublished: true,
            authorId: adminUser.id,
        },
    });
    // 8. Job Openings
    await prisma.jobPost.upsert({
        where: { slug: 'senior-full-stack-engineer-it' },
        update: {},
        create: {
            title: 'Senior Full Stack Software Engineer',
            slug: 'senior-full-stack-engineer-it',
            department: client_1.Department.IT,
            location: 'Gulshan-2, Dhaka (Hybrid)',
            employmentType: 'Full-time',
            description: 'Bayt IT is seeking an experienced Full Stack Engineer proficient in React, Node.js, and PostgreSQL to lead high-impact enterprise FinTech and Cloud application development.',
            requirements: ['4+ years of production experience in TypeScript, React, and Node.js', 'Deep understanding of PostgreSQL and database query optimization', 'Experience with cloud infrastructure (Docker, AWS) and CI/CD', 'Strong communication and architectural leadership capabilities'],
            benefits: ['Competitive compensation package', 'Annual festival bonuses (2x)', 'Comprehensive health & life insurance', 'Subsidized lunch & gym membership'],
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            isActive: true,
        },
    });
    console.log('Database seeded successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
