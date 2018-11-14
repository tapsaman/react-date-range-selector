

const DAYS_IN_MONTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

function isLeapYear(y) {
	return !(y & 3 || !(y % 25) && y & 15)
}

export function daysInMonth(m, y) {
	return m===1 && isLeapYear(y)
		? 	29
		: 	DAYS_IN_MONTHS[m]
}


function isSameMonth(date1, date2) {
	return date1.getYear() === date2.getYear()
		&& date1.getMonth() === date2.getMonth()
}

//export function __firstDayOfWeek(dayOfWeek, dayOfMonth) {
//	const f = dayOfWeek - ((dayOfMonth - 1) % 7)
//	return f > -1 ? f : f + 7
//}

function setDateToPrevWeekStart(date, startOfWeek) {
	//const dayOfWeek = date.getDay()
	//const dayOfMonth = date.getDate()
	//let d = dayOfWeek - ((dayOfMonth - 1) % 7)
	////d = d > 0 ? d - 7 : d
	//d -= 7
	//date.setDate( d+startOfWeek+1 )

	date.setHours(0)
	date.setMinutes(0)


	
	date.setDate(1)
	const firstDayOfWeek = date.getDay()
	const diff = -firstDayOfWeek + startOfWeek + 1

	date.setDate(diff > 0 ? diff-7 : diff)

}

export function getMonthViewCells(date, minDate, maxDate, startOfWeek)
{
	const ret = [[],[],[],[],[],[]]

	const date_i = new Date(date)
	setDateToPrevWeekStart(date_i, startOfWeek)

	const month = date.getMonth()

	for (let wk = 0; wk < 6; wk++)
	{
		for (let wd = 0; wd < 7; wd++)
		{
			const dayOfMonth = date_i.getDate()
			const relMonth = date_i.getMonth() - month

			ret[wk][wd] = {
				d: 			dayOfMonth,
				wd: 		wd + startOfWeek,
				ds: 		date_i.toDateString(),
				relMonth: 	Math.abs(relMonth) > 1 ? relMonth * -1 : relMonth,
				disabled: 	date_i < minDate || date_i > maxDate
			}

			date_i.setDate(dayOfMonth + 1)
		}
	}

	return ret
}

export function getYearViewCells(date, minDate, maxDate, startOfWeek)
{
	const ret = [[],[],[],[]]

	const date_i = new Date(date)

	date_i.setMonth(0)
	date_i.setDate(0)

	for (let mr = 0; mr < 4; mr++)
	{
		for (let m = 0; m < 3; m++)
		{
			const month = date_i.getMonth()

			ret[mr][m] = {
				m: 			mr * 3 + m,
				disabled: 	date_i < minDate || date_i > maxDate
			}

			date_i.setMonth(month + 1)
		}
	}

	return ret
}