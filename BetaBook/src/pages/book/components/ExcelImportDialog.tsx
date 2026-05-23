import React from 'react';
import { Button } from '../../../components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '../../../components/ui/dialog';
import { FileText, Package, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

interface ExcelImportDialogProps {
    isExcelDialogOpen: boolean;
    setIsExcelDialogOpen: (isOpen: boolean) => void;
    selectedFile: File | null;
    setSelectedFile: (file: File | null) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onImport: () => Promise<void>;
}

export function ExcelImportDialog({
    isExcelDialogOpen,
    setIsExcelDialogOpen,
    selectedFile,
    setSelectedFile,
    handleFileChange,
}: ExcelImportDialogProps) {
    const [employeeCode, setEmployeeCode] = React.useState('');
    const [employeeName, setEmployeeName] = React.useState('');

    const handleEmployeeChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const code = e.target.value;
        setEmployeeCode(code);

        if (!code) {
            setEmployeeName('');
            return;
        }

        try {
            const res = await fetch(`/api/employees/${code}`);
            if (!res.ok) throw new Error();

            const data = await res.json();
            setEmployeeName(data.name);
        } catch (error) {
            setEmployeeName('Không tìm thấy nhân viên');
        }
    };
    return (
        <Dialog open={isExcelDialogOpen} onOpenChange={setIsExcelDialogOpen}>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
                <div className="bg-orange-50/50 p-6 border-b border-orange-100">
                    <DialogTitle>
                        <FileText className="w-5 h-5 text-orange-500" />
                        Nhập dữ liệu từ Excel
                    </DialogTitle>
                    <DialogDescription>
                        Tải lên file danh sách sách để nhập kho hàng loạt.
                    </DialogDescription>
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Mã người nhập
                        </label>
                        <input
                            type="text"
                            value={employeeCode}
                            onChange={handleEmployeeChange}
                            placeholder="Nhập mã nhân viên..."
                            className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-gray-400">
                            Tên người nhập
                        </label>
                        <input
                            type="text"
                            value={employeeName}
                            readOnly
                            className="mt-1 w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-600"
                        />
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div
                        className="relative group flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-8 bg-white hover:border-orange-400 hover:bg-orange-50/30 transition-all duration-300 cursor-pointer"
                        onClick={() =>
                            document
                                .getElementById('excel-upload-input')
                                ?.click()
                        }
                    >
                        <div className="w-14 h-14 bg-gray-50 group-hover:bg-orange-100 text-gray-400 group-hover:text-orange-600 rounded-full flex items-center justify-center mb-4 transition-colors">
                            <Package className="w-7 h-7" />
                        </div>

                        <div className="text-center space-y-1">
                            <p className="text-sm font-semibold text-gray-700">
                                {selectedFile ? (
                                    <span className="text-orange-600 font-bold">
                                        {selectedFile.name}
                                    </span>
                                ) : (
                                    'Chọn file Excel của bạn'
                                )}
                            </p>
                            <p className="text-xs text-gray-400">
                                Kéo thả hoặc nhấn để tìm file
                            </p>
                        </div>

                        <input
                            id="excel-upload-input"
                            type="file"
                            accept=".xlsx, .xls, .csv"
                            className="hidden"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-100 rounded-md text-blue-600">
                                <BookOpen className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[13px] text-gray-600 font-medium">
                                Định dạng: .xlsx, .csv
                            </span>
                        </div>
                        <button className="text-[13px] text-orange-600 hover:text-orange-700 font-bold hover:underline transition-all">
                            Tải file mẫu
                        </button>
                    </div>
                </div>

                <div className="p-6 pt-0 flex gap-3 items-center justify-end">
                    <Button
                        variant="ghost"
                        className="text-gray-500 hover:bg-gray-100 px-6"
                        onClick={() => {
                            setIsExcelDialogOpen(false);
                            setSelectedFile(null);
                        }}
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-200 px-6 transition-all active:scale-95"
                        disabled={!selectedFile}
                        onClick={() => {
                            toast.success('Đang xử lý dữ liệu...');
                            setIsExcelDialogOpen(false);
                            setSelectedFile(null);
                        }}
                    >
                        Bắt đầu nhập
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
