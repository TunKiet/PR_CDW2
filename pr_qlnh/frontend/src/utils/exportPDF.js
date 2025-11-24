import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const exportPDF = (data, fileName = "danhsachnguyenlieu.pdf") => {
    console.log("📄 Exporting PDF with data:", data);

    const doc = new jsPDF({
        unit: "mm",
        format: "a4",
    });


    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("INGREDIENTS INVENTORY REPORT", 105, 15, { align: "center" });

    // Exporter info
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Name: Nguyen Van A", 14, 25);
    doc.text("Phone: 093874854", 14, 32);

    // Current date (right corner)
    const currentDate = new Date().toLocaleString("en-GB"); // English format
    doc.setFontSize(10);
    doc.text(`Day: ${currentDate}`, 200 - 14, 25, { align: "right" });

    // Separator line
    doc.setDrawColor(180);
    doc.line(14, 36, 200 - 14, 36);

    const tableColumn = [
        "ID",
        "Ingredient Name",
        "Category",
        "In Stock",
        "Min Level",
        "Unit",
        "Price",
        "Total",
    ];

    const tableRow = data.map((item) => [
        item.ingredient_id,
        item.ingredient_name,
        item.category_ingredient?.category_ingredient_name,
        item.stock_quantity,
        item.min_stock_level,
        item.unit,
        Number(item.price).toLocaleString("en-US", { minimumFractionDigits: 0 }),
        Number(item.total_price).toLocaleString("en-US", { minimumFractionDigits: 0 }),
    ]);

    autoTable(doc, {
        startY: 42,
        head: [tableColumn],
        body: tableRow,
        styles: {
            fontSize: 8,
            cellPadding: 3,
            halign: "center",
            valign: "middle",
        },
        headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: "bold",
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 14, right: 14 },
        didDrawPage: () => {
            // Footer with page number
            const pageHeight = doc.internal.pageSize.height;
            doc.setFontSize(9);
            doc.text(
                `Page ${doc.internal.getNumberOfPages()}`,
                105,
                pageHeight - 10,
                { align: "center" }
            );
        },
    });
    doc.save(fileName);
};

export default exportPDF;
