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
import { handelForgetPassword, handelSignin, handelSignup } from "@/app/utils/api"
import { useRouter } from "next/navigation";


const translations: Translations = {
    en: {
        dir: "ltr",
        values: {
            title: "Forgot your password?",
            description: "Enter email address that you use for your account below",
            email: "Email",
            emailPlaceholder: "m@example.com",
            forgetPassword: 'Request a reset code'
        },
    },
    ar: {
        dir: "rtl",
        values: {
            title: "هل نسيت كلمة المرور الخاصة بك؟",
            description: "أدخل عنوان البريد الإلكتروني الذي تستخدمه لحسابك أدناه",
            email: "البريد الإلكتروني",
            emailPlaceholder: "m@example.com",
            forgetPassword: 'طلب كود إعادة التعيين'
        },
    },
}



export default function forgetPassword() {
    // جلبنا language و setLanguage بالإضافة إلى dir و t
    const { dir, t } = useTranslation(translations, "ar")
    const router = useRouter();
    const [messageFetch, setMessageFetch] = useState('')
    const schema = z.object({
        email: z.string().min(1, { message: t.emailRequired }).email({ message: t.emailErr }),
    })

    type isignup = z.infer<typeof schema>

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<isignup>({
        mode: 'onChange',
        resolver: zodResolver(schema)
    })

    const formeSubmit: SubmitHandler<isignup> = async (dataForm) => {
        const { message } = await handelForgetPassword(dataForm)
        if (message === 'Reset code sent to your email') {
            setMessageFetch(message)
            alert(message)
            router.push('/auth/verifyresetcode')
            reset();
        } else {
            setMessageFetch(message)
        }
        console.log(message, 'data');
        console.log(dataForm);



    }
    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-full max-w-sm" dir={dir}>

                <CardHeader>
                    {/* تم وضع سلكتور اللغات هنا في رأس البطاقة */}
                    <div className="flex justify-center items-center mb-2">
                        <CardTitle>{t.title}</CardTitle>
                    </div>
                    <CardDescription>{t.description}</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit(formeSubmit)}>
                    <CardContent>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email-rtl">{t.email}</Label>
                                <Input
                                    id="email-rtl"
                                    type="email"
                                    {...register('email')}
                                    placeholder={t.emailPlaceholder}
                                    required
                                />
                                {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-2 pt-2 mt-3">
                        <div className={`${messageFetch === 'Reset code sent to your email' ? 'text-green-600' : "text-red-500"}`}>
                            {messageFetch}
                        </div>
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? "جاري التسجيل..." : t.forgetPassword}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}