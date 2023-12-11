import * as Yup from 'yup';

const MIN_NAME_LENGTH = 4;
const MAX_NAME_LENGTH = 32;

export type SubtypeField = {
  name: string;
};

export const subtypeInitialValue: SubtypeField = {
  name: '',
};

export const subtypeValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(MIN_NAME_LENGTH, `Incorrect name: min length ${MIN_NAME_LENGTH} characters`)
    .max(MAX_NAME_LENGTH, `Incorrect name: max length ${MAX_NAME_LENGTH} characters`),
});
