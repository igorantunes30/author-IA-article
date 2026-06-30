<p align="center">
  <img src="11.png" width="90" />
  <img src="12.png" width="90" />
  <img src="13.png" width="90" />
  <img src="14.png" width="90" />
</p>

<h1 align="center">ieee-paper-writer</h1>

<p align="center">
  <strong>Notas brutas entram. Manuscrito pronto para revisão por pares sai.</strong>
</p>

<p align="center">
  <a href="https://github.com/ivan-neves/ieee-paper-writer/stargazers"><img src="https://img.shields.io/github/stars/ivan-neves/ieee-paper-writer?style=flat&color=blue" alt="Stars"></a>
  <a href="https://github.com/ivan-neves/ieee-paper-writer/commits/main"><img src="https://img.shields.io/github/last-commit/ivan-neves/ieee-paper-writer?style=flat" alt="Último commit"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/ivan-neves/ieee-paper-writer?style=flat" alt="Licença"></a>
</p>

<p align="center">
  <a href="#antes--depois">Antes/Depois</a> •
  <a href="#instalação">Instalação</a> •
  <a href="#pipeline">Pipeline</a> •
  <a href="#o-que-você-recebe">O que você recebe</a> •
  <a href="./INSTALL.md">Guia completo de instalação</a>
</p>

---

