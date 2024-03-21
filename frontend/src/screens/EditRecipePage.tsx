import React, {useEffect} from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, Alert } from "react-native";
import * as yup from 'yup';
import { Formik } from 'formik';
import ValidatedInput from '../components/ValidatedInput';
import AddIngredientForm, { Ingredient } from '../components/CreateRecipe/ingredients/AddIngredientForm';
import TBButton from '../components/TBButton';
import IngredientListItem from '../components/CreateRecipe/ingredients/IngredientListItem';
import EditIngredientForm from '../components/CreateRecipe/ingredients/EditIngredientsForm';
import BackButton from '../components/BackButton';
import { UserContext } from '../providers/UserProvider';
import AddStepForm, { Step } from '../components/CreateRecipe/steps/AddStepForm';
import EditStepForm from '../components/CreateRecipe/steps/EditStepForm';
import StepListItem from '../components/CreateRecipe/steps/StepListItem';
import {Recipe} from "../interfaces/RecipeInterface";
import { LoadingContext } from '../providers/LoadingProvider';


const EditRecipePage = ({ route, navigation }: any) => {
    const { recipe } = route.params;
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

    // add step Modal
    const [steps, setSteps]: [Step[], any] = React.useState([]);
    const [stepModalVisible, setStepModalVisible] = React.useState(false);

    // edit step Modal
    const [editStepModalVisible, setEditStepModalVisible] = React.useState(false);
    const [stepEditIndex, setStepEditIndex] = React.useState(0); // the index of the step we are editing

    const cookTime: string = (recipe.cookTimeHours*60 + recipe.cootTimeMinutes).toString();

    useEffect(() => {
        setPreExistingSteps();
        setPreExistingIngredients();
        console.log(recipe);
    }, []);

    function setPreExistingSteps() {
        let instructionArray: any[] = [];

        recipe.instructions.forEach(item => {
            console.log(item);
            instructionArray.push({step: item.instruction})
        });

        setSteps(instructionArray);
    }

    function setPreExistingIngredients() {
        let ingredientArray: Ingredient[] = [];

        recipe.ingredients.forEach(item => {
            console.log(item);
            ingredientArray.push({
                title: item.ingredient,
                amount: item.amount,
                unit: item.measurementType
            });
        });

        setIngredients(ingredientArray);
    }

    function assembleIngredientRecipe() {
        let ingredientArray: any = [];

        ingredients.forEach(item => {
            ingredientArray.push({
                recipeID: recipe.id,
                ingredient: item.title,
                amount: item.amount,
                measurementType: item.unit
            });
        });

        return ingredientArray;
    }

    function assembleInstructionsRecipe() {
        let instructionArray: any[] = [];

        steps.forEach((item, index) => {
            instructionArray.push({
                recipeID: recipe.id,
                step: index + 1,
                instruction: item.step
            })
        });

        return instructionArray;
    }

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
        const editedRecipe = {
            username: userContext.state.username,
            recipeId: recipe.id,
            title: data.title,
            description: data.description,
            instructions: steps,
            cookTime: data.cookTime,
            calories: data.calories,
            servings: data.servings,
            ingredients: ingredients,
            image: data.image
        };

        const newAssembledRecipe: Recipe = {
            id: recipe.id,
            authorID: recipe.authorID,
            creationTime: recipe.creationTime,
            recipeTitle: data.title,
            description: data.description,
            cookTimeHours: Math.floor(data.cookTime / 60),
            cootTimeMinutes: data.cookTime % 60,
            calories: data.calories,
            servings: data.servings,
            recipeImage: recipe.recipeImage,
            averageRating: recipe.averageRating,
            ingredients: assembleIngredientRecipe(),
            instructions: assembleInstructionsRecipe(),
            tags: data.tags
        };

        loadingContext.enable();
        try {
            let response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"}/recipe/edit-recipe`, {  //save the recipe
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(editedRecipe),
            });

            if (response.status !== 200) {
                console.log("Edit failed");
                console.log(response);
            } else {
                console.log("Edit successful");
                navigation.navigate('RecipePage', {recipe: newAssembledRecipe});
            }
        } catch (error: any) {
            console.error(error.stack);
            Alert.alert("Error saving");
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
                    image: recipe.recipeImage,
                    title: recipe.recipeTitle,
                    description: recipe.description,
                    instructions: recipe.instructions,
                    cookTime: cookTime,
                    calories: recipe.calories.toString(),
                    servings: recipe.servings.toString()
                }}

                validationSchema={recipeSchema}
                onSubmit={(values) => {
                    onSubmit(values)
                }}>

                {({ errors, handleChange, handleBlur, handleSubmit, values }) => (
                    <>
                        <View style={styles.headerWrapper}>
                            <View style={styles.headerLeftWrapper}>
                                <View><BackButton navigation={navigation} /></View>
                                <View style={styles.headerTiltleWrapper}><Text style={styles.headerTiltle}>Edit Recipe</Text></View>
                            </View>
                            <View>
                                <TBButton title="Save Changes" style={styles.postButton} textColor={{ color: "white" }} onPress={handleSubmit} />
                            </View>
                        </View>
                        <KeyboardAvoidingView
                            style={styles.avoidingView}
                            behavior='position'
                            enabled={Platform.OS === "ios"}
                            keyboardVerticalOffset={40}
                        >
                            <ScrollView>

                                <Text style={styles.header}>Title*</Text>
                                <ValidatedInput
                                    placeholder={'Taco Salad'}
                                    onChangeText={handleChange('title')}
                                    onBlur={handleBlur('title')}
                                    value={values.title}
                                    error={errors.title}
                                />

                                <Text style={styles.header}>Instructions*</Text>
                                <View style={styles.multiContainer}>
                                    {steps.map((step, index) => {
                                        return (<StepListItem onPress={() => { openEditStepForm(index) }} item={step} index={index} key={index} />);
                                    })}
                                    <TBButton style={styles.addButton} onPress={() => setStepModalVisible(true)} title="+" />
                                </View>

                                <Text style={styles.header}>Description</Text>
                                <ValidatedInput
                                    placeholder={'A simple taco salad recipe passed down by my grandmother; it is very good, and very easy.'}
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
                                    placeholder='1000'
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
    }
})
export default EditRecipePage;
