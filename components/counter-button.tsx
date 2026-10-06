"use client";

import { Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import * as React from "react";
import { cn } from "cn";
import { addToCart, updateCart } from "@/app/utils/api";
import { useCountOfCartStore } from "../app/(components)/store/uesCount";
import { Button } from "./ui/button";

export interface CounterButtonProps {
  initialCount?: number;
  min?: number;
  max?: number;
  onChange?: (count: number) => void;
  className?: string;
  id: string
}

export const CounterButton = ({
  initialCount = 0,
  min = 0,
  max = 99,
  onChange,
  className,
  id
}: CounterButtonProps) => {
  const [count, setCount] = React.useState(initialCount);
  const [direction, setDirection] = React.useState<1 | -1>(1);
  const { setCountOfCart, numOfCartItems } = useCountOfCartStore()
  const productId = {
    productId: id
  }
  async function addtoCart(productId: { productId: string }) {
    const data = await addToCart(productId)
    setCountOfCart(data.numOfCartItems)
    console.log(data, 'dfgh');
    setCount(count + 1)
  }
  async function updateCartCount(count: any) {
    const data = await updateCart(id, count)
    setCountOfCart(data.numOfCartItems)
    console.log(data);

  }
  const increment = () => {
    if (count >= max) return;
    setDirection(1);
    const next = count + 1;
    setCount(next);
    onChange?.(next);
    const fainalCount = {
      'count': String(next)
    }
    updateCartCount(fainalCount)
  };

  const decrement = () => {
    if (count <= min) return;
    setDirection(-1);
    const next = count - 1;
    setCount(next);
    onChange?.(next);
    const fainalCount = {
      'count': String(next)
    }
    updateCartCount(fainalCount)
  };

  return (
    <div>
      {
        count != 0 ? <div
          className={cn(
            "inline-flex h-12 w-full items-center rounded-md border border-input bg-background",
            className,
          )}
        >
          <button
            type="button"
            onClick={decrement}
            disabled={count <= min}
            className="flex h-full w-[33%] items-center justify-center rounded-l-md transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
          >
            <Minus className="size-3.5" />
          </button>
          <div className="flex h-full w-[33%] items-center justify-center overflow-hidden border-x border-input text-sm font-medium">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={count}
                initial={{ y: direction * 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: direction * -20, opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                {count}
              </motion.span>
            </AnimatePresence>
          </div>
          <button
            type="button"
            onClick={increment}
            disabled={count >= max}
            className="flex h-full w-[33%] items-center justify-center rounded-r-md transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
          >
            <Plus className="size-3.5" />
          </button>
        </div> : <Button onClick={() => addtoCart(productId)} className="relative overflow-hidden group/btn flex-1 h-12 rounded-xl font-semibold text-base cursor-pointer border border-primary transition-all flex items-center justify-center gap-2 w-full">
          <span className="absolute left-1/2 -translate-x-1/2 top-full -translate-y-1/2 w-8 h-8 bg-white dark:bg-gray-950 rounded-full scale-0 transition-transform duration-700 ease-in-out group-hover/btn:scale-[20]" />
          <span className="relative z-10 transition-colors duration-500 group-hover/btn:text-gray-950 dark:group-hover/btn:text-white">
            add to cart
          </span>
        </Button>
      }
    </div>


  );
};
