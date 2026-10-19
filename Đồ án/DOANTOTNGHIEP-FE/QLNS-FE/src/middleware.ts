import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export function middleware(req: NextRequest) {
  debugger
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;

  const { pathname } = req.nextUrl;
 if (!token && (pathname.startsWith("/admin") || pathname.startsWith("/client"))) {
  if (pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
  // Nếu là admin route nhưng role không phải admin -> chặn
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }  
  if (pathname.startsWith("/client") && role !== "client") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

// Chỉ áp dụng cho các route này
export const config = {
  matcher: ["/admin/:path*", "/client/:path*"]
};

