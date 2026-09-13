import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../config/prisma';
import { Department, InquiryStatus } from '@prisma/client';

// Team members
export const getTeam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { department } = req.query;
    const where: any = { isActive: true };
    if (department && department !== 'ALL') {
      where.department = department as Department;
    }
    const team = await prisma.teamMember.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, team });
  } catch (error) {
    next(error);
  }
};

// News Articles
export const getNews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category } = req.query;
    const where: any = { isPublished: true };
    if (category && category !== 'ALL') {
      where.category = category as Department;
    }
    const articles = await prisma.newsArticle.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
    });
    res.json({ success: true, articles });
  } catch (error) {
    next(error);
  }
};

export const getNewsBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;
    const article = await prisma.newsArticle.findUnique({
      where: { slug },
    });
    if (!article) {
      res.status(404).json({ success: false, message: 'Article not found' });
      return;
    }
    res.json({ success: true, article });
  } catch (error) {
    next(error);
  }
};

// Careers (Job Posts)
export const getJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const jobs = await prisma.jobPost.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, jobs });
  } catch (error) {
    next(error);
  }
};

// Job Application submission
const applyJobSchema = z.object({
  jobId: z.string(),
  applicantName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  resumeUrl: z.string().optional(),
  coverLetter: z.string().optional(),
});

export const applyJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = applyJobSchema.parse(req.body);
    const application = await prisma.jobApplication.create({
      data,
    });
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! Our HR team will contact shortlisted candidates.',
      application,
    });
  } catch (error) {
    next(error);
  }
};

// General Inquiries
const generalInquirySchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Please provide a valid email address'),
  phone: z.string().optional().nullable().or(z.literal('')),
  company: z.string().optional().nullable().or(z.literal('')),
  departmentTarget: z
    .nativeEnum(Department)
    .or(
      z.string().transform((val) => {
        const upper = val.toUpperCase();
        return (Department as any)[upper] || Department.CORPORATE;
      })
    )
    .default(Department.CORPORATE),
  subject: z
    .string()
    .optional()
    .nullable()
    .or(z.literal(''))
    .transform((val) => (val && val.trim().length > 0 ? val.trim() : 'General Business Inquiry')),
  message: z.string().trim().min(1, 'Message cannot be empty'),
});

export const submitGeneralInquiry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = generalInquirySchema.parse(req.body);
    if (data.subject === 'General Business Inquiry' && data.departmentTarget === Department.PARTNERSHIP) {
      data.subject = 'Strategic Partnership Proposal';
    }
    const inquiry = await prisma.generalInquiry.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        departmentTarget: data.departmentTarget as Department,
        subject: data.subject,
        message: data.message,
      },
    });
    res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted. Thank you for connecting with BaytBD Group.',
      inquiry,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminGeneralInquiries = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const department = (req.query.department || req.query.departmentTarget) as string | undefined;
    const status = req.query.status as string | undefined;
    const where: any = {};
    if (department && department !== 'ALL') {
      where.departmentTarget = department as any;
    }
    if (status && status !== 'ALL') {
      where.status = status as any;
    }
    const inquiries = await prisma.generalInquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, inquiries });
  } catch (error) {
    next(error);
  }
};

export const updateGeneralInquiryStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const inquiry = await prisma.generalInquiry.update({
      where: { id },
      data: { status },
    });
    res.json({ success: true, message: 'Inquiry status updated successfully', inquiry });
  } catch (error) {
    next(error);
  }
};

// Site Settings
export const getSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const settingsList = await prisma.siteSetting.findMany();
    const settingsMap = settingsList.reduce((acc: any, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json({ success: true, settings: settingsMap });
  } catch (error) {
    next(error);
  }
};

// Company Profile & Info
export const getCompanyInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let info = await prisma.companyInfo.findFirst();
    if (!info) {
      info = await prisma.companyInfo.create({
        data: {
          companyName: 'BaytBD Group of Companies',
          tagline: 'One Group. Three Businesses. One Digital Ecosystem.',
          description: 'Building national infrastructure in ethical agriculture, premier real estate, and enterprise software.',
          primaryPhone: '+880 1800-BAYTBD',
          secondaryPhone: '+880 2 8878901',
          primaryEmail: 'info@baytbd.com',
          supportEmail: 'support@baytbd.com',
          address: 'Bayt Tower, Level 14, Road 71, Gulshan-2, Dhaka-1212, Bangladesh',
          city: 'Dhaka',
          country: 'Bangladesh',
          businessHours: 'Sun - Thu: 9:00 AM - 6:00 PM',
          facebookUrl: 'https://facebook.com',
          linkedinUrl: 'https://linkedin.com',
          twitterUrl: 'https://x.com',
          instagramUrl: 'https://instagram.com',
          youtubeUrl: 'https://youtube.com',
        },
      });
    }
    res.json({ success: true, companyInfo: info });
  } catch (error) {
    next(error);
  }
};

export const updateCompanyInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const existing = await prisma.companyInfo.findFirst();
    let updated;
    if (existing) {
      updated = await prisma.companyInfo.update({
        where: { id: existing.id },
        data: req.body,
      });
    } else {
      updated = await prisma.companyInfo.create({
        data: req.body,
      });
    }
    res.json({ success: true, message: 'Company information updated successfully', companyInfo: updated });
  } catch (error) {
    next(error);
  }
};

