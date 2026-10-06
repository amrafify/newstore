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
import { handelForgetPassword, handelRestPassword, handelSignin, handelSignup } from "@/app/utils/api"
import { useRouter } from "next/navigation";


const translations: Translations = {
    en: {
        dir: "ltr",
        values: {
            title: "Set a new password",
            description: "Enter new password",
            email: "Email",
            emailPlaceholder: "m@example.com",
            password: "Enter New Password",
            forgetPassword: 'Request a reset code',
            messagescce: 'A password has been set',
            messagerr: 'error',
        },
    },
    ar: {
        dir: "rtl",
        values: {
            title: "تعيين كلمه مرور جديدة",
            description: "أدخل كلمة المرور الجديدة",
            email: "البريد الإلكتروني",
            emailPlaceholder: "m@example.com",
            password: "ادخل كلمه مرور جديدة",
            forgetPassword: 'طلب كود إعادة التعيين',
            messagescce: 'تم تعيين كلمة مرور ',
            messagerr: 'حدث خطأ',
        },
    },
}



export default function restPassword() {
    // جلبنا language و setLanguage بالإضافة إلى dir و t
    const { dir, t } = useTranslation(translations, "ar")
    const router = useRouter();
    const [messageFetch, setMessageFetch] = useState('')
    const schema = z.object({
        email: z.string().min(1, { message: t.emailRequired }).email({ message: t.emailErr }),
        newPassword: z.string().min(6, { message: t.passwordMinC }).max(20, { message: t.passwordMaxC }),
    })

    type isignup = z.infer<typeof schema>

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<isignup>({
        mode: 'onChange',
        resolver: zodResolver(schema)
    })

    const formeSubmit: SubmitHandler<isignup> = async (dataForm) => {
        const data = await handelRestPassword(dataForm)
        if (data === 200) {
            setMessageFetch(t.messagescce)
            alert(t.messagescce)
            router.push('/auth/signin')
            reset();
        } else {
            setMessageFetch(t.messagerr)
        }
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
                            <div className="grid gap-1">
                                <Label htmlFor="password-rtl">{t.password}</Label>
                                <Input id="password-rtl" type="password" {...register('newPassword')} />
                                {errors.newPassword && <span className="text-red-500 text-xs">{errors.newPassword.message}</span>}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-2 pt-2 mt-3">
                        <div className={`${messageFetch === t.messagescce ? 'text-green-600' : "text-red-500"}`}>
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