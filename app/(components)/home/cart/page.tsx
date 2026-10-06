"use client";

import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Loading from "../loading";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deletCart, getCart, updateCart } from "@/app/utils/api";
import { useCountOfCartStore } from "../../store/uesCount";
import { useRouter } from "next/navigation";

interface CartItem {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    variant?: string;
}

interface Product {
    count: number;
    product: {
        _id: string;
        title: string;
        imageCover: string;
        brand: {
            _id: string;
            name: string;
            image: string;
            slug: string;
        };
    };
    price: number;
    priceAfterDiscount: number;

    category: {
        _id: string;
        name: string;
        image: string;
        slug: string;
    };
}

type ProductList = Product[];

const ShoppingCart2 = () => {
    const { setCountOfCart } = useCountOfCartStore()
    const queryClient = useQueryClient();
    const router = useRouter();

    // 1. استدعاء جميع الـ Hooks في أعلى المكون بالترتيب الصحيح ودون أي شروط تسبقها
    const { data, isLoading, isError } = useQuery({
        queryKey: ['cart'],
        queryFn: getCart,
        staleTime: 0,
        refetchOnWindowFocus: true,
    });

    const updateCartMutation = useMutation({
        mutationFn: ({ id, count }: { id: string; count: number }) => updateCart(id, { count }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    const clearCartMutation = useMutation({
        mutationFn: deletCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    // 2. الشروط والـ Returns المبكرة تأتي مباشرة بعد الانتهاء من استدعاء كل الـ Hooks
    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return <div className="text-center p-8 text-red-500">حدث خطأ أثناء تحميل السلة</div>;
    }

    // 3. تحويل البيانات (Derived State) ومعالجة المنطق
    const productList: ProductList = data?.data?.products || [];
    const items: CartItem[] = productList.map((item) => ({
        id: item?.product._id,
        name: item?.product.title,
        image: item?.product.imageCover,
        price: item.priceAfterDiscount ? item?.priceAfterDiscount : item?.price,
        quantity: item?.count,
        variant: item?.product.brand.name,
    }));

    const updateQuantity = (id: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeItem(id);
        } else {
            updateCartMutation.mutate({ id, count: newQuantity });
        }
    };

    const removeItem = (id: string) => {
        updateCartMutation.mutate({ id, count: 0 });
    };

    const clearAllCart = () => {
        clearCartMutation.mutate();
    };

    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );
    const shipping = 9.99;
    const total = subtotal + shipping;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "EGP",
        }).format(price);
    };

    if (items.length === 0) {
        return (
            <section className="py-32">
                <div className="container max-w-lg text-center">
                    <h1 className="mb-4 text-2xl font-semibold">Your cart is empty</h1>
                    <p className="mb-8 text-muted-foreground">
                        Looks like you haven't added anything yet.
                    </p>
                    <Button>
                        <Link href="/home/product/1">Continue Shopping</Link>
                    </Button>
                </div>
            </section>
        );
    }

    return (
        <section className="py-32">
            <div className="container">
                <h1 className="mb-8 text-3xl font-semibold">Shopping Cart</h1>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-4 rounded-lg border bg-card p-4"
                                >
                                    <div className="w-24 shrink-0">
                                        <AspectRatio
                                            ratio={1}
                                            className="overflow-hidden rounded-md bg-muted"
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="size-full object-cover"
                                            />
                                        </AspectRatio>
                                    </div>

                                    <div className="flex flex-1 flex-col justify-between">
                                        <div>
                                            <h3 className="font-medium">{item.name}</h3>
                                            {item.variant && (
                                                <p className="text-sm text-muted-foreground">
                                                    {item.variant}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="size-8"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >
                                                <Minus className="size-3" />
                                            </Button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="size-8"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                <Plus className="size-3" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end justify-between">
                                        <div className="text-right">
                                            <p className="font-semibold">
                                                {formatPrice(item.price * item.quantity)}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatPrice(item.price)} each
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-muted-foreground"
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <Trash2 className="mr-1 size-4" />
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="rounded-lg border bg-card p-6">
                            <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="flex items-center gap-1.5 text-muted-foreground">
                                        <ShoppingCart className="size-4" />

                                        {items.length} {items.length === 1 ? "item" : "items"}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>{formatPrice(shipping)}</span>
                                </div>

                                <Separator />

                                <div className="flex justify-between font-semibold">
                                    <span>Total</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                            </div>

                            <Button onClick={() => router.push('/home/cart/checkout')} size="lg" className="mt-6 w-full">
                                Proceed to Checkout
                            </Button>
                            <Button onClick={clearAllCart} size="lg" className="mt-6 bg-red-700 hover:bg-red-500 w-full">
                                Clear Cart
                            </Button>

                            <p className="mt-4 text-center text-xs text-muted-foreground">
                                Taxes calculated at checkout
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ShoppingCart2;