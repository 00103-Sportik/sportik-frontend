import { test, expect, Page } from '@playwright/test';

async function getLocalStorage(page: Page) {
  const context = await page.context().storageState();
  const localStorage = context.origins[0].localStorage[0].value;
  return JSON.parse(localStorage);
}

async function login(page: Page) {
  await page.goto('http://localhost:5173/signin');
  await page.getByTestId('email-input').fill('test12@gmail.com');
  await page.getByTestId('password-input').fill('Qwerty12');
  await page.getByTestId('signin-btn').click();

  await expect(page.getByTestId('error-p')).not.toBeVisible();
  await expect(page.getByRole('alert')).not.toBeVisible();
  await expect(page).toHaveURL('http://localhost:5173/');

  expect(JSON.parse((await getLocalStorage(page)).auth).access_token).not.toBeNull();
  expect(JSON.parse((await getLocalStorage(page)).auth).refresh_token).not.toBeNull();
}

test('Регистрация нового пользователя', async ({ page }) => {
  // await page.goto('http://localhost:5173/signup');
  // await page.getByTestId('email-input').fill('sdf653GFhe@yandex.ru');
  // await page.getByTestId('password-input').fill('Qwerty12');
  // await page.getByTestId('signup-btn').click();
  //
  // await expect(page.getByTestId('email-error')).toBeEmpty();
  // await expect(page.getByTestId('password-error')).toBeEmpty();
  // await expect(page.getByText('Registration successfully! Activation link sent to your email!')).toBeVisible();

  await page.goto('https://passport.yandex.ru/auth?mode=add-user&retpath=https%3A%2F%2F360.yandex.ru%2Fmail%2F&');

  await page.fill('#passp-field-login', 'sdf653GFhe@yandex.ru');
  await page.getByRole('button', { name: 'Войти', exact: true }).click();

  await expect(page.locator('#passp-field-passwd')).toBeVisible();
  await page.fill('#passp-field-passwd', '15ZgQf3dSJ');
  await page.getByRole('button', { name: 'Продолжить', exact: true }).click();
  await expect(page).toHaveURL('https://360.yandex.ru/mail/');

  await page.goto('https://mail.yandex.ru/');
  await page.click(
    '.ns-view-messages-item-wrap:nth-child(1) .mail-MessageSnippet-Item > .mail-MessageSnippet-Item:nth-child(3)',
  );
  await page.goto(
    ((await page.getByText(/http:\/\/localhost:5173\/activate./).textContent()) as string).split(': ')[1],
  );

  await expect(page).toHaveURL(/.*activate/);
  await expect(page.getByText('Activated successfully!')).toBeVisible();

  await expect(page).toHaveURL('http://localhost:5173/signin');
  await page.getByTestId('email-input').fill('sdf653GFhe@yandex.ru');
  await page.getByTestId('password-input').fill('Qwerty12');
  await page.getByTestId('signin-btn').click();

  await expect(page.getByTestId('error-p')).not.toBeVisible();
  await expect(page).toHaveURL('http://localhost:5173/');

  expect(JSON.parse((await getLocalStorage(page)).auth).access_token).not.toBeNull();
  expect(JSON.parse((await getLocalStorage(page)).auth).refresh_token).not.toBeNull();
});

test('Обновление информации профиля', async ({ page }) => {
  await login(page);
  await page.getByTestId('menu-btn').click();
  await expect(page.getByTestId('profile-a')).toBeVisible();
  await page.getByTestId('profile-a').click();

  await expect(page).toHaveURL('http://localhost:5173/profile');
  await expect(page.getByTestId('email-input')).toHaveValue('test12@gmail.com');

  await page.getByTestId('name-input').fill('Test');
  await page.getByTestId('surname-input').fill('Test');
  await page.getByTestId('age-input').fill('30');
  await page.getByTestId('sex-select').selectOption('male');
  await page.getByTestId('height-input').fill('180');
  await page.getByTestId('weight-input').fill('85.5');

  await page.getByTestId('saving-btn').click();
  await page.getByTestId('saving-dialog-btn').click();
  await expect(page.getByText('Updated successfully!')).toBeVisible();

  expect(JSON.parse((await getLocalStorage(page)).profile).name).toBe('Test');
  expect(JSON.parse((await getLocalStorage(page)).profile).surname).toBe('Test');
  expect(JSON.parse((await getLocalStorage(page)).profile).age).toBe('30');
  expect(JSON.parse((await getLocalStorage(page)).profile).sex).toBe('male');
  expect(JSON.parse((await getLocalStorage(page)).profile).height).toBe('180');
  expect(JSON.parse((await getLocalStorage(page)).profile).weight).toBe('85.5');
});

