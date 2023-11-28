import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Pressable, Modal } from "react-native";
import * as yup from 'yup';
import { Formik, Form, Field } from 'formik';
import ValidatedInput from '../components/validatedInput';
import AddIngredientsForm, { Ingredient } from '../components/CreateRecipe/addIngredientForm';
import TBButton from '../components/TBButton';

const SignUpPage = () => {

  // define validation rules for each field
  const recipeSchema = yup.object().shape({
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
  const [ingredients, setIngredients]: [Ingredient[], any] = React.useState([]);
  const [ingredientsModalVisible, setIngredientsModalVisible] = React.useState(false);

  const addIngredients = (ingredient: Ingredient) => {
    setIngredients(ingredients.concat([ingredient]))

    console.log(ingredients)
  }

  return (
    <>
      <AddIngredientsForm
        visible={ingredientsModalVisible}
        setVisible={setIngredientsModalVisible}
        addIngredients={addIngredients}
      />


      <Formik
        initialValues={{
          title: '',
          description: '',
          cookTime: '',
          calories: '',
          servings: ''
        }}

        validationSchema={recipeSchema}
        onSubmit={values => {
          // same shape as initial values
          console.log(values);
        }}>

        {({ errors, handleChange, handleBlur, handleSubmit, values }) => (
          <View style = {{width: "100%"}}>

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
    
            {ingredients.map((ingredient) => {
              return(<Text>{ingredient.title}</Text>);
            })}          

            <TBButton onPress={() => setIngredientsModalVisible(true)} title="Add Ingredients" />


            <TBButton onPress={onSubmit} title="Submit" />
          </View>
        )}
      </Formik>
    </>);
}

const onSubmit = () => {

}

const styles = StyleSheet.create({
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
  }
})
export default SignUpPage;