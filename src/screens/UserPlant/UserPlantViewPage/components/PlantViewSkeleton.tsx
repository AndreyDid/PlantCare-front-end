export function PlantViewSkeleton() {
	return (
		<div className='w-full max-w-7xl'>
			<div className='rounded-[22px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:rounded-[28px] sm:p-6 lg:rounded-[32px] lg:p-8'>
				<div className='mb-4 h-10 w-36 rounded-2xl bg-white/10 sm:mb-8' />
				<div className='grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(340px,0.75fr)] lg:gap-6'>
					<div className='h-[220px] animate-pulse rounded-[20px] bg-white/10 sm:h-[340px] sm:rounded-[26px] lg:h-[420px] lg:rounded-[28px]' />
					<div className='space-y-4'>
						<div className='h-4 w-28 rounded-full bg-white/10' />
						<div className='h-10 w-3/4 rounded-full bg-white/10' />
						<div className='h-20 rounded-2xl bg-white/10 sm:h-24 sm:rounded-[24px]' />
						<div className='grid grid-cols-2 gap-2 sm:gap-3'>
							<div className='h-24 rounded-2xl bg-white/10 sm:h-32 sm:rounded-[24px]' />
							<div className='h-24 rounded-2xl bg-white/10 sm:h-32 sm:rounded-[24px]' />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
