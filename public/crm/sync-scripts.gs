/**
 * Flowmatic CRM — Scripts de Sincronização
 *
 * Sincroniza dados entre Gmail, Google Calendar e o Sheet do CRM.
 * Inclui endpoint JSON para o Dashboard HTML.
 *
 * SETUP:
 * 1. Copiar para o mesmo projeto Apps Script que o import-scripts.gs
 * 2. Executar configurarTriggers() uma vez
 * 3. Publicar como Web App (getDataAsJSON)
 */

// ==================== CONFIGURAÇÃO ====================

/**
 * Email da Flowmatic (para procurar emails enviados/recebidos)
 */
var FLOWMATIC_EMAIL = 'flowmaticpt@gmail.com';

/**
 * Label/prefixo para identificar emails de prospeção no Gmail
 * (opcional — se não usar, procura por todos os emails)
 */
var GMAIL_SEARCH_LABEL = '';

/**
 * Nome do calendário a monitorizar
 */
var CALENDAR_NAME = 'primary';

// Reutilizar COL do import-scripts.gs
// Se estiverem no mesmo projeto Apps Script, não é preciso redefinir.
// Se estiverem separados, descomentar:
/*
var COL = {
  ID: 1, EMPRESA: 2, SETOR: 3, CONTACTO: 4, EMAIL: 5,
  TELEFONE: 6, LOCALIZACAO: 7, ORIGEM: 8, ESTADO: 9,
  DATA_PRIMEIRO_CONTACTO: 10, DATA_ULTIMA_ATIVIDADE: 11,
  PROXIMA_ACAO: 12, DATA_PROXIMA_ACAO: 13, RESPONSAVEL: 14,
  VALOR_SETUP: 15, VALOR_MENSAL: 16, NOTAS: 17
};
var COL_ATIV = { DATA: 1, EMPRESA: 2, TIPO: 3, RESUMO: 4, RESPONSAVEL: 5 };
*/

// ==================== TRIGGERS ====================

/**
 * Configura triggers automáticos. Correr UMA VEZ.
 */
function configurarTriggers() {
  // Remover triggers existentes
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(t) { ScriptApp.deleteTrigger(t); });

  // Gmail sync a cada 30 minutos
  ScriptApp.newTrigger('syncGmail')
    .timeBased()
    .everyMinutes(30)
    .create();

  // Calendar sync a cada hora
  ScriptApp.newTrigger('syncCalendar')
    .timeBased()
    .everyHours(1)
    .create();

  Logger.log('Triggers configurados: Gmail (30 min), Calendar (1 hora)');
  SpreadsheetApp.getUi().alert('Triggers configurados com sucesso!');
}

// ==================== SYNC GMAIL ====================

/**
 * Sincroniza emails enviados/recebidos com leads do CRM.
 *
 * Para cada lead com email:
 * - Procura threads no Gmail com esse endereço
 * - Cria entradas na tab Atividades para cada mensagem nova
 * - Atualiza "Data Última Atividade" no lead
 * - Se encontrar resposta de lead com estado "Contactado", muda para "Respondeu"
 */
