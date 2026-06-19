import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const enquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  trip: z.string().trim().max(80),
  dates: z.string().trim().max(120).optional().or(z.literal("")),
  people: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Tell us a little about your trip").max(2000),
  safari: z.string().trim().max(120).optional().or(z.literal("")),
});

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator(enquirySchema)
  .handler(async ({ data }) => {
    const ref = `PLA-${Date.now().toString(36).toUpperCase()}`;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let travelDate: string | null = null;
    if (data.dates) {
      const parsed = new Date(data.dates);
      if (!isNaN(parsed.getTime())) travelDate = parsed.toISOString().slice(0, 10);
    }
    const { error } = await supabaseAdmin.from("bookings").insert({
      reference: ref,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      trip: data.safari || data.trip,
      travel_date: travelDate,
      travellers: data.people || null,
      message: data.message,
      status: "new",
    });
    if (error) {
      console.error("[enquiry] insert failed", error);
      throw new Error("Could not save your enquiry. Please try again.");
    }
    return {
      ok: true as const,
      reference: ref,
      receivedAt: new Date().toISOString(),
    };
  });