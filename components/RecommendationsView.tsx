import React, { useState } from 'react';
import { Recommendation } from '../types';

interface RecommendationsViewProps {
  recommendations: Recommendation[];
  isAdmin: boolean;
  currentUserName: string;
  onAddRecommendation?: (title: string, content: string, authorName: string) => void;
  onDeleteRecommendation?: (id: string) => void;
}

const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  recommendations,
  isAdmin,
  currentUserName,
  onAddRecommendation,
  onDeleteRecommendation,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formAuthor, setFormAuthor] = useState(currentUserName);

  const sorted = [...recommendations].sort((a, b) => b.createdAt - a.createdAt);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = formTitle.trim();
    const content = formContent.trim();
    const author = formAuthor.trim() || currentUserName;
    if (!title || !content || !onAddRecommendation) return;
    onAddRecommendation(title, content, author);
    setFormTitle('');
    setFormContent('');
    setFormAuthor(currentUserName);
    setShowForm(false);
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2 sm:px-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Рекомендации</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Советы кураторов по прохождению курса</p>
        </div>
        {isAdmin && onAddRecommendation && (
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="bg-[#10408A] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#0d336e] transition-all shadow-md active:scale-95 text-sm sm:text-base"
          >
            {showForm ? 'Отмена' : 'Добавить рекомендацию'}
          </button>
        )}
      </div>

      {isAdmin && showForm && onAddRecommendation && (
        <form
          onSubmit={handleSubmit}
          className="mx-2 sm:mx-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Новая рекомендация</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Заголовок</label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#10408A] focus:border-transparent"
              placeholder="Например: Как готовиться к тестам"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Текст</label>
            <textarea
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#10408A] focus:border-transparent resize-y"
              placeholder="Рекомендация от куратора..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Автор (куратор)</label>
            <input
              type="text"
              value={formAuthor}
              onChange={(e) => setFormAuthor(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#10408A] focus:border-transparent"
              placeholder="ФИО куратора"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-[#10408A] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#0d336e] transition-all"
            >
              Опубликовать
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 rounded-xl font-semibold border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            >
              Отмена
            </button>
          </div>
        </form>
      )}

      <div className="mx-2 sm:mx-0 space-y-4">
        {sorted.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-2xl p-8 sm:p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Пока нет рекомендаций</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Рекомендации от кураторов по прохождению курса будут появляться здесь.
            </p>
          </div>
        ) : (
          sorted.map((rec) => (
            <article
              key={rec.id}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-2xl p-4 sm:p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{rec.title}</h3>
                  {rec.authorName && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Куратор: {rec.authorName}</p>
                  )}
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 whitespace-pre-wrap">{rec.content}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">{formatDate(rec.createdAt)}</p>
                </div>
                {isAdmin && onDeleteRecommendation && (
                  <button
                    type="button"
                    onClick={() => onDeleteRecommendation(rec.id)}
                    className="shrink-0 p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
                    title="Удалить"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default RecommendationsView;
