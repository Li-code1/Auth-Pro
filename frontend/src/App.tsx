import { useState, useEffect } from "react";
import { AuthForm } from "./components/AuthForm";
import { Dashboard } from "./components/Dashboard";

// Definição do tipo de usuário para o TypeScript
interface UserSession {
  name: string;
  email: string;
}

function App() {
  // Estado para armazenar os dados do usuário logado
  const [user, setUser] = useState<UserSession | null>(null);
  // Estado para evitar um "flash" de tela de login enquanto verifica a sessão
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Busca a sessão no LocalStorage ao carregar o App
    const savedUser = localStorage.getItem("user_session");
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Erro ao carregar sessão:", error);
        localStorage.removeItem("user_session");
      }
    }
    setLoading(false);
  }, []);

  // Função para fazer logout
  const handleLogout = () => {
    localStorage.removeItem("user_session");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Background Decorativo Dinâmico */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200 rounded-full blur-[120px] opacity-30 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-100 rounded-full blur-[120px] opacity-30"></div>
      </div>

      <main className="w-full flex justify-center items-center">
        {user ? (
          // Se existir usuário, mostra o Dashboard
          <Dashboard user={user} onLogout={handleLogout} />
        ) : (
          // Se não existir, mostra o Formulário de Autenticação
          <AuthForm />
        )}
      </main>
    </div>
  );
}

export default App;