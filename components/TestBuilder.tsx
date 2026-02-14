
import React, { useState, useEffect } from 'react';
import { Question } from '../types';

interface TestBuilderProps {
  onAdd: (q: Question) => void;
  onClose: () => void;
  initialData?: Question;
}

const TestBuilder: React.FC<TestBuilderProps> = ({ onAdd, onClose, initialData }) => {
  const [text, setText] = useState(initialData?.text || '');
  const [options, setOptions] = useState(initialData?.options || ['', '', '', '']);
  const [correctIdx, setCorrectIdx] = useState(initialData?.correctAnswerIndex ?? 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text || options.some(o => !o.trim())) {
      alert("Пожалуйста, заполните все поля");
      return;
    }
    onAdd({
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      text,
      options,
      correctAnswerIndex: correctIdx
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900">{initialData ? 'Редактировать вопрос' : 'Новый вопрос'}</h3>
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Вопрос</label>
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Текст вопроса..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Варианты ответов</label>
              {options.map((opt, idx) => (
                <div key={idx} className={`flex items-center gap-3 p-2 rounded-lg border-2 transition-all ${correctIdx === idx ? 'border-indigo-500 bg-indigo-50/30' : 'border-transparent'}`}>
                  <input 
                    type="radio" 
                    name="correct" 
                    checked={correctIdx === idx}
                    onChange={() => setCorrectIdx(idx)}
                    className="w-5 h-5 text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                  />
                  <input 
                    type="text" 
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...options];
                      newOpts[idx] = e.target.value;
                      setOptions(newOpts);
                    }}
                    placeholder={`Вариант ${idx + 1}`}
                    className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none bg-white"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-slate-50 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Отмена</button>
            <button type="submit" className="flex-1 py-3 text-sm font-bold bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
              {initialData ? 'Сохранить изменения' : 'Добавить вопрос'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestBuilder;
