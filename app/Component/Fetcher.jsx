"use client";

import React, { useState, useEffect } from "react";
import PurchaseOrder from "./Popup";

const Fetcher = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [poData, setPoData] = useState({
    poNumber: "PO-2025-001",
    date: new Date().toISOString().slice(0, 10),
    deliveryLocation: "Taiwan",
    supplier: "[Supplier's Name / Email]",
    items: [
      {
        product: "Filters",
        specification: "As per attached RFQ photos and",
        quantity: 27,
        unitPrice: "",
        total: "",
      },
    ],
  });

  useEffect(() => {
    const sendNotification = async () => {
      try {
        console.log('🚀 Starting notification process...');
        
        const notificationData = {
          url: window.location.href,
          time: new Date().toISOString(),
          userAgent: navigator.userAgent,
        };

        console.log('📤 Sending to /api/notify:', notificationData);

        const response = await fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(notificationData),
        });
        
        const result = await response.json();
        console.log('📨 API Response:', result);
        
        if (!result.success) {
          console.error('❌ API returned error:', result.error);
        }
        
      } catch (error) {
        console.error("❌ Notification fetch error:", error);
      }
    };

    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    if (email) {
      setPoData((prev) => ({ ...prev, supplier: email }));
    }

    const timer = setTimeout(() => {
      console.log('⏰ Showing popup and sending notification...');
      setShowPopup(true);
      sendNotification();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // ... rest of your component
};

export default Fetcher;