Uma skill/plugin para [Claude Code](https://docs.anthropic.com/en/docs/claude-code) (também Cursor, Windsurf, Cline, Copilot e 30+ agentes) que transforma rascunhos, listas de tópicos ou notas brutas em **manuscritos acadêmicos prontos para revisão por pares**, seguindo os padrões IEEE, Elsevier, Springer, ACM, Nature Portfolio e Qualis A. Quatro agentes especializados. Um comando.

## Antes / Depois

<table>
<tr>
<td width="50%">

### Entrada bruta

> "propomos um algoritmo distribuído para otimizar redes de sensores. reduz consumo de energia. testamos em 3 topologias. resultados bons. melhor que o baseline."

</td>
<td width="50%">

### Saída do ieee-paper-writer

> "This paper proposes a distributed optimization algorithm for energy-constrained sensor networks. The proposed approach reduces energy consumption by exploiting local topology information to minimize inter-node communication overhead. Experimental evaluation across three representative network topologies demonstrates a statistically significant improvement over the baseline, with a mean energy reduction of X% (p < 0.05)."

</td>
</tr>
<tr>
<td>

### Entrada bruta

> "o método funciona porque nós só falam com vizinhos. evita coordenação global. mostramos convergência."

</td>
<td>

### Saída do ieee-paper-writer

> "The convergence of the proposed method is guaranteed under mild connectivity assumptions. By restricting information exchange to immediate neighbors, the algorithm eliminates the need for global coordination, thereby reducing communication complexity from O(n²) to O(d), where d denotes the maximum node degree."

</td>
</tr>
</table>

**Mesmas ideias. Linguagem de publicação. Sempre.**

## Pipeline

Quatro agentes em sequência. Cada etapa constrói sobre a anterior.

```
Entrada (notas / rascunho / seção)
        │
        ▼
┌───────────────────┐
│  Etapa 1: Autor   │  Persona de pesquisador sênior. Escreve draft técnico
│                   │  completo: estrutura, argumentação, verbos científicos,
│                   │  lógica de parágrafo. Ciclo completo do artigo suportado.
└────────┬──────────┘
         │
         ▼
┌────────────────────────┐
│  Etapa 2: Editorial    │  Especialista em linguística. Refina fluência, ritmo,
│                        │  variedade sintática, transições, conectores.
│                        │  NÃO toca no conteúdo técnico.
└────────┬───────────────┘
         │
         ▼
┌─────────────────────────┐
│  Etapa 3: Estilo IEEE   │  Aplica convenções IEEE: impessoalidade,
│                         │  equilíbrio de voz, protocolo de siglas,
│                         │  construções proibidas, vocabulário de precisão.
└────────┬────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Etapa 4: Revisor        │  Revisor anônimo por pares. Encontra ambiguidades,
│                          │  afirmações sem suporte, falhas de coerência,
│                          │  problemas estruturais. Sinaliza o que precisa de ação.
└────────┬─────────────────┘
         │
         ▼
Manuscrito final + Notas de Estilo + Relatório do Revisor
```

**Conteúdo científico é invariante em todas as quatro etapas.** Resultados, hipóteses, equações, valores numéricos, citações — nunca alterados.

## O que cada etapa faz

Cada etapa tem uma responsabilidade distinta e não sobrepõe a anterior.

<img src="11.png" width="64" />

### Etapa 1 — Autor

Transforma matéria-prima (notas, bullet points, rascunhos, texto em português) em prosa técnica completa. O agente Autor decide a estrutura de parágrafos, seleciona verbos científicos precisos e atribui uma função clara a cada parágrafo — contextualização, formulação, análise, interpretação, conclusão parcial. Não melhora texto existente; escreve a partir do input bruto. O ciclo completo do artigo é suportado: definição do problema → literatura → lacuna → motivação → proposta → modelo matemático → avaliação → conclusões.

<img src="12.png" width="64" />

### Etapa 2 — Editorial

Recebe o draft do Autor e melhora apenas a forma linguística — nunca o conteúdo científico. O agente Editorial trabalha o ritmo das sentenças (alternando curta declarativa → média elaborativa → longa complexa), remove conectores automáticos colocados por hábito e não por lógica ("furthermore", "moreover" repetidos), elimina sentenças redundantes que repetem a anterior sem acrescentar informação, e corrige violações de paralelismo em listas e enumerações. Não tem consciência das convenções IEEE — sua única preocupação é prosa acadêmica de alta qualidade.

<img src="13.png" width="64" />

### Etapa 3 — Estilo IEEE

Recebe o texto do Editorial e aplica as convenções específicas do IEEE Transactions e IEEE Access. Responsabilidades: substituir construções em primeira pessoa ("we propose" → "this paper proposes"), aplicar o protocolo de siglas (termo completo na primeira ocorrência, sigla nas demais), construir um mapa de termos canônicos e eliminar rotação de sinônimos, remover construções proibidas ("it is worth noting that", "very", "extremely" sem quantificação), e equilibrar voz ativa e passiva conforme a convenção IEEE. Entrega o manuscrito conforme mais um bloco `## Notas de Estilo` listando itens que requerem ação do autor (quantificação ausente, escolhas específicas do periódico, citações malformadas).

<img src="14.png" width="64" />

### Etapa 4 — Revisor

Atua como revisor anônimo por pares. O agente Revisor não reescreve — diagnostica. Identifica: afirmações sem citação ou suporte quantitativo, contradições entre hipóteses declaradas e resultados apresentados, detalhes experimentais ausentes necessários para reprodutibilidade, declarações de escopo que excedem o que o artigo entrega, lacunas lógicas entre argumentos consecutivos, e falhas estruturais (resumo não autocontido, conclusão introduzindo material novo). O que pode ser corrigido diretamente (sentenças redundantes, referências pronominais ambíguas, violações de paralelismo) é corrigido inline. Todo o restante aparece num `## Relatório do Revisor` estruturado com localização por seção e parágrafo, indicando exatamente o que o autor precisa fornecer para resolver cada problema.

---

**Analogia prática:**

| Etapa | Papel |
|---|---|
| Autor | Pesquisador sênior que escreve o primeiro draft completo |
| Editorial | Editor de texto que apara as arestas linguísticas |
| Estilo IEEE | Copidesque que formata para o periódico específico |
| Revisor | Árbitro anônimo que decide aceitação ou revisão |

## Skills disponíveis individualmente

Além do pipeline completo, cada etapa está disponível como comando independente:

| Comando | Executa |
|---|---|
| `/ieee-paper-writer` | Pipeline completo: Autor → Editorial → Estilo → Revisor |
| `/author <texto>` | Somente Etapa 1 — draft a partir de notas brutas |
| `/editorial <texto>` | Somente Etapa 2 — fluência e ritmo |
| `/ieee-style <texto>` | Somente Etapa 3 — aplicação das convenções IEEE |
| `/reviewer <texto>` | Somente Etapa 4 — revisão anônima por pares |
| `/author-mode` | Ativa modo de escrita acadêmica persistente em todas as respostas |

## Instalação

Uma linha. Detecta todos os agentes na sua máquina. Instala para cada um.

```bash
# macOS / Linux / WSL / Git Bash
curl -fsSL https://raw.githubusercontent.com/ivan-neves/ieee-paper-writer/main/install.sh | bash

# Windows (PowerShell 5.1+)
irm https://raw.githubusercontent.com/ivan-neves/ieee-paper-writer/main/install.ps1 | iex
```

~30 segundos. Requer Node ≥18. Seguro para re-executar.

**Ativação:** cole um rascunho, diga "escreva a introdução", ou digite `/ieee-paper-writer`. O pipeline roda automaticamente quando você mencionar manuscrito, artigo IEEE, revisão por pares ou escrita acadêmica.

Apenas um agente, ou 30+ outros → [**INSTALL.md**](./INSTALL.md).

## O que você recebe

| Skill / Agente | Função |
|---|---|
| `/ieee-paper-writer` | Executa o pipeline completo de quatro etapas em qualquer entrada. |
| `ieee-paper-author` | Etapa 1 — redige seções técnicas completas a partir de notas ou esboços. |
| `ieee-paper-editorial` | Etapa 2 — refina fluência e estrutura de parágrafo sem tocar no conteúdo. |
| `ieee-paper-style` | Etapa 3 — aplica convenções linguísticas IEEE. |
| `ieee-paper-reviewer` | Etapa 4 — revisão por pares anônima. Diagnostica problemas científicos e lógicos. |

### Periódicos suportados

| Alvo | Estilo aplicado |
|--------|---------------|
| IEEE Transactions / IEEE Access | Convenções IEEE completas (impessoalidade, protocolo de siglas, equilíbrio passiva/ativa) |
| Elsevier / Springer | Inglês acadêmico formal, estrutura de seções, estilo de citação |
| ACM | Precisão técnica, linguagem de reprodutibilidade |
| Nature Portfolio | Prosa científica concisa, acessibilidade ampla |
| Qualis A (CAPES) | Padrões brasileiros de periódicos de alto impacto |

### Formato de saída

Cada execução produz três blocos:

```
## Texto Final
[seção de manuscrito limpa e conforme IEEE]

## Notas de Estilo
[itens que requerem ação do autor — citações ausentes, escolhas específicas do periódico,
 valores marcados com X que precisam de números reais]

## Relatório do Revisor
### Problemas Maiores
### Problemas Menores
### Corrigidos Nesta Passagem
```

### Idioma

- **Entrada:** Português ou inglês.
- **Saída do manuscrito:** sempre em inglês (exigência IEEE).
- **Notas de Estilo e Relatório do Revisor:** no idioma da entrada do usuário.

## Exemplos de uso

```
/ieee-paper-writer Seção de Introdução para artigo sobre otimização distribuída em redes de sensores
```

```
/ieee-paper-writer [cole seu rascunho bruto ou lista de tópicos aqui]
```

```
/ieee-paper-writer Reescreva minha seção de metodologia de forma mais formal
```

```
/ieee-paper-writer Faça revisão por pares deste abstract: [texto]
```

## Seções suportadas

Resumo · Introdução · Trabalhos Relacionados · Fundamentação Teórica · Metodologia · Abordagem Proposta ·
Formulação Matemática · Arquitetura · Algoritmo · Configuração Experimental · Resultados ·
Discussão · Conclusão · Trabalhos Futuros · Agradecimentos

## Como funciona

1. Você fornece o material bruto — tópicos, prosa aproximada ou draft completo.
2. O agente **Autor** estrutura o conteúdo e escreve um draft técnico completo.
3. O agente **Editorial** refina linguagem, ritmo e lógica de parágrafo.
4. O agente **Estilo IEEE** aplica convenções específicas do periódico.
5. O agente **Revisor** diagnostica problemas restantes como revisor anônimo por pares.
6. Você recebe o manuscrito final, notas de estilo e um relatório do revisor.

O inglês acadêmico formal é mantido durante toda a geração do manuscrito.

## Links

- [INSTALL.md](./INSTALL.md) — matriz completa de instalação, todas as flags, detalhes por agente
- [CONTRIBUTING.md](./CONTRIBUTING.md) — como enviar uma contribuição
- [CLAUDE.md](./CLAUDE.md) — guia do mantenedor
- [Issues](https://github.com/ivan-neves/ieee-paper-writer/issues) — bug, funcionalidade ou comportamento inesperado

## Licença

MIT.
