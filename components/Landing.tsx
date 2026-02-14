
import React from 'react';

interface LandingProps {
  onEnter: () => void;
}

const Landing: React.FC<LandingProps> = ({ onEnter }) => {
  const topics = [
    { title: "Андрогогика", icon: (<><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></>) },
    { title: "Методы активного обучения", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /> },
    { title: "Эффективная презентация", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /> },
    { title: "ИИ в медицине", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /> },
    { title: "Методы оценки знаний", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /> },
    { title: "Рефлексия и лидерство", icon: (<><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></>) },
    { title: "Hard и Soft навыки", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.675.337a4 4 0 01-2.574.344l-3.147-.629a2 2 0 01-1.565-1.565l-.629-3.147a4 4 0 01.344-2.574l.337-.675a6 6 0 00.517-3.86l-.477-2.387a2 2 0 00-.547-1.022L15.428 19.428z" /> },
    { title: "Проблемы высшей школы", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> },
  ];

  const people = [
    {
      title: "Преподаватели вузов",
      text: "Развивайте педагогические компетенции и современные методы подачи материала.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80",
      alt: "Преподаватель",
    },
    {
      title: "Кураторы и наставники",
      text: "Укрепляйте навыки менторства и работы с группами студентов.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80",
      alt: "Куратор",
    },
    {
      title: "Слушатели программы",
      text: "Практикуйтесь на платформе: занятия, тесты и обратная связь в одном месте.",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80",
      alt: "Слушатели программы — преподаватели на занятии",
    },
  ];

  const universityLogoUrl = "https://www.tajmedun.tj/bitrix/templates/tajmedun/images/logo_new2.png";
  const heroImageUrl = "https://www.tajmedun.tj/upload/iblock/05d/52326262333_ab3dba849e_o.jpg";

  return (
    <div className="min-h-screen bg-white font-sans text-[#0E1C1C] overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl z-50 border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={universityLogoUrl} alt="Logo" className="w-9 h-9 sm:w-10 sm:h-10 object-contain" />
            <span className="font-black text-sm sm:text-lg tracking-tight uppercase text-[#0E1C1C]">Эффективный преподаватель</span>
          </div>
          <button
            onClick={onEnter}
            className="bg-[#10408A] text-white px-5 sm:px-8 py-2.5 rounded-full font-bold hover:bg-[#0d336e] transition-all shadow-lg shadow-[#10408A]/20 text-sm hover:scale-105 active:scale-95"
          >
            Войти
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 sm:pt-32 pb-16 sm:pb-24 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-[#10408A]/[0.03] -z-10" />
        <div className="absolute top-0 right-0 w-[80%] max-w-2xl h-[70%] bg-[#10408A]/5 rounded-bl-[40%] blur-3xl -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#10408A]/10 text-[#10408A] rounded-full text-xs font-bold tracking-widest uppercase">
                <span className="w-2 h-2 bg-[#10408A] rounded-full animate-pulse" />
                ТГМУ им. Абуали ибни Сино
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] tracking-tight text-[#0E1C1C]">
                Новый стандарт{' '}
                <span className="text-[#10408A]">медицинского</span>
                <br />
                образования
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 max-w-xl leading-relaxed">
                Практико-ориентированный курс для преподавателей вузов. Расписание, занятия, тесты и обратная связь — всё на одной платформе.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={onEnter}
                  className="bg-[#10408A] text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-[#0d336e] transition-all shadow-xl shadow-[#10408A]/25 hover:shadow-2xl hover:scale-[1.02] active:scale-95"
                >
                  Начать обучение →
                </button>
                <a href="#topics" className="inline-flex items-center gap-2 text-slate-600 font-semibold hover:text-[#10408A] transition-colors">
                  Узнать о темах
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                </a>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-200/50">
                <img
                  src={heroImageUrl}
                  alt="Занятие в университете"
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              </div>
              <div className="absolute -bottom-4 -left-4 sm:left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-slate-100">
                <img src={universityLogoUrl} alt="ТГМУ" className="w-12 h-12 object-contain" />
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Партнёр программы</p>
                  <p className="text-sm font-black text-[#0E1C1C]">ТГМУ им. Абуали ибни Сино</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Для кого — люди */}
      <section className="py-20 sm:py-28 bg-[#0E1C1C] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">Для кого эта программа</h2>
            <div className="w-20 h-1 bg-[#10408A] rounded-full mx-auto" />
            <p className="mt-6 text-slate-400 text-lg max-w-2xl mx-auto">Преподаватели и кураторы, которые хотят усилить свой подход к обучению.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {people.map((item, i) => (
              <div
                key={i}
                className="group bg-white/5 backdrop-blur border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-[#10408A]/30 transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 sm:p-8">
                  <h3 className="text-xl font-black text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm sm:text-base leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Темы обучения */}
      <section id="topics" className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#0E1C1C]">
                Темы <span className="text-[#10408A]">обучения</span>
              </h2>
              <div className="w-16 h-1.5 bg-[#10408A] rounded-full mt-4" />
            </div>
            <p className="text-slate-600 text-lg max-w-md">Ключевые модули программы развития педагогических компетенций.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {topics.map((topic, i) => (
              <div
                key={i}
                className="group bg-white p-6 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#10408A]/20 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-slate-100 text-[#10408A] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#10408A] group-hover:text-white transition-colors duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">{topic.icon}</svg>
                </div>
                <h3 className="text-base font-bold text-[#0E1C1C] leading-snug">{topic.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA блок с атмосферой */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0E1C1C]/85" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-6">
            Готовы изменить свой подход к преподаванию?
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-xl mx-auto">
            Войдите на платформу и начните обучение по программе «Эффективный преподаватель».
          </p>
          <button
            onClick={onEnter}
            className="bg-[#10408A] text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-[#0d336e] transition-all shadow-2xl hover:scale-105 active:scale-95 uppercase tracking-wider"
          >
            Войти на платформу
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#0E1C1C] text-slate-400 text-center text-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <img src={universityLogoUrl} alt="" className="w-8 h-8 object-contain opacity-80" />
          <span>ТГМУ им. Абуали ибни Сино · Программа «Эффективный преподаватель»</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
