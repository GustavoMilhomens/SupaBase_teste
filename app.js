// Aguarda o config.js carregar
const { url, key } = window.SUPABASE_CONFIG || {};

if (!url || !key) {
    console.error("Configurações não encontradas!");
    document.getElementById('status').textContent = "❌ Erro de Configuração";
}

const supabaseClient = supabase.createClient(url, key);

async function checkConnection() {
    const statusEl = document.getElementById('status');
    const { error } = await supabaseClient.from('itens').select('id').limit(1);
    
    if (error) {
        statusEl.textContent = '❌ Erro: ' + error.message;
        statusEl.className = 'status error';
    } else {
        statusEl.textContent = '✅ Conectado com Segurança';
        statusEl.className = 'status success';
    }
}

checkConnection();
// ... restante das suas funções de carregar e deletar itens
