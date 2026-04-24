'use client'

import cn from 'clsx'
import { X } from 'lucide-react'
import { ReactNode, useEffect, useId } from 'react'
import { createPortal } from 'react-dom'

import { Button } from '../buttons/Button'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	title: string
	children: ReactNode
	className?: string
	description?: string
	eyebrow?: string
	titleId?: string
	closeLabel?: string
	closeOnOverlayClick?: boolean
}

export function Modal({
	isOpen,
	onClose,
	title,
	children,
	className,
	description,
	eyebrow,
	titleId,
	closeLabel = 'Закрыть окно',
	closeOnOverlayClick = true
}: ModalProps) {
	const generatedTitleId = useId()
	const resolvedTitleId = titleId ?? generatedTitleId

	useEffect(() => {
		if (!isOpen) {
			return
		}

		const previousOverflow = document.body.style.overflow

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose()
			}
		}

		document.body.style.overflow = 'hidden'
		window.addEventListener('keydown', handleKeyDown)

		return () => {
			document.body.style.overflow = previousOverflow
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [isOpen, onClose])

	if (typeof document === 'undefined' || !isOpen) {
		return null
	}

	return createPortal(
		<div
			className='fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6'
			role='presentation'
		>
			<button
				type='button'
				className='absolute inset-0 bg-[rgba(3,10,7,0.72)] backdrop-blur-md'
				onClick={closeOnOverlayClick ? onClose : undefined}
				aria-label={closeLabel}
			/>

			<div
				role='dialog'
				aria-modal='true'
				aria-labelledby={resolvedTitleId}
				className={cn(
					'relative z-10 max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-y-auto rounded-[32px] border border-white/15 bg-[linear-gradient(180deg,rgba(9,27,20,0.96),rgba(8,22,17,0.9))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.52)] backdrop-blur-2xl sm:p-8',
					className
				)}
			>
				<div className='mb-8 flex items-start justify-between gap-4 border-b border-white/10 pb-6'>
					<div>
						{eyebrow ? (
							<p className='mb-3 text-[11px] uppercase tracking-[0.32em] text-emerald-100/60'>
								{eyebrow}
							</p>
						) : null}
						<h3
							id={resolvedTitleId}
							className='text-2xl font-semibold tracking-tight text-white sm:text-3xl'
						>
							{title}
						</h3>
						{description ? (
							<p className='mt-4 max-w-xl text-sm leading-6 text-white/65'>
								{description}
							</p>
						) : null}
					</div>

					<Button
						type='button'
						className='flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/15 p-0 text-white/70 hover:bg-white/10 hover:text-white'
						onClick={onClose}
						aria-label={closeLabel}
					>
						<X size={18} />
					</Button>
				</div>

				{children}
			</div>
		</div>,
		document.body
	)
}
