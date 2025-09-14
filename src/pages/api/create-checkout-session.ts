import type { APIRoute } from "astro";
import { createCheckoutSession } from "../../lib/stripe";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { priceId } = await request.json();

    if (!priceId) {
      return new Response(JSON.stringify({ error: "Price ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get the origin from the request headers
    const origin = request.headers.get("origin") || "http://localhost:4321";
    const successUrl = `${origin}/success`;
    const cancelUrl = `${origin}/product`;

    console.log("Creating checkout session with:", {
      priceId,
      successUrl,
      cancelUrl,
      origin,
    });

    const session = await createCheckoutSession(priceId, successUrl, cancelUrl);

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Failed to create checkout session",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
