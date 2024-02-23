const isIOS = () => {
    const userAgent = window.navigator.userAgent;
    const match = userAgent.match(/(iPad|iPhone|iPod)\s+OS\s+((\d+_)?(\d+))/i);

    return !!match;
};

export default isIOS;
