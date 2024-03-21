import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Pressable, Modal } from "react-native";
import * as yup from 'yup';
import { Formik, Form, Field } from 'formik';
import ValidatedInput from '../../ValidatedInput';
import TBButton from '../../TBButton';
import PopUpMenu from '../../PopUpMenu';

export interface Step {
  step: string,
}


// define validation rules for each field
const schema = yup.object().shape({
  step: yup
    .string()
    .required("required"),
});


const AddStepForm = ({ visible, setVisible, addItem }: any) => {
  return (
    <PopUpMenu
      visible={visible}
      setVisible={setVisible}
    >
      <Formik
        initialValues={{
          step: '',
        }}

        validationSchema={schema}
        onSubmit={values => {
          addItem(values);
          setVisible(false);
        }}>

        {({ errors, handleChange, handleBlur, handleSubmit, values }) => (

          <>
            <Text style={styles.header}>Add Step</Text>

            <ValidatedInput
              placeholder="place the meat inside the pan and put the burner on medium."
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

export default AddStepForm;