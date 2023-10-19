import { NextRequest, NextResponse } from "next/server";
const DEBUG = false;
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    if (DEBUG) console.log("request.nextUrl", request.nextUrl);
    const params = Object.fromEntries(
      new URLSearchParams(request.nextUrl.search).entries(),
    );
    if (DEBUG) console.log("params", params);
    const linkParams = Object.fromEntries(
      new URLSearchParams(params.link).entries(),
    );
    if (DEBUG) console.log("linkParams", linkParams);
    if (linkParams?.mode === "signIn")
      return NextResponse.redirect(
        (request.nextUrl.hostname === "localhost"
          ? "http://localhost:3001"
          : "https://app.movetcare.com") +
          `/account/?mode=${linkParams?.mode}&oobCode=${linkParams?.oobCode}&continueUrl=${linkParams?.continueUrl}&lang=${linkParams?.lang}&apiKey=${linkParams?.apiKey}`,
      );
  }
}
