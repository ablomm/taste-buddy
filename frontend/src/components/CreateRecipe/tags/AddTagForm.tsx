import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Pressable, Modal } from "react-native";
import * as yup from 'yup';
import { Formik, Form, Field } from 'formik';
import ValidatedInput from '../../ValidatedInput';
import TBButton from '../../TBButton';
import PopUpMenu from '../../PopUpMenu';

export interface Tag {
  value: string,
}


// define validation rules for each field
const recipeSchema = yup.object().shape({
  value: yup
    .string()
    .required("required"),
});


const AddTagForm = ({ visible, setVisible, addTag }: any) => {
  return (
    <PopUpMenu
      visible = {visible}
      setVisible = {setVisible}
    >
          <Formik
            initialValues={{
              value: '',
            }}

            validationSchema={recipeSchema}
            onSubmit={values => {
              addTag(values);
              setVisible(false);
            }}>

            {({ errors, handleChange, handleBlur, handleSubmit, values }) => (

              <>
                <Text style={styles.header}>Add Tag</Text>

                <ValidatedInput
                  placeholder="Value"
                  onChangeText={handleChange('value')}
                  onBlur={handleBlur('value')}
                  value={values.value}
                  error={errors.value}
                />

                <TBButton onPress={handleSubmit as any} title="Save"/>
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

export default AddTagForm;