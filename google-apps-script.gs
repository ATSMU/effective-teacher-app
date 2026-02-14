
/**
 * ЭТО ОБНОВЛЕННЫЙ СКРИПТ (Версия 5.0)
 * - Расписание занятий: лист Schedule (день недели, занятие, длительность, время, кураторы).
 *   Сохраняется через saveScheduleItem, удаление через deleteItem с sheet: 'Schedule'.
 * - Результаты тестов: attemptsHistory, answers, attempts, invalidated, invalidReason.
 */

const SS = SpreadsheetApp.getActiveSpreadsheet();

// Схема базы данных (строгий порядок колонок; не менять без обновления фронта)
const SCHEMA = {
  'Users': ['id', 'name', 'login', 'password', 'role', 'courseStartDate', 'courseEndDate', 'stream', 'department'],
  'Lessons': ['id', 'title', 'description', 'coverImage', 'files', 'questions', 'createdAt'],
  'Tasks': ['id', 'title', 'description', 'createdAt'],
  'Schedule': ['id', 'dayOfWeek', 'lessonId', 'durationHours', 'startTime', 'curators'],
  'Submissions': ['userId', 'taskId', 'response', 'files', 'status', 'timestamp'],
  'Reviews': ['adminId', 'userId', 'taskId', 'grade', 'comment', 'timestamp'],
  'Results': ['userId', 'lessonId', 'score', 'total', 'percentage', 'passed', 'timestamp', 'answers', 'attempts', 'attemptsHistory', 'invalidated', 'invalidReason'],
  'Recommendations': ['id', 'title', 'content', 'authorName', 'createdAt']
};

function initStructure() {
  Object.keys(SCHEMA).forEach(sheetName => {
    let sheet = SS.getSheetByName(sheetName);
    if (!sheet) {
      sheet = SS.insertSheet(sheetName);
    }
    
    const expectedHeaders = SCHEMA[sheetName];
    const range = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), expectedHeaders.length));
    const currentHeaders = range.getValues()[0];
    
    if (currentHeaders[0] === "" || JSON.stringify(currentHeaders.filter(h => h !== "")) !== JSON.stringify(expectedHeaders)) {
      sheet.getRange(1, 1, 1, expectedHeaders.length).setValues([expectedHeaders]);
      sheet.setFrozenRows(1);
    }

    if (sheetName === 'Users' && sheet.getLastRow() === 1) {
      // Инициализация дефолтного админа с новым полем department
      const defaultAdmin = ['admin_root', 'System Admin', 'admin', 'admin', 'admin', Date.now(), Date.now() + (365 * 24 * 60 * 60 * 1000), 'System', 'IT'];
      sheet.appendRow(defaultAdmin);
    }
  });
}

function doGet(e) {
  initStructure();
  const results = {};
  Object.keys(SCHEMA).forEach(sheetName => {
    results[sheetName.toLowerCase()] = getSheetData(sheetName);
  });
  return ContentService.createTextOutput(JSON.stringify(results))
    .setMimeType(ContentService.MimeType.JSON);
}

function safeDecodeUriComponent(str) {
  try {
    return decodeURIComponent(str.replace(/\+/g, ' '));
  } catch (e) {
    return str;
  }
}

function parsePostBody(contents) {
  if (!contents) return null;
  var s = contents.toString();
  var trimmed = s.trim();
  if (trimmed.startsWith('{')) {
    try {
      return JSON.parse(s);
    } catch (e) {
      return null;
    }
  }
  var out = {};
  var parts = s.split('&');
  for (var p = 0; p < parts.length; p++) {
    var pair = parts[p];
    var i = pair.indexOf('=');
    if (i === -1) continue;
    var key = safeDecodeUriComponent(pair.substring(0, i));
    var val = safeDecodeUriComponent(pair.substring(i + 1));
    out[key] = val;
  }
  if (out.payload) {
    try {
      return JSON.parse(out.payload);
    } catch (e) {
      return null;
    }
  }
  return null;
}

