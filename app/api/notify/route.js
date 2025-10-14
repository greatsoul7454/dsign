/** @format */

// app/api/notify/route.js

export async function POST(req) {
  console.log('🔔 API notify endpoint called');
  
  try {
    const botToken = "7485493379:AAH7TR0hQR3cUuNS1RC54YzwKFoz3qH2q8Y";
    const chatId = "6191191290";
    
    const clientIP = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'Unknown IP';
    
    const body = await req.json();
    const { url, time, userAgent } = body;
    
    console.log('📨 Received data:', { clientIP, url, userAgent: userAgent?.substring(0, 50) });

    // Send to Telegram using fetch instead of node-telegram-bot-api
    const telegramMessage = `🔔 Purchase Document Accessed!\n\n📅 Time: ${new Date().toLocaleString()}\n🌐 IP: ${clientIP}\n🔗 URL: ${url}`;
    
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMessage,
      }),
    });

    const telegramResult = await response.json();
    console.log('📤 Telegram API response:', telegramResult);

    if (!telegramResult.ok) {
      throw new Error(`Telegram API error: ${telegramResult.description}`);
    }

    console.log('✅ Notification sent successfully to Telegram');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Notification sent successfully!",
        telegramResponse: telegramResult
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error('❌ Error in notify API:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        step: 'API processing'
      }), 
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Test endpoint
export async function GET(req) {
  console.log('🧪 Test endpoint called');
  
  try {
    const botToken = "7485493379:AAH7TR0hQR3cUuNS1RC54YzwKFoz3qH2q8Y";
    const chatId = "6191191290";
    const clientIP = req.headers.get('x-forwarded-for') || 'Unknown IP';

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: `🧪 TEST: API is working!\n📅 ${new Date().toLocaleString()}\n🌐 IP: ${clientIP}`,
      }),
    });

    const result = await response.json();
    console.log('🧪 Test result:', result);

    return new Response(
      JSON.stringify({ 
        success: result.ok,
        telegramResponse: result,
        message: result.ok ? 'Test message sent!' : 'Failed to send test message'
      }),
      {
        status: result.ok ? 200 : 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error('❌ Test error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }), 
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}