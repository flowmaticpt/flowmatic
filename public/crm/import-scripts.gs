/**
 * Flowmatic CRM — Scripts de Importação (v2 — simplificado)
 *
 * COMO USAR:
 * 1. Arrastar leads.csv para o Google Drive → abre automaticamente no Sheets
 *    (ou: Google Sheets > File > Import > Upload > leads.csv)
 * 2. A primeira tab já terá os dados (Empresa, Setor, Email, Telefone, Localização)
 * 3. Criar tab "Log_Import" e colar o conteúdo de enviados.log
 * 4. Extensions > Apps Script > colar este ficheiro + sync-scripts.gs
 * 5. Correr importarDadosExistentes() UMA VEZ
 *
 * O script:
 * - Deteta os dados do CSV na primeira tab (qualquer que seja o nome)
 * - Reestrutura para o formato CRM (adiciona colunas Estado, Responsável, etc.)
 * - Importa enviados.log da tab "Log_Import"
 * - Marca leads contactados e adiciona clientes ativos
 * - Cria tabs Atividades e Métricas com fórmulas
 */

// ==================== CONFIGURAÇÃO ====================

var COL = {
  ID: 1, EMPRESA: 2, SETOR: 3, CONTACTO: 4, EMAIL: 5,
  TELEFONE: 6, LOCALIZACAO: 7, ORIGEM: 8, ESTADO: 9,
  DATA_PRIMEIRO_CONTACTO: 10, DATA_ULTIMA_ATIVIDADE: 11,
  PROXIMA_ACAO: 12, DATA_PROXIMA_ACAO: 13, RESPONSAVEL: 14,
  VALOR_SETUP: 15, VALOR_MENSAL: 16, NOTAS: 17
};

var COL_ATIV = {
  DATA: 1, EMPRESA: 2, TIPO: 3, RESUMO: 4, RESPONSAVEL: 5
};

var LEADS_HEADERS = ['ID', 'Empresa', 'Setor', 'Contacto', 'Email', 'Telefone',
  'Localização', 'Origem', 'Estado', 'Data Primeiro Contacto',
  'Data Última Atividade', 'Próxima Ação', 'Data Próxima Ação',
  'Responsável', 'Valor Setup (€)', 'Valor Mensal (€)', 'Notas'];

var ATIV_HEADERS = ['Data', 'Empresa', 'Tipo', 'Resumo', 'Responsável'];

// ==================== IMPORTAÇÃO PRINCIPAL ====================

function importarDadosExistentes() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();

  // Passo 1: Encontrar e reestruturar os dados do CSV
  var leadsCount = reestruturarCSV_(ss);

  // Passo 2: Criar tabs Atividades e Métricas
  criarTabsAuxiliares_(ss);

  // Passo 3: Importar enviados.log
  var ativCount = importarEnviadosLog_(ss);

  // Passo 4: Cruzar — marcar leads contactados
  var contactadosCount = marcarContactados_(ss);

  // Passo 5: Adicionar/atualizar clientes ativos
  adicionarClientesAtivos_(ss);

  // Passo 6: Métricas e formatação
  configurarMetricas_(ss);
  formatarSheet_(ss);

  // Passo 7: Limpar tab de import
  var logSheet = ss.getSheetByName('Log_Import');
  if (logSheet) {
    logSheet.setTabColor('#cccccc');
    try { logSheet.setName('_Log_Import (pode apagar)'); } catch(e) { /* já renomeada */ }
  }

  ui.alert(
    'Importação concluída!\n\n' +
    '• ' + leadsCount + ' leads reestruturados\n' +
    '• ' + ativCount + ' emails do log importados\n' +
    '• ' + contactadosCount + ' leads marcados como Contactado\n' +
    '• 4 clientes ativos adicionados (Ganho)\n\n' +
    'Tabs criadas: Leads, Atividades, Métricas.\n' +
    'Pode apagar a tab "_Log_Import".'
  );
}

// ==================== PASSO 1: REESTRUTURAR CSV ====================

