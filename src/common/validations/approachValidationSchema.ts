import * as Yup from 'yup';
import { combinationParams } from '../types/workouts.ts';

export const approachInitialValue = [
  {
    name: combinationParams[0].name,
    initial: {
      param1: '0',
      param2: '00:00:00',
    },
  },
  {
    name: combinationParams[1].name,
    initial: {
      param1: '0',
      param2: '0',
    },
  },
  {
    name: combinationParams[2].name,
    initial: {
      param1: '0',
      param2: '00:00:00',
    },
  },
];

export const approachValidationSchema = [
  {
    name: combinationParams[0].name,
    approach: Yup.object().shape({
      fields: Yup.array().of(
        Yup.object().shape({
          param1: Yup.string()
            .matches(/^\d{1,3}(\.\d)?$/, {
              message: `Must be an integer or fractional with one decimal place. Max - 999.9`,
            })
            .required('Required field'),
          param2: Yup.string()
            .matches(/^\d{1,2}:[0-5][0-9]:[0-5][0-9]$/, {
              message: `Max - 99:59:59`,
            })
            .required('Required field'),
        }),
      ),
    }),
  },
  {
    name: combinationParams[1].name,
    approach: Yup.object().shape({
      fields: Yup.array().of(
        Yup.object().shape({
          param1: Yup.string()
            .matches(/^\d{1,4}$/, {
              message: `Count must be an integer. Max - 9999`,
            })
            .nonNullable(),
          param2: Yup.string().matches(/^\d{1,3}(\.\d)?$/, {
            message: `Weight must be an integer or fractional with one decimal place. Max - 999.9`,
          }),
        }),
      ),
    }),
  },
  {
    name: combinationParams[2].name,
    approach: Yup.object().shape({
      fields: Yup.array().of(
        Yup.object().shape({
          param1: Yup.string()
            .matches(/^\d{1,4}$/, {
              message: `Count must be an integer. Max - 9999`,
            })
            .nonNullable(),
          param2: Yup.string().matches(/^\d{1,2}:[0-5][0-9]:[0-5][0-9]$/, {
            message: `Max - 99:59:59`,
          }),
        }),
      ),
    }),
  },
];
