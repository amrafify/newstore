"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
    CheckCircle,
    Download,
    MapPin,
    Package,
    Printer,
    Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { orderSummary } from "@/app/utils/api";
import { useUesrNameState } from "@/app/(components)/store/uesCount";
import Link from "next/link";

const OrderSummary1 = ({ className }: { className?: string }) => {
    const { uesrEmail } = useUesrNameState();

    // جلب البيانات عبر React Query
    const { data, isLoading, isError } = useQuery({
        queryKey: ['orderSummary'],
        queryFn: orderSummary,
    });

    const storedOrderId = typeof window !== 'undefined' ? localStorage.getItem('orderId') : null;

    // تحديد الطلب الحالي بدقة (الاعتماد على الـ ID المخزن أو جلب أحدث طلب تلقائياً)
    const fainalData = React.useMemo(() => {
        if (!data || data.length === 0) return null;

        if (storedOrderId) {
            const found = data.find((item: any) => item.id === storedOrderId);
            if (found) return found;
        }

        // إذا لم يوجد ID مخزن أو لم يتم العثور عليه، يختار أحدث طلب تلقائياً (آخر عنصر)
        return data[data.length - 1];
    }, [data, storedOrderId]);

    // تنسيق الأسعار بشكل آمن لمنع ظهور NaN
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(price || 0);
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-muted-foreground">Loading order details...</p>
            </div>
        );
    }

    if (isError || !fainalData) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-destructive">Failed to load order details. Please try again.</p>
            </div>
        );
    }

    // تنسيق التاريخ بشكل آمن لمنع ظهور Invalid Date
    const formattedDate = fainalData?.createdAt
        ? new Date(fainalData.createdAt).toLocaleDateString('en-US', {
            month: "long",
            day: "numeric",
            year: "numeric"
        })
        : "Recent";

    const orderNumber = `ORD-2026-${fainalData?.id || '000'}`;

    return (
        <section className={cn("py-16 md:py-24", className)}>
            <div className="container max-w-4xl">
                {/* Success Header */}
                <div className="mb-10 text-center">
                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-500/10">
                        <CheckCircle className="size-8 text-emerald-600" />
                    </div>
                    <h1 className="mb-2 text-2xl font-bold tracking-tight md:text-3xl">
                        Thank you for your order!
                    </h1>
                    <p className="text-muted-foreground">
                        A confirmation email has been sent to{" "}
                        <span className="font-medium text-foreground">{uesrEmail || "customer@example.com"}</span>
                    </p>
                </div>

                {/* Order Info Bar */}
                <Card className="mb-6 shadow-none">
                    <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4 md:p-6">
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                            <div>
                                <p className="text-sm text-muted-foreground">Order Number</p>
                                <p className="font-semibold">{orderNumber}</p>
                            </div>
                            <Separator
                                orientation="vertical"
                                className="hidden h-10 md:block"
                            />
                            <div>
                                <p className="text-sm text-muted-foreground">Order Date</p>
                                <p className="font-medium">{formattedDate}</p>
                            </div>
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10">
                            Order Confirmed
                        </Badge>
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column - Items & Totals */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Order Items */}
                        <Card className="shadow-none">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Package className="size-5" />
                                    Items Ordered
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {fainalData?.cartItems?.map((item: any, index: number) => (
                                    <div key={index}>
                                        <div className="flex gap-4">
                                            <div className="w-20 shrink-0">
                                                <AspectRatio
                                                    ratio={1}
                                                    className="overflow-hidden rounded-lg bg-muted"
                                                >
                                                    <img
                                                        src={item?.product?.imageCover}
                                                        alt={item?.product?.title || "Product image"}
                                                        className="size-full object-cover"
                                                    />
                                                </AspectRatio>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-medium">{item?.product?.title}</h3>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Qty: {item?.count}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">
                                                    {formatPrice(item?.price * item?.count)}
                                                </p>
                                                {item?.count > 1 && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {formatPrice(item?.price)} each
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {index < fainalData?.cartItems.length - 1 && (
                                            <Separator className="mt-4" />
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Order Totals */}
                        <Card className="shadow-none">
                            <CardContent className="p-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>{formatPrice(fainalData?.totalOrderPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Shipping</span>
                                        <span>
                                            {fainalData?.shippingPrice === 0
                                                ? "Free"
                                                : formatPrice(fainalData?.shippingPrice)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Tax</span>
                                        <span>{formatPrice(fainalData?.taxPrice)}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>Total Paid</span>
                                        <span>{formatPrice(fainalData?.totalOrderPrice)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Shipping & Payment */}
                    <div className="space-y-6">
                        {/* Shipping Information */}
                        <Card className="shadow-none">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <MapPin className="size-5" />
                                    Shipping Address
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="font-medium">{fainalData?.shippingAddress?.city}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {fainalData?.shippingAddress?.details}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        EGYPT
                                    </p>
                                </div>
                                <Separator />
                                <div className="flex items-start gap-3">
                                    <Truck className="mt-0.5 size-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            {fainalData?.paymentMethodType || "Standard Shipping"}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Payment: {fainalData?.paymentMethodType}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Card className="shadow-none">
                            <CardContent className="space-y-3 p-4">
                                <Button className="w-full" variant="default">
                                    <Package className="mr-2 size-4" />
                                    Track Order
                                </Button>
                                <Button className="w-full" variant="outline">
                                    <Download className="mr-2 size-4" />
                                    Download Receipt
                                </Button>
                                <Button className="w-full" variant="ghost">
                                    <Printer className="mr-2 size-4" />
                                    Print Order
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Continue Shopping */}
                <div className="mt-10 text-center">
                    <div className="flex flex-wrap justify-start gap-3">
                        <Button>
                            <Link href="/home/product/1">Continue Shopping</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OrderSummary1;