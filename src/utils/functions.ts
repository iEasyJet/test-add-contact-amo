export function estimatedAge(age: number): number {
	const currentDate = Date.now()
	const currentYear = new Date(currentDate).getFullYear()
	const ageYear = new Date(age * 1000).getFullYear()

	return currentYear - ageYear
}