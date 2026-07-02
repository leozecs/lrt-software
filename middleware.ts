import { NextResponse, type NextRequest } from "next/server";

/* A/B do hero: 50/50 na primeira visita, sticky por cookie.
   Variante B é servida por rewrite — a URL na barra continua "/". */

export function middleware(req: NextRequest) {
  const cookie = req.cookies.get("lrt-ab")?.value;
  const variant =
    cookie === "a" || cookie === "b" ? cookie : Math.random() < 0.5 ? "a" : "b";

  const res =
    variant === "b"
      ? NextResponse.rewrite(new URL("/b", req.url))
      : NextResponse.next();

  if (!cookie) {
    res.cookies.set("lrt-ab", variant, {
      maxAge: 60 * 60 * 24 * 90,
      path: "/",
      sameSite: "lax",
    });
  }
  return res;
}

export const config = { matcher: "/" };
