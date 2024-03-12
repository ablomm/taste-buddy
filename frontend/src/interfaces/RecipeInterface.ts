export interface Recipe {
    id: number,
    authorID: number,
    creationTime: string,
    recipeTitle: string,
    description: string,
    cookTimeHours: number,
    cootTimeMinutes: number,
    calories: number,
    servings: number,
    recipeImage: string,
    averageRating: number,
    ingredients: any[],
    instructions: any[]
    tags: any[]
}
