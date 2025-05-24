// Script para verificar a estrutura da tabela 'leads' no Supabase
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Configuração do cliente Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são necessárias');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLeadsTable() {
  try {
    // 1. Verifica se a tabela existe
    const { data: tableExists, error: tableError } = await supabase
      .rpc('table_exists', { table_name: 'leads' });

    if (tableError) {
      console.error('Erro ao verificar se a tabela existe:', tableError);
      return;
    }

    if (!tableExists) {
      console.log('A tabela "leads" não existe no banco de dados.');
      return;
    }

    console.log('A tabela "leads" existe no banco de dados.');

    // 2. Lista as colunas da tabela
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'leads')
      .eq('table_schema', 'public');

    if (columnsError) {
      console.error('Erro ao listar colunas:', columnsError);
      return;
    }

    console.log('\nEstrutura da tabela "leads":');
    console.table(columns);

    // 3. Tenta inserir um registro de teste
    console.log('\nTentando inserir um registro de teste...');
    const { data: insertData, error: insertError } = await supabase
      .from('leads')
      .insert([
        { 
          first_name: 'Teste', 
          whatsapp: '11999999999', 
          email: 'teste@example.com' 
        }
      ])
      .select();

    if (insertError) {
      console.error('Erro ao inserir registro de teste:', insertError);
    } else {
      console.log('Registro de teste inserido com sucesso:', insertData);
      
      // 4. Limpa o registro de teste
      const { error: deleteError } = await supabase
        .from('leads')
        .delete()
        .eq('email', 'teste@example.com');
      
      if (deleteError) {
        console.error('Erro ao limpar registro de teste:', deleteError);
      } else {
        console.log('Registro de teste removido com sucesso.');
      }
    }
  } catch (error) {
    console.error('Erro inesperado:', error);
  }
}

// Executa a função principal
checkLeadsTable();
