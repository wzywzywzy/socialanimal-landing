import { z } from "zod";
import {
  appendWaitlistRow,
  isEmailAlreadyRegistered,
} from "@/lib/google-sheets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WaitlistSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  email: z.string().trim().toLowerCase().email().max(254),
  consentEmail: z.boolean(),
  consentPrivacy: z.literal(true),
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = WaitlistSchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json({ error: "invalid_input" }, { status: 400 });
  }

  const data = parsed.data;

  try {
    if (await isEmailAlreadyRegistered(data.email)) {
      return Response.json({ ok: true, alreadyRegistered: true });
    }

    await appendWaitlistRow(data);
    return Response.json({ ok: true, alreadyRegistered: false });
  } catch (error) {
    console.error("[waitlist] failed to write to Google Sheets", error);
    return Response.json({ error: "server_error" }, { status: 500 });
  }
}
