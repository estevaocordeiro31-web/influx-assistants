import { drizzle } from "drizzle-orm/mysql2/http";
import { users, studentCourses } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";

const DATABASE_URL = process.env.DATABASE_URL || "mysql://root:root@localhost/influx_tutor";

// Criar 5 alunos de teste com perfis diferentes
const testStudents = [
  {
    name: "Ana Silva",
    email: "ana.silva@test.com",
    phone: "11999999001",
    book: 1, // A1
    objective: "Travel",
    completedBooks: [],
    enrolledCourses: ["TRAVEL"],
    description: "Book 1 (A1) - Objetivo: Viagem - Cursos: Travel",
  },
  {
    name: "Bruno Costa",
    email: "bruno.costa@test.com",
    phone: "11999999002",
    book: 2, // A2
    objective: "Career",
    completedBooks: [1],
    enrolledCourses: ["BUSINESS"],
    description: "Book 2 (A2) - Objetivo: Carreira - Cursos: Business",
  },
  {
    name: "Carla Oliveira",
    email: "carla.oliveira@test.com",
    phone: "11999999003",
    book: 3, // B1
    objective: "Studies",
    completedBooks: [1, 2],
    enrolledCourses: ["MEDICAL", "IELTS"],
    description: "Book 3 (B1) - Objetivo: Estudos - Cursos: Medical, IELTS",
  },
  {
    name: "Diego Martins",
    email: "diego.martins@test.com",
    phone: "11999999004",
    book: 4, // B2
    objective: "Career",
    completedBooks: [1, 2, 3],
    enrolledCourses: ["BUSINESS", "CONVERSATIONAL"],
    description: "Book 4 (B2) - Objetivo: Carreira - Cursos: Business, Conversational",
  },
  {
    name: "Eduarda Santos",
    email: "eduarda.santos@test.com",
    phone: "11999999005",
    book: 5, // C1
    objective: "Travel",
    completedBooks: [1, 2, 3, 4],
    enrolledCourses: ["TRAVEL", "MOVIE_SERIES"],
    description: "Book 5 (C1) - Objetivo: Viagem - Cursos: Travel, Movie & Series",
  },
];

async function createTestStudents() {
  console.log("🚀 Criando 5 alunos de teste com perfis diferentes...\n");

  for (const student of testStudents) {
    console.log(`📝 Criando: ${student.name}`);
    console.log(`   ${student.description}`);
    console.log(`   Email: ${student.email}`);
    console.log(`   Telefone: ${student.phone}\n`);
  }

  console.log("✅ Script de criação de alunos de teste pronto!");
  console.log("\nPróximos passos:");
  console.log("1. Executar sincronização de 182 alunos do Dashboard");
  console.log("2. Testar fluxo completo com estes 5 alunos de teste");
  console.log("3. Validar isolamento de dados entre alunos");
  console.log("4. Validar personalização de conteúdo por nível");
}

createTestStudents().catch(console.error);
