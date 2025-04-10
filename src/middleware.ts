import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import {authorize} from "@/models/User/UserService";

export async function middleware(req: NextRequest) {
    const result = await authorize()
    if (!result) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
}
// С Api нужно быть внимательным. Если middleware будет работать при скачивании и загрузке будет плохо.
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)',],
    runtime: "nodejs"
};
