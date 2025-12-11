document.addEventListener('DOMContentLoaded', () => {
    const calcularBtn = document.getElementById('calcularBtn');
    const imprimirBtn = document.getElementById('imprimirBtn');
    const resultadoDiv = document.getElementById('resultadoCalculo');

    calcularBtn.addEventListener('click', calcularDiscrepancia);
    imprimirBtn.addEventListener('click', () => { window.print(); });

    function calcularDiscrepancia() {
        // --- 1. CAPTURA DE DADOS RELEVANTES ---
        
        // Dados de Retenção Operacional (Coluna 2 - APP)
        // CAPTURA DO NOVO CAMPO:
        const a_taxasReservaBruto = parseFloat(document.getElementById('a_taxasReservaBruto').value) || 0;
        
        const a_taxasReservaDeducoes = parseFloat(document.getElementById('a_taxasReservaDeducoes').value) || 0;
        const a_comissaoDeducoes = parseFloat(document.getElementById('a_comissaoDeducoes').value) || 0;
        
        // Dados de Faturação Fiscal (Coluna 3 - Fatura)
        const valorFatura = parseFloat(document.getElementById('valorFatura').value) || 0;
        const iva6Checked = document.querySelector('input[name="iva6"]:checked').value === 'Sim';
        
        // Dados da Fleet (Coluna 1) - Capturados para Documentação
        const mes = document.getElementById('mes').value || 'Período Não Especificado';
        const f_ganhosTotalBruto = parseFloat(document.getElementById('f_ganhosTotalBruto').value) || 0;
        const f_despesas = parseFloat(document.getElementById('f_despesas').value) || 0;
        const f_ganhosLiquidos = parseFloat(document.getElementById('f_ganhosLiquidos').value) || 0;


        // --- 2. CÁLCULO DA BASE TRIBUTÁVEL OPERACIONAL CORRETA (APP) ---
        // A Base Tributável correta é a soma das deduções (serviço de intermediação)
        const baseTributavelOperacionalCorreta = a_taxasReservaDeducoes + a_comissaoDeducoes;

        // --- 3. CÁLCULO DA DISCREPÂNCIA FISCAL ---
        const omissaoBaseTributavel = baseTributavelOperacionalCorreta - valorFatura;

        // --- 4. CÁLCULO DO IVA OMISSÃO (6%) ---
        const ivaCorretoEsperado = baseTributavelOperacionalCorreta * 0.06;
        const ivaOmitido = omissaoBaseTributavel * 0.06;
        
        // --- 5. APRESENTAÇÃO DE RESULTADOS ---
        let html = `
            <p><strong>Amostra de Análise:</strong> ${mes}</p>
            <div class="grid">
                <div>
                    <h3>BASE TRIBUTÁVEL OPERACIONAL</h3>
                    <p>Total de Taxas de Reserva Deduzidas: <strong>${a_taxasReservaDeducoes.toFixed(2)} €</strong></p>
                    <p>Total de Comissão Deduzida: <strong>${a_comissaoDeducoes.toFixed(2)} €</strong></p>
                    <p style="font-size: 1.1em;">Total Base Tributável Operacional Retida (APP): <strong>${baseTributavelOperacionalCorreta.toFixed(2)} €</strong></p>
                </div>
                <div>
                    <h3>BASE TRIBUTÁVEL FATURADA</h3>
                    <p>Valor Faturado (Base Tributável na Fatura): <strong>${valorFatura.toFixed(2)} €</strong></p>
                    <p>Fatura Inclui IVA 6%: <strong>${iva6Checked ? 'SIM' : 'NÃO'}</strong></p>
                </div>
            </div>
            <hr>
            
            <div class="discrepancia-box">
                <p>DISCREPÂNCIA (Omisão) da BASE TRIBUTÁVEL: <span>${omissaoBaseTributavel.toFixed(2)} €</span></p>
                <p>Valor Potencial de IVA (6%) Omitido sobre esta Discrepância: <span>${ivaOmitido.toFixed(2)} €</span></p>
            </div>

            <div class="legal-note" style="margin-top: 20px;">
                <p><strong>Destaque (Dados Brutos):</strong> A Plataforma registou ${a_taxasReservaBruto.toFixed(2)} € em Taxas de Reserva, mas apenas ${a_taxasReservaDeducoes.toFixed(2)} € foram deduzidos para compor a Base Tributável Operacional. (Para efeitos de auditoria, a discrepância é calculada sobre as deduções.)</p>
                <p><strong>Coerência da Fleet (Para Documentação):</strong> Ganhos Brutos (${f_ganhosTotalBruto.toFixed(2)} €) - Despesas (${f_despesas.toFixed(2)} €) = Ganhos Líquidos Apresentados (${f_ganhosLiquidos.toFixed(2)} €)</p>
                <p><strong>Conclusão Fiscal para o Tribunal:</strong> A Plataforma reteve operacionalmente ${baseTributavelOperacionalCorreta.toFixed(2)} €, mas só faturou ${valorFatura.toFixed(2)} €, resultando numa omissão de Base Tributável de ${omissaoBaseTributavel.toFixed(2)} €.</p>
            </div>
        `;

        resultadoDiv.innerHTML = html;
        window.scrollTo(0, document.body.scrollHeight);
    }
});