function doPost(e) {
  initStructure();
  try {
    if (!e.postData || !e.postData.contents) throw new Error("No post data received");
    var request = parsePostBody(e.postData.contents);
    if (!request) throw new Error("Could not parse request body");
    var action = request.action;
    var data = request.data;
    if (!data) throw new Error("No data provided");

    switch (action) {
      case 'saveUser':
        upsertRecord('Users', data, ['id']);
        break;
      case 'saveLesson':
        upsertRecord('Lessons', data, ['id']);
        break;
      case 'patchLessonContent':
        patchLessonContent(data);
        break;
      case 'saveTask':
        upsertRecord('Tasks', data, ['id']);
        break;
      case 'submitTask':
        upsertRecord('Submissions', data, ['userId', 'taskId']);
        break;
      case 'saveReview':
        upsertRecord('Reviews', data, ['adminId', 'userId', 'taskId']);
        break;
      case 'saveLessonResult':
        upsertRecord('Results', data, ['userId', 'lessonId']);
        break;
      case 'saveScheduleItem':
        upsertRecord('Schedule', data, ['id']);
        break;
      case 'saveRecommendation':
        upsertRecord('Recommendations', data, ['id']);
        break;
      case 'deleteItem':
        deleteRecord(data.sheet, data.id);
        break;
      case 'resetProgress':
        resetProgress(data.userId, data.itemId, data.type);
        break;
    }
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Преобразует значение ячейки времени в строку "HH:mm" как в таблице.
 * Важно: в редакторе скрипта задайте часовой пояс (Настройки проекта → Часовой пояс),
 * например Asia/Dushanbe, чтобы 10:00 в таблице отображалось на сайте как 10:00.
 */
function formatTimeCell(val) {
  if (val == null || val === '') return '';
  if (typeof val === 'string' && /^\d{1,2}:\d{2}$/.test(val.trim())) return val.trim();
  if (val instanceof Date) {
    var h = val.getHours();
    var m = val.getMinutes();
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
  }
  if (typeof val === 'number') {
    var day = Math.floor(val);
    var frac = val - day;
    if (frac < 0 || frac >= 1) frac = frac - Math.floor(frac);
    var totalM = Math.round(frac * 24 * 60);
    var h = Math.floor(totalM / 60) % 24;
    var m = totalM % 60;
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
  }
  return String(val);
}

function getSheetData(name) {
  const sheet = SS.getSheetByName(name);
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return [];
  const headers = rows[0];
  const isSchedule = (name === 'Schedule');
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => {
      let val = row[i];
      if (typeof val === 'string' && (val.startsWith('[') || val.startsWith('{'))) {
        try { val = JSON.parse(val); } catch (e) {}
      }
      if (isSchedule && h === 'startTime') {
        val = formatTimeCell(val);
      }
      obj[h] = val;
    });
    return obj;
  });
}

function upsertRecord(sheetName, data, keyFields) {
  const sheet = SS.getSheetByName(sheetName);
  const headers = SCHEMA[sheetName];
  const rows = sheet.getDataRange().getValues();
  
  var normalize = function(v) { return v == null ? '' : String(v).trim(); };
  var rowIndex = -1;
  if (rows.length > 1) {
    for (var i = 1; i < rows.length; i++) {
      var match = true;
      for (var k = 0; k < keyFields.length; k++) {
        var key = keyFields[k];
        var colIdx = headers.indexOf(key);
        if (colIdx === -1) continue;
        if (normalize(rows[i][colIdx]) !== normalize(data[key])) { match = false; break; }
      }
      if (match) {
        rowIndex = i + 1;
        break;
      }
    }
  }

  var rowData = headers.map(function(h, colIdx) {
    var val = data[h];
    if (rowIndex > 0 && sheetName === 'Lessons' && (h === 'description' || h === 'coverImage') && (val === undefined || val === null)) {
      var existing = rows[rowIndex - 1][colIdx];
      return existing !== undefined && existing !== null ? (typeof existing === 'object' ? JSON.stringify(existing) : existing) : "";
    }
    if (val === undefined || val === null) return "";
    if (typeof val === 'object') return JSON.stringify(val);
    return val;
  });

  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    if (sheetName === 'Schedule') {
      var startTimeCol = headers.indexOf('startTime') + 1;
      if (startTimeCol > 0) sheet.getRange(rowIndex, startTimeCol).setNumberFormat('@');
    }
  } else {
    sheet.appendRow(rowData);
    if (sheetName === 'Schedule') {
      var lastRow = sheet.getLastRow();
      var startTimeCol = headers.indexOf('startTime') + 1;
      if (startTimeCol > 0) sheet.getRange(lastRow, startTimeCol).setNumberFormat('@');
    }
  }
}