function syncGmail() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var leadsSheet = ss.getSheetByName('Leads');
  var ativSheet = ss.getSheetByName('Atividades');

  if (!leadsSheet || !ativSheet) {
    Logger.log('Tabs Leads ou Atividades não encontradas.');
    return;
  }

  var leadsData = leadsSheet.getRange(2, 1, leadsSheet.getLastRow() - 1, 17).getValues();

  // Obter atividades existentes para evitar duplicados
  var existingActivities = new Set();
  if (ativSheet.getLastRow() > 1) {
    var ativData = ativSheet.getRange(2, 1, ativSheet.getLastRow() - 1, 4).getValues();
    ativData.forEach(function(row) {
      // Chave: data + empresa + tipo
      existingActivities.add(row[0] + '|' + row[1] + '|' + row[2]);
    });
  }

  var newActivities = [];
  var leadsToUpdate = []; // [{row, col, value}]

  for (var i = 0; i < leadsData.length; i++) {
    var email = leadsData[i][4]; // COL.EMAIL (0-indexed)
    var empresa = leadsData[i][1];
    var estado = leadsData[i][8];

    if (!email) continue;

    // Procurar threads com este email (últimos 7 dias)
    var query = 'from:' + email + ' OR to:' + email + ' newer_than:7d';
    try {
      var threads = GmailApp.search(query, 0, 10);
    } catch (e) {
      Logger.log('Erro a procurar emails para ' + email + ': ' + e.message);
      continue;
    }

    var latestDate = leadsData[i][10] ? new Date(leadsData[i][10]) : null;

    for (var t = 0; t < threads.length; t++) {
      var messages = threads[t].getMessages();
      for (var m = 0; m < messages.length; m++) {
        var msg = messages[m];
        var msgDate = msg.getDate();
        var msgFrom = msg.getFrom();
        var msgSubject = msg.getSubject();

        // Determinar tipo
        var isFromLead = msgFrom.toLowerCase().indexOf(email.toLowerCase()) >= 0;
        var tipo = isFromLead ? 'Email Recebido' : 'Email Enviado';

        // Formatar data
        var dateStr = Utilities.formatDate(msgDate, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');

        // Verificar duplicado
        var key = dateStr + '|' + empresa + '|' + tipo;
        if (existingActivities.has(key)) continue;
        existingActivities.add(key);

        // Criar atividade
        var resumo = tipo + ': ' + msgSubject.substring(0, 80);
        newActivities.push([dateStr, empresa, tipo, resumo, 'Ricardo']);

        // Atualizar data última atividade
        if (!latestDate || msgDate > latestDate) {
          latestDate = msgDate;
        }

        // Se resposta de lead com estado "Contactado" → "Respondeu"
        if (isFromLead && estado === 'Contactado') {
          leadsToUpdate.push({ row: i + 2, col: COL.ESTADO, value: 'Respondeu' });
          estado = 'Respondeu'; // Evitar múltiplas atualizações
        }
      }
    }

    // Atualizar data última atividade se mudou
    if (latestDate) {
      var latestStr = Utilities.formatDate(latestDate, Session.getScriptTimeZone(), 'yyyy-MM-dd');
      var currentDate = leadsData[i][10] ? Utilities.formatDate(new Date(leadsData[i][10]), Session.getScriptTimeZone(), 'yyyy-MM-dd') : '';
      if (latestStr !== currentDate) {
        leadsToUpdate.push({ row: i + 2, col: COL.DATA_ULTIMA_ATIVIDADE, value: latestStr });
      }
    }
  }

  // Escrever novas atividades
  if (newActivities.length > 0) {
    var startRow = ativSheet.getLastRow() + 1;
    ativSheet.getRange(startRow, 1, newActivities.length, 5).setValues(newActivities);
    Logger.log('Gmail sync: ' + newActivities.length + ' novas atividades.');
  }

  // Atualizar leads
  leadsToUpdate.forEach(function(update) {
    leadsSheet.getRange(update.row, update.col).setValue(update.value);
  });

  Logger.log('Gmail sync concluído. ' + newActivities.length + ' atividades, ' + leadsToUpdate.length + ' atualizações.');
}

// ==================== SYNC CALENDAR ====================

/**
 * Sincroniza eventos do Google Calendar com leads do CRM.
 *
 * Procura eventos dos últimos 7 dias e próximos 14 dias.
 * Se o título/descrição mencionar uma empresa da tab Leads:
 * - Cria entrada na tab Atividades (tipo: "Reunião")
 * - Atualiza estado do lead para "Reunião" se aplicável
 */
