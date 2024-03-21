import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import StarRating from "react-native-star-rating-widget";
import TBButton from "../TBButton";
import { Review } from "../../interfaces/ReviewInterface";
import { UserReview } from "./Review";
import { ModalButton } from "../SearchPageComponents/SortButton";

enum SortByOptions {
  DateAscending = "DateAscending",
  DateDescending = "DateDescending",
  RatingAscending = "RatingAscending",
  RatingDescending = "RatingDescending",
}

const RecipeReviews = ({ userID, username, recipeID, updateRating }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pages, setPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [newReview, setNewReview] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortByOptions>(
    SortByOptions.DateDescending
  );
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [sortByModalVisible, setSortByModalVisible] = useState<boolean>(false);

  useEffect(() => {
    try {
      if (recipeID != -1) {
        checkCommentExists().then((review) => {
          if (review["found"]) {
            setUserReview(review["review"]);
          }
        });
        retrieveReviews(1, sortBy, recipeID).then((response) => {
          if (response != undefined) {
            setReviews(response["reviews"]);
            setPages(response["totalPages"]);
          }
        });
      }
    } catch (error) {
      console.log("Error occurred while retrieving reviews: " + error);
    }
  }, [recipeID]);

  async function retrieveReviews(page, sortBy, recipeID) {
    const response = await fetch(
      `${
        process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"
      }/recipe/reviews?page=${page}&orderBy=${sortBy}&recipeID=${recipeID}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (response.ok) {
      // If the response is successful (status code in the range 200-299)
      // Extract JSON data from the response
      return await response.json();
    } else {
      // If the response is not successful, handle the error accordingly
      console.error("Failed to retrieve reviews:", response.statusText);
    }
  }

  async function handleDelete() {
    const response = await fetch(
      `${
        process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"
      }/recipe/delete-review?recipeID=${recipeID}&userID=${userID}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (response.ok) {
      setUserReview(null);
      const ratingResponse = await getRecipeRating(recipeID);
      updateRating(ratingResponse["rating"]);
    } else {
      // If the response is not successful, handle the error accordingly
      console.error("Failed to delete review:", response.statusText);
    }
  }

  const handleReviewSubmit = async () => {
    await submitReview();
    const ratingResponse = await getRecipeRating(recipeID);
    setPages(currentPage)
    updateRating(ratingResponse["rating"]);
  };

  async function submitReview() {
    if (!userReview) {
      // Check if the user has already submitted a review
      const newReviewObj: Review = {
        userID: userID, //placeholder
        username: username,
        recipeID: recipeID,
        profilePicture: "../../assets/temp/tempfood.jpg", //TODO: Use proper profile
        rating: rating,
        reviewText: newReview,
        postingTime: new Date().toLocaleString(),
      };

      const response = await fetch(
        `${
          process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"
        }/recipe/saveReview`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(newReviewObj),
        }
      );

      if (response.ok) {
        // If the response is successful (status code in the range 200-299)
        setUserReview(newReviewObj);
        setReviews([newReviewObj, ...reviews]);
        setNewReview("");
        setRating(0);
      } else {
        // If the response is not successful, handle the error accordingly
        console.error("Failed to save review:", response.statusText);
      }
    }
  }

  async function getRecipeRating(recipeID: number) {
    const response = await fetch(
      `${
        process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"
      }/recipe/get-recipe-rating?recipeID=${recipeID}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (response.ok) {
      // If the response is successful (status code in the range 200-299)
      return await response.json();
    } else {
      // If the response is not successful, handle the error accordingly
      console.error("Failed to check for user comments:", response.statusText);
      return false;
    }
  }

  async function checkCommentExists() {
    const response = await fetch(
      `${
        process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"
      }/recipe/review-by-user?userID=${userID}&recipeID=${recipeID}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (response.ok) {
      // If the response is successful (status code in the range 200-299)
      return await response.json();
    } else {
      // If the response is not successful, handle the error accordingly
      console.error("Failed to check for user comments:", response.statusText);
      return false;
    }
  }

  const loadMoreReviews = async () => {
    const response = await retrieveReviews(currentPage + 1, sortBy, recipeID);
    if (response != undefined) {
      setReviews([...reviews, response["reviews"]]);
      setCurrentPage(currentPage + 1);
    }
  };

  const sortReviews = async (sortBy: string, recipeID: number) => {
    const response = await retrieveReviews(1, sortBy, recipeID);

    if (response != undefined) {
      setReviews(response["reviews"]);
      setCurrentPage(1);
    }
  };

  const handleSortOptionPress = async (option: SortByOptions) => {
    setSortByModalVisible(false);
    setSortBy(option);
    await sortReviews(option.toString(), recipeID);
  };

  return (
    <View>
      {/* Review Input Field */}
      {userReview ? (
        <UserReview
          review={userReview}
          currentUserID={userID}
          handleDelete={handleDelete}
        />
      ) : (
        <View>
          <StarRating
            rating={rating}
            onChange={setRating}
            maxStars={5}
            starSize={27}
          />
          <TextInput
            placeholder="Add a review"
            value={newReview}
            style={styles.reviewStyle}
            onChangeText={(text) => setNewReview(text)}
          />
          <TBButton
            title="post"
            style={styles.postButton}
            textColor={{ color: "white" }}
            onPress={handleReviewSubmit}
          />
        </View>
      )}

      {/* Sort Reviews Button */}
      {reviews.length > 0 && (
        <TouchableOpacity
          onPress={() => setSortByModalVisible(true)}
          style={{ padding: 5 }}
        >
          <Text style={{ color: "#8CC84B" }}>Sort Reviews</Text>
        </TouchableOpacity>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={sortByModalVisible}
        onRequestClose={() => setSortByModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setSortByModalVisible(false)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Sort By</Text>
              <ModalButton
                onClick={() =>
                  handleSortOptionPress(SortByOptions.DateDescending)
                }
                text="Date Desc"
              />
              <ModalButton
                onClick={() =>
                  handleSortOptionPress(SortByOptions.DateAscending)
                }
                text="Date Asc"
              />
              <ModalButton
                onClick={() =>
                  handleSortOptionPress(SortByOptions.RatingDescending)
                }
                text="Rating Desc"
              />
              <ModalButton
                onClick={() =>
                  handleSortOptionPress(SortByOptions.RatingAscending)
                }
                text="Rating Asc"
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Review List */}
      {reviews.length > 0 && (
        <View>
          {reviews.map((review, index) => {
            if (review.userID != userID) {
              return (
                <UserReview
                  key={index}
                  currentUserID={userID}
                  review={review}
                  handleDelete={handleDelete}
                />
              );
            }
          })}
        </View>
      )}

      {/* Load More Reviews Button */}
      {reviews.length > 0 && currentPage != pages ? (
        <TouchableOpacity onPress={loadMoreReviews} style={{ padding: 5 }}>
          <Text style={{ color: "#8CC84B" }}>Load More Reviews...</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  reviewStyle: {
    color: "#6E6E6E",
    fontSize: 18,
    fontWeight: "400",
    padding: 5,
  },
  postButton: {
    height: 35,
    backgroundColor: "#6752EC",
    color: "white",
    borderWidth: 0,
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
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
});
export default RecipeReviews;
