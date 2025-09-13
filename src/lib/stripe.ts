import Stripe from "stripe";

// Initialize Stripe with your secret key
const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-08-27.basil",
});

export interface StripeProduct {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  default_price: Stripe.Price | null;
  metadata: {
    category?: string;
    categories?: string;
  };
}

export interface ProcessedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  categories: string[];
  stripePriceId: string;
}

export async function getStripeProducts(): Promise<ProcessedProduct[]> {
  try {
    // Fetch products from Stripe
    const products = await stripe.products.list({
      active: true,
      expand: ["data.default_price"],
    });

    // Process the products to match our component's expected format
    const processedProducts: ProcessedProduct[] = products.data
      .filter(
        (product) =>
          product.default_price !== null &&
          typeof product.default_price === "object" &&
          "unit_amount" in product.default_price &&
          product.default_price.unit_amount !== null
      )
      .map((product) => ({
        id: product.id,
        name: product.name,
        price: ((product.default_price as Stripe.Price).unit_amount || 0) / 100, // Convert from cents to dollars
        image: product.images[0] || "/images/placeholder.jpg",
        description: product.description || "No description available",
        categories: (
          product.metadata.categories ||
          product.metadata.category ||
          "Uncategorized"
        )
          .split(",")
          .map((cat) => cat.trim())
          .filter((cat) => cat.length > 0),
        stripePriceId: (product.default_price as Stripe.Price).id,
      }));

    return processedProducts;
  } catch (error) {
    console.error("Error fetching Stripe products:", error);
    // Return empty array or fallback products in case of error
    return [];
  }
}

export async function getStripeProductById(
  productId: string
): Promise<ProcessedProduct | null> {
  try {
    // Fetch a single product from Stripe
    const product = await stripe.products.retrieve(productId, {
      expand: ["default_price"],
    });

    // Check if product exists and has a valid price
    if (
      product &&
      product.default_price !== null &&
      typeof product.default_price === "object" &&
      product.default_price.unit_amount !== null
    ) {
      return {
        id: product.id,
        name: product.name,
        price: ((product.default_price as Stripe.Price).unit_amount || 0) / 100, // Convert from cents to dollars
        image: product.images[0] || "/images/placeholder.jpg",
        description: product.description || "No description available",
        categories: (
          product.metadata.categories ||
          product.metadata.category ||
          "Uncategorized"
        )
          .split(",")
          .map((cat) => cat.trim())
          .filter((cat) => cat.length > 0),
        stripePriceId: (product.default_price as Stripe.Price).id,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching Stripe product:", error);
    return null;
  }
}

export async function createCheckoutSession(
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return session;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}
