import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { 
  Mail, 
  Lock, 
  AlertCircle, 
  ArrowRight, 
  User, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2 
} from 'lucide-react';

// 1. ESQUEMA DE VALIDAÇÃO COM ZOD
const authSchema = z.object({
  mode: z.enum(['login', 'register']),
  name: z.string().optional(),
  email: z.string().min(1, "E-mail obrigatório").email("Formato inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.mode === 'register') return !!data.name && data.name.length >= 3;
  return true;
}, { message: "Nome muito curto", path: ["name"] })
  .refine((data) => {
  if (data.mode === 'register') return data.password === data.confirmPassword;
  return true;
}, { message: "As senhas não coincidem", path: ["confirmPassword"] });

type AuthFormData = z.infer<typeof authSchema>;

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [msg, setMsg] = useState({ text: "", type: "" });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: { mode: 'login' }
  });

  // Alternar entre Login e Cadastro
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMsg({ text: "", type: "" });
    reset({ mode: !isLogin ? 'login' : 'register', email: '', password: '', name: '', confirmPassword: '' });
  };

  // ENVIO PARA O BACKEND
  const onSubmit = async (data: AuthFormData) => {
    setMsg({ text: "", type: "" });
    try {
      const path = isLogin ? "/login" : "/register";
      const res = await axios.post(`http://127.0.0.1:8000${path}`, {
        name: data.name,
        email: data.email,
        password: data.password
      });

      if (isLogin) {
        // SUCESSO NO LOGIN: Salva sessão e recarrega para o App.tsx mostrar o Dashboard
        localStorage.setItem("user_session", JSON.stringify(res.data.user));
        window.location.reload(); 
      } else {
        // SUCESSO NO CADASTRO
        setMsg({ text: "Conta criada! Redirecionando para login...", type: "success" });
        setTimeout(() => toggleMode(), 2000);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || "Erro ao conectar com o servidor";
      setMsg({ text: errorMessage, type: "error" });
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 transition-all duration-300">
      <div className="flex flex-col items-center mb-8">
        <div className={`p-4 rounded-2xl text-white mb-4 shadow-lg transition-colors duration-500 ${isLogin ? 'bg-indigo-600' : 'bg-emerald-500'}`}>
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">
          {isLogin ? "Acessar Conta" : "Criar Conta"}
        </h2>
        <p className="text-slate-400 font-medium">
          {isLogin ? "Bem-vindo de volta!" : "Junte-se ao nosso sistema"}
        </p>
      </div>

      {/* ALERTAS DE FEEDBACK */}
      {msg.text && (
        <div className={`mb-6 p-4 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
          msg.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
        }`}>
          {msg.type === 'success' ? <CheckCircle2 size={18}/> : <AlertCircle size={18}/>}
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register("mode")} />
        
        {!isLogin && (
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Nome Completo</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-slate-300" size={18} />
              <input 
                {...register("name")} 
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border-2 rounded-2xl outline-none transition-all ${errors.name ? 'border-red-200 focus:border-red-400' : 'border-transparent focus:border-emerald-500 focus:bg-white'}`} 
                placeholder="Ex: Liliane Santos" 
              />
            </div>
            {errors.name && <span className="text-red-500 text-[10px] font-bold ml-1 uppercase">{errors.name.message}</span>}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">E-mail</label>
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-slate-300" size={18} />
            <input 
              {...register("email")} 
              className={`w-full pl-11 pr-4 py-3 bg-slate-50 border-2 rounded-2xl outline-none transition-all ${errors.email ? 'border-red-200 focus:border-red-400' : 'border-transparent focus:border-indigo-500 focus:bg-white'}`} 
              placeholder="seu@email.com" 
            />
          </div>
          {errors.email && <span className="text-red-500 text-[10px] font-bold ml-1 uppercase">{errors.email.message}</span>}
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Senha</label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-slate-300" size={18} />
            <input 
              {...register("password")} 
              type="password" 
              className={`w-full pl-11 pr-4 py-3 bg-slate-50 border-2 rounded-2xl outline-none transition-all ${errors.password ? 'border-red-200 focus:border-red-400' : 'border-transparent focus:border-indigo-500 focus:bg-white'}`} 
              placeholder="••••••••" 
            />
          </div>
          {errors.password && <span className="text-red-500 text-[10px] font-bold ml-1 uppercase">{errors.password.message}</span>}
        </div>

        {!isLogin && (
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Confirmar Senha</label>
            <div className="relative">
              <RefreshCw className="absolute left-4 top-3.5 text-slate-300" size={18} />
              <input 
                {...register("confirmPassword")} 
                type="password" 
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border-2 rounded-2xl outline-none transition-all ${errors.confirmPassword ? 'border-red-200 focus:border-red-400' : 'border-transparent focus:border-emerald-500 focus:bg-white'}`} 
                placeholder="••••••••" 
              />
            </div>
            {errors.confirmPassword && <span className="text-red-500 text-[10px] font-bold ml-1 uppercase">{errors.confirmPassword.message}</span>}
          </div>
        )}

        <button 
          disabled={isSubmitting} 
          className={`w-full py-4 rounded-2xl text-white font-bold shadow-xl transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50 active:scale-95 ${
            isLogin ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100'
          }`}
        >
          {isSubmitting ? (
            <RefreshCw size={20} className="animate-spin" />
          ) : (
            <>
              {isLogin ? "ENTRAR NO SISTEMA" : "FINALIZAR CADASTRO"}
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <button 
        onClick={toggleMode} 
        className="w-full mt-8 text-xs font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]"
      >
        {isLogin ? "Criar nova conta" : "Já possuo uma conta"}
      </button>
    </div>
  );
}