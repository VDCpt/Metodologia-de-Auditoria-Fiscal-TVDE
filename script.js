// VARIÁVEIS FIXAS (Para a Extrapolação de Litígio)
const anosOperacao = 7;

// Função para formatar números para EUR
const formatarEuro = (valor) => {
    return valor.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });
};

// Elementos de Input
const inputComissaoRetida = document.getElementById('comissaoRetida');
const inputBaseFaturada = document.getElementById('baseFaturada');
const inputMotoristasAtivos = document.getElementById('motoristasAtivosInput');

// Elementos de Output (Discrepância e Extrapolação)
const omissaoMensalOutput = document.getElementById('omissaoMensal');
const percentagemOmisaoOutput = document.getElementById('percentagemOmisao');
const omissaoAnualOutput = document.getElementById('omissao-anual');
const potencialTotalOutput = document.getElementById('potencial-total');
const comissaoDeduzidaOutput = document.getElementById('comissaoDeduzida');


// Função Principal de Cálculo e Renderização
function calcularDesvio() {
    // Coleta valores
    const comissaoRetida = parseFloat(inputComissaoRetida.value) || 0;
    const baseFaturada = parseFloat(inputBaseFaturada.value) || 0;
    const motoristasAtivos = parseInt(inputMotoristasAtivos.value) || 0;

    // 1. CÁLCULO DA OMISSÃO MENSAL (€169.64 no seu caso de amostra)
    const omissaoMensal = comissaoRetida - baseFaturada;
    
    // 2. CÁLCULO DA PERCENTAGEM (Evitar divisão por zero)
    let percentagemOmisao = 0;
    if (comissaoRetida > 0) {
        percentagemOmisao = (omissaoMensal / comissaoRetida) * 100;
    }

    // 3. CÁLCULO DA EXTRAPOLAÇÃO (Motorista x Meses x Anos)
    const omissaoAnual = omissaoMensal * 12 * motoristasAtivos;
    const potencialTotalLitigio = omissaoAnual * anosOperacao;

    // 4. ATUALIZAÇÃO DO HTML
    omissaoMensalOutput.textContent = formatarEuro(omissaoMensal);
    percentagemOmisaoOutput.textContent = `${percentagemOmisao.toFixed(2)} %`;
    omissaoAnualOutput.textContent = formatarEuro(omissaoAnual);
    potencialTotalOutput.textContent = formatarEuro(potencialTotalLitigio);
    
    // Atualiza campo de referência (simplesmente assume que a comissão deduzida é igual à retida, conforme a lógica do Doc 3)
    comissaoDeduzidaOutput.textContent = formatarEuro(comissaoRetida);
}

// Inicializa o Simulador
function iniciarSimulador() {
    // Definir valores iniciais da sua amostra (Novembro 2025)
    inputComissaoRetida.value = '279.54';
    inputBaseFaturada.value = '110.90';
    inputMotoristasAtivos.value = '36000';
    
    calcularDesvio(); // Renderiza os valores iniciais (€513M)
    
    // Adiciona escutadores de eventos para recalcular ao digitar
    inputComissaoRetida.addEventListener('input', calcularDesvio);
    inputBaseFaturada.addEventListener('input', calcularDesvio);
    inputMotoristasAtivos.addEventListener('input', calcularDesvio);
}

iniciarSimulador();
