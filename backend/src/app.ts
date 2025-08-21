import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { config } from './config/database';

/**
 * Constrói e configura a instância da aplicação Fastify
 * 
 * Inicializa o servidor com todos os middlewares de segurança,
 * documentação Swagger e rotas básicas da API.
 * 
 * @returns {Promise<FastifyInstance>} Instância configurada do Fastify
 * 
 * @example
 * ```typescript
 * const app = await buildApp();
 * await app.listen({ port: 3000, host: '0.0.0.0' });
 * ```
 */
export async function buildApp(): Promise<FastifyInstance> {
  // Configuração de logging diferenciada por ambiente
  // Em desenvolvimento: logs coloridos e formatados para melhor legibilidade
  // Em produção: logs estruturados em JSON para análise automatizada
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

  // Middleware de segurança - adiciona cabeçalhos de proteção padrão
  // Inclui proteções contra XSS, clickjacking, MIME sniffing, etc.
  await app.register(helmet);
  
  // Configuração CORS para permitir requisições do frontend
  // Permite cookies/credenciais para autenticação baseada em sessão
  await app.register(cors, {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  });

  // Documentação automática da API usando OpenAPI 3.0
  // Gera especificação JSON que pode ser consumida por ferramentas externas
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

  // Interface web interativa para testar a API
  // Disponível em /api/docs durante o desenvolvimento
  await app.register(swaggerUi, {
    routePrefix: '/api/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
  });

  /**
   * Endpoint de verificação de saúde da API
   * 
   * Usado por ferramentas de monitoramento e load balancers
   * para verificar se o serviço está respondendo corretamente.
   * 
   * @route GET /api/health
   * @returns {object} Status da aplicação com timestamp
   */
  app.get('/api/health', async () => {
    return { 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      service: 'SweetStore API',
      version: '1.0.0'
    };
  });

  /**
   * Endpoint de informações da API v1
   * 
   * Fornece metadados sobre a API e lista de endpoints disponíveis.
   * Útil para descoberta de serviços e documentação dinâmica.
   * 
   * @route GET /api/v1
   * @returns {object} Informações da API e endpoints disponíveis
   */
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