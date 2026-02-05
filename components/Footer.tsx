export default function Footer() {
  return (
    <footer className="w-full py-8 px-6 md:px-12 text-center border-t border-border">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-6" style={{ color: 'var(--color-text-secondary)' }}>
          <a href="#" className="hover:underline decoration-2 underline-offset-2 transition-all duration-200" style={{ textDecorationColor: 'var(--color-primary)' }}>
            关于我们
          </a>
          <a href="#" className="hover:underline decoration-2 underline-offset-2 transition-all duration-200" style={{ textDecorationColor: 'var(--color-primary)' }}>
            隐私政策
          </a>
          <a href="#" className="hover:underline decoration-2 underline-offset-2 transition-all duration-200" style={{ textDecorationColor: 'var(--color-primary)' }}>
            联系我们
          </a>
        </div>
        <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
          © {new Date().getFullYear()} Runner<span style={{ color: 'var(--color-secondary)' }}>Blade</span>. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
