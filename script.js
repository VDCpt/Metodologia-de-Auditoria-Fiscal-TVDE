// VARIÁVEIS FIXAS (Para a Extrapolação de Litígio)
const motoristasAtivos = 36000;
const anosOperacao = 7;

// Função para formatar números para EUR
const formatarEuro = (valor) => {
    return valor.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });
};

// Elementos de Input
const inputOperacional = document.getElementById('baseOperacional');
const inputFaturada = document.getElementById('baseFaturada');

// Elementos de Output
const omissaoMensalOutput = document.getElementById('omissaoMensal');
const percentagemOmisaoOutput = document.getElementById('percentagemOmisao');
const omissaoAnualOutput = document.getElementById('omissao-anual');
const potencialTotalOutput = document.getElementById('potencial-total');

// Função Principal de Cálculo e Renderização
function calcularDesvio() {
    // Coleta valores (deve ser convertido para float, ou 0 se vazio)
    const totalBaseOperacional = parseFloat(inputOperacional.value) || 0;
    const baseFaturada = parseFloat(inputFaturada.value) || 0;

    // 1. CÁLCULO DA OMISSÃO MENSAL
    const omissaoMensal = totalBaseOperacional - baseFaturada;
    
    // 2. CÁLCULO DA PERCENTAGEM (Evitar divisão por zero)
    let percentagemOmisao = 0;
    if (totalBaseOperacional > 0) {
        percentagemOmisao = (omissaoMensal / totalBaseOperacional) * 100;
    }

    // 3. CÁLCULO DA EXTRAPOLAÇÃO (€513M)
    const omissaoAnual = omissaoMensal * 12 * motoristasAtivos;
    const potencialTotalLitigio = omissaoAnual * anosOperacao;

    // 4. ATUALIZAÇÃO DO HTML
    omissaoMensalOutput.textContent = formatarEuro(omissaoMensal);
    percentagemOmisaoOutput.textContent = `${percentagemOmisao.toFixed(2)} %`;
    omissaoAnualOutput.textContent = formatarEuro(omissaoAnual);
    potencialTotalOutput.textContent = formatarEuro(potencialTotalLitigio);
}

// Inicializa os valores e adiciona escutadores para atualizações dinâmicas
function iniciarSimulador() {
    calcularDesvio(); // Renderiza os valores iniciais (0.00)

    // Adiciona escutadores de eventos para recalcular ao digitar
    inputOperacional.addEventListener('input', calcularDesvio);
    inputFaturada.addEventListener('input', calcularDesvio);
}

// Inicia o simulador
iniciarSimulador();
