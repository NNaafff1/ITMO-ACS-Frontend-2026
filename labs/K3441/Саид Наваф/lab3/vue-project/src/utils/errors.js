const API_ERRORS = {
  'Incorrect password': 'Неверный пароль.',
  'Cannot find user': 'Пользователь с такой почтой не найден.',
  'Email already exists': 'Эта почта уже зарегистрирована.',
  'Email format is invalid': 'Некорректный адрес почты.',
  'Password is too short': 'Пароль слишком короткий.',
}

export function getErrorMessage(error) {
  if (error?.response) {
    const data = error.response.data
    const message = typeof data === 'string' ? data : data?.message
    return API_ERRORS[message] || message || `Ошибка запроса (${error.response.status})`
  }
  if (error?.request) {
    return 'Не удалось связаться с сервером. Проверьте, что API запущен (npm start в папке api).'
  }
  return error?.message || 'Произошла ошибка.'
}
