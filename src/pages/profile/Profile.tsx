import { Input } from '../../common/components/input/Input.tsx';
import { Field, FieldProps, Form, Formik } from 'formik';
import {
  ProfileFields,
  profileInitialValues,
  profileValidationSchema,
} from '../../common/validations/profileValidationSchema.ts';
import { useUpdateProfileMutation } from '../../store/profile/profile.api.ts';
import { Navbar } from '../../common/components/navbar/Navbar.tsx';
import logo from '../../assets/avatar.jpg';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { updateAvatar } from '../../store/profile/profile.slice.ts';
import { AvatarUpdate } from '../../common/types/profile.ts';
import { selectAvatar } from '../../store/profile/profile.selectors.ts';

function Profile() {
  const [updateProfile] = useUpdateProfileMutation();
  const dispatch = useAppDispatch();
  const avatar = useAppSelector(selectAvatar);

  const onSubmit = (values: ProfileFields) => {
    updateProfile(values);
  };

  const convertBase64 = ({ file }: { file: any }) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve((fileReader.result as string).split('base64,')[1]);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  async function changeAvatar(e: React.ChangeEvent) {
    const target = e.target as HTMLInputElement;
    const file = (target.files as FileList)[0];
    const base64 = (await convertBase64({ file: file })) as string;
    console.log(base64);
    const data: AvatarUpdate = {
      avatar: base64,
    };
    dispatch(updateAvatar(data));
  }

  return (
    <>
      <Navbar></Navbar>
      <h1>Profile</h1>
      <div className="@apply flex flex-row">
        <Formik initialValues={profileInitialValues} onSubmit={onSubmit} validationSchema={profileValidationSchema}>
          {({}) => {
            return (
              <Form className="layout">
                <Field name="email">
                  {({ field, form, meta }: FieldProps) => (
                    <Input
                      autoComplete="email"
                      disabled={true}
                      type="text"
                      {...field}
                      placeholder="Email"
                      error={meta.touched && !!meta.error}
                      errorText={meta.error}
                      onClear={() => form.setFieldValue('email', '')}
                    />
                  )}
                </Field>
                <Field name="name">
                  {({ field, form, meta }: FieldProps) => (
                    <Input
                      type="text"
                      {...field}
                      placeholder="Name"
                      error={meta.touched && !!meta.error}
                      errorText={meta.error}
                      onClear={() => form.setFieldValue('name', '')}
                    />
                  )}
                </Field>
                <Field name="surname">
                  {({ field, form, meta }: FieldProps) => (
                    <Input
                      type="text"
                      {...field}
                      placeholder="Surname"
                      error={meta.touched && !!meta.error}
                      errorText={meta.error}
                      onClear={() => form.setFieldValue('surname', '')}
                    />
                  )}
                </Field>
                <Field name="age">
                  {({ field, form, meta }: FieldProps) => (
                    <Input
                      type="number"
                      {...field}
                      placeholder="Age"
                      error={meta.touched && !!meta.error}
                      errorText={meta.error}
                      onClear={() => form.setFieldValue('age', '')}
                    />
                  )}
                </Field>
                <Field name="height">
                  {({ field, form, meta }: FieldProps) => (
                    <Input
                      type="number"
                      {...field}
                      placeholder="Height"
                      error={meta.touched && !!meta.error}
                      errorText={meta.error}
                      onClear={() => form.setFieldValue('height', '')}
                    />
                  )}
                </Field>
                <Field name="weight">
                  {({ field, form, meta }: FieldProps) => (
                    <Input
                      type="number"
                      {...field}
                      placeholder="Weight"
                      error={meta.touched && !!meta.error}
                      errorText={meta.error}
                      onClear={() => form.setFieldValue('weight', '')}
                    />
                  )}
                </Field>
                <div className="@apply w-full">
                  <select className="combobox @apply w-full">
                    <option value="" disabled selected hidden>
                      Sex
                    </option>{' '}
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </Form>
            );
          }}
        </Formik>
        <div>
          <img
            className="img"
            width={50}
            height={50}
            src={!avatar ? logo : `data:image/*;base64,${avatar}`}
            alt="avatar"
          />
          <label className="@apply btn-black cursor-pointer">
            <input className="@apply hidden" onChange={changeAvatar} type="file" />
            <span>Upload avatar</span>
          </label>
        </div>
      </div>
      <button className="btn-black" type="submit">
        Save
      </button>
    </>
  );
}

export default Profile;
