import Icon from 'react-native-vector-icons/FontAwesome';
import React,{useState} from 'react';
import { View,  StyleSheet, TouchableOpacity } from "react-native";
import {UserContext} from "../../providers/UserProvider";

const ContentInteractionBar = ({savedStatus}:any) => {
    const userContext = React.useContext(UserContext) as any;
    const username = userContext.state.username;

    const handleSave = async () => {
        let recipeID = 1;
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

    const [isSaved, setSaved] = useState(savedStatus);
    return(
        <View style={styles.container}>
            <TouchableOpacity>
                <Icon name="share-square" style={styles.icon}></Icon>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{
                    isSaved? setSaved(false):setSaved(true);
                    handleSave();
                }}>
                <Icon name="bookmark" style={[styles.icon, {color: isSaved?"#00D387":"#d3d3d3"}]}/>
            </TouchableOpacity>
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
    }
});
export default ContentInteractionBar;