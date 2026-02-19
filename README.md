📝 To-Do List por Datas (Versão Final)
Uma aplicação de gerenciamento de tarefas robusta e intuitiva que organiza seus afazeres em colunas cronológicas. O projeto combina uma interface moderna em tons de azul profundo com funcionalidades avançadas de feedback visual.

🎯 Sobre o Projeto
Esta ferramenta foi desenvolvida para quem precisa de uma visão temporal clara de suas obrigações. Ao agrupar as tarefas por data, a aplicação elimina a confusão de listas únicas e extensas, permitindo um planejamento focado no cronograma e na produtividade.

✨ Funcionalidades Principais
Organização Cronológica: Geração automática de colunas dinâmicas para cada nova data inserida.

Sistema Drag & Drop: Movimentação fluida de tarefas entre diferentes dias através de arrastar e soltar.

Feedback Visual de Conclusão: Sistema de "check" que aplica instantaneamente uma animação de texto riscado, indicando visualmente as tarefas finalizadas.

Edição In-place: Altere o texto das tarefas rapidamente clicando no ícone de edição.

Persistência de Dados: Integração com localStorage para garantir que suas tarefas e o status de conclusão sejam mantidos mesmo após fechar a aba.

Interface Dark Premium: Estética baseada em um gradiente radial azul profundo com colunas em efeito glassmorphism (vidro fosco).

🚀 Tecnologias Utilizadas
HTML5: Estrutura para os inputs de dados e containers de colunas.

CSS3: Design avançado com Flexbox, efeitos de transparência e estilização de estados (text-decoration: line-through).

JavaScript (ES6+): Lógica para gerenciamento de estados, manipulação dinâmica do DOM e persistência local.

🛠️ Como Usar
Criar: Insira a descrição, escolha a data e clique em "Adicionar Tarefa".

Concluir: Clique no botão de check para aplicar o efeito riscado na tarefa.

Editar: Use o ícone de lápis (✏️) para modificar o texto e o ícone de disco (💾) para salvar.

Mover: Arraste uma tarefa de uma coluna para outra para redefinir o prazo.

Excluir: Clique no ícone (❌) para remover a tarefa permanentemente.

📂 Estrutura de Arquivos
index.html: Base da interface.

style.css: Estilização completa (incluindo os tons de azul escuro e a classe de tarefa riscada).

script.js: Core da aplicação com funções de renderização, lógica de check e drag & drop.

Mudanças futuras:

1. Organização e Filtros
- Contador de Tarefas: Exibir o número de tarefas no topo de cada coluna (ex: "3 pendentes / 1 concluída").
- Botão "Limpar Concluídas": Uma opção rápida para remover apenas os itens riscados de uma coluna específica ou de todas de uma vez.
- Filtro de Visualização: Adicionar um botão para alternar entre "Ver todas", "Somente Pendentes" ou "Somente Concluídas".

2. Interface e Feedback Visual
- Temas Personalizáveis: Criar um "Seletor de Temas" para mudar entre o azul atual, um roxo "Cyberpunk" ou um cinza "Minimalista".
- Prioridade por Cores: Adicionar a opção de definir tarefas como "Urgente" (borda vermelha), "Importante" (borda amarela) ou "Normal".
- Animações de Entrada: Usar bibliotecas simples ou CSS para fazer as colunas ou tarefas "deslizarem" suavemente quando forem criadas.

3. Funcionalidades de Dados
- Exportação de Dados: Um botão para baixar todas as tarefas em um arquivo .json ou .csv para backup.
- Data de Vencimento com Alerta: Destacar visualmente (ex: cor vibrante) as colunas cuja data já passou e ainda possuem tarefas pendentes.
- Barra de Busca: Um campo no topo para encontrar uma tarefa específica pelo texto, filtrando as colunas em tempo real.

4. Melhorias Técnicas
- PWA (Progressive Web App): Transformar o projeto em um PWA para que ele possa ser "instalado" no celular ou desktop e funcione offline.
- Confirmação de Exclusão: Adicionar um pequeno modal ou confirmação antes de apagar uma tarefa, para evitar cliques acidentais no "❌".
