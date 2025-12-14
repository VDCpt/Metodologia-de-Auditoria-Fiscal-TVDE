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

function calcularBaseTributavelOperacional() {
    // --- Ganhos Brutos e Aditivos (Entrada do Motorista) ---
    const ganhosBrutos = parseFloat(document.getElementById('ganhosBrutos').value) || 0;
    // Os campos abaixo são lidos mas não usados no cálculo da BTOR
    const campanhas = parseFloat(document.getElementById('campanhas').value) || 0;
    const taxasCancelamento = parseFloat(document.getElementById('taxasCancelamento').value) || 0;
    const gorjetasOperacionais = parseFloat(document.getElementById('gorjetasOperacionais').value) || 0;
    const portagensOperacionais = parseFloat(document.getElementById('portagensOperacionais').value) || 0;
    const taxasReservaOperacionaisBruto = parseFloat(document.getElementById('taxasReservaOperacionaisBruto').value) || 0;

    // --- Deduções (Retenções da Plataforma - Base para a BTOR) ---
    const taxasReservaDeducoes = parseFloat(document.getElementById('taxasReservaDeducoes').value) || 0;
    const comissaoPlataformaOperacionais = parseFloat(document.getElementById('comissaoPlataformaOperacionais').value) || 0;

    // --- CÁLCULO BASE TRIBUTÁVEL OPERACIONAL RETIDA (BTOR) ---
    // BTOR = Comissões Retidas + Taxas Retidas/Deduções que são consideradas "Serviços"
    const btor = comissaoPlataformaOperacionais + taxasReservaDeducoes;

    // --- Ganhos Líquidos (AGORA É INPUT MANUAL - LÓGICA DE CÁLCULO REMOVIDA) ---
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

    // Resultados da Base Tributável
    document.getElementById('btfFinal').textContent = btf.toFixed(2) + ' €';
    
    // Discrepância (Amostra - permite negativo)
    document.getElementById('discrepanciaResultado').textContent = discrepancia.toFixed(2) + ' €';
    
    // Percentagem de Omissão
    document.getElementById('percentagemOmissao').textContent = percentagemOmissao.toFixed(2) + ' %';
    
    // IVA Potencial Omitido (só se discrepância > 0)
    document.getElementById('ivaPotencialResultado').textContent = ivaPotencial.toFixed(2) + ' €';

    // Projeção no Contexto de Mercado (Formatado para EUR)
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
    
    // Define listeners para os campos de topo (apenas para exibição/impressão)
    const fieldsToMirror = ['nomeEmpresa', 'nifEmpresa', 'idProcesso', 'mes', 'ano'];
    fieldsToMirror.forEach(id => {
        const inputElement = document.getElementById(id);
        const printElement = document.getElementById(id + 'Print');

        if (inputElement && printElement) {
            const updateMirror = () => {
                let value = inputElement.value;
                // Para Selects, obter o texto
                if (inputElement.tagName === 'SELECT') {
                    value = inputElement.options[inputElement.selectedIndex].text;
                }
                printElement.innerText = value;
            };
            inputElement.addEventListener('input', updateMirror);
            inputElement.addEventListener('change', updateMirror);
            updateMirror(); // Inicializar
        }
    });

    // 2. Inicialização dos Cálculos
    calcularBaseTributavelOperacional();
    
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

// Também garantir que o resultado da BTF é atualizado se for introduzido manualmente
document.getElementById('baseTributavelFaturada').addEventListener('input', () => {
    const btf = parseFloat(document.getElementById('baseTributavelFaturada').value) || 0;
    document.getElementById('btFaturadaResultado').textContent = btf.toFixed(2) + ' €';
});
