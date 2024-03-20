import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  Image,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { TouchableRipple } from "react-native-paper";
import BackButton from "../components/BackButton";
import TBButton from "../components/TBButton";
import { Formik } from "formik";
import getBase64 from "../functions/GetBase64FromURI";
import { UserContext } from "../providers/UserProvider";
import { Buffer } from "buffer";
import { LoadingContext } from "../providers/LoadingProvider";
import {
  putImage,
  saveProfilePicture,
  saveProfileDescription,
  getUserDetails,
} from "../functions/HTTPRequests";
import ValidatedInput from "../components/ValidatedInput";

const SettingsPage = ({ navigation }: any) => {
  const [profilePic, setProfilePic] = React.useState<any>(null);
  const [profilePicURI, setProfilePicURI] = React.useState<any>(null);
  const [profileDescription, setProfileDescription] =
    React.useState<string>("");

  const userContext = React.useContext(UserContext) as any;
  const loadingContext = React.useContext(LoadingContext) as any;

  useEffect(() => {
    async function setUserDetails() {
      let i = await getUserDetails(userContext.state.userId);
      setProfileDescription(i.description);
      setProfilePicURI(i.profilePic);
    }
    setUserDetails();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      let i = result.assets[0] as any;
      setProfilePic(i);
      setProfilePicURI(i.uri);
    }
  };

  return (
    <View style={styles.container}>
      <Formik
        key={profileDescription}
        initialValues={{
          description: profileDescription,
        }}
        onSubmit={async (data: any) => {
          loadingContext.enable();

          try {
            if (profilePic) {
              if (!profilePic.base64) {
                profilePic.base64 = await getBase64(profilePic.uri);
              }
              const buf = Buffer.from(profilePic.base64, "base64");
              let type = profilePic.uri.substring(
                profilePic.uri.lastIndexOf(".") + 1,
                profilePic.uri.length
              );

              let imageUrl = await putImage(buf, type);
              await saveProfilePicture(userContext.state.username, imageUrl);
            }

            await saveProfileDescription(
              userContext.state.username,
              data.description
            );

            console.log("Save Profile Picture successful");
            navigation.navigate("AccountPage");
          } catch (error: any) {
            console.error("Error saving profile picture");
            console.error(error);
            Alert.alert("Error saving profile picture");
          } finally {
            loadingContext.disable();
          }
        }}
      >
        {({ errors, handleChange, handleBlur, handleSubmit, values }) => (
          <>
            <View style={styles.headerWrapper}>
              <View style={styles.headerLeftWrapper}>
                <BackButton navigation={navigation} />
                <View style={styles.headerTiltleWrapper}>
                  <Text style={styles.headerTiltle}>Settings {`:)`}</Text>
                </View>
              </View>
              <View>
                <TBButton
                  title="save"
                  style={styles.saveButton}
                  textColor={{ color: "white" }}
                  onPress={handleSubmit}
                />
              </View>
            </View>
            <ScrollView>
              <View>
                <View style={styles.imageUpdateContainer}>
                  <TouchableRipple
                    onPress={pickImage}
                    borderless={true}
                    style={styles.image}
                  >
                    <Image
                      source={{ uri: profilePicURI }}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </TouchableRipple>
                  <TouchableOpacity onPress={pickImage}>
                    <Text style={styles.imageButton}>Select Image</Text>
                  </TouchableOpacity>
                </View>
                <KeyboardAvoidingView
                  behavior="position"
                  enabled={Platform.OS === "ios"}
                  keyboardVerticalOffset={40}
                >
                  <View style={{ marginVertical: 15 }}>
                    <Text style={styles.header}>Profile Bio</Text>
                    <ValidatedInput
                      onChangeText={handleChange("description")}
                      onBlur={handleBlur("description")}
                      value={values.description}
                      error={errors.description}
                      multiline={true}
                      maxLength={95}
                      style={{
                        height: "auto",
                        textAlignVertical: "top",
                      }}
                    />
                  </View>
                </KeyboardAvoidingView>

                <TBButton
                  style={styles.logoutButton}
                  onPress={() => {
                    navigation.navigate("DietaryPreference");
                  }}
                  title="Dietary Preferences"
                ></TBButton>
                <TBButton
                  style={styles.logoutButton}
                  onPress={userContext.logout}
                  title="Logout"
                />
              </View>
            </ScrollView>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  header: {
    fontSize: 20,
    marginLeft: 10,
    fontWeight: "bold",
  },
  logoutButton: {
    marginVertical: 15,
  },
  dietButton: {
    marginVertical: 15,
    backgroundColor: "#8CC84B", // Light green color
    paddingVertical: 10,
    alignSelf: "center",
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 0,
  },
  dietButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imageUpdateContainer: {
    alignSelf: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: "#8CC84B",
  },
  imageButton: {
    height: 40,
    color: "#8CC84B",
    alignSelf: "center",
    fontSize: 20,
    lineHeight: 19,
    fontWeight: "600",
    padding: 5,
  },
  headerWrapper: {
    alignItems: "center",
    height: 60,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  headerLeftWrapper: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
  },
  headerTiltleWrapper: {
    marginLeft: 15,
  },
  headerTiltle: {
    color: "#000",
    fontSize: 20,
    fontWeight: "700",
  },
  saveButton: {
    height: 40,
    backgroundColor: "#8CC84B",
    borderWidth: 0,
  },
});

export default SettingsPage;
