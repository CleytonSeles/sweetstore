import { buildApp } from './app';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente do arquivo .env antes de inicializar a aplicação
// Necessário para que as configurações estejam disponíveis durante o build
dotenv.config();

/**
 * Inicializa e inicia o servidor da SweetStore API
 * 
 * Configura o servidor Fastify com todas as rotas e middlewares,
 * e inicia a escuta na porta e host especificados nas variáveis de ambiente.
 * 
 * @throws {Error} Termina o processo com código 1 em caso de falha na inicialização
 */
const start = async (): Promise<void> => {
  try {
    const app = await buildApp();
    
    const port = parseInt(process.env.PORT || '3000', 10);
    const host = process.env.HOST || '0.0.0.0';

    await app.listen({ port, host });
    
    // Exibe informações de inicialização para facilitar o desenvolvimento
    console.log(`🍰 SweetStore API is running!`);
    console.log(`📡 Server: http://${host}:${port}`);
    console.log(`📚 Docs: http://${host}:${port}/api/docs`);
    console.log(`❤️  Health: http://${host}:${port}/api/health`);
    
  } catch (error) {
    console.error('❌ Error starting server:', error);
    // Força o encerramento do processo para evitar estados inconsistentes
    process.exit(1);
  }
};

// Inicia o servidor imediatamente
start();