/**
 * Encontra a tab com os dados do CSV (a primeira tab, ou uma com 5 colunas
 * que pareçam Empresa/Setor/Email/Telefone/Localização) e reestrutura
 * para o formato CRM com 17 colunas.
 */
function reestruturarCSV_(ss) {
  // Encontrar a tab com dados CSV
  var sourceSheet = encontrarTabCSV_(ss);
  if (!sourceSheet) {
    SpreadsheetApp.getUi().alert(
      'Não encontrei dados do CSV.\n\n' +
      'Certifique-se de que abriu o leads.csv neste Google Sheet\n' +
      '(File > Import ou arraste para o Drive).'
    );
    return 0;
  }

  var data = sourceSheet.getDataRange().getValues();
  if (data.length === 0) return 0;

  // Detetar se tem header (ignorar linhas que não são dados reais)
  var startRow = 0;
  for (var h = 0; h < Math.min(3, data.length); h++) {
    var cell = String(data[h][0]).toLowerCase().trim();
    // Ignorar headers, linhas vazias, linhas com "id", "empresa", "name", etc.
    if (cell === 'empresa' || cell === 'name' || cell === 'nome' || cell === 'id' ||
        cell === 'setor' || cell === 'sector' || cell === '' ||
        cell === 'email' || cell === 'telefone' || cell === 'localização') {
      startRow = h + 1;
    } else {
      break;
    }
  }

  // Ler dados originais (5 colunas: Empresa, Setor, Email, Telefone, Localização)
  var csvRows = [];
  for (var i = startRow; i < data.length; i++) {
    var empresa = String(data[i][0] || '').trim();
    if (!empresa) continue;
    csvRows.push({
      empresa: empresa,
      setor: String(data[i][1] || '').trim(),
      email: String(data[i][2] || '').trim(),
      telefone: String(data[i][3] || '').trim(),
      localizacao: String(data[i][4] || '').trim()
    });
  }

  if (csvRows.length === 0) return 0;

  // Criar ou obter tab "Leads"
  var leadsSheet = ss.getSheetByName('Leads');
  if (!leadsSheet) {
    // Se a tab original não se chama "Leads", renomear
    if (sourceSheet.getName() !== 'Leads' && sourceSheet.getName() !== 'Atividades' && sourceSheet.getName() !== 'Métricas') {
      sourceSheet.setName('Leads');
      leadsSheet = sourceSheet;
    } else {
      leadsSheet = ss.insertSheet('Leads');
    }
  }

  // Limpar a tab e reescrever com formato CRM
  leadsSheet.clear();

  // Header
  leadsSheet.getRange(1, 1, 1, 17).setValues([LEADS_HEADERS]);
  leadsSheet.getRange(1, 1, 1, 17).setFontWeight('bold');
  leadsSheet.getRange(1, 1, 1, 17).setBackground('#f1f5f9');
  leadsSheet.setFrozenRows(1);

  // Dados
  var rows = [];
  for (var j = 0; j < csvRows.length; j++) {
    var c = csvRows[j];
    rows.push([
      String(j + 1).padStart(3, '0'),  // ID
      c.empresa,                         // Empresa
      c.setor,                           // Setor
      '',                                // Contacto
      c.email,                           // Email
      c.telefone,                        // Telefone
      c.localizacao,                     // Localização
      'Email prospeção',                 // Origem
      'Prospecto',                       // Estado
      '',                                // Data Primeiro Contacto
      '',                                // Data Última Atividade
      '',                                // Próxima Ação
      '',                                // Data Próxima Ação
      '',                                // Responsável
      0,                                 // Valor Setup
      0,                                 // Valor Mensal
      ''                                 // Notas
    ]);
  }

  leadsSheet.getRange(2, 1, rows.length, 17).setValues(rows);

  // Se a tab fonte era diferente da "Leads", apagar a fonte
  if (sourceSheet.getName() !== 'Leads') {
    // Não apagar — pode ser a primeira tab e o utilizador pode querer manter
  }

  return rows.length;
}

