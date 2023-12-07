import React from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, ScrollView, Image } from "react-native";
import * as yup from 'yup';
import { Formik, Form, Field } from 'formik';
import ValidatedInput from '../components/ValidatedInput';
import AddIngredientForm, { Ingredient } from '../components/CreateRecipe/ingredients/AddIngredientForm';
import TBButton from '../components/TBButton';
import * as ImagePicker from 'expo-image-picker';
import { TouchableRipple } from 'react-native-paper';
import IngredientListItem from '../components/CreateRecipe/ingredients/IngredientListItem';
import EditIngredientForm from '../components/CreateRecipe/ingredients/EditIngredientsForm';
import AddTagForm, { Tag } from '../components/CreateRecipe/tags/AddTagForm';
import EditTagForm from '../components/CreateRecipe/tags/EditTagForm';
import TagListItem from '../components/CreateRecipe/tags/TagListItem';
import BackButton from '../components/BackButton';
import { UserContext } from '../providers/UserProvider';


const CreateRecipePage = ({ route, navigation }: any) => {
  const { pickedImage } = route.params;  
  const userContext = React.useContext(UserContext) as any;

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

  // add Ingredient Modal
  const [ingredients, setIngredients]: [Ingredient[], any] = React.useState([]);
  const [ingredientsModalVisible, setIngredientsModalVisible] = React.useState(false);

  // edit Ingredient Modal
  const [editIngredientsModalVisible, setEditIngredientsModalVisible] = React.useState(false);
  const [ingredientEditIndex, setIngredientEditIndex] = React.useState(0); // the index of the ingredient we are editing

  // add tag Modal
  const [tags, setTags]: [Tag[], any] = React.useState([]);
  const [tagModalVisible, setTagModalVisible] = React.useState(false);

  // edit tag Modal
  const [editTagModalVisible, setEditTagModalVisible] = React.useState(false);
  const [tagEditIndex, setTagEditIndex] = React.useState(0); // the index of the tag we are editing

  const [image, setImage] = React.useState(pickedImage.uri);


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

  //ingredients
  const addIngredient = (ingredient: Ingredient) => {
    setIngredients(ingredients.concat([ingredient]));
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

  const openEditIngredientForm = (index: number) => {
    setIngredientEditIndex(index);
    setEditIngredientsModalVisible(true);
  }

  //tags
  const addTag = (tag: Tag) => {
    setTags(tags.concat([tag]));
  }

  const editTag = (index: number, tag: Tag) => {
    let toEdit = [...tags];
    toEdit[index] = tag;
    setTags(toEdit);
  };

  const deleteTag = (index: number) => {
    let toEdit = [...tags];
    toEdit.splice(index, 1);
    setTags(toEdit);
  }

  const openEditTagForm = (index: number) => {
    setTagEditIndex(index);
    setEditTagModalVisible(true);
  }

  const onSubmit = async (data: any) => {
    let imageUrl;
    let s3AccessUrl;
    let s3Response;
    //const username = "";
    try {
      s3AccessUrl = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"}/recipe/s3Url`, {  //get secure s3 access url 
        method: 'GET',
      }).then(res => res.json());
    } catch (error: any) {
      console.log("image link generation error")
      console.log(error)
    }
    //console.log("context username: " +userContext.state.username)
    console.log(s3AccessUrl)
    console.log(s3AccessUrl.imageURL)
    if (s3AccessUrl) {
      try {
        s3Response = await fetch(s3AccessUrl.imageURL, {  //put the image on the bucket
          method: 'PUT',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: image
        });

        if(s3Response.status !== 200){
          console.log("s3Response, s3 error")
        } else {
          console.log("s3Response")
        }
        
        console.log(s3Response)
        imageUrl = s3AccessUrl.imageURL.split('?')[0];
      } catch (error: any) {
        console.log("image put failed")
        console.log(error)
      }
    } else {
      console.log("imageURL is null")
    }


    try {
      let response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"}/recipe/save`, {  //save the recipe
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: userContext.state.username,
          title: data.title,
          description: data.description,
          instructions: data.instructions,
          cookTime: data.cookTime,
          calories: data.calories,
          servings: data.servings,
          ingredients: ingredients,
          tags: tags,
          image: imageUrl
        }),
      });

      if (response.status !== 200) {
        console.log("upload failed")
        console.log(response)
      } else {
        console.log("upload successful")
        console.log(ingredients)
      }
    } catch (error: any) {
      console.log("upload error")
      console.error(error.stack);
    }
  };


  return (
    <>
      <AddIngredientForm
        visible={ingredientsModalVisible}
        setVisible={setIngredientsModalVisible}
        addIngredients={addIngredient}
      />
      <EditIngredientForm
        visible={editIngredientsModalVisible}
        setVisible={setEditIngredientsModalVisible}
        ingredient={ingredients[ingredientEditIndex] || { title: "", amount: "" }}
        editIngredient={(ingredient: Ingredient) => { editIngredient(ingredientEditIndex, ingredient) }}
        deleteIngredient={() => { deleteIngredient(ingredientEditIndex) }}
      />

      <AddTagForm
        visible={tagModalVisible}
        setVisible={setTagModalVisible}
        addTag={addTag}
      />
      <EditTagForm
        visible={editTagModalVisible}
        setVisible={setEditTagModalVisible}
        tag={tags[tagEditIndex] || { value: "" }}
        editTag={(tag: Tag) => { editTag(tagEditIndex, tag) }}
        deleteTag={() => { deleteTag(tagEditIndex) }}
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
        onSubmit={(values) => {
          onSubmit(values)
        }}>

        {({ errors, handleChange, handleBlur, handleSubmit, values }) => (
          <>
            <View style={styles.headerWrapper}>
                <View style={styles.headerLeftWrapper}>
                    <View><BackButton navigation = {navigation}/></View>
                    <View style={styles.headerTiltleWrapper}><Text style={styles.headerTiltle}>Create Recipe {`<_<`}</Text></View>
                </View>
                <View>
                    <TBButton title="post" style={styles.postButton} textColor={{ color: "white" }} onPress={handleSubmit} />
                </View>
            </View>
            <KeyboardAvoidingView
                behavior='position'
                keyboardVerticalOffset = {40}
            >
            <ScrollView>

              <Text style={styles.header}>Image*</Text>
              <TouchableRipple onPress={pickImage} borderless={true} style={styles.image}>
                <Image source={image ? { uri: image } : require("../../assets/no-image.png") as any} style={{ width: "100%", height: "100%" }} />
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
              <View style={styles.multiContainer}>
                {ingredients.map((ingredient, index) => {
                  return (<IngredientListItem onPress={() => { openEditIngredientForm(index) }} ingredient={ingredient} key={index} />);
                })}
                <TBButton style={styles.addButton} onPress={() => setIngredientsModalVisible(true)} title="+" />
              </View>

              <Text style={styles.header}>Tags</Text>
              <View style={styles.multiContainer}>
                {tags.map((tag, index) => {
                  return (<TagListItem onPress={() => { openEditTagForm(index) }} tag={tag} key={index} />);
                })}
                <TBButton style={styles.addButton} onPress={() => setTagModalVisible(true)} title="+" />
              </View>
            </ScrollView>
            </KeyboardAvoidingView>
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
  postButton: {
    flex: 1,
    flexGrow: 1,
    height: 40,
    backgroundColor: "#6752EC",
    color: "white",
    borderWidth: 0,
},
headerWrapper:{
    alignItems: 'center',
    display: 'flex',
    flexDirection:"row",
    justifyContent:"space-between",
    paddingHorizontal: 12,
},
headerLeftWrapper:{
    alignItems: 'center',
    display: 'flex',
    flexDirection:"row",
},
headerTiltleWrapper:{
    marginLeft: 15
},
headerTiltle:{
    color:"#000",
    fontSize: 20,
    fontWeight: "700",
},
  image: {
    width: "95%",
    height: 300,
    alignSelf: "center",
    marginBottom: 10,
    borderRadius: 10
  },
  addButton: {
    backgroundColor: "white",
    borderRadius: 10,
    margin: 10,
    borderWidth: 0
  },
  multiContainer: {
    backgroundColor: "#f6f6f6",
    borderRadius: 10,
    margin: 5
  }
})
export default CreateRecipePage;