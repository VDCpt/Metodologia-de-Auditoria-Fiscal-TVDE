document.addEventListener('DOMContentLoaded', () => {
    const calcularBtn = document.getElementById('calcularBtn');
    const imprimirBtn = document.getElementById('imprimirBtn');
    const resultadoDiv = document.getElementById('resultadoCalculo');

    calcularBtn.addEventListener('click', calcularDiscrepancia);
    imprimirBtn.addEventListener('click', () => { window.print(); });

    function calcularDiscrepancia() {
        // --- 1. CAPTURA DE DADOS RELEVANTES PARA A DISCREPÂNCIA ---
        
        // Dados de Retenção Operacional (Coluna 2 - APP)
        const a_taxasReservaDeducoes = parseFloat(document.getElementById('a_taxasReservaDeducoes').value) || 0;
        const a_comissaoDeducoes = parseFloat(document.getElementById('a_comissaoDeducoes').value) || 0;
        
        // Dados de Faturação Fiscal (Coluna 3 - Fatura)
        const valorFatura = parseFloat(document.getElementById('valorFatura').value) || 0;
        const iva6Checked = document.querySelector('input[name="iva6"]:checked').value === 'Sim';
        
        // --- 2. CÁLCULO DA BASE TRIBUTÁVEL OPERACIONAL CORRETA (APP) ---
        // Este é o valor total que a Plataforma reteve como custo de intermediação/serviço, 
        // e que, logicamente, deveria ser a Base Tributável correta para IVA.
        const baseTributavelOperacionalCorreta = a_taxasReservaDeducoes + a_comissaoDeducoes;

        // --- 3. CÁLCULO DA DISCREPÂNCIA FISCAL ---
        // Quanto a Base Faturada está a omitir em relação ao que foi retido na operação.
        const omissaoBaseTributavel = baseTributavelOperacionalCorreta - valorFatura;

        // --- 4. CÁLCULO DO IVA OMISSÃO (6%) ---
        // O IVA que foi potencialmente omitido ao Estado português devido à omissão da Base Tributável.
        const ivaCorretoEsperado = baseTributavelOperacionalCorreta * 0.06;
        const ivaOmitido = omissaoBaseTributavel * 0.06;
        
        // --- 5. APRESENTAÇÃO DE RESULTADOS ---
        const mes = document.getElementById('mes').value || 'Período Não Especificado';
        
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
                <p><strong>Conclusão Fiscal para o Tribunal:</strong> A Plataforma reteve operacionalmente ${baseTributavelOperacionalCorreta.toFixed(2)} €, mas só faturou ${valorFatura.toFixed(2)} €, resultando numa omissão de Base Tributável de ${omissaoBaseTributavel.toFixed(2)} €.</p>
                <p>O IVA (6%) sobre a Base Tributável correta seria de ${ivaCorretoEsperado.toFixed(2)} €.</p>
            </div>
        `;

        resultadoDiv.innerHTML = html;
        window.scrollTo(0, document.body.scrollHeight);
    }
});
