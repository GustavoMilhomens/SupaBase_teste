// 1. Importa a biblioteca diretamente (evita erro de 'supabase is not defined')
import { createClient } from 'https://jsdelivr.net'

// 2. Configurações vindas do HTML
const { url, key } = window.SUPABASE_CONFIG || {};

let supabase;

if (!url || url === "PLACEHOLDER_URL") {
    document.getElementById('status').textContent = "⚠️ Aguardando deploy do GitHub...";
} else {
    // 3. Inicializa o cliente
    supabase = createClient(url, key);
    document.getElementById('status').textContent = "✅ Conectado";
    loadItens(); // Carrega os dados ao iniciar
}

// --- FUNÇÕES ---

async function loadItens() {
    const listEl = document.getElementById('itensList');
    listEl.innerHTML = '<li>Carregando...</li>';
    
    const { data, error } = await supabase.from('itens').select('*').order('created_at', { ascending: false });
    
    if (error) {
        listEl.innerHTML = '<li>Erro ao carregar dados</li>';
        return;
    }
    
    listEl.innerHTML = data.map(item => `
        <li>
            <span><strong>${item.nome}</strong>: ${item.descricao}</span>
            <button onclick="window.deleteItem('${item.id}')" style="width: auto; background: #ff6b6b; margin: 0; padding: 5px 10px;">X</button>
        </li>
    `).join('');
}

async function addItem(e) {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;

    const { error } = await supabase.from('itens').insert([{ nome, descricao }]);

    if (error) {
        alert("Erro: " + error.message);
    } else {
        document.getElementById('addForm').reset();
        loadItens();
    }
}

// Tornamos a função de deletar global para o botão do HTML conseguir acessar
window.deleteItem = async (id) => {
    if (!confirm("Deletar item?")) return;
    const { error } = await supabase.from('itens').delete().eq('id', id);
    if (error) alert(error.message);
    else loadItens();
};

// Eventos
document.getElementById('addForm').addEventListener('submit', addItem);
