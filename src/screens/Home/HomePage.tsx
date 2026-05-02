import { Bell, CalendarDays, Clock3, Droplets, Sprout } from 'lucide-react'

const wateringAlerts = [
	{
		plant: 'Монстера',
		time: 'Сегодня, 18:00',
		status: 'Плановый полив'
	},
	{
		plant: 'Фикус',
		time: 'Завтра, 09:30',
		status: 'Проверить влажность'
	},
	{
		plant: 'Сансевиерия',
		time: 'Через 3 дня',
		status: 'Легкий полив'
	}
]

const recentEvents = [
	{
		title: 'Добавлено новое растение',
		description: 'В коллекцию добавлена Монстера',
		time: '2 часа назад'
	},
	{
		title: 'Обновлен уход',
		description: 'Для Фикуса изменен график полива',
		time: 'Вчера'
	},
	{
		title: 'Фото растения',
		description: 'Загружена новая фотография Сансевиерии',
		time: '25 апреля'
	}
]

export function HomePage() {
	return (
		<div className='relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6'>
			<section className='rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:p-8'>
				<div className='flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between'>
					<div>
						<p className='mb-3 text-xs uppercase tracking-[0.32em] text-emerald-100/60'>
							Home
						</p>
						<h1 className='text-2xl font-semibold text-white sm:text-3xl'>
							Главная
						</h1>
						<p className='mt-3 max-w-2xl text-sm leading-6 text-white/60'>
							Короткая сводка по уходу за растениями: ближайшие поливы и
							последние изменения в коллекции.
						</p>
					</div>

					<div className='flex items-center gap-3 rounded-2xl border border-emerald-200/20 bg-emerald-300/10 px-4 py-3 text-emerald-100'>
						<Sprout size={20} />
						<span className='text-sm font-medium'>3 активных напоминания</span>
					</div>
				</div>

				<div className='mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]'>
					<div className='rounded-3xl border border-white/10 bg-black/15 p-5'>
						<div className='mb-5 flex items-center justify-between gap-3'>
							<div className='flex items-center gap-3'>
								<div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-300/12 text-emerald-100'>
									<Droplets size={20} />
								</div>
								<div>
									<h2 className='text-base font-semibold text-white'>
										Оповещения о поливе
									</h2>
									<p className='text-sm text-white/50'>Ближайшие задачи</p>
								</div>
							</div>
							<Bell className='text-emerald-100/50' size={19} />
						</div>

						<div className='flex flex-col gap-3'>
							{wateringAlerts.map(alert => (
								<div
									key={`${alert.plant}-${alert.time}`}
									className='flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/5 px-4 py-3'
								>
									<div>
										<p className='font-medium text-white'>{alert.plant}</p>
										<p className='mt-1 text-sm text-white/55'>{alert.status}</p>
									</div>
									<div className='flex items-center gap-2 text-right text-sm text-emerald-100/70'>
										<Clock3 size={15} />
										<span>{alert.time}</span>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className='rounded-3xl border border-white/10 bg-black/15 p-5'>
						<div className='mb-5 flex items-center gap-3'>
							<div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-lime-300/12 text-lime-100'>
								<CalendarDays size={20} />
							</div>
							<div>
								<h2 className='text-base font-semibold text-white'>
									Последние события
								</h2>
								<p className='text-sm text-white/50'>Недавняя активность</p>
							</div>
						</div>

						<div className='flex flex-col gap-4'>
							{recentEvents.map(event => (
								<div
									key={`${event.title}-${event.time}`}
									className='border-b border-white/8 pb-4 last:border-b-0 last:pb-0'
								>
									<div className='flex items-start justify-between gap-4'>
										<div>
											<p className='font-medium text-white'>{event.title}</p>
											<p className='mt-1 text-sm leading-5 text-white/55'>
												{event.description}
											</p>
										</div>
										<span className='shrink-0 text-xs text-white/40'>
											{event.time}
										</span>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}
