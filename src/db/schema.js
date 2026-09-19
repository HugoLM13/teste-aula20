// src/db/schema.js
import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

// 1. Criando a tabela 'pacientes'
export const pacientes = pgTable('pacientes', {
  id: serial('id').primaryKey(),        // Gera IDs automáticos (1, 2, 3...)
  nome: text('nome').notNull(),         // Texto obrigatório
  idade: integer('idade').notNull(),    // Número obrigatório
  urgencia: text('urgencia').notNull()  // Baixa, Média ou Alta
});

// 2. Tabela Relacionada (N)
export const consultas = pgTable('consultas', {
  id: serial('id').primaryKey(),
  descricao: text('descricao').notNull(),
  data: timestamp('data').defaultNow(),

  // Chave Estrangeira apontando para o id do Paciente
  pacienteId: integer('paciente_id')
    .notNull()
    .references(() => pacientes.id)
});