import React, { useState } from 'react';
import { MessageCircle, Eye, EyeOff, Mail, Lock, User, ArrowRight, Check, X } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);
  
  const { setUser } = useAuthStore();
  const navigate = useNavigate();


  const getPasswordStrength = (pwd) => {
    if (!pwd) return { label: '', color: '', width: '0%', show: false };
    
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;

    if (strength <= 2) return { label: 'Fraca', color: 'bg-red-500', width: '33%', show: true };
    if (strength <= 3) return { label: 'Média', color: 'bg-yellow-500', width: '66%', show: true };
    return { label: 'Forte', color: 'bg-green-500', width: '100%', show: true };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLogin && !acceptTerms) {
      setError('Você deve aceitar os Termos de Uso');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const body = isLogin 
        ? { email, password }
        : { username, email, password };

      const { data } = await api.post(endpoint, body);

     
      if (!isLogin) {
        setLoading(false);
        setCreatingAccount(true);
        
       
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser({
        ...data.user,
        id: data.user._id
      });

      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro na autenticação');
      setLoading(false);
      setCreatingAccount(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setUsername('');
    setEmail('');
    setPassword('');
    setAcceptTerms(false);
    setCreatingAccount(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-3 sm:p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-6xl bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Loading Overlay - Criando Conta */}
        {creatingAccount && (
          <div className="absolute inset-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
            <div className="text-center">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 animate-ping"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-40 animate-pulse"></div>
                <div className="relative w-full h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin"></div>
                  </div>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Criando sua conta...
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 animate-pulse">
                Preparando tudo para você ✨
              </p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 min-h-[500px] sm:min-h-[600px]">
          
          {/* Left Side - Illustration */}
          <div className="hidden lg:flex flex-col justify-center items-center p-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10 text-white text-center animate-in fade-in slide-in-from-left duration-700">
              <div className="mb-8 transform hover:scale-110 transition-transform duration-300">
                <MessageCircle size={80} className="mx-auto drop-shadow-2xl" strokeWidth={1.5} />
              </div>
              
              <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
                Konnex App
              </h1>
              <p className="text-xl text-white/95 mb-8 max-w-md font-medium">
                Conversas simples. Conexões reais.
              </p>

              {/* Illustration - tamanho aumentado */}
              <div className="mt-12 w-full max-w-lg mx-auto animate-in fade-in zoom-in duration-1000" style={{ animationDelay: '300ms' }}>
                <img 
                  src="/chat-illustration.svg" 
                  alt="Chat Illustration"
                  className="w-full h-auto drop-shadow-2xl"
                />
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-white/80">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>

          {/* Right Side - Form with Sliding Animation */}
          <div className="relative p-4 sm:p-8 lg:p-12 flex flex-col justify-center bg-white dark:bg-gray-900">
            {/* Logo mobile */}
            <div className="lg:hidden flex justify-center mb-4 sm:mb-6">
              <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-xl">
                <MessageCircle size={32} className="sm:hidden text-white" />
                <MessageCircle size={48} className="hidden sm:block text-white" />
              </div>
            </div>

            {/* Sliding Forms Container */}
            <div className="relative overflow-hidden">
              <div 
                className="transition-transform duration-500 ease-out"
                style={{ transform: isLogin ? 'translateX(0)' : 'translateX(-100%)' }}
              >
                <div className="flex">
                  {/* Login Form */}
                  <div className="w-full flex-shrink-0 pr-4 sm:pr-8">
                    <div className="mb-4 sm:mb-6 lg:mb-8 animate-in fade-in slide-in-from-right duration-500">
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                        Bem-vindo de volta ao Konnex
                      </h2>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        Entre para continuar conversando
                      </p>
                    </div>

                    {error && (
                      <div className="mb-3 sm:mb-4 lg:mb-6 p-3 sm:p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-l-4 border-red-500 rounded-lg animate-in slide-in-from-top duration-300">
                        <p className="text-xs sm:text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 lg:space-y-5">
                      <div className="space-y-1 sm:space-y-2">
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                          E-mail
                        </label>
                        <div className="relative group">
                          <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                            required
                            className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 lg:py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl
                                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base
                                     placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                                     transition-all duration-300"
                          />
                        </div>
                      </div>

                      <div className="space-y-1 sm:space-y-2">
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Senha
                        </label>
                        <div className="relative group">
                          <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            minLength={8}
                            className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 lg:py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl
                                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base
                                     placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                                     transition-all duration-300"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 sm:py-3.5 lg:py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600
                                 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold rounded-lg sm:rounded-xl text-sm sm:text-base
                                 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 
                                 disabled:transform-none disabled:cursor-not-allowed shadow-lg hover:shadow-xl
                                 flex items-center justify-center gap-2 group"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span className="text-sm sm:text-base">Carregando...</span>
                          </>
                        ) : (
                          <>
                            Acessar
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  {/* Register Form */}
                  <div className="w-full flex-shrink-0 pl-4 sm:pl-8">
                    <div className="mb-4 sm:mb-6 lg:mb-8">
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                        Criar conta
                      </h2>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        Junte-se à nossa comunidade
                      </p>
                    </div>

                    {error && (
                      <div className="mb-3 sm:mb-4 lg:mb-6 p-3 sm:p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-l-4 border-red-500 rounded-lg">
                        <p className="text-xs sm:text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 lg:space-y-5">
                      <div className="space-y-1 sm:space-y-2">
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Nome de usuário
                        </label>
                        <div className="relative group">
                          <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={18} />
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Digite seu nome"
                            required={!isLogin}
                            minLength={3}
                            maxLength={20}
                            className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 lg:py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl
                                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base
                                     placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20
                                     transition-all duration-300"
                          />
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 pl-1">
                          Entre 3 e 20 caracteres
                        </p>
                      </div>

                      <div className="space-y-1 sm:space-y-2">
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                          E-mail
                        </label>
                        <div className="relative group">
                          <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={18} />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                            required
                            className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 lg:py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl
                                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base
                                     placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20
                                     transition-all duration-300"
                          />
                        </div>
                      </div>

                      <div className="space-y-1 sm:space-y-2">
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Senha
                        </label>
                        <div className="relative group">
                          <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={18} />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            minLength={8}
                            className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 lg:py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl
                                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base
                                     placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20
                                     transition-all duration-300"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        
                        {/* Indicador de força da senha */}
                        {passwordStrength.show && (
                          <div className="space-y-1 animate-in fade-in slide-in-from-top duration-300">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400 dark:text-gray-500">Força:</span>
                              <span className={`text-xs font-semibold ${
                                passwordStrength.label === 'Forte' ? 'text-green-600 dark:text-green-400' :
                                passwordStrength.label === 'Média' ? 'text-yellow-600 dark:text-yellow-400' :
                                'text-red-600 dark:text-red-400'
                              }`}>
                                {passwordStrength.label}
                              </span>
                            </div>
                            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${passwordStrength.color} transition-all duration-300 rounded-full`}
                                style={{ width: passwordStrength.width }}
                              />
                            </div>
                          </div>
                        )}
                        
                        <p className="text-xs text-gray-400 dark:text-gray-500 pl-1">
                          Mínimo 8 caracteres
                        </p>
                      </div>

                      {/* Checkbox Termos de Uso */}
                      <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                        <button
                          type="button"
                          onClick={() => setAcceptTerms(!acceptTerms)}
                          className={`flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                            acceptTerms
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500'
                              : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
                          }`}
                        >
                          {acceptTerms && <Check size={12} className="sm:w-3.5 sm:h-3.5 text-white" strokeWidth={3} />}
                        </button>
                        <label className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer select-none leading-tight" onClick={() => setAcceptTerms(!acceptTerms)}>
                          Li e aceito os{' '}
                          <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline font-semibold">
                            Termos de Uso
                          </a>
                          {' '}e{' '}
                          <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline font-semibold">
                            Política de Privacidade
                          </a>
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={loading || !acceptTerms}
                        className="w-full py-3 sm:py-3.5 lg:py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600
                                 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold rounded-lg sm:rounded-xl text-sm sm:text-base
                                 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 
                                 disabled:transform-none disabled:cursor-not-allowed shadow-lg hover:shadow-xl
                                 flex items-center justify-center gap-2 group"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span className="text-sm sm:text-base">Carregando...</span>
                          </>
                        ) : (
                          <>
                            Criar conta
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Toggle - Mais visível */}
            <div className="mt-4 sm:mt-6 lg:mt-8 text-center">
              <button
                onClick={toggleMode}
                className="group inline-flex items-center gap-1.5 sm:gap-2 transition-all duration-300"
              >
                <span className="text-sm sm:text-base font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent 
                               group-hover:from-blue-700 group-hover:via-purple-700 group-hover:to-pink-700">
                  {isLogin ? '✨ Criar conta' : '👋 Entrar'}
                </span>
                <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px] text-blue-600 dark:text-blue-400 group-hover:translate-x-1 group-hover:text-blue-700 transition-all" />
              </button>
            </div>

            {/* Footer */}
            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4 sm:mt-6 lg:mt-8">
              Konnex App v1.0 · 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;