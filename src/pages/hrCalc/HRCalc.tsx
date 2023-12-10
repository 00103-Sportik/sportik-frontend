import { Input } from '../../common/components/input/Input.tsx';
import { useState } from 'react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { hrInitialValue, hrValidationSchema, TableFields } from '../../common/validations/hrValidationSchema.ts';
import { useAppSelector } from '../../store/hooks.ts';
import { selectAge } from '../../store/profile/profile.selectors.ts';
import styles from './HRCalc.module.css';
import { toast } from 'react-toastify';

function HRCalc() {
  const [hr, setHr] = useState('');
  const age = useAppSelector(selectAge);
  const [fields, setFields] = useState<TableFields>({
    zone5: '',
    zone4: '',
    zone3: '',
    zone2: '',
    zone1: '',
  });

  const calcByHR = () => {
    if (hr && document.getElementById('err')?.textContent?.length === 0) {
      const zone5 = `${hr}-${Math.round(Number(hr) * 0.9)}`;
      const zone4 = `${Math.round(Number(hr) * 0.8)}-${Math.round(Number(hr) * 0.9)}`;
      const zone3 = `${Math.round(Number(hr) * 0.7)}-${Math.round(Number(hr) * 0.8)}`;
      const zone2 = `${Math.round(Number(hr) * 0.6)}-${Math.round(Number(hr) * 0.7)}`;
      const zone1 = `${Math.round(Number(hr) * 0.5)}-${Math.round(Number(hr) * 0.6)}`;
      setFields({ zone5, zone4, zone3, zone2, zone1 });
    }
  };

  const calcByAge = () => {
    if (age) {
      const hrMaxByAge = 220 - Number(age);
      const zone5 = `${hrMaxByAge}-${Math.round(Number(hrMaxByAge) * 0.9)}`;
      const zone4 = `${Math.round(Number(hrMaxByAge) * 0.8)}-${Math.round(Number(hrMaxByAge) * 0.9)}`;
      const zone3 = `${Math.round(Number(hrMaxByAge) * 0.7)}-${Math.round(Number(hrMaxByAge) * 0.8)}`;
      const zone2 = `${Math.round(Number(hrMaxByAge) * 0.6)}-${Math.round(Number(hrMaxByAge) * 0.7)}`;
      const zone1 = `${Math.round(Number(hrMaxByAge) * 0.5)}-${Math.round(Number(hrMaxByAge) * 0.6)}`;
      setFields({ zone5, zone4, zone3, zone2, zone1 });
    } else {
      toast.info("You didn't indicate your age in your profile");
    }
  };

  const onSubmit = () => {};

  return (
    <>
      <Formik initialValues={hrInitialValue} onSubmit={onSubmit} validationSchema={hrValidationSchema}>
        {(props) => {
          return (
            <Form className="layout">
              <Field name="hr">
                {({ field, meta }: FieldProps) => (
                  <Input
                    type="text"
                    {...field}
                    value={hr}
                    onChange={(event) => {
                      props.handleChange(event);
                      setHr(event.target.value);
                    }}
                    placeholder="HRmax"
                    error={meta.touched && !!meta.error}
                    errorText={meta.error}
                  ></Input>
                )}
              </Field>
            </Form>
          );
        }}
      </Formik>
      <div className="flex mt-2">
        <button className="btn-black" onClick={calcByHR}>
          Calculate
        </button>
        <button className="btn-black" onClick={calcByAge}>
          Calculate by age
        </button>
      </div>
      <div className={styles.tableLayout}>
        <table>
          <caption>Heart rate zones</caption>
          <thead>
            <tr>
              <th>% of HRmax</th>
              <th className="px-2">Range</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>90% - 100%</td>
              <td>{fields.zone5}</td>
            </tr>
            <tr>
              <td>80% - 90%</td>
              <td>{fields.zone4}</td>
            </tr>
            <tr>
              <td>70% - 80%</td>
              <td>{fields.zone3}</td>
            </tr>
            <tr>
              <td>60% - 70%</td>
              <td>{fields.zone2}</td>
            </tr>
            <tr>
              <td>50% - 60%</td>
              <td className="table-cell">{fields.zone1}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
export default HRCalc;
