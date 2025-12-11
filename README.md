# ⚖️ Auditoria Fiscal TVDE: Análise Estrutural da Retenção de Comissões e IVA

## EXECUTIVE SUMMARY

Este repositório contém a metodologia e o código de auditoria desenvolvido pela (VDC) para analisar uma **falha estrutural e sistémica** na retenção de comissões e na aplicação do IVA por parte das principais Plataformas de Mobilidade (TVDE) a operar em Portugal.

A análise baseia-se na comparação de duas fontes de dados:
1.  **Retenções Operacionais Detalhadas** registadas nas aplicações dos motoristas (tempo real).
2.  **Faturas de Comissão Emitidas pelas Plataformas** (geralmente emitidas por entidades sediadas fora de Portugal).

A discrepância identificada na **Base Tributável (IVA)** sugere um potencial mecanismo de desvio fiscal, onde a Plataforma cobra e retém um valor operacional (que inclui uma percentagem de comissão e taxas) mas fatura um valor diferente (menor, e frequentemente sem o IVA português a 6%) ao motorista. Este mecanismo implica uma possível omissão de rendimento tributável e facilita o desvio de valor para jurisdições fiscais mais favoráveis.

---

## 🏛️ Explicação do Algoritimo e Mecanismo para Advogados e Juízes

### O Modelo de Negócio em Disputa

As Plataformas de TVDE atuam como intermediárias. Em Portugal, a comissão cobrada aos motoristas/Empresa (o serviço de intermediação) está sujeita a **IVA à taxa de 6%**.

> #### Nota Crucial sobre a Responsabilidade do IVA da Viagem:
> Ao abrigo da legislação portuguesa (Decreto-Lei n.º 106/2017), as Plataformas de TVDE emitem, em nome e por conta do motorista/empresa, a **Fatura Individual de Prestação de Serviço ao Passageiro**. O valor bruto dessa fatura (que inclui o IVA do serviço de transporte, geralmente 6%) é considerado receita do motorista/empresa de TVDE.
>
> **Isto significa que o motorista/empresa é legalmente responsável por entregar esse IVA da receita total da viagem (o "Bruto") ao Estado português.** A Plataforma, por sua vez, já descontou a sua comissão (e outras taxas) desse valor. A dupla oneração ocorre porque, além de o motorista ter de pagar o IVA sobre a totalidade da receita, a Plataforma, na faturação da sua comissão, não trata o IVA (da comissão) de forma transparente e correta, levando à discrepância.

### A Falha Estrutural e o Desvio Fiscal

O mecanismo de desvio ocorre na diferença entre o **"Gasto Operacional Bruto"** do motorista e o **"Valor Faturado"** pela Plataforma:

1.  **Retenção Operacional (APP):** A Plataforma retém, na origem, um conjunto de valores (Comissão, Taxas de Reserva, etc.) sobre o valor bruto das viagens. Este total representa o custo efetivo de intermediação do motorista.
2.  **Faturação da Comissão:** A Plataforma (geralmente uma entidade irlandesa, holandesa, etc.) emite uma fatura de comissão. Historicamente, esta fatura:
    * Apresenta um **Valor Base Inferior** ao total retido na App.
    * Aplica a **Regra de Autoliquidação (Reverse Charge)**, movendo a obrigação do IVA para o motorista, ou, pior, **Não Aplica IVA** nem a autoliquidação corretamente, alegando ser um serviço transfronteiriço.
3.  **O Desvio:** Se a Plataforma retém um valor X na APP (que já inclui a comissão e o IVA de 6% no preço pago pelo Cliente) mas fatura ao motorista um valor Y (onde Y < X e Y não inclui IVA a 6% ou o IVA é autoliquidado de forma indevida), a **diferença (X - Y) é a Discrepância Fiscal**. Esta diferença é o valor que foi transferido para o exterior sem a devida aplicação da base tributável e do IVA português.

**O objetivo deste simulador é quantificar esta Discrepância Fiscal por amostra de viagem/período, provando a falha sistémica na aplicação do regime tributário português.**
