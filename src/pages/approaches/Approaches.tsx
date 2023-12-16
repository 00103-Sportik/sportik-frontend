import styles from '../../styles/base.module.css';
import styles2 from './Approaches.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '../../common/components/input/Input.tsx';
import { useState } from 'react';
import { ApproachRequest, ApproachState, combinationParams } from '../../common/types/workouts.ts';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { selectCurrentWorkout, selectExercises } from '../../store/workouts/workouts.selectors.ts';
import { setApproaches } from '../../store/workouts/workouts.slice.ts';
import { approachInitialValue, approachValidationSchema } from '../../common/validations/approachValidationSchema.ts';
import { Field, FieldProps, Form, Formik } from 'formik';
import { AiOutlineClose } from 'react-icons/ai';
import { IMask } from 'react-imask';
import { WORKOUTS_URL } from '../../common/constants/api.ts';
import { useGetExerciseQuery } from '../../store/exercise/exercise.api.ts';

function Approaches() {
  const { uuid } = useParams();
  const { data } = useGetExerciseQuery({ uuid });
  const exercisesFromStore = useAppSelector(selectExercises);
  const exercise = exercisesFromStore.filter((exercise) => exercise.uuid === uuid)[0];
  const combParams = combinationParams.filter((params) => params.params === exercise.combination_params)[0];
  let toApproaches: ApproachState[] = [];
  if (exercise.approaches) {
    if (combParams.param2 === 'Time') {
      toApproaches = exercise.approaches.map((approach) => {
        const hours = Math.floor(approach.param2 / 3600);
        const minutes = Math.floor((approach.param2 % 3600) / 60);
        const seconds = approach.param2 % 60;
        const time = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${
          seconds < 10 ? '0' + seconds : seconds
        }`;
        console.log(time);
        return { param1: String(approach.param1), param2: time } as ApproachState;
      });
    } else {
      toApproaches = exercise.approaches.map((approach) => {
        return { param1: String(approach.param1), param2: String(approach.param2) } as ApproachState;
      });
    }
  }
  const [approaches, setApproachesToState] = useState<ApproachState[]>(toApproaches || []);
  const dispatch = useAppDispatch();
  const intialVal = approachInitialValue.filter((init) => init.name === combParams.name)[0].initial;
  const navigate = useNavigate();
  const workout_uuid = useAppSelector(selectCurrentWorkout);

  const onSubmit = () => {
    if (approaches.length === 0) {
      const toApproaches: ApproachState = { param1: intialVal.param1, param2: intialVal.param2 };
      setApproachesToState([toApproaches]);
    } else {
      setApproachesToState([...approaches, { ...approaches[approaches.length - 1] }]);
    }
  };

  const saveApproaches = () => {
    let toApproaches: ApproachRequest[];
    if (combParams.param2 === 'Time') {
      toApproaches = approaches.map((approach) => {
        const parts = approach.param2.split(':');
        const time = Number(parts[0]) * 3600 + Number(parts[1]) * 60 + Number(parts[2]);
        return { param1: Number(approach.param1), param2: time } as ApproachRequest;
      });
    } else {
      toApproaches = approaches.map((approach) => {
        return { param1: Number(approach.param1), param2: Number(approach.param2) } as ApproachRequest;
      });
    }
    dispatch(
      setApproaches({
        exerciseId: uuid || '',
        approaches: toApproaches,
      }),
    );
    navigate(`${WORKOUTS_URL}/${workout_uuid}`);
  };

  const deleteApproach = (index: number) => {
    const tempApproaches = [...approaches];
    tempApproaches.splice(index, 1);
    setApproachesToState(tempApproaches);
  };

  return (
    <>
      <p className={styles.p1}>{data?.data.name || ''}</p>
      <p className={styles.p2}>Approaches</p>
      <Formik
        initialValues={intialVal}
        onSubmit={onSubmit}
        validationSchema={
          approachValidationSchema.filter((valSchema) => valSchema.name === combParams.name)[0].approach
        }
      >
        {(props) => (
          <Form>
            <div className={styles.mainBox}>
              {approaches.length !== 0 ? (
                approaches.map((approach, index) => (
                  <div className={styles.itemBox}>
                    <div key={index} className={styles.boxItems}>
                      <div className={styles.boxContent}>
                        <div className={styles2.boxInfo}>
                          <Field name={`fields.${index}.param1`}>
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
                          <Field name={`fields.${index}.param2`}>
                            {({ meta, field }: FieldProps) =>
                              combParams.param2 === 'Time' ? (
                                <Input
                                  id={`time.${index}`}
                                  type="text"
                                  {...field}
                                  value={approach.param2}
                                  onChange={(e) => {
                                    const tempApproach = { ...approach };
                                    const element = document.getElementById(`time.${index}`);
                                    const maskOptions = {
                                      mask: '00:00:00',
                                    };
                                    // @ts-ignore
                                    IMask(element, maskOptions);
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
                              ) : (
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
                              )
                            }
                          </Field>
                        </div>
                        <div className={styles.sideButtonsBox}>
                          <button type="button" onClick={() => deleteApproach(index)}>
                            <AiOutlineClose />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <h1 className={styles.noEntities}>There are no approaches yet</h1>
              )}
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
    </>
  );
}

export default Approaches;
