const getFormattedDate = (date, locale, isWeek, weekDayOnly) => {
    if (!date) return;

    const dateToFormat = new Date(date);
    const df = !weekDayOnly
        ? new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric', ...(isWeek ? { weekday: 'long' } : {}) })
        : new Intl.DateTimeFormat(locale, { weekday: 'long' });

    return df.format(dateToFormat);
};

export default getFormattedDate;
