import * as Yup from 'yup';

export type ProfileFields = {
  email: string;
  name: string;
  surname: string;
  sex: string;
  age: string;
  height: string;
  weight: string;
  avatar: string;
};

export const profileInitialValues: ProfileFields = {
  email: '',
  name: '',
  surname: '',
  sex: '',
  age: '',
  height: '',
  weight: '',
  avatar: '',
};

const MIN_NAME_LENGTH = 2;
const MIN_SURNAME_LENGTH = 2;
const MIN_AGE = 0;
const MIN_HEIGHT = 10;
const MIN_WEIGHT = 0;

const MAX_NAME_LENGTH = 32;
const MAX_SURNAME_LENGTH = 32;
const MAX_AGE = 150;
const MAX_HEIGHT = 999;
const MAX_WEIGHT = 999;

const containsWhiteSpaces = /\s/;
const containOneCharacterAfterComma = /^\d{1,3}(\.\d)?$/;

export const profileValidationSchema = Yup.object().shape({
  email: Yup.string()
    .test('noSpaces', 'No spaces allowed', (value) => !containsWhiteSpaces.test(value || ''))
    .required('Required field')
    .email('Incorrect email'),
  name: Yup.string()
    .min(MIN_NAME_LENGTH, `Incorrect name: min length ${MIN_NAME_LENGTH} characters`)
    .max(MAX_NAME_LENGTH, `Incorrect name: max length ${MAX_NAME_LENGTH} characters`),
  surname: Yup.string()
    .min(MIN_SURNAME_LENGTH, `Incorrect surname: min length ${MIN_SURNAME_LENGTH} characters`)
    .max(MAX_SURNAME_LENGTH, `Incorrect surname: max length ${MAX_SURNAME_LENGTH} characters`),
  age: Yup.number()
    .min(MIN_AGE, `Incorrect age: min age is ${MIN_AGE}`)
    .max(MAX_AGE, `Incorrect age: max age is ${MAX_AGE}`)
    .integer()
    .typeError('Incorrect age: age must be an integer'),
  height: Yup.number()
    .min(MIN_HEIGHT, `Incorrect height: min height is ${MIN_HEIGHT}`)
    .max(MAX_HEIGHT, `Incorrect height: max height is ${MAX_HEIGHT}`)
    .integer()
    .typeError('Incorrect height: height must be an integer'),
  weight: Yup.string().matches(containOneCharacterAfterComma, {
    message: `Incorrect weight: - weight must be an integer or fractional with one decimal place (min - ${MIN_WEIGHT}, max - ${MAX_WEIGHT})`,
  }),
});
