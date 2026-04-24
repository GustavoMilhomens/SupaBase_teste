// ============================================
// CONFIGURAÇÃO DO SUPABASE
// ============================================
// Credenciais são injetadas pelo GitHub Actions durante o deploy
// Os valores ${SUPABASE_URL} e ${SUPABASE_KEY} são substituídos pelos secrets

const SUPABASE_URL = '${SUPABASE_URL}';
const SUPABASE_KEY = '${SUPABASE_KEY}';

// Inicializar cliente Supabase
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================
// TABELA: itens (crie no Supabase)
// ============================================
// Colunas:
// - id (uuid, primary key, auto-generated)
// - nome (text)
// - descricao (text)
// - created_at (timestamp)

// ============================================
// FUNÇÕES DO APP
// ============================================

// Status da conexão
async function checkConnection() {
    const statusEl = document.getElementById('status');
    try {
        const { data, error } = await window.supabaseClient
            .from('itens')
            .select('count', { count: 'exact', head: true });
        
        if (error) throw error;
        statusEl.textContent = '✅ Conectado ao Supabase';
        statusEl.className = 'status success';
    } catch (err) {
        statusEl.textContent = '❌ Erro: ' + err.message;
        statusEl.className = 'status error';
    }
}

// Carregar itens
async function loadItens() {
    const listEl = document.getElementById('itensList');
    listEl.innerHTML = '<li>Carregando...</li>';
    
    const { data, error } = await window.supabaseClient
        .from('itens')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        listEl.innerHTML = '<li>Erro: ' + error.message + '</li>';
        return;
    }
    
    if (data.length === 0) {
        listEl.innerHTML = '<li>Nenhum item cadastrado</li>';
        return;
    }
    
    listEl.innerHTML = data.map(item => `
        <li>
            <strong>${item.nome}</strong> - ${item.descricao}
            <button onclick="deleteItem('${item.id}')">Excluir</button>
        </li>
    `).join('');
}

// Adicionar item
async function addItem(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;
    
    const { error } = await window.supabaseClient
        .from('itens')
        .insert([{ nome, descricao }]);
    
    if (error) {
        alert('Erro: ' + error.message);
        return;
    }
    
    document.getElementById('addForm').reset();
    loadItens();
    alert('Item salvo com sucesso!');
}

// Excluir item
async function deleteItem(id) {
    if (!confirm('Confirmar exclusão?')) return;
    
    const { error } = await window.supabaseClient
        .from('itens')
        .delete()
        .eq('id', id);
    
    if (error) {
        alert('Erro: ' + error.message);
        return;
    }
    
    loadItens();
}

// ============================================
// INICIALIZAÇÃO
// ============================================
document.getElementById('addForm').addEventListener('submit', addItem);
document.getElementById('loadBtn').addEventListener('click', loadItens);

// Verificar conexão ao carregar
checkConnection();