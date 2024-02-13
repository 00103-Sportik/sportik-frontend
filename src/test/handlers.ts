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

  http.get(`${BASE_URL}workouts`, ({ request }) => {
    const url = new URL(request.url);
    const sort = url.searchParams.get('sort');
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');

    if (sort === 'new') {
      if (from && to) {
        if (from === '2024-02-10') {
          if (to === '2024-02-10') {
            return HttpResponse.json(
              {
                message: 'Успешное завершение операции',
                data: {
                  workouts_count: 1,
                  workouts: [
                    {
                      uuid: 'fssf9sdfj9sjaf9s',
                      name: 'Train 1',
                      date: '2024-02-10',
                      type: 'strength',
                      comment: 'dfhfghdfghfghfghf',
                    },
                  ],
                },
              },
              { status: 200 },
            );
          } else if (to === '2024-02-12') {
            return HttpResponse.json(
              {
                message: 'Успешное завершение операции',
                data: {
                  workouts_count: 2,
                  workouts: [
                    {
                      uuid: 'fssf9sdfj9sjaf9s',
                      name: 'Train 1',
                      date: '2024-02-10',
                      type: 'strength',
                      comment: 'dfhfghdfghfghfghf',
                    },
                    {
                      uuid: 'odfgdfolgdflg',
                      name: 'Train 2',
                      date: '2024-02-12',
                      type: 'cardio',
                      comment: 'pfdgpdf;gp',
                    },
                  ],
                },
              },
              { status: 200 },
            );
          }
        }
      }
      return HttpResponse.json(
        {
          message: 'Успешное завершение операции',
          data: {
            workouts_count: 2,
            workouts: [
              {
                uuid: 'odfgdfolgdflg',
                name: 'Train 2',
                date: '2024-02-12',
                type: 'cardio',
                comment: 'pfdgpdf;gp',
              },
              {
                uuid: 'fssf9sdfj9sjaf9s',
                name: 'Train 1',
                date: '2024-02-10',
                type: 'strength',
                comment: 'dfhfghdfghfghfghf',
              },
            ],
          },
        },
        { status: 200 },
      );
    } else if (sort === 'old') {
      return HttpResponse.json(
        {
          message: 'Успешное завершение операции',
          data: {
            workouts_count: 2,
            workouts: [
              {
                uuid: 'fssf9sdfj9sjaf9s',
                name: 'Train 1',
                date: '2024-02-10',
                type: 'strength',
                comment: 'dfhfghdfghfghfghf',
              },
              {
                uuid: 'odfgdfolgdflg',
                name: 'Train 2',
                date: '2024-02-12',
                type: 'cardio',
                comment: 'pfdgpdf;gp',
              },
            ],
          },
        },
        { status: 200 },
      );
    }
  }),

  http.get(`${BASE_URL}workouts/:id`, () => {
    return HttpResponse.json(
      {
        message: 'Успешное завершение операции',
        data: {
          uuid: 'fssf9sdfj9sjaf9s',
          name: 'My train',
          date: '2024-02-10',
          type: 'strength',
          comment: 'dfhfghdfghfghfghf',
          exercises: [
            {
              uuid: 'wrrwrwerwe',
              name: 'exercise 1',
              combination_params: 'count_weight',
              approaches: [
                {
                  uuid: 'mofgmifgmi',
                  param1: 1123.78,
                  param2: 789.78,
                },
              ],
            },
          ],
        },
      },
      { status: 200 },
    );
  }),

  http.post(`${BASE_URL}workouts`, () => {
    return HttpResponse.json(
      {
        message: 'Успешное завершение операции',
        data: {
          uuid: 'fssf9sdfj9sjaf9s',
          name: 'Train 1',
          date: '2024-02-10',
          type: 'strength',
          comment: 'dfhfghdfghfghfghf',
          exercises: [],
        },
      },
      { status: 200 },
    );
  }),

  http.put(`${BASE_URL}workouts/:id`, () => {
    return HttpResponse.json(
      {
        message: 'Успешное завершение операции',
        data: {
          uuid: 'fssf9sdfj9sjaf9s',
          name: 'Train 1',
          date: '2024-02-10',
          type: 'strength',
          comment: 'dfhfghdfghfghfghf',
          exercises: [
            {
              uuid: 'wrrwrwerwe',
              name: 'exercise 1',
              combination_params: 'count_weight',
              approaches: [
                {
                  uuid: 'mofgmifgmi',
                  param1: 1123.78,
                  param2: 789.78,
                },
              ],
            },
          ],
        },
      },
      { status: 200 },
    );
  }),

  http.delete(`${BASE_URL}workouts/:id`, () => {
    return HttpResponse.json(
      {
        message: 'Успешное завершение операции',
        data: {},
      },
      { status: 200 },
    );
  }),
];
