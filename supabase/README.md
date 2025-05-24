# Configuração do Supabase

Este diretório contém os arquivos de configuração e migração para o banco de dados Supabase.

## Estrutura de Arquivos

- `config.toml` - Configurações do projeto Supabase
- `migrations/` - Arquivos de migração do banco de dados
  - `20240523204000_create_leads_table.sql` - Criação da tabela de leads
- `seed.sql` - Dados iniciais para testes

## Configuração do Ambiente

1. Certifique-se de ter o Docker instalado para executar o Supabase localmente
2. Instale a CLI do Supabase:
   ```bash
   npm install -g supabase
   ```

## Executando Migrações

1. Inicie o ambiente local do Supabase:
   ```bash
   supabase start
   ```

2. Aplique as migrações:
   ```bash
   supabase db reset
   ```

3. (Opcional) Popule com dados de exemplo:
   ```bash
   psql -h localhost -p 54322 -U postgres -d postgres -f supabase/seed.sql
   ```

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

## Acessando o Dashboard

Após iniciar o Supabase localmente, acesse:
- Dashboard: http://localhost:54323
- API: http://localhost:54321
- Database: localhost:54322

## Deploy para Produção

1. Faça login na CLI do Supabase:
   ```bash
   supabase login
   ```

2. Vincule ao seu projeto:
   ```bash
   supabase link --project-ref seu-project-ref
   ```

3. Envie as migrações para produção:
   ```bash
   supabase db push
   ```

4. (Opcional) Execute o seed em produção (tenha cuidado):
   ```bash
   supabase db push --db-url "postgresql://postgres:sua_senha@db.seu-projeto.supabase.co:5432/postgres" -f supabase/seed.sql
   ```

## Políticas de Segurança (RLS)

As políticas de segurança já estão configuradas no arquivo de migração para permitir:
- Inserção de leads por usuários anônimos
- Leitura de leads apenas para o próprio usuário autenticado

## Monitoramento

Você pode monitorar o banco de dados através do painel do Supabase em:
https://app.supabase.com/project/vtvbwyfbukntmzjzfvcw/database/tables
