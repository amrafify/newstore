
import axios from "axios"
import Cookies from 'js-cookie';

// 1. تعريف واجهة المنتج (موجودة لديك مسبقاً)
interface Product {
    id: string;
    imageCover: string;
    price: number;
    priceAfterDiscount: number;
    title: string;
    brand: {
        _id: string;
        name: string;
        image: string;
        slug: string;
    };
    category: {
        _id: string;
        name: string;
        image: string;
        slug: string;
    };
}

// 👈 2. تعريف واجهة الـ Metadata القادمة من الـ API
interface Metadata {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    nextPage?: number;
    prevPage?: number;
}

// 👈 3. تعريف واجهة الاستجابة الكاملة لدالة getProducts
interface ProductsResponse {
    products: Product[];
    metadata: Metadata | null;
    message?: string;
}
const API_URL = 'https://ecommerce.routemisr.com/api/v1/'
const token = Cookies.get('token')
const idCart = Cookies.get('cartid')
//auth
export async function handelSignup(dataform: {}) {
    try {
        const { data } = await axios.post(`${API_URL}auth/signup`, dataform)
        console.log(data);
        return data
    } catch (err: any) {
        return err.response?.data || { message: "error" }
    }
}
export async function handelSignin(dataform: {}) {
    try {
        const { data } = await axios.post(`${API_URL}auth/signin`, dataform)
        console.log(data);
        const Token = data.token
        Cookies.set('token', Token, { expires: 7 })
        window.dispatchEvent(new Event("auth-changed"));
        return data
    } catch (err: any) {
        return err.response?.data || { message: "error" }
    }
}
export async function handelForgetPassword(dataform: {}) {
    try {
        const { data } = await axios.post(`${API_URL}auth/forgotPasswords`, dataform)
        console.log(data);
        return data
    } catch (err: any) {
        return err.response?.data || { message: "error" }
    }
}
export async function handelRestCode(dataform: {}) {
    try {
        const { data } = await axios.post(`${API_URL}auth/verifyResetCode`, dataform)
        console.log(data);
        return data
    } catch (err: any) {
        return err.response?.data || { message: "error" }
    }
}
export async function handelRestPassword(dataform: {}) {
    try {
        const { status } = await axios.put(`${API_URL}auth/resetPassword`, dataform)
        console.log(status);
        return status
    } catch (err: any) {
        return err.response?.data || { message: "error" }
    }
}
// get products
export async function getProducts(pageNumber = '1', limit = '12'): Promise<ProductsResponse> {
    try {
        const { data } = await axios.get(`${API_URL}products?page=${pageNumber}&limit=${limit}`)
        console.log(data, 'jhgfyt');
        return {
            products: data.data,
            metadata: data.metadata // هنا الـ metadata المتاحة
        }
    } catch (err: any) {
        return err.response?.data || { message: "error" }
    }
}
export async function getProductD(id: string) {
    try {
        const { data } = await axios.get(`${API_URL}products/${id}`)
        return data
    } catch (err: any) {
        return err.response?.data || { message: "error" }
    }
}
// wishlist
export async function addWishlist(productId: { productId: string }) {
    try {
        const { data } = await axios.post(`${API_URL}wishlist`, productId, {
            headers: { token }
        })
        console.log(data);
        return data
    } catch (err: any) {
        return err.response?.data || { message: "error" }
    }
}
export async function removeWishlist(productId: string) {
    try {
        const { data } = await axios.delete(`${API_URL}wishlist/${productId}`, {
            headers: { token }
        })
        console.log(data);
        return data
    } catch (err: any) {
        return err.response?.data || { message: "error" }
    }
}
export async function getAllWishlist() {
    try {
        const { data } = await axios.get(`${API_URL}wishlist`, {
            headers: { token }
        })
        console.log(data);
        return data
    } catch (err: any) {
        return err.response?.data || { message: "error" }
    }
}
// cart
export async function addToCart(productId: { productId: string }) {
    try {
        const { data } = await axios.post(`${API_URL}cart`, productId, {
            headers: { token }
        })
        return data
    } catch (err: any) {
        return err.response?.data || { message: "error" }
    }
}
export async function updateCart(productId: string, count: { "count": number }) {
    try {
        const { data } = await axios.put(`${API_URL}cart/${productId}`, count, {
            headers: { token }
        })
        return data
    } catch (err: any) {
        return err.response?.data || { message: "error" }
    }
}
export async function getCart() {
    try {
        const { data } = await axios.get(`${API_URL}cart`, {
            headers: { token }
        })
        const cartid = data?.cartId
        // Cookies.set('cartid', cartid, { expires: 7 })
        // window.dispatchEvent(new Event("auth-changed"));
        localStorage.setItem('cartid', cartid)
        return data
    } catch (err: any) {
        return err.response?.data || { message: "error" }
    }
}
export async function deletCart() {
    try {
        const { data } = await axios.delete(`${API_URL}cart`, {
            headers: { token }
        })
        return data
    } catch (err: any) {
        return err.response?.data || { message: "error" }
    }
}
export async function CheckOutCash(dataform: {}) {
    try {
        const { data } = await axios.post(`${API_URL}orders/${localStorage.getItem('cartid')}`, dataform, {
            headers: { token }
        })
        return data
    } catch (err: any) {
        return err.response?.data || { message: "error" }
    }
}
export async function orderSummary() {
    try {
        const { data } = await axios.get(`${API_URL}orders/user/${localStorage.getItem('uesrId')}`)
        console.log(data, 'dfghjkk');
        return data
    } catch (err: any) {
        return err.response?.data || { message: "error" }
    }
}

//categories
export async function getAllCategories() {
    try {
        const { data } = await axios.get(`${API_URL}categories`)
        console.log(data);
        return data
    } catch (err: any) {
        return err.response?.data || { message: "error" }
    }
}

//brands
export async function getAllBrands() {
    try {
        const { data } = await axios.get(`${API_URL}brands`)
        console.log(data);
        return data
    } catch (err: any) {
        return err.response?.data || { message: "error" }
    }
}