// Admin Dashboard Summary Stats
export const getAdminStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [
      totalOrders,
      pendingOrders,
      totalProducts,
      totalProjects,
      totalServices,
      pendingInquiries,
      totalArticles,
      recentOrders,
      recentInquiries,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { orderStatus: 'PENDING' } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.developmentProject.count(),
      prisma.iTService.count(),
      prisma.generalInquiry.count({ where: { status: 'NEW' } }),
      prisma.newsArticle.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.generalInquiry.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        totalProducts,
        totalProjects,
        totalServices,
        pendingInquiries,
        totalArticles,
      },
      recentOrders,
      recentInquiries,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ADMIN CMS CONTROLLER METHODS
// ==========================================

// News CRUD
export const createNews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, category, content, excerpt, featuredImage, isPublished } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.floor(100 + Math.random() * 900);
    const article = await prisma.newsArticle.create({
      data: {
        title,
        slug,
        category: (category as Department) || Department.CORPORATE,
        content,
        excerpt: excerpt || content.slice(0, 150),
        featuredImage: featuredImage || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80',
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      },
    });
    res.status(201).json({ success: true, message: 'Article published successfully', article });
  } catch (error) {
    next(error);
  }
};

export const updateNews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, category, content, excerpt, featuredImage, isPublished } = req.body;
    const data: any = {};
    if (title !== undefined) data.title = title;
    if (category !== undefined) data.category = category as Department;
    if (content !== undefined) data.content = content;
    if (excerpt !== undefined) data.excerpt = excerpt;
    if (featuredImage !== undefined) data.featuredImage = featuredImage;
    if (isPublished !== undefined) data.isPublished = Boolean(isPublished);

    const article = await prisma.newsArticle.update({
      where: { id },
      data,
    });
    res.json({ success: true, message: 'Article updated successfully', article });
  } catch (error) {
    next(error);
  }
};

export const deleteNews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.newsArticle.delete({ where: { id } });
    res.json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Team Members CRUD
export const createTeamMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, role, department, bio, image, sortOrder } = req.body;
    const member = await prisma.teamMember.create({
      data: {
        name,
        role,
        department: (department as Department) || Department.CORPORATE,
        bio: bio || '',
        image: image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        sortOrder: sortOrder ? parseInt(sortOrder) : 0,
        isActive: true,
      },
    });
    res.status(201).json({ success: true, message: 'Team member created successfully', member });
  } catch (error) {
    next(error);
  }
};

export const updateTeamMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, role, department, bio, image, sortOrder, isActive } = req.body;
    const data: any = {};
    if (name !== undefined) data.name = name;
    if (role !== undefined) data.role = role;
    if (department !== undefined) data.department = department as Department;
    if (bio !== undefined) data.bio = bio;
    if (image !== undefined) data.image = image;
    if (sortOrder !== undefined) data.sortOrder = parseInt(sortOrder);
    if (isActive !== undefined) data.isActive = Boolean(isActive);

    const member = await prisma.teamMember.update({
      where: { id },
      data,
    });
    res.json({ success: true, message: 'Team member updated successfully', member });
  } catch (error) {
    next(error);
  }
};

export const deleteTeamMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.teamMember.delete({ where: { id } });
    res.json({ success: true, message: 'Team member deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Job Openings CRUD & Applications
export const createJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, department, location, employmentType, description, requirements, deadline } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.floor(100 + Math.random() * 900);
    const job = await prisma.jobPost.create({
      data: {
        title,
        slug,
        department: (department as Department) || Department.CORPORATE,
        location: location || 'Dhaka, Bangladesh',
        employmentType: employmentType || 'Full-time',
        description,
        requirements: requirements ? (Array.isArray(requirements) ? requirements : [requirements]) : [],
        deadline: deadline ? new Date(deadline) : null,
        isActive: true,
      },
    });
    res.status(201).json({ success: true, message: 'Job opening posted successfully', job });
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, department, location, employmentType, description, requirements, deadline, isActive } = req.body;
    const data: any = {};
    if (title !== undefined) data.title = title;
    if (department !== undefined) data.department = department as Department;
    if (location !== undefined) data.location = location;
    if (employmentType !== undefined) data.employmentType = employmentType;
    if (description !== undefined) data.description = description;
    if (requirements !== undefined) data.requirements = Array.isArray(requirements) ? requirements : [requirements];
    if (deadline !== undefined) data.deadline = deadline ? new Date(deadline) : null;
    if (isActive !== undefined) data.isActive = Boolean(isActive);

    const job = await prisma.jobPost.update({
      where: { id },
      data,
    });
    res.json({ success: true, message: 'Job opening updated successfully', job });
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.jobPost.delete({ where: { id } });
    res.json({ success: true, message: 'Job opening deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getJobApplications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const applications = await prisma.jobApplication.findMany({
      include: {
        job: { select: { id: true, title: true, department: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, applications });
  } catch (error) {
    next(error);
  }
};

export const updateJobApplicationStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const application = await prisma.jobApplication.update({
      where: { id },
      data: { status },
    });
    res.json({ success: true, message: 'Application status updated', application });
  } catch (error) {
    next(error);
  }
};
