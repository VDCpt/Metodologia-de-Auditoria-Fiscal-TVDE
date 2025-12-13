// Constante para o IVA (6%)
const IVA_TAXA = 0.06;
const MESES_ANO = 12;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicialização de Campos de Autenticação (Autor e Data)
    const dataEmissaoInput = document.getElementById('dataEmissao');
    const today = new Date().toISOString().split('T')[0];
    
    // Define a data de emissão para a data de hoje por defeito
    if (dataEmissaoInput) {
        dataEmissaoInput.value = today;
        document.getElementById('dataEmissaoPrint').innerText = today;
    }

    // Define o nome de assinatura inicial
    const autorInput = document.getElementById('autor');
    if (autorInput) {
        const autorNome = autorInput.value || "[AUTOR DESCONHECIDO]";
        document.getElementById('autorPrint').innerText = autorNome;
        document.getElementById('autorAssinatura').innerText = autorNome;
        
        // Listener para atualizar o nome do autor/assinatura em tempo real
        autorInput.addEventListener('input', () => {
            const novoNome = autorInput.value || "[AUTOR DESCONHECIDO]";
            document.getElementById('autorPrint').innerText = novoNome;
            document.getElementById('autorAssinatura').innerText = novoNome;
        });
    }

    // 2. Inicialização dos Cálculos
    // Chamamos o cálculo operacional que, por sua vez, chama o cálculo de discrepância.
    calcularBaseTributavelOperacional();
});


// 1. Cálculo da Base Tributável Operacional Retida (BTOR) e Ganhos Líquidos
function calcularBaseTributavelOperacional() {
    // --- Ganhos Brutos e Aditivos (Entrada do Motorista) ---
    const ganhosBrutos = parseFloat(document.getElementById('ganhosBrutos').value) || 0;
    // const pagamentosApp = parseFloat(document.getElementById('pagamentosApp').value) || 0; // Normalmente já está incluído no total de ganhos brutos
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

    // --- CÁLCULO Ganhos Líquidos (Apenas informativo) ---
    // Ganhos Líquidos = Ganhos Brutos - Deduções (Comissão + Taxas Reserva Deduzidas) + Aditivos (Campanhas, Gorjetas, etc.)
    const ganhosLiquidos = 
        ganhosBrutos - comissaoPlataformaOperacionais - taxasReservaDeducoes + 
        campanhas + taxasCancelamento + gorjetasOperacionais + portagensOperacionais;
        
    // Atualizar o HTML
    document.getElementById('ganhosLiquidosResultado').textContent = ganhosLiquidos.toFixed(2) + ' €';
    document.getElementById('btOperacionalResultado').textContent = btor.toFixed(2) + ' €';
    document.getElementById('baseTributavelOperacional').value = btor;
    document.getElementById('btorFinal').textContent = btor.toFixed(2) + ' €';

    // Chama o cálculo da Discrepância sempre que a BTOR muda
    calcularDiscrepancia();
}

// 2. Cálculo da Discrepância e Projeção Fiscal
function calcularDiscrepancia() {
    // Obter a BTOR (calculada na função anterior)
    const btor = parseFloat(document.getElementById('baseTributavelOperacional').value) || 0;
    
    // Obter a Base Tributável Faturada (BTF) da Coluna 2
    const btf = parseFloat(document.getElementById('baseTributavelFaturada').value) || 0;
    
    // Obter o contexto do mercado (usando Motoristas Ativos)
    const motoristasAtivos = parseFloat(document.getElementById('motoristasAtivos').value) || 1; 

    // --- CÁLCULO DA DISCREPÂNCIA ---
    const discrepancia = btor - btf;
    
    // --- CÁLCULO DA PERCENTAGEM DE OMISSÃO ---
    let percentagemOmissao = 0;
    if (btor > 0) {
        percentagemOmissao = (discrepancia / btor) * 100;
    }
    
    // --- CÁLCULO DO IVA POTENCIAL OMITIDO ---
    const ivaPotencial = discrepancia * IVA_TAXA;
    
    // --- PROJEÇÃO DE MERCADO ---
    const omissaoPorMotorista = discrepancia; // Omissão da amostra
    const valorOmitidoMensal = omissaoPorMotorista * motoristasAtivos;
    const valorOmitidoAnual = valorOmitidoMensal * MESES_ANO;


    // --- Atualizar Resultados na Secção de Auditoria ---

    // Resultados da Base Tributável
    document.getElementById('btfFinal').textContent = btf.toFixed(2) + ' €';
    
    // Discrepância
    document.getElementById('discrepanciaResultado').textContent = discrepancia.toFixed(2) + ' €';
    
    // Percentagem de Omissão
    document.getElementById('percentagemOmissao').textContent = percentagemOmissao.toFixed(2) + ' %';
    
    // IVA Potencial Omitido
    document.getElementById('ivaPotencialResultado').textContent = ivaPotencial.toFixed(2) + ' €';

    // Projeção no Contexto de Mercado (Formatado para EUR)
    document.getElementById('motoristasAtivosContexto').textContent = motoristasAtivos.toLocaleString('pt-PT');
    document.getElementById('omissaoPorMotorista').textContent = omissaoPorMotorista.toFixed(2) + ' €';
    
    document.getElementById('valorOmitidoMensal').textContent = valorOmitidoMensal.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });
    document.getElementById('valorOmitidoAnual').textContent = valorOmitidoAnual.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });
}

// --- Associações de Eventos (Otimizadas) ---

// Coluna 1: Inputs Operacionais (afetam BTOR)
const inputsOperacionais = ['ganhosBrutos', 'pagamentosApp', 'campanhas', 'taxasCancelamento', 'gorjetasOperacionais', 'portagensOperacionais', 'taxasReservaOperacionaisBruto', 'taxasReservaDeducoes', 'comissaoPlataformaOperacionais'];
inputsOperacionais.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener('input', calcularBaseTributavelOperacional);
    }
});

// Coluna 2 e Contexto: Inputs Fiscais e Mercado (afetam Discrepância)
const inputsDiscrepancia = ['baseTributavelFaturada', 'motoristasAtivos', 'iva6', 'reverseCharge'];
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
