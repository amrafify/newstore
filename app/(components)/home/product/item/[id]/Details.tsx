"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, Star, StarHalf } from "lucide-react";
import type { ControllerRenderProps } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { cn } from "cn";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getProductD } from "@/app/utils/api";
import { useEffect, useState } from "react";
import { CounterButton } from "@/components/counter-button";
import BreadcrumbBasic from "@/components/Breadcrumb";
import { Metadata } from "next";
type StockStatusCode = "IN_STOCK" | "OUT_OF_STOCK";

interface StockInfo {
    stockStatusCode?: StockStatusCode;
    stockQuantity?: number;
}

type option = {
    id: string;
    label: string;
    stockInfo: StockInfo;
    color?: string;
    value: string;
};

interface Hinges {
    label: string;
    id: string;
    name: FieldName;
    options?: option[];
    min?: number;
    max?: number;
}

interface ProductImagesProps {
    images: Array<{
        srcset: string;
        src: string;
        alt: string;
        width: number;
        height: number;
        sizes: string;
    }>;
}

interface ReviewsProps {
    rate: number;
    totalReviewers: string;
}

interface PriceProps {
    regular?: number;
    sale?: number;
    currency: string;
    text?: string;
}

interface ProductInfoProps {
    info?: Array<{
        label: string;
        value: string;
    }>;
}

type FormType = z.infer<typeof formSchema>;
type FieldName = keyof FormType;

type SizeOptionProps = option;

interface RadioGroupProps {
    options?: Array<option>;
    field: ControllerRenderProps<FormType>;
}

interface ProductFormProps {
    hinges?: Record<FieldName, Hinges>;
    selected: FormType;
}
const MAX_STARS = 5;
interface ProductDetail1Props {
    className?: string;
    params: any
}
interface productData {
    title: string,
    imageCover: string,
    images: [],
    priceAfterDiscount?: number,
    price: number,
    description: string,
    ratingsAverage: number,
    ratingsQuantity: number,
    brand: {
        name: string
    },
    category: {
        name: string,
        slug: string
    }
}

const ProductDetail1 = ({ className, params }: ProductDetail1Props) => {
    const [fatchData, setFatchData] = useState<productData>({ 'title': '', imageCover: '', images: [], price: 0, description: '', ratingsAverage: 5, ratingsQuantity: 4, brand: { name: '' }, category: { name: '', slug: '' } })
    async function displayData() {
        const getProductId = await getProductD(params)
        setFatchData(getProductId.data)
        console.log(getProductId, 'afify');
    }
    useEffect(() => {
        displayData()

    }, [])
    const PRODUCT_DETAILS = {
        reviews: {
            rate: fatchData.ratingsAverage,
            totalReviewers: String(fatchData.ratingsQuantity),
        },
        description:
            fatchData.description,
        price: {
            regular: fatchData.priceAfterDiscount && fatchData.price,
            sale: fatchData.priceAfterDiscount ? fatchData.priceAfterDiscount : fatchData.price,
            currency: "EGP",
        },
        hinges: {
            size: {
                label: "Select size",
                id: "size",
                name: "size",
                options: [
                    {
                        id: "xs",
                        label: "xs",
                        value: "xs",
                        stockInfo: {
                            stockStatusCode: "OUT_OF_STOCK",
                        },
                    },
                    {
                        id: "s",
                        label: "s",
                        value: "s",
                        stockInfo: {
                            stockStatusCode: "OUT_OF_STOCK",
                        },
                    },
                    {
                        id: "m",
                        label: "m",
                        value: "m",
                        stockInfo: {
                            stockStatusCode: "IN_STOCK",
                        },
                    },
                    {
                        id: "l",
                        label: "l",
                        value: "l",
                        stockInfo: {
                            stockStatusCode: "IN_STOCK",
                        },
                    },
                    {
                        id: "xl",
                        label: "xl",
                        value: "xl",
                        stockInfo: {
                            stockStatusCode: "IN_STOCK",
                        },
                    },
                ],
            },
        } as Record<FieldName, Hinges>,
        images: [
            {
                srcset:
                    fatchData.imageCover,
                src: fatchData.imageCover,
                alt: "",
                width: 1920,
                height: 2880,
                sizes: "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
            },
            ...fatchData.images.slice(0, 3).map((img) => ({
                srcset: img,
                src: img,
                alt: "",
                width: 1920,
                height: 2880,
                sizes: "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
            }))
        ],
    };


    return (
        <section className={cn("", className)}>
            <div className="mb-3">

                <BreadcrumbBasic category={fatchData.category.name} product={fatchData.title} slug={fatchData.category.slug} />
            </div>
            <div className="container">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                    <div>
                        <ProductImages images={PRODUCT_DETAILS.images} />
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h1 className="text-2xl font-bold tracking-tight lg:text-2xl">
                                        {fatchData.title}
                                    </h1>
                                    <h3 className="text-2xl font-bold tracking-tight lg:text-2xl text-gray-400">
                                        {fatchData.brand.name}
                                    </h3>
                                    <div className="mt-3 flex flex-wrap items-center gap-4">
                                        <Reviews
                                            rate={PRODUCT_DETAILS.reviews.rate}
                                            totalReviewers={PRODUCT_DETAILS.reviews.totalReviewers}
                                        />
                                        <Badge variant="secondary">
                                            <CircleCheck />
                                            In Stock
                                        </Badge>
                                    </div>
                                </div>
                                <Price {...PRODUCT_DETAILS.price} />
                            </div>

                            <p className="text-muted-foreground">
                                {PRODUCT_DETAILS.description}
                            </p>
                        </div>

                        <div className="flex-1 h-12">
                            <CounterButton id={params} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
const ProductImages = ({ images }: ProductImagesProps) => {
    return (
        <Carousel
            opts={{
                breakpoints: {
                    "(min-width: 768px)": {
                        active: false,
                    },
                },
            }}
        >
            <CarouselContent className="gap-4 md:m-0 md:grid md:grid-cols-3 xl:gap-5">
                {images.map((img, index) => (
                    <CarouselItem
                        className="first:col-span-3 md:p-0"
                        key={`product-detail-1-image-${index}`}
                    >
                        <AspectRatio ratio={1} className="overflow-hidden rounded-lg">
                            <img
                                srcSet={img.srcset}
                                alt={img.alt}
                                width={img.width}
                                height={img.height}
                                sizes={img.sizes}
                                className="block size-full object-cover object-center"
                            />
                        </AspectRatio>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <div className="md:hidden">
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
            </div>
        </Carousel>
    );
};

const Reviews = ({ rate, totalReviewers }: ReviewsProps) => {
    const renderStars = () => {
        const fullStars = Math.floor(rate);
        const hasHalfStar = rate % 1 >= 0.5;
        const emptyStars = MAX_STARS - fullStars - (hasHalfStar ? 1 : 0);

        const stars = [];

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Star
                    key={`product-detail-1-star-full-${i}`}
                    className="size-4 fill-yellow-500 stroke-yellow-500"
                />,
            );
        }

        if (hasHalfStar) {
            stars.push(
                <div key="product-detail-1-half-star" className="relative size-4">
                    <StarHalf className="absolute top-0 right-0 size-full fill-yellow-500 stroke-yellow-500" />
                    <StarHalf className="absolute top-0 left-0 size-full -scale-x-100 fill-black/15 stroke-black/15 dark:invert" />
                </div>,
            );
        }

        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <Star
                    key={`product-detail-1-star-empty-${i}`}
                    className="size-4 fill-black/15 stroke-black/15 dark:invert"
                />,
            );
        }

        return stars;
    };

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">{renderStars()}</div>
            {totalReviewers && (
                <p className="text-base leading-none font-medium whitespace-nowrap text-muted-foreground">
                    {totalReviewers} reviews
                </p>
            )}
        </div>
    );
};

