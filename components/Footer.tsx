export default function Footer() {
  return (
    <footer className="px-6 py-6 glass-card border-t border-border text-muted text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs md:text-sm">
          © {new Date().getFullYear()} MindMapWithFlash. All rights reserved.
        </p>
        <nav className="flex gap-6" aria-label="Footer navigation">
          <a href="#" className="hover:text-primary transition-colors text-xs md:text-sm focus-ring rounded">
            Terms of Service
          </a>
          <a href="#" className="hover:text-primary transition-colors text-xs md:text-sm focus-ring rounded">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-primary transition-colors text-xs md:text-sm focus-ring rounded">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
