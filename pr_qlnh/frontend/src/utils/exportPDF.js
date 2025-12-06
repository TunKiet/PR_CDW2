import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import "../fonts/NotoSans-Bold-normal";
import "../fonts/NotoSans-Regular-normal";

export const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);

    // Nếu new Date() bị invalid
    if (isNaN(date.getTime())) return dateString;

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hour}:${minute}`;
};


const exportPDF = (order, fileName = "phieu_nhap_kho.pdf") => {
    const doc = new jsPDF({
        unit: "mm",
        format: "a4",
    });

    // ======= HEADER =======
    doc.setFont("NotoSans-Bold");

    doc.setFontSize(16);
    doc.text("PHIẾU NHẬP KHO", 105, 15, { align: "center" });

    doc.setFontSize(11);
    doc.setFont("NotoSans-Regular");
    doc.text("Nhà hàng D", 14, 25);
    doc.text("Địa chỉ: 53 Võ Văn Ngân, TP Thủ Đức, HCM", 14, 30);
    doc.text("Hotline: 0909 999 999", 14, 35);

    // Separator
    doc.setDrawColor(180);
    doc.line(14, 40, 200 - 14, 40);

    // ======= PURCHASE ORDER INFORMATION =======
    doc.setFont("NotoSans-Bold");

    doc.setFontSize(13);
    doc.text("Thông tin đơn hàng", 105, 48, { align: "center" });

    doc.setFont("NotoSans-Regular");
    doc.setFontSize(11);

    doc.text(`Mã đơn hàng: #DH${order.purchase_order_id}`, 14, 56);
    doc.text(`Nhà cung cấp: ${order.supplier_name}`, 14, 62);
    doc.text(`Ngày đặt: ${formatDateTime(order.created_at)}`, 14, 68);
    doc.text(`Ngày giao hàng: ${formatDateTime(order.order_date)}`, 14, 74);
    doc.text(`Trạng thái: ${order.status}`, 14, 80);

    const totalCostFormatted = Number(order.total_cost).toLocaleString("vi-VN") + " đ";
    doc.text(`Tổng chi phí: ${totalCostFormatted}`, 14, 86);

    console.log(doc.getFontList());

    // ======= TABLE =======
    const tableColumn = [
        "ID",
        "Name",
        "Unit",
        "Quantity",
        "Price",
        "Total"
    ];

    const tableRows = order.items.map((item) => [
        item.ingredient_id,
        item.ingredient_name,
        item.unit,
        Number(item.quantity).toLocaleString("vi-VN"),
        Number(item.price).toLocaleString("vi-VN"),
        Number(item.total).toLocaleString("vi-VN"),
    ]);

    autoTable(doc, {
        startY: 90,
        head: [tableColumn],
        body: tableRows,
        styles: {
            font: "NotoSans-Regular",
            fontSize: 9,
            cellPadding: 3,
            halign: "center",
        },
        headStyles: {
            font: "NotoSans-Regular",
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: "bold",
        },
        margin: { left: 14, right: 14 },
    });

    // ======= FOOTER =======
    const pageHeight = doc.internal.pageSize.height;

    doc.setFontSize(10);
    doc.text(
        `Ngày xuất: ${new Date().toLocaleString("vi-VN")}`,
        14,
        pageHeight - 15
    );

    doc.text(
        `Trang ${doc.internal.getNumberOfPages()}`,
        105,
        pageHeight - 10,
        { align: "center" }
    );

    doc.text(
        `Người tạo: Admin`,
        200 - 14,
        pageHeight - 15,
        { align: "right" }
    );

    doc.save(fileName);
};

export default exportPDF;
