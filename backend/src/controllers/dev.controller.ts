import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../config/prisma';
import { ProjectStatus, ProjectType, InquiryStatus } from '@prisma/client';

// Get all real estate projects with filters
export const getProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, type, featured } = req.query;
    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status as ProjectStatus;
    }
    if (type && type !== 'ALL') {
      where.projectType = type as ProjectType;
    }
    if (featured === 'true') {
      where.isFeatured = true;
    }

    const projects = await prisma.developmentProject.findMany({
      where,
      include: {
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, count: projects.length, projects });
  } catch (error) {
    next(error);
  }
};

// Get single project by slug
export const getProjectBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;
    const project = await prisma.developmentProject.findUnique({
      where: { slug },
      include: {
        images: true,
      },
    });

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    res.json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

// Create project inquiry
const inquirySchema = z.object({
  projectId: z.string(),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  message: z.string().min(5, 'Message is required'),
});

export const createProjectInquiry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = inquirySchema.parse(req.body);

    const inquiry = await prisma.projectInquiry.create({
      data: {
        projectId: data.projectId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        status: InquiryStatus.NEW,
      },
      include: {
        project: { select: { title: true, location: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your property inquiry has been received. Our property consultants will contact you shortly.',
      inquiry,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get project inquiries
export const getAdminProjectInquiries = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const inquiries = await prisma.projectInquiry.findMany({
      include: {
        project: { select: { id: true, title: true, slug: true, location: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, inquiries });
  } catch (error) {
    next(error);
  }
};

// Admin: Create Real Estate Project
export const createProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, projectType, status, location, city, landArea, numberOfFloors, units, parking, completionDate, featuredImage, description, isFeatured } = req.body;
    
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.floor(100 + Math.random() * 900);

    const project = await prisma.developmentProject.create({
      data: {
        title,
        slug,
        projectType: projectType || 'RESIDENTIAL',
        status: status || 'ONGOING',
        location,
        city: city || 'Dhaka',
        landArea,
        numberOfFloors,
        units,
        parking,
        completionDate,
        featuredImage: featuredImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
        description,
        isFeatured: Boolean(isFeatured),
      },
      include: { images: true },
    });

    res.status(201).json({ success: true, message: 'Project created successfully', project });
  } catch (error) {
    next(error);
  }
};

// Admin: Update Real Estate Project
export const updateProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, projectType, status, location, city, landArea, numberOfFloors, units, parking, completionDate, featuredImage, description, isFeatured } = req.body;

    const data: any = {};
    if (title !== undefined) data.title = title;
    if (projectType !== undefined) data.projectType = projectType;
    if (status !== undefined) data.status = status;
    if (location !== undefined) data.location = location;
    if (city !== undefined) data.city = city;
    if (landArea !== undefined) data.landArea = landArea;
    if (numberOfFloors !== undefined) data.numberOfFloors = numberOfFloors;
    if (units !== undefined) data.units = units;
    if (parking !== undefined) data.parking = parking;
    if (completionDate !== undefined) data.completionDate = completionDate;
    if (featuredImage !== undefined) data.featuredImage = featuredImage;
    if (description !== undefined) data.description = description;
    if (isFeatured !== undefined) data.isFeatured = Boolean(isFeatured);

    const project = await prisma.developmentProject.update({
      where: { id },
      data,
      include: { images: true },
    });

    res.json({ success: true, message: 'Project updated successfully', project });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete Real Estate Project
export const deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.developmentProject.delete({ where: { id } });
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};
