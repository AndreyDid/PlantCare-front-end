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
import { userPlantService } from '@/src/services/userPlant.service'
import { toIsoDate } from '@/src/shared/utils/date.utils'
import { nullableNumber, nullableString } from '@/src/shared/utils/nullable.utils'
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
	UpdateUserPlant
} from '@/src/types/plants.types'

export function UserPlantViewPage() {
	const params = useParams()
	const router = useRouter()
	const queryClient = useQueryClient()
	const id = String(params.id)

	const [isDuplicateOpen, setIsDuplicateOpen] = useState(false)
	const [isEditOpen, setIsEditOpen] = useState(false)
	const [isCareEventOpen, setIsCareEventOpen] = useState(false)
	const [isHistoryOpen, setIsHistoryOpen] = useState(false)
	const [photoFile, setPhotoFile] = useState<File | null>(null)
	const photoPreviewUrl = useMemo(
		() => (photoFile ? URL.createObjectURL(photoFile) : null),
		[photoFile]
	)

	const { data, isLoading } = useGetUserPlantsById(id)

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

	useEffect(() => {
		reset(getPlantFormValues(data))
	}, [reset, data])

	useEffect(() => {
		return () => {
			if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl)
		}
	}, [photoPreviewUrl])

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
		reset(getPlantFormValues(data))
	}

	const openEditModal = () => {
		resetEditForm()
		setIsEditOpen(true)
	}

	const closeEditModal = () => {
		if (updatePlantMutation.isPending) return

		resetEditForm()
		setIsEditOpen(false)
	}

	const openCareEventModal = () => {
		resetCareEvent(getCareEventFormValues())
		setIsCareEventOpen(true)
	}

	const closeCareEventModal = () => {
		if (createCareEventMutation.isPending) return

		resetCareEvent(getCareEventFormValues())
		setIsCareEventOpen(false)
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

	const onCareEventSubmit = handleCareEventSubmit(async formValues => {
		const payload: CreatePlantCareEvent = {
			type: formValues.type,
			title: nullableString(formValues.title),
			description: nullableString(formValues.description),
			eventAt: careEventDirtyFields.eventAt
				? toIsoDate(formValues.eventAt)
				: undefined,
			amountMl: nullableNumber(formValues.amountMl)
		}
		const updatedPlant = await createCareEventMutation.mutateAsync(payload)

		reset(getPlantFormValues(updatedPlant))
		resetCareEvent(getCareEventFormValues())
		setIsCareEventOpen(false)
		toast.success('Событие добавлено в историю')
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
			<section className='rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:p-8 '>
				<PlantProfileHeader
					title={title}
					onBack={() => router.back()}
					onEdit={openEditModal}
				/>

				<div className='flex flex-col gap-8'>
					<PlantOverview
						plant={data}
						title={title}
						subtitle={subtitle}
						photoPreviewUrl={photoPreviewUrl}
						isWateringPending={createCareEventMutation.isPending}
						onWaterNow={handleWaterNow}
					/>

					<div className='grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(320px,0.55fr)]'>
						<CareHistoryPreview
							events={careEvents}
							onOpenHistory={() => setIsHistoryOpen(true)}
						/>
						<PlantActionsPanel
							onAddEvent={openCareEventModal}
							onDuplicate={openDuplicateModal}
							onEdit={openEditModal}
						/>
					</div>
				</div>
			</section>

			<PlantEditModal
				isOpen={isEditOpen}
				isPending={updatePlantMutation.isPending}
				register={register}
				onClose={closeEditModal}
				onPhotoChange={setPhotoFile}
				onSubmit={onSubmit}
			/>
			<CareEventModal
				isOpen={isCareEventOpen}
				isPending={createCareEventMutation.isPending}
				register={registerCareEvent}
				onClose={closeCareEventModal}
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
