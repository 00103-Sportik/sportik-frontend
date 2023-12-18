import * as Yup from 'yup';

const regexDate =
  /^(?:(?:31\.(?:0[13578]|1[02])|30\.(?:0[13-9]|1[0-2])|(?:0[1-9]|1\d|2[0-8])\.(?:0[1-9]|1[0-2]))\.\d{4}|29\.02\.(?:\d\d(?:0[48]|[2468][048]|[13579][26])|(?:[02468][048]|[13579][26])00))$/;

export type DateFields = {
  from: string;
  to: string;
};

export const dateInitialValues: DateFields = {
  from: '',
  to: '',
};

export const dateValidationSchema = Yup.object().shape({
  from: Yup.string().required('Incorrect date').matches(regexDate, 'Incorrect date'),
  to: Yup.string().required('Incorrect date').matches(regexDate, 'Incorrect date'),
});