const formSchema = z.object({
    color: z.string(),
    quantity: z.number().min(1),
    size: z.string(),
});



const Price = ({ regular, sale, currency }: PriceProps) => {
    if (!currency) return;

    const formatCurrency = (
        value: number,
        currency: string = "EGP",
        locale: string = "en-US",
    ) => {
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency,
        }).format(value);
    };

    return (
        <div className="flex items-center gap-2">
            {sale && (
                <span className="text-right text-2xl font-bold text-primary">
                    {formatCurrency(sale, currency)}
                </span>
            )}
            {
                regular && <span
                    className={`text-right text-2xl font-bold ${sale ? "text-muted-foreground line-through" : "text-foreground"
                        }`}
                >
                    {formatCurrency(regular, currency)}
                </span>
            }

        </div>
    );
};

const SizeRadioGroup = ({ options, field }: RadioGroupProps) => {
    if (!options) return;

    return (
        <RadioGroup
            {...field}
            value={`${field.value}`}
            onValueChange={(value) => {
                if (value != field.value && value) {
                    field.onChange(value);
                }
            }}
            className="flex flex-wrap gap-3"
        >
            {options &&
                options.map((item, index) => (
                    <SizeOption
                        key={`product-detail-1-size-input-${index}`}
                        stockInfo={item.stockInfo}
                        id={item.id}
                        label={item.label}
                        value={item.value}
                    />
                ))}
        </RadioGroup>
    );
};

const SizeOption = ({ id, label, stockInfo, value }: SizeOptionProps) => {
    const isOutOfStock = stockInfo.stockStatusCode === "OUT_OF_STOCK";

    return (
        <label
            htmlFor={id}
            className="relative flex h-10 w-16 cursor-pointer items-center justify-center rounded-md border text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground has-checked:bg-primary has-checked:text-primary-foreground has-disabled:pointer-events-none has-disabled:opacity-50"
        >
            <RadioGroupItem
                id={id}
                className="absolute size-px overflow-hidden opacity-0"
                value={value}
                disabled={isOutOfStock}
            />
            <span className="uppercase">{label}</span>
            {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-px w-full rotate-45 bg-border"></div>
                </div>
            )}
        </label>
    );
};

export default ProductDetail1;
