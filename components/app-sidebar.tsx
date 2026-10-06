"use client"

import { useEffect, useState } from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { GalleryVerticalEndIcon, AudioLinesIcon, TerminalIcon, TerminalSquareIcon, BotIcon, BookOpenIcon, Settings2Icon, FrameIcon, PieChartIcon, MapIcon, CatIcon, LayoutGridIcon, ShapesIcon, TagsIcon, SparklesIcon, StoreIcon, HomeIcon } from "lucide-react"
import { getAllBrands, getAllCategories } from "@/app/utils/api"
import { useCountOfCartStore, useUesrNameState } from "@/app/(components)/store/uesCount"
interface Category {
  _id: string;
  name: string;
  image?: string;
  slug?: string;
}
interface Brands {
  _id: string;
  name: string;
  image?: string;
  slug?: string;
}



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [categoriesList, setCategoriesList] = useState<Category[]>([])
  const [brandsList, setBrandsList] = useState<Brands[]>([])
  const { numOfCartItems } = useCountOfCartStore()
  const { uesrName, uesrEmail } = useUesrNameState()
  async function getAllCategory() {
    const data = await getAllCategories()
    setCategoriesList(data?.data)
    console.log(data?.data);
  }
  async function getAllbrands() {
    const data = await getAllBrands()
    setBrandsList(data?.data)
    console.log(data?.data);
  }
  useEffect(() => {
    getAllCategory()
    getAllbrands()
  }, [])
  // This is sample data.
  const data = {
    user: {
      name: uesrName,
      email: uesrEmail,
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "EL ZAHRA STORE",
        logo: (
          <GalleryVerticalEndIcon
          />
        ),
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: (
          <AudioLinesIcon
          />
        ),
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: (
          <TerminalIcon
          />
        ),
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Home",
        url: "#",
        icon: (
          <StoreIcon
          />
        ),
        items: [
          {
            title: "Home",
            url: "/home",
          },
          {
            title: "Products",
            url: "/home/product/1",
          },
          {
            title: `Cart`,
            url: "/home/cart",
          },
          {
            title: "Wishlist",
            url: "/home/wishlist",
          },
        ],
      },
      {
        title: "categories",
        url: "#",
        icon: (
          <ShapesIcon
          />
        ),
        isActive: true,
        items: categoriesList.map((category) => ({
          title: category.name, // اسم الفئة الجاي من الـ API
          url: `/home/product/categories/${category.slug}`, // أو أي رابط مخصص للـ category
        })),
      },
      {
        title: "Brands",
        url: "#",
        icon: (
          <SparklesIcon />
        ),
        items: brandsList.map((brand) => ({
          title: brand.name, // اسم الفئة الجاي من الـ API
          url: `/home/product/brands/${brand.slug}`, // أو أي رابط مخصص للـ category
        })),
      },

    ],

  }
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
