const getFormattedDateRelative = (date, locale) => {
    if (!date) return;

    const dateToFormat = new Date(date);
    const formatter = new Intl.RelativeTimeFormat(locale);
    const ranges = {
        years: 3600 * 24 * 365,
        months: 3600 * 24 * 30,
        weeks: 3600 * 24 * 7,
        days: 3600 * 24,
        hours: 3600,
        minutes: 60,
        seconds: 1
    };
    const secondsElapsed = (dateToFormat.getTime() - Date.now()) / 1000;

    let returnValue = null;
    Object.keys(ranges).forEach((key) => {
        if (ranges[key] < Math.abs(secondsElapsed) && !returnValue) {
            const delta = secondsElapsed / ranges[key];
            returnValue = formatter.format(Math.round(delta), key);
        }
    });

    return returnValue;
};

export default getFormattedDateRelative;
