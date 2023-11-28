import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Pressable, Modal, ScrollView } from "react-native";
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
    instructions: yup
      .string()
      .required(),
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
          instructions: '',
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
          <>
            <View style={styles.titleBar}>
              <Text style={styles.title}>Create Recipe</Text>
              <TBButton title="Post" style={styles.submitButton} textColor={{ color: "white" }} onPress={handleSubmit} />
            </View>
            <ScrollView>

              <Text style={styles.header}>Title*</Text>
              <ValidatedInput
                placeholder='Taco Salad'
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                value={values.title}
                error={errors.title}
              />


              <Text style={styles.header}>Instructions*</Text>
              <ValidatedInput
                placeholder={"Step 1:\n\tCook the meat.\n\nStep 2:\n\tCut the lettuce.\n\nStep 3:\n\tPut the meat in the lettuce."}
                onChangeText={handleChange('instructions')}
                onBlur={handleBlur('instructions')}
                value={values.instructions}
                error={errors.instructions}
                multiline={true}
                style={{
                  height: "auto",
                  textAlignVertical: 'top',
                }}
              />

              <Text style={styles.header}>Description</Text>
              <ValidatedInput
                placeholder='A simple taco salad recipe passed down by my grandmother; it is very good, and very easy.'
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
                error={errors.description}
                multiline={true}
                style={{
                  height: "auto",
                  textAlignVertical: 'top',
                }}
              />

              <Text style={styles.header}>Cook Time (min)</Text>
              <ValidatedInput
                placeholder='60'
                onChangeText={handleChange('cookTime')}
                onBlur={handleBlur('cookTime')}
                value={values.cookTime}
                error={errors.cookTime}
              />

              <Text style={styles.header}>Calories</Text>
              <ValidatedInput
                placeholder="1000"
                onChangeText={handleChange('calories')}
                onBlur={handleBlur('calories')}
                value={values.calories}
                error={errors.calories}
              />

              <Text style={styles.header}>Servings</Text>
              <ValidatedInput
                placeholder="4"
                onChangeText={handleChange('servings')}
                onBlur={handleBlur('servings')}
                value={values.servings}
                error={errors.servings}
              />


              {ingredients.map((ingredient) => {
                return (<Text>{ingredient.title}</Text>);
              })}

              <TBButton onPress={() => setIngredientsModalVisible(true)} title="Add Ingredients" />

            </ScrollView>
          </>
        )}
      </Formik>
    </>);
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    marginLeft: 10,
    fontWeight: "bold"
  },
  title: {
    fontSize: 35,
    marginLeft: 10,
    margin: 'auto', // dunno
    fontWeight: "bold"
  },
  titleBar: {
    display: "flex",
    flexDirection: "row"
  },
  submitButton: {
    flex: 1,
    flexGrow: 1,
    height: 40,
    backgroundColor: "#4077be",
    color: "white",
    borderWidth: 0
  }
})
export default SignUpPage;