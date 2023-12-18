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

const regexDate =
  /^(?:(?:31\.(?:0[13578]|1[02])|30\.(?:0[13-9]|1[0-2])|(?:0[1-9]|1\d|2[0-8])\.(?:0[1-9]|1[0-2]))\.\d{4}|29\.02\.(?:\d\d(?:0[48]|[2468][048]|[13579][26])|(?:[02468][048]|[13579][26])00))$/;

export const workoutValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(MIN_NAME_LENGTH, `Min length ${MIN_NAME_LENGTH} characters`)
    .max(MAX_NAME_LENGTH, `Max length ${MAX_NAME_LENGTH} characters`),
  type: Yup.string().nonNullable(),
  date: Yup.string().required('Required field').matches(regexDate, 'Incorrect date'),
  comment: Yup.string().max(MAX_COMMENT, `Max length ${MAX_COMMENT} characters`),
});
