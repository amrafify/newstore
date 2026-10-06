"use client"
import React, { useEffect, useState } from 'react'
import Link from "next/link"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react" // تأكد من تثبيته lucide-react لو لم يكن موجوداً
import {
    LanguageSelector,
    useTranslation,
    type Translations,
    type Language,
} from "@/components/language-selector"
import { Button } from "@/components/ui/button"
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'
import { useCountOfCartStore } from '../store/uesCount'

const navTranslations: Translations = {
    en: {
        dir: "ltr",
        values: {
            home: "Home",
            products: "products",
            login: "Login",
            logout: 'Logout'
        },
    },
    ar: {
        dir: "rtl",
        values: {
            home: "الرئيسية",
            products: "المنتجات",
            login: "تسجيل الدخول",
            logout: "تسجيل الخروج"
        },
    },
}

const availableLanguages: Language[] = ['en', 'ar']

export function Navbar() {
    const router = useRouter()
    const { language, setLanguage, dir, t } = useTranslation(navTranslations, "en")
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)
    const [isLoggedIn, setIsLoggedIn] = React.useState(false)
    const { numOfCartItems } = useCountOfCartStore()
    // دالة لفحص حالة التوكن وتحديث الـ State
    const checkAuthStatus = () => {
        const token = Cookies.get('token') // أو اسم الكوكي عندك
        if (token) {
            setIsLoggedIn(true)
        } else {
            setIsLoggedIn(false)
        }
    }

    React.useEffect(() => {
        setMounted(true)
        checkAuthStatus() // الفحص عند التحميل الأول

        // الاستماع للحدث المخصص عند تسجيل الدخول أو الخروج
        window.addEventListener('auth-changed', checkAuthStatus)

        // تنظيف الحدث عند إلغاء تحميل المكون
        return () => {
            window.removeEventListener('auth-changed', checkAuthStatus)
        }
    }, [])
    const handleLogout = () => {
        Cookies.remove('token') // مسح الكوكي
        setIsLoggedIn(false)

        // إطلاق إشارة للناف بار وباقي التطبيق أن الحالة تغيرت
        window.dispatchEvent(new Event("auth-changed"))

        router.push('/auth/signin')
    }
    // لتجنب مشاكل الـ Hydration في Next.js عند تحميل الثيم
    useEffect(() => setMounted(true), [],)

    return (
        <header className="w-full border-b bg-white dark:bg-zinc-950 dark:border-zinc-800 shadow-sm transition-colors fixed mb-4 z-50" dir={dir}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                {/* روابط التنقل */}
                <div className="flex items-center gap-6">
                    <Link href="/" className="font-bold text-lg text-amber-800 dark:text-amber-500">
                        {t.home}
                    </Link>
                    <Link href="home/product" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
                        {t.products}
                    </Link>
                </div>

                {/* الأدوات (اللغة + الدارك مود + زر الدخول) */}
                <div className="flex items-center gap-3">

                    {/* أداة اختيار اللغة */}
                    <LanguageSelector
                        languages={availableLanguages}
                        value={language}
                        onValueChange={(newLang) => setLanguage(newLang)}
                    />

                    {/* زر تبديل الدارك/لايت مود */}
                    {mounted && (
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="w-9 h-9"
                        >
                            {theme === "dark" ? (
                                <Sun className="h-4 w-4 text-amber-400" />
                            ) : (
                                <Moon className="h-4 w-4 text-slate-700" />
                            )}
                            <span className="sr-only">تبديل الوضع المظلم</span>
                        </Button>
                    )}
                    {numOfCartItems}

                    {/* زر تسجيل الدخول */}
                    {isLoggedIn ? (
                        <Button
                            onClick={() => handleLogout()}
                            variant="destructive"
                            className="text-sm font-medium px-4 py-2 transition"
                        >
                            {t.logout}
                        </Button>
                    ) : (
                        <Link
                            href="/auth/signin"
                            className="text-sm font-medium px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg transition"
                        >
                            {t.login}
                        </Link>
                    )}


                </div>

            </div>
        </header>
    )
}