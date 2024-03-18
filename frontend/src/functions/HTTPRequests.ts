import { Alert } from "react-native";

const getS3URL = async () => {
    let result = await (await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"}/recipe/s3Url`)).json();
    if (!result) {
        throw new Error("image link generation error")
    }
    return result;
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

export const saveRecipe = async (username, title, description, instructions, cookTime, calories, servings, ingredients, tags, image) => {
    let response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"}/recipe/save`, {  //save the recipe
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
    let response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"}/post/create`, {
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

export const login = async (username, password) => {
    let response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"}/login`, {
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
    let response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"}/user`, {
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