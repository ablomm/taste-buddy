import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Alert,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer, useNavigation, useFocusEffect } from "@react-navigation/native";
import { UserContext } from "../providers/UserProvider";
import Modal from "react-native-modal";
import { FontAwesome } from "@expo/vector-icons"; // or 'react-native-vector-icons/MaterialIcons'
import Icon from "react-native-vector-icons/FontAwesome";
import { getRecipesInFolder, getUserDetails } from "../functions/HTTPRequests";
import PostsGrid from "../components/PostsGrid";
import RecipeListItem from "../components/RecipeListItem";
import { LoadingContext } from "../providers/LoadingProvider";
import { TouchableRipple } from "react-native-paper";
const fallbackProfilePicture = require("../../assets/profile.jpg");
import LogoHeader from "../components/header/LogoHeader";

const Tab = createMaterialTopTabNavigator();

interface Post {
  id: number;
  content: string;
}

const RecentPostsScreen = ({
  posts,
  navigation,
  refreshFunction,
  refreshing,
  userRecipes,
}) => {
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refreshFunction} />
      }
      style={{ backgroundColor: "white" }}
    >
      <View style={styles.screen}>
        <PostsGrid posts={posts} navigation={navigation}></PostsGrid>
      </View>
    </ScrollView>
  );
};

interface SavedPostsScreenProps {
  id: number;
  content: string;
}

