// Constante para o IVA (6%)
const IVA_TAXA = 0.06;

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa os cálculos ao carregar a página
    calcularBaseTributavelOperacional();
    calcularDiscrepancia();
});

// 1. Cálculo da Base Tributável Operacional Retida (BTOR)
function calcularBaseTributavelOperacional() {
    // Obter todos os valores de input necessários
    const ganhosBrutos = parseFloat(document.getElementById('ganhosBrutos').value) || 0;
    const comissaoPlataformaOperacionais = parseFloat(document.getElementById('comissaoPlataformaOperacionais').value) || 0;
    
    // Simplificando o cálculo da BTOR: é geralmente a Comissão da Plataforma Retida.
    // Em alguns modelos, pode ser Ganhos Brutos - Pagamentos Líquidos ao Motorista.
    // Vamos usar a comissão retida para ser a base do que "deveria" ser faturado (BTOR)
    const btor = comissaoPlataformaOperacionais;
    
    // Atualizar o HTML
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
    
    // Obter a Base Tributável Faturada (BTF) da Coluna 3
    const btf = parseFloat(document.getElementById('baseTributavelFaturada').value) || 0;
    
    // Obter o contexto do mercado
    const viaturasAtivas = parseFloat(document.getElementById('viaturasAtivas').value) || 1; // Evitar divisão por zero

    // 3. CÁLCULO DA DISCREPÂNCIA
    const discrepancia = btor - btf;
    
    // 4. CÁLCULO DO IVA POTENCIAL OMITIDO (6% sobre a discrepância)
    const ivaPotencial = discrepancia * IVA_TAXA;
    
    // 5. PROJEÇÃO DE MERCADO (Omissão Média Mensal por Viatura * Viaturas Ativas)
    const omissaoPorViatura = discrepancia; // Na amostra de uma viatura/mês
    const valorOmitidoMercado = omissaoPorViatura * viaturasAtivas;

    // --- Atualizar Resultados na Secção de Auditoria ---

    // Resultados da Base Tributável
    document.getElementById('btfFinal').textContent = btf.toFixed(2) + ' €';
    
    // Discrepância
    document.getElementById('discrepanciaResultado').textContent = discrepancia.toFixed(2) + ' €';
    
    // IVA Potencial Omitido
    document.getElementById('ivaPotencialResultado').textContent = ivaPotencial.toFixed(2) + ' €';

    // Projeção no Contexto de Mercado
    document.getElementById('viaturasAtivasContexto').textContent = viaturasAtivas.toLocaleString('pt-PT');
    document.getElementById('omissaoPorViatura').textContent = omissaoPorViatura.toFixed(2) + ' €';
    document.getElementById('valorOmitidoMercado').textContent = valorOmitidoMercado.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });
}

// Associar a função de cálculo de discrepância aos inputs relevantes da Coluna 3
document.getElementById('baseTributavelFaturada').addEventListener('input', calcularDiscrepancia);
document.getElementById('viaturasAtivas').addEventListener('input', calcularDiscrepancia);

// Também garantir que o resultado da BTF é atualizado se for introduzido manualmente
document.getElementById('baseTributavelFaturada').addEventListener('input', () => {
    const btf = parseFloat(document.getElementById('baseTributavelFaturada').value) || 0;
    document.getElementById('btFaturadaResultado').textContent = btf.toFixed(2) + ' €';
});
