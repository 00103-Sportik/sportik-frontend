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
  http.post(`${BASE_URL}auth/signup`, () => {
    return HttpResponse.json(
      {
        message: 'Успешное завершение операции',
        data: {},
      },
      { status: 200 },
    );
  }),

  http.post(`${BASE_URL}auth/signin`, () => {
    return HttpResponse.json(
      {
        message: 'Успешное завершение операции',
        data: {
          access_token: 'k9sdgkskg93merwei',
          refresh_token: 'k9sdsfsdg93mfdsfi',
        },
      },
      { status: 200 },
    );
  }),

  http.put(`${BASE_URL}auth/resend-email`, () => {
    return HttpResponse.json(
      {
        message: 'Успешное завершение операции',
        data: {},
      },
      { status: 200 },
    );
  }),

  http.put(`${BASE_URL}auth/activate`, () => {
    return HttpResponse.json(
      {
        message: 'Успешное завершение операции',
        data: {},
      },
      { status: 200 },
    );
  }),
];
