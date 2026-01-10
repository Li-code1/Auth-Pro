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

// 1. ESQUEMA DE VALIDAÇÃO (ZOD)
// O .refine permite criar validações customizadas como a confirmação de senha
const authSchema = z.object({
  mode: z.enum(['login', 'register']),
  name: z.string().optional(),
  email: z.string().min(1, "O e-mail é obrigatório").email("Formato de e-mail inválido"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.mode === 'register') {
    return !!data.name && data.name.length >= 3;
  }
  return true;
}, {
  message: "O nome deve ter pelo menos 3 caracteres",
  path: ["name"],
}).refine((data) => {
  if (data.mode === 'register') {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type AuthFormData = z.infer<typeof authSchema>;

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  // 2. CONFIGURAÇÃO DO HOOK FORM
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: { mode: 'login' }
  });

  // Alterna entre Login e Registro e limpa o formulário
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setSuccessMessage("");
    reset({ mode: !isLogin ? 'login' : 'register', email: '', password: '', name: '', confirmPassword: '' });
  };

  // 3. ENVIO DOS DADOS PARA O BACKEND (AXIOS)
  const onSubmit = async (data: AuthFormData) => {
    try {
      const endpoint = isLogin ? "/login" : "/register";
      const response = await axios.post(`http://127.0.0.1:8000${endpoint}`, {
        name: data.name,
        email: data.email,
        password: data.password
      });

      setSuccessMessage(response.data.message);

      if (isLogin) {
        // Conceito de Sessão: Salva o usuário no navegador
        localStorage.setItem("user_session", JSON.stringify(response.data.user));
        // Aqui você poderia redirecionar o usuário: window.location.href = "/dashboard";
      } else {
        // Se for cadastro, aguarda 2s e joga para o login
        setTimeout(() => toggleMode(), 2000);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || "Erro ao conectar com o servidor";
      alert(errorMsg);
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 transition-all duration-500">
      
      {/* HEADER DINÂMICO */}
      <div className="flex flex-col items-center mb-8">
        <div className={`p-4 rounded-2xl text-white shadow-lg mb-4 transition-colors ${isLogin ? 'bg-indigo-600' : 'bg-emerald-500'}`}>
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">
          {isLogin ? "Bem-vindo" : "Nova Conta"}
        </h2>
        <p className="text-slate-400 font-medium">
          {isLogin ? "Acesse o painel administrativo" : "Crie seu acesso corporativo"}
        </p>
      </div>

      {/* MENSAGEM DE SUCESSO */}
      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-center gap-2 text-sm font-bold animate-bounce">
          <CheckCircle2 size={18} /> {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Input Oculto para o modo (Login/Register) */}
        <input type="hidden" {...register("mode")} />

        {/* CAMPO: NOME (Só aparece no Registro) */}
        {!isLogin && (
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nome Completo</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-slate-300" size={20} />
              <input 
                {...register("name")}
                className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 rounded-2xl outline-none transition-all ${errors.name ? 'border-red-300' : 'border-transparent focus:border-emerald-500 focus:bg-white'}`}
                placeholder="Seu nome"
              />
            </div>
            {errors.name && <p className="text-red-500 text-[10px] font-bold ml-1 uppercase">{errors.name.message}</p>}
          </div>
        )}

        {/* CAMPO: E-MAIL */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">E-mail Corporativo</label>
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-slate-300" size={20} />
            <input 
              {...register("email")}
              className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 rounded-2xl outline-none transition-all ${errors.email ? 'border-red-300' : 'border-transparent focus:border-indigo-500 focus:bg-white'}`}
              placeholder="exemplo@empresa.com"
            />
          </div>
          {errors.email && <p className="text-red-500 text-[10px] font-bold ml-1 uppercase">{errors.email.message}</p>}
        </div>

        {/* CAMPOS: SENHA E CONFIRMAÇÃO */}
        <div className={`grid gap-4 ${isLogin ? 'grid-cols-1' : 'grid-cols-1'}`}>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-300" size={20} />
              <input 
                {...register("password")}
                type="password"
                className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 rounded-2xl outline-none transition-all ${errors.password ? 'border-red-300' : 'border-transparent focus:border-indigo-500 focus:bg-white'}`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-red-500 text-[10px] font-bold ml-1 uppercase">{errors.password.message}</p>}
          </div>

          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Confirmar Senha</label>
              <div className="relative">
                <RefreshCw className="absolute left-4 top-3.5 text-slate-300" size={20} />
                <input 
                  {...register("confirmPassword")}
                  type="password"
                  className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 rounded-2xl outline-none transition-all ${errors.confirmPassword ? 'border-red-300' : 'border-transparent focus:border-emerald-500 focus:bg-white'}`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-[10px] font-bold ml-1 uppercase">{errors.confirmPassword.message}</p>}
            </div>
          )}
        </div>

        {/* BOTÃO DE AÇÃO */}
        <button 
          disabled={isSubmitting}
          className={`w-full text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group shadow-xl mt-6 disabled:opacity-50 ${isLogin ? 'bg-slate-900 hover:bg-indigo-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}
        >
          {isSubmitting ? "PROCESSANDO..." : isLogin ? "ENTRAR NO SISTEMA" : "CRIAR MINHA CONTA"}
          {!isSubmitting && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
        </button>
      </form>

      {/* BOTÃO PARA ALTERNAR MODO */}
      <button 
        onClick={toggleMode}
        className="w-full mt-8 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
      >
        {isLogin ? "Não tem conta? Cadastre-se" : "Já é cadastrado? Faça Login"}
      </button>
    </div>
  );
}