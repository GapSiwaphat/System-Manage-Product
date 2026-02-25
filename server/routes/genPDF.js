import PDFDocument from 'pdfkit';
import path from 'path'; 
import { fileURLToPath } from 'url'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FONT_DIR = path.join(__dirname, 'fonts');
const THAI_FONT_PATH = path.join(FONT_DIR, 'Sarabun-Regular.ttf'); 
const THAI_BOLD_FONT_PATH = path.join(FONT_DIR, 'Sarabun-Bold.ttf'); 

export const generatePdfInvoice = (order, items, res) => {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Invoice_Order_${order.id}.pdf`);

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res); 

    try {
        doc.registerFont('ThaiFont', THAI_FONT_PATH);
        doc.registerFont('ThaiFont-Bold', THAI_BOLD_FONT_PATH);
    } catch (e) {
        console.error("Error loading Thai font (Check font path):", e.message);
    }
    
    const startX = 50;
    const endX = 550;
    let y = doc.y;

    // Header Section
    doc.font('ThaiFont-Bold').fontSize(16).text('Better View น้ำหนาว', startX, y, { align: 'center', width: endX - startX, indent: 20, lineGap: 5 });
    y = doc.y;
    doc.moveDown(0.5);
    doc.font('ThaiFont').fontSize(10).text(`บ.โคกมน ต.น้ำหนาว อ.น้ำหนาว จ.เพรชบรูณ์`, startX, y, { align: 'center', width: endX - startX, indent: 20, lineGap: 5});
    y = doc.y;
    doc.moveDown(0.5);
    doc.font('ThaiFont').fontSize(10).text(`ใบเสร็จ Order: ${order.id}`, startX, y, { align: 'center', width: endX - startX, indent: 20 });
    y = doc.y;
    doc.moveDown(0.5);

    doc.fontSize(10).text('----------------------------------------------------------------------------------------------------------------------------------------------------', startX, doc.y);
    doc.moveDown(0.5);

    // ข้อมูลบิลและลูกค้า
    doc.font('ThaiFont').fontSize(10);
    doc.text(`เลขที่บิล: #${order.id}`, startX, doc.y);
    doc.text(`วันที่: ${new Date(order.created_at).toLocaleDateString('th-TH')}`, endX - 150, doc.y - 12, { width: 150, align: 'right' }); 
    y = doc.y;
    doc.text(`ลูกค้า: ${order.customer_name}`, startX, y);
    doc.text(`เบอร์โทร: ${order.customer_phone || '-'}`, endX - 150, y, { width: 150, align: 'right' });
    doc.moveDown(0.5);
    
    doc.fontSize(10).text('----------------------------------------------------------------------------------------------------------------------------------------------------', startX, doc.y);
    doc.moveDown(0.5);
    
    // column Order
    y = doc.y;
    const colName = 50;
    const colQty = 380;
    const colPrice = 440;
    const colTotal = 500;

    doc.font('ThaiFont-Bold').fontSize(11).fillColor('#000000');
    doc.text('รายการสินค้า', colName, y, { width: 280 });
    doc.text('จำนวน', colQty, y, { width: 40, align: 'right' });
    doc.text('ราคา/หน่วย', colPrice, y, { width: 70, align: 'right' });
    doc.text('รวม', colTotal, y, { width: 50, align: 'right' });
    doc.moveDown(0.5);

    doc.fontSize(10).text('----------------------------------------------------------------------------------------------------------------------------------------------------', startX, doc.y);
    doc.moveDown(0.5);

    // Order Items
    doc.font('ThaiFont').fontSize(10).fillColor('#000000');
    items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        y = doc.y;
        doc.text(item.product_name, colName, y, { width: 300 });
        doc.text(item.quantity.toString(), colQty, y, { width: 40, align: 'right' });
        doc.text(parseFloat(item.price).toFixed(2), colPrice, y, { width: 50, align: 'right' });
        doc.text(itemTotal.toFixed(2), colTotal, y, { width: 50, align: 'right' });
        doc.moveDown(0.5);
    });
    
    // Summary Section
    doc.moveDown();
    doc.lineWidth(1).stroke(startX, doc.y, endX, doc.y); 
    doc.moveDown(0.1);
    doc.lineWidth(1).stroke(startX, doc.y, endX, doc.y); 
    doc.moveDown(1);
    
    const shiftLeft = 50;
    // Total Amount
    y = doc.y;
    doc.font('ThaiFont-Bold').fontSize(14).fillColor('#000000');
    doc.text('ยอดรวมสุทธิ', startX, doc.y, { 
        width: 200 
    }); 

    doc.text(`${parseFloat(order.total_price).toFixed(2)} บาท`, colTotal - shiftLeft, doc.y - 14, { width: 100, align: 'right' });
    doc.moveDown(0.5);
    
    // Payment Method
    doc.font('ThaiFont').fontSize(10).fillColor('#555555').text(`ชำระด้วย: ${order.payment_method}`, endX - 150, doc.y, { width: 150, align: 'right' });
    doc.moveDown(1);
    
    doc.lineWidth(1).stroke(startX, doc.y, endX, doc.y);
    doc.moveDown(0.1);
    doc.lineWidth(1).stroke(startX, doc.y, endX, doc.y);
    doc.moveDown(1);
    doc.font('ThaiFont').fontSize(10).text('ขอบคุณที่ใช้บริการของเรา', startX, doc.y, { align: 'center', width: endX - startX });


    doc.end();
};