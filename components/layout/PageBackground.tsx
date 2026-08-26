export default function PageBackground() {
  return (
    <div className="fixed inset-0 bg-brand-gradient" aria-hidden="true">
      <div className="absolute inset-0 opacity-25">
        <div className="absolute top-0 -left-4 w-72 h-72 md:w-96 md:h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 md:w-96 md:h-96 bg-accent-teal/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 md:w-96 md:h-96 bg-accent-cyan/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>
    </div>
  );
}
