import axios from 'axios';

const API_URL = 'http://localhost:3000/api/trpc';

async function testLinkAuthentication() {
  console.log('🔐 Testando autenticação via link personalizado...\n');

  try {
    // Link que foi gerado para Camila
    const camilaLinkHash = 'e6885d84541624e283766735fc500f5731afceeae37dab49c262b5a05867ef53';

    // 1. Validar o link (query - usa GET)
    console.log('1️⃣ Validando link...');
    const queryInput = encodeURIComponent(JSON.stringify({ linkHash: camilaLinkHash }));
    const validateResponse = await axios.get(
      `${API_URL}/personalizedLinks.validateLink?input=${queryInput}`
    );

    console.log('✅ Link validado:');
    console.log(`   - ID do Aluno: ${validateResponse.data.result.data.studentId}`);
    console.log(`   - Nome: ${validateResponse.data.result.data.studentName}`);
    console.log(`   - Válido: ${validateResponse.data.result.data.isValid}`);

    // 2. Autenticar via link (mutation - usa POST)
    console.log('\n2️⃣ Autenticando via link...');
    const authResponse = await axios.post(
      `${API_URL}/personalizedLinks.authenticateViaLink`,
      {
        json: {
          linkHash: camilaLinkHash,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Autenticação bem-sucedida:');
    console.log(`   - ID do Aluno: ${authResponse.data.result.data.studentId}`);
    console.log(`   - Nome: ${authResponse.data.result.data.studentName}`);
    console.log(`   - Mensagem: ${authResponse.data.result.data.message}`);

    // 3. Verificar cookie de sessão
    console.log('\n3️⃣ Verificando cookie de sessão...');
    const setCookieHeader = authResponse.headers['set-cookie'];
    if (setCookieHeader) {
      console.log('✅ Cookie de sessão definido:');
      console.log(`   - ${setCookieHeader[0].substring(0, 80)}...`);
    } else {
      console.log('⚠️ Nenhum cookie de sessão foi definido');
    }

    console.log('\n✨ Teste concluído com sucesso!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Abrir o link no navegador: /access/' + camilaLinkHash);
    console.log('2. Verificar se Camila é autenticada automaticamente');
    console.log('3. Confirmar que o dashboard mostra dados de Camila, não do admin');

  } catch (error) {
    console.error('❌ Erro ao testar autenticação via link:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Dados:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

testLinkAuthentication();
