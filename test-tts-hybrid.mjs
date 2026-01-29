/**
 * Script de teste para o sistema TTS com ElevenLabs
 * - Lucas: Adam (Americano)
 * - Emily: Charlotte (Britânica)
 * - Aiko: Jessica (Australiana - calorosa e casual)
 */

import fs from 'fs';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

console.log('🎤 Testando Sistema TTS com ElevenLabs\n');
console.log('ElevenLabs API Key:', ELEVENLABS_API_KEY ? '✅ Configurada' : '❌ Não encontrada');
console.log('');

// Configurações dos personagens
const characters = {
  lucas: {
    name: 'Lucas',
    flag: '🇺🇸',
    voiceId: 'pNInz6obpgDQGcFmaJgB', // Adam
    testText: "Hey there! I'm Lucas from New York City. Let's grab some coffee and talk about your vacation plans!",
  },
  emily: {
    name: 'Emily',
    flag: '🇬🇧',
    voiceId: 'XB0fDUnXU5powFXDhCwa', // Charlotte
    testText: "Hello! I'm Emily from London. It's absolutely lovely to meet you. Shall we discuss British culture?",
  },
  aiko: {
    name: 'Aiko',
    flag: '🇦🇺',
    voiceId: 'cgSgspJ2msm6clMCkdW9', // Jessica - Playful, Bright, Warm
    testText: "G'day mate! I'm Aiko from Sydney. No worries, we'll have a ripper time learning together!",
  },
};

// Função para testar ElevenLabs
async function testElevenLabs(character) {
  console.log(`\n🔊 Testando ${character.name} ${character.flag} via ElevenLabs...`);
  
  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${character.voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: character.testText,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ Erro ElevenLabs: ${response.status} - ${errorText}`);
      return false;
    }

    const audioBuffer = await response.arrayBuffer();
    const fileName = `test-audio-${character.name.toLowerCase()}.mp3`;
    fs.writeFileSync(fileName, Buffer.from(audioBuffer));
    
    console.log(`✅ ${character.name}: Áudio gerado com sucesso!`);
    console.log(`   📁 Arquivo: ${fileName} (${audioBuffer.byteLength} bytes)`);
    console.log(`   💬 Texto: "${character.testText}"`);
    return true;
  } catch (error) {
    console.log(`❌ Erro: ${error.message}`);
    return false;
  }
}

// Executar testes
async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log('INICIANDO TESTES DE TTS - ELEVENLABS');
  console.log('='.repeat(60));

  const results = {};

  // Testar Lucas (ElevenLabs - Adam)
  results.lucas = await testElevenLabs(characters.lucas);

  // Testar Emily (ElevenLabs - Charlotte)
  results.emily = await testElevenLabs(characters.emily);

  // Testar Aiko (ElevenLabs - Jessica)
  results.aiko = await testElevenLabs(characters.aiko);

  // Resumo
  console.log('\n' + '='.repeat(60));
  console.log('RESUMO DOS TESTES');
  console.log('='.repeat(60));
  
  console.log(`\n🇺🇸 Lucas (Adam):     ${results.lucas ? '✅ OK' : '❌ FALHOU'}`);
  console.log(`🇬🇧 Emily (Charlotte): ${results.emily ? '✅ OK' : '❌ FALHOU'}`);
  console.log(`🇦🇺 Aiko (Jessica):    ${results.aiko ? '✅ OK' : '❌ FALHOU'}`);

  const allPassed = results.lucas && results.emily && results.aiko;
  console.log(`\n${allPassed ? '🎉 TODOS OS TESTES PASSARAM!' : '⚠️ ALGUNS TESTES FALHARAM'}`);

  if (allPassed) {
    console.log('\n📂 Arquivos de áudio gerados:');
    console.log('   - test-audio-lucas.mp3 (Americano - Adam)');
    console.log('   - test-audio-emily.mp3 (Britânico - Charlotte)');
    console.log('   - test-audio-aiko.mp3 (Australiano - Jessica)');
  }
}

runTests().catch(console.error);
