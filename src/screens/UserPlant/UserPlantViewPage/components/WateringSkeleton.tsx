export function WateringSkeleton() {
	return (
		<div className='grid gap-6 lg:grid-cols-2'>
			{Array.from({ length: 2 }).map((_, index) => (
				<div
					key={index}
					className='rounded-3xl border border-white/10 bg-black/15 p-5'
				>
					<div className='mb-5 flex items-center gap-3'>
						<div className='h-10 w-10 rounded-2xl bg-white/10' />
						<div className='space-y-3'>
							<div className='h-4 w-36 rounded-full bg-white/10' />
							<div className='h-3 w-24 rounded-full bg-white/10' />
						</div>
					</div>
					<div className='space-y-3'>
						<div className='h-16 rounded-2xl bg-white/8' />
						<div className='h-16 rounded-2xl bg-white/8' />
					</div>
				</div>
			))}
		</div>
	)
}