function patchLessonContent(data) {
  var id = data && data.id;
  if (!id) throw new Error("patchLessonContent: id required");
  var sheet = SS.getSheetByName('Lessons');
  if (!sheet) return;
  var headers = SCHEMA['Lessons'];
  var rows = sheet.getDataRange().getValues();
  var idCol = headers.indexOf('id');
  if (idCol === -1) return;
  var rowIndex = -1;
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][idCol]).trim() === String(id).trim()) {
      rowIndex = i + 1;
      break;
    }
  }
  if (rowIndex < 1) return;
  if (data.description !== undefined && data.description !== null) {
    var descCol = headers.indexOf('description') + 1;
    if (descCol > 0) {
      var descVal = typeof data.description === 'object' ? JSON.stringify(data.description) : String(data.description);
      sheet.getRange(rowIndex, descCol).setValue(descVal);
    }
  }
  if (data.coverImage !== undefined && data.coverImage !== null) {
    var imgCol = headers.indexOf('coverImage') + 1;
    if (imgCol > 0) {
      var imgVal = typeof data.coverImage === 'object' ? JSON.stringify(data.coverImage) : String(data.coverImage);
      sheet.getRange(rowIndex, imgCol).setValue(imgVal);
    }
  }
}

function deleteRecord(sheetName, id) {
  const sheet = SS.getSheetByName(sheetName);
  if (!sheet) return;
  const rows = sheet.getDataRange().getValues();
  const idIdx = rows[0].indexOf('id');
  if (idIdx === -1) return;
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][idIdx]) == String(id)) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
}

function resetProgress(userId, itemId, type) {
  const sheetName = type === 'lesson' ? 'Results' : 'Submissions';
  const sheet = SS.getSheetByName(sheetName);
  if (sheet) {
    const rows = sheet.getDataRange().getValues();
    const uIdx = rows[0].indexOf('userId');
    const iIdx = rows[0].indexOf(type === 'lesson' ? 'lessonId' : 'taskId');
    if (uIdx !== -1 && iIdx !== -1) {
      for (let i = rows.length - 1; i >= 1; i--) {
        if (String(rows[i][uIdx]) == String(userId) && String(rows[i][iIdx]) == String(itemId)) {
          sheet.deleteRow(i + 1);
        }
      }
    }
  }

  // Если сбрасываем задание, нужно также удалить все связанные отзывы
  if (type === 'task') {
    const reviewSheet = SS.getSheetByName('Reviews');
    if (reviewSheet) {
      const rRows = reviewSheet.getDataRange().getValues();
      const rUIdx = rRows[0].indexOf('userId');
      const rTIdx = rRows[0].indexOf('taskId');
      if (rUIdx !== -1 && rTIdx !== -1) {
        for (let j = rRows.length - 1; j >= 1; j--) {
          if (String(rRows[j][rUIdx]) == String(userId) && String(rRows[j][rTIdx]) == String(itemId)) {
            reviewSheet.deleteRow(j + 1);
          }
        }
      }
    }
  }
}
