// Constante para o IVA (6%)
const IVA_TAXA = 0.06;
const MESES_ANO = 12;

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa os cálculos ao carregar a página
    calcularBaseTributavelOperacional();
});

// 1. Cálculo da Base Tributável Operacional Retida (BTOR) e Ganhos Líquidos
function calcularBaseTributavelOperacional() {
    // --- Ganhos Brutos (Base para o cálculo Líquido) ---
    const ganhosBrutos = parseFloat(document.getElementById('ganhosBrutos').value) || 0;
    
    // --- Deduções ---
    const taxasReservaDeducoes = parseFloat(document.getElementById('taxasReservaDeducoes').value) || 0;
    const comissaoPlataformaOperacionais = parseFloat(document.getElementById('comissaoPlataformaOperacionais').value) || 0;
    
    // Outras deduções a considerar para Ganhos Líquidos (excluindo BTOR e incluindo pagamentosApp)
    const pagamentosApp = parseFloat(document.getElementById('pagamentosApp').value) || 0;
    const taxasReservaOperacionaisBruto = parseFloat(document.getElementById('taxasReservaOperacionaisBruto').value) || 0;
    const gorjetasOperacionais = parseFloat(document.getElementById('gorjetasOperacionais').value) || 0;
    
    // Deduções Totais (Simples - Ajustar conforme a sua metodologia)
    const deducoesTotais = (ganhosBrutos - pagamentosApp) + taxasReservaDeducoes;
    
    // --- Ganhos Líquidos ---
    // Ganhos Líquidos = Pagamentos APP + Gorjetas - Deduções
    // Alternativamente: Ganhos Líquidos = Ganhos Brutos - Comissão da Plataforma - Taxas - ...
    // Usaremos uma simplificação para fins de demonstração da UI:
    const ganhosLiquidos = ganhosBrutos - (comissaoPlataformaOperacionais + taxasReservaDeducoes);


    // --- Cálculo da Base Tributável Operacional Retida (BTOR) ---
    // BTOR é a soma das comissões e taxas que são retidas pela Plataforma.
    const btor = comissaoPlataformaOperacionais + taxasReservaDeducoes;
    
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
    const motoristasAtivos = parseFloat(document.getElementById('motoristasAtivos').value) || 1; // Evitar divisão por zero

    // --- CÁLCULO DA DISCREPÂNCIA ---
    const discrepancia = btor - btf;
    
    // --- CÁLCULO DA PERCENTAGEM DE OMISSÃO ---
    // Percentagem = (Discrepância / BTOR) * 100
    let percentagemOmissao = 0;
    if (btor > 0) {
        percentagemOmissao = (discrepancia / btor) * 100;
    }
    
    // --- CÁLCULO DO IVA POTENCIAL OMITIDO ---
    const ivaPotencial = discrepancia * IVA_TAXA;
    
    // --- PROJEÇÃO DE MERCADO ---
    const omissaoPorMotorista = discrepancia; // Omissão da amostra
    
    // Omissão Mensal (Motoristas Ativos * Omissão da Amostra)
    const valorOmitidoMensal = omissaoPorMotorista * motoristasAtivos;
    
    // Omissão Anual (Omissão Mensal * 12)
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

// Associar a função de cálculo de discrepância aos inputs relevantes
document.getElementById('baseTributavelFaturada').addEventListener('input', calcularDiscrepancia);
document.getElementById('motoristasAtivos').addEventListener('input', calcularDiscrepancia);

// Também garantir que o resultado da BTF é atualizado se for introduzido manualmente
document.getElementById('baseTributavelFaturada').addEventListener('input', () => {
    const btf = parseFloat(document.getElementById('baseTributavelFaturada').value) || 0;
    document.getElementById('btFaturadaResultado').textContent = btf.toFixed(2) + ' €';
});
