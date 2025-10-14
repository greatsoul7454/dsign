/** @format */
"use client";

import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const PurchaseOrder = ({ poNumber, date, deliveryLocation, supplier, items }) => {
  const handleDownload = async () => {
    try {
      const element = document.getElementById("po-content");
      if (!element) return;

      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`PurchaseOrder_${poNumber || "PO-2025-001"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  // Default items if none are provided
  const displayItems = items && items.length > 0 ? items : [
    {
      supplierPartNo: "____________________",
      buyerPartNo: "RM-001",
      product: "Raw Materials",
      specification: "Standard industrial-grade raw materials suitable for automotive manufacturing processes",
      unit: "Pallets",
      quantity: 2240,
      unitPrice: 0,
      discount: 5,
      taxRate: 7
    },
    {
      supplierPartNo: "____________________",
      buyerPartNo: "OFFICE-001",
      product: "Office Supplies",
      specification: "Standard business-grade supplies suitable for daily operations",
      unit: "Cases",
      quantity: 2240,
      unitPrice: 0,
      discount: 5,
      taxRate: 7
    }
  ];

  const subtotal = displayItems.reduce((acc, item) => acc + (item.quantity * (item.unitPrice || 0)), 0);
  const tax = subtotal * 0.07;
  const shipping = 150;
  const discount = subtotal * 0.05;
  const total = subtotal + tax + shipping - discount;

  return (
    <div className="po-wrapper">
      <div id="po-content" className="po-container">
        
        {/* Main Header */}
        <div className="po-main-header">
          <div className="po-company-details">
            <h1>VINFAST AUTO LTD.</h1>
            <p>VinFast Manufacturing and Trading Company Limited</p>
            <p>7 Bang Lang 1 Street, Cat Hai Ward, Cat Hai District, Hai Phong, Vietnam</p>
            <p>Tel: +84-225-378-9999 | Email: purchasing@vinfastauto.com | Web: www.vinfastauto.com</p>
            <p>Business Registration: 0107465588 | VAT ID: VN-0107465588</p>
            <p>NHTSA Manufacturer ID: 20180</p>
          </div>
          
          <div className="po-title-section">
            <h2>PURCHASE ORDER</h2>
            <div className="po-meta-info">
              <p><strong>PO NUMBER:</strong> {poNumber || "PO-2025-001"}</p>
              <p><strong>PO DATE:</strong> {date || new Date().toISOString().slice(0, 10)}</p>
              <p><strong>PO STATUS:</strong> [DRAFT/APPROVED/ISSUED]</p>
              <p><strong>PURCHASING AGENT:</strong> Pham Nhat Vuong</p>
              <p><strong>DEPARTMENT:</strong> Executive Office</p>
            </div>
          </div>
        </div>

        {/* Supplier & Buyer Information */}
        <div className="po-parties-section">
          <div className="po-buyer-info wide-section">
            <h3>BUYER INFORMATION (VINFAST AUTO LTD.)</h3>
            <div className="info-grid">
              <div><strong>Company Legal Name:</strong> VinFast Auto Ltd.</div>
              <div><strong>Contact Person:</strong> Pham Nhat Vuong</div>
              <div><strong>Position/Title:</strong> Chief Executive Officer</div>
              <div><strong>Department:</strong> Executive Office</div>
              <div><strong>Office Phone:</strong> +84-225-378-9999</div>
              <div><strong>Mobile Phone:</strong> ___________________________________</div>
              <div><strong>Email Address:</strong> ceo.office@vinfastauto.com</div>
              <div><strong>Billing Address:</strong> 7 Bang Lang 1 Street, Cat Hai Ward, Cat Hai District, Hai Phong, Vietnam</div>
              <div><strong>Shipping Address:</strong> ___________________________________</div>
              <div><strong>Tax Identification Number:</strong> VN-0107465588</div>
              <div><strong>NHTSA Manufacturer ID:</strong> 20180</div>
            </div>
          </div>

          <div className="po-supplier-info wide-section">
            <h3>SUPPLIER INFORMATION (TO BE COMPLETED BY SUPPLIER)</h3>
            <div className="info-grid">
              <div><strong>Company Legal Name:</strong> {supplier || "___________________________________"}</div>
              <div><strong>Contact Person:</strong> ___________________________________</div>
              <div><strong>Position/Title:</strong> ___________________________________</div>
              <div><strong>Department:</strong> ___________________________________</div>
              <div><strong>Office Phone:</strong> ___________________________________</div>
              <div><strong>Mobile Phone:</strong> ___________________________________</div>
              <div><strong>Email Address:</strong> ___________________________________</div>
              <div><strong>Company Address:</strong> ___________________________________</div>
              <div><strong>Shipping From Address:</strong> ___________________________________</div>
              <div><strong>Tax Identification Number:</strong> ___________________________________</div>
              <div><strong>Business Registration Number:</strong> ___________________________________</div>
              <div><strong>Year Established:</strong> __________</div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table className="po-table wide-table">
          <thead>
            <tr>
              <th>Item No.</th>
              <th>Supplier Part No.</th>
              <th>Buyer Part No.</th>
              <th>Product Description</th>
              <th>Technical Specifications</th>
              <th>Unit of Measure</th>
              <th>Quantity</th>
              <th>Unit Price (USD)</th>
              <th>Discount %</th>
              <th>Tax Rate %</th>
              <th>Line Total (USD)</th>
            </tr>
          </thead>
          <tbody>
            {displayItems.map((item, index) => {
              const lineTotal = item.quantity * (item.unitPrice || 0) * (1 - (item.discount || 0) / 100);
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.supplierPartNo}</td>
                  <td>{item.buyerPartNo}</td>
                  <td>{item.product}</td>
                  <td>{item.specification}</td>
                  <td>{item.unit}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unitPrice ? `$${item.unitPrice.toFixed(2)}` : "To be quoted"}</td>
                  <td>{item.discount}%</td>
                  <td>{item.taxRate}%</td>
                  <td>${lineTotal.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Financial Summary */}
        <div className="po-financial-summary wide-section">
          <div className="financial-grid">
            <div className="amount-breakdown">
              <h4>ORDER VALUE CALCULATION</h4>
              <div className="amount-row"><span>Total Goods Value:</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="amount-row"><span>Trade Discount (5%):</span><span>-${discount.toFixed(2)}</span></div>
              <div className="amount-row"><span>Subtotal After Discount:</span><span>${(subtotal - discount).toFixed(2)}</span></div>
              <div className="amount-row"><span>Shipping & Handling:</span><span>${shipping.toFixed(2)}</span></div>
              <div className="amount-row"><span>Insurance:</span><span>$___________</span></div>
              <div className="amount-row"><span>Other Charges:</span><span>$___________</span></div>
              <div className="amount-row"><span>Taxable Amount:</span><span>${(subtotal - discount).toFixed(2)}</span></div>
              <div className="amount-row"><span>Sales Tax/VAT (7%):</span><span>${tax.toFixed(2)}</span></div>
              <div className="amount-row total-row"><span>GRAND TOTAL (USD):</span><span>${total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>

        {/* Signatures Section */}
        <div className="po-signatures-section wide-section">
          <h3>AUTHORIZATION & ACCEPTANCE</h3>
          <div className="signatures-grid">
            <div className="buyer-signature">
              <h4>FOR VINFAST AUTO LTD.</h4>
              <div className="signature-line">Authorized Signature:</div>
              <div className="signature-drawing">
                <div className="signature-placeholder">
                  <div className="signature-name">Pham Nhat Vuong</div>
                  <div className="signature-title">Chief Executive Officer</div>
                </div>
              </div>
              <p>Printed Name: Pham Nhat Vuong</p>
              <p>Position/Title: Chief Executive Officer</p>
              <p>Date: ______________________________</p>
            </div>
            
            <div className="supplier-signature">
              <h4>FOR SUPPLIER ACCEPTANCE</h4>
              <p>We acknowledge and accept this Purchase Order</p>
              <div className="signature-line">Authorized Signature:</div>
              <div className="signature-drawing">
                <div className="signature-placeholder-supplier">
                  ___________________________________
                </div>
              </div>
              <p>Printed Name: ___________________________________</p>
              <p>Position/Title: ___________________________________</p>
              <p>Date: ______________________________</p>
            </div>
          </div>
        </div>
      </div>

      <button className="download-btn" onClick={handleDownload}>
        Download as PDF
      </button>

      <style jsx>{`
        .po-wrapper {
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          box-sizing: border-box;
        }

        .po-container {
          width: 100%;
          border: 2px solid #333;
          padding: 30px;
          background: #fff;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          box-sizing: border-box;
        }

        .po-main-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          border-bottom: 3px double #333;
          padding-bottom: 20px;
          flex-wrap: wrap;
        }

        .po-company-details {
          flex: 1;
          min-width: 300px;
          margin-right: 20px;
        }

        .po-company-details h1 {
          margin: 0 0 10px 0;
          color: #2c3e50;
          font-size: 22px;
          line-height: 1.2;
        }

        .po-company-details p {
          margin: 5px 0;
          font-size: 12px;
          line-height: 1.4;
        }

        .po-title-section {
          text-align: right;
          min-width: 250px;
        }

        .po-title-section h2 {
          margin: 0 0 15px 0;
          color: #179bd7;
          font-size: 28px;
          font-weight: bold;
        }

        .po-meta-info p {
          margin: 3px 0;
          font-size: 11px;
        }

        .wide-section {
          margin: 25px 0;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 5px;
          background: #f9f9f9;
          box-sizing: border-box;
        }

        .wide-section h3 {
          margin-top: 0;
          color: #2c3e50;
          border-bottom: 2px solid #179bd7;
          padding-bottom: 10px;
          font-size: 16px;
        }

        .po-parties-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          font-size: 13px;
        }

        .info-grid div {
          padding: 4px 0;
          border-bottom: 1px dotted #eee;
        }

        .po-table.wide-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
          margin: 20px 0;
          table-layout: fixed;
        }

        .po-table.wide-table th,
        .po-table.wide-table td {
          border: 1px solid #000;
          padding: 8px 4px;
          text-align: center;
          vertical-align: top;
          word-wrap: break-word;
        }

        .po-table.wide-table th {
          background-color: #2c3e50;
          color: white;
          font-weight: bold;
        }

        .financial-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 30px;
        }

        .amount-breakdown h4 {
          margin-top: 0;
          color: #2c3e50;
          border-bottom: 1px solid #ccc;
          padding-bottom: 5px;
        }

        .amount-row {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
          border-bottom: 1px dotted #ccc;
          font-size: 13px;
        }

        .total-row {
          border-top: 2px solid #333;
          font-weight: bold;
          font-size: 14px;
          margin-top: 10px;
          padding-top: 10px;
        }

        .signatures-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-top: 20px;
        }

        .buyer-signature, .supplier-signature {
          text-align: center;
        }

        .buyer-signature h4, .supplier-signature h4 {
          margin: 0 0 15px 0;
          color: #2c3e50;
          font-size: 14px;
        }

        .signature-line {
          margin: 10px 0 5px 0;
          font-weight: bold;
        }

        .signature-drawing {
          margin: 10px 0;
          min-height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .signature-placeholder {
          font-family: 'Dancing Script', cursive, sans-serif;
          font-size: 24px;
          color: #333;
          text-align: center;
          border-bottom: 2px solid #333;
          padding-bottom: 5px;
          min-width: 200px;
        }

        .signature-name {
          font-weight: bold;
          font-size: 20px;
        }

        .signature-title {
          font-size: 12px;
          color: #666;
          margin-top: 2px;
        }

        .signature-placeholder-supplier {
          font-size: 16px;
          color: #999;
          min-height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px dashed #ccc;
          min-width: 200px;
        }

        .download-btn {
          margin-top: 30px;
          background-color: #179bd7;
          color: #fff;
          border: none;
          padding: 15px 30px;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          font-size: 16px;
          transition: background-color 0.3s;
        }

        .download-btn:hover {
          background-color: #1278a1;
        }

        @media (max-width: 767px) {
          .po-parties-section,
          .signatures-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }
          
          .po-table.wide-table {
            font-size: 8px;
            display: block;
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default PurchaseOrder;