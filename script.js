document.addEventListener('DOMContentLoaded', () => {
    const calcularBtn = document.getElementById('calcularBtn');
    const imprimirBtn = document.getElementById('imprimirBtn');
    const resultadoDiv = document.getElementById('resultadoCalculo');

    calcularBtn.addEventListener('click', calcularDiscrepancia);
    imprimirBtn.addEventListener('click', () => { window.print(); });

    function calcularDiscrepancia() {
        // 1. Obter todos os valores de input como números
        const ganhosBrutos = parseFloat(document.getElementById('ganhosBrutos').value) || 0;
        const adicionais = parseFloat(document.getElementById('adicionais').value) || 0;
        const portagemCliente = parseFloat(document.getElementById('portagemCliente').value) || 0;
        const cancelamento = parseFloat(document.getElementById('cancelamento').value) || 0;
        
        const taxasReserva = parseFloat(document.getElementById('taxasReserva').value) || 0;
        const comissao = parseFloat(document.getElementById('comissao').value) || 0;
        const ganhosLiquidosApp = parseFloat(document.getElementById('ganhosLiquidosApp').value) || 0;
        
        const valorFatura = parseFloat(document.getElementById('valorFatura').value) || 0;
        const ivaFatura = parseFloat(document.getElementById('ivaFatura').value) || 0;
        const autoliquidacao = document.querySelector('input[name="autoliquidacao"]:checked').value;

        // 2. CÁLCULO DA COMISSÃO OPERACIONAL TOTAL RETIDA (APP)
        // Este é o valor total que a Plataforma reteve para cobrir a sua intermediação.
        const comissaoOperacionalTotalRetida = taxasReserva + comissao;

        // 3. CÁLCULO DA DISCREPÂNCIA OPERACIONAL
        const discrepanciaOperacional = comissaoOperacionalTotalRetida - valorFatura;
        
        // 4. CÁLCULO DA COMISSÃO CORRETA (Base tributável)
        // Se a comissão for uma fatura pura de serviço (sem IVA)
        // O valor correto da comissão fatura deveria ser:
        const comissaoCorretaBaseTributavel = comissaoOperacionalTotalRetida;
        
        // O IVA que deveria ser aplicado em Portugal (6%) sobre a comissão correta
        const ivaCorretoEsperado = comissaoCorretaBaseTributavel * 0.06;

        // 5. CÁLCULO DA OMISSÃO DE BASE TRIBUTÁVEL E IVA
        // Omissão de Base Tributável: Quanto a fatura está a 'omitir' em relação ao que foi retido.
        const omissaoBaseTributavel = comissaoCorretaBaseTributavel - valorFatura;
        
        // Omissão de IVA (6%) sobre o valor omitido
        const ivaOmitido = omissaoBaseTributavel * 0.06;

        // 6. VALIDAÇÃO DE COERÊNCIA DA APP
        const totalCalculadoApp = ganhosBrutos + adicionais + portagemCliente + cancelamento - comissaoOperacionalTotalRetida;
        const diferencaLiquida = ganhosLiquidosApp - totalCalculadoApp;
        const coerenciaApp = Math.abs(diferencaLiquida) < 0.05; // Margem de erro de 5 cêntimos

        // 7. APRESENTAR RESULTADOS
        let html = `
            <div class="grid">
                <div>
                    <p><strong>Ganhos Brutos Totais (APP):</strong> ${ganhosBrutos.toFixed(2)} €</p>
                    <p><strong>Ganhos Líquidos Recebidos (APP):</strong> ${ganhosLiquidosApp.toFixed(2)} €</p>
                </div>
                <div>
                    <p><strong>Comissão Operacional TOTAL Retida (Taxas + Comissão):</strong> ${comissaoOperacionalTotalRetida.toFixed(2)} €</p>
                    <p><strong>Valor Base Faturado Pela Plataforma:</strong> ${valorFatura.toFixed(2)} €</p>
                </div>
            </div>
            <hr>
            
            <div class="discrepancia-box">
                <p>DISCREPÂNCIA OPERACIONAL (Valor Retido - Valor Faturado): <span>${discrepanciaOperacional.toFixed(2)} €</span></p>
                <p>Valor de Base Tributável OMITIDO: <span>${omissaoBaseTributavel.toFixed(2)} €</span></p>
            </div>

            <div class="legal-note" style="margin-top: 20px;">
                <p><strong>Impacto Fiscal (Simulação IVA 6%):</strong></p>
                <p>Valor de IVA (6%) Omitido sobre a Discrepância: <span>${ivaOmitido.toFixed(2)} €</span></p>
                <p>Se a Base Tributável fosse correta (${comissaoCorretaBaseTributavel.toFixed(2)} €), o IVA correto seria: <span>${ivaCorretoEsperado.toFixed(2)} €</span></p>
            </div>
            
            <div class="legal-note" style="margin-top: 20px;">
                <p><strong>Coerência da APP:</strong> ${coerenciaApp ? '✅ Coerente' : `⚠️ Discrepância de ${diferencaLiquida.toFixed(2)} € (Verificar campos!)`}</p>
                <p><strong>Autoliquidação na Fatura:</strong> ${autoliquidacao}</p>
            </div>
        `;

        resultadoDiv.innerHTML = html;
        window.scrollTo(0, document.body.scrollHeight);
    }
});
