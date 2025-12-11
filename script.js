// script.js - Motor de Cálculo para VDC

// Constante: Anos de operação para o cálculo total
const ANOS_OPERACAO = 7;
const TAXA_IVA = 0.06; // 6% IVA Potencial

// Seleção dos Elementos de Input (Entrada)
const inputComissaoApp = document.getElementById('comissaoApp');
const inputFaturaDeclarada = document.getElementById('faturaDeclarada');
const inputMotoristasAtivos = document.getElementById('motoristasAtivos');

// Seleção dos Elementos de Output (Resultados)
const displayComissaoDeduzida = document.getElementById('comissaoDeduzidaDisplay');
const resOperacional = document.getElementById('resOperacional');
const resFaturada = document.getElementById('resFaturada');
const resDiscrepancia = document.getElementById('resDiscrepancia');
const resPercentagem = document.getElementById('resPercentagem');
const resIvaOmitido = document.getElementById('resIvaOmitido');
const extrapolacaoAnual = document.getElementById('extrapolacaoAnual');
const extrapolacaoTotal = document.getElementById('extrapolacaoTotal');

// Função de Formatação de Moeda (EUR)
const formatarEuro = (valor) => {
    return valor.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 });
};

// Função Principal de Cálculo
function calcularAuditoria() {
    // 1. Obter valores dos inputs (converte string para float)
    const valComissaoApp = parseFloat(inputComissaoApp.value) || 0;
    const valFaturaDeclarada = parseFloat(inputFaturaDeclarada.value) || 0;
    const valMotoristas = parseInt(inputMotoristasAtivos.value) || 0;

    // 2. Atualizar campos de leitura espelhados
    displayComissaoDeduzida.value = valComissaoApp.toFixed(2);
    resOperacional.innerText = formatarEuro(valComissaoApp);
    resFaturada.innerText = formatarEuro(valFaturaDeclarada);

    // 3. Cálculo da Discrepância (Omissão)
    const discrepancia = valComissaoApp - valFaturaDeclarada;
    
    // 4. Cálculo da Percentagem
    let percentagem = 0;
    if (valComissaoApp > 0) {
        percentagem = (discrepancia / valComissaoApp) * 100;
    }

    // 5. Cálculo do IVA Omitido
    const ivaOmitido = discrepancia * TAXA_IVA;

    // 6. Extrapolações (A Magnitude da Fraude)
    const totalAnual = discrepancia * 12 * valMotoristas;
    const totalLitigio = totalAnual * ANOS_OPERACAO;

    // 7. Atualizar o DOM (Resultados Visuais)
    resDiscrepancia.innerText = formatarEuro(discrepancia);
    
    // Muda a cor se a discrepância for negativa (erro) ou positiva (fraude)
    if (discrepancia < 0) {
        resDiscrepancia.style.color = 'green'; // Sem desvio aparente
    } else {
        resDiscrepancia.style.color = '#c62828'; // Vermelho alerta
    }

    resPercentagem.innerText = percentagem.toFixed(2);
    resIvaOmitido.innerText = formatarEuro(ivaOmitido);
    
    extrapolacaoAnual.innerText = formatarEuro(totalAnual);
    extrapolacaoTotal.innerText = formatarEuro(totalLitigio);
}

// Inicialização
function iniciar() {
    // Calcular imediatamente ao carregar a página
    calcularAuditoria();

    // Adicionar "ouvintes" (listeners) para recalcular sempre que se digita algo
    inputComissaoApp.addEventListener('input', calcularAuditoria);
    inputFaturaDeclarada.addEventListener('input', calcularAuditoria);
    inputMotoristasAtivos.addEventListener('input', calcularAuditoria);
}

// Correr o script
iniciar();
