export default function fromNow(dt) {
    if (!(dt instanceof Date)) dt = new Date(dt)
    const fmt = new Intl.RelativeTimeFormat('en')
    const diff = (dt.getTime() - Date.now()) / 1000

    const ranges = {
        years: 0,
        months: 0,
        weeks: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    }
    ranges.seconds = 1
    ranges.minutes = ranges.seconds * 60
    ranges.hours = ranges.minutes * 60
    ranges.days = ranges.hours * 24
    ranges.weeks = ranges.days * 7
    ranges.months = ranges.days * 30
    ranges.years = ranges.days * 365

    for (let r in ranges)
        if (ranges[r] < Math.abs(diff))
            return fmt.format(Math.round(diff / ranges[r]), r)
}
