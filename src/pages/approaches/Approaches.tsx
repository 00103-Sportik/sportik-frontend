import styles from '../../styles/base.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '../../common/components/input/Input.tsx';
import { useEffect, useState } from 'react';
import { ApproachRequest, ApproachState, combinationParams } from '../../common/types/workouts.ts';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { selectCurrentWorkout, selectExercises } from '../../store/workouts/workouts.selectors.ts';
import { setApproaches } from '../../store/workouts/workouts.slice.ts';
import { approachInitialValue, approachValidationSchema } from '../../common/validations/approachValidationSchema.ts';
import { useFormik } from 'formik';
import { AiOutlineClose, AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { IMask } from 'react-imask';
import { WORKOUTS_URL } from '../../common/constants/api.ts';
import { useGetExerciseQuery } from '../../store/exercise/exercise.api.ts';

function Approaches() {
  const { uuid } = useParams();
  const { data } = useGetExerciseQuery({ uuid });
  const exercisesFromStore = useAppSelector(selectExercises);
  const exercise = exercisesFromStore.filter((exercise) => exercise.uuid === uuid)[0];
  const [check, setCheck] = useState(true);
  const combParams = combinationParams.filter((params) => params.params === exercise.combination_params)[0];
  const intialVal = approachInitialValue.filter((init) => init.name === combParams.name)[0];
  const addApproach = () => {
    if (formik.values.initial.length === 0) {
      const toApproaches: ApproachState = { param1: intialVal.initial[0].param1, param2: intialVal.initial[0].param2 };
      formik.setValues({ name: '', initial: [toApproaches] });
    } else {
      formik.setValues({
        name: '',
        initial: [...formik.values.initial, { ...formik.values.initial[formik.values.initial.length - 1] }],
      });
    }
  };

  const onSubmit = () => {
    let toApproaches: ApproachRequest[];
    if (combParams.param2 === 'Time') {
      toApproaches = formik.values.initial.map((approach) => {
        if (approach.param2 !== '') {
          const parts = approach.param2.split(':');
          const time = Number(parts[0]) * 3600 + Number(parts[1]) * 60 + Number(parts[2]);
          return { param1: Number(approach.param1), param2: time } as ApproachRequest;
        } else {
          return { param1: Number(approach.param1), param2: 0 } as ApproachRequest;
        }
      });
    } else {
      toApproaches = formik.values.initial.map((approach) => {
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

  const formik = useFormik({
    initialValues: intialVal,
    onSubmit,
    validationSchema: approachValidationSchema.filter((valSchema) => valSchema.name === combParams.name)[0].approach,
  });

  const getApproachesState = (approachesFromState: ApproachRequest[]) => {
    let toApproaches: ApproachState[] = [];
    if (approachesFromState) {
      if (combParams.param2 === 'Time') {
        toApproaches = approachesFromState.map((approach) => {
          if (approach.param2 !== null) {
            const hours = Math.floor(approach.param2 / 3600);
            const minutes = Math.floor((approach.param2 % 3600) / 60);
            const seconds = approach.param2 % 60;
            const time = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${
              seconds < 10 ? '0' + seconds : seconds
            }`;
            return { param1: String(approach.param1), param2: time } as ApproachState;
          } else {
            return { param1: String(approach.param1), param2: '00:00:00' } as ApproachState;
          }
        });
      } else {
        toApproaches = approachesFromState.map((approach) => {
          return { param1: String(approach.param1), param2: String(approach.param2) } as ApproachState;
        });
      }
    }
    return toApproaches;
  };

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const workout_uuid = useAppSelector(selectCurrentWorkout);

  useEffect(() => {
    if (check) {
      formik.setValues({ name: '', initial: getApproachesState(exercise.approaches || []) });
      setCheck(false);
    }
  }, [check]);

  const deleteApproach = (index: number) => {
    const tempApproaches = [...formik.values.initial];
    tempApproaches.splice(index, 1);
    formik.setValues({ name: '', initial: tempApproaches });
  };

  return (
    <>
      <p className={styles.p1}>{data?.data.name || ''}</p>
      <form id="approach-form" onSubmit={formik.handleSubmit}>
        <div className={styles.sideButtonsBox}>
          <p data-testid="count-p" className="text-[22px]">{`Approaches: ${formik.values.initial.length}`}</p>
          <button data-testid="add-btn" className="btn-black mt-0" onClick={addApproach} type="reset">
            <AiOutlinePlus />
          </button>
          <button
            data-testid="delete-btn"
            className="btn-black mt-0"
            disabled={formik.values.initial.length === 0}
            type="button"
            onClick={() => {
              formik.setValues({
                name: '',
                initial: formik.values.initial.splice(0, formik.values.initial.length - 1),
              });
            }}
          >
            <AiOutlineMinus />
          </button>
        </div>
        <div className={styles.mainBox}>
          {formik.values.initial.length !== 0 ? (
            formik.values.initial.map((approach, index) => (
              <div className={styles.itemBox}>
                <div key={index} className={styles.boxItems}>
                  <div className={styles.boxContent}>
                    <div className="w-[350px] flex flex-row gap-[6px] text-[16px]">
                      <Input
                        testid={`param1-${index}`}
                        type="text"
                        {...formik.getFieldProps(`initial[${index}].param1`)}
                        error={
                          formik.getFieldMeta(`initial[${index}].param1`).touched &&
                          !!formik.getFieldMeta(`initial[${index}].param1`).error
                        }
                        errorText={formik.getFieldMeta(`initial[${index}].param1`).error}
                        onChange={(e) => {
                          const tempApproach = { ...approach };
                          tempApproach.param1 = e.target.value;
                          const tempApproaches = [...formik.values.initial];
                          tempApproaches[index] = tempApproach;
                          formik.setValues({ name: '', initial: tempApproaches });
                          formik.handleChange(e);
                        }}
                        placeholder={combParams.param1}
                        className="form-input-narrow w-[150px]"
                      ></Input>
                      {combParams.param2 === 'Time' ? (
                        <Input
                          testid={`param2-${index}`}
                          id={`time.${index}`}
                          type="text"
                          {...formik.getFieldProps(`initial[${index}].param2`)}
                          error={
                            formik.getFieldMeta(`initial[${index}].param2`).touched &&
                            !!formik.getFieldMeta(`initial[${index}].param2`).error
                          }
                          errorText={formik.getFieldMeta(`initial[${index}].param2`).error}
                          onChange={(e) => {
                            const tempApproach = { ...approach };
                            const element = document.getElementById(`time.${index}`);
                            const maskOptions = {
                              mask: '00:00:00',
                            };
                            // @ts-ignore
                            IMask(element, maskOptions);
                            tempApproach.param2 = e.target.value;
                            const tempApproaches = [...formik.values.initial];
                            tempApproaches[index] = tempApproach;
                            formik.setValues({ name: '', initial: tempApproaches });
                            formik.handleChange(e);
                          }}
                          placeholder={combParams.param2}
                          className="form-input-narrow w-[150px]"
                        ></Input>
                      ) : (
                        <Input
                          testid={`param2-${index}`}
                          type="text"
                          {...formik.getFieldProps(`initial[${index}].param2`)}
                          error={
                            formik.getFieldMeta(`initial[${index}].param2`).touched &&
                            !!formik.getFieldMeta(`initial[${index}].param2`).error
                          }
                          errorText={formik.getFieldMeta(`initial[${index}].param2`).error}
                          onChange={(e) => {
                            const tempApproach = { ...approach };
                            tempApproach.param2 = e.target.value;
                            const tempApproaches = [...formik.values.initial];
                            tempApproaches[index] = tempApproach;
                            formik.setValues({ name: '', initial: tempApproaches });
                            formik.handleChange(e);
                          }}
                          placeholder={combParams.param2}
                          className="form-input-narrow w-[150px]"
                        ></Input>
                      )}
                    </div>
                    <div className={styles.sideButtonsBox}>
                      <button data-testid={`delete${index}-btn`} type="reset" onClick={() => deleteApproach(index)}>
                        <AiOutlineClose />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h1 data-testid="no-entities-h1" className={styles.noEntities}>
              There are no approaches yet
            </h1>
          )}
        </div>
        <div className={styles.buttonsBox}>
          <button data-testid="save-btn" className="btn-black" type="submit" form="approach-form">
            Save
          </button>
        </div>
      </form>
    </>
  );
}

export default Approaches;
