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
import { CheckOutCash } from "@/app/utils/api"
import { useRouter } from "next/navigation";


const translations: Translations = {
    en: {
        dir: "ltr",
        values: {
            title: "Check Out your order",
            phone: "Your Phone Number",
            city: "City",
            details: "Details Addres",
            phoneRequired: "phone number is required",
            phoneErr: "Invalid phone number",
            checkOut: "Check Out",
            detailsnameErr: "details is required",
            cityErr: "city is required",
        },
    },
    ar: {
        dir: "rtl",
        values: {
            title: "Check Out your order",
            phone: "Your Phone Number",
            city: "City",
            details: "Details Addres",
            login: "Login",
            phoneRequired: "رقم المحمول مطلوب",
            phoneErr: "رقم التليفون غير صحيح",
            detailsnameErr: "details is required",
            cityErr: "city is required",
            checkOut: "Check Out",
        },
    },
}



export default function CheckOutPage() {
    // جلبنا language و setLanguage بالإضافة إلى dir و t
    const { dir, t } = useTranslation(translations, "ar")
    const router = useRouter();
    const [messageFetch, setMessageFetch] = useState('')

    const schema = z.object({
        shippingAddress: z.object({
            details: z.string().min(3, { message: t.detailsnameErr }),
            phone: z.string().trim().min(1, { message: t.phoneRequired }).regex(/^(?:\+20|0020)?01[0125]\d{8}$/, { message: t.phoneErr }),
            city: z.string().min(3, { message: t.cityErr }),
        })
    })





    type Checkout = z.infer<typeof schema>

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Checkout>({
        mode: 'onChange',
        resolver: zodResolver(schema)
    })

    const formeSubmit: SubmitHandler<Checkout> = async (dataForm) => {
        const { status, data } = await CheckOutCash(dataForm)
        if (status === 'success') {
            setMessageFetch(status)
            alert(status)
            router.push('/home/cart/checkout/order-summary')
            localStorage.removeItem('cartid')
            localStorage.setItem('uesrId', data.user)
            localStorage.setItem('orderId', data.id);
            reset();
        } else {
            setMessageFetch(status)
        }
        console.log(status, 'data');
        console.log(dataForm);
    }
    return (
        <div className="flex justify-center items-center h-screen w-[50%]">
            <Card className="w-full max-w-sm" dir={dir}>

                <CardHeader>
                    {/* تم وضع سلكتور اللغات هنا في رأس البطاقة */}
                    <div className="flex justify-between items-center mb-2">
                        <CardTitle>{t.title}</CardTitle>
                    </div>
                </CardHeader>
                <form onSubmit={handleSubmit(formeSubmit)}>
                    <CardContent>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="details-rtl">{t.details}</Label>
                                <Input
                                    id="details-rtl"
                                    type="text"
                                    {...register('shippingAddress.details')}
                                    required
                                />
                                {errors.shippingAddress?.details && <span className="text-red-500 text-xs">{errors.shippingAddress?.message}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="city-rtl">{t.city}</Label>
                                <Input
                                    id="city-rtl"
                                    type="text"
                                    {...register('shippingAddress.city')}
                                    required
                                />
                                {errors.shippingAddress?.city && <span className="text-red-500 text-xs">{errors.shippingAddress?.city.message}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone-rtl">{t.phone}</Label>
                                <Input
                                    id="phone-rtl"
                                    type="tel"
                                    {...register('shippingAddress.phone')}
                                    required
                                />
                                {errors.shippingAddress?.phone && <span className="text-red-500 text-xs">{errors.shippingAddress?.phone.message}</span>}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-2 pt-2 mt-3">
                        <div className={`${messageFetch === 'success' ? 'text-green-600' : "text-red-500"}`}>
                            {messageFetch}
                        </div>
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? "جاري التسجيل..." : t.checkOut}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