test('Расчет пульсовых зон по возрасту', async ({ page }) => {
  await login(page);
  await page.getByTestId('menu-btn').click();
  await expect(page.getByTestId('profile-a')).toBeVisible();
  await page.getByTestId('profile-a').click();

  await expect(page).toHaveURL('http://localhost:5173/profile');
  await expect(page.getByTestId('email-input')).toHaveValue('test12@gmail.com');

  await page.getByTestId('age-input').fill('20');
  await page.getByTestId('saving-btn').click();
  await page.getByTestId('saving-dialog-btn').click();
  await expect(page.getByText('Updated successfully!')).toBeVisible();

  expect(JSON.parse((await getLocalStorage(page)).profile).age).toBe('20');

  await page.getByTestId('menu-btn').click();
  await expect(page.getByTestId('hr-a')).toBeVisible();
  await page.getByTestId('hr-a').click();

  await expect(page).toHaveURL('http://localhost:5173/hr-calc');
  await page.getByTestId('age-calc-btn').click();

  await expect(page.getByTestId('row1')).toHaveText('180-200');
  await expect(page.getByTestId('row2')).toHaveText('160-180');
  await expect(page.getByTestId('row3')).toHaveText('140-160');
  await expect(page.getByTestId('row4')).toHaveText('120-140');
  await expect(page.getByTestId('row5')).toHaveText('100-120');
  await expect(page.getByText("You didn't indicate your age in your profile")).not.toBeVisible();
});

test('Расчет пульсовых зон по максимальному пульсу', async ({ page }) => {
  await login(page);
  await page.getByTestId('menu-btn').click();
  await expect(page.getByTestId('hr-a')).toBeVisible();
  await page.getByTestId('hr-a').click();

  await expect(page).toHaveURL('http://localhost:5173/hr-calc');

  await page.getByTestId('hr-input').fill('200');
  await page.getByTestId('hr-calc-btn').click();

  await expect(page.getByTestId('row1')).toHaveText('180-200');
  await expect(page.getByTestId('row2')).toHaveText('160-180');
  await expect(page.getByTestId('row3')).toHaveText('140-160');
  await expect(page.getByTestId('row4')).toHaveText('120-140');
  await expect(page.getByTestId('row5')).toHaveText('100-120');
  await expect(page.getByTestId('hr-error')).toBeEmpty();
});

test('Создание новой тренировки', async ({ page }) => {
  await login(page);
  await expect(page.getByTestId('no-workouts-h1')).toBeVisible();
  await expect(page.getByTestId('workout0-div')).not.toBeVisible();
  await page.getByTestId('add-btn').click();

  await expect(page).toHaveURL(/.*workouts/);

  await expect(page.getByTestId('name-input')).toHaveValue(/.*Workout ./);
  await expect(page.getByTestId('date-input')).toHaveValue(
    `${(new Date().getDate() < 10
      ? `0${new Date().getDate()}`
      : new Date().getDate()
    ).toString()}.${(new Date().getMonth() < 9
      ? `0${new Date().getMonth() + 1}`
      : new Date().getMonth() + 1
    ).toString()}.${new Date().getFullYear().toString()}`,
  );
  await expect(page.getByTestId('type-select')).toHaveValue('strength');
  await expect(page.getByTestId('no-entities-h1')).toBeVisible();
  await expect(page.getByTestId('comment-input')).toBeEmpty();
  await expect(page.getByTestId('delete-btn')).not.toBeVisible();

  const workoutName = (await page.getByTestId('name-input').inputValue()) as string;
  const workoutDate = (await page.getByTestId('date-input').inputValue()) as string;

  await page.getByTestId('save-btn').click();
  await expect(page.getByText('Created successfully!')).toBeVisible();
  await expect(page.getByTestId('delete-btn')).toBeVisible();
  await expect(page).toHaveURL(/.*workouts\/./);

  await Promise.all([
    page.waitForResponse((res) => res.url() === 'http://localhost:8080/api/v1/workouts?limit=10&offset=0&sort=new', {
      timeout: 90000,
    }),
    page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' }),
  ]);

  await expect(page.getByTestId('no-workouts-h1')).not.toBeVisible();
  await expect(page.getByTestId('workout0-div')).toBeVisible();
  await expect(page.getByTestId('workout0-name')).toHaveText(workoutName);
  await expect(page.getByTestId('workout0-date')).toHaveText(workoutDate);
});

test('Создание нового подтипа тренировок', async ({ page }) => {
  await login(page);
  await page.getByTestId('add-btn').click();

  await expect(page).toHaveURL(/.*workouts/);
  await page.getByTestId('add-exercise-btn').click();

  await expect(page).toHaveURL(/.*subtypes\/./);
  await page.getByTestId('add-btn').click();

  await page.getByTestId('name-input').fill('chest');
  await page.getByTestId('save-btn').click();
  await expect(page.getByText('Created successfully!')).toBeVisible();
  await expect(page.getByText('chest')).toBeVisible();
});

