import * as Yup from 'yup';

const MIN_HR = 100;
const MAX_HR = 250;

export type HrField = {
  hr: string;
};

export const hrInitialValue: HrField = {
  hr: '',
};

export type TableFields = {
  zone5: string;
  zone4: string;
  zone3: string;
  zone2: string;
  zone1: string;
};

export const hrValidationSchema = Yup.object().shape({
  hr: Yup.number()
    .min(MIN_HR, `Min HRmax is ${MIN_HR}`)
    .max(MAX_HR, `Max HRmax is ${MAX_HR}`)
    .integer()
    .typeError('HRmax must be an integer'),
});
