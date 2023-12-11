import styles from '../workouts/Workouts.module.css';
import { EXERCISES_URL } from '../../common/constants/api.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { SubtypesRequest } from '../../common/types/subtypes.ts';
import { useGetSubtypesQuery, useCreateSubtypeMutation } from '../../store/subtype/subtype.api.ts';
import { Dialog, DialogDismiss } from '@ariakit/react';
import { Input } from '../../common/components/input/Input.tsx';
import { Field, FieldProps, Form, Formik } from 'formik';
import {
  SubtypeField,
  subtypeInitialValue,
  subtypeValidationSchema,
} from '../../common/validations/subtypeValidationSchema.ts';
import { toast } from 'react-toastify';

function Subtypes() {
  const navigate = useNavigate();
  const { type } = useParams();
  const [subtype, setSubtype] = useState('');
  const [open, setOpen] = useState(false);
  const { data, refetch } = useGetSubtypesQuery({ type: type || '' });
  // @ts-ignore
  const [subtypes, setSubtypes] = useState<SubtypesRequest[]>(data?.data.subtypes || []);
  const [createSubtype, { error }] = useCreateSubtypeMutation();

  const onSubmit = (values: SubtypeField) => {
    createSubtype(values);
    if (error) {
      toast('message' in error ? error && error.message : 'Create failed!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    } else {
      refetch();
      setOpen(false);
      toast('Create successful!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  };

  return (
    <>
      <p>{type}</p>
      <div className={styles.workouts} id="box">
        {/* {subtypes.map((subtype) => ( */}
        {/*   <div className={styles.box}> */}
        {/*     <div className={styles.boxInfo} onClick={() => navigate(`${EXERCISES_URL}/${subtype.id}`)}> */}
        {/*       <span>{subtype.name}</span> */}
        {/*     </div> */}
        {/*   </div> */}
        {/* ))} */}
        <div className={styles.box}>
          <div className={styles.boxInfo} onClick={() => navigate(`${EXERCISES_URL}/${1}`)}>
            <span>name</span>
          </div>
        </div>
        <div className={styles.box}>
          <div className={styles.boxInfo} onClick={() => navigate(`${EXERCISES_URL}/${2}`)}>
            <span>name</span>
          </div>
        </div>
        <div className={styles.box}>
          <div className={styles.boxInfo} onClick={() => navigate(`${EXERCISES_URL}/${3}`)}>
            <span>name</span>
          </div>
        </div>
        <div className={styles.box}>
          <div className={styles.boxInfo} onClick={() => navigate(`${EXERCISES_URL}/${4}`)}>
            <span>name</span>
          </div>
        </div>
        <div className={styles.box}>
          <div className={styles.boxInfo} onClick={() => navigate(`${EXERCISES_URL}/${5}`)}>
            <span>name</span>
          </div>
        </div>
        <div className={styles.box}>
          <div className={styles.boxInfo} onClick={() => navigate(`${EXERCISES_URL}/${6}`)}>
            <span>name</span>
          </div>
        </div>
        <div className={styles.box}>
          <div className={styles.boxInfo} onClick={() => navigate(`${EXERCISES_URL}/${7}`)}>
            <span>name</span>
          </div>
        </div>
        <div className={styles.box}>
          <div className={styles.boxInfo} onClick={() => navigate(`${EXERCISES_URL}/${8}`)}>
            <span>name</span>
          </div>
        </div>
        <div className={styles.box}>
          <div className={styles.boxInfo} onClick={() => navigate(`${EXERCISES_URL}/${9}`)}>
            <span>name</span>
          </div>
        </div>
        <div className={styles.box}>
          <div className={styles.boxInfo} onClick={() => navigate(`${EXERCISES_URL}/${10}`)}>
            <span>name</span>
          </div>
        </div>
      </div>
      <Formik initialValues={subtypeInitialValue} onSubmit={onSubmit} validationSchema={subtypeValidationSchema}>
        {(props) => {
          return (
            <Dialog
              open={open}
              onClose={() => setOpen(false)}
              getPersistentElements={() => document.querySelectorAll('.Toastify')}
              backdrop={<div className="backdrop" />}
              className="dialog"
            >
              <p className="description">Input subtype name:</p>
              <Form>
                <Field name="name" className={styles.formInput}>
                  {({ field, meta }: FieldProps) => (
                    <Input
                      type="text"
                      {...field}
                      value={subtype}
                      onChange={(event) => {
                        props.handleChange(event);
                        setSubtype(event.target.value);
                      }}
                      placeholder="Name"
                      error={meta.touched && !!meta.error}
                      errorText={meta.error}
                    ></Input>
                  )}
                </Field>
              </Form>
              <div className="buttons">
                <DialogDismiss className="btn-black" type="submit">
                  Add
                </DialogDismiss>
                <DialogDismiss className="btn-red">Exit</DialogDismiss>
              </div>
            </Dialog>
          );
        }}
      </Formik>
      <button className="btn-black" onClick={() => setOpen(true)}>
        Add
      </button>
    </>
  );
}

export default Subtypes;
