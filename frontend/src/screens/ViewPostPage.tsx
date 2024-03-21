import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import Modal from "react-native-modal";
import { ScrollView } from "react-native-gesture-handler";
import Header from "../components/header/Header";
import PosterHeader from "../components/RecipesAndPosts/PosterHeader";
import { IconButton } from "react-native-paper";
import TBButton from "../components/TBButton";
import { deletePost } from "../functions/HTTPRequests";
import { LoadingContext } from "../providers/LoadingProvider";
import PostTabBar from "../components/PostTabBar";
import { UserContext } from '../providers/UserProvider';

const ViewPostPage = ({ route, navigation }) => {
  let post = route.params;
  const [optionsModalVisible, setOptionsByModalVisible] =
    useState<boolean>(false);
  let userId = post.userId ? post.userId : post.author;
  const loadingContext = React.useContext(LoadingContext) as any;
  const userContext = React.useContext(UserContext) as any;
  const username = userContext.state.username;

  function moreOptionsButton() {
    return (
      <IconButton
        icon="dots-vertical"
        size={20}
        onPress={() => setOptionsByModalVisible(true)}
      />
    );
  }

  const calculateTimeDifference = (timeString) => {
    const currentTime = new Date();
    const pastTime = new Date(timeString);
  
    // Calculate the difference in milliseconds
    const timeDifference = currentTime.getTime() - pastTime.getTime();
  
    // Convert milliseconds to minutes, hours, and days
    const minutes = Math.floor(timeDifference / (1000 * 60));
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  
    // Determine the appropriate format based on the time difference
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={{ padding: 10 }}>
        <PosterHeader userId={userId} personalComponent={moreOptionsButton} />
        <Image style={styles.image} source={{ uri: post.image }} />
        <PostTabBar />
        <View style={styles.flex}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.description}>{post.description}</Text>
        </View>
        
        <Text style={styles.time}>{calculateTimeDifference(post.creationTime)}</Text>
      </ScrollView>
      <Modal
        isVisible={optionsModalVisible}
        onBackdropPress={() => setOptionsByModalVisible(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => setOptionsByModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style = {styles.modalTitle}>Are you sure?</Text>
              <TBButton
                style={{
                  padding: 5,
                  width: 150,
                  backgroundColor: "#FFCCCC",
                  borderColor: "#EBA4A4",
                }}
                textColor={{ fontWeight: "700" }}
                onPress={async () => {
                  loadingContext.enable();
                  await deletePost(userId, post.id).then(
                    loadingContext.disable()
                  );
                  setOptionsByModalVisible(false);
                  navigation.goBack()
                }}
                title="Delete"
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 350,
    alignSelf: "center",
    marginBottom: 10,
    borderRadius: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  flex: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Align items vertically
  },
  username: {
    paddingLeft: 10,
    fontSize: 17,
    fontWeight: "700"
  },
  header: {
    color: "#000",
    fontSize: 20,
    fontWeight: "700",
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userBar: {
    display: "flex",
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  description: {
    fontSize: 15,
    margin: 10,
  },
  time: {
    fontSize: 12,
    marginLeft: 10,
    margin: 5,
    color: 'grey'
  }
});

export default ViewPostPage;