function syncCalendar() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var leadsSheet = ss.getSheetByName('Leads');
  var ativSheet = ss.getSheetByName('Atividades');

  if (!leadsSheet || !ativSheet) return;

  var leadsData = leadsSheet.getRange(2, 1, leadsSheet.getLastRow() - 1, 17).getValues();

  // Construir lista de nomes de empresas para matching
  var empresas = [];
  for (var i = 0; i < leadsData.length; i++) {
    empresas.push({
      nome: leadsData[i][1],
      row: i + 2,
      estado: leadsData[i][8]
    });
  }

  // Obter eventos
  var cal = CalendarApp.getCalendarById(CALENDAR_NAME) || CalendarApp.getDefaultCalendar();
  var now = new Date();
  var pastDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  var futureDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  var events = cal.getEvents(pastDate, futureDate);

  // Obter atividades existentes
  var existingActivities = new Set();
  if (ativSheet.getLastRow() > 1) {
    var ativData = ativSheet.getRange(2, 1, ativSheet.getLastRow() - 1, 4).getValues();
    ativData.forEach(function(row) {
      existingActivities.add(row[0] + '|' + row[1] + '|' + row[2]);
    });
  }

  var newActivities = [];
  var leadsToUpdate = [];

  events.forEach(function(event) {
    var title = event.getTitle();
    var description = event.getDescription() || '';
    var eventDate = event.getStartTime();
    var searchText = (title + ' ' + description).toLowerCase();

    // Procurar match com empresas
    empresas.forEach(function(emp) {
      if (!emp.nome) return;

      // Match: nome da empresa aparece no título ou descrição
      var normalizedName = emp.nome.toLowerCase();
      if (searchText.indexOf(normalizedName) < 0) return;

      var dateStr = Utilities.formatDate(eventDate, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');
      var key = dateStr + '|' + emp.nome + '|Reunião';

      if (existingActivities.has(key)) return;
      existingActivities.add(key);

      newActivities.push([dateStr, emp.nome, 'Reunião', 'Reunião: ' + title, 'Ricardo']);

      // Atualizar estado se aplicável
      var validStates = ['Contactado', 'Respondeu'];
      if (validStates.indexOf(emp.estado) >= 0) {
        leadsToUpdate.push({ row: emp.row, col: COL.ESTADO, value: 'Reuniao' });
      }

      // Atualizar data última atividade
      var latestStr = Utilities.formatDate(eventDate, Session.getScriptTimeZone(), 'yyyy-MM-dd');
      leadsToUpdate.push({ row: emp.row, col: COL.DATA_ULTIMA_ATIVIDADE, value: latestStr });
    });
  });

  // Escrever
  if (newActivities.length > 0) {
    var startRow = ativSheet.getLastRow() + 1;
    ativSheet.getRange(startRow, 1, newActivities.length, 5).setValues(newActivities);
  }

  leadsToUpdate.forEach(function(update) {
    leadsSheet.getRange(update.row, update.col).setValue(update.value);
  });

  Logger.log('Calendar sync: ' + newActivities.length + ' atividades, ' + leadsToUpdate.length + ' atualizações.');
}

// ==================== WEB APP (JSON ENDPOINT) ====================

/**
 * Endpoint que devolve todos os dados como JSON.
 * Publicar como Web App: Deploy > New Deployment > Web App
 * - Execute as: Me
 * - Who has access: Anyone (ou Anyone with link)
 *
 * O Dashboard HTML usa este endpoint para puxar dados em tempo real.
 */
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var data = getDataAsJSON_();

  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Converte os dados do Sheet para o formato JSON esperado pelo Dashboard.
 */
function getDataAsJSON_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Ler Leads
  var leadsSheet = ss.getSheetByName('Leads');
  var leads = [];
  if (leadsSheet && leadsSheet.getLastRow() > 1) {
    var leadsData = leadsSheet.getRange(2, 1, leadsSheet.getLastRow() - 1, 17).getValues();
    for (var i = 0; i < leadsData.length; i++) {
      var row = leadsData[i];
      if (!row[1]) continue; // Skip empty rows
      leads.push({
        id: row[0],
        empresa: row[1],
        setor: row[2],
        contacto: row[3],
        email: row[4],
        telefone: row[5],
        localizacao: row[6],
        origem: row[7],
        estado: row[8],
        dataContacto: formatDate_(row[9]),
        dataAtividade: formatDate_(row[10]),
        proximaAcao: row[11],
        dataProximaAcao: formatDate_(row[12]),
        responsavel: row[13],
        valorSetup: row[14] || 0,
        valorMensal: row[15] || 0,
        notas: row[16]
      });
    }
  }

  // Ler Atividades
  var ativSheet = ss.getSheetByName('Atividades');
  var activities = [];
  if (ativSheet && ativSheet.getLastRow() > 1) {
    var ativData = ativSheet.getRange(2, 1, ativSheet.getLastRow() - 1, 5).getValues();
    for (var j = 0; j < ativData.length; j++) {
      var aRow = ativData[j];
      if (!aRow[1]) continue;
      activities.push({
        data: formatDate_(aRow[0]),
        empresa: aRow[1],
        tipo: aRow[2],
        resumo: aRow[3],
        responsavel: aRow[4]
      });
    }
    // Ordenar por data (mais recente primeiro)
    activities.sort(function(a, b) {
      return a.data > b.data ? -1 : 1;
    });
  }

  return {
    leads: leads,
    activities: activities,
    lastSync: new Date().toISOString()
  };
}

/**
 * Formata data para string ISO.
 */
