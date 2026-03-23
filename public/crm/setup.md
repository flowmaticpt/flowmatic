# Flowmatic CRM — Setup

## Passos (15 minutos)

### 1. Criar o Sheet a partir do CSV (2 min)

1. Abrir [drive.google.com](https://drive.google.com)
2. Arrastar o ficheiro `leads.csv` para o Drive
3. Clicar duas vezes no ficheiro — abre automaticamente no Google Sheets
4. Já tens um Sheet com 100 leads (Empresa, Setor, Email, Telefone, Localização)

### 2. Colar o log de emails (2 min)

1. No Google Sheet, criar nova tab: clicar **+** no fundo, nomear **Log_Import**
2. Abrir `enviados.log` num editor de texto (TextEdit, VS Code, etc.)
3. Selecionar tudo (Cmd+A), copiar (Cmd+C)
4. No Sheet, clicar na célula A1 da tab "Log_Import" e colar (Cmd+V)
5. Cada linha do log deve ficar numa célula diferente na coluna A

### 3. Instalar os scripts (3 min)

1. No Sheet, ir a **Extensions > Apps Script**
2. Apagar o código default
3. Copiar todo o conteúdo de `import-scripts.gs` e colar
4. Clicar **+** ao lado de "Files" > **Script**, nomear `sync`
5. Copiar todo o conteúdo de `sync-scripts.gs` e colar
6. **Ctrl+S** para guardar

### 4. Correr a importação (2 min)

1. No Apps Script, selecionar função: **importarDadosExistentes**
2. Clicar **Run** (botão play)
3. Na primeira vez pede permissões — aceitar:
   - Se aparecer "This app isn't verified": **Advanced > Go to Flowmatic CRM (unsafe)**
4. Aguardar (1-2 minutos)
5. Resultado esperado:
   - Tab **Leads**: ~100 linhas com 17 colunas, estados e cores
   - Tab **Atividades**: ~528 linhas de emails enviados
   - Tab **Métricas**: fórmulas automáticas
   - 4 clientes ativos marcados como "Ganho"

### 5. Publicar o endpoint JSON (2 min)

1. No Apps Script: **Deploy > New deployment**
2. Tipo: **Web app**
3. Settings:
   - Description: `Flowmatic CRM`
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Clicar **Deploy**
5. Copiar o **URL** (algo como `https://script.google.com/macros/s/ABC.../exec`)

### 6. Ligar o Dashboard (1 min)

1. Abrir `crm/index.html` no browser
2. Ir ao tab **Configurações**
3. Colar o URL do passo anterior
4. Clicar **Guardar e Testar**
5. Se aparecer "Ligado com sucesso" — está feito!

### 7. Ativar sync automático (1 min)

1. No Apps Script, selecionar função: **configurarTriggers**
2. Clicar **Run**, aceitar permissões
3. Resultado: Gmail sync a cada 30 min, Calendar sync a cada hora

---

## Como funciona

```
leads.csv ──upload──> Google Sheet ──script──> Tabs estruturadas
                                                    │
enviados.log ──colar──> Tab Log_Import ──script──>  │
                                                    ├── Tab Leads (100+ leads)
                                                    ├── Tab Atividades (528+ entradas)
                                                    └── Tab Métricas (fórmulas)
                                                         │
Gmail ←──sync 30min──> Tab Atividades                    │
Calendar ←──sync 1h──> Tab Atividades                    │
                                                         │
Google Sheet ──JSON endpoint──> Dashboard HTML ──────────>│
                                 (crm/index.html)
```

---

## Menu no Google Sheets

Depois de instalar os scripts, aparece o menu **Flowmatic CRM**:

| Opção | O que faz |
|-------|-----------|
| Importar Dados (1x) | Reestrutura CSV + importa log + configura tudo |
| Sync Gmail Agora | Sincroniza emails manualmente |
| Sync Calendar Agora | Sincroniza calendário manualmente |
| Adicionar Atividade | Registar atividade via prompt |
| Configurar Triggers | Ativar syncs automáticos |

---

## Troubleshooting

**"Não encontrei dados do CSV"**
- Verificar que o leads.csv foi aberto neste Sheet (deve ter dados em 5 colunas)

**"Permissão negada"**
- Run > Review Permissions > aceitar tudo

**Dashboard não carrega dados**
- Verificar que o Web App tem acesso "Anyone"
- Testar o URL no browser — deve devolver JSON

**Gmail sync não encontra emails**
- O sync só procura emails dos últimos 7 dias
- Verificar que os emails na tab Leads correspondem aos endereços reais

**Trigger não corre**
- Apps Script > Triggers (ícone relógio) > verificar que estão ativos
- Ver Executions para erros
