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
			className='fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6'
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
					'relative z-10 max-h-[calc(100vh-1.5rem)] w-full max-w-xl overflow-y-auto rounded-[22px] border border-white/15 bg-[linear-gradient(180deg,rgba(9,27,20,0.96),rgba(8,22,17,0.9))] p-4 shadow-[0_30px_100px_rgba(0,0,0,0.52)] backdrop-blur-2xl sm:max-h-[calc(100vh-2rem)] sm:rounded-[32px] sm:p-8',
					className
				)}
			>
				<div className='mb-5 flex items-start justify-between gap-3 border-b border-white/10 pb-4 sm:mb-8 sm:gap-4 sm:pb-6'>
					<div>
						{eyebrow ? (
							<p className='mb-2 text-[10px] uppercase tracking-[0.22em] text-emerald-100/60 sm:mb-3 sm:text-[11px] sm:tracking-[0.32em]'>
								{eyebrow}
							</p>
						) : null}
						<h3
							id={resolvedTitleId}
							className='text-xl font-semibold tracking-tight text-white sm:text-3xl'
						>
							{title}
						</h3>
						{description ? (
							<p className='mt-3 max-w-xl text-xs leading-5 text-white/65 sm:mt-4 sm:text-sm sm:leading-6'>
								{description}
							</p>
						) : null}
					</div>

					<Button
						type='button'
						className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/15 p-0 text-white/70 hover:bg-white/10 hover:text-white sm:h-11 sm:w-11'
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
