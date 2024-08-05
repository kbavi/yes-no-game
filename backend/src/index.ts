import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import conversationRoutes from './routes/conversation';

const app = express();
const port = process.env.BACKEND_PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/conversations', conversationRoutes);
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/conversations';

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(port, () => {
        console.log(`Node.js server listening at http://localhost:${port}`);
    });
}).catch(err => {
    console.error('Database connection error:', err);
});
