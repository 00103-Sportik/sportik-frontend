import * as Yup from 'yup';

export type ProfileFields = {
  email: string;
  name: string;
  surname: string;
  sex: string;
  age: string;
  height: string;
  weight: string;
  image: string;
};

export const profileInitialValues: ProfileFields = {
  email: '',
  name: '',
  surname: '',
  sex: '',
  age: '',
  height: '',
  weight: '',
  image: '',
};

const MIN_NAME_LENGTH = 2;
const MIN_SURNAME_LENGTH = 2;
const MIN_AGE = 0;
const MIN_HEIGHT = 2;
const MIN_WEIGHT = -999.9;

const MAX_NAME_LENGTH = 32;
const MAX_SURNAME_LENGTH = 32;
const MAX_AGE = 150;
const MAX_HEIGHT = 3;
const MAX_WEIGHT = 999.9;

const containOneCharacterAfterComma = /^-?\d{1,3}(\.\d)?$/;

export const profileValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(MIN_NAME_LENGTH, `Min length ${MIN_NAME_LENGTH} characters`)
    .max(MAX_NAME_LENGTH, `Max length ${MAX_NAME_LENGTH} characters`),
  surname: Yup.string()
    .min(MIN_SURNAME_LENGTH, `Min length ${MIN_SURNAME_LENGTH} characters`)
    .max(MAX_SURNAME_LENGTH, `Max length ${MAX_SURNAME_LENGTH} characters`),
  age: Yup.number()
    .min(MIN_AGE, `Min age is ${MIN_AGE}`)
    .max(MAX_AGE, `Max age is ${MAX_AGE}`)
    .integer()
    .typeError('Age must be an integer'),
  height: Yup.string()
    .min(MIN_HEIGHT, `Min length ${MIN_HEIGHT} characters`)
    .max(MAX_HEIGHT, `Max length ${MAX_HEIGHT} characters`)
    .matches(/^\d{2,3}$/, 'Must be natural number'),
  weight: Yup.string().matches(containOneCharacterAfterComma, {
    message: `Weight must be an integer or fractional with one decimal place (min - ${MIN_WEIGHT}, max - ${MAX_WEIGHT})`,
  }),
  image: Yup.string(),
});
