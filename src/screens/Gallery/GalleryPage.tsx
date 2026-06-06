'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ImageIcon, LoaderCircle, Trash, Upload } from 'lucide-react'
import Image from 'next/image'
import { ChangeEvent } from 'react'
import { toast } from 'sonner'

import { Button } from '@/src/components/ui/buttons/Button'
import { useDeleteGalleryPhoto, usePhotoGallery } from '@/src/hooks/userPlants'
import { userPlantService } from '@/src/services/userPlant.service'
import { PhotoGalleryItem } from '@/src/types/plants.types'

function formatFileSize(size?: number | null) {
	if (!size) return null

	if (size < 1024 * 1024) return `${Math.round(size / 1024)} КБ`

	return `${(size / 1024 / 1024).toFixed(1)} МБ`
}

function formatDate(date?: string | null) {
	if (!date) return null

	const parsedDate = new Date(date)

	if (Number.isNaN(parsedDate.getTime())) return null

	return new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: 'short',
		year: 'numeric'
	}).format(parsedDate)
}

function getPlantLabel(photo: PhotoGalleryItem) {
	return (
		photo.usedByPlant?.nickname ||
		photo.usedByPlant?.plantName ||
		'растении'
	)
}

export function GalleryPage() {
	const { data, isLoading } = usePhotoGallery()
	const deletePhotoMutation = useDeleteGalleryPhoto()
	const queryClient = useQueryClient()
	const uploadPhotoMutation = useMutation({
		mutationKey: ['uploadGalleryPhoto'],
		mutationFn: (file: File) => userPlantService.uploadPhoto(file),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['photoGallery']
			})
			toast.success('Фото загружено')
		},
		onError: () => {
			toast.error('Не удалось загрузить фото')
		}
	})

	const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]

		if (file) uploadPhotoMutation.mutate(file)

		event.target.value = ''
	}

	return (
		<div className='mx-auto flex w-full max-w-7xl flex-col gap-6'>
			<section className='rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:p-8'>
				<div className='mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between'>
					<div>
						<p className='mb-3 text-xs uppercase tracking-[0.32em] text-emerald-100/60'>
							Gallery
						</p>
						<h2 className='text-2xl font-semibold text-white sm:text-3xl'>
							Галерея
						</h2>
					</div>
					<label className='inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-emerald-200/20 bg-emerald-300/10 px-5 py-3 text-sm font-semibold text-emerald-50 transition hover:bg-emerald-300/15'>
						{uploadPhotoMutation.isPending ? (
							<LoaderCircle
								size={17}
								className='animate-spin'
							/>
						) : (
							<Upload size={17} />
						)}
						{uploadPhotoMutation.isPending ? 'Загружаем...' : 'Загрузить фото'}
						<input
							type='file'
							accept='image/*'
							className='sr-only'
							disabled={uploadPhotoMutation.isPending}
							onChange={handleUpload}
						/>
					</label>
				</div>

				{isLoading ? (
					<div className='flex min-h-56 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/60'>
						<LoaderCircle
							size={22}
							className='mr-2 animate-spin'
						/>
						Загружаем фото
					</div>
				) : data?.length ? (
					<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
						{data.map(photo => {
							const uploadedAt = formatDate(photo.uploadedAt)
							const fileSize = formatFileSize(photo.size)

							return (
								<div
									key={photo.key}
									className='overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] shadow-[0_14px_38px_rgba(0,0,0,0.18)]'
								>
									<div className='relative aspect-[4/3] overflow-hidden bg-emerald-300/10'>
										<Image
											src={photo.url}
											alt=''
											fill
											unoptimized
											sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
											className='object-cover'
											loading='lazy'
										/>
										{photo.isUsed ? (
											<div className='absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate rounded-full border border-emerald-200/25 bg-emerald-300/15 px-3 py-1 text-xs font-medium text-emerald-50 shadow-[0_8px_22px_rgba(0,0,0,0.2)] backdrop-blur-md'>
												Используется: {getPlantLabel(photo)}
											</div>
										) : null}
									</div>
									<div className='flex items-center justify-between gap-3 p-4'>
										<div className='min-w-0 text-xs text-white/50'>
											<p className='truncate'>
												{uploadedAt || 'Дата не указана'}
											</p>
											{fileSize ? <p className='mt-1'>{fileSize}</p> : null}
										</div>
										{photo.isUsed ? null : (
											<Button
												type='button'
												aria-label='Удалить фото'
												disabled={deletePhotoMutation.isPending}
												className='h-9 w-9 shrink-0 rounded-xl border-white/8 bg-black/10 px-0 text-white/55 hover:border-red-200/30 hover:bg-red-400/10 hover:text-red-100'
												onClick={() => {
													deletePhotoMutation.mutate(photo.url, {
														onSuccess: () => toast.success('Фото удалено'),
														onError: () =>
															toast.error('Не удалось удалить фото')
													})
												}}
											>
												<Trash size={16} />
											</Button>
										)}
									</div>
								</div>
							)
						})}
					</div>
				) : (
					<div className='flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-white/14 bg-white/[0.035] px-4 text-center text-white/58'>
						<ImageIcon
							size={32}
							className='mb-3 text-emerald-100/70'
						/>
						<p className='text-sm'>В галерее пока нет фото</p>
					</div>
				)}
			</section>
		</div>
	)
}
