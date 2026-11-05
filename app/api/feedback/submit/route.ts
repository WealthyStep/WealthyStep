import { POST as handleProgramSubmit } from "@/app/api/program/submit/route";

/**
 * Legacy route forwarder for backward compatibility.
 * Delegates to /api/program/submit.
 */
export async function POST(request: Request) {
  return handleProgramSubmit(request);
}
