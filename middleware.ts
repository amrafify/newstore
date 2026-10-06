import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // افترض أن اسم الـ cookie هو "token"
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl
    const namePath = '/home'
    const isAuthRoute = pathname.startsWith('/auth')

    // حدد الصفحات التي تريد حمايتها (مثلاً صفحة البروفيل أو لوحة التحكم)
    if (request.nextUrl.pathname == '/') {
        //     // إعادة التوجيه إلى الصفحة الرئيسية (Home)
        return NextResponse.redirect(new URL('/home', request.url));
    }
    if (request.nextUrl.pathname.startsWith('/home') && !token) {
        //     // إعادة التوجيه إلى الصفحة الرئيسية (Home)
        return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

// حدد المسارات التي سيعمل عليها الميدل وير
export const config = {
    matcher: [
        /*
         * تطابق جميع مسارات الإشعارات والصفحات عدا:
         * - _next/static (الملفات الثابتة)
         * - _next/image (صور نكست)
         * - favicon.ico (أيقونة الموقع)
         * - ملفات الصور العامة (svg, png, jpg, etc.)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ]
}