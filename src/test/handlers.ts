import { http, HttpResponse } from 'msw';
import { BASE_URL } from '../common/constants/api.ts';

export const handlers = [
  http.get(`${BASE_URL}profile`, () => {
    return HttpResponse.json(
      {
        message: 'Успешное завершение операции',
        data: {
          height: null,
          weight: null,
          email: 'test@test.ru',
          name: '',
          surname: '',
          age: null,
          sex: '',
          image: '',
        },
      },
      { status: 200 },
    );
  }),
  http.put(`${BASE_URL}profile`, () => {
    return HttpResponse.json(
      {
        message: 'Успешное завершение операции',
        data: {
          height: null,
          weight: null,
          email: 'test@test.ru',
          name: '',
          surname: '',
          age: null,
          sex: '',
          image: '',
        },
      },
      { status: 200 },
    );
  }),
];
