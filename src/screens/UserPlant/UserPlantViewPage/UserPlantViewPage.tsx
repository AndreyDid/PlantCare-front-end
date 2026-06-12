'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { CareEventModal } from './components/CareEventModal'
import { CareHistoryModal } from './components/CareHistoryModal'
import { CareHistoryPreview } from './components/CareHistoryPreview'
import { DuplicatePlantModal } from './components/DuplicatePlantModal'
import { PlantActionsPanel } from './components/PlantActionsPanel'
import { PlantCareAnalysisModal } from './components/PlantCareAnalysisModal'
import { PlantEditModal } from './components/PlantEditModal'
import { PlantNotFound } from './components/PlantNotFound'
import { PlantOverview } from './components/PlantOverview'
import { PlantProfileHeader } from './components/PlantProfileHeader'
import { PlantViewSkeleton } from './components/PlantViewSkeleton'
import { DASHBOARD_PAGES } from '@/src/config/pages-url.config'
import {
	useCreatePlantCareEvent,
	useDeletePlantCareEvent,
	useGetUserPlantsById,
	useUpdateUserPlant
} from '@/src/hooks/userPlants'
import { useUserProfile } from '@/src/hooks/userProfile'
import { userPlantService } from '@/src/services/userPlant.service'
import { toIsoDate } from '@/src/shared/utils/date.utils'
import {
	nullableNumber,
	nullableString
} from '@/src/shared/utils/nullable.utils'
import {
	getNextWateringInputDate,
	sortCareEventsByDate
} from '@/src/shared/utils/plant-care.utils'
import {
	getCareEventFormValues,
	getDuplicatePlantPayload,
	getDuplicatePlantValues,
	getPlantFormValues,
	getUpdatePlantPayload
} from '@/src/shared/utils/user-plant-form.utils'
import type {
	CareEventForm,
	DuplicatePlantForm
} from '@/src/shared/utils/user-plant-form.utils'
import type {
	CreatePlantCareEvent,
	PlantAiSuggestion,
	PlantCareAnalysis,
	UpdateUserPlant
} from '@/src/types/plants.types'

const aiSuggestionFields: Array<keyof UpdateUserPlant> = [
	'plantName',
	'lightLevel',
	'temperatureMin',
	'temperatureMax',
	'humidityMin',
	'humidityMax',
	'potType',
	'potSize',
	'soilType',
	'wateringIntervalDays',
	'wateringIntervalSpringDays',
	'wateringIntervalSummerDays',
	'wateringIntervalAutumnDays',
	'wateringIntervalWinterDays',
	'wateringAmountMl',
	'wateringNotes',
	'fertilizingIntervalDays'
]

