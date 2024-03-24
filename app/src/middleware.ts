import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";

import { SessionData, sessionOptions } from "./actions/auth";

export async function middleware(request: NextRequest) {

    const session = await getIronSession<SessionData>(
        cookies(),
        sessionOptions
    )

    if (session.isLoggedIn === undefined) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
}

export const config = {
    matcher: [
        "/deliveries/:path*"
    ]
}