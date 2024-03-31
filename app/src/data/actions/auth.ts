import { cookies } from "next/headers"
import { SessionOptions, getIronSession } from "iron-session"

import { env } from "@/env"

export interface SessionData {
    token?: string
    sub?: string
    role?: 'ADMIN' | 'DELIVERYMAN'
    isLoggedIn: boolean
}

export const defaultSession: SessionData = {
    isLoggedIn: false
}

export const sessionOptions: SessionOptions = {
    password: env.NEXT_PUBLIC_SESSION_SECRET,
    cookieName: 'auth',
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }
}

export async function setAuthData(jwtToken: string) {    
    const payloadBase64 = jwtToken.split('.')[1]
    const payload = JSON.parse(atob(payloadBase64))

    const cookiesStore = cookies()
    cookiesStore.set('auth', JSON.stringify({
        payload
    }))
}

export async function getAuthData() {
    const cookiesStore = cookies()

    const auth = cookiesStore.get('auth')?.value

    if (!auth) {
        return null
    }

    return JSON.parse(auth)
}

export async function getSession() {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)

    if (!session.isLoggedIn) {
        session.isLoggedIn = defaultSession.isLoggedIn
    }

    return session
}