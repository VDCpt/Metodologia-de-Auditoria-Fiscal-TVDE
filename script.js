// Constante para o IVA (6%)
const IVA_TAXA = 0.06;
const MESES_ANO = 12;
const DEFAULT_MOTORISTAS = 38638; // Valor padrão para projeção de mercado.

/**
 * Função utilitária para formatar valores monetários em EUR.
 * Garante que a projeção de omissão é sempre não-negativa se allowNegative=false.
 * @param {number} value O valor a ser formatado.
 * @param {boolean} allowNegative Se negativo deve ser permitido (Usado para a Discrepância de Amostra, mas não para a Projeção de Mercado).
 * @returns {string} O valor formatado.
 */
function formatCurrency(value, allowNegative = false) {
    const finalValue = allowNegative ? value : Math.max(0, value);
    return finalValue.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });
}

// --- Função para Atualizar o Nome do Ficheiro (CORRIGIDA) ---
function updateFilenameTitle() {
    const ano = document.getElementById('ano').value || 'AAAA';
    const mes = document.getElementById('mes').value || 'MM';
    
    // Obter o texto do select da plataforma
    const nomeEmpresaSelect = document.getElementById('nomeEmpresa');
    const plataforma = nomeEmpresaSelect.value || 'PLATAFORMA'; 
    
    const idProcesso = document.getElementById('idProcesso').value || 'ID';
    
    const filenameElement = document.getElementById('filenameTitle');
    
    // Formato: AAAA_MM_PLATAFORMA_ID_ANALISE.pdf
    filenameElement.innerText = `NOME DO FICHEIRO: ${ano}_${mes}_${plataforma}_${idProcesso}_ANALISE.pdf`;
}


function calcularBaseTributavelOperacional() {
    // --- Ganhos Brutos e Aditivos (Entrada do Motorista) ---
    // Apenas a BTOR é calculada aqui; Ganhos Líquidos é input manual.
    const taxasReservaDeducoes = parseFloat(document.getElementById('taxasReservaDeducoes').value) || 0;
    const comissaoPlataformaOperacionais = parseFloat(document.getElementById('comissaoPlataformaOperacionais').value) || 0;

    // --- CÁLCULO BASE TRIBUTÁVEL OPERACIONAL RETIDA (BTOR) ---
    const btor = comissaoPlataformaOperacionais + taxasReservaDeducoes;

    // --- Ganhos Líquidos (INPUT MANUAL) ---
    const ganhosLiquidos = parseFloat(document.getElementById('ganhosLiquidosInput').value) || 0;

    // Atualizar o HTML
    document.getElementById('btOperacionalResultado').textContent = btor.toFixed(2) + ' €';
    document.getElementById('baseTributavelOperacional').value = btor;
    document.getElementById('btorFinal').textContent = btor.toFixed(2) + ' €';
    
    // Atualiza o valor dos Ganhos Líquidos para impressão
    document.getElementById('ganhosLiquidosPrint').textContent = ganhosLiquidos.toFixed(2) + ' €';

    // Chama o cálculo da Discrepância sempre que a BTOR muda
    calcularDiscrepancia();
}

function calcularDiscrepancia() {
    // Obter a BTOR (calculada na função anterior)
    const btor = parseFloat(document.getElementById('baseTributavelOperacional').value) || 0;
    
    // Obter a Base Tributável Faturada (BTF) da Coluna 2
    const btf = parseFloat(document.getElementById('baseTributavelFaturada').value) || 0;
    
    // Obter o contexto do mercado (usando Motoristas Ativos)
    const motoristasAtivos = parseFloat(document.getElementById('motoristasAtivos').value) || DEFAULT_MOTORISTAS; 

    // --- CÁLCULO DA DISCREPÂNCIA ---
    const discrepancia = btor - btf; // Permite valor negativo

    // --- CÁLCULO DA PERCENTAGEM DE OMISSÃO ---
    let percentagemOmissao = 0;
    if (btor !== 0) {
        percentagemOmissao = (discrepancia / btor) * 100;
    }
    
    // Omissão da Amostra (só é positiva se houver discrepância)
    const omissaoAmostra = Math.max(0, discrepancia); 
    
    // --- CÁLCULO DO IVA POTENCIAL OMITIDO ---
    const ivaPotencial = omissaoAmostra * IVA_TAXA;
    
    // --- PROJEÇÃO DE MERCADO ---
    // Apenas a omissão positiva é projetada no mercado
    const omissaoPorMotorista = omissaoAmostra; 
    const valorOmitidoMensal = omissaoPorMotorista * motoristasAtivos;
    const valorOmitidoAnual = valorOmitidoMensal * MESES_ANO;


    // --- Atualizar Resultados na Secção de Auditoria ---
    document.getElementById('btfFinal').textContent = btf.toFixed(2) + ' €';
    document.getElementById('discrepanciaResultado').textContent = discrepancia.toFixed(2) + ' €';
    document.getElementById('percentagemOmissao').textContent = percentagemOmissao.toFixed(2) + ' %';
    document.getElementById('ivaPotencialResultado').textContent = ivaPotencial.toFixed(2) + ' €';

    // Projeção no Contexto de Mercado
    document.getElementById('motoristasAtivosContexto').textContent = motoristasAtivos.toLocaleString('pt-PT');
    document.getElementById('omissaoPorMotorista').textContent = omissaoAmostra.toFixed(2) + ' €';
    
    // Projeções usam formatCurrency para garantir que são sempre não-negativas
    document.getElementById('valorOmitidoMensal').textContent = formatCurrency(valorOmitidoMensal);
    document.getElementById('valorOmitidoAnual').textContent = formatCurrency(valorOmitidoAnual);
}

