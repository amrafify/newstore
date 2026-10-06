
import { getProducts } from "@/app/utils/api";
import ProductItem from "../ProductItem";
import PaginationDemo from "../Pagination";
import EmptyDemo from "../emptyPage";


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
export default async function ProductList({ limit, categoryProductList, brandProductList, params }: { limit?: number; categoryProductList?: string; brandProductList?: string; params?: Promise<{ page: string }> }) {
    const resolvedParams = await params;
    const currentPage = resolvedParams?.page
    const AllData = limit || categoryProductList || brandProductList ? '100' : '9'
    const { products: data, metadata } = await getProducts(currentPage, AllData)
    const displayedProducts = limit ? data.slice(0, limit) : categoryProductList ? data.filter((item) => item.category.slug === categoryProductList) : brandProductList ? data.filter((item) => item.brand.slug === brandProductList) : data;

    return (
        <div className="flex items-center justify-center  w-full bg-background flex-wrap gap-6 p-4">

            {displayedProducts.length === 0 ? <EmptyDemo /> : displayedProducts.map((item, i) => <ProductItem key={i} img={item.imageCover} title={item.title} brand={item.brand.name} price={item.price} priceAfterDiscount={item.priceAfterDiscount} id={item.id} />)}
            {limit || categoryProductList || brandProductList ? null : <PaginationDemo numberPage={metadata?.numberOfPages} currentPage={metadata?.currentPage} />}
        </div>

    );
}
