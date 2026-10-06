"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import Image from 'next/image';
import { addToCart, addWishlist, getAllWishlist, removeWishlist } from '@/app/utils/api';
import { useCountOfCartStore } from "../../store/uesCount";
import { CounterButton } from "@/components/counter-button";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function ProductItem({ img, title, brand, price, priceAfterDiscount, id }: { img: string, title: string, brand: string, price: number, priceAfterDiscount?: number, id: string }) {
    const [activeSize, setActiveSize] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [inBag, setInBag] = useState(false);
    const [found, setfound] = useState(null);
    const { setCountOfCart } = useCountOfCartStore()
    const queryClient = useQueryClient();


    const productId = {
        productId: id
    }
    const mutation = useMutation({
        mutationFn: (productId: string) => removeWishlist(productId),
        onSuccess: () => {
            // هذه الخطوة هي التي تجعل صفحة Wishlist تتحدث فوراً وبشكل تلقائي في الخلفية بدون Refresh
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        },
    });
    useEffect(() => {
        async function checkWishlistStatus() {
            try {
                const { data } = await getAllWishlist();

                // البحث عن العنصر باستخدام الـ id
                const foundItem = data?.find((item: any) => item.id === id);

                setfound(foundItem);

                // الفحص باستخدام القيمة الجديدة مباشرة
                if (foundItem) {
                    setIsWishlisted(true);
                } else {
                    setIsWishlisted(false);
                }

                console.log(foundItem, 'aaaa');
            } catch (error) {
                console.error("Error fetching wishlist:", error);
            }
        }

        checkWishlistStatus();
    }, [id]);
    async function wishlistFu() {
        setIsWishlisted(!isWishlisted)
        if (isWishlisted) {
            const { data } = await removeWishlist(id)
            console.log(data, 'remove');
            setIsWishlisted(false)
        } else {
            const { data } = await addWishlist(productId)
            console.log(data);
        }
    }
    async function addtoCart(productId: { productId: string }) {
        const data = await addToCart(productId)
        setCountOfCart(data.numOfCartItems)
        console.log(data, 'dfgh');
        setInBag(true)
    }
    return (
        <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
            <Card className=" rounded-2xl overflow-hidden p-0 gap-0  group/card ">

                {/* ── Image zone ── */}
                <div className="relative overflow-hidden h-80">
                    <Image
                        src={img}
                        width={500}
                        height={500}
                        className="object-contain drop-shadow-2xl px-8 py-6 transition-transform duration-500 ease-out group-hover/card:scale-105"
                        alt={title}
                    />
                    {/* Wishlist — always visible top-right */}
                    <button
                        onClick={() => wishlistFu()}
                        title="Wishlist"
                        className={cn(
                            "absolute top-3 right-3 h-8 w-8 rounded-full border shadow-sm flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95",
                            isWishlisted
                                ? "bg-rose-50 border-rose-200 dark:bg-rose-950 dark:border-rose-800"
                                : "bg-background"
                        )}
                    >
                        <Heart
                            className={cn(
                                "w-3.5 h-3.5 transition-colors",
                                isWishlisted ? "fill-rose-500 text-rose-500" : "text-muted-foreground"
                            )}
                        />
                    </button>
                </div>
                <Link href={`/home/product/item/${id}`}>
                    {/* Info zone */}
                    <CardContent className="px-4 pt-4 pb-4 space-y-1.5">

                        {/* Brand + name */}
                        <div className="min-w-0">
                            <h3 className="text-base font-bold text-foreground truncate">
                                {brand}
                            </h3>
                            <p className="text-sm text-muted-foreground truncate">
                                {title}
                            </p>
                        </div>

                        {/* Price & Discount */}
                        <div className="flex items-center gap-2 pt-1">
                            {priceAfterDiscount && <span className="text-green-600 dark:text-green-500 font-semibold text-sm">↓{Math.round(100 - (priceAfterDiscount / price) * 100)}%</span>}
                            {priceAfterDiscount ? <span className={` line-through text-muted-foreground text-sm`}>{price} EGP</span> : <span className={` text-foreground font-bold text-base`}>{price}{priceAfterDiscount && 'EGP'} </span>}
                            <span className="text-foreground font-bold text-base">{priceAfterDiscount} EGP</span>
                        </div>
                    </CardContent>
                </Link>
                {/* Action zone — always visible */}
                <CardFooter className="px-4 pb-6 gap-2 bg-transparent border-t-0">
                    {/* Buy Now — button-17 ripple style */}
                    <div className="flex-1 h-12">
                        <CounterButton id={id} />
                    </div>

                </CardFooter>
            </Card>
        </div>
    )
}
