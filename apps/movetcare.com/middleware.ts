import { NextRequest, NextResponse } from "next/server";
const DEBUG = true;
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    if (DEBUG) console.log("request.nextUrl", request.nextUrl);
    const params = Object.fromEntries(
      new URLSearchParams(request.nextUrl.search).entries()
    );
    if (DEBUG) console.log("params", params);
    const linkParams = Object.fromEntries(
      new URLSearchParams(params.link).entries()
    );
    if (DEBUG) console.log("linkParams", linkParams);
    if (linkParams?.mode === "signIn")
      return NextResponse.redirect(
        (request.nextUrl.hostname === "localhost"
          ? "http://localhost:3001"
          : "https://app.movetcare.com") +
          `/account/?mode=${linkParams?.mode}&oobCode=${linkParams?.oobCode}&continueUrl=${linkParams?.continueUrl}&lang=${linkParams?.lang}&apiKey=${linkParams?.apiKey}`
      );
  }
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
