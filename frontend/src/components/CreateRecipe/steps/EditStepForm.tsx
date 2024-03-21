import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Pressable, Modal } from "react-native";
import * as yup from 'yup';
import { Formik, Form, Field } from 'formik';
import ValidatedInput from '../../ValidatedInput';
import TBButton from '../../TBButton';
import PopUpMenu from '../../PopUpMenu';

export interface Step {
  step: string
}


// define validation rules for each field
const schema = yup.object().shape({
  step: yup
    .string()
    .required("required"),
});


const EditStepForm = ({ visible, setVisible, item, editItem, deleteItem }: any) => {
  const handleDelete = () => {
    deleteItem();
    setVisible(false);
  }
  return (
    <PopUpMenu
      visible={visible}
      setVisible={setVisible}
    >
      <Formik
        initialValues={{
          step: item.step,
        }}

        validationSchema={schema}
        onSubmit={values => {
          editItem(values);
          setVisible(false);
        }}>

        {({ errors, handleChange, handleBlur, handleSubmit, values }) => (

          <>
            <Text style={styles.header}>Edit Step</Text>

            <ValidatedInput
              placeholder="Step"
              onChangeText={handleChange('step')}
              onBlur={handleBlur('step')}
              value={values.step}
              error={errors.step}
              multiline={true}
              style={{
                height: "auto",
                textAlignVertical: 'top',
              }}
            />

            <TBButton onPress={handleSubmit as any} title="Save" />
            <TBButton onPress={handleDelete as any} title="Delete" />
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

export default EditStepForm;