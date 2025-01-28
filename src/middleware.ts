import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { User } from './models/User/User';


async function checkAuth() {
    const cookiesStore = await cookies()
    const auth_token = cookiesStore.get('auth_token')
    if (auth_token) {
        const auth_user = jwt.decode(auth_token.value) as User
        if (auth_user != null) {
            return {
                name: auth_user.name,
                role: auth_user.role
            } as User
        }
    }
    return new User()
}

export async function middleware(req: NextRequest) {
    
    if (!(await checkAuth()).name) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)',],
};