/**
 * Encontra a tab que contém os dados do CSV.
 * Procura: a primeira tab que tenha dados em 5 colunas com padrão de empresa/email.
 */
function encontrarTabCSV_(ss) {
  var sheets = ss.getSheets();

  for (var i = 0; i < sheets.length; i++) {
    var sheet = sheets[i];
    var name = sheet.getName();

    // Ignorar tabs auxiliares
    if (name === 'Atividades' || name === 'Métricas' || name === 'Log_Import' ||
        name.indexOf('_Log') === 0) {
      continue;
    }

    // Verificar se tem dados que parecem CSV
    if (sheet.getLastRow() < 2) continue;
    var sample = sheet.getRange(1, 1, Math.min(3, sheet.getLastRow()), Math.min(6, sheet.getLastColumn())).getValues();

    // Heurísticas: tem pelo menos 5 colunas, alguma célula parece email
    var hasEmail = false;
    for (var r = 0; r < sample.length; r++) {
      for (var c = 0; c < sample[r].length; c++) {
        var val = String(sample[r][c]);
        if (val.indexOf('@') > 0 && val.indexOf('.') > 0) {
          hasEmail = true;
          break;
        }
      }
      if (hasEmail) break;
    }

    // Ou o header parece CSV (Empresa, Setor, Email...)
    var headerLower = String(sample[0][0]).toLowerCase();
    var looksLikeCSV = hasEmail ||
      headerLower === 'empresa' ||
      headerLower === 'name' ||
      sheet.getLastColumn() >= 4;

    if (looksLikeCSV && sheet.getLastRow() > 5) {
      return sheet;
    }
  }

  return null;
}

// ==================== PASSO 2: TABS AUXILIARES ====================

function criarTabsAuxiliares_(ss) {
  // Tab Atividades
  var ativSheet = ss.getSheetByName('Atividades');
  if (!ativSheet) {
    ativSheet = ss.insertSheet('Atividades');
    ativSheet.getRange(1, 1, 1, 5).setValues([ATIV_HEADERS]);
    ativSheet.getRange(1, 1, 1, 5).setFontWeight('bold');
    ativSheet.getRange(1, 1, 1, 5).setBackground('#f1f5f9');
    ativSheet.setFrozenRows(1);
  }

  // Tab Métricas
  var metSheet = ss.getSheetByName('Métricas');
  if (!metSheet) {
    metSheet = ss.insertSheet('Métricas');
    metSheet.getRange(1, 1, 1, 2).setValues([['Métrica', 'Valor']]);
    metSheet.getRange(1, 1, 1, 2).setFontWeight('bold');
    metSheet.getRange(1, 1, 1, 2).setBackground('#f1f5f9');
    metSheet.setFrozenRows(1);
  }
}

// ==================== PASSO 3: IMPORTAR LOG ====================

/**
 * Importa enviados.log da tab "Log_Import".
 * Formato: "2026-03-12 15:41 | Empresa | email@email.pt"
 *
 * Se a tab não existir, cria-a com instruções.
 */
function importarEnviadosLog_(ss) {
  var ativSheet = ss.getSheetByName('Atividades');
  var logSheet = ss.getSheetByName('Log_Import');

  if (!logSheet) {
    logSheet = ss.insertSheet('Log_Import');
    logSheet.getRange('A1').setValue(
      'Cole aqui o conteúdo de enviados.log (uma linha por célula na coluna A).\n' +
      'Depois corra Flowmatic CRM > Importar Dados novamente.'
    );
    logSheet.getRange('A1').setFontWeight('bold');
    logSheet.setTabColor('#ff9900');
    return 0;
  }

  if (logSheet.getLastRow() < 1) return 0;

  var data = logSheet.getDataRange().getValues();
  var rows = [];

  for (var i = 0; i < data.length; i++) {
    var line = String(data[i][0] || '').trim();
    if (!line) continue;

    // Ignorar linhas de instrução
    if (line.indexOf('Cole aqui') === 0 || line.indexOf('INSTRUÇÕES') === 0) continue;

    // Parse: "2026-03-12 15:41 | Empresa | email@email.pt"
    var parts = line.split('|');
    if (parts.length < 2) continue;

    var dataStr = parts[0].trim();
    var empresa = parts[1].trim();

    if (!empresa) continue;

    rows.push([
      dataStr,
      empresa,
      'Email Enviado',
      'Email de prospeção enviado',
      'Ricardo'
    ]);
  }

  if (rows.length > 0) {
    var startRow = ativSheet.getLastRow() + 1;
    ativSheet.getRange(startRow, 1, rows.length, 5).setValues(rows);
  }

  return rows.length;
}

