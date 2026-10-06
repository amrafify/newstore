import { create } from "zustand";
import { persist } from "zustand/middleware";
interface CountOfCart {
    numOfCartItems: number,
    setCountOfCart: (numOfCartItems: number) => void
}
interface uesrName {
    uesrName: string,
    uesrEmail: string,
    setUesrName: (uesrName: string, uesrEmail: string) => void
}

export const useUesrNameState = create<uesrName>()(
    persist(
        (set) => ({
            uesrName: '',
            uesrEmail: '',
            setUesrName: (uesrName, uesrEmail) => set({ uesrName, uesrEmail })
        }), {
        name: "uesrInfo",
    }
    )
)

export const useCountOfCartStore = create<CountOfCart>()(
    persist(
        (set) => ({
            numOfCartItems: 0,
            setCountOfCart: (numOfCartItems) => set({ numOfCartItems })
        }), {
        name: "numOfCartItems",
    }
    )
)