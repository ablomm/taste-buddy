import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Image, Platform, Alert } from "react-native";
import * as yup from 'yup';
import { Formik} from 'formik';
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
import AddStepForm, { Step } from '../components/CreateRecipe/steps/AddStepForm';
import EditStepForm from '../components/CreateRecipe/steps/EditStepForm';
import StepListItem from '../components/CreateRecipe/steps/StepListItem';
import { Buffer } from 'buffer';
import getBase64 from '../functions/GetBase64FromURI';
import { LoadingContext } from '../providers/LoadingProvider';
import { putImage, saveRecipe } from '../functions/HTTPRequests';

const CreateRecipePage = ({ route, navigation }: any) => {
  const { pickedImage } = route.params;
  const userContext = React.useContext(UserContext) as any;
  const loadingContext = React.useContext(LoadingContext) as any;

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

  // add step Modal
  const [steps, setSteps]: [Step[], any] = React.useState([]);
  const [stepModalVisible, setStepModalVisible] = React.useState(false);

  // edit step Modal
  const [editStepModalVisible, setEditStepModalVisible] = React.useState(false);
  const [stepEditIndex, setStepEditIndex] = React.useState(0); // the index of the step we are editing

  const [image, setImage] = React.useState(pickedImage ? pickedImage : null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0] as any);
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

  //steps
  const addStep = (step: Step) => {
    setSteps(steps.concat([step]));
  }

  const editStep = (index: number, step: Step) => {
    let toEdit = [...steps];
    toEdit[index] = step;
    setSteps(toEdit);
  };

  const deleteStep = (index: number) => {
    let toEdit = [...steps];
    toEdit.splice(index, 1);
    setSteps(toEdit);
  }

  const openEditStepForm = (index: number) => {
    setStepEditIndex(index);
    setEditStepModalVisible(true);
  }

  const onSubmit = async (data: any) => {
    loadingContext.enable();

    try {
      if (!image.base64) {
        image.base64 = await getBase64(image.uri);
      }
      const buf = Buffer.from(image.base64, 'base64') //isolate the base64 buffer
      let type = image.uri.substring(image.uri.lastIndexOf('.') + 1, image.uri.length);
      let imageUrl = await putImage(buf, type)

      navigation.navigate('GalleryPage')
      
      await saveRecipe(
        userContext.state.username,
        data.title,
        data.description,
        steps,
        data.cookTime,
        data.calories,
        data.servings,
        ingredients,
        tags,
        imageUrl
      );

      console.log("upload successful")
      navigation.navigate('AccountPage');

    } catch (error: any) {
      console.error("Error saving recipe");
      console.error(error);
      Alert.alert("Error saving recipe")
      
    } finally {
      loadingContext.disable();
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

      <AddStepForm
        visible={stepModalVisible}
        setVisible={setStepModalVisible}
        addItem={addStep}
      />
      <EditStepForm
        visible={editStepModalVisible}
        setVisible={setEditStepModalVisible}
        item={steps[stepEditIndex] || { step: "" }}
        editItem={(step: Step) => { editStep(stepEditIndex, step) }}
        deleteItem={() => { deleteStep(stepEditIndex) }}
      />


      <Formik
        initialValues={{
          image: null,
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
                <BackButton navigation={navigation} />
                <View style={styles.headerTiltleWrapper}><Text style={styles.headerTiltle}>Create Recipe {`<_<`}</Text></View>
              </View>
              <View>
                <TBButton title="post" style={styles.postButton} textColor={{ color: "white" }} onPress={handleSubmit} />
              </View>
            </View>
            <KeyboardAvoidingView
              style={styles.avoidingView}
              behavior='position'
              enabled={Platform.OS === "ios"}
              keyboardVerticalOffset={40}
            >
              <ScrollView>

                <Text style={styles.header}>Image*</Text>
                <TouchableRipple onPress={pickImage} borderless={true} style={styles.image}>
                  <Image source={image ? { uri: image.uri } : require("../../assets/no-image.png") as any} style={{ width: "100%", height: "100%" }} />
                </TouchableRipple>

                <Text style={styles.header}>Title*</Text>
                <ValidatedInput
                  placeholder='Taco Salad'
                  onChangeText={handleChange('title')}
                  onBlur={handleBlur('title')}
                  value={values.title}
                  error={errors.title}
                />

                <Text style={styles.header}>Ingredients</Text>
                <View style={styles.multiContainer}>
                  {ingredients.map((ingredient, index) => {
                    return (<IngredientListItem onPress={() => { openEditIngredientForm(index) }} ingredient={ingredient} key={index} />);
                  })}
                  <TBButton style={styles.addButton} onPress={() => setIngredientsModalVisible(true)} title="+" />
                </View>

                <Text style={styles.header}>Instructions</Text>
                <View style={styles.multiContainer}>
                  {steps.map((step, index) => {
                    return (<StepListItem onPress={() => { openEditStepForm(index) }} item={step} index={index} key={index} />);
                  })}
                  <TBButton style={styles.addButton} onPress={() => setStepModalVisible(true)} title="+" />
                </View>

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
    backgroundColor: "#8CC84B",
    color: "white",
    borderWidth: 0,
  },
  headerWrapper: {
    alignItems: 'center',
    height: 60,
    backgroundColor: "white",
    display: 'flex',
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  headerLeftWrapper: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: "row",
  },
  headerTiltleWrapper: {
    marginLeft: 15
  },
  headerTiltle: {
    color: "#000",
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
  },
  avoidingView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
})
export default CreateRecipePage;