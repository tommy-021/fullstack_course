import express from 'express';
import { db } from './data';
// import cors from 'cors';
// import { eventsRouter } from './routes/events';

const port = 4000;
const app = express();
// app.use(cors({ origin: true }));
// app.use(express.json());
// app.use('/api/events', eventsRouter);

app.get('/', (_req, res) => {
    res.send('Hello World!');
});

app.get('/api/events', (_req, res) => {
    // res.send('Ahoj!');
    res.json(db);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
