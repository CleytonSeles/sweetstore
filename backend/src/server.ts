   import { buildApp } from './app';
   import dotenv from 'dotenv';

   // Load environment variables
   dotenv.config();

   const start = async (): Promise<void> => {
     try {
       const app = await buildApp();
       
       const port = parseInt(process.env.PORT || '3000', 10);
       const host = process.env.HOST || '0.0.0.0';

       await app.listen({ port, host });
       
       console.log(`🍰 SweetStore API is running!`);
       console.log(`📡 Server: http://${host}:${port}`);
       console.log(`📚 Docs: http://${host}:${port}/api/docs`);
       console.log(`❤️  Health: http://${host}:${port}/api/health`);
       
     } catch (error) {
       console.error('❌ Error starting server:', error);
       process.exit(1);
     }
   };

   start();