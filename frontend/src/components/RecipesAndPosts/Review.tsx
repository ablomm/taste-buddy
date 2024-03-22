import {Image, Text, View} from "react-native";
import StarRating from "react-native-star-rating-widget";
import React, { useEffect } from "react";
import {Review} from "../../interfaces/ReviewInterface";
import {IconButton} from "react-native-paper";
import { getUserDetails } from "../../functions/HTTPRequests";
const fallbackProfilePicture = require("../../../assets/profile.jpg");

export function UserReview({review, currentUserID, handleDelete}: {
    review: Review,
    currentUserID: number,
    handleDelete: any
}) {
    let [user, setUser] = React.useState({ username: "Unknown", profilePic: "" });

    useEffect(() => {
        async function setUserDetails() {
            setUser(await getUserDetails(review.userID))
        }
        setUserDetails();
    }, [])

    return (
        <View style={{flexDirection: 'row', paddingHorizontal: 5, paddingVertical: 6}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                    source={user.profilePic ? {uri: user.profilePic} : fallbackProfilePicture}
                    style={{width: 50, height: 50, borderRadius: 50}}/>
                <View style={{flexDirection: 'column', marginLeft: 10, width:'85%'}}>
                    <Text>{review.username}</Text>
                    <StarRating
                        rating={review.rating}
                        onChange={() => {
                        }}
                        maxStars={5}
                        starSize={18}
                    />
                    <Text>{review.reviewText}</Text>
                    <Text style={{color: '#6E6E6E', fontSize: 12}}>{review.postingTime}</Text>
                </View>
            </View>

            {
                currentUserID == review.userID ?
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1}}>
                        <IconButton icon="trash-can" onPress={handleDelete}/>
                    </View>
                    :
                    null
            }
        </View>
    );
}
