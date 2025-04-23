import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../shared/schema';

// Middleware para verificar si el usuario está autenticado
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'No autenticado' });
  }
  next();
}

// Middleware para verificar el rol del usuario
export function requireRole(role: UserRole) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    
    // Obtener el usuario de la base de datos para comprobar el rol
    const { storage } = await import('../storage');
    const user = await storage.getUser(req.session.userId);
    
    if (!user || user.role !== role) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }
    
    next();
  };
}

// Middleware para verificar si el usuario tiene alguno de los roles especificados
export function requireAnyRole(roles: UserRole[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    
    // Obtener el usuario de la base de datos para comprobar el rol
    const { storage } = await import('../storage');
    const user = await storage.getUser(req.session.userId);
    
    if (!user || !roles.includes(user.role as UserRole)) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }
    
    next();
  };
}