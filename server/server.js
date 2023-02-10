import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userRouter from './Routes/UserRouter.js';
import { errorHandler } from './middlewares/errorMiddleware.js';

dotenv.config();

// const axios = require('axios');
const app = express();
app.use(cors());
app.use(express.json());
//connect DB
connectDB();

//Main route
app.get('/', (req, res) => {
    res.send('API is runnning...');
});

//other routes
app.use("/api/users", userRouter);

//error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT  || 3000;

app.listen(PORT, () => {
    console.log('Server running in http://localhost/${PORT}');
});