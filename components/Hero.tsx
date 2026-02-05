import ClockWidget from "./ClockWidget"

export default function Hero() {
  return (
    <section className="w-full py-16 px-6 md:px-12 relative overflow-hidden">
      {/* 背景装饰 - 仅夜间模式显示 */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -z-10 opacity-30" style={{ backgroundColor: 'var(--color-primary)' }} />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl -z-10 opacity-20" style={{ backgroundColor: 'var(--color-secondary)' }} />

      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              让跑步训练
              <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                {" "}更科学
              </span>
            </h1>
            <p className="text-lg mb-8 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              专业的跑步工具集合，基于各项跑步专业教练理论，帮助跑者科学制定训练计划，提升运动表现。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a href="#tools" className="btn-primary text-center">
                开始使用
              </a>
              <a href="#about" className="btn-secondary text-center">
                了解更多
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <ClockWidget />
          </div>
        </div>
      </div>
    </section>
  )
}
