import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

export default function PaginationDemo({ numberPage, currentPage }: { numberPage: any, currentPage: any }) {
    const TotalNumberPage = Array.from({ length: numberPage }, (_, index) => index + 1)
    const page = Number(currentPage)
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious className={`${currentPage === 1 && 'cursor-no-drop text-gray-300 hover:text-gray-300 hover:bg-white '}`} href={`/home/product/${currentPage === 1 ? currentPage : currentPage - 1}`} />
                </PaginationItem>
                {TotalNumberPage.map((num, i) => <PaginationItem key={i}>
                    <PaginationLink className={`${currentPage === i + 1 && 'text-red-500'} font-bold`} href={`/home/product/${i + 1}`}>{i + 1}</PaginationLink>
                </PaginationItem>)}
                <PaginationItem>
                    <PaginationNext className={`${currentPage === TotalNumberPage.length && 'cursor-no-drop text-gray-300 hover:text-gray-300 hover:bg-white '}`} href={`/home/product/${currentPage === TotalNumberPage.length ? currentPage : currentPage + 1}`} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
