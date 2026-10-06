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
import { handelForgetPassword, handelRestCode, handelSignin, handelSignup } from "@/app/utils/api"
import { useRouter } from "next/navigation";


const translations: Translations = {
    en: {
        dir: "ltr",
        values: {
            title: "verify reset code",
            description: "Enter reset code",
            forgetPassword: 'Send',
            restCode: 'Rest Code',
            codeRequired: 'Rest Code Required'

        },
    },
    ar: {
        dir: "rtl",
        values: {
            title: "تأكيد رمز التحقيق",
            description: "أدخل رمز التحقيق",
            forgetPassword: 'أرسال',
            restCode: 'رمز التحقيق',
            codeRequired: 'مطلوب رمز التحقيق'

        },
    },
}



export default function verifyresetcode() {
    // جلبنا language و setLanguage بالإضافة إلى dir و t
    const { dir, t } = useTranslation(translations, "ar")
    const router = useRouter();
    const [messageFetch, setMessageFetch] = useState('')
    const schema = z.object({
        resetCode: z.string().min(1, { message: t.codeRequired }),
    })

    type isignup = z.infer<typeof schema>

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<isignup>({
        mode: 'onChange',
        resolver: zodResolver(schema)
    })

    const formeSubmit: SubmitHandler<isignup> = async (dataForm) => {
        const { message, status } = await handelRestCode(dataForm)
        if (status === "Success") {
            setMessageFetch(status)
            alert(status)
            router.push('/auth/restpassword')
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
                                <Label htmlFor="email-rtl">{t.restCode}</Label>
                                <Input
                                    id="email-rtl"
                                    type="text"
                                    {...register('resetCode')}
                                />
                                {errors.resetCode && <span className="text-red-500 text-xs">{errors.resetCode.message}</span>}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-2 pt-2 mt-3">
                        <div className={`${messageFetch === "Success" ? 'text-green-600' : "text-red-500"}`}>
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