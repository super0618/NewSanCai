import { NEW_SAN_CAI_LOCATION, NEW_SAN_CAI_NAME, NEW_SAN_CAI_USER, NEW_SAN_CAI_WEATHER } from '../constants';

const setToken = (token) => {
    localStorage.setItem(NEW_SAN_CAI_NAME, token);
};

const setTokenUser = (token) => {
    localStorage.setItem(NEW_SAN_CAI_USER, token);
};

const getToken = () => {
    return localStorage.getItem(NEW_SAN_CAI_NAME);
};

const getTokenUser = () => {
    return localStorage.getItem(NEW_SAN_CAI_USER);
};

const removeToken = () => {
    return localStorage.removeItem(NEW_SAN_CAI_NAME);
};

const setLocation = (location) => {
    localStorage.setItem(NEW_SAN_CAI_LOCATION, location);
};

const getLocation = () => {
    return localStorage.getItem(NEW_SAN_CAI_LOCATION);
};

const removeLocation = () => {
    return localStorage.removeItem(NEW_SAN_CAI_LOCATION);
};

const setWeather = (weather) => {
    localStorage.setItem(NEW_SAN_CAI_WEATHER, weather);
};

const getWeather = () => {
    return localStorage.getItem(NEW_SAN_CAI_WEATHER);
};

const removeWeather = () => {
    return localStorage.removeItem(NEW_SAN_CAI_WEATHER);
};

export {
    setToken,
    getToken,
    removeToken,
    setLocation,
    getLocation,
    removeLocation,
    setWeather,
    getWeather,
    removeWeather,
    setTokenUser,
    getTokenUser
};
