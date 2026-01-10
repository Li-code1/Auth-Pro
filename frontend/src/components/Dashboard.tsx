import { LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';

interface DashboardProps {
  user: { name: string; email: string };
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  return (
    <div className="max-w-4xl w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100 animate-in fade-in zoom-in duration-500">
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white">
            <LayoutDashboard size={24} />
          </div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">ADMIN PANEL</h1>
        </div>
        
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 text-slate-400 hover:text-red-500 font-bold text-sm transition-colors group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          SAIR
        </button>
      </header>

      <div className="flex flex-col items-center text-center space-y-6">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-indigo-600 border-4 border-white shadow-lg">
          <UserIcon size={48} />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-slate-900">
            Olá, <span className="text-indigo-600">{user.name || 'Usuário'}</span>!
          </h2>
          <p className="text-slate-500 font-medium italic">"{user.email}"</p>
        </div>

        <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-left">
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status da Conta</p>
            <p className="text-emerald-600 font-bold">Ativa & Protegida</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Último Acesso</p>
            <p className="text-slate-700 font-bold">Hoje, 2026</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nível de Acesso</p>
            <p className="text-indigo-600 font-bold">Administrador</p>
          </div>
        </div>
      </div>
    </div>
  );
}