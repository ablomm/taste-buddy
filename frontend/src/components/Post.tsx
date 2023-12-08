import React, {useState} from "react";
import { StyleSheet, Text, TextInput, View, Keyboard, Button, Image } from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";

const Post = ({ imageUrl }: any) => {
    const [data, setData] = useState("");

    /*const toDataURL = async (url: string) =>

        await fetch(url)
            .then((response) => response.arrayBuffer())
            .then((buffer) => {
                //return buffer.toString('base64');
            })
            .catch(console.error);
    toDataURL(imageUrl).then((fin) => {
        console.log('RESULT:', fin);
    }); */

    //let UserImage = "";
    function validateResponse(response:any) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }
    const userImageGet = ()=> {
        /*fetch(imageUrl)      
        .then((r:any) => {
          console.log(r); // 
          UserImage = r.data;
          setData(r.data); // here's user base64 string
        })*/
        return  fetch(imageUrl)
            .then(validateResponse)
            .then(async response => 
                //console.log(await response.blob())
                URL.createObjectURL(await response.blob())
                )
            
    }
    let UserImage = userImageGet();
    console.log(UserImage)

    async function getBase64ImageFromUrl(imageUrl:any) {
        var res = await fetch(imageUrl);
        var blob = await res.blob();
      
        return new Promise((resolve, reject) => {
          var reader  = new FileReader();
          reader.addEventListener("load", function () {
              resolve(reader.result);
          }, false);
      
          reader.onerror = () => {
            return reject();
          };
          reader.readAsDataURL(blob);
        })
      }
      let d;
      getBase64ImageFromUrl(imageUrl).then((x) => {
        d = x;
      });
    
    const ur =  imageUrl.replace('/^data:image\/(png|jpg);base64,/', "");
    console.log(ur)
    return (
        <View >
            <Image style={styles.post} source={{ uri:UserImage}}></Image>
        </View>
    );
};

// styles
const styles = StyleSheet.create({
    post: {
        fontSize: 16,
        backgroundColor: 'gray',
        color: "fff",
        margin: 5,
        padding: 5,
        height: 120,
        width: 120,
        borderWidth: 1, 
        borderColor: 'red'
    }
});

export default Post;