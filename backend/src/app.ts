   import Fastify, { FastifyInstance } from 'fastify';
   import cors from '@fastify/cors';
   import helmet from '@fastify/helmet';
   import swagger from '@fastify/swagger';
   import swaggerUi from '@fastify/swagger-ui';
   import { config } from './config/database';

   export async function buildApp(): Promise<FastifyInstance> {
     const app = Fastify({
    logger: process.env.NODE_ENV !== 'production' ? {
      level: process.env.LOG_LEVEL || 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true
        }
      }
    } : {
      level: process.env.LOG_LEVEL || 'info'
    }
  });

     // Security middleware
     await app.register(helmet);
     
     // CORS
     await app.register(cors, {
       origin: process.env.FRONTEND_URL || 'http://localhost:5173',
       credentials: true
     });

     // Swagger documentation
     await app.register(swagger, {
       openapi: {
         openapi: '3.0.0',
         info: {
           title: 'SweetStore API',
           description: 'API para sistema de loja de doces e confeitaria',
           version: '1.0.0',
         },
         servers: [
           {
             url: 'http://localhost:3000',
             description: 'Development server',
           },
         ],
       },
     });

     await app.register(swaggerUi, {
       routePrefix: '/api/docs',
       uiConfig: {
         docExpansion: 'full',
         deepLinking: false,
       },
     });

     // Health check route
     app.get('/api/health', async () => {
       return { 
         status: 'ok', 
         timestamp: new Date().toISOString(),
         service: 'SweetStore API',
         version: '1.0.0'
       };
     });

     // API routes will be registered here
     app.get('/api/v1', async () => {
       return { 
         message: 'SweetStore API v1',
         endpoints: {
           health: '/api/health',
           docs: '/api/docs'
         }
       };
     });

     return app;
   }