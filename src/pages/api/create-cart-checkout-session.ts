import type { APIRoute } from "astro";
import { createCartCheckoutSession } from "../../lib/stripe";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Get the raw request body first
    const body = await request.text();
    console.log("Raw request body:", body);

    if (!body) {
      return new Response(JSON.stringify({ error: "Request body is empty" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let lineItems;
    try {
      const parsedBody = JSON.parse(body);
      lineItems = parsedBody.lineItems;
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
      return new Response(
        JSON.stringify({ error: "Line items are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Validate line items structure
    for (const item of lineItems) {
      if (!item.price || !item.quantity || item.quantity <= 0) {
        return new Response(
          JSON.stringify({ error: "Invalid line item structure" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    }

    // Derive origin from the request URL (more reliable in production)
    const { origin } = new URL(request.url);
    const successUrl = `${origin}/success`;
    const cancelUrl = `${origin}/cart`;

    console.log("Creating cart checkout session with:", {
      lineItems,
      successUrl,
      cancelUrl,
      origin,
    });

    const session = await createCartCheckoutSession(
      lineItems,
      successUrl,
      cancelUrl,
    );

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error creating cart checkout session:", error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Failed to create cart checkout session",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
