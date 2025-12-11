document.addEventListener('DOMContentLoaded', () => {
    const calcularBtn = document.getElementById('calcularBtn');
    const imprimirBtn = document.getElementById('imprimirBtn');
    const resultadoDiv = document.getElementById('resultadoCalculo');

    calcularBtn.addEventListener('click', calcularDiscrepancia);
    imprimirBtn.addEventListener('click', () => { window.print(); });

    function calcularDiscrepancia() {
        // --- 1. CAPTURA DE DADOS OPERACIONAIS E FISCAIS ---
        
        // Dados de Retenção Operacional (Coluna 2 - APP)
        const a_taxasReservaDeducoes = parseFloat(document.getElementById('a_taxasReservaDeducoes').value) || 0;
        const a_comissaoDeducoes = parseFloat(document.getElementById('a_comissaoDeducoes').value) || 0;
        
        // Dados de Faturação Fiscal (Coluna 3 - Fatura)
        const valorFatura = parseFloat(document.getElementById('valorFatura').value) || 0;
        const iva6Checked = document.querySelector('input[name="iva6"]:checked').value === 'Sim';
        
        // Dados Oficiais (Estatísticas)
        const viaturasAtivas = parseInt(document.getElementById('viaturasAtivas').value) || 0;
        const motoristasAtivos = parseInt(document.getElementById('motoristasAtivos').value) || 0;
        
        // Dados da Fleet (Coluna 1) para Documentação
        const mes = document.getElementById('mes').value || 'Período Não Especificado';
        const f_ganhosTotalBruto = parseFloat(document.getElementById('f_ganhosTotalBruto').value) || 0;
        const f_despesas = parseFloat(document.getElementById('f_despesas').value) || 0;
        const f_ganhosLiquidos = parseFloat(document.getElementById('f_ganhosLiquidos').value) || 0;


        // --- 2. CÁLCULO DA BASE TRIBUTÁVEL OPERACIONAL CORRETA (APP) ---
        const baseTributavelOperacionalCorreta = a_taxasReservaDeducoes + a_comissaoDeducoes;

        // --- 3. CÁLCULO DA DISCREPÂNCIA FISCAL E % ---
        const omissaoBaseTributavel = baseTributavelOperacionalCorreta - valorFatura;
        let percentagemOmissao = 0;
        
        if (baseTributavelOperacionalCorreta > 0) {
            percentagemOmissao = (omissaoBaseTributavel / baseTributavelOperacionalCorreta) * 100;
        }

        // --- 4. CÁLCULO DO IVA OMISSÃO (6%) ---
        const ivaCorretoEsperado = baseTributavelOperacionalCorreta * 0.06;
        const ivaOmitido = omissaoBaseTributavel * 0.06;
        
        // --- 5. RESULTADOS ESTATÍSTICOS (Contextualização) ---
        let resultadosEstatisticosHTML = '';
        if (viaturasAtivas > 0 || motoristasAtivos > 0) {
            resultadosEstatisticosHTML = `
                <h3 style="color: #34a853;">Resultados de Estatísticas (Contexto)</h3>
                <p>Viaturas Ativas (Aprox.): <strong>${viaturasAtivas.toLocaleString('pt-PT')}</strong></p>
                <p>Motoristas Ativos (Aprox.): <strong>${motoristasAtivos.toLocaleString('pt-PT')}</strong></p>
                
                <hr style="margin-top: 10px;">
                <p style="font-style: italic;">Se esta omissão (${omissaoBaseTributavel.toFixed(2)} €) fosse a média mensal por ${viaturasAtivas > 0 ? 'Viaturas' : 'Motoristas'}, o potencial valor omitido seria vasto.</p>
            `;
        }

        // --- 6. APRESENTAÇÃO DE RESULTADOS ---
        let html = `
            <p><strong>Amostra de Análise:</strong> ${mes}</p>
            <div class="grid">
                <div>
                    <h3>BASE TRIBUTÁVEL OPERACIONAL (APP)</h3>
                    <p>Total Base Tributável Operacional Retida: <strong>${baseTributavelOperacionalCorreta.toFixed(2)} €</strong></p>
                    <p style="margin-top: 15px;">Base Tributável Faturada: <strong>${valorFatura.toFixed(2)} €</strong></p>
                </div>
                <div>
                    ${resultadosEstatisticosHTML}
                </div>
            </div>
            <hr>
            
            <div class="discrepancia-box">
                <p>DISCREPÂNCIA (Omisão) da BASE TRIBUTÁVEL: 
                    <span>${omissaoBaseTributavel.toFixed(2)} €</span>
                    <span style="float: right;">(${percentagemOmissao.toFixed(2)}% do Total Operacional)</span>
                </p>
                <p>Valor Potencial de IVA (6%) Omitido sobre esta Discrepância: <span>${ivaOmitido.toFixed(2)} €</span></p>
            </div>

            <div class="legal-note" style="margin-top: 20px;">
                <p><strong>Conclusão Fiscal para o Tribunal:</strong> A Plataforma reteve operacionalmente ${baseTributavelOperacionalCorreta.toFixed(2)} €, mas só faturou ${valorFatura.toFixed(2)} €, resultando numa omissão de Base Tributável de ${omissaoBaseTributavel.toFixed(2)} €.</p>
                <p>O IVA (6%) sobre a Base Tributável correta seria de ${ivaCorretoEsperado.toFixed(2)} €.</p>
                <p><strong>Coerência da Fleet (Para Documentação):</strong> Ganhos Brutos (${f_ganhosTotalBruto.toFixed(2)} €) - Despesas (${f_despesas.toFixed(2)} €) = Ganhos Líquidos Apresentados (${f_ganhosLiquidos.toFixed(2)} €)</p>
            </div>
        `;

        resultadoDiv.innerHTML = html;
        window.scrollTo(0, document.body.scrollHeight);
    }
});
