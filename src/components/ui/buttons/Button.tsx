import cn from 'clsx'
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

type TypeButton = ButtonHTMLAttributes<HTMLButtonElement>

export function Button({
	children,
	className,
	...rest
}: PropsWithChildren<TypeButton>) {
	return (
		<button
			className={cn(
				'inline-flex items-center justify-center gap-2 rounded-[16px] border border-white/12 bg-transparent px-4 py-2 text-sm font-medium text-white transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07110d] disabled:pointer-events-none disabled:opacity-70',
				className
			)}
			{...rest}
		>
			{children}
		</button>
	)
}
