import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { AuthService } from '../../services/auth.service';
import { CookiesService } from '../../services/cookies.service';
import { LocalStorageService } from '../../services/local-store.service';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../../components/ui/card';
import { Eye, EyeOff, LogIn, Mail, Lock } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { TokenType } from '../../bases/enums/jwt.enum';
import toast from 'react-hot-toast'

export function LoginPage() {
    const navigate = useNavigate();
    useEffect(() => {
        if (AuthService.checkLogin()) {
            navigate('/dashboard', { replace: true }); 
        }
    }, [navigate]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        if (!email || !password) {
            setError('Please enter full email and password');
            setIsLoading(false);
            return;
        }
        try {
            const responseData = await AuthService.login(email, password);
            const { accessToken, refreshToken } = responseData;
            //Call api to get personal information
            CookiesService.saveToken(accessToken , TokenType.ACCESS_TOKEN) 
            CookiesService.saveToken(refreshToken , TokenType.REFRESH_TOKEN)
            //Calling me for get information 
            const me = await AuthService.me(accessToken);
            //Luu tru me vao ben trong local-storage
            const result = LocalStorageService.saveValue('me' , me) 
            if (result)
                navigate('/dashboard');
            else 
                toast.error("Error during resolve. Please try again later") 
        } 
        catch (err: any) {
            const message = err.response.data.message;
            setError(message || 'Error. Try agin later');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                <CardHeader className="space-y-6 pb-8">
                    <div className="flex items-center justify-center mb-4">
                        <span className="text-orange-500 text-3xl font-bold">
                            Beta Book
                        </span>
                    </div>

                    <div className="text-center space-y-2">
                        <CardTitle className="text-2xl">
                            Welcome Back 
                        </CardTitle>
                        <CardDescription className="text-base">
                            Login to continue 
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="pb-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700">
                                Email 
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Nhập địa chỉ email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    className="pl-10 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700">
                                Password 
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Nhập mật khẩu"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    autoComplete="current-password"
                                    className="pl-10 pr-10 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    disabled={isLoading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <p className="text-sm text-red-600 text-center">
                                    {error}
                                </p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white h-12 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Signing In...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <LogIn className="w-5 h-5" />
                                    <span>Sign In</span>
                                </div>
                            )}
                        </Button>

                        <div className="pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-500 text-center mb-2">
                                Sample Account (Tour employee):
                            </p>
                            <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                                <p className="text-xs text-gray-600">
                                    <span className="font-medium">Email:</span>{' '}
                                    nguyen.vana@company.com
                                </p>
                                <p className="text-xs text-gray-600">
                                    <span className="font-medium">
                                        Password:
                                    </span>{' '}
                                    password
                                </p>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
        </div>
    );
}
