import styles from './Approaches.module.css';
import { useParams } from 'react-router-dom';
import { Input } from '../../common/components/input/Input.tsx';
import { useState } from 'react';
import { ApproachRequest, combinationParams } from '../../common/types/workouts.ts';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { selectExercises } from '../../store/workouts/workouts.selectors.ts';
import { setApproaches } from '../../store/workouts/workouts.slice.ts';
import { approachInitialValue, approachValidationSchema } from '../../common/validations/approachValidationSchema.ts';
import { Field, FieldProps, Form, Formik } from 'formik';

function Approaches() {
  const { id } = useParams();
  const exercisesFromStore = useAppSelector(selectExercises);
  const exercise = exercisesFromStore.filter((exercise) => exercise.id === id)[0];
  const [approaches, setApproachesToState] = useState<ApproachRequest[]>(exercise.approaches || []);
  const dispatch = useAppDispatch();
  const combParams = combinationParams.filter((params) => params.params === exercise.combinationParams)[0];
  const onSubmit = () => {
    if (approaches.length === 0) {
      const toApproaches: ApproachRequest = { id: 0, param1: '', param2: '' };
      setApproachesToState([toApproaches]);
    } else {
      setApproachesToState([...approaches, { ...approaches[approaches.length - 1], id: approaches.length }]);
    }
  };

  const saveApproaches = () => {
    dispatch(
      setApproaches({
        exerciseId: exercise.id || '',
        approaches: approaches,
      }),
    );
  };

  const deleteApproach = (index: number) => {
    const tempApproaches = [...approaches];
    tempApproaches.splice(index, 1);
    setApproachesToState(tempApproaches);
  };

  return (
    <>
      <p>{exercise.name}</p>
      <p>Approaches</p>
      <div>
        <Formik
          initialValues={approachInitialValue}
          onSubmit={onSubmit}
          validationSchema={
            approachValidationSchema.filter((valSchema) => valSchema.name === combParams.name)[0].approach
          }
        >
          {(props) => (
            <Form>
              <div className={styles.approaches}>
                <div className={styles.box}>
                  {approaches.length !== 0 ? (
                    approaches.map((approach, index) => (
                      <div key={index} className={styles.boxItems}>
                        <Field name={`fields.${index}.param1`} className={styles.boxInfo}>
                          {({ meta, field }: FieldProps) => (
                            <Input
                              type="text"
                              {...field}
                              value={approach.param1}
                              onChange={(e) => {
                                const tempApproach = { ...approach };
                                tempApproach.param1 = e.target.value;
                                const tempApproaches = [...approaches];
                                tempApproaches[index] = tempApproach;
                                setApproachesToState(tempApproaches);
                                props.handleChange(e);
                              }}
                              placeholder={combParams.param1}
                              error={meta.touched && !!meta.error}
                              errorText={meta.error}
                              className="form-input-narrow w-[150px]"
                            ></Input>
                          )}
                        </Field>
                        <Field name={`fields.${index}.param2`} className={styles.boxInfo}>
                          {({ meta, field }: FieldProps) => (
                            <Input
                              type="text"
                              {...field}
                              value={approach.param2}
                              onChange={(e) => {
                                const tempApproach = { ...approach };
                                tempApproach.param2 = e.target.value;
                                const tempApproaches = [...approaches];
                                tempApproaches[index] = tempApproach;
                                setApproachesToState(tempApproaches);
                                props.handleChange(e);
                              }}
                              placeholder={combParams.param2}
                              error={meta.touched && !!meta.error}
                              errorText={meta.error}
                              className="form-input-narrow w-[150px]"
                            ></Input>
                          )}
                        </Field>
                        <button type="button" onClick={() => deleteApproach(index)}>
                          Delete
                        </button>
                      </div>
                    ))
                  ) : (
                    <h1 className={styles.noApproaches}>There are no approaches yet</h1>
                  )}
                </div>
              </div>
              <div className={styles.buttonsBox}>
                <button className="btn-black" type="submit">
                  Add
                </button>
                <button className="btn-black" onClick={saveApproaches}>
                  Save
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default Approaches;
