import express from 'express';
import globalErrorHandler from '../middlewares/globalErrorHandler';
import UserRouter from '../users/userRouter';
import BookRouter from '../Books/bookRouter';

const app = express();
app.use(express.json());

// Define routes
app.get('/', (req, res, next) => {
    res.json({ message: "Hello express server" });
});

app.use('/api/users',UserRouter)

app.use('/api/books',BookRouter)

// Use the global error handler
app.use(globalErrorHandler);

export default app;
