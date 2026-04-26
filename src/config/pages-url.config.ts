class DASHBOARD {
	private root = '/i'

	HOME = this.root
	PLANTS = `${this.root}/plants`
	PLANT = (id: string) => `${this.root}/${id}`
}

export const DASHBOARD_PAGES = new DASHBOARD()
