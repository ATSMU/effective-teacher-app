import React from 'react';
import { Lesson, Task, User, TestResult, TaskResult } from '../types';

interface ProgressViewProps {
  currentUser: User;
  lessons: Lesson[];
  tasks: Task[];
  lessonResults: Record<string, Record<string, TestResult>>;
  taskResults: Record<string, Record<string, TaskResult>>;
  onNavigateToLessons: () => void;
  onNavigateToTasks: () => void;
}

const ProgressView: React.FC<ProgressViewProps> = ({
  currentUser,
  lessons,
  tasks,
  lessonResults,
  taskResults,
  onNavigateToLessons,
  onNavigateToTasks,
}) => {
  const lessonsWithTests = lessons.filter((l) => (l.questions || []).length > 0);
  const myLessonRes = lessonResults[currentUser.id] || {};
  const myTaskRes = taskResults[currentUser.id] || {};
  const completedLessons = lessonsWithTests.filter((l) => myLessonRes[l.id]).length;
  const totalLessons = lessonsWithTests.length;
  const completedTasks = tasks.filter((t) => {
    const r = myTaskRes[t.id];
    return r && r.submitted && r.reviews && r.reviews.length > 0;
  }).length;
  const totalTasks = tasks.length;
  const totalItems = totalLessons + totalTasks;
  const itemsDone = completedLessons + completedTasks;
  const completionPercent = totalItems > 0 ? Math.round((itemsDone / totalItems) * 100) : 0;
  const diplomaThreshold = 50;
  const eligibleForDiploma = completionPercent >= diplomaThreshold;

  const daysLeft =
    currentUser.courseEndDate != null
      ? Math.max(0, Math.ceil((currentUser.courseEndDate - Date.now()) / (1000 * 60 * 60 * 24)))
      : null;
  const totalDays =
    currentUser.courseStartDate != null && currentUser.courseEndDate != null
      ? Math.max(1, Math.ceil((currentUser.courseEndDate - currentUser.courseStartDate) / (1000 * 60 * 60 * 24)))
      : null;

  return (
    <div className="space-y-6">
      <div className="px-2 sm:px-0">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Мой прогресс</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Обзор прохождения курса и сроков</p>
      </div>

      <div className="mx-2 sm:mx-0 space-y-4">
        {/* Общий прогресс */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-2xl p-4 sm:p-5 shadow-sm">
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
            Общий прогресс
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#10408A] rounded-full transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <span className="text-sm font-black text-slate-700 dark:text-slate-300 whitespace-nowrap">
              {completionPercent}%
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {itemsDone} из {totalItems} элементов выполнено
            {totalItems > 0 && (
              <span className="ml-2">
                {eligibleForDiploma
                  ? ' — порог для получения диплома достигнут (≥50%)'
                  : ` — до диплома осталось выполнить ещё ${Math.ceil((totalItems * diplomaThreshold) / 100) - itemsDone} элементов (≥50%)`}
              </span>
            )}
          </p>
        </div>

        {/* Занятия */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-2xl p-4 sm:p-5 shadow-sm">
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
            Занятия с тестами
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#10408A] rounded-full transition-all duration-500"
                style={{ width: `${totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0}%` }}
              />
            </div>
            <span className="text-sm font-black text-slate-700 dark:text-slate-300 whitespace-nowrap">
              {completedLessons}/{totalLessons}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {completedLessons === totalLessons
              ? 'Все занятия с тестами пройдены'
              : `Осталось пройти ${totalLessons - completedLessons} занятий`}
          </p>
          <button
            onClick={onNavigateToLessons}
            className="mt-3 text-sm font-semibold text-[#10408A] dark:text-[#5b9aff] hover:underline"
          >
            Перейти к занятиям →
          </button>
        </div>

        {/* Задания */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-2xl p-4 sm:p-5 shadow-sm">
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
            Задания (с проверкой)
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#10408A] rounded-full transition-all duration-500"
                style={{ width: `${totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%` }}
              />
            </div>
            <span className="text-sm font-black text-slate-700 dark:text-slate-300 whitespace-nowrap">
              {completedTasks}/{totalTasks}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {completedTasks === totalTasks
              ? 'Все задания сданы и проверены'
              : `Осталось сдать или дождаться проверки: ${totalTasks - completedTasks} заданий`}
          </p>
          <button
            onClick={onNavigateToTasks}
            className="mt-3 text-sm font-semibold text-[#10408A] dark:text-[#5b9aff] hover:underline"
          >
            Перейти к заданиям →
          </button>
        </div>

        {/* Сроки */}
        {typeof daysLeft === 'number' && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                До завершения курса
              </p>
              <p className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                {totalDays != null ? `${daysLeft} из ${totalDays} дн. осталось` : daysLeft > 0 ? `${daysLeft} дн.` : 'Сегодня последний день'}
              </p>
            </div>
            <div
              className={`px-3 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest ${
                daysLeft <= 7 ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
              }`}
            >
              {daysLeft <= 7 ? 'Срочно' : 'Время есть'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressView;
