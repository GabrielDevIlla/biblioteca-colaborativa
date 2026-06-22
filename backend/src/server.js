import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bookRoutes from './app/routes/bookRoutes.js';
import userRoutes from './app/routes/userRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/livros', bookRoutes);
app.use('/usuarios', userRoutes);

const DOOR = process.env.DOOR || 3000;

app.get('/', (req, res) => {
    res.json({ message: 'API Biblioteca Colaborativa rodando!', versao: '2.0' });
});

app.listen(DOOR, () => {
    console.log(`✅ Servidor rodando em: http://localhost:${DOOR}`);
});
