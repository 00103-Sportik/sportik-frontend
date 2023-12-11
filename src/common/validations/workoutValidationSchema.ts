import * as Yup from 'yup';

export type WorkoutFields = {
  id?: string;
  name: string;
  date: string;
  type: string;
  comment: string;
};

export const workoutInitialValues: WorkoutFields = {
  id: '',
  name: '',
  date: new Date().toISOString().split('T')[0],
  type: '',
  comment: '',
};

export interface WorkoutState {
  id: string;
  count: number;
}

export const workoutStateInitialValues: WorkoutState = {
  id: '',
  count: 0,
};

const MIN_NAME_LENGTH = 4;

const MAX_NAME_LENGTH = 32;
const MAX_COMMENT = 255;

export const workoutValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Required field')
    .min(MIN_NAME_LENGTH, `Incorrect name: min length ${MIN_NAME_LENGTH} characters`)
    .max(MAX_NAME_LENGTH, `Incorrect name: max length ${MAX_NAME_LENGTH} characters`),
  date: Yup.string().required('Required field'),
  type: Yup.string().required('Required field'),
  comment: Yup.string().max(MAX_COMMENT, `Incorrect comment: max length ${MAX_COMMENT} characters`),
});
