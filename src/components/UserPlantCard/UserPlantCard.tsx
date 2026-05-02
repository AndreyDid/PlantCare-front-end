import { Flower2, Leaf, MapPin, Trash } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Button } from '../ui/buttons/Button'

import { DASHBOARD_PAGES } from '@/src/config/pages-url.config'
import { useDeleteUserPlant } from '@/src/hooks/userPlants'
import { GetPlant } from '@/src/types/plants.types'

export function UserPlantCard({ plant }: { plant: GetPlant }) {
	const router = useRouter()

	const { mutate, isPending } = useDeleteUserPlant(plant.id)

	return (
		<div
			className='cursor-pointer rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(0,0,0,0.18),rgba(255,255,255,0.04))] shadow-[0_16px_46px_rgba(0,0,0,0.22)] transition hover:border-emerald-200/30'
			onClick={() => router.push(DASHBOARD_PAGES.PLANT(plant.id))}
			role='link'
			tabIndex={0}
			onKeyDown={event => {
				if (event.key === 'Enter' || event.key === ' ') {
					router.push(DASHBOARD_PAGES.PLANT(plant.id))
				}
			}}
		>
			<div className='relative h-100 w-full overflow-hidden rounded-t-2xl'>
				{/* <Image
					src='https://avatars.mds.yandex.net/i?id=e946039d12458a4dacf63522da29f18e_sr-12509309-images-thumbs&n=13'
					alt='Plant photo'
					fill
					sizes='(max-width: 640px) 100vw, 320px'
					className='object-cover'
				/> */}
				{/* <div className='relative min-h-[320px] overflow-hidden rounded-[28px] border border-white/10 bg-black/15 shadow-[0_16px_46px_rgba(0,0,0,0.22)] sm:min-h-[460px]'> */}
				{plant.photoUrl ? (
					<Image
						src={plant.photoUrl}
						alt={plant.plantName}
						fill
						unoptimized
						sizes='(max-width: 1024px) 100vw, 720px'
						className='object-cover'
					/>
				) : (
					<div className='flex h-full min-h-[320px] items-center justify-center bg-[linear-gradient(135deg,rgba(142,229,143,0.18),rgba(255,255,255,0.05))] text-emerald-100 sm:min-h-[460px]'>
						<Flower2 size={86} />
					</div>
				)}
			</div>
			<div className='p-5'>
				<div className='mb-6 flex items-start justify-between gap-4'>
					<div>
						<p className='mb-2 text-[12px] uppercase tracking-[0.28em] text-emerald-100/55'>
							{/* Plant Profile */}
							{plant.plantName}
						</p>
						<h3 className='text-[16px]  text-white '>
							{plant.nickname || plant.plantName}
						</h3>
						{plant.location ? (
							<p className='mt-2 flex items-center gap-1.5 text-xs text-white/55'>
								<MapPin size={14} />
								{plant.location}
							</p>
						) : null}
						{/* <p className='mt-2 text-[10px] text-white/55'>
							Добавлено {dateFormatter.format(new Date(plant.createdAt))}
						</p> */}
					</div>
					<Button
						type='button'
						disabled={isPending}
						onClick={event => {
							event.stopPropagation()
							mutate()
						}}
					>
						<Trash />
					</Button>
				</div>

				{/* <div> */}
				{/* <div className='rounded-2xl border border-white/8 bg-white/5 p-4'> */}
				{/* <p className='text-[10px] uppercase tracking-[0.24em] text-white/45'>
						Вид
					</p>
					<p className='text-base font-medium text-white'>{plant.plantName}</p> */}
				{/* </div> */}
				{/* </div> */}
			</div>
		</div>
	)
}
