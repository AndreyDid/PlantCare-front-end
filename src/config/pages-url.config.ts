class DASHBOARD {
	private root = '/i'

	HOME = this.root
	PLANTS = `${this.root}/plants`
	GALLERY = `${this.root}/gallery`
	HISTORY = `${this.root}/history`
	PROFILE = `${this.root}/profile`
	PLANT = (id: string) => `${this.root}/${id}`
}

export const DASHBOARD_PAGES = new DASHBOARD()
