import express from 'express';
import cors from 'cors';
import { eventsRouter } from './routes/events';

const port = 4000;
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.use('/api/events', eventsRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
