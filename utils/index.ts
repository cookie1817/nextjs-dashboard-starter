import { ReactNode } from 'react'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type Role = 'admin' | 'manager'
export type MenuItem = { label: string; href: string; loggedIn: boolean }

export type BaseComponent = {
  children?: ReactNode
  className?: string
}