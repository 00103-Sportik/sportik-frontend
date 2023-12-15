import styles from '../../styles/base.module.css';
import { EXERCISES_URL } from '../../common/constants/api.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SubtypeResponse } from '../../common/types/subtypes.ts';
import {
  useGetSubtypesQuery,
  useCreateSubtypeMutation,
  useDeleteSubtypeMutation,
  useUpdateSubtypeMutation,
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
  const [check, setCheck] = useState(false);
  const [subtype, setSubtype] = useState('');
  const [open, setOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const { data, isSuccess } = useGetSubtypesQuery({ type: type || '' });
  const [createSubtype, { isSuccess: isSuccessCreate, error: errorCreate }] = useCreateSubtypeMutation();
  const [updateSubtype, { isSuccess: isSuccessUpdate, error: errorUpdate }] = useUpdateSubtypeMutation();
  const [delSubtype, { isSuccess: isSuccessDelete, error: errorDelete }] = useDeleteSubtypeMutation();
  const [subtypes, setSubtypes] = useState<SubtypeResponse[]>([]);
  const [uuid, setUuid] = useState('');

  useEffect(() => {
    if (isSuccess) {
      setSubtypes(data?.data.subtypes);
    }
  }, [isSuccess, data]);

  if (isSuccessCreate && check) {
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
    setCheck(false);
  }

  if (errorCreate && check) {
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
    setCheck(false);
  }

  if (isSuccessUpdate && check) {
    toast('Update successful!', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
    setCheck(false);
  }

  if (errorUpdate && check) {
    toast('message' in errorUpdate ? errorUpdate && errorUpdate.message : 'Update failed!', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
    setCheck(false);
  }

  const onSubmit = async (values: SubtypeField) => {
    if (isUpdate) {
      await updateSubtype({ type: type || '', name: values.name, uuid });
    } else {
      await createSubtype({ name: values.name, type: type || '' });
    }
    setCheck(true);
  };

  if (isSuccessDelete && check) {
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
    setCheck(false);
  }
  if (errorDelete && check) {
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
    setCheck(false);
  }

  const deleteSubtype = async (uuid: string) => {
    await delSubtype({ uuid });
    setCheck(true);
  };

  return (
    <>
      <p className={styles.p1}>{type}</p>
      <p className={styles.p2}>Subtypes</p>
      <div className={styles.mainBox}>
        {subtypes.length !== 0 ? (
          subtypes.map((subtype) => (
            <div className={styles.itemBox}>
              <div
                className={styles.boxItems}
                onClick={(event) => {
                  const target = event.target as HTMLElement;
                  const button = target.closest('button');
                  if (button) {
                    if (button.classList.contains('delete-subtype')) {
                      deleteSubtype(subtype.uuid);
                    } else if (button.classList.contains('update-subtype')) {
                      setIsUpdate(true);
                      setSubtype(subtype.name);
                      setUuid(subtype.uuid);
                      setOpen(true);
                    }
                  } else {
                    navigate(`${EXERCISES_URL}/${subtype.uuid}`);
                  }
                }}
              >
                <div className={styles.boxContent}>
                  <div className={styles.boxInfo}>
                    <span>{subtype.name}</span>
                  </div>
                  <div hidden={subtype.user_uuid === null} className={styles.sideButtonsBox}>
                    <button className="delete-subtype" hidden={subtype.user_uuid === null}>
                      <AiOutlineClose />
                    </button>
                    <button className="update-subtype">
                      <AiFillEdit />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h1 className={styles.noEntities}>There are no subtypes yet</h1>
        )}
        {/* <div className={styles.itemBox}> */}
        {/*   <div className={styles.boxItems} onClick={() => navigate(`${EXERCISES_URL}/${1}`)}> */}
        {/*     <div className={styles.boxContent}> */}
        {/*       <div className={styles.boxInfo}> */}
        {/*         <span>name</span> */}
        {/*       </div> */}
        {/*       <div className={styles.sideButtonsBox}> */}
        {/*         <button type="button"> */}
        {/*           <AiFillEdit /> */}
        {/*         </button> */}
        {/*         <button type="button"> */}
        {/*           <AiOutlineClose /> */}
        {/*         </button> */}
        {/*       </div> */}
        {/*     </div> */}
        {/*   </div> */}
        {/* </div> */}
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
                <DialogDismiss className="btn-black" onClick={() => onSubmit({ name: subtype })}>
                  Save
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