// ==================== PASSO 4: MARCAR CONTACTADOS ====================

/**
 * Cruza Atividades com Leads (BATCH — escreve tudo de uma vez).
 * Se um lead tem email enviado, muda de "Prospecto" para "Contactado".
 */
function marcarContactados_(ss) {
  var leadsSheet = ss.getSheetByName('Leads');
  var ativSheet = ss.getSheetByName('Atividades');

  var leadsRows = leadsSheet.getLastRow() - 1;
  var ativRows = ativSheet.getLastRow() - 1;
  if (leadsRows < 1 || ativRows < 1) return 0;

  var leadsData = leadsSheet.getRange(2, 1, leadsRows, 17).getValues();
  var ativData = ativSheet.getRange(2, 1, ativRows, 5).getValues();

  // Mapa: empresa → primeira data de contacto
  var contactados = {};
  for (var i = 0; i < ativData.length; i++) {
    var empresa = String(ativData[i][1]).trim();
    var data = ativData[i][0];
    if (empresa && !contactados[empresa]) {
      contactados[empresa] = data;
    }
  }

  // Modificar arrays em memória
  var count = 0;
  for (var j = 0; j < leadsData.length; j++) {
    var nomeEmpresa = String(leadsData[j][1]).trim();
    if (contactados[nomeEmpresa] && leadsData[j][8] === 'Prospecto') {
      leadsData[j][8] = 'Contactado';                   // Estado
      leadsData[j][9] = contactados[nomeEmpresa];        // Data Primeiro Contacto
      leadsData[j][10] = contactados[nomeEmpresa];       // Data Última Atividade
      count++;
    }
  }

  // Escrever tudo de uma vez (1 chamada ao Sheet)
  if (count > 0) {
    leadsSheet.getRange(2, 1, leadsData.length, 17).setValues(leadsData);
  }

  return count;
}

// ==================== PASSO 5: CLIENTES ATIVOS ====================

