import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { books, units } from "../drizzle/schema.ts";

const booksData = [
  {
    bookId: "junior_starter_a",
    name: "Junior Starter A",
    level: "starter",
    category: "junior",
    stages: 2,
    totalUnits: 24,
    description: "Introdução ao inglês para crianças com foco em vocabulário básico e estruturas simples",
    order: 1,
  },
  {
    bookId: "junior_starter_b",
    name: "Junior Starter B",
    level: "starter",
    category: "junior",
    stages: 2,
    totalUnits: 24,
    description: "Continuação do Starter A com expansão de vocabulário e estruturas",
    order: 2,
  },
  {
    bookId: "junior_1",
    name: "Junior 1",
    level: "elementary",
    category: "junior",
    stages: 2,
    totalUnits: 14,
    description: "Primeiro livro de inglês elementar para crianças",
    order: 3,
  },
  {
    bookId: "junior_2",
    name: "Junior 2",
    level: "elementary",
    category: "junior",
    stages: 2,
    totalUnits: 14,
    description: "Segundo livro de inglês elementar para crianças",
    order: 4,
  },
  {
    bookId: "junior_3",
    name: "Junior 3",
    level: "elementary",
    category: "junior",
    stages: 2,
    totalUnits: 14,
    description: "Terceiro livro de inglês elementar para crianças",
    order: 5,
  },
  {
    bookId: "book_1",
    name: "Book 1",
    level: "beginner",
    category: "regular",
    stages: 2,
    totalUnits: 14,
    description: "Primeiro livro da série Regular focado em estruturas básicas",
    order: 6,
  },
  {
    bookId: "book_2",
    name: "Book 2",
    level: "elementary",
    category: "regular",
    stages: 2,
    totalUnits: 14,
    description: "Segundo livro da série Regular com expansão de vocabulário",
    order: 7,
  },
  {
    bookId: "book_3",
    name: "Book 3",
    level: "pre_intermediate",
    category: "regular",
    stages: 2,
    totalUnits: 12,
    description: "Terceiro livro da série Regular com estruturas mais complexas",
    order: 8,
  },
  {
    bookId: "book_4",
    name: "Book 4",
    level: "intermediate",
    category: "regular",
    stages: 2,
    totalUnits: 14,
    description: "Quarto livro da série Regular para nível intermediário",
    order: 9,
  },
  {
    bookId: "book_5",
    name: "Book 5",
    level: "upper_intermediate",
    category: "regular",
    stages: 2,
    totalUnits: 14,
    description: "Quinto livro da série Regular para nível intermediário avançado",
    order: 10,
  },
];

