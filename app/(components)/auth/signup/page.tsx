"use client"
import React, { useEffect, useState } from 'react'
import {
    useTranslation,
    type Translations,
} from "@/components/language-selector"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useForm, SubmitHandler } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { handelSignup } from "@/app/utils/api"
import { useRouter } from "next/navigation";

const translations: Translations = {
    en: {
        dir: "ltr",
        values: {
            title: "Sign Up to New account",
            description: "Enter your email below to sign up to your account",
            signIn: "Sign In",
            name: "Name",
            phone: "Phone Number",
            email: "Email",
            emailPlaceholder: "m@example.com",
            password: "Password",
            rePassword: "Confirm Password",
            signUpBtn: "Sign Up",
            UsernameErr: "Username is required",
            emailRequired: "email is required",
            emailErr: "Invalid email address",
            passwordMinC: "password must be at least 6 characters long",
            passwordMaxC: "password must be at least 20 characters long",
            phoneRequired: "phone number is required",
            phoneErr: "Invalid phone number",
        },
    },
    ar: {
        dir: "rtl",
        values: {
            title: "تسجيل حساب جديد",
            description: "أدخل بريدك الإلكتروني أدناه لتسجيل حسابك",
            signIn: "تسجيل الدخول",
            email: "البريد الإلكتروني",
            name: "الاسم",
            phone: "رقم التليفون",
            emailPlaceholder: "m@example.com",
            password: "كلمة المرور",
            rePassword: "تأكيد كلمة المرور",
            signUpBtn: "إنشاء حساب",
            UsernameErr: "الاسم مطلوب",
            emailRequired: "الايميل مطلوب",
            emailErr: "الايميل خطأ",
            passwordMinC: "كلمه المرور يجب ان تكون من 6 حروف او كلمات على الاقل",
            passwordMaxC: "كلمه المرور يجب ان تكون من 20 حروف او كلمات على الاقل",
            phoneRequired: "رقم المحمول مطلوب",
            phoneErr: "رقم التليفون غير صحيح",
        },
    },
}

export default function SignUp() {
    const { dir, t } = useTranslation(translations, "ar")
    const router = useRouter();
    const [messageFetch, setMessageFetch] = useState('')
    const schema = z.object({
        name: z.string().min(3, { message: t.UsernameErr }),
        email: z.string().min(1, { message: t.emailRequired }).email({ message: t.emailErr }),
        password: z.string().min(6, { message: t.passwordMinC }).max(20, { message: t.passwordMaxC }),
        phone: z.string().trim().min(1, { message: t.phoneRequired }).regex(/^(?:\+20|0020)?01[0125]\d{8}$/, { message: t.phoneErr }),
        rePassword: z.string().min(6, { message: "Passwords don't match" }),
    }).refine((data) => data.rePassword === data.password, {
        message: "Passwords don't match",
        path: ['rePassword'], // تم تصحيح الـ path هنا ليتطابق مع اسم الحقل
    })

    type isignup = z.infer<typeof schema>

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<isignup>({
        mode: 'onChange',
        resolver: zodResolver(schema)
    })

    const formeSubmit: SubmitHandler<isignup> = async (dataForm) => {
        const { message } = await handelSignup(dataForm)
        if (message === 'success') {
            setMessageFetch(message)
            alert(message)
            router.push('/auth/signin')
            reset();
        } else {
            setMessageFetch(message)
        }
        console.log(message, 'data');


    }

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] pt-20 pb-10">
            <Card className="w-full max-w-sm" dir={dir}>
                <CardHeader>
                    <div className="flex justify-between items-center mb-2">
                        <CardTitle>{t.title}</CardTitle>
                    </div>
                    <CardDescription>{t.description}</CardDescription>
                    <CardAction>
                        <Link href={'/auth/signin'} className="text-sm underline">{t.signIn}</Link>
                    </CardAction>
                </CardHeader>

                {/* تم نقل الـ form لتشمل الـ Content والـ Footer لكي يعمل زر الإرسال بداخلها */}
                <form onSubmit={handleSubmit(formeSubmit)}>
                    <CardContent>
                        <div className="flex flex-col gap-4">

                            {/* الاسم */}
                            <div className="grid gap-1">
                                <Label htmlFor="name-rtl">{t.name}</Label>
                                <Input id="name-rtl" type="text" {...register('name')} />
                                {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
                            </div>

                            {/* البريد الإلكتروني */}
                            <div className="grid gap-1">
                                <Label htmlFor="email-rtl">{t.email}</Label>
                                <Input id="email-rtl" type="email" placeholder={t.emailPlaceholder} {...register('email')} />
                                {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                            </div>

                            {/* الهاتف */}
                            <div className="grid gap-1">
                                <Label htmlFor="phone-rtl">{t.phone}</Label>
                                <Input id="phone-rtl" type="text" {...register('phone')} />
                                {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>}
                            </div>

                            {/* كلمة المرور */}
                            <div className="grid gap-1">
                                <Label htmlFor="password-rtl">{t.password}</Label>
                                <Input id="password-rtl" type="password" {...register('password')} />
                                {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
                            </div>

                            {/* تأكيد كلمة المرور */}
                            <div className="grid gap-1">
                                <Label htmlFor="rePassword-rtl">{t.rePassword}</Label>
                                <Input id="rePassword-rtl" type="password" {...register('rePassword')} />
                                {errors.rePassword && <span className="text-red-500 text-xs">{errors.rePassword.message}</span>}
                            </div>

                        </div>
                    </CardContent>

                    <CardFooter className="flex-col gap-2 pt-2 mt-3">
                        <div className={`${messageFetch === 'success' ? 'text-green-600' : "text-red-500"}`}>

                            {messageFetch}
                        </div>
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? "جاري التسجيل..." : t.signUpBtn}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}