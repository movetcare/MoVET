import { NextRequest, NextResponse } from "next/server";
const DEBUG = false;
export function middleware(request: NextRequest) {
  if (DEBUG) console.log("request.nextUrl", request.nextUrl);
  if (request.nextUrl.pathname === "/pharmacy/") {
    return NextResponse.redirect("https://movetcare.vetsfirstchoice.com/");
  } else if (
    request.nextUrl.pathname === "/checkin/" ||
    request.nextUrl.pathname === "/check-in/"
  ) {
    return NextResponse.redirect(
      request.nextUrl.hostname === "localhost"
        ? "http://localhost:3001/appointment-check-in"
        : "https://app.movetcare.com/appointment-check-in"
    );
  } else if (
    request.nextUrl.pathname === "/payment/" ||
    request.nextUrl.pathname === "/update-payment/" ||
    request.nextUrl.pathname === "/change-payment/"
  ) {
    return NextResponse.redirect(
      request.nextUrl.hostname === "localhost"
        ? "http://localhost:3001/update-payment-method"
        : "https://app.movetcare.com/update-payment-method"
    );
  }
}
