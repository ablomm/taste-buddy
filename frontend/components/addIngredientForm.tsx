import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Pressable, Modal } from "react-native";
import * as yup from 'yup';
import { Formik, Form, Field } from 'formik';
import ValidatedInput from './validatedInput';

export interface Ingredient {
  title: string,
  amount: number
}


// define validation rules for each field
const recipeSchema = yup.object().shape({
  title: yup
    .string()
    .required("required"),
  amount: yup
    .number()
    .optional()
    .typeError("Must be a number"),
});


const AddIngredientsForm = (props: any) => {

  let { visible, setVisible, addIngredients } = props;

  return (
    <View
    >
    <Modal
      animationType='slide'
      transparent={true}
      visible={visible}
      onRequestClose={() => setVisible(false)}
    >
      <Formik
        initialValues={{
          title: '',
          amount: '',
        }}

        validationSchema={recipeSchema}
        onSubmit={values => {
          addIngredients(values);
          setVisible(false);
          console.log(values);
        }}>

        {({ errors, handleChange, handleBlur, handleSubmit, values }) => (
          <View style={styles.modalView}>
            <View style = {styles.form}>

            <ValidatedInput
              placeholder="Title"
              onChangeText={handleChange('title')}
              onBlur={handleBlur('title')}
              value={values.title}
              error={errors.title}
            />

          <ValidatedInput
              placeholder="Amount"
              onChangeText={handleChange('amount')}
              onBlur={handleBlur('amount')}
              value={values.amount}
              error={errors.amount}
            />

          <Button onPress={handleSubmit as any} title="Save" />
          <Button onPress={() => setVisible(false)} title="Cancel" />
          </View>
          </View>
        )}
      </Formik>
    </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  modalView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 'auto',
    height: 'auto',
    flex: 1
  },
  form: {
    backgroundColor: 'lightgray',
    borderRadius: 20,
    //box sizing border box
  }
})

export default AddIngredientsForm;