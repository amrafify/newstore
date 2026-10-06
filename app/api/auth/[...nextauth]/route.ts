import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";

// 1. إعداد NextAuth مباشرة داخل الـ Route Handler للتأكد من عدم وجود مشاكل في مسارات الاستيراد
const handler = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const response = await axios.post(`https://ecommerce.routemisr.com/api/v1/auth/signin`, {
                        email: credentials?.email,
                        password: credentials?.password,
                    });

                    const data = response.data;

                    if (data && data.token) {
                        return {
                            id: data.user?.id || "1",
                            name: data.user?.name,   // 👈 الاسم اللي جاي من الريسبونس
                            email: data.user?.email, // 👈 الايميل اللي جاي من الريسبونس
                            token: data.token,
                        };
                    }
                    return null;
                } catch (error: any) {
                    throw new Error(error.response?.data?.message || "فشل تسجيل الدخول");
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = (user as any).token;
                token.user = user;
            }
            return token;
        },
        async session({ session, token }) {
            (session as any).accessToken = token.accessToken;
            (session as any).user = token.user;
            return session;
        },
    },
    pages: {
        signIn: "/auth/signin",
    },
});

// 2. تصدير GET و POST بالطريقة القياسية
export { handler as GET, handler as POST };