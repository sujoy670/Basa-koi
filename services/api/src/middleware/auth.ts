import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';
import { sendError } from '../utils/response';
import { UserRole } from '@basa-koi/shared-types';

export interface AuthenticatedUser {
  uid: string;
  email: string;
  roles: UserRole[];
  isOwnerVerified?: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'UNAUTHORIZED', 'Authentication token is required', 401);
  }

  const token = authHeader.split('Bearer ')[1].trim();

  // Dev bypass support for local automated tests
  if (process.env.NODE_ENV === 'development' && token === 'mock-dev-token') {
    req.user = {
      uid: 'dev-user-001',
      email: 'dev@basa-koi.com',
      roles: ['owner', 'tenant'],
      isOwnerVerified: true,
    };
    return next();
  }

  try {
    const decoded = await auth.verifyIdToken(token);
    const roles = (decoded.roles as UserRole[]) || ['tenant'];

    req.user = {
      uid: decoded.uid,
      email: decoded.email || '',
      roles,
      isOwnerVerified: Boolean(decoded.isOwnerVerified),
    };

    next();
  } catch (error) {
    return sendError(res, 'INVALID_TOKEN', 'Token is expired or invalid', 401, error);
  }
}

export function requireRole(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
    }

    const hasPermission = req.user.roles.some((r) => allowedRoles.includes(r));
    if (!hasPermission) {
      return sendError(
        res,
        'FORBIDDEN',
        `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}`,
        403
      );
    }

    next();
  };
}