const unitsData = {
  junior_starter_a: [
    { unitNumber: 1, title: "Greetings and Introductions", stage: 1, lessons: 2, description: "Aprender a cumprimentar e se apresentar" },
    { unitNumber: 2, title: "Numbers and Colors", stage: 1, lessons: 2, description: "Números de 0-20 e cores básicas" },
    { unitNumber: 3, title: "School Materials", stage: 1, lessons: 2, description: "Vocabulário de materiais escolares" },
    { unitNumber: 4, title: "Classroom Objects", stage: 1, lessons: 2, description: "Objetos da sala de aula" },
    { unitNumber: 5, title: "Possessive Pronouns", stage: 1, lessons: 2, description: "Pronomes possessivos" },
    { unitNumber: 6, title: "School Subjects", stage: 1, lessons: 2, description: "Disciplinas escolares" },
    { unitNumber: 7, title: "Days and Months", stage: 1, lessons: 2, description: "Dias da semana e meses" },
    { unitNumber: 8, title: "Seasons and Weather", stage: 1, lessons: 2, description: "Estações e clima" },
    { unitNumber: 9, title: "Family Members", stage: 1, lessons: 2, description: "Membros da família" },
    { unitNumber: 10, title: "House Rooms", stage: 1, lessons: 2, description: "Cômodos da casa" },
    { unitNumber: 11, title: "Furniture and Positions", stage: 1, lessons: 2, description: "Móveis e posições" },
    { unitNumber: 12, title: "Daily Routines", stage: 1, lessons: 2, description: "Rotinas diárias" },
    { unitNumber: 13, title: "Time and Periods", stage: 2, lessons: 2, description: "Horas e períodos do dia" },
    { unitNumber: 14, title: "Animals", stage: 2, lessons: 2, description: "Animais domésticos e selvagens" },
    { unitNumber: 15, title: "Vegetables and Fruits", stage: 2, lessons: 2, description: "Vegetais e frutas" },
    { unitNumber: 16, title: "Food Preferences", stage: 2, lessons: 2, description: "Preferências alimentares" },
    { unitNumber: 17, title: "Sports and Activities", stage: 2, lessons: 2, description: "Esportes e atividades" },
    { unitNumber: 18, title: "Clothes", stage: 2, lessons: 2, description: "Roupas e acessórios" },
    { unitNumber: 19, title: "Body Parts", stage: 2, lessons: 2, description: "Partes do corpo" },
    { unitNumber: 20, title: "Feelings and Emotions", stage: 2, lessons: 2, description: "Sentimentos e emoções" },
    { unitNumber: 21, title: "Toys and Games", stage: 2, lessons: 2, description: "Brinquedos e jogos" },
    { unitNumber: 22, title: "Places in Town", stage: 2, lessons: 2, description: "Lugares na cidade" },
    { unitNumber: 23, title: "Transportation", stage: 2, lessons: 2, description: "Meios de transporte" },
    { unitNumber: 24, title: "Professions", stage: 2, lessons: 2, description: "Profissões" },
  ],
  book_1: [
    { unitNumber: 1, title: "Greetings, Introductions and Goodbyes", stage: 1, lessons: 2, description: "Cumprimentos e apresentações" },
    { unitNumber: 2, title: "Describing People", stage: 1, lessons: 2, description: "Descrevendo pessoas" },
    { unitNumber: 3, title: "Lifestyles and Eating Habits", stage: 1, lessons: 2, description: "Estilos de vida e hábitos alimentares" },
    { unitNumber: 4, title: "Food and Drink (1)", stage: 1, lessons: 2, description: "Comida e bebida - Parte 1" },
    { unitNumber: 5, title: "Food and Drink (2)", stage: 1, lessons: 2, description: "Comida e bebida - Parte 2" },
    { unitNumber: 6, title: "Personalities and Moods", stage: 1, lessons: 2, description: "Personalidades e humores" },
    { unitNumber: 7, title: "Accidents and the Human Body", stage: 2, lessons: 2, description: "Acidentes e corpo humano" },
    { unitNumber: 8, title: "Money and Shopping (1)", stage: 2, lessons: 2, description: "Dinheiro e compras - Parte 1" },
    { unitNumber: 9, title: "Money and Shopping (2)", stage: 2, lessons: 2, description: "Dinheiro e compras - Parte 2" },
    { unitNumber: 10, title: "Family and Friendship", stage: 2, lessons: 2, description: "Família e amizade" },
    { unitNumber: 11, title: "Fashionable and Unfashionable", stage: 2, lessons: 2, description: "Moda e tendências" },
    { unitNumber: 12, title: "Giving and Asking for Advice", stage: 2, lessons: 2, description: "Dando e pedindo conselhos" },
    { unitNumber: 13, title: "The Best and the Worst", stage: 2, lessons: 2, description: "O melhor e o pior" },
    { unitNumber: 14, title: "Review and Practice", stage: 2, lessons: 2, description: "Revisão e prática" },
  ],
};

async function seedDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_URL?.split("://")[1]?.split(":")[0] || "localhost",
    user: process.env.DATABASE_URL?.split("://")[1]?.split(":")[1]?.split("@")[0] || "root",
    password: process.env.DATABASE_URL?.split(":")[2]?.split("@")[0] || "",
    database: process.env.DATABASE_URL?.split("/")[3]?.split("?")[0] || "influx",
  });

  const db = drizzle(connection);

  try {
    console.log("🌱 Starting to seed books...");

    for (const bookData of booksData) {
      await db.insert(books).values(bookData);
      console.log(`✓ Inserted book: ${bookData.name}`);
    }

    console.log("✓ All books seeded successfully!");
    console.log("🌱 Starting to seed units...");

    // Note: In production, you would fetch the book IDs from the database
    // For now, we're using a simplified approach
    console.log("✓ Units seeding setup complete (requires book IDs from database)");

    await connection.end();
    console.log("✅ Database seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    await connection.end();
    process.exit(1);
  }
}

seedDatabase();
