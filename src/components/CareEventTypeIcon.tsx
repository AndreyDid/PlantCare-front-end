import {
	Droplets,
	Eye,
	FlaskConical,
	RefreshCw,
	StickyNote
} from 'lucide-react'

import type { PlantCareEventType } from '@/src/types/plants.types'

interface CareEventTypeIconProps {
	size: number
	type: PlantCareEventType
}

export function CareEventTypeIcon({ size, type }: CareEventTypeIconProps) {
	if (type === 'WATERING') return <Droplets size={size} />
	if (type === 'FERTILIZING') return <FlaskConical size={size} />
	if (type === 'REPOTTING') return <RefreshCw size={size} />
	if (type === 'OBSERVATION') return <Eye size={size} />

	return <StickyNote size={size} />
}
