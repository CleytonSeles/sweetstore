   export const config = {
     database: {
       url: process.env.DATABASE_URL || 'postgresql://sweetstore:password@localhost:5432/sweetstore_dev'
     },
     jwt: {
       secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
     },
     server: {
       port: parseInt(process.env.PORT || '3000', 10),
       host: process.env.HOST || '0.0.0.0'
     }
   };