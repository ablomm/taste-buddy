import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, KeyboardAvoidingView, Platform } from "react-native";
import * as yup from 'yup';
import { Formik } from 'formik';
import BackButton from '../components/BackButton';
import ValidatedInput from '../components/ValidatedInput';
import TBButton from '../components/TBButton';
import * as ImagePicker from 'expo-image-picker';
import { TouchableRipple } from 'react-native-paper';
import AddTagForm, { Tag } from '../components/CreateRecipe/tags/AddTagForm';
import EditTagForm from '../components/CreateRecipe/tags/EditTagForm';
import TagListItem from '../components/CreateRecipe/tags/TagListItem';
import { UserContext } from "../providers/UserProvider";
import { Buffer } from 'buffer';

const CreatePostPage = ({ route, navigation }: any) => {
  const { pickedImage } = route.params;
  const userContext = React.useContext(UserContext) as any;
  // define validation rules for each field
  const recipeSchema = yup.object().shape({
    description: yup
      .string()
      .optional(),
    recipeUrl: yup
      .string()
      .matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        'Enter correct url!')
      .optional(),

  });

  // add tag Modal
  const [tags, setTags]: [Tag[], any] = React.useState([]);
  const [tagModalVisible, setTagModalVisible] = React.useState(false);

  // edit tag Modal
  const [editTagModalVisible, setEditTagModalVisible] = React.useState(false);
  const [tagEditIndex, setTagEditIndex] = React.useState(0); // the index of the tag we are editing

  const [image, setImage] = React.useState<any>(pickedImage ? pickedImage : null);

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

  return (
    <>
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
          description: '',
          recipeUrl: '',
        }}

        validationSchema={recipeSchema}
        onSubmit={async values => {
          console.log(values);
          let imageUrl: string = "";
          let s3AccessUrl: any;
          let s3Response: any;

          try {
            s3AccessUrl = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"}/post/s3Url`, {  //get secure s3 access url
              method: 'GET',
            }).then(res => res.json());
          } catch (error: any) {
            console.log("image link generation error")
            console.log(error)
          }

          if (s3AccessUrl) {
            const buf = Buffer.from(image.base64, 'base64') //isolate the base64 buffer
            let type = image.uri.substring(image.uri.lastIndexOf('.') + 1, image.uri.length);

            try {
              s3Response = await fetch(s3AccessUrl.imageURL[0], {  //put the image on the bucket
                method: 'PUT',
                headers: {
                  'ContentEncoding': 'base64',
                  'Content-Type': `image/${type}`,
                },
                body: buf
              });

              if (s3Response.status !== 200) {
                console.log("s3Response, s3 error")
                console.log(s3Response);
              } else {
                imageUrl = s3AccessUrl.imageURL[0].split('?')[0];
                console.log("uploaded image url: " + imageUrl);
              }
            } catch (error: any) {
              console.log("image put failed")
              console.log(error)
            }
          } else {
            console.log("imageURL is null")
          }

          try {
            // Save the post
            let response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"}/post/create`, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                username: userContext.state.username,
                description: values.description,
                tags: tags,
                image: imageUrl,
                recipeURL: values.recipeUrl
              }),
            });

            if (response.status !== 200) {
              console.log("upload failed")
              console.log(response)
            } else {
              console.log("upload successful")
              console.log(values)
            }

            navigation.navigate('AccountPageStack');
          } catch (error: any) {
            console.log("upload error")
            console.error(error.stack);
          }
        }}>

        {({ errors, handleChange, handleBlur, handleSubmit, values }) => (
          <>
            <View style={styles.headerWrapper}>
              <View style={styles.headerLeftWrapper}>
                <View><BackButton navigation={navigation} /></View>
                <View style={styles.headerTiltleWrapper}><Text style={styles.headerTiltle}>Create Post {`<_<`}</Text></View>
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

                <Text style={styles.header}>Description</Text>
                <ValidatedInput
                  placeholder="Description..."
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

                <Text style={styles.header}>Tags</Text>
                <View style={styles.multiContainer}>
                  {tags.map((tag, index) => {
                    return (<TagListItem onPress={() => { openEditTagForm(index) }} tag={tag} key={index} />);
                  })}
                  <TBButton style={styles.addButton} onPress={() => setTagModalVisible(true)} title="+" />
                </View>

                <Text style={styles.header}>Recipe Link</Text>
                <ValidatedInput
                  placeholder="Recipe Link..."
                  onChangeText={handleChange('recipeUrl')}
                  onBlur={handleBlur('recipeUrl')}
                  value={values.recipeUrl}
                  error={errors.recipeUrl}
                  multiline={true}
                  style={{
                    height: "auto",
                    textAlignVertical: 'top',
                  }}
                />
              </ScrollView>
            </KeyboardAvoidingView>
          </>
        )}
      </Formik>
    </>);
}

const styles = StyleSheet.create({
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
  header: {
    fontSize: 20,
    marginLeft: 10,
    fontWeight: "bold"
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
export default CreatePostPage;
