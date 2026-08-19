import express from 'express';
import 'dotenv/config';
import { db } from './db/index.js';
import { pacientes } from './db/schema.js';

const app = express();
app.use(express.json());

// Rota GET: Buscar dados do PostgreSQL
app.get('/pacientes', async (req, res) => {
  try {
    const lista = await db.select().from(pacientes);
    res.json(lista);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao buscar dados do banco." });
  }
});

// Rota POST: Inserir dados no PostgreSQL
app.post('/pacientes', async (req, res) => {
  try {
    const { nome, idade, urgencia } = req.body;

    const novoPaciente = await db.insert(pacientes).values({
      nome,
      idade,
      urgencia
    }).returning(); // Retorna o registro criado com o ID do banco

    res.status(201).json({
      mensagem: "Salvo no banco com sucesso!",
      paciente: novoPaciente[0]
    });
  } catch (erro) {
    res.status(400).json({ erro: "Erro ao salvar no banco de dados." });
  }
});

app.listen(3000, () => console.log("🚀 Servidor rodando em http://localhost:3000"));