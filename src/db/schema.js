// src/db/schema.js
import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';

// 1. Criando a tabela 'pacientes'
export const pacientes = pgTable('pacientes', {
  id: serial('id').primaryKey(),        // Gera IDs automáticos (1, 2, 3...)
  nome: text('nome').notNull(),         // Texto obrigatório
  idade: integer('idade').notNull(),    // Número obrigatório
  urgencia: text('urgencia').notNull()  // Baixa, Média ou Alta
});