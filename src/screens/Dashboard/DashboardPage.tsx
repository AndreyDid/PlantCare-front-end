import { CreatePlantForm } from '@/src/components/CreatePlantForm'
import { UserPlantsList } from '@/src/components/UserPlantsList/UserPlantsList'

export function DashboardPage() {
	return (
		<div
		// className='relative min-h-screen overflow-x-hidden'
		>
			{/* <Header /> */}
			{/* <div className='absolute left-[-5rem] top-[-4rem] h-56 w-56 rounded-full bg-emerald-300/10 blur-3xl' />
			<div className='absolute bottom-[-6rem] right-[-4rem] h-72 w-72 rounded-full bg-lime-200/10 blur-3xl' /> */}

			<div className='relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6'>
				<div>
					<section className='rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:p-8'>
						<div className='mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between'>
							<div>
								<p className='mb-3 text-xs uppercase tracking-[0.32em] text-emerald-100/60'>
									My Plants
								</p>
								<h2 className='text-2xl font-semibold text-white sm:text-3xl'>
									Коллекция растений
								</h2>
								<p className='mt-3 max-w-2xl text-sm leading-6 text-white/60'>
									Карточки собираются ниже. Добавление нового растения открывает
									отдельное модальное окно поверх всего приложения.
								</p>
							</div>
							<CreatePlantForm />
						</div>

						<UserPlantsList />
					</section>
				</div>
			</div>
		</div>
	)
}
