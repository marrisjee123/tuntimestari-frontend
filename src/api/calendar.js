// src/api/calendar.js

import { axiosInstance } from '../api';

export const getCalendar = async (startDate, endDate, countryCode = 'FI') => {
  const response = await axiosInstance.get('/calendar/', {
    params: { start_date: startDate, end_date: endDate, country_code: countryCode },
  });
  return response.data;
};
