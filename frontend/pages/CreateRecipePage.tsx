import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Pressable, Modal, ScrollView, Image } from "react-native";
import * as yup from 'yup';
import { Formik, Form, Field } from 'formik';
import ValidatedInput from '../components/validatedInput';
import AddIngredientsForm, { Ingredient } from '../components/CreateRecipe/addIngredientForm';
import TBButton from '../components/TBButton';
import * as ImagePicker from 'expo-image-picker';
import { TouchableRipple } from 'react-native-paper';
import IngredientListItem from '../components/CreateRecipe/IngredientListItem';
import EditIngredientForm from '../components/CreateRecipe/EditIngredientsForm';

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
      .required("required"),
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
  const [image, setImage] = React.useState(null);

  const [editIngredientsModalVisible, setEditIngredientsModalVisible] = React.useState(false);
  const [ingredientEdit, setIngredientEdit]: [Ingredient, any] = React.useState({title: "", amount: 0});
  const [ingredientEditIndex, setIngredientEditIndex] = React.useState(0);


  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri as any);
    }
  };

  const addIngredients = (ingredient: Ingredient) => {
    setIngredients(ingredients.concat([ingredient]))

    console.log(ingredients)
  };

  const editIngredient = (index: number, ingredient: Ingredient) => {
    let toEdit = [...ingredients];
    toEdit[index] = ingredient;
    setIngredients(toEdit);
  };

  const deleteIngredient = (index: number) => {
    let toEdit = [...ingredients];
    toEdit.splice(index, 1);
    setIngredients(toEdit);
  }

  const openEditingredientsForm = (index: number, ingredient: Ingredient) => {
    setIngredientEditIndex(index);
    setIngredientEdit(ingredient);
    setEditIngredientsModalVisible(true);

  }

  return (
    <>
      <AddIngredientsForm
        visible={ingredientsModalVisible}
        setVisible={setIngredientsModalVisible}
        addIngredients={addIngredients}
      />
       <EditIngredientForm
        visible={editIngredientsModalVisible}
        setVisible={setEditIngredientsModalVisible}
        ingredient = {ingredientEdit}
        editIngredient={(ingredient: Ingredient) => {editIngredient(ingredientEditIndex, ingredient)}}
        deleteIngredient={() => {deleteIngredient(ingredientEditIndex)}}
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

              <Text style={styles.header}>Image*</Text>
              <TouchableRipple onPress={pickImage} borderless={true} style={styles.image}>
                <Image source={image ? { uri: image } : require("../assets/no-image.png") as any} style={{ width: "100%", height: "100%" }} />
              </TouchableRipple>


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

              <Text style={styles.header}>Ingredients</Text>
              {ingredients.map((ingredient, index) => {
                return (<IngredientListItem onPress={() => {openEditingredientsForm(index, ingredient)}}  ingredient={ingredient} key = {index}/>);
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
    fontWeight: "bold"
  },
  titleBar: {
    alignItems: "center",
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
  },
  image: {
    width: "95%",
    height: 300,
    alignSelf: "center",
    marginBottom: 10,
    borderRadius: 10
  }
})
export default SignUpPage;