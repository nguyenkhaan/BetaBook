import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToPDF = async (
    data: any[],
    fileName: string,
    title: string = 'BÁO CÁO DỮ LIỆU',
) => {
    try {
        if (!data || data.length === 0) {
            throw new Error('Không có dữ liệu để xuất');
        }

        const doc = new jsPDF('p', 'pt', 'a4');

        // 1. Fetch file font
        const fontUrl = '/fonts/Roboto-Regular.ttf';
        const response = await fetch(fontUrl);

        // Bắt lỗi nếu không tìm thấy file font
        if (!response.ok) {
            throw new Error(
                `Không thể tải font từ ${fontUrl}. Vui lòng kiểm tra lại thư mục public/fonts/`,
            );
        }

        const blob = await response.blob();

        // 2. Chuyển đổi sang Base64 bằng FileReader (Cách này mượt và không bị crash)
        const base64Font = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                // Kết quả có dạng "data:font/ttf;base64,AAEAAA...", ta chỉ lấy phần mã sau dấu phẩy
                const base64String = result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = () => reject(new Error('Lỗi khi đọc file font'));
            reader.readAsDataURL(blob);
        });

        // 3. Nhúng font vào jsPDF
        doc.addFileToVFS('Roboto-Regular.ttf', base64Font);
        doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
        doc.setFont('Roboto');

        const headers = Object.keys(data[0]);
        const rows = data.map((item) =>
            Object.values(item).map((val) => String(val)),
        );

        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.text(title, doc.internal.pageSize.getWidth() / 2, 40, {
            align: 'center',
        });

        autoTable(doc, {
            head: [headers],
            body: rows,
            startY: 60,
            theme: 'grid',
            styles: {
                font: 'Roboto', 
                fontSize: 10,
                cellPadding: 6,
            },
            headStyles: {
                fillColor: [249, 115, 22],
                textColor: [255, 255, 255],
                fontStyle: 'normal',
                halign: 'center',
            },
            alternateRowStyles: {
                fillColor: [248, 250, 252],
            },
            columnStyles: {},
        });

        const finalFileName = fileName.endsWith('.pdf')
            ? fileName
            : `${fileName}.pdf`;
        doc.save(finalFileName);

        return true;
    } catch (error) {
        // Log lỗi chi tiết ra console để dễ debug
        console.error('Lỗi khi xuất file PDF:', error);
        throw error;
    }
};
