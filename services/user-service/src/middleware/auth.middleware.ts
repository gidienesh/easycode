import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken'; // Would be used here

// This is a placeholder. Actual JWT validation would occur here.
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // const authHeader = req.headers['authorization'];
  // const token = authHeader && authHeader.split(' ')[1];
  // if (token == null) return res.sendStatus(401);

  // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
  //   if (err) return res.sendStatus(403);
  //   (req as any).user = user; // Add user to request object
  //   next();
  // });
  console.log('Auth middleware placeholder: request would be authenticated here.');
  // For mock purposes, let's assume a user is authenticated
  // (req as any).user = { id: 'user-xyz', tenantId: 'client-company-abc', roles: ['crm_manager', 'tenant_admin'] };
  next();
};
