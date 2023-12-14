import styles from './Subtypes.module.css';
import { EXERCISES_URL } from '../../common/constants/api.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { SubtypeResponse } from '../../common/types/subtypes.ts';
import {
  useGetSubtypesQuery,
  useCreateSubtypeMutation,
  useDeleteSubtypeMutation,
} from '../../store/subtype/subtype.api.ts';
import { Dialog, DialogDismiss } from '@ariakit/react';
import { Input } from '../../common/components/input/Input.tsx';
import { Field, FieldProps, Form, Formik } from 'formik';
import {
  SubtypeField,
  subtypeInitialValue,
  subtypeValidationSchema,
} from '../../common/validations/subtypeValidationSchema.ts';
import { toast } from 'react-toastify';
import { AiFillEdit, AiOutlineClose } from 'react-icons/ai';

function Subtypes() {
  const navigate = useNavigate();
  const { type } = useParams();
  const [subtype, setSubtype] = useState('');
  const [open, setOpen] = useState(false);
  const { data, isSuccess } = useGetSubtypesQuery({ type: type || '' });
  const [createSubtype, { isSuccess: isSuccessCreate, error: errorCreate }] = useCreateSubtypeMutation();
  const [delSubtype, { isSuccess: isSuccessDelete, error: errorDelete }] = useDeleteSubtypeMutation();
  const [subtypes, setSubtypes] = useState<SubtypeResponse[]>([]);

  if (isSuccess) {
    setSubtypes(data?.data.subtypes);
  }

  if (isSuccessCreate) {
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

  if (errorCreate) {
    toast('message' in errorCreate ? errorCreate && errorCreate.message : 'Create failed!', {
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

  const onSubmit = async (values: SubtypeField) => {
    await createSubtype({ ...values });
  };

  if (isSuccessDelete) {
    toast('Delete subtype successfully!', {
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
  if (errorDelete) {
    toast('message' in errorDelete ? errorDelete && errorDelete.message : 'Delete subtype failed!', {
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

  const deleteSubtype = async (uuid: string) => {
    await delSubtype({ uuid });
  };

  return (
    <>
      <p className={styles.p1}>{type}</p>
      <p className={styles.p2}>Subtypes</p>
      <div className={styles.subtypes}>
        {subtypes.length !== 0 ? (
          subtypes.map((subtype) => (
            <div className={styles.box}>
              <div className={styles.boxItems} onClick={() => navigate(`${EXERCISES_URL}/${subtype.uuid}`)}>
                <span className={styles.boxInfoSize}>{subtype.name}</span>
                <div>
                  <button type="button" onClick={() => deleteSubtype(subtype.uuid)} hidden={subtype.user_uuid === null}>
                    <AiOutlineClose />
                  </button>
                  <button type="button">
                    <AiFillEdit />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h1 className={styles.noSubtypes}>There are no subtypes yet</h1>
        )}
        <div className={styles.box}>
          <div className={styles.boxItems} onClick={() => navigate(`${EXERCISES_URL}/${1}`)}>
            <span className={styles.boxInfoSize}>name</span>
            <div>
              <button type="button">
                <AiOutlineClose />
              </button>
              <button type="button">
                <AiFillEdit />
              </button>
            </div>
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
              <p className={styles.p}>Input subtype name:</p>
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
                      className="form-input-modal"
                    ></Input>
                  )}
                </Field>
              </Form>
              <div className={styles.buttonsBox}>
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
