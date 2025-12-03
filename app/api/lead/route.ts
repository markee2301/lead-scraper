import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Webhook URL is not configured." },
      { status: 500 }
    );
  }

  try {
    const { niche, location } = await request.json();

    if (!niche || !location) {
      return NextResponse.json(
        { error: "Niche and location are required." },
        { status: 400 }
      );
    }

    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ niche, location }),
      cache: "no-store",
    });

    const rawBody = await webhookResponse.text();

    if (!webhookResponse.ok) {
      console.error("n8n webhook error:", webhookResponse.status, rawBody);
      return NextResponse.json(
        {
          error: "Failed to forward payload to the webhook.",
          status: webhookResponse.status,
          body: rawBody,
        },
        { status: webhookResponse.status }
      );
    }

    let leads: unknown;
    try {
      leads = JSON.parse(rawBody);
    } catch {
      console.error("Failed to parse webhook JSON:", rawBody);
      leads = [];
    }

    return NextResponse.json({ leads });
  } catch (error) {
    console.error("Webhook submit error:", error);
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
