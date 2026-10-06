
import React from 'react'
// import ProductList from './product/page'
import {
    useTranslation,
    type Translations,
} from "@/components/language-selector"
import ProductList from './product/[page]/page'


export default function home() {

    return (
        <div className=''>
            <ProductList limit={6} />
        </div>
    )
}
