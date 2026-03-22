import { BookOpen, ArrowLeft, Calendar, User } from 'lucide-react';
import { Button } from '../../components/ui/button';

interface Regulation {
  id: number;
  title: string;
  category: string;
  description: string;
  content: string;
  effectiveDate: string;
  status: 'Đang áp dụng' | 'Sắp có hiệu lực' | 'Đã hết hiệu lực';
  lastUpdated: string;
  updatedBy: string;
}

interface RegulationDetailPageProps {
  onBack: () => void;
  regulation: Regulation | null;
}

export function RegulationDetailPage({ onBack, regulation }: RegulationDetailPageProps) {
  const formatDate = (date: string) => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  const getStatusColor = (status: Regulation['status']) => {
    switch (status) {
      case 'Đang áp dụng':
        return 'bg-green-100 text-green-800';
      case 'Sắp có hiệu lực':
        return 'bg-blue-100 text-blue-800';
      case 'Đã hết hiệu lực':
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!regulation) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chi tiết quy định</h1>
            <p className="text-gray-600 mt-1">Xem chi tiết các quy định của Beta Book</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-500 text-center py-8">Không tìm thấy quy định</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{regulation.title}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(regulation.status)}`}>
              {regulation.status}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              {regulation.category}
            </span>
          </div>
          <p className="text-gray-600 mt-1">{regulation.description}</p>
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ngày có hiệu lực</p>
              <p className="font-semibold text-gray-900">{formatDate(regulation.effectiveDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ngày cập nhật</p>
              <p className="font-semibold text-gray-900">{formatDate(regulation.lastUpdated)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <User className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Người cập nhật</p>
              <p className="font-semibold text-gray-900">{regulation.updatedBy}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-orange-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Nội dung quy định</h2>
        </div>

        <div className="prose max-w-none">
          <div className="space-y-4 text-gray-700 whitespace-pre-wrap leading-relaxed">
            {regulation.content}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t mt-8 pt-6">
          <p className="text-sm text-gray-500 italic">
            * Quy định này có hiệu lực từ ngày {formatDate(regulation.effectiveDate)} và có thể được cập nhật theo từng thời kỳ.
          </p>
          <p className="text-sm text-gray-500 italic mt-2">
            * Mọi thắc mắc vui lòng liên hệ phòng Nhân sự để được giải đáp.
          </p>
        </div>
      </div>
    </div>
  );
}