const SavedPostsScreen = ({
  savedPosts1,
  userFolders,
  refreshFunction,
  refreshing,
  navigation,
}) => {
  const [isModalVisible, setModalVisible] = useState(false); //for create folder button
  const [isModalVisible1, setModalVisible1] = useState(false); //for delete folder button
  const [isModalVisible2, setModalVisible2] = useState(true); //disable to show recipes in folder
  const [isModalVisible3, setModalVisible3] = useState(false); //enable to show recipes in folder

  const [recipesInFolder, setRecipesInFolder] = useState<any[]>([]);

  const [folderName, setFolderName] = useState("");

  const userContext = React.useContext(UserContext) as any;
  const username = userContext.state.username;
  const loadingContext = React.useContext(LoadingContext) as any;

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setFolderName(""); // Reset folderName when the modal is closed
  };
  const toggleModal1 = () => {
    setModalVisible1(!isModalVisible1);
  };

  const toggleModal2 = () => {
    setModalVisible2(!isModalVisible2);
  };

  const toggleModal3 = () => {
    setModalVisible3(!isModalVisible3);
  };

  const addFolder = async (folderName) => {
    try {
      let response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"
        }/user/create-folder/${username}}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            folderName: folderName,
          }),
        }
      );

      if (response.status !== 200) {
        console.error("folder creation unsuccessful");
      } else {
        console.log("folder creation successful");
      }
    } catch (error: any) {
      console.error(error.stack);
    }

    refreshFunction();

    toggleModal();
  };

  const deleteFolder = async (folderId) => {
    try {
      let response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"
        }/user/delete-folder/${username}}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            folderId: folderId,
          }),
        }
      );

      if (response.status !== 200) {
        console.error("folder deletion unsuccessful");
      } else {
        console.log("folder deletion successful");
      }
    } catch (error: any) {
      console.error(error.stack);
    }

    refreshFunction();

    toggleModal1();
  };

  const _getRecipesInFolder = async (folderName) => {
    loadingContext.enable();
    try {
      setRecipesInFolder(await getRecipesInFolder(username, folderName));
    } catch (error: any) {
      console.error(error.stack);
      Alert.alert("failure getting recipes");
    } finally {
      loadingContext.disable();
    }
    toggleModal2();
    toggleModal3();
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refreshFunction} />
      }
    >
      <View style={styles.screen}>
        <View style={{ display: isModalVisible3 ? "flex" : "none" }}>
          <TouchableOpacity
            onPress={() => {
              toggleModal2();
              toggleModal3();
            }}
          >
            <FontAwesome
              name="arrow-left"
              size={25}
              color="white"
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <View style={styles.postsContainer}>
            {recipesInFolder &&
              recipesInFolder.map((item) => (
                <RecipeListItem
                  key={item.id}
                  item={item}
                  navigation={navigation}
                />
              ))}

            {recipesInFolder.length === 0 && (
              <View style={styles.noRecipesText}>
                <Text>No recipes in folder</Text>
              </View>
            )}
          </View>
        </View>


        <View style={{ display: isModalVisible2 ? "flex" : "none" }}>
          <View style={styles.plusContainerContainer}>
            <TouchableRipple onPress={toggleModal} style={styles.plusContainer}>
              <FontAwesome
                name="plus"
                size={40}
                color="white"
                style={styles.plusIcon}
              />
            </TouchableRipple>
            <Modal
              isVisible={isModalVisible}
              style={styles.modalCenter}
              onBackdropPress={toggleModal}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Add New Folder</Text>
                <TextInput
                  style={styles.inputField}
                  placeholderTextColor="#808080" // Set placeholder text color
                  placeholder="Folder Name"
                  value={folderName}
                  onChangeText={(text) => setFolderName(text)}
                />
                <TouchableRipple
                  style={styles.addFolderButton}
                  onPress={() => addFolder(folderName)}
                >
                  <Text style={styles.addButtonLabel}>Add Folder</Text>
                </TouchableRipple>
              </View>
            </Modal>
          </View>
          <View style={styles.folderContainer}>
            {userFolders.map((folder) => {
              return (
                <TouchableRipple
                  style={styles.postContainer}
                  key={`${folder.id}-${Math.random()}`}
                  onPress={() => {
                    _getRecipesInFolder(folder.folderName);
                  }}
                  onLongPress={() => {
                    if (folder.id !== 1) {
                      toggleModal1();
                    }
                  }}
                >
                  <>
                    <View
                      key={`${folder.id}-${Math.random()}`}
                      style={styles.folders}
                    >
                      <Text
                        style={styles.addButtonLabel}
                        key={`${folder.id}-${Math.random()}`}
                      >
                        {folder.folderName}
                      </Text>
                    </View>
                    <Modal
                      isVisible={isModalVisible1}
                      style={styles.modalCenter}
                      onBackdropPress={toggleModal1}
                      key={`${folder.id}-${Math.random()}`}
                    >
                      <View
                        style={styles.modalContent}
                        key={`${folder.id}-${Math.random()}`}
                      >
                        <Text
                          style={styles.modalTitle}
                          key={`${folder.id}-${Math.random()}`}
                        >
                          Delete Folder?
                        </Text>
                        <View
                          style={styles.deleteContainer}
                          key={`${folder.id}-${Math.random()}`}
                        >
                          <TouchableRipple
                            style={styles.addFolderButton1}
                            key={`${folder.id}-${Math.random()}`}
                            onPress={() => {
                              deleteFolder(folder.id);
                            }}
                          >
                            <Text
                              style={styles.addButtonLabel}
                              key={`${folder.id}-${Math.random()}`}
                            >
                              Yes
                            </Text>
                          </TouchableRipple>
                          <TouchableRipple
                            style={styles.addFolderButton2}
                            key={`${folder.id}-${Math.random()}`}
                            onPress={() => toggleModal1()}
                          >
                            <Text style={styles.addButtonLabel}>No</Text>
                          </TouchableRipple>
                        </View>
                      </View>
                    </Modal>
                  </>
                </TouchableRipple>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const AccountPage = () => {
  const userContext = React.useContext(UserContext) as any;
  const username = userContext.state.username;

  const [posts, setPosts] = useState();
  const [userRecipes, setUserRecipes] = useState();
  const [savedPosts1, setSavedPosts] = useState();
  const [userFolders, setUserFolders] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [userDetails, setUserDetails] = useState({
    username: "Unknown",
    profilePic: "",
    description: "",
  });

  const navigation: any = useNavigation();

  const navigateToSettings = () => {
    // Navigate to the settings page
    navigation.navigate("SettingsPage");
  };

  const fetchUserData = async () => {
    setUserDetails(await getUserDetails(userContext.state.userId));
    try {
      //get posts
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"
        }/post/get-posts/${username}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      await response.json().then((result) => {
        setPosts(result);
      });
    } catch (error) {
      console.error(error);
    }

    try {
      //get posts
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"
        }/recipe/get-recipes-for-user/${username}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      await response.json().then((result) => {
        setUserRecipes(result);
      });
    } catch (error) {
      console.error(error);
    }

    try {
      //get folders
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"
        }/user/get-folders/${username}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      await response.json().then((result) => {
        let test = JSON.stringify(result);
        let test1 = JSON.parse(test).folder;

        setUserFolders(test1);
        //console.log("logFolders" + JSON.stringify(test1));
      });
    } catch (error) {
      console.error(error);
    }

    try {
      //get saved recipes
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"
        }/user/get-saved-recipes/${username}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      await response.json().then((result) => {
        let test = JSON.stringify(result);
        let test1 = JSON.parse(test).savedRecipes;

        setSavedPosts(test1);
        //console.log("logSavedRecipes" + JSON.stringify(test1));
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchUserData();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      onRefresh();
    }, [])
  );

  return (
    <View style={styles.container}>
      <LogoHeader></LogoHeader>
      <View style={styles.profileHeader}>
        <Image
          source={
            userDetails.profilePic
              ? { uri: userDetails.profilePic }
              : fallbackProfilePicture
          }
          style={styles.profilePicture}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.profileDescription}>
            {userDetails.description}
          </Text>
        </View>

        <TouchableOpacity>
          <Icon name="share-square" style={styles.icon}></Icon>
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="gear" style={styles.icon} onPress={navigateToSettings} />
        </TouchableOpacity>
      </View>

      <NavigationContainer independent={true}>
        <Tab.Navigator
          sceneContainerStyle={{ backgroundColor: 'transparent' }}
          screenOptions={({ }) => ({
            tabBarStyle: {
              backgroundColor: "rgba(160, 220, 95, 0.15)",
            },
            tabBarIndicatorStyle: {
              backgroundColor: "#8CC84B",
            },
          })}
        >
          <Tab.Screen name="Your Posts">
            {() =>
              posts ? (
                <RecentPostsScreen
                  posts={posts}
                  navigation={navigation}
                  userRecipes={userRecipes}
                  refreshFunction={onRefresh}
                  refreshing={refreshing}
                />
              ) : (
                <Text>Loading ...</Text>
              )
            }
          </Tab.Screen>
          <Tab.Screen name="Saved Recipes">
            {() =>
              savedPosts1 ? (
                <SavedPostsScreen
                  savedPosts1={savedPosts1}
                  userFolders={userFolders}
                  refreshFunction={onRefresh}
                  refreshing={refreshing}
                  navigation={navigation}
                />
              ) : (
                <Text>Loading ...</Text>
              )
            }
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // scrollView: {
  //   flex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  icon: {
    width: 30,
    height: 30,
    fontSize: 27,
    marginLeft: 8,
    color: "#8CC84B",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  profilePicture: {
    width: 75,
    height: 75,
    borderRadius: 50,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  profileDescription: {},
  screen: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  postsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  plusContainerContainer: {
    flex: 1,
    flexGrow: 50,
    width: "100%",
    marginBottom: 10,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  postContainer: {
    flex: 1,
    minWidth: 100,
    maxWidth: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 1,
    borderWidth: 1,
    borderColor: "#fff"
  },
  postImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  postContent: {
    flex: 1,
    fontSize: 16,
  },
  addButton: {
    borderRadius: 5,
    backgroundColor: "#8CC84B",
    alignItems: "center", // Center items horizontally
    justifyContent: "center",
    width: '95%',
    height: 55,
  },
  backIcon: {
    color: "#8CC84B",
    paddingLeft: 5,
  },
  folders: {
    borderRadius: 5,
    backgroundColor: "rgba(140, 200, 75, 0.9)",
    alignItems: "center", // Center items horizontally
    justifyContent: "center",
    width: '100%',
    height: '100%',
  },
  folderContainer: {
    marginHorizontal: "auto",
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  plusContainer: {
    borderRadius: 5,
    backgroundColor: "rgba(100, 150, 55, 0.9)",
    alignItems: "center", // Center items horizontally
    justifyContent: "center",
    width: '95%',
    height: 60,
  },
  foldersLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  addFolderButton: {
    borderRadius: 5,
    backgroundColor: "#8CC84B",
    alignItems: "center", // Center items horizontally
    justifyContent: "center",
    width: 150,
    height: 50,
    marginLeft: 17,
  },
  addFolderButton1: {
    flexDirection: "row",
    borderRadius: 5,
    backgroundColor: "#FF6961",
    alignItems: "center", // Center items horizontally
    justifyContent: "center",
    width: 80,
    height: 50,
    marginRight: 20,
  },
  addFolderButton2: {
    flexDirection: "row",
    borderRadius: 5,
    backgroundColor: "#8CC84B",
    alignItems: "center", // Center items horizontally
    justifyContent: "center",
    width: 80,
    height: 50,
  },
  deleteContainer: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center", // Center items horizontally
    justifyContent: "center",
  },
  modalCenter: {
    alignItems: "center", // Center items horizontally
    justifyContent: "center",
  },
  addButtonLabel: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
  },
  plusIcon: {
    padding: 10,
  },
  inputField: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 14, // Set the font size for the input field
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 10,
    width: 250,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  folderItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginBottom: 10,
  },
  folderItemText: {
    marginLeft: 10,
    fontSize: 16,
  },
  noRecipesText: {
    alignItems: "center", // Center items horizontally
    justifyContent: "center",
    flex: 1,
  },
});

export default AccountPage;
