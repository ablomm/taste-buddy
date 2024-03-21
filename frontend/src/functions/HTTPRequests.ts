import { defaultProfilePicture } from "../constants/DefaultImages";

const localHostURL = "http://localhost:8080";

const getS3URL = async () => {
    let result = await (await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || localHostURL}/s3/s3GenerateUrl`)).json();
    if (!result) {
        throw new Error("image link generation error")
    }
    return result;
}

export const getUserDetails = async (userId) => {
    let user = await (await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || localHostURL}/user/id/${userId}`)).json();
    if (!user.profilePic) {
        user.profilePic = defaultProfilePicture;
    }
    return user;
}

export const putImage = async (image, type) => {
    let url = (await getS3URL()).imageURL[0];

    let result = await fetch(url, {  //put the image on the bucket
        method: 'PUT',
        headers: {
            'ContentEncoding': 'base64',
            'Content-Type': `image/${type}`,
        },
        body: image
    });

    if (result.status !== 200) {
        throw new Error("s3Response, s3 error")
    }

    return url.split('?')[0]
}

export const deletePost = async (userId, postId) => {

    let response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || localHostURL}/post/delete-post`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            userId: userId,
            postId: postId
        }),
    });

    if (response.status !== 200) {
        throw new Error("Delete Post Failure")
    }
}

export const saveRecipe = async (username, title, description, instructions, cookTime, calories, servings, ingredients, tags, image) => {
    let response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || localHostURL}/recipe/save`, {  //save the recipe
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            username: username,
            title: title,
            description: description,
            instructions: instructions,
            cookTime: cookTime,
            calories: calories,
            servings: servings,
            ingredients: ingredients,
            tags: tags,
            image: image
        }),
    });

    if (response.status !== 200) {
        throw new Error("Recipe save failed")
    }
}

export const savePost = async (username, description, tags, image, recipeURL) => {
    let response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || localHostURL}/post/create`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            username: username,
            description: description,
            tags: tags,
            image: image,
            recipeURL: recipeURL
        }),
    });

    if (response.status !== 200) {
        throw new Error("Save Post Failure")
    }
}

export const saveProfilePicture = async (username, image) => {
    let response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || localHostURL}/user/update-profile/profilePic`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            username: username,
            profilePic: image
        }),
    });

    if (response.status !== 200) {
        throw new Error("Save Profile Picture Failure")
    }
}

export const saveProfileDescription = async (username, description) => {
    let response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || localHostURL}/user/update-profile/description`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            username: username,
            description: description
        }),
    });

    if (response.status !== 200) {
        throw new Error("Save Profile Description Failure")
    }
}

export const login = async (username, password) => {
    let response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || localHostURL}/login`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    });

    if (response.status !== 200) {
        throw new Error("Login failed");
    }

    return await response.json();
}

export const signUp = async (username, email, password) => {
    let response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || localHostURL}/user`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            username: username,
            email: email,
            password: password
        })
    });

    if (response.status !== 200) {
        throw new Error("account creation unsuccessful");
    }
}

export const getPostPage = async (page: number) => {
    const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"}/post/page/${page}`);
    return await response.json();
}

export const getRecipesInFolder = async (username: string, folderName: string) => {
    let response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"}/user/get-recipes-in-folder/${username}?folderName=${folderName}`,
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
        throw new Error("got recipes in folder unsuccessfully");
    }

    return await response.json();
}
export const addRecipeToUserSaved = async(recipeID: number, username: string) => {
    try {
        let response = await fetch(
          `${
            process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"
          }/user/save-recipe/${username}`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              recipeID: recipeID,
            }),
          }
        );
  
        if (response.status !== 200) {
          console.error("Save Recipe Unsuccessful");
      } else {
        console.log("Save Recipe Successful");
      }
      } catch (error) {
        console.error(error);
      }
}

export const addUserRejectedRecipe = async(recipeID: number, userID: number) => {
    try {
        let response = await fetch(
          `${
            process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"
          }/user/reject-recipe/${userID}`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              recipeID: recipeID,
            }),
          }
        );
      } catch (error) {
        console.error(error);
      }
    }