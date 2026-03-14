export default function TeamSection() {
  return (
    <section className="py-12 px-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-center">
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Governance</h2>
      <p className="text-2xl font-bold text-slate-800 mb-2">Built by the Community</p>
      <p className="text-slate-500 max-w-md mx-auto mb-6">
        Bigview is an open-source treasury protocol. Decisions are made by STX holders, not a centralized board.
      </p>
      <div className="flex justify-center gap-4">
        <a href="https://github.com" className="text-sm font-semibold text-blue-600 hover:underline">View Source</a>
        <span className="text-slate-300">|</span>
        <a href="#" className="text-sm font-semibold text-blue-600 hover:underline">Read Docs</a>
      </div>
    </section>
  );
}