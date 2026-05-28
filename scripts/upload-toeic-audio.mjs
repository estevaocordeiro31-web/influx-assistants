#!/usr/bin/env node

/**
 * Script para fazer upload dos áudios TOEIC para S3
 * Uso: node scripts/upload-toeic-audio.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const audioDir = path.join(__dirname, '../public/toeic-audio');

// Áudios TOEIC com suas descrições
const TOEIC_AUDIOS = {
  'media1.mp3': 'Part 1 - Photographs Example',
  'media2.mp3': 'Part 2 - Question-Response Example',
  'media3.mp3': 'Part 3 - Conversations Example',
  'media4.mp3': 'Part 4 - Talks Example',
  'media5.mp3': 'TOEIC Audio 5',
  'media6.mp3': 'TOEIC Audio 6',
  'media7.mp3': 'TOEIC Audio 7',
  'media8.mp3': 'TOEIC Audio 8',
  'media9.mp3': 'TOEIC Audio 9',
  'media10.mp3': 'TOEIC Audio 10',
  'media11.mp3': 'TOEIC Audio 11',
  'media12.mp3': 'TOEIC Audio 12',
  'media13.mp3': 'TOEIC Audio 13',
  'media14.mp3': 'TOEIC Audio 14',
  'media15.mp3': 'TOEIC Audio 15',
  'media16.mp3': 'TOEIC Audio 16',
};

console.log('📤 TOEIC Audio Upload Script');
console.log('============================\n');

console.log('Áudios para fazer upload:');
Object.entries(TOEIC_AUDIOS).forEach(([file, desc]) => {
  console.log(`  • ${file} - ${desc}`);
});

console.log('\n✅ Instruções:');
console.log('1. Faça upload dos áudios via Management UI > File Storage');
console.log('2. Use os URLs retornados no ToeicClass.tsx');
console.log('3. Exemplo de URL: https://s3.example.com/toeic-audio/media1.mp3\n');

console.log('📝 URLs dos áudios após upload:');
console.log('================================\n');

Object.keys(TOEIC_AUDIOS).forEach(file => {
  console.log(`export const TOEIC_AUDIO_${file.replace(/[^0-9]/g, '')} = '/toeic-audio/${file}';`);
});

console.log('\n✨ Script de referência criado!');
