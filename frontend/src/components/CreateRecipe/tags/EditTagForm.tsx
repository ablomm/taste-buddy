import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Pressable, Modal } from "react-native";
import * as yup from 'yup';
import { Formik, Form, Field } from 'formik';
import ValidatedInput from '../../ValidatedInput';
import TBButton from '../../TBButton';
import PopUpMenu from '../../PopUpMenu';

export interface Tag {
  value: string
}


// define validation rules for each field
const tagSchema = yup.object().shape({
  value: yup
    .string()
    .required("required"),
});


const EditTagForm = ({ visible, setVisible, tag, editTag, deleteTag }: any) => {
  const handleDelete = () => {
    deleteTag();
    setVisible(false);
  }
  return (
    <PopUpMenu
      visible={visible}
      setVisible={setVisible}
    >
      <Formik
        initialValues={{
          value: tag.value,
        }}

        validationSchema={tagSchema}
        onSubmit={values => {
          editTag(values);
          setVisible(false);
        }}>

        {({ errors, handleChange, handleBlur, handleSubmit, values }) => (

          <>
            <Text style={styles.header}>Edit Ingredient</Text>

            <ValidatedInput
              placeholder="Value"
              onChangeText={handleChange('value')}
              onBlur={handleBlur('value')}
              value={values.value}
              error={errors.value}
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

export default EditTagForm;