function formatDate_(value) {
  if (!value) return '';
  if (value instanceof Date) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');
  }
  return String(value);
}

// ==================== WEB APP (POST — ATUALIZAR ESTADO) ====================

/**
 * Recebe updates do Dashboard HTML via POST.
 * Body: { action: "updateEstado", email: "geral@escola.pt", novoEstado: "Reuniao" }
 *
 * Ações suportadas:
 * - updateEstado: Atualiza o estado de uma lead pelo email
 */
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);

    if (body.action === 'updateEstado') {
      var result = atualizarEstadoLead_(body.email, body.novoEstado);
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Ação desconhecida' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Encontra uma lead pelo email e atualiza o seu estado.
 * Também atualiza Data Última Atividade e regista na tab Atividades.
 */
function atualizarEstadoLead_(email, novoEstado) {
  if (!email || !novoEstado) {
    return { success: false, error: 'Email e novoEstado são obrigatórios' };
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var leadsSheet = ss.getSheetByName('Leads');
  var ativSheet = ss.getSheetByName('Atividades');

  if (!leadsSheet) return { success: false, error: 'Tab Leads não encontrada' };

  var leadsData = leadsSheet.getRange(2, 1, leadsSheet.getLastRow() - 1, 17).getValues();
  var encontrado = false;
  var empresa = '';

  for (var i = 0; i < leadsData.length; i++) {
    if (leadsData[i][4].toString().toLowerCase().trim() === email.toLowerCase().trim()) {
      var row = i + 2;
      empresa = leadsData[i][1];
      var estadoAnterior = leadsData[i][8];

      // Atualizar estado
      leadsSheet.getRange(row, COL.ESTADO).setValue(novoEstado);

      // Atualizar data última atividade
      var now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
      leadsSheet.getRange(row, COL.DATA_ULTIMA_ATIVIDADE).setValue(now);

      encontrado = true;

      // Registar atividade
      if (ativSheet) {
        var nowFull = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');
        var resumo = 'Estado alterado: ' + estadoAnterior + ' → ' + novoEstado;
        var newRow = ativSheet.getLastRow() + 1;
        ativSheet.getRange(newRow, 1, 1, 5).setValues([[nowFull, empresa, 'Nota', resumo, 'Dashboard']]);
      }

      break;
    }
  }

  if (!encontrado) {
    return { success: false, error: 'Lead não encontrada com email: ' + email };
  }

  return { success: true, empresa: empresa, novoEstado: novoEstado };
}

// ==================== UTILIDADES ====================

/**
 * Adicionar uma atividade manualmente (para usar no Sheet como macro).
 */
function adicionarAtividade() {
  var ui = SpreadsheetApp.getUi();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ativSheet = ss.getSheetByName('Atividades');

  var empresa = ui.prompt('Nome da empresa:').getResponseText();
  if (!empresa) return;

  var tipo = ui.prompt('Tipo (Email Enviado / Email Recebido / Reunião / Chamada / Proposta / Nota):').getResponseText();
  if (!tipo) return;

  var resumo = ui.prompt('Resumo:').getResponseText();
  var responsavel = ui.prompt('Responsável (Ricardo / Vasco):').getResponseText() || 'Ricardo';

  var now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');
  var newRow = ativSheet.getLastRow() + 1;
  ativSheet.getRange(newRow, 1, 1, 5).setValues([[now, empresa, tipo, resumo, responsavel]]);

  // Atualizar data última atividade no lead
  var leadsSheet = ss.getSheetByName('Leads');
  var leadsData = leadsSheet.getRange(2, 2, leadsSheet.getLastRow() - 1, 1).getValues();
  for (var i = 0; i < leadsData.length; i++) {
    if (leadsData[i][0] === empresa) {
      leadsSheet.getRange(i + 2, COL.DATA_ULTIMA_ATIVIDADE).setValue(now.split(' ')[0]);
      break;
    }
  }

  ui.alert('Atividade registada para ' + empresa + '!');
}

/**
 * Menu personalizado no Google Sheets
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Flowmatic CRM')
    .addItem('Importar Dados (1x)', 'importarDadosExistentes')
    .addItem('Sync Gmail Agora', 'syncGmail')
    .addItem('Sync Calendar Agora', 'syncCalendar')
    .addItem('Adicionar Atividade', 'adicionarAtividade')
    .addSeparator()
    .addItem('Configurar Triggers', 'configurarTriggers')
    .addToUi();
}
