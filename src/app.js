import express from 'express';
import 'dotenv/config';
import { eq } from 'drizzle-orm'; // Importante para filtros (WHERE id = x)
import { db } from './db/index.js';
import { pacientes, consultas } from './db/schema.js';

const app = express();
app.use(express.json());

// 1. READ (Buscar Paciente por ID com suas Consultas)
app.get('/pacientes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Busca o paciente específico
    const pacienteEncontrado = await db.select()
      .from(pacientes)
      .where(eq(pacientes.id, Number(id)));

    if (pacienteEncontrado.length === 0) {
      return res.status(404).json({ erro: "Paciente não encontrado." });
    }

    // Busca todas as consultas vinculadas a este paciente
    const historico = await db.select()
      .from(consultas)
      .where(eq(consultas.pacienteId, Number(id)));

    res.json({
      paciente: pacienteEncontrado[0],
      consultas: historico
    });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao buscar detalhes do paciente." });
  }
});

// 2. UPDATE (Atualizar a Urgência do Paciente)
app.put('/pacientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { urgencia } = req.body;

    const pacienteAtualizado = await db.update(pacientes)
      .set({ urgencia })
      .where(eq(pacientes.id, Number(id)))
      .returning();

    res.json({ mensagem: "Urgência atualizada!", paciente: pacienteAtualizado[0] });
  } catch (erro) {
    res.status(400).json({ erro: "Erro ao atualizar paciente." });
  }
});

// 3. DELETE (Remover Paciente da Fila)
app.delete('/pacientes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await db.delete(pacientes).where(eq(pacientes.id, Number(id)));

    res.json({ mensagem: "Paciente removido do banco de dados com sucesso!" });
  } catch (erro) {
    res.status(400).json({ erro: "Erro ao deletar paciente." });
  }
});

// 4. CREATE (Cadastrar Consulta para um Paciente)
app.post('/consultas', async (req, res) => {
  try {
    const { descricao, pacienteId } = req.body;

    const novaConsulta = await db.insert(consultas).values({
      descricao,
      pacienteId
    }).returning();

    res.status(201).json({ mensagem: "Consulta registrada!", consulta: novaConsulta[0] });
  } catch (erro) {
    res.status(400).json({ erro: "Erro ao registrar consulta. Verifique se o pacienteId existe." });
  }
});

app.listen(3000, () => console.log("🚀 Servidor rodando em http://localhost:3000"));