// --- Funções de Inicialização e Event Listeners ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicialização de Campos de Autenticação (Autor e Data)
    const dataEmissaoInput = document.getElementById('dataEmissao');
    const today = new Date().toISOString().split('T')[0];
    
    if (dataEmissaoInput) {
        dataEmissaoInput.value = today;
        document.getElementById('dataEmissaoPrint').innerText = today;
    }

    // Define o nome de assinatura inicial e listeners
    const autorInput = document.getElementById('autor');
    if (autorInput) {
        const updateAuthor = () => {
            const novoNome = autorInput.value || "[AUTOR DESCONHECIDO]";
            document.getElementById('autorPrint').innerText = novoNome;
            document.getElementById('autorAssinatura').innerText = novoNome;
        };
        updateAuthor();
        autorInput.addEventListener('input', updateAuthor);
    }
    
    // Define listeners para os campos de topo (atualização de exibição e NOME DO FICHEIRO)
    const fieldsToMirror = ['nomeEmpresa', 'nifEmpresa', 'idProcesso', 'mes', 'ano'];
    fieldsToMirror.forEach(id => {
        const inputElement = document.getElementById(id);
        const printElement = document.getElementById(id + 'Print');

        if (inputElement && printElement) {
            const updateMirror = () => {
                let value = inputElement.value;
                if (inputElement.tagName === 'SELECT') {
                    value = inputElement.options[inputElement.selectedIndex].text;
                }
                printElement.innerText = value;
                
                // CHAMA A FUNÇÃO DE NOMEAÇÃO AQUI
                updateFilenameTitle(); 
            };
            inputElement.addEventListener('input', updateMirror);
            inputElement.addEventListener('change', updateMirror);
            updateMirror(); // Inicializar
        }
    });

    // 2. Inicialização dos Cálculos e Nome do Ficheiro
    calcularBaseTributavelOperacional();
    updateFilenameTitle(); // Assegurar que o nome do ficheiro é calculado logo no início
    
    // 3. Setup dos botões de Ação
    document.getElementById('calculateButton').addEventListener('click', calcularBaseTributavelOperacional);
    document.getElementById('printButton').addEventListener('click', () => {
        window.print();
    });
});


// --- Associações de Eventos (Otimizadas) ---

// Inputs Operacionais (afetam BTOR) e Ganhos Líquidos (agora input)
const inputsOperacionais = ['ganhosBrutos', 'pagamentosApp', 'campanhas', 'taxasCancelamento', 'gorjetasOperacionais', 'portagensOperacionais', 'taxasReservaOperacionaisBruto', 'taxasReservaDeducoes', 'comissaoPlataformaOperacionais', 'ganhosLiquidosInput'];
inputsOperacionais.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener('input', calcularBaseTributavelOperacional);
    }
});

// Inputs Fiscais e Mercado (afetam Discrepância)
const inputsDiscrepancia = ['baseTributavelFaturada', 'motoristasAtivos', 'viaturasAtivas', 'iva6', 'reverseCharge'];
inputsDiscrepancia.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener('input', calcularDiscrepancia);
        element.addEventListener('change', calcularDiscrepancia); // Para selects
    }
});

// Atualizar resultado da BTF em tempo real
document.getElementById('baseTributavelFaturada').addEventListener('input', () => {
    const btf = parseFloat(document.getElementById('baseTributavelFaturada').value) || 0;
    document.getElementById('btFaturadaResultado').textContent = btf.toFixed(2) + ' €';
});
