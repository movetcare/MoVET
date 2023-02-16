import { NextRequest, NextResponse } from "next/server";
export function middleware(request: NextRequest) {
  if (
    request.nextUrl.hostname === "localhost" &&
    request.nextUrl.pathname === "/test/login/"
  ) {
    return NextResponse.redirect(
      "http://localhost:3002/test/login/zfBGBJfVTADzCVq2pvd8t8X8YXi4Bv4a"
    );
  }
}
