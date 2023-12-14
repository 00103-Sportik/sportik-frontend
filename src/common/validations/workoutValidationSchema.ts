import * as Yup from 'yup';

export type WorkoutFields = {
  uuid?: string;
  name: string;
  date: string;
  type: string;
  comment: string;
};

export const workoutInitialValues: WorkoutFields = {
  uuid: '',
  name: '',
  date: new Date().toLocaleDateString(),
  type: '',
  comment: '',
};

const MIN_NAME_LENGTH = 4;

const MAX_NAME_LENGTH = 32;
const MAX_COMMENT = 255;

export const workoutValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(MIN_NAME_LENGTH, `Min length ${MIN_NAME_LENGTH} characters`)
    .max(MAX_NAME_LENGTH, `Max length ${MAX_NAME_LENGTH} characters`),
  type: Yup.string().nonNullable(),
  comment: Yup.string().max(MAX_COMMENT, `Max length ${MAX_COMMENT} characters`),
});
