// import { IconFolderCode } from "@tabler/icons-react"
import { ArrowUpRightIcon, Folder } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import Link from "next/link"

export default function EmptyDemo() {
    return (
        <div className="w-full  flex justify-center items-center">

            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Folder />
                    </EmptyMedia>
                    <EmptyTitle>No products available</EmptyTitle>
                    <EmptyDescription>
                        We couldn't find any items matching this category or brand right now. Check back later or explore our other collections.
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent className="flex-row justify-center gap-2">
                    <Link href={'/home'}>Go to home</Link>
                </EmptyContent>
                <Button variant="link" className="text-muted-foreground" size="sm" nativeButton={false} render={<a href="#">Learn More <ArrowUpRightIcon /></a>} />
            </Empty>

        </div>
    )
}
