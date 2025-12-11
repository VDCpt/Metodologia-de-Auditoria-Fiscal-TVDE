// Constante para o IVA (6%)
const IVA_TAXA = 0.06;
const MESES_ANO = 12;

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa os cálculos ao carregar a página
    calcularBaseTributavelOperacional();
});

// 1. Cálculo da Base Tributável Operacional Retida (BTOR)
function calcularBaseTributavelOperacional() {
    // Valores chave para a BTOR (Base Tributável Operacional Retida)
    const comissaoPlataformaOperacionais = parseFloat(document.getElementById('comissaoPlataformaOperacionais').value) || 0;
    const taxasReservaDeducoes = parseFloat(document.getElementById('taxasReservaDeducoes').value) || 0;
    
    // A BTOR é a soma das comissões e taxas que são retidas pela Plataforma.
    const btor = comissaoPlataformaOperacionais + taxasReservaDeducoes;
    
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
    
    // Obter o contexto do mercado (usando Motoristas Ativos)
    const motoristasAtivos = parseFloat(document.getElementById('motoristasAtivos').value) || 1; // Evitar divisão por zero

    // --- CÁLCULO DA DISCREPÂNCIA ---
    const discrepancia = btor - btf;
    
    // --- CÁLCULO DO IVA POTENCIAL OMITIDO ---
    const ivaPotencial = discrepancia * IVA_TAXA;
    
    // --- PROJEÇÃO DE MERCADO ---
    const omissaoPorMotorista = discrepancia; // Na amostra de um motorista/mês
    
    // Omissão Mensal (Motoristas Ativos * Omissão da Amostra)
    const valorOmitidoMensal = omissaoPorMotorista * motoristasAtivos;
    
    // Omissão Anual (Omissão Mensal * 12)
    const valorOmitidoAnual = valorOmitidoMensal * MESES_ANO;


    // --- Atualizar Resultados na Secção de Auditoria ---

    // Resultados da Base Tributável
    document.getElementById('btfFinal').textContent = btf.toFixed(2) + ' €';
    
    // Discrepância
    document.getElementById('discrepanciaResultado').textContent = discrepancia.toFixed(2) + ' €';
    
    // IVA Potencial Omitido
    document.getElementById('ivaPotencialResultado').textContent = ivaPotencial.toFixed(2) + ' €';

    // Projeção no Contexto de Mercado (Formatado para EUR)
    document.getElementById('motoristasAtivosContexto').textContent = motoristasAtivos.toLocaleString('pt-PT');
    document.getElementById('omissaoPorMotorista').textContent = omissaoPorMotorista.toFixed(2) + ' €';
    
    document.getElementById('valorOmitidoMensal').textContent = valorOmitidoMensal.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });
    document.getElementById('valorOmitidoAnual').textContent = valorOmitidoAnual.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });
}

// Associar a função de cálculo de discrepância aos inputs relevantes da Coluna 3 e Secção de Auditoria
document.getElementById('baseTributavelFaturada').addEventListener('input', calcularDiscrepancia);
document.getElementById('motoristasAtivos').addEventListener('input', calcularDiscrepancia);

// Também garantir que o resultado da BTF é atualizado se for introduzido manualmente
document.getElementById('baseTributavelFaturada').addEventListener('input', () => {
    const btf = parseFloat(document.getElementById('baseTributavelFaturada').value) || 0;
    document.getElementById('btFaturadaResultado').textContent = btf.toFixed(2) + ' €';
});
