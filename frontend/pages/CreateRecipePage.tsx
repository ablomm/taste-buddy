import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Pressable } from "react-native";
import * as yup from 'yup';
import { Formik, Form, Field } from 'formik';
import ValidatedInput from '../components/validatedInput';

const SignUpPage = () => {

  // define validation rules for each field
  const schema = yup.object().shape({
    title: yup
      .string()
      .required("required"),
    description: yup
      .string()
      .optional(),
    cookTime: yup
      .number()
      .optional()
      .typeError("Must be a number"),
    calories: yup
      .number()
      .optional()
      .typeError("Must be a number"),
    servings: yup
      .number()
      .optional()
      .typeError("Must be a number"),
  });

  const [title, onChangeTitle] = React.useState('');
  const [description, onChangeDescription] = React.useState('');
  const [cookTime, onChangeCookTime] = React.useState('');
  const [calories, onChangeCalories] = React.useState('');
  const [servings, onChangeServings] = React.useState('');

  console.log(cookTime)
  return (
    <>
      <Formik
        initialValues={{
          title: '',
          description: '',
          cookTime: '',
          calories: '',
          servings: ''
        }}

        validationSchema={schema}
        onSubmit={values => {
          // same shape as initial values
          console.log(values);
        }}>

        {({ errors, handleChange, handleBlur, handleSubmit, values }) => (
          <View>
            
              <ValidatedInput
                placeholder="Title"
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                value={values.title}
                error={errors.title}
              />

              <ValidatedInput
                placeholder="Description"
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
                error={errors.description}
              />

              <ValidatedInput
                placeholder="Cook Time (min)"
                onChangeText={handleChange('cookTime')}
                onBlur={handleBlur('cookTime')}
                value={values.cookTime}
                error={errors.cookTime}
              />

              <ValidatedInput
                placeholder="Calories"
                onChangeText={handleChange('calories')}
                onBlur={handleBlur('calories')}
                value={values.calories}
                error={errors.calories}
              />
              <ValidatedInput
                placeholder="Servings"
                onChangeText={handleChange('servings')}
                onBlur={handleBlur('servings')}
                value={values.servings}
                error={errors.servings}
              />

            <Button onPress={handleSubmit as any} title="Submit" />  
        </View>
        )}
      </Formik>
    </>);
}

const onSubmit = () => {

}

const styles = StyleSheet.create({
  form: {
    display: 'flex',
    flexDirection: 'column'
  },

  input: {
    margin: 10
  },
  button: {
    height: 50,
    width: 340,
    borderRadius: 100,
    borderWidth: 2,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  signupText: {
    fontSize: 16,
    lineHeight: 19,
    fontWeight: "600"
  },
  error: {
    color: "red",
    paddingLeft: 15
  },
  textInput: {
    height: 50,
    width: 340,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#F6F6F6",
    color: "#BDBDBD",
    borderColor: "#E8E8E8"
  }
})
export default SignUpPage;