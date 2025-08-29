// src/server.ts
import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import JobRoute from './routes/JobRoute.js';
import ProfileRoute from './routes/ProfileRoute.js'; 
import SkillRoute from './routes/SkillRoute.js'; 
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;


app.use(cors({
  origin: process.env.FRONT_END_URL,
  credentials: true
}));
app.use(express.json());

app.use('/api/jobs', JobRoute);
app.use('/api/profile', ProfileRoute);
app.use('/api/skills', SkillRoute); 

app.get('/', (_req, res) => {
  res.send('Job Seeker API is running! 🚀');
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});