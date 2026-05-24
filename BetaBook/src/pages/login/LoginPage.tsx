import { useEffect, useState } from 'react';
import { AuthService } from '../../services/auth.service';
import { CookiesService } from '../../services/cookies.service';
import { LocalStorageService } from '../../services/local-store.service';
import {
    Card,
    CardContent,
} from '../../components/ui/card';

import { useNavigate } from 'react-router-dom';
import { TokenType } from '../../bases/enums/jwt.enum';
import toast from 'react-hot-toast';
import { BackgroundAnimation } from './components/BackgroundAnimation';
import { LoginHeader } from './components/LoginHeader';
import { LoginForm } from './components/LoginForm';

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
            CookiesService.saveToken(accessToken, TokenType.ACCESS_TOKEN);
            CookiesService.saveToken(refreshToken, TokenType.REFRESH_TOKEN);
            //Calling me for get information
            const me = await AuthService.me();
            //Luu tru me vao ben trong local-storage
            const result = LocalStorageService.saveValue('me', me);
            if (result) navigate('/dashboard');
            else toast.error('Error during resolve. Please try again later');
        } catch (err: any) {
            const message = err.response.data.message;
            setError(message || 'Error. Try agin later');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4 relative overflow-hidden">
            <BackgroundAnimation />

            <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                <LoginHeader />

                <CardContent className="pb-8">
                    <LoginForm
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        isLoading={isLoading}
                        error={error}
                        onSubmit={handleSubmit}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
