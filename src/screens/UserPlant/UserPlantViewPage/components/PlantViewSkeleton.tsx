export function PlantViewSkeleton() {
	return (
		<div className='w-full max-w-7xl'>
			<div className='rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:p-8'>
				<div className='mb-8 h-10 w-36 rounded-2xl bg-white/10' />
				<div className='grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.75fr)]'>
					<div className='h-[420px] animate-pulse rounded-[28px] bg-white/10' />
					<div className='space-y-4'>
						<div className='h-4 w-28 rounded-full bg-white/10' />
						<div className='h-10 w-3/4 rounded-full bg-white/10' />
						<div className='h-24 rounded-[24px] bg-white/10' />
						<div className='grid grid-cols-2 gap-3'>
							<div className='h-32 rounded-[24px] bg-white/10' />
							<div className='h-32 rounded-[24px] bg-white/10' />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