function adicionarClientesAtivos_(ss) {
  var sheet = ss.getSheetByName('Leads');
  var leadsRows = sheet.getLastRow() - 1;

  // Ler todos os dados de uma vez
  var allData = leadsRows >= 1 ? sheet.getRange(2, 1, leadsRows, 17).getValues() : [];
  var existingNames = allData.map(function(r) { return String(r[1]).trim(); });

  var clientes = [
    { empresa: 'Oficina do Condutor', setor: 'Escola de Condução', contacto: 'Maria Ribeiro', email: 'geral@oficinadocondutor.pt', telefone: '224 016 906', localizacao: 'Matosinhos', estado: 'Ganho', dataContacto: '2026-03-13', dataAtividade: '2026-03-19', proximaAcao: 'Implementar lembretes automáticos', dataProximaAcao: '2026-03-22', responsavel: 'Ricardo', valorSetup: 400, valorMensal: 80, notas: 'Coordenadora Maria. Usa Pugnatrix. 10-15 staff.' },
    { empresa: 'EC Vitória', setor: 'Escola de Condução', contacto: '', email: 'escolavitoria@sapo.pt', telefone: '', localizacao: 'Beja', estado: 'Ganho', dataContacto: '2026-03-18', dataAtividade: '2026-03-19', proximaAcao: 'Setup do site', dataProximaAcao: '2026-03-21', responsavel: 'Ricardo', valorSetup: 350, valorMensal: 0, notas: 'Site entregue. Cliente satisfeito.' },
    { empresa: 'Grancoop', setor: 'Cooperativa Agrícola', contacto: '', email: '', telefone: '', localizacao: 'Portugal', estado: 'Ganho', dataContacto: '2026-03-14', dataAtividade: '2026-03-18', proximaAcao: 'Acompanhamento mensal', dataProximaAcao: '2026-04-18', responsavel: 'Ricardo', valorSetup: 500, valorMensal: 100, notas: 'Automatização de processos agrícolas.' },
    { empresa: "Let's Go", setor: 'Ginásio', contacto: '', email: 'lets.go@sapo.pt', telefone: '', localizacao: 'Portugal', estado: 'Ganho', dataContacto: '2026-03-19', dataAtividade: '2026-03-20', proximaAcao: 'Implementação inicial', dataProximaAcao: '2026-03-25', responsavel: 'Vasco', valorSetup: 300, valorMensal: 60, notas: 'Ginásio — automatização de gestão de membros.' }
  ];

  var newRows = [];
  clientes.forEach(function(c) {
    var idx = existingNames.indexOf(c.empresa);
    if (idx >= 0) {
      // Atualizar em memória
      allData[idx][3] = c.contacto;
      allData[idx][8] = c.estado;
      allData[idx][9] = c.dataContacto;
      allData[idx][10] = c.dataAtividade;
      allData[idx][11] = c.proximaAcao;
      allData[idx][12] = c.dataProximaAcao;
      allData[idx][13] = c.responsavel;
      allData[idx][14] = c.valorSetup;
      allData[idx][15] = c.valorMensal;
      allData[idx][16] = c.notas;
    } else {
      var id = String(allData.length + newRows.length + 1).padStart(3, '0');
      newRows.push([id, c.empresa, c.setor, c.contacto, c.email, c.telefone,
        c.localizacao, 'Email prospeção', c.estado, c.dataContacto,
        c.dataAtividade, c.proximaAcao, c.dataProximaAcao,
        c.responsavel, c.valorSetup, c.valorMensal, c.notas]);
    }
  });

  // Escrever tudo de uma vez
  if (allData.length > 0) {
    sheet.getRange(2, 1, allData.length, 17).setValues(allData);
  }
  if (newRows.length > 0) {
    var startRow = sheet.getLastRow() + 1;
    sheet.getRange(startRow, 1, newRows.length, 17).setValues(newRows);
  }
}

// ==================== MÉTRICAS ====================

