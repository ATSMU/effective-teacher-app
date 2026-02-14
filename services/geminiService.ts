import { GoogleGenAI, Type } from '@google/genai';
import { Question } from '../types';

const GEMINI_MODEL = 'gemini-2.0-flash';

function getApiKey(): string {
  return (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || (import.meta as unknown as { env?: { VITE_GEMINI_API_KEY?: string } }).env?.VITE_GEMINI_API_KEY || '';
}

export const generateTests = async (topic: string, description: string, count: number = 5): Promise<Question[]> => {
  const apiKey = getApiKey();
  if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
    throw new Error(
      'Не задан API-ключ Google Gemini. Добавьте GEMINI_API_KEY в файл .env.local. Ключ можно получить здесь: https://aistudio.google.com/apikey'
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Создай ${count} вопросов с выбором одного ответа для проверки знаний по теме занятия.
Тема: ${topic}
Описание/материал: ${description}

Требования:
- Каждый вопрос должен иметь ровно 4 варианта ответа.
- Один из вариантов — правильный (correctAnswerIndex от 0 до 3).
- Вопросы и варианты ответов — на русском языке.
- Вопросы должны проверять понимание материала, а не только факты.

Верни только валидный JSON-массив объектов с полями: text (строка — текст вопроса), options (массив из 4 строк — варианты ответов), correctAnswerIndex (число 0–3).`;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING, description: 'Текст вопроса' },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Ровно 4 варианта ответа',
              },
              correctAnswerIndex: {
                type: Type.INTEGER,
                description: 'Индекс правильного ответа (0–3)',
              },
            },
            required: ['text', 'options', 'correctAnswerIndex'],
          },
        },
      },
    });

    const rawText = response.text?.trim();
    if (!rawText) {
      throw new Error('Пустой ответ от модели. Попробуйте ещё раз или уменьшите количество вопросов.');
    }

    let rawQuestions: Array<{ text?: string; options?: string[]; correctAnswerIndex?: number }>;
    try {
      rawQuestions = JSON.parse(rawText);
    } catch {
      const jsonMatch = rawText.match(/\[[\s\S]*\]/);
      if (jsonMatch) rawQuestions = JSON.parse(jsonMatch[0]);
      else throw new Error('Не удалось разобрать ответ модели как JSON.');
    }

    if (!Array.isArray(rawQuestions) || rawQuestions.length === 0) {
      throw new Error('Модель не вернула список вопросов. Попробуйте изменить описание или количество.');
    }

    return rawQuestions.map((q) => {
      const options = Array.isArray(q.options) ? q.options.slice(0, 4) : [];
      const correctIndex = typeof q.correctAnswerIndex === 'number' && q.correctAnswerIndex >= 0 && q.correctAnswerIndex < 4
        ? q.correctAnswerIndex
        : 0;
      return {
        id: Math.random().toString(36).slice(2, 11),
        text: typeof q.text === 'string' ? q.text : 'Вопрос без текста',
        options: options.length >= 2 ? options : ['Да', 'Нет', '—', '—'],
        correctAnswerIndex: correctIndex,
      };
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('API key') || message.includes('401') || message.includes('403')) {
      throw new Error('Неверный или недействительный API-ключ Gemini. Проверьте GEMINI_API_KEY в .env.local.');
    }
    if (message.includes('429') || message.includes('quota')) {
      throw new Error('Превышен лимит запросов Gemini API. Подождите или проверьте квоты в Google AI Studio.');
    }
    throw err;
  }
};
