// Button Component
// Reusable button with variants: primary, secondary, ghost

import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonBaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

interface ButtonAsButtonProps extends ButtonBaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> {
  href?: never
  children: ReactNode
}

interface ButtonAsLinkProps extends ButtonBaseProps {
  href: string
  disabled?: never
  type?: never
  children: ReactNode
}

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-pink-600 text-white hover:bg-pink-700 disabled:bg-pink-300',
  secondary: 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 disabled:bg-gray-100',
  ghost: 'text-pink-600 hover:bg-pink-50 disabled:text-pink-300',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-3 text-sm min-h-[44px]',      // ✅ WCAG 2.2 - 44px
  md: 'px-6 py-3.5 text-base min-h-[48px]',  // ✅ 48px
  lg: 'px-8 py-4 text-lg min-h-[52px]',      // ✅ 52px
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', children, className = '', ...props }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center font-semibold rounded-lg
      transition-colors disabled:cursor-not-allowed
      active:scale-95 md:active:scale-100
      touch-manipulation
    `
    const styles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

    // If href is provided, render as Link
    if ('href' in props && props.href) {
      return (
        <Link href={props.href} className={styles}>
          {children}
        </Link>
      )
    }

    // Otherwise render as button
    const { href, ...buttonProps } = props as ButtonAsButtonProps
    return (
      <button ref={ref} className={styles} {...buttonProps}>
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
