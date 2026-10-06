import React from 'react'
import ProductList from '../../[page]/page'

// import ProductList from '../../page'


export default async function Brands({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    return (
        <div>
            <ProductList brandProductList={slug} />
        </div>
    )
}
