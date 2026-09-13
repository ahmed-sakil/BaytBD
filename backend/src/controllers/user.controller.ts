import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { Role } from '@prisma/client';
import prisma from '../config/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.nativeEnum(Role),
  avatar: z.string().optional(),
});

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional().or(z.literal('')),
  role: z.nativeEnum(Role).optional(),
  avatar: z.string().optional(),
  isActive: z.boolean().optional(),
});

// GET /api/users - List all staff users
export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            articles: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/users - Create/invite new staff user
export const createUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = createUserSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists.',
      });
    }

    // Only SUPER_ADMIN can create another SUPER_ADMIN
    if (data.role === Role.SUPER_ADMIN && req.user?.role !== Role.SUPER_ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Only Super Administrators can create other Super Admin accounts.',
      });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
        avatar: data.avatar || null,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Staff user created successfully.',
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/:id - Update user details, role or password
export const updateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = updateUserSchema.parse(req.body);

    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // If target is SUPER_ADMIN and requester is not SUPER_ADMIN, deny
    if (targetUser.role === Role.SUPER_ADMIN && req.user?.role !== Role.SUPER_ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Only Super Administrators can modify Super Admin accounts.',
      });
    }

    // If trying to promote to SUPER_ADMIN without being SUPER_ADMIN, deny
    if (data.role === Role.SUPER_ADMIN && req.user?.role !== Role.SUPER_ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Only Super Administrators can grant the Super Admin role.',
      });
    }

    // Prevent changing own role if requester is logged-in user
    if (req.user && req.user.id === id && data.role && data.role !== req.user.role) {
      return res.status(400).json({
        success: false,
        message: 'You cannot alter your own administrative role.',
      });
    }

    const updatePayload: any = {
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
      ...(data.role && { role: data.role }),
      ...(data.avatar !== undefined && { avatar: data.avatar }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    };

    if (data.password && data.password.trim().length >= 6) {
      updatePayload.passwordHash = await bcrypt.hash(data.password, 10);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updatePayload,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return res.json({
      success: true,
      message: 'Staff user updated successfully.',
      user: updated,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/users/:id/status - Toggle active/inactive
export const toggleUserStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (req.user?.id === id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own account.',
      });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (targetUser.role === Role.SUPER_ADMIN && req.user?.role !== Role.SUPER_ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Only Super Administrators can deactivate Super Admin accounts.',
      });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !targetUser.isActive },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    return res.json({
      success: true,
      message: `User account is now ${updated.isActive ? 'active' : 'suspended'}.`,
      user: updated,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/users/:id - Delete staff user
export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (req.user?.id === id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account.',
      });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (targetUser.role === Role.SUPER_ADMIN) {
      // Check how many super admins exist
      const superAdminCount = await prisma.user.count({
        where: { role: Role.SUPER_ADMIN },
      });

      if (superAdminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the system primary Super Administrator.',
        });
      }
    }

    await prisma.user.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: 'Staff user deleted permanently.',
    });
  } catch (error) {
    next(error);
  }
};
