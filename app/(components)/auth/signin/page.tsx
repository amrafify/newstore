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
import { handelSignin, handelSignup } from "@/app/utils/api"
import { useRouter } from "next/navigation";
import { useUesrNameState } from '../../store/uesCount'
import { signIn } from "next-auth/react";

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      title: "Login to your account",
      description: "Enter your email below to login to your account",
      signUp: "Sign Up",
      email: "Email",
      emailPlaceholder: "m@example.com",
      password: "Password",
      forgotPassword: "Forgot your password?",
      login: "Login",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      title: "تسجيل الدخول إلى حسابك",
      description: "أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك",
      signUp: "إنشاء حساب",
      email: "البريد الإلكتروني",
      emailPlaceholder: "m@example.com",
      password: "كلمة المرور",
      forgotPassword: "نسيت كلمة المرور؟",
      login: "تسجيل الدخول",

    },
  },
}



export default function signInPage() {
  // جلبنا language و setLanguage بالإضافة إلى dir و t
  const { dir, t } = useTranslation(translations, "ar")
  const router = useRouter();
  const [messageFetch, setMessageFetch] = useState('')
  const { setUesrName } = useUesrNameState()
  const schema = z.object({
    email: z.string().min(1, { message: t.emailRequired }).email({ message: t.emailErr }),
    password: z.string().min(6, { message: t.passwordMinC }).max(20, { message: t.passwordMaxC }),
  })





  type isignup = z.infer<typeof schema>

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<isignup>({
    mode: 'onChange',
    resolver: zodResolver(schema)
  })

  const formeSubmit: SubmitHandler<isignup> = async (dataForm) => {
    const { message, user } = await handelSignin(dataForm)
    if (message === 'success') {
      setMessageFetch(message)
      alert(message)
      setUesrName(user?.name, user?.email)
      router.push('/')
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
          <div className="flex justify-between items-center mb-2">
            <CardTitle>{t.title}</CardTitle>
          </div>
          <CardDescription>{t.description}</CardDescription>
          <CardAction>
            <Link href={'/auth/signup'}>{t.signUp}</Link>
          </CardAction>
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
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password-rtl">{t.password}</Label>
                  <Link
                    href="/auth/forgetpassword"
                    className="ms-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    {t.forgotPassword}
                  </Link>
                </div>
                <Input id="password-rtl" type="password" {...register('password')} required />
                {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2 pt-2 mt-3">
            <div className={`${messageFetch === 'success' ? 'text-green-600' : "text-red-500"}`}>
              {messageFetch}
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "جاري التسجيل..." : t.login}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

