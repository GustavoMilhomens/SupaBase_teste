# 🚀 Supabase + GitHub Pages

Este projeto conecta um site estático ao Supabase e pode ser hospedado gratuitamente no GitHub Pages.

---

## 📋 Pré-requisitos

1. Conta no [Supabase](https://supabase.com)
2. Conta no [GitHub](https://github.com)

---

## 🔧 Configuração do Supabase

### 1. Criar projeto
- Acesse [supabase.com](https://supabase.com) → "New Project"
- Preencha: nome, senha, região

### 2. Criar tabela
No Editor SQL do Supabase:

```sql
-- Criar tabela itens
CREATE TABLE itens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    descricao TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar acesso anônimo (Row Level Security)
ALTER TABLE itens ENABLE ROW LEVEL SECURITY;

-- Permitir leitura/escrita pública
CREATE POLICY "Allow public access" ON itens
    FOR ALL USING (true) WITH CHECK (true);
```

### 3. Obter credenciais
- Settings → API
- Copie **Project URL** e **anon public key**

---

## ⚙️ Configurar o site

Abra `app.js` e substitua:

```javascript
const SUPABASE_URL = 'https://SEU-PROJETO.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

---

## 🌐 Publicar no GitHub

### 1. Criar repositório
- GitHub → New Repository
- Nome: `meu-site-supabase`
- Público

### 2. Enviar arquivos
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/meu-site-supabase.git
git push -u origin main
```

### 3. Ativar GitHub Pages
- Settings → Pages
- Branch: `main` → Save

Aguarde 1-2 minutos e seu site estará no ar!

---

## 📁 Estrutura

```
SupaBase_teste/
├── index.html   # Interface do usuário
├── app.js       # Lógica e conexão Supabase
├── style.css    # Estilos
└── README.md    # Este arquivo
```

---

## ⚠️ Observações Importantes

| Item | Detalhe |
|------|---------|
| **Segurança** | A chave `anon` é segura para cliente público |
| **Limites** | Supabase gratuito: 500MB DB, 1GB storage |
| **SSL** | GitHub Pages já fornece HTTPS automático |

---

## 🎯 Próximos passos

- Adicionar autenticação de usuários
- Implementar upload de arquivos
- Criar dashboard admin