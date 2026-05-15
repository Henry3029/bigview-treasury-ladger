// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="flex justify-between items-center py-10 border-t border-white/10 text-sm text-gray-500 max-w-4xl mx-auto px-6">
      <div className="flex gap-6">
        <span>Bigview Ledger</span>
        <a href="#" className="hover:text-white underline">Terms of Service</a>
      </div>
      <div className="flex gap-4">
        {['𝕏', 'Discord', 'TG', 'Docs'].map(link => (
          <div key={link} className="w-8 h-8 bg-white/5 rounded-md flex items-center justify-center hover:bg-white/10 cursor-pointer">
            {link}
          </div>
        ))}
      </div>
    </footer>
  );
}