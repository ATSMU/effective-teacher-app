
// URL берётся из .env.local (APPS_SCRIPT_URL). Файл исключён из git через *.local в .gitignore.
const API_URL: string = process.env.APPS_SCRIPT_URL || '';

// Cache keys & TTLs
const LIGHT_CACHE_KEY = 'edugen_light_v1';
const LIGHT_CACHE_TTL = 5 * 60 * 1000;        // 5 min — list data
const LESSON_CACHE_PREFIX = 'edugen_lesson_v1_';
const LESSON_CACHE_TTL = 15 * 60 * 1000;       // 15 min — individual full lessons
const SUBMISSION_CACHE_PREFIX = 'edugen_sub_v1_';
const SUBMISSION_CACHE_TTL = 10 * 60 * 1000;   // 10 min — individual submissions with files

function parseJSON(text: string): unknown | null {
  try {
    const data = JSON.parse(text);
    return data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

function readCache<T>(key: string, ttl: number): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw) as { data: T; ts: number };
    if (Date.now() - ts < ttl) return data;
    localStorage.removeItem(key);
  } catch { /* ignore */ }
  return null;
}

function writeCache(key: string, data: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch { /* quota exceeded — ignore */ }
}

export const apiService = {
  /**
   * Получает лёгкую версию данных (без base64 файлов в занятиях и submissions).
   * При наличии свежего кэша возвращает его мгновенно и обновляет кэш в фоне.
   */
  async fetchAll() {
    const cached = readCache<unknown>(LIGHT_CACHE_KEY, LIGHT_CACHE_TTL);
    if (cached) {
      // Фоновое обновление, не блокируем UI
      this._doFetchLight().then(fresh => {
        if (fresh) writeCache(LIGHT_CACHE_KEY, fresh);
      }).catch(() => {});
      return cached;
    }
    const data = await this._doFetchLight();
    if (data) writeCache(LIGHT_CACHE_KEY, data);
    return data;
  },

  async _doFetchLight(): Promise<unknown | null> {
    try {
      const response = await fetch(`${API_URL}?light=1`, { method: 'GET', cache: 'no-store' });
      if (!response.ok) {
        console.error('API: ответ сервера', response.status, response.statusText);
        return null;
      }
      const text = await response.text();
      if (!text?.trim()) { console.error('API: пустой ответ'); return null; }
      const data = parseJSON(text);
      if (!data) { console.error('API: ответ не в формате JSON', String(text).slice(0, 150)); }
      return data;
    } catch (err) {
      console.error('Ошибка связи с таблицей:', err);
      return null;
    }
  },

  /** Инвалидирует кэш списка (вызывать после любого изменения данных). */
  invalidateLightCache(): void {
    try { localStorage.removeItem(LIGHT_CACHE_KEY); } catch { /* ignore */ }
  },

  /**
   * Получает полное занятие со всеми файлами и coverImage.
   * Первый запрос идёт в сеть, повторные — из кэша.
   */
  async getLessonFull(id: string): Promise<unknown | null> {
    const cached = readCache<unknown>(LESSON_CACHE_PREFIX + id, LESSON_CACHE_TTL);
    if (cached) return cached;
    try {
      const response = await fetch(`${API_URL}?action=getLessonFull&id=${encodeURIComponent(id)}`, {
        method: 'GET',
        cache: 'no-store',
      });
      if (!response.ok) return null;
      const text = await response.text();
      const json = parseJSON(text) as { lesson?: unknown } | null;
      const lesson = json?.lesson ?? null;
      if (lesson) writeCache(LESSON_CACHE_PREFIX + id, lesson);
      return lesson;
    } catch (err) {
      console.error('Ошибка getLessonFull:', err);
      return null;
    }
  },

  /** Инвалидирует кэш конкретного занятия (вызывать после его сохранения). */
  invalidateLessonCache(id: string): void {
    try { localStorage.removeItem(LESSON_CACHE_PREFIX + id); } catch { /* ignore */ }
  },

  /**
   * Получает полный submission со списком файлов студента.
   */
  async getSubmissionFull(userId: string, taskId: string): Promise<unknown | null> {
    const cacheKey = `${SUBMISSION_CACHE_PREFIX}${userId}_${taskId}`;
    const cached = readCache<unknown>(cacheKey, SUBMISSION_CACHE_TTL);
    if (cached) return cached;
    try {
      const url = `${API_URL}?action=getSubmissionFull&userId=${encodeURIComponent(userId)}&taskId=${encodeURIComponent(taskId)}`;
      const response = await fetch(url, { method: 'GET', cache: 'no-store' });
      if (!response.ok) return null;
      const text = await response.text();
      const json = parseJSON(text) as { submission?: unknown } | null;
      const sub = json?.submission ?? null;
      if (sub) writeCache(cacheKey, sub);
      return sub;
    } catch (err) {
      console.error('Ошибка getSubmissionFull:', err);
      return null;
    }
  },

  /** Инвалидирует кэш submission (вызывать после сдачи/оценки работы). */
  invalidateSubmissionCache(userId: string, taskId: string): void {
    try { localStorage.removeItem(`${SUBMISSION_CACHE_PREFIX}${userId}_${taskId}`); } catch { /* ignore */ }
  },

  /**
   * Отправляет данные. JSON в body (text/plain).
   */
  async post(action: string, data: any) {
    const payload = JSON.stringify({ action, data });
    await fetch(API_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: payload,
    });
    return { success: true };
  }
};
