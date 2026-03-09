
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  users: User[];
  loadError?: string | null;
  onRetry?: () => void;
  isLoading?: boolean;
}

type LoginTab = 'admin' | 'teacher';

const Login: React.FC<LoginProps> = ({ onLogin, users, loadError, onRetry, isLoading }) => {
  const [activeTab, setActiveTab] = useState<LoginTab>('teacher');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (selectedUser && String(selectedUser.password) === password) {
      onLogin(selectedUser);
    } else {
      setError('Неверный пароль');
      const el = document.getElementById('password-input');
      el?.classList.add('animate-shake');
      setTimeout(() => el?.classList.remove('animate-shake'), 500);
    }
  };

  const getInitial = (name: any) => {
    const safeName = String(name || '');
    return safeName.length === 0 ? '?' : safeName.charAt(0).toUpperCase();
  };

  const usersByRole = activeTab === 'admin'
    ? users.filter(u => u.role === 'admin')
    : users.filter(u => u.role === 'listener');

  const filteredUsers = usersByRole.filter(u => {
    const name = String(u.name || '').toLowerCase();
    const login = String(u.login || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || login.includes(query);
  });

  const switchTab = (tab: LoginTab) => {
    setActiveTab(tab);
    setSelectedUser(null);
    setPassword('');
    setError('');
    setIsDropdownOpen(false);
    setSearchQuery('');
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setIsDropdownOpen(false);
    setSearchQuery('');
    setError('');
    setTimeout(() => passwordInputRef.current?.focus(), 100);
  };

  const placeholderByTab = activeTab === 'admin' ? 'Выберите администратора...' : 'Выберите преподавателя...';

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 font-sans">
      <div className="max-w-sm mx-auto px-4 pt-6 pb-10 animate-in fade-in duration-500">

        {/* Заголовок */}
        <div className="mb-5">
          <h2 className="text-2xl font-black text-[#0E1C1C] dark:text-white">Личный кабинет</h2>
          <p className="text-slate-400 dark:text-slate-500 text-sm font-medium mt-1">Выберите профиль для входа</p>
        </div>

        {/* Вкладки */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 mb-4">
          <button
            type="button"
            onClick={() => switchTab('admin')}
            className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all ${activeTab === 'admin' ? 'bg-white dark:bg-slate-700 text-[#10408A] shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
          >
            Админ
          </button>
          <button
            type="button"
            onClick={() => switchTab('teacher')}
            className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all ${activeTab === 'teacher' ? 'bg-white dark:bg-slate-700 text-[#10408A] shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
          >
            Преподаватель
          </button>
        </div>

        {/* Ошибка загрузки */}
        {loadError && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-amber-800 font-bold text-sm">{loadError}</p>
            <p className="text-amber-600 text-xs mt-1">Убедитесь, что скрипт таблицы Google опубликован и URL актуален.</p>
            {onRetry && (
              <button type="button" onClick={onRetry} disabled={isLoading}
                className="mt-3 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-bold hover:bg-amber-600 disabled:opacity-50 transition-all">
                {isLoading ? 'Загрузка...' : 'Повторить'}
              </button>
            )}
          </div>
        )}

        {!loadError && !isLoading && users.length === 0 && (
          <div className="mb-4 p-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl">
            <p className="text-slate-700 dark:text-slate-300 font-bold text-sm">Список профилей пуст</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">В листе «Users» нет строк или данные ещё не загрузились.</p>
            {onRetry && (
              <button type="button" onClick={onRetry} className="mt-3 px-4 py-2 bg-slate-600 text-white rounded-lg text-sm font-bold hover:bg-slate-700 transition-all">
                Повторить
              </button>
            )}
          </div>
        )}

        {!loadError && !isLoading && users.length > 0 && usersByRole.length === 0 && (
          <div className="mb-4 p-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl">
            <p className="text-slate-700 dark:text-slate-300 font-bold text-sm">
              {activeTab === 'admin' ? 'Нет администраторов' : 'Нет преподавателей'}
            </p>
          </div>
        )}

        {isLoading && (
          <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">Загрузка профилей...</p>
          </div>
        )}

        {/* Dropdown выбора пользователя */}
        {usersByRole.length > 0 && (
          <div className="space-y-3">
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${isDropdownOpen ? 'border-[#10408A] bg-white dark:bg-slate-800 ring-4 ring-[#10408A]/5' : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-600'}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm flex-shrink-0 ${selectedUser ? 'bg-[#10408A] text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-400'}`}>
                  {selectedUser ? getInitial(selectedUser.name) : '?'}
                </div>
                <span className={`flex-1 font-semibold text-sm ${selectedUser ? 'text-[#0E1C1C] dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                  {selectedUser ? selectedUser.name : placeholderByTab}
                </span>
                <svg className={`w-4 h-4 text-slate-300 transition-transform flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-600 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-2 border-b border-slate-100 dark:border-slate-700">
                    <input
                      type="text"
                      placeholder="Поиск по имени..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-[#10408A] text-sm font-medium"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {filteredUsers.length === 0 && (
                      <p className="text-center text-slate-400 text-sm py-4">Ничего не найдено</p>
                    )}
                    {filteredUsers.map(user => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleSelectUser(user)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#10408A]/5 transition-colors text-left group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-600 flex items-center justify-center font-black text-xs text-[#0E1C1C] dark:text-white group-hover:bg-[#10408A] group-hover:text-white transition-all flex-shrink-0">
                          {getInitial(user.name)}
                        </div>
                        <p className="font-semibold text-sm text-[#0E1C1C] dark:text-white">{user.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Пароль */}
            <form onSubmit={handleSubmit} className={`space-y-3 transition-all duration-300 ${selectedUser ? 'opacity-100' : 'opacity-0 pointer-events-none h-0 overflow-hidden'}`}>
              <input
                id="password-input"
                ref={passwordInputRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 dark:text-white border-2 border-transparent rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:ring-4 focus:ring-[#10408A]/5 focus:border-[#10408A] outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-500 font-black text-xl tracking-[0.2em] text-center"
                required
              />
              {error && (
                <div className="p-3 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold text-center animate-in slide-in-from-top-2">
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="w-full py-3 bg-[#10408A] text-white rounded-xl font-black shadow-lg shadow-[#10408A]/20 hover:bg-[#0d336e] transition-all active:scale-95 uppercase tracking-widest text-sm"
              >
                Войти
              </button>
            </form>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
          border-color: #ef4444 !important;
        }
      `}</style>
    </div>
  );
};

export default Login;
