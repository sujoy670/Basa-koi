import { Request, Response } from 'express';
import { PropertyService } from './property.service';
import { sendSuccess, sendError, sendPaginated } from '../../utils/response';

export class PropertyController {
  static async list(req: Request, res: Response) {
    try {
      const { properties, hasMore, nextCursor } = await PropertyService.listProperties(req.query);
      return sendPaginated(res, properties, {
        limit: Number(req.query.limit) || 20,
        hasMore,
        nextCursor,
      });
    } catch (err: any) {
      return sendError(res, 'QUERY_FAILED', err.message, 500);
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const property = await PropertyService.getById(req.params.id, req.user?.uid);
      if (!property) {
        return sendError(res, 'NOT_FOUND', 'Property listing not found', 404);
      }
      return sendSuccess(res, property);
    } catch (err: any) {
      return sendError(res, 'FETCH_FAILED', err.message, 500);
    }
  }

  static async create(req: Request, res: Response) {
    try {
      if (!req.user) {
        return sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
      }

      const property = await PropertyService.createProperty(
        req.user.uid,
        req.user.email.split('@')[0],
        Boolean(req.user.isOwnerVerified),
        req.body
      );

      return sendSuccess(res, property, 'Property created successfully', 201);
    } catch (err: any) {
      return sendError(res, 'CREATE_FAILED', err.message, 500);
    }
  }

  static async update(req: Request, res: Response) {
    try {
      if (!req.user) {
        return sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
      }

      const isAdmin = req.user.roles.includes('admin');
      const updated = await PropertyService.updateProperty(req.params.id, req.user.uid, isAdmin, req.body);

      if (!updated) {
        return sendError(res, 'NOT_FOUND', 'Property not found', 404);
      }

      return sendSuccess(res, updated, 'Property updated successfully');
    } catch (err: any) {
      if (err.message === 'FORBIDDEN') {
        return sendError(res, 'FORBIDDEN', 'You do not have permission to edit this property', 403);
      }
      return sendError(res, 'UPDATE_FAILED', err.message, 500);
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      if (!req.user) {
        return sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
      }

      const isAdmin = req.user.roles.includes('admin');
      const deleted = await PropertyService.deleteProperty(req.params.id, req.user.uid, isAdmin);

      if (!deleted) {
        return sendError(res, 'NOT_FOUND', 'Property not found', 404);
      }

      return sendSuccess(res, null, 'Property deleted successfully');
    } catch (err: any) {
      if (err.message === 'FORBIDDEN') {
        return sendError(res, 'FORBIDDEN', 'You do not have permission to delete this property', 403);
      }
      return sendError(res, 'DELETE_FAILED', err.message, 500);
    }
  }
}

