import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Pressable, Modal } from "react-native";
import * as yup from 'yup';
import { Formik, Form, Field } from 'formik';
import ValidatedInput from '../validatedInput';
import TBButton from '../TBButton';
import PopUpMenu from '../PopUpMenu';

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


const EditIngredientForm = ({ visible, setVisible, ingredient, editIngredient, deleteIngredient }: any) => {
  const handleDelete = () => {
    deleteIngredient();
    setVisible(false);
  }
  return (
    <PopUpMenu
      visible={visible}
      setVisible={setVisible}
    >
      <Formik
        initialValues={{
          title: ingredient.title,
          amount: ingredient.amount,
        }}

        validationSchema={recipeSchema}
        onSubmit={values => {
          editIngredient(values);
          setVisible(false);
        }}>

        {({ errors, handleChange, handleBlur, handleSubmit, values }) => (

          <>
            <Text style={styles.header}>Edit Ingredient</Text>

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

            <TBButton onPress={handleSubmit as any} title="Save" />
            <TBButton onPress={handleDelete as any} title="Delete" />
            <TBButton onPress={() => setVisible(false)} title="Cancel" />
          </>
        )}
      </Formik>
    </PopUpMenu>

  )
}

const styles = StyleSheet.create({
  header: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 10,
  }

})

export default EditIngredientForm;