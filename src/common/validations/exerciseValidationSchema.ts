import * as Yup from 'yup';

const MIN_NAME_LENGTH = 4;
const MAX_NAME_LENGTH = 32;
const MAX_DESCRIPTION_LENGTH = 255;

export type ExerciseFields = {
  name: string;
  description: string;
  type: string;
  subtype: string;
  combinationParams: string;
};

export const exerciseInitialValue: ExerciseFields = {
  name: '',
  description: '',
  type: '',
  subtype: '',
  combinationParams: '',
};

export const exerciseValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(MIN_NAME_LENGTH, `Min length ${MIN_NAME_LENGTH} characters`)
    .max(MAX_NAME_LENGTH, `Max length ${MAX_NAME_LENGTH} characters`)
    .required('Required field'),
  description: Yup.string().max(MAX_DESCRIPTION_LENGTH, `Max length ${MAX_NAME_LENGTH} characters`),
  combinationParams: Yup.string().required('Required field'),
});
