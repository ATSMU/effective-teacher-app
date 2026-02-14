
// Ваш текущий URL (убедитесь, что он актуален после обновления скрипта)
const API_URL = "https://script.google.com/macros/s/AKfycbwkpCEr3ufvX8GuzIkJZeUwC1IVir1ICRZJHyD5EbeZXXmrpImiTySAtnUc9VxGRPIK/exec"

export const apiService = {
  /**
   * Получает все данные из таблицы. 
   */
  async fetchAll() {
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        cache: 'no-store',
      });
      if (!response.ok) {
        console.error("API: ответ сервера", response.status, response.statusText);
        return null;
      }
      const text = await response.text();
      if (!text || !text.trim()) {
        console.error("API: пустой ответ");
        return null;
      }
      try {
        const data = JSON.parse(text);
        if (data && typeof data === 'object' && !Array.isArray(data)) return data;
        console.error("API: ответ не объект (ожидаются users, lessons, ...)");
        return null;
      } catch (parseErr) {
        console.error("API: ответ не в формате JSON. Проверьте URL скрипта.", String(text).slice(0, 150));
        return null;
      }
    } catch (err) {
      console.error("Ошибка связи с таблицей:", err);
      return null;
    }
  },

  /**
   * Отправляет данные. JSON в body (text/plain) — скрипт принимает и JSON, и form-urlencoded.
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
