'use client'

import cn from 'clsx'
import { Check, ImageIcon, LoaderCircle } from 'lucide-react'
import Image from 'next/image'

import { usePhotoGallery } from '../hooks/userPlants'
import { PhotoGalleryItem } from '../types/plants.types'

function getPhotoTitle(photo: PhotoGalleryItem) {
	return photo.usedByPlant?.nickname || photo.usedByPlant?.plantName || 'Фото'
}

export function PhotoGalleryPicker({
	currentPlantId,
	selectedUrl,
	onSelect
}: {
	currentPlantId?: string
	selectedUrl?: string | null
	onSelect: (url: string) => void
}) {
	const { data, isLoading } = usePhotoGallery()
	const availablePhotos = (data ?? []).filter(
		photo =>
			photo.source !== 'careEvent' &&
			(!photo.isUsed ||
				photo.usedByPlant?.id === currentPlantId ||
				photo.url === selectedUrl)
	)

	if (isLoading) {
		return (
			<div className='mt-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/60'>
				<LoaderCircle
					size={16}
					className='animate-spin'
				/>
				Загружаем галерею
			</div>
		)
	}

	if (!availablePhotos.length) {
		return (
			<div className='mt-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/60'>
				<ImageIcon size={16} />
				В галерее пока нет свободных фото
			</div>
		)
	}

	return (
		<div className='mt-3 max-h-80 overflow-y-auto rounded-2xl border border-white/10 bg-black/10 p-2'>
			<div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
			{availablePhotos.map(photo => {
				const isSelected = selectedUrl === photo.url

				return (
					<button
						key={photo.key}
						type='button'
						aria-label={`Выбрать ${getPhotoTitle(photo)}`}
						className={cn(
							'relative aspect-square overflow-hidden rounded-2xl border bg-white/[0.04] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70',
							isSelected
								? 'border-emerald-200 shadow-[0_0_0_3px_rgba(110,231,183,0.18)]'
								: 'border-white/10 hover:border-emerald-200/45'
						)}
						onClick={() => onSelect(photo.url)}
					>
						<Image
							src={photo.url}
							alt=''
							fill
							unoptimized
							sizes='(max-width: 640px) 50vw, 25vw'
							className='object-cover'
							loading='lazy'
						/>
						{isSelected ? (
							<span className='absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-300 text-slate-950 shadow-[0_8px_18px_rgba(0,0,0,0.25)]'>
								<Check size={15} />
							</span>
						) : null}
					</button>
				)
			})}
			</div>
		</div>
	)
}
