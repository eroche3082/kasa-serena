import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../shared/schema';

// Tipo para los datos de usuario en la sesión
interface SessionUser {
  id: number;
  username: string;
  email: string;
  role: string; // Simplificamos el tipo para evitar problemas
}

// Extender la declaración de sesión de Express
declare module 'express-session' {
  interface SessionData {
    userId: number;
    user?: SessionUser;
  }
}

// Middleware para verificar si el usuario está autenticado
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'No autenticado' });
  }
  
  // Si no tenemos la información del usuario en la sesión, la obtendremos más tarde
  next();
}

// Middleware para verificar el rol del usuario
export function requireRole(role: UserRole) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    
    // Verificar si ya tenemos la información del usuario en la sesión
    if (req.session.user && req.session.user.role) {
      if (req.session.user.role !== role) {
        return res.status(403).json({ message: 'Acceso denegado' });
      }
      return next();
    }
    
    // Si no está en la sesión, obtener el usuario de la base de datos
    const { storage } = await import('../storage');
    const user = await storage.getUser(req.session.userId);
    
    if (!user || user.role !== role) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }
    
    // Asignar valores seguros para la sesión
    const userRole = (user.role || 'cliente') as UserRole;
    const userEmail = user.email || '';
    
    // Actualizar la sesión con la información del usuario
    req.session.user = {
      id: user.id,
      username: user.username,
      email: userEmail,
      role: userRole
    };
    
    next();
  };
}

// Middleware para verificar si el usuario tiene alguno de los roles especificados
export function requireAnyRole(roles: UserRole[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    
    // Verificar si ya tenemos la información del usuario en la sesión
    if (req.session.user && req.session.user.role) {
      if (!roles.includes(req.session.user.role)) {
        return res.status(403).json({ message: 'Acceso denegado' });
      }
      return next();
    }
    
    // Si no está en la sesión, obtener el usuario de la base de datos
    const { storage } = await import('../storage');
    const user = await storage.getUser(req.session.userId);
    
    if (!user || !roles.includes((user.role || 'cliente') as UserRole)) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }
    
    // Asignar valores seguros para la sesión
    const roleValue = (user.role || 'cliente') as UserRole;
    const emailValue = user.email || '';
    
    // Actualizar la sesión con información del usuario
    req.session.user = {
      id: user.id,
      username: user.username,
      email: emailValue,
      role: roleValue
    };
    
    next();
  };
}