import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/routes.js';
import sequelize from './db/db.js';
import cors from 'cors';
const app = express();
const port = process.argv[2] || 3000;

const corsOptions = {
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: '*' // Allowed headers
};
app.use(cors(corsOptions));
// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', userRoutes);


sequelize.sync()
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch(err => {
        console.error('Unable to create tables:', err);
    });
// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});