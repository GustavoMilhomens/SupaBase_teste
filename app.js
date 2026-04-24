// ============================================
// 1. CONFIGURAÇÃO E CONEXÃO (Substitua o topo do seu arquivo por isso)
// ============================================

// Pegamos os dados do arquivo config.js que o robô do GitHub criou
const config = window.SUPABASE_CONFIG || {};

// Variáveis para armazenar a conexão
let supabaseClient;

// Verificação de Segurança para evitar erros no console
if (typeof supabase === 'undefined') {
    console.error("A biblioteca do Supabase não carregou!");
    document.getElementById('status').textContent = "❌ Erro: Biblioteca não carregada";
} else if (!config.url || !config.key) {
    console.error("As chaves não foram encontradas!");
    document.getElementById('status').textContent = "❌ Erro: Chaves não configuradas";
} else {
    // Inicializa o cliente se tudo estiver OK
    supabaseClient = supabase.createClient(config.url, config.key);
    window.supabaseClient = supabaseClient; // Deixa disponível para as outras funções
    console.log("Conectado com sucesso!");
}

// ============================================
// 2. FUNÇÕES DO APP (Mantenha o resto das suas funções abaixo)
// ============================================

async function checkConnection() {
    const statusEl = document.getElementById('status');
    if (!window.supabaseClient) return;

    try {
        const { data, error } = await window.supabaseClient
            .from('itens')
            .select('id')
            .limit(1);
        
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
    if (!window.supabaseClient) return;

    listEl.innerHTML = '<li>Carregando...</li>';
    
    const { data, error } = await window.supabaseClient
        .from('itens')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        listEl.innerHTML = '<li>Erro: ' + error.message + '</li>';
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
    if (!window.supabaseClient) return;
    
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
}

// Excluir item
async function deleteItem(id) {
    if (!confirm('Confirmar exclusão?')) return;
    if (!window.supabaseClient) return;
    
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

// Inicialização
document.getElementById('addForm').addEventListener('submit', addItem);
document.getElementById('loadBtn').addEventListener('click', loadItens);

// Tenta verificar a conexão assim que carregar
checkConnection();
