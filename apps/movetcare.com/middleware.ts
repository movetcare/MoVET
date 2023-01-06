import { NextRequest, NextResponse } from "next/server";
const DEBUG = false;
const getEmailAddressFromUrl = (request: NextRequest): string => {
  if (DEBUG) console.log("request.nextUrl", request.nextUrl);
  const params = Object.fromEntries(
    new URLSearchParams(request.nextUrl.search).entries()
  );
  if (DEBUG) console.log("params?.email", params?.email);
  return params?.email || "";
};
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
          : request.nextUrl.hostname.includes("stage.")
          ? "https://stage.app.mocetcare.com"
          : "https://app.movetcare.com") +
          `/account/?mode=${linkParams?.mode}&oobCode=${linkParams?.oobCode}&continueUrl=${linkParams?.continueUrl}&lang=${linkParams?.lang}&apiKey=${linkParams?.apiKey}`
      );
  }
  if (request.nextUrl.pathname === "/pharmacy/")
    return NextResponse.redirect("https://movetcare.vetsfirstchoice.com/");
  else if (
    request.nextUrl.pathname === "/checkin/" ||
    request.nextUrl.pathname === "/check-in/"
  )
    return NextResponse.redirect(
      (request.nextUrl.hostname === "localhost"
        ? "http://localhost:3001/appointment-check-in"
        : request.nextUrl.hostname.includes("stage.")
        ? "https://stage.app.mocetcare.com/appointment-check-in"
        : "https://app.movetcare.com/appointment-check-in") +
        "?email=" +
        getEmailAddressFromUrl(request)
    );
  else if (
    request.nextUrl.pathname === "/payment/" ||
    request.nextUrl.pathname === "/update-payment/" ||
    request.nextUrl.pathname === "/change-payment/"
  )
    return NextResponse.redirect(
      (request.nextUrl.hostname === "localhost"
        ? "http://localhost:3001/update-payment-method"
        : request.nextUrl.hostname.includes("stage.")
        ? "https://stage.app.movetcare.com/update-payment-method"
        : "https://app.movetcare.com/update-payment-method") +
        "?email=" +
        getEmailAddressFromUrl(request)
    );
  else if (
    request.nextUrl.pathname === "/book-an-appointment/" ||
    request.nextUrl.pathname === "/schedule-an-appointment/" ||
    request.nextUrl.pathname === "/appointment-booking/"
  )
    return NextResponse.redirect(
      (request.nextUrl.hostname === "localhost"
        ? "http://localhost:3001/schedule-an-appointment"
        : request.nextUrl.hostname.includes("stage.")
        ? "https://stage.app.movetcare.com/schedule-an-appointment"
        : "https://app.movetcare.com/schedule-an-appointment") +
        "?email=" +
        getEmailAddressFromUrl(request)
    );
}
