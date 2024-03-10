import Icon from 'react-native-vector-icons/FontAwesome';
import React,{useState, useEffect} from 'react';
import { View,  StyleSheet, TouchableOpacity, Text, FlatList} from "react-native";
import {UserContext} from "../../providers/UserProvider";
import Modal from 'react-native-modal';
import CheckBox from 'expo-checkbox';

interface Folder {
  id: number;
  folderName: string;
  userID: number;
  checked: boolean;
}

const ContentInteractionBar = () => {
    const userContext = React.useContext(UserContext) as any;
    const username = userContext.state.username;
    const [isModalVisible, setModalVisible] = useState(false);
    let recipeID = 1;
    
    const [checkboxes, setCheckboxes] = useState<Folder[]>([]);

    useEffect(() => {
      const fetchData = async () => {
        try { //get folders
          const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"}/user/get-folders/${username}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });  
    
          const result = await response.json();
          const foldersFromServer: Folder[] = result.folder;

          // Add the 'checked' property to each folder with a default value of false
          const foldersWithChecked: Folder[] = foldersFromServer.map(folder => ({ ...folder, checked: false }));

          setCheckboxes(foldersWithChecked);
          console.log("logFolders" + JSON.stringify(foldersWithChecked));
        } catch (error) {
          console.error(error); 
        }
      };
  
      fetchData();
    }, [username]);

    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    };

    const handleSave = async () => {
      toggleModal();
    };

    const saveRecipe = async () => {
      toggleModal();
      setSaved(true);
        try {
          let response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"}/user/save-recipe/${username}}`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              recipeID: recipeID
            })
          });
    
          if (response.status !== 200) {
              console.error("save recipe unsuccessful");
          } else {
            console.log("save recipe successful");
          }
        } catch (error: any) {
          console.error(error.stack);
        }
    };

    const handleCheckboxChange = (id: number) => {
      const updatedCheckboxes = checkboxes.map((checkbox) =>
        checkbox.id === id ? { ...checkbox, checked: !checkbox.checked } : checkbox
      );
      setCheckboxes(updatedCheckboxes);
      console.log(updatedCheckboxes);
    };

    const handleUnsave = async () => {
      setSaved(false);
      try {
        let response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"}/user/delete-saved-recipe/${username}}`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            recipeID: recipeID,
          })
        });
  
        if (response.status !== 200) {
            console.error("unsave recipe unsuccessful");
        } else {
          console.log("unsave recipe successful");
        }
      } catch (error: any) {
        console.error(error.stack);
      }
  };

    const [isSaved, setSaved] = useState(false);
    return(
        <View style={styles.container}>
            <TouchableOpacity>
                <Icon name="share-square" style={styles.icon}></Icon>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{
                    if (isSaved==false) {
                      handleSave();
                    }
                    else if (isSaved==true) {
                      handleUnsave();
                    }
                }}>
                <Icon name="bookmark" style={[styles.icon, {color: isSaved?"#00D387":"#d3d3d3"}]}/>
            </TouchableOpacity>
            <Modal isVisible={isModalVisible} style={styles.modalCenter} onBackdropPress={toggleModal}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Add To Folder</Text>
        <FlatList
          data={checkboxes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={item.checked}  // Add this line to set the value
                onValueChange={() => handleCheckboxChange(item.id)}
              />
              <Text style={styles.checkboxItem}>{item.folderName}</Text>
            </View>
          )}
        />
        <TouchableOpacity style={styles.addFolderButton} onPress={saveRecipe}>
          <Text style={styles.addButtonLabel}>Save Recipe</Text>
        </TouchableOpacity>
      </View>
    </Modal>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        justifyContent:'flex-end'
    },
    icon:{
        width: 30,
        height: 30,
        fontSize:27,
        marginLeft:8,
        color:"#00D387"
    },
    modalCenter: {
      alignItems: 'center', // Center items horizontally
      justifyContent: 'center',
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: 40,
      borderRadius: 10,
      width: 250,
      justifyContent: 'center',
      alignItems: 'center'
    },
    addButtonLabel: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center'
    },
    addFolderButton: {
      borderRadius: 5,
      backgroundColor: '#8CC84B',
      alignItems: 'center', // Center items horizontally
      justifyContent: 'center',
      width: 150,
      height: 50,
      marginTop: 5
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center', // Align items vertically in the center
      margin: 5,
      paddingBottom:10
    },
    checkboxItem: {
      marginLeft: 15, // Add some spacing between checkbox and text
      fontSize: 16
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
});
export default ContentInteractionBar;