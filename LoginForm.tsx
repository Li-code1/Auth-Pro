import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

// Esquema de validação (Aplicação de conceitos de Clean Code e Tipagem)
const authSchema = z.object({
  email: z.string().min(1, "O e-mail é obrigatório").email("Formato de e-mail inválido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

type AuthFormData = z.infer<typeof authSchema>;

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  const handleAuth = async (data: AuthFormData) => {
    // Simulando um delay de rede (Conceito de UX: Feedback de carregamento)
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("Usuário Validado:", data);
    alert("Login realizado com sucesso!");
  };

  return (
    <div className="max-w-md w-full bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-100">
      <div className="flex flex-col items-center mb-10">
        <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200 mb-4">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-3xl font-black text-slate-800">Bem-vindo</h2>
        <p className="text-slate-400 font-medium">Proteja seus dados, acesse sua conta</p>
      </div>

      <form onSubmit={handleSubmit(handleAuth)} className="space-y-5">
        {/* Input de E-mail */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">E-mail Corporativo</label>
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-slate-300" size={20} />
            <input 
              {...register("email")}
              className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 rounded-2xl outline-none transition-all ${
                errors.email ? 'border-red-200 focus:border-red-400' : 'border-transparent focus:border-indigo-500 focus:bg-white'
              }`}
              placeholder="exemplo@empresa.com"
            />
          </div>
          {errors.email && (
            <p className="flex items-center gap-1 text-red-500 text-xs font-semibold animate-pulse">
              <AlertCircle size={14} /> {errors.email.message}
            </p>
          )}
        </div>

        {/* Input de Senha */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Senha de Acesso</label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-slate-300" size={20} />
            <input 
              {...register("password")}
              type="password"
              className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 rounded-2xl outline-none transition-all ${
                errors.password ? 'border-red-200 focus:border-red-400' : 'border-transparent focus:border-indigo-500 focus:bg-white'
              }`}
              placeholder="••••••••"
            />
          </div>
          {errors.password && (
            <p className="flex items-center gap-1 text-red-500 text-xs font-semibold">
              <AlertCircle size={14} /> {errors.password.message}
            </p>
          )}
        </div>

        <button 
          disabled={isSubmitting}
          className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group disabled:opacity-70 shadow-xl"
        >
          {isSubmitting ? "VALIDANDO..." : "ENTRAR NO SISTEMA"}
          {!isSubmitting && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
        </button>
      </form>
    </div>
  );
}