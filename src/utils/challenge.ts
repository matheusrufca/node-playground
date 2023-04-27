const consecutive_zeros = (value: string): number => {
	const values = value.split('1')
	let biggestLength = 0
	values.forEach(item => {
		if (item.length > biggestLength)
			biggestLength = item.length
	})
	return biggestLength
}