import * as Yup from 'yup';

export type DateFields = {
  from: string;
  to: string;
};

export const dateInitialValues: DateFields = {
  from: '',
  to: '',
};

export const dateValidationSchema = Yup.object().shape({
  from: Yup.date().required('Required field'),
  to: Yup.date().required('Required field').min(Yup.ref('from'), 'End date must be greater than the start date'),
});
