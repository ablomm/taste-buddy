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
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { UserContext } from "../providers/UserProvider";
import Modal from "react-native-modal";
import TBButton from "../components/TBButton";
import { FontAwesome } from "@expo/vector-icons"; // or 'react-native-vector-icons/MaterialIcons'
import { black } from "react-native-paper/lib/typescript/styles/themes/v2/colors";
let randomNo = 1;

const Tab = createMaterialTopTabNavigator();

const profilePicture = require("../../assets/profile.jpg");

interface Post {
  id: number;
  content: string;
}
const RecentPostsScreen: (
  {
    posts,
  }: {
    posts: any;
  },
  refreshFunction,
  refreshing
) => React.JSX.Element = ({ posts, refreshFunction, refreshing }) => {
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refreshFunction} />
      }
    >
      <View style={styles.screen}>
        <View style={styles.postsContainer}>
          {posts.map((post) => (
            <View key={post.id} style={styles.postContainer}>
              <Image source={{ uri: post.image }} style={styles.postImage} />
            </View>
          ))}
        </View>
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
}) => {
  const [isModalVisible, setModalVisible] = useState(false); //for create folder button
  const [isModalVisible1, setModalVisible1] = useState(false); //for delete folder button
  const [isModalVisible2, setModalVisible2] = useState(true); //disable to show recipes in folder
  const [isModalVisible3, setModalVisible3] = useState(false); //enable to show recipes in folder

  const [recipesInFolder, setRecipesInFolder] = useState<any[]>([]);

  const [folderName, setFolderName] = useState("");

  const userContext = React.useContext(UserContext) as any;
  const username = userContext.state.username;

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
        `${
          process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"
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
    toggleModal();
  };

  const deleteFolder = async (folderId) => {
    try {
      let response = await fetch(
        `${
          process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"
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
    toggleModal1();
  };

  const getRecipesInFolder = async (folderName) => {
    try {
      let response = await fetch(
        `${
          process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"
        }/user/get-recipes-in-folder/${username}?folderName=${folderName}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.status !== 200) {
        console.error("got recipes in folder unsuccessfully");
      } else {
        await response.json().then((result) => {
          let test = JSON.stringify(result);
          let test1 = JSON.parse(test);

          setRecipesInFolder(
            test1[0].savedRecipes.filter(
              (recipe) =>
                recipe.folders.some(
                  (folder) => folder.folderName === folderName
                ) && recipe.isShowing === true
            ) || []
          );
          console.log(
            "recipes in folder " +
              folderName +
              ": " +
              JSON.stringify(test1[0].savedRecipes)
          );
        });
        console.log("got recipes in folder successfully");
      }
    } catch (error: any) {
      console.error(error.stack);
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
              recipesInFolder.map((post) => {
                return (
                  <TouchableOpacity style={styles.postContainer}>
                    <View
                      key={`${post.id}-${randomNo}`}
                      style={styles.postContainer}
                    >
                      <Image
                        source={{ uri: post.recipe.recipeImage }}
                        style={styles.postImage}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            {recipesInFolder.length === 0 && (
              <View style={styles.noRecipesText}>
                <Text>No recipes in folder</Text>
              </View>
            )}
          </View>
        </View>
        <View style={{ display: isModalVisible2 ? "flex" : "none" }}>
          <View style={styles.postsContainer}>
            <TouchableOpacity onPress={toggleModal} style={styles.addButton}>
              <FontAwesome
                name="plus"
                size={40}
                color="white"
                style={styles.plusIcon}
              />
            </TouchableOpacity>
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
                <TouchableOpacity
                  style={styles.addFolderButton}
                  onPress={() => addFolder(folderName)}
                >
                  <Text style={styles.addButtonLabel}>Add Folder</Text>
                </TouchableOpacity>
              </View>
            </Modal>
            {userFolders.map((folder) => {
              randomNo++;
              return (
                <TouchableOpacity
                  style={styles.postContainer}
                  onPress={() => {
                    getRecipesInFolder(folder.folderName);
                  }}
                  onLongPress={() => {
                    if (folder.id !== 1) {
                      toggleModal1();
                    }
                  }}
                >
                  <View key={`${folder.id}`} style={styles.folders}>
                    <Text style={styles.addButtonLabel}>
                      {folder.folderName}
                    </Text>
                  </View>
                  <Modal
                    isVisible={isModalVisible1}
                    style={styles.modalCenter}
                    onBackdropPress={toggleModal1}
                  >
                    <View style={styles.modalContent}>
                      <Text style={styles.modalTitle}>Delete Folder?</Text>
                      <View style={styles.deleteContainer}>
                        <TouchableOpacity
                          style={styles.addFolderButton1}
                          onPress={() => {
                            deleteFolder(folder.id);
                          }}
                        >
                          <Text style={styles.addButtonLabel}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.addFolderButton2}
                          onPress={() => toggleModal1()}
                        >
                          <Text style={styles.addButtonLabel}>No</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                </TouchableOpacity>
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
  const [savedPosts1, setSavedPosts] = useState();
  const [userFolders, setUserFolders] = useState();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const navigation = useNavigation();

  const navigateToSettings = () => {
    // Navigate to the settings page
    navigation.navigate("DietaryPreference");
  };

  const fetchUserData = async () => {
    try {
      //get posts
      const response = await fetch(
        `${
          process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"
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
      //get folders
      const response = await fetch(
        `${
          process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"
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
        `${
          process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"
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

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={profilePicture} style={styles.profilePicture} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{username}</Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={navigateToSettings}
          >
            <Text style={styles.settingsButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      <NavigationContainer independent={true}>
        <Tab.Navigator>
          <Tab.Screen name="Recent Posts">
            {() =>
              posts ? (
                <RecentPostsScreen
                  posts={posts}
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
                />
              ) : (
                <Text>Loading ...</Text>
              )
            }
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
      <TBButton onPress={userContext.logout} title="Logout" />
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
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
  settingsButton: {
    backgroundColor: "#8CC84B", // Light green color
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: 110,
  },
  settingsButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
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
  postContainer: {
    width: "48%",
    marginBottom: 10,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
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
    marginLeft: 50,
    marginTop: 30,
    borderRadius: 5,
    backgroundColor: "#8CC84B",
    alignItems: "center", // Center items horizontally
    justifyContent: "center",
    width: 50,
    height: 55,
  },
  backIcon: {
    color: "#8CC84B",
    paddingLeft: 5,
  },
  folders: {
    marginRight: 15,
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: "rgba(140, 200, 75, 0.9)",
    alignItems: "center", // Center items horizontally
    justifyContent: "center",
    width: 95,
    height: 95,
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
