import { intervalToDuration } from 'date-fns';

const getFormattedDuration = (seconds) => {
    if (!seconds) return;
    const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
    const formattedSeconds = duration.seconds < 10 ? `0${duration.seconds}` : duration.seconds;
    const formattedDuration = `${duration.minutes}:${formattedSeconds}`;

    return formattedDuration;
};

export default getFormattedDuration;