function configurarMetricas_(ss) {
  var sheet = ss.getSheetByName('Métricas');
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).clearContent();
  }

  // NOTA: Google Sheets PT usa ";" como separador de argumentos (não ",")
  var metricas = [
    ['Total Leads', '=COUNTA(Leads!B2:B)'],
    ['', ''],
    ['--- Por Estado ---', ''],
    ['Prospectos', '=COUNTIF(Leads!I2:I;"Prospecto")'],
    ['Contactados', '=COUNTIF(Leads!I2:I;"Contactado")'],
    ['Responderam', '=COUNTIF(Leads!I2:I;"Respondeu")'],
    ['Reunião', '=COUNTIF(Leads!I2:I;"Reuniao")'],
    ['Proposta', '=COUNTIF(Leads!I2:I;"Proposta")'],
    ['Ganho', '=COUNTIF(Leads!I2:I;"Ganho")'],
    ['Perdido', '=COUNTIF(Leads!I2:I;"Perdido")'],
    ['', ''],
    ['--- Taxas ---', ''],
    ['Taxa de Resposta', '=IFERROR((COUNTIF(Leads!I2:I;"Respondeu")+COUNTIF(Leads!I2:I;"Reuniao")+COUNTIF(Leads!I2:I;"Proposta")+COUNTIF(Leads!I2:I;"Ganho"))/(COUNTA(Leads!B2:B)-COUNTIF(Leads!I2:I;"Prospecto"));0)'],
    ['Taxa de Conversão', '=IFERROR(COUNTIF(Leads!I2:I;"Ganho")/COUNTA(Leads!B2:B);0)'],
    ['', ''],
    ['--- Pipeline (Reunião + Proposta) ---', ''],
    ['Pipeline Setup (€)', '=SUMPRODUCT((Leads!I2:I="Reuniao")*(Leads!O2:O))+SUMPRODUCT((Leads!I2:I="Proposta")*(Leads!O2:O))'],
    ['Pipeline Mensal x12 (€)', '=SUMPRODUCT((Leads!I2:I="Reuniao")*(Leads!P2:P)*12)+SUMPRODUCT((Leads!I2:I="Proposta")*(Leads!P2:P)*12)'],
    ['Pipeline Total (€)', '=B17+B18'],
    ['', ''],
    ['--- Receita (Ganhos) ---', ''],
    ['Receita Setup (€)', '=SUMPRODUCT((Leads!I2:I="Ganho")*(Leads!O2:O))'],
    ['Receita Mensal (€)', '=SUMPRODUCT((Leads!I2:I="Ganho")*(Leads!P2:P))'],
    ['Receita Anual (€)', '=B22+B23*12'],
    ['', ''],
    ['--- Alertas ---', ''],
    ['Sem atividade há +7 dias', '=COUNTIFS(Leads!I2:I;"<>Prospecto";Leads!I2:I;"<>Ganho";Leads!I2:I;"<>Perdido";Leads!K2:K;"<"&TODAY()-7)'],
    ['Total Emails Enviados', '=COUNTIF(Atividades!C2:C;"Email Enviado")'],
  ];

  sheet.getRange(2, 1, metricas.length, 2).setValues(metricas);
}

// ==================== FORMATAÇÃO ====================

function formatarSheet_(ss) {
  var leadsSheet = ss.getSheetByName('Leads');

  // Auto-resize
  for (var i = 1; i <= 17; i++) {
    leadsSheet.autoResizeColumn(i);
  }

  var lastRow = Math.max(leadsSheet.getLastRow(), 200);

  // Dropdown: Estado
  var estadoRange = leadsSheet.getRange(2, COL.ESTADO, lastRow - 1, 1);
  estadoRange.setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['Prospecto', 'Contactado', 'Respondeu', 'Reuniao', 'Proposta', 'Ganho', 'Perdido'], true)
      .setAllowInvalid(false)
      .build()
  );

  // Dropdown: Tipo de Atividade
  var ativSheet = ss.getSheetByName('Atividades');
  var ativLastRow = Math.max(ativSheet.getLastRow(), 200);
  ativSheet.getRange(2, COL_ATIV.TIPO, ativLastRow - 1, 1).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['Email Enviado', 'Email Recebido', 'Reunião', 'Chamada', 'Proposta', 'Nota'], true)
      .setAllowInvalid(false)
      .build()
  );

  // Dropdown: Responsável
  leadsSheet.getRange(2, COL.RESPONSAVEL, lastRow - 1, 1).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['Ricardo', 'Vasco'], true)
      .setAllowInvalid(true)
      .build()
  );

  // Cores condicionais para coluna Estado
  var rules = [];
  var colors = {
    'Ganho': '#d1fae5', 'Perdido': '#fecaca', 'Reuniao': '#fef3c7',
    'Proposta': '#fed7aa', 'Respondeu': '#e9d5ff', 'Contactado': '#dbeafe'
  };

  Object.keys(colors).forEach(function(estado) {
    rules.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo(estado)
        .setBackground(colors[estado])
        .setRanges([estadoRange])
        .build()
    );
  });

  leadsSheet.setConditionalFormatRules(rules);

  // Auto-resize Atividades
  for (var j = 1; j <= 5; j++) {
    ativSheet.autoResizeColumn(j);
  }
}