test('Создание нового упражнения', async ({ page }) => {
  await login(page);
  await page.getByTestId('add-btn').click();

  await expect(page).toHaveURL(/.*workouts/);
  await page.getByTestId('add-exercise-btn').click();

  await expect(page).toHaveURL(/.*subtypes\/./);
  await page.getByText('chest').click();

  await expect(page).toHaveURL(/.*exercises\/./);
  await page.getByTestId('add-btn').click();

  await expect(page).toHaveURL('http://localhost:5173/exercises');
  await expect(page.getByTestId('delete-btn')).not.toBeVisible();
  await expect(page.getByTestId('name-input')).toBeEmpty();
  await expect(page.getByTestId('subtype-select')).not.toBeEmpty();
  await expect(page.getByTestId('type-select')).toHaveValue('strength');
  await expect(page.getByTestId('params-select')).toHaveValue('distant_time');

  await page.getByTestId('name-input').fill('dips');
  await page.getByTestId('subtype-select').selectOption('chest');
  await page.getByTestId('params-select').selectOption('count_weight');

  await page.getByTestId('save-btn').click();
  await expect(page.getByText('Created successfully!')).toBeVisible();
  await expect(page.getByText('dips')).toBeVisible();
});

test('Добавление упражнения в существующую тренировку', async ({ page }) => {
  await login(page);
  await expect(page.getByTestId('workout0-div')).toBeVisible();
  await page.getByTestId('workout0-div').click();

  await expect(page).toHaveURL(/.*workouts\/./);
  await expect(page.getByTestId('no-entities-h1')).toBeVisible();
  await page.getByTestId('add-exercise-btn').click();

  await expect(page).toHaveURL(/.*subtypes\/./);
  await page.getByText('chest').click();

  await expect(page).toHaveURL(/.*exercises\/./);
  await expect(page.getByTestId('exercise0-name')).toHaveText('dips');
  await page.getByTestId('exercise0-div').click();

  await expect(page).toHaveURL(/.*workouts/);
  await expect(page.getByTestId('exercise0-name')).toHaveText('dips');
  await expect(page.getByTestId('no-entities-h1')).not.toBeVisible();

  await page.getByTestId('save-btn').click();
  await expect(page.getByText('Updated successfully!')).toBeVisible();
});

test('Добавление нового подхода в существующую тренировку', async ({ page }) => {
  await login(page);
  await expect(page.getByTestId('workout0-div')).toBeVisible();
  await page.getByTestId('workout0-div').click();

  await expect(page).toHaveURL(/.*workouts\/./);
  await expect(page.getByTestId('no-entities-h1')).not.toBeVisible();
  await expect(page.getByTestId('exercise0-approaches')).toHaveText('approaches: 0');
  await page.getByTestId('goto-exercise0-div').click();

  await expect(page).toHaveURL(/.*approaches\/./);
  await expect(page.getByTestId('count-p')).toHaveText('Approaches: 0');
  await expect(page.getByTestId('no-entities-h1')).toBeVisible();
  await expect(page.getByTestId('param1-0-input')).not.toBeVisible();
  await expect(page.getByTestId('param2-0-input')).not.toBeVisible();

  await page.getByTestId('add-btn').click();
  await expect(page.getByTestId('count-p')).toHaveText('Approaches: 1');
  await expect(page.getByTestId('no-entities-h1')).not.toBeVisible();
  await expect(page.getByTestId('param1-0-input')).toHaveValue('0');
  await expect(page.getByTestId('param2-0-input')).toHaveValue('0');

  await page.getByTestId('save-btn').click();
  await expect(page).toHaveURL(/.*workouts\/./);
  await expect(page.getByTestId('exercise0-approaches')).toHaveText('approaches: 1');

  await page.getByTestId('save-btn').click();
  await expect(page.getByText('Updated successfully!')).toBeVisible();
});

test('Удаление пользовательского упражнения', async ({ page }) => {
  await login(page);
  await page.getByTestId('add-btn').click();

  await expect(page).toHaveURL(/.*workouts/);
  await page.getByTestId('add-exercise-btn').click();

  await expect(page).toHaveURL(/.*subtypes\/./);
  await page.getByText('chest').click();

  await expect(page).toHaveURL(/.*exercises\/./);
  await expect(page.getByText('dips')).toBeVisible();

  await page.getByTestId('delete0-btn').click();
  await expect(page.getByText('Deleted successfully!')).toBeVisible();
  await expect(page.getByText('dips')).not.toBeVisible();
});

test('Удаление пользовательского подтипа', async ({ page }) => {
  await login(page);
  await page.getByTestId('add-btn').click();

  await expect(page).toHaveURL(/.*workouts/);
  await page.getByTestId('add-exercise-btn').click();

  await expect(page).toHaveURL(/.*subtypes\/./);
  await expect(page.getByText('chest')).toBeVisible();

  await page.getByTestId('delete-chest-btn').click();
  await expect(page.getByText('Deleted successfully!')).toBeVisible();
  await expect(page.getByText('chest')).not.toBeVisible();
});

test('Удаление тренировки', async ({ page }) => {
  await login(page);
  await expect(page.getByTestId('workout0-div')).toBeVisible();
  await page.getByTestId('workout0-div').click();

  await expect(page).toHaveURL(/.*workouts\/./);
  await expect(page.getByTestId('delete-btn')).toBeVisible();

  await page.getByTestId('delete-btn').click();
  await page.getByTestId('delete-dialog-btn').click();

  await expect(page.getByText('Deleted successfully!')).toBeVisible();
  await expect(page).toHaveURL('http://localhost:5173/');
  await expect(page.getByTestId('no-workouts-h1')).toBeVisible();
});
