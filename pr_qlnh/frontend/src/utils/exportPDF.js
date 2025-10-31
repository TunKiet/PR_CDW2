import React from 'react'
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const exportPDF = (data, fileName = "nguyenlieutonkho.pdf") => {
    console.log("📄 Xuất PDF với dữ liệu:", data); // 👉 kiểm tra log
    const doc = new jsPDF({
        unit: "mm",
        format: "a4",
    });
    //title
    doc.setFontSize(16);
    doc.text("LIST ALL INGREDIENT", 70, 20);

    //get current date
    const currentDate = new Date().toLocaleString("vi-VN");
    doc.setFontSize(10);
    doc.text(`Ngày in: ${currentDate}`, 14, 28);

    //create table data
    const tableColumn = [
        "Mã",
        "Tên nguyên liệu",
        "Danh mục",
        "Tồn kho",
        "Ngưỡng cảnh báo",
        "Đơn vị",
        "Giá",
        "Tổng tiền",
    ];

    const tableRow = data.map((item) => [
        item.ingredient_id,
        item.ingredient_name,
        item.category_ingredient_name,
        item.stock_quantity,
        item.min_stock_level,
        item.unit,
        item.price,
        item.total_price,
    ]);

    autoTable(doc, {
        startY: 35,
        head: [tableColumn],
        body: tableRow,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 14, right: 14 },
    });

    // Export file
    doc.save(fileName);
}

export default exportPDF