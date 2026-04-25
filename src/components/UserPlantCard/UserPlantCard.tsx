import { Trash } from 'lucide-react'
import Image from 'next/image'

import { Button } from '../ui/buttons/Button'

import { useDeleteUserPlant } from '@/src/hooks/userPlants'
import { GetPlant } from '@/src/types/plants.types'

export function UserPlantCard({ plant }: { plant: GetPlant }) {
	const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: 'long',
		year: 'numeric'
	})

	const { mutate, isPending } = useDeleteUserPlant(plant.id)

	return (
		<article className='rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(0,0,0,0.18),rgba(255,255,255,0.04))] shadow-[0_16px_46px_rgba(0,0,0,0.22)]'>
			<div className='relative h-65 w-full overflow-hidden rounded-t-2xl'>
				<Image
					src='https://avatars.mds.yandex.net/i?id=e946039d12458a4dacf63522da29f18e_sr-12509309-images-thumbs&n=13'
					alt='Plant photo'
					fill
					sizes='(max-width: 640px) 100vw, 320px'
					className='object-cover'
				/>
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
						{/* <p className='mt-2 text-[10px] text-white/55'>
							Добавлено {dateFormatter.format(new Date(plant.createdAt))}
						</p> */}
					</div>
					<Button
						type='button'
						disabled={isPending}
						onClick={() => mutate()}
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
		</article>
	)
}
