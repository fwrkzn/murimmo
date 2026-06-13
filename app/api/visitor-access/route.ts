import { NextResponse } from "next/server";
import { normalizeAccessCode, VISITOR_ACCESS_COOKIE } from "@/lib/access-codes";
import { getValidAccessCode } from "@/lib/access-codes-server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { code?: string };
    const code = normalizeAccessCode(body.code ?? "");

    if (!code) {
      return NextResponse.json({ error: "Saisissez un code d'accès." }, { status: 400 });
    }

    const validCode = await getValidAccessCode(code);

    if (!validCode) {
      return NextResponse.json({ error: "Ce code est invalide ou expiré." }, { status: 401 });
    }

    const response = NextResponse.json({ code: validCode.code });

    response.cookies.set(VISITOR_ACCESS_COOKIE, validCode.code, {
      expires: new Date(validCode.expires_at),
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Impossible de vérifier le code d'accès pour le moment." },
      { status: 500 }
    );
  }
}
