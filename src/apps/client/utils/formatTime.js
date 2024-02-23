export const formatTime = (date, noSeconds) => {
    const newTime = new Date(date);

    return newTime.toLocaleTimeString([], !noSeconds ? { hour: '2-digit', minute: '2-digit', second: '2-digit' } : { hour: '2-digit', minute: '2-digit' });
};