export function UserPlantViewPage() {
	const params = useParams()
	const router = useRouter()
	const queryClient = useQueryClient()
	const id = String(params.id)

	const [isDuplicateOpen, setIsDuplicateOpen] = useState(false)
	const [isEditOpen, setIsEditOpen] = useState(false)
	const [isCareEventOpen, setIsCareEventOpen] = useState(false)
	const [isCareAnalysisOpen, setIsCareAnalysisOpen] = useState(false)
	const [isHistoryOpen, setIsHistoryOpen] = useState(false)
	const [photoFile, setPhotoFile] = useState<File | null>(null)
	const [careEventPhotoFile, setCareEventPhotoFile] = useState<File | null>(
		null
	)
	const [isCareEventPhotoUploading, setIsCareEventPhotoUploading] =
		useState(false)
	const [aiCity, setAiCity] = useState('')
	const [analysisCity, setAnalysisCity] = useState('')
	const [analysisQuestion, setAnalysisQuestion] = useState('')
	const [aiSuggestion, setAiSuggestion] = useState<PlantAiSuggestion | null>(
		null
	)
	const [careAnalysis, setCareAnalysis] = useState<PlantCareAnalysis | null>(
		null
	)
	const photoPreviewUrl = useMemo(
		() => (photoFile ? URL.createObjectURL(photoFile) : null),
		[photoFile]
	)
	const careEventPhotoPreviewUrl = useMemo(
		() =>
			careEventPhotoFile ? URL.createObjectURL(careEventPhotoFile) : null,
		[careEventPhotoFile]
	)

	const { data, isLoading } = useGetUserPlantsById(id)
	const { data: profileData } = useUserProfile()

	const { register, handleSubmit, reset, setValue, control } =
		useForm<UpdateUserPlant>()
	const {
		register: registerDuplicate,
		handleSubmit: handleDuplicateSubmit,
		reset: resetDuplicate
	} = useForm<DuplicatePlantForm>()
	const {
		register: registerCareEvent,
		handleSubmit: handleCareEventSubmit,
		reset: resetCareEvent,
		formState: { dirtyFields: careEventDirtyFields }
	} = useForm<CareEventForm>({
		defaultValues: getCareEventFormValues()
	})

	const updatePlantMutation = useUpdateUserPlant(id)
	const createCareEventMutation = useCreatePlantCareEvent(id)
	const deleteCareEventMutation = useDeletePlantCareEvent(id)
	const isCareEventSubmitting =
		createCareEventMutation.isPending || isCareEventPhotoUploading
	const aiSuggestMutation = useMutation({
		mutationKey: ['suggestExistingPlantCare', id],
		mutationFn: () => {
			if (!data) throw new Error('Plant not found')

			return userPlantService.suggestExistingCare(id, {
				city: nullableString(aiCity)
			})
		},
		onSuccess: result => {
			setAiSuggestion(result)
			applySuggestedValues(result.suggestion)
			toast.success('ИИ заполнил черновик ухода')
		},
		onError: error => {
			toast.error(
				error instanceof Error
					? error.message
					: 'Не удалось получить подсказку от ИИ'
			)
		}
	})
	const careAnalysisMutation = useMutation({
		mutationKey: ['analyzePlantCare', id],
		mutationFn: () => {
			if (!data) throw new Error('Plant not found')

			return userPlantService.analyzeCare(id, {
				city: nullableString(analysisCity),
				question: nullableString(analysisQuestion)
			})
		},
		onSuccess: result => {
			setCareAnalysis(result)
		},
		onError: error => {
			toast.error(
				error instanceof Error
					? error.message
					: 'Не удалось выполнить анализ ухода'
			)
		}
	})
	const duplicateMutation = useMutation({
		mutationKey: ['duplicatePlant', id],
		mutationFn: (formValues: DuplicatePlantForm) => {
			if (!data) {
				throw new Error('Plant not found')
			}

			return userPlantService.create(getDuplicatePlantPayload(data, formValues))
		},
		onSuccess: newPlant => {
			toast.success('Растение скопировано')
			queryClient.invalidateQueries({
				queryKey: ['userPlants']
			})
			setIsDuplicateOpen(false)
			resetDuplicate(getDuplicatePlantValues(newPlant))
			router.push(DASHBOARD_PAGES.PLANT(newPlant.id))
		}
	})

	const [
		lastWateredAt,
		wateringIntervalDays,
		wateringIntervalSpringDays,
		wateringIntervalSummerDays,
		wateringIntervalAutumnDays,
		wateringIntervalWinterDays
	] = useWatch({
		control,
		name: [
			'lastWateredAt',
			'wateringIntervalDays',
			'wateringIntervalSpringDays',
			'wateringIntervalSummerDays',
			'wateringIntervalAutumnDays',
			'wateringIntervalWinterDays'
		]
	})
	const selectedPhotoUrl =
		useWatch({
			control,
			name: 'photoUrl'
		}) ?? null

	function applySuggestedValues(suggestion: UpdateUserPlant) {
		aiSuggestionFields.forEach(field => {
			const value = suggestion[field]

			if (value !== undefined) {
				setValue(field, value, {
					shouldDirty: true
				})
			}
		})
	}

	useEffect(() => {
		reset(getPlantFormValues(data))
	}, [reset, data])

	useEffect(() => {
		return () => {
			if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl)
		}
	}, [photoPreviewUrl])

	useEffect(() => {
		return () => {
			if (careEventPhotoPreviewUrl) {
				URL.revokeObjectURL(careEventPhotoPreviewUrl)
			}
		}
	}, [careEventPhotoPreviewUrl])

	useEffect(() => {
		resetDuplicate(getDuplicatePlantValues(data))
	}, [resetDuplicate, data])

	useEffect(() => {
		resetCareEvent(getCareEventFormValues())
	}, [resetCareEvent, data?.id])

	useEffect(() => {
		const nextWateringAt = getNextWateringInputDate(lastWateredAt, {
			wateringIntervalDays,
			wateringIntervalSpringDays,
			wateringIntervalSummerDays,
			wateringIntervalAutumnDays,
			wateringIntervalWinterDays
		})

		if (nextWateringAt) {
			setValue('nextWateringAt', nextWateringAt, {
				shouldDirty: true
			})
		}
	}, [
		lastWateredAt,
		setValue,
		wateringIntervalDays,
		wateringIntervalSpringDays,
		wateringIntervalSummerDays,
		wateringIntervalAutumnDays,
		wateringIntervalWinterDays
	])

	const resetEditForm = () => {
		setPhotoFile(null)
		setAiSuggestion(null)
		reset(getPlantFormValues(data))
	}

	const openEditModal = () => {
		resetEditForm()
		setAiCity(currentCity => currentCity || profileData?.user.city || '')
		setIsEditOpen(true)
	}

	const closeEditModal = () => {
		if (updatePlantMutation.isPending) return

		resetEditForm()
		setIsEditOpen(false)
	}

	const openCareEventModal = () => {
		setCareEventPhotoFile(null)
		resetCareEvent(getCareEventFormValues())
		setIsCareEventOpen(true)
	}

	const closeCareEventModal = () => {
		if (isCareEventSubmitting) return

		setCareEventPhotoFile(null)
		resetCareEvent(getCareEventFormValues())
		setIsCareEventOpen(false)
	}

	const openCareAnalysisModal = () => {
		setAnalysisCity(aiCity || profileData?.user.city || '')
		setIsCareAnalysisOpen(true)
	}

	const closeCareAnalysisModal = () => {
		if (careAnalysisMutation.isPending) return

		setIsCareAnalysisOpen(false)
	}

	const openDuplicateModal = () => {
		resetDuplicate(getDuplicatePlantValues(data))
		setIsDuplicateOpen(true)
	}

	const closeDuplicateModal = () => {
		if (duplicateMutation.isPending) return

		setIsDuplicateOpen(false)
		resetDuplicate(getDuplicatePlantValues(data))
	}

	const onDuplicateSubmit = handleDuplicateSubmit(formValues => {
		duplicateMutation.mutate(formValues)
	})

	const handleApplyAnalysisAdjustments = () => {
		if (!careAnalysis) return

		reset(getPlantFormValues(data))
		applySuggestedValues(careAnalysis.suggestedAdjustments)
		setIsCareAnalysisOpen(false)
		setIsEditOpen(true)
		toast.success('Рекомендации перенесены в форму редактирования')
	}

	const onCareEventSubmit = handleCareEventSubmit(async formValues => {
		let photoUrl: string | null = null

		try {
			if (careEventPhotoFile) {
				setIsCareEventPhotoUploading(true)

				photoUrl = await userPlantService.uploadCareEventPhoto(
					id,
					careEventPhotoFile
				)
			}

			const payload: CreatePlantCareEvent = {
				type: formValues.type,
				title: nullableString(formValues.title),
				description: nullableString(formValues.description),
				eventAt: careEventDirtyFields.eventAt
					? toIsoDate(formValues.eventAt)
					: undefined,
				amountMl: nullableNumber(formValues.amountMl),
				photoUrl: nullableString(photoUrl)
			}
			const updatedPlant = await createCareEventMutation.mutateAsync(payload)

			reset(getPlantFormValues(updatedPlant))
			setCareEventPhotoFile(null)
			resetCareEvent(getCareEventFormValues())
			setIsCareEventOpen(false)
			toast.success('Событие добавлено в историю')
		} catch {
			toast.error('Не удалось добавить событие')
		} finally {
			setIsCareEventPhotoUploading(false)
		}
	})

	const onSubmit = handleSubmit(async formValues => {
		const photoUrl = photoFile
			? await userPlantService.uploadPhoto(photoFile)
			: formValues.photoUrl

		const updatedPlant = await updatePlantMutation.mutateAsync(
			getUpdatePlantPayload(formValues, photoUrl)
		)

		setPhotoFile(null)
		reset(getPlantFormValues(updatedPlant))
		queryClient.invalidateQueries({
			queryKey: ['photoGallery']
		})
		setIsEditOpen(false)
		toast.success('Карточка растения обновлена')
	})

	const handleWaterNow = async () => {
		if (!data || createCareEventMutation.isPending) return

		const wateredAt = new Date()
		const updatedPlant = await createCareEventMutation.mutateAsync({
			type: 'WATERING',
			title: 'Полив',
			description: data.wateringNotes,
			eventAt: wateredAt.toISOString(),
			amountMl: data.wateringAmountMl
		})

		reset(getPlantFormValues(updatedPlant))
		toast.success('Полив добавлен в историю')
	}

	const handleDeleteCareEvent = async (eventId: string) => {
		if (deleteCareEventMutation.isPending) return

		const shouldDelete = window.confirm('Удалить это событие из истории?')

		if (!shouldDelete) return

		const updatedPlant = await deleteCareEventMutation.mutateAsync(eventId)

		reset(getPlantFormValues(updatedPlant))
		toast.success('Событие удалено')
	}

	if (isLoading) return <PlantViewSkeleton />

	if (!data) {
		return <PlantNotFound onBack={() => router.back()} />
	}

	const title = data.nickname || data.plantName || 'Без названия'
	const subtitle = data.plantName || 'Комнатное растение'
	const careEvents = sortCareEventsByDate(data.careEvents ?? [])

	return (
		<div className='w-full max-w-7xl'>
			<section className='rounded-[22px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:rounded-[28px] sm:p-6 lg:rounded-[32px] lg:p-8'>
				<PlantProfileHeader
					title={title}
					onBack={() => router.back()}
					onEdit={openEditModal}
				/>

				<div className='flex flex-col gap-4 sm:gap-6 lg:gap-8'>
					<PlantOverview
						plant={data}
						title={title}
						subtitle={subtitle}
						photoPreviewUrl={photoPreviewUrl}
						isWateringPending={createCareEventMutation.isPending}
						onWaterNow={handleWaterNow}
					/>

					<div className='grid gap-3 md:grid-cols-[minmax(0,0.85fr)_minmax(280px,0.55fr)] lg:gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(320px,0.55fr)]'>
						<CareHistoryPreview
							events={careEvents}
							onOpenHistory={() => setIsHistoryOpen(true)}
						/>
						<PlantActionsPanel
							onAddEvent={openCareEventModal}
							onAnalyzeCare={openCareAnalysisModal}
							onDuplicate={openDuplicateModal}
							onEdit={openEditModal}
						/>
					</div>
				</div>
			</section>

			<PlantEditModal
				aiCity={aiCity}
				aiSuggestion={aiSuggestion}
				currentPlantId={id}
				isOpen={isEditOpen}
				isAiSuggestPending={aiSuggestMutation.isPending}
				isPending={updatePlantMutation.isPending}
				selectedPhotoUrl={selectedPhotoUrl}
				windowDirections={profileData?.user.windowDirections}
				register={register}
				onAiCityChange={setAiCity}
				onAiSuggest={() => aiSuggestMutation.mutate()}
				onClose={closeEditModal}
				onGalleryPhotoSelect={url => {
					setPhotoFile(null)
					setValue('photoUrl', url, {
						shouldDirty: true
					})
				}}
				onPhotoChange={file => {
					setPhotoFile(file)
					if (file) {
						setValue('photoUrl', null, {
							shouldDirty: true
						})
					}
				}}
				onWindowDirectionSelect={values => {
					setValue('location', values.location, {
						shouldDirty: true
					})
					setValue('lightLevel', values.lightLevel, {
						shouldDirty: true
					})
				}}
				onSubmit={onSubmit}
			/>
			<PlantCareAnalysisModal
				analysis={careAnalysis}
				city={analysisCity}
				isOpen={isCareAnalysisOpen}
				isPending={careAnalysisMutation.isPending}
				question={analysisQuestion}
				onAnalyze={() => careAnalysisMutation.mutate()}
				onApplyAdjustments={handleApplyAnalysisAdjustments}
				onCityChange={setAnalysisCity}
				onClose={closeCareAnalysisModal}
				onQuestionChange={setAnalysisQuestion}
			/>
			<CareEventModal
				isOpen={isCareEventOpen}
				isPending={isCareEventSubmitting}
				photoFileName={careEventPhotoFile?.name}
				photoPreviewUrl={careEventPhotoPreviewUrl}
				register={registerCareEvent}
				onClose={closeCareEventModal}
				onPhotoChange={setCareEventPhotoFile}
				onPhotoRemove={() => setCareEventPhotoFile(null)}
				onSubmit={onCareEventSubmit}
			/>
			<CareHistoryModal
				isOpen={isHistoryOpen}
				events={careEvents}
				isDeleting={deleteCareEventMutation.isPending}
				deletingEventId={deleteCareEventMutation.variables}
				onClose={() => setIsHistoryOpen(false)}
				onDelete={handleDeleteCareEvent}
			/>
			<DuplicatePlantModal
				isOpen={isDuplicateOpen}
				isPending={duplicateMutation.isPending}
				register={registerDuplicate}
				onClose={closeDuplicateModal}
				onSubmit={onDuplicateSubmit}
			/>
		</div>
	)
}
