"use client"
import React, { useEffect, useState } from 'react'
import ProductItem from '../product/ProductItem'
import { getAllWishlist } from '@/app/utils/api'
import EmptyDemo from '../product/emptyPage'
import { useQuery } from '@tanstack/react-query'
import Loading from '../loading'
interface Product {
    id: string,
    imageCover: string,
    price: number,
    priceAfterDiscount: number,
    title: string,
    brand: {
        _id: string,
        name: string,
        image: string,
        slug: string
    },
    category: {
        _id: string,
        name: string,
        image: string,
        slug: string
    },

}
type ProductList = Product[]
export default function Wishlist() {

    // جلب البيانات وإدارتها تلقائياً عبر React Query
    const { data, isLoading, isError } = useQuery({
        queryKey: ['wishlist'],
        queryFn: getAllWishlist,
        staleTime: 0,
        refetchOnWindowFocus: true,
        refetchInterval: 500,
        refetchIntervalInBackground: true,
    });

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return <div className="text-center p-8 text-red-500">حدث خطأ أثناء تحميل المفضلة</div>;
    }

    const ProductData: ProductList = data?.data || [];
    return (
        <div className="flex items-center justify-center  w-full bg-background flex-wrap gap-6 p-4">
            {
                ProductData.length === 0 ? <EmptyDemo /> : ProductData.map((item, i) => <ProductItem key={i} brand={item.brand.name} img={item.imageCover} price={item.price} priceAfterDiscount={item.priceAfterDiscount} title={item.title} id={item.id} />)
            }
        </div>
    )
}
