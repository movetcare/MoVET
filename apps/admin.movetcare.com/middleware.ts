import { NextRequest, NextResponse } from "next/server";
const DEBUG = false;
export function middleware(request: NextRequest) {
  if (
    request.nextUrl.hostname === "localhost" &&
    request.nextUrl.pathname === "/test/login/"
  ) {
    if (DEBUG) console.log("Request Data =>", request);
    return NextResponse.redirect(
      "http://localhost:3002/test/login/zfBGBJfVTADzCVq2pvd8t8X8YXi4Bv4a"
    );
  }
}
