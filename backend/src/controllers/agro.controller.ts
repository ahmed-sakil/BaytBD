import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../config/prisma';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';

// Get all categories
export const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

// Get products with filters & search
export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, featured, search, minPrice, maxPrice } = req.query;

    const where: any = { isActive: true };

    if (category) {
      where.category = { slug: String(category) };
    }
    if (featured === 'true') {
      where.isFeatured = true;
    }
    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
        { sku: { contains: String(search), mode: 'insensitive' } },
      ];
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(String(minPrice));
      if (maxPrice) where.price.lte = parseFloat(String(maxPrice));
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { sortOrder: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, count: products.length, products });
  } catch (error) {
    next(error);
  }
};

// Get single product by slug
export const getProductBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    // Also fetch 4 related products
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true,
      },
      include: { images: true },
      take: 4,
    });

    res.json({ success: true, product, relatedProducts });
  } catch (error) {
    next(error);
  }
};

// Checkout Order creation schema
const createOrderSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerEmail: z.string().email('Valid email required'),
  customerPhone: z.string().min(10, 'Valid phone number required'),
  deliveryAddress: z.string().min(5, 'Delivery address is required'),
  city: z.string().default('Dhaka'),
  paymentMethod: z.nativeEnum(PaymentMethod).default(PaymentMethod.COD),
  transactionId: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
    })
  ).min(1, 'Order must contain at least one item'),
});

// Create Order
export const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validated = createOrderSchema.parse(req.body);

    // Fetch products to verify pricing & stock
    const productIds = validated.items.map(i => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      res.status(400).json({ success: false, message: 'One or more ordered products were not found.' });
      return;
    }

    const productMap = new Map(products.map(p => [p.id, p]));

    let subtotal = 0;
    const orderItemsData = validated.items.map(item => {
      const p = productMap.get(item.productId)!;
      const unitPrice = p.discountPrice ?? p.price;
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;
      return {
        productId: p.id,
        productName: p.name,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      };
    });

    const shippingFee = subtotal > 3000 ? 0 : 80; // Free delivery above 3000 BDT
    const totalAmount = subtotal + shippingFee;

    const orderNumber = `BAYT-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: validated.customerName,
        customerEmail: validated.customerEmail,
        customerPhone: validated.customerPhone,
        deliveryAddress: validated.deliveryAddress,
        city: validated.city,
        subtotal,
        shippingFee,
        totalAmount,
        paymentMethod: validated.paymentMethod,
        paymentStatus: validated.paymentMethod === PaymentMethod.COD ? PaymentStatus.PENDING : PaymentStatus.PENDING,
        orderStatus: OrderStatus.PENDING,
        transactionId: validated.transactionId,
        notes: validated.notes,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      orderNumber: order.orderNumber,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all orders
export const getAdminOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, search } = req.query;
    const where: any = {};

    if (status && status !== 'ALL') {
      where.orderStatus = status as OrderStatus;
    }
    if (search) {
      where.OR = [
        { orderNumber: { contains: String(search), mode: 'insensitive' } },
        { customerName: { contains: String(search), mode: 'insensitive' } },
        { customerPhone: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// Admin: Update order status
export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const data: any = {};
    if (orderStatus) data.orderStatus = orderStatus;
    if (paymentStatus) data.paymentStatus = paymentStatus;

    const updated = await prisma.order.update({
      where: { id },
      data,
      include: { items: true },
    });

    res.json({ success: true, message: 'Order status updated', order: updated });
  } catch (error) {
    next(error);
  }
};

// Admin: Create Product
export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, sku, price, discountPrice, stockQuantity, unit, description, categoryId, isFeatured, imageUrl } = req.body;
    
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.floor(100 + Math.random() * 900);

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        sku: sku || `SKU-${Date.now().toString().slice(-6)}`,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        stockQuantity: parseInt(stockQuantity) || 0,
        unit: unit || 'item',
        description,
        categoryId,
        isFeatured: Boolean(isFeatured),
        images: imageUrl ? {
          create: [{ imageUrl, isPrimary: true, sortOrder: 0 }],
        } : undefined,
      },
      include: { category: true, images: true },
    });

    res.status(201).json({ success: true, message: 'Product created successfully', product });
  } catch (error) {
    next(error);
  }
};

// Admin: Update Product
export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, price, discountPrice, stockQuantity, unit, description, categoryId, isFeatured, isActive, imageUrl } = req.body;

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (price !== undefined) data.price = parseFloat(price);
    if (discountPrice !== undefined) data.discountPrice = discountPrice ? parseFloat(discountPrice) : null;
    if (stockQuantity !== undefined) data.stockQuantity = parseInt(stockQuantity);
    if (unit !== undefined) data.unit = unit;
    if (description !== undefined) data.description = description;
    if (categoryId !== undefined) data.categoryId = categoryId;
    if (isFeatured !== undefined) data.isFeatured = Boolean(isFeatured);
    if (isActive !== undefined) data.isActive = Boolean(isActive);

    const product = await prisma.product.update({
      where: { id },
      data,
      include: { category: true, images: true },
    });

    if (imageUrl) {
      const existingImg = await prisma.productImage.findFirst({ where: { productId: id } });
      if (existingImg) {
        await prisma.productImage.update({ where: { id: existingImg.id }, data: { imageUrl } });
      } else {
        await prisma.productImage.create({ data: { productId: id, imageUrl, isPrimary: true } });
      }
    }

    res.json({ success: true, message: 'Product updated successfully', product });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete Product
export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};
