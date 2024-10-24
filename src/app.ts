import express from 'express';
import globalErrorHandler from '../middlewares/globalErrorHandler'; // Adjust path as necessary
import UserRouter from '../users/userRouter';

const app = express();

// Define routes
app.get('/', (req, res, next) => {
    res.json({ message: "Hello express server" });
});

app.use('/api/users',UserRouter)

// Use the global error handler
app.use(globalErrorHandler);

export default app;
