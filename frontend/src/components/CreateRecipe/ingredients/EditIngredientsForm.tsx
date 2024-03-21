import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Pressable, Modal } from "react-native";
import * as yup from 'yup';
import { Formik, Form, Field } from 'formik';
import ValidatedInput from '../../ValidatedInput';
import TBButton from '../../TBButton';
import PopUpMenu from '../../PopUpMenu';
import { measurements } from "./AddIngredientForm";
import { Dropdown } from 'react-native-element-dropdown';

export interface Ingredient {
  title: string,
  amount: number
  unit: string
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
  const [unit, setUnit] = React.useState(ingredient.unit);
  
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
          editIngredient({...values, unit: unit});
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

            <View style={styles.amountBar}>
              <ValidatedInput
                style={styles.amountInput}
                placeholder="Amount"
                onChangeText={handleChange('amount')}
                onBlur={handleBlur('amount')}
                value={values.amount}
                error={errors.amount}
              />
              <Dropdown
                style={styles.amountUnit}
                data={measurements}
                maxHeight={300}
                labelField="label"
                valueField="value"
                value={ingredient.unit}
                onChange={item => {
                  setUnit(item.value);
                }} />

            </View>

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
  },
  amountBar: {
    display: "flex",
    flexDirection: "row",
    width: "95%",
    alignSelf: "center"
  },
  amountInput: {
    flexGrow: 2,
    marginLeft: 0,
    width: "auto"
  },
  amountUnit: {
    flexGrow: 1,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    alignSelf: "center",
    height: 50
  }

})

export default EditIngredientForm;