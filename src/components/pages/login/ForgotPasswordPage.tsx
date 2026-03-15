import { useState } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
}

export function ForgotPasswordPage({ onBackToLogin }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              
              <div className="space-y-2">
                <CardTitle className="text-2xl">Kiểm tra email của bạn</CardTitle>
                <CardDescription className="text-base">
                  Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến
                </CardDescription>
                <p className="text-orange-600 font-medium">{email}</p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm text-gray-700">
                Không nhận được email? Kiểm tra thư mục spam hoặc thử lại sau vài phút.
              </div>

              <Button
                onClick={onBackToLogin}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white h-12"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Quay lại đăng nhập
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center justify-center mb-4">
              <span className="text-orange-500 text-3xl">Beta Book</span>
            </div>

            {/* Title and Description */}
            <div className="text-center space-y-2">
              <CardTitle className="text-2xl">Quên mật khẩu?</CardTitle>
              <CardDescription className="text-base">
                Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
              </CardDescription>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Địa chỉ Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Nhập địa chỉ Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white h-12 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang gửi...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    <span>Gửi hướng dẫn</span>
                  </div>
                )}
              </Button>

              {/* Back to Login */}
              <Button
                type="button"
                variant="outline"
                onClick={onBackToLogin}
                className="w-full h-12 border-gray-300 hover:bg-gray-50"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Quay lại đăng nhập
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
