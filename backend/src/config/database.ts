/**
 * Configurações centralizadas da aplicação SweetStore
 * 
 * Centraliza todas as configurações de banco de dados, JWT e servidor
 * com fallbacks seguros para desenvolvimento local.
 * 
 * @example
 * ```typescript
 * import { config } from './config/database';
 * const dbUrl = config.database.url;
 * ```
 */
export const config = {
  database: {
    // URL de conexão PostgreSQL com fallback para desenvolvimento local
    // Formato: postgresql://usuario:senha@host:porta/database
    url: process.env.DATABASE_URL || 'postgresql://sweetstore:password@localhost:5432/sweetstore_dev'
  },
  jwt: {
    // Chave secreta para assinatura de tokens JWT
    // IMPORTANTE: Deve ser alterada em produção para uma chave forte e única
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
  },
  server: {
    // Porta do servidor - padrão 3000 para desenvolvimento
    port: parseInt(process.env.PORT || '3000', 10),
    // Host 0.0.0.0 permite conexões externas (necessário para containers)
    host: process.env.HOST || '0.0.0.0'
  }
};