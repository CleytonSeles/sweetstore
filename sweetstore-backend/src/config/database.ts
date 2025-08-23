import { PrismaClient } from '@prisma/client';

/**
 * Configuração singleton do cliente Prisma
 * Garante uma única instância de conexão com o banco
 */
export class DatabaseConfig {
  private static instance: PrismaClient;

  private constructor() {}

  /**
   * Retorna instância única do Prisma Client
   * Implementa padrão Singleton para gerenciar conexões
   */
  public static getInstance(): PrismaClient {
    if (!DatabaseConfig.instance) {
      DatabaseConfig.instance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query'] : [],
      });
    }

    return DatabaseConfig.instance;
  }

  /**
   * Fecha conexão com o banco de dados
   * Utilizado principalmente em testes e shutdown da aplicação
   */
  public static async disconnect(): Promise<void> {
    if (DatabaseConfig.instance) {
      await DatabaseConfig.instance.$disconnect();
    }
  }
}
