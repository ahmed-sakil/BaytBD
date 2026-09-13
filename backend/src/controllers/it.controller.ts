import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';

// Get all IT services
export const getITServices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const services = await prisma.iTService.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, services });
  } catch (error) {
    next(error);
  }
};

// Get IT service by slug
export const getITServiceBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;
    const service = await prisma.iTService.findUnique({
      where: { slug },
    });
    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found' });
      return;
    }
    res.json({ success: true, service });
  } catch (error) {
    next(error);
  }
};

// Get IT projects / case studies
export const getITProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const projects = await prisma.iTProject.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, projects });
  } catch (error) {
    next(error);
  }
};

// Get IT project by slug
export const getITProjectBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;
    const project = await prisma.iTProject.findUnique({
      where: { slug },
    });
    if (!project) {
      res.status(404).json({ success: false, message: 'Case study not found' });
      return;
    }
    res.json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ADMIN IT CONTROLLER METHODS
// ==========================================

// Service CRUD
export const createITService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, shortDesc, fullDesc, iconName, features, technologies, isFeatured, sortOrder } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.floor(100 + Math.random() * 900);
    const service = await prisma.iTService.create({
      data: {
        title,
        slug,
        shortDesc,
        fullDesc: fullDesc || shortDesc,
        iconName: iconName || 'Code2',
        features: features ? (Array.isArray(features) ? features : [features]) : [],
        technologies: technologies ? (Array.isArray(technologies) ? technologies : [technologies]) : [],
        isFeatured: Boolean(isFeatured),
        sortOrder: sortOrder ? parseInt(sortOrder) : 0,
      },
    });
    res.status(201).json({ success: true, message: 'IT service created successfully', service });
  } catch (error) {
    next(error);
  }
};

export const updateITService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, shortDesc, fullDesc, iconName, features, technologies, isFeatured, sortOrder } = req.body;
    const data: any = {};
    if (title !== undefined) data.title = title;
    if (shortDesc !== undefined) data.shortDesc = shortDesc;
    if (fullDesc !== undefined) data.fullDesc = fullDesc;
    if (iconName !== undefined) data.iconName = iconName;
    if (features !== undefined) data.features = Array.isArray(features) ? features : [features];
    if (technologies !== undefined) data.technologies = Array.isArray(technologies) ? technologies : [technologies];
    if (isFeatured !== undefined) data.isFeatured = Boolean(isFeatured);
    if (sortOrder !== undefined) data.sortOrder = parseInt(sortOrder);

    const service = await prisma.iTService.update({
      where: { id },
      data,
    });
    res.json({ success: true, message: 'IT service updated successfully', service });
  } catch (error) {
    next(error);
  }
};

export const deleteITService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.iTService.delete({ where: { id } });
    res.json({ success: true, message: 'IT service deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Case Study CRUD
export const createITProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, industry, clientName, technologies, featuredImage, summary, challenges, solutions, results, liveUrl, isFeatured, sortOrder } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.floor(100 + Math.random() * 900);
    const project = await prisma.iTProject.create({
      data: {
        title,
        slug,
        industry: industry || 'Enterprise Software',
        clientName,
        technologies: technologies ? (Array.isArray(technologies) ? technologies : [technologies]) : [],
        featuredImage: featuredImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
        summary,
        challenges,
        solutions,
        results,
        liveUrl,
        isFeatured: Boolean(isFeatured),
        sortOrder: sortOrder ? parseInt(sortOrder) : 0,
      },
    });
    res.status(201).json({ success: true, message: 'Case study created successfully', project });
  } catch (error) {
    next(error);
  }
};

export const updateITProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, industry, clientName, technologies, featuredImage, summary, challenges, solutions, results, liveUrl, isFeatured, sortOrder } = req.body;
    const data: any = {};
    if (title !== undefined) data.title = title;
    if (industry !== undefined) data.industry = industry;
    if (clientName !== undefined) data.clientName = clientName;
    if (technologies !== undefined) data.technologies = Array.isArray(technologies) ? technologies : [technologies];
    if (featuredImage !== undefined) data.featuredImage = featuredImage;
    if (summary !== undefined) data.summary = summary;
    if (challenges !== undefined) data.challenges = challenges;
    if (solutions !== undefined) data.solutions = solutions;
    if (results !== undefined) data.results = results;
    if (liveUrl !== undefined) data.liveUrl = liveUrl;
    if (isFeatured !== undefined) data.isFeatured = Boolean(isFeatured);
    if (sortOrder !== undefined) data.sortOrder = parseInt(sortOrder);

    const project = await prisma.iTProject.update({
      where: { id },
      data,
    });
    res.json({ success: true, message: 'Case study updated successfully', project });
  } catch (error) {
    next(error);
  }
};

export const deleteITProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.iTProject.delete({ where: { id } });
    res.json({ success: true, message: 'Case study deleted successfully' });
  } catch (error) {
    next(error);
  }
};
