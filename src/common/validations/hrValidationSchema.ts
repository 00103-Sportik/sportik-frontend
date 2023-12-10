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
    .min(MIN_HR, `Incorrect HRmax: min HRmax is ${MIN_HR}`)
    .max(MAX_HR, `Incorrect HRmax: max HRmax is ${MAX_HR}`)
    .integer()
    .typeError('Incorrect HRmax: HRmax must be an integer'),
});
