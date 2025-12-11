// VARIÁVEIS FIXAS (Para a Extrapolação de Litígio)
const anosOperacao = 7;

// Função para formatar números para EUR
const formatarEuro = (valor) => {
    return valor.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });
};

// Elementos de Input
const inputOperacional = document.getElementById('baseOperacional');
const inputFaturada = document.getElementById('baseFaturada');
const inputMotoristasAtivos = document.getElementById('motoristasAtivosInput');

// Elementos de Output
const omissaoMensalOutput = document.getElementById('omissaoMensal');
const percentagemOmisaoOutput = document.getElementById('percentagemOmisao');
const omissaoAnualOutput = document.getElementById('omissao-anual');
const potencialTotalOutput = document.getElementById('potencial-total');

// Função Principal de Cálculo e Renderização
function calcularDesvio() {
    // Coleta valores
    const totalBaseOperacional = parseFloat(inputOperacional.value) || 0;
    const baseFaturada = parseFloat(inputFaturada.value) || 0;
    const motoristasAtivos = parseInt(inputMotoristasAtivos.value) || 0;

    // 1. CÁLCULO DA OMISSÃO MENSAL
    const omissaoMensal = totalBaseOperacional - baseFaturada;
    
    // 2. CÁLCULO DA PERCENTAGEM (Evitar divisão por zero)
    let percentagemOmisao = 0;
    if (totalBaseOperacional > 0) {
        percentagemOmisao = (omissaoMensal / totalBaseOperacional) * 100;
    }

    // 3. CÁLCULO DA EXTRAPOLAÇÃO (Baseado em novos inputs)
    const omissaoAnual = omissaoMensal * 12 * motoristasAtivos;
    const potencialTotalLitigio = omissaoAnual * anosOperacao;

    // 4. ATUALIZAÇÃO DO HTML
    omissaoMensalOutput.textContent = formatarEuro(omissaoMensal);
    percentagemOmisaoOutput.textContent = `${percentagemOmisao.toFixed(2)} %`;
    omissaoAnualOutput.textContent = formatarEuro(omissaoAnual);
    potencialTotalOutput.textContent = formatarEuro(potencialTotalLitigio);
}

// Adiciona escutadores de eventos para recalcular ao digitar
function iniciarSimulador() {
    // Definir valores iniciais do seu pitch de €169.64
    inputOperacional.value = '279.54';
    inputFaturada.value = '110.90';
    inputMotoristasAtivos.value = '36000';
    
    calcularDesvio(); // Renderiza os valores iniciais (€513M)
    
    inputOperacional.addEventListener('input', calcularDesvio);
    inputFaturada.addEventListener('input', calcularDesvio);
    inputMotoristasAtivos.addEventListener('input', calcularDesvio);
}

// Inicia o simulador
iniciarSimulador();
