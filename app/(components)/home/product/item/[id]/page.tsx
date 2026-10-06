import React from 'react'
import ProductDetail1 from './Details';


export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const currentPage = resolvedParams?.id
    return (
        <div>
            <ProductDetail1 params={currentPage} />
        </div>
    )
}
