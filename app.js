// Aguarda as configurações injetadas
const config = window.SUPABASE_CONFIG || {};

let supabaseClient;

// Inicialização Segura
if (typeof supabase === 'undefined') {
    document.getElementById('status').textContent = "❌ Erro: Biblioteca não carregada";
} else if (!config.url || !config.key) {
    document.getElementById('status').textContent = "❌ Erro: Chaves não configuradas no GitHub";
} else {
    supabaseClient = supabase.createClient(config.url, config.key);
    console.log("Supabase inicializado!");
}

// Funções
async function checkConnection() {
    if (!supabaseClient) return;
    const statusEl = document.getElementById('status');
    try {
        const { error } = await supabaseClient.from('itens').select('id').limit(1);
        if (error) throw error;
        statusEl.textContent = '✅ Conectado ao Supabase';
        statusEl.style.background = "rgba(78, 205, 196, 0.2)";
    } catch (err) {
        statusEl.textContent = '❌ Erro de RLS ou Tabela: ' + err.message;
    }
}

async function loadItens() {
    if (!supabaseClient) return;
    const listEl = document.getElementById('itensList');
    listEl.innerHTML = '<li>Carregando...</li>';
    const { data, error } = await supabaseClient.from('itens').select('*');
    if (error) {
        alert("Erro ao carregar: " + error.message);
        return;
    }
    listEl.innerHTML = data.map(item => `<li>${item.nome} - ${item.descricao}</li>`).join('');
}

async function addItem(e) {
    e.preventDefault();
    if (!supabaseClient) return;
    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;
    const { error } = await supabaseClient.from('itens').insert([{ nome, descricao }]);
    if (error) alert(error.message);
    else {
        document.getElementById('addForm').reset();
        loadItens();
    }
}

// Eventos
document.getElementById('addForm').addEventListener('submit', addItem);
document.getElementById('loadBtn').addEventListener('click', loadItens);
checkConnection();
