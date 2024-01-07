import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient()

export async function createPost(userID: number|any, description: string, tags: any, image: string, recipeURL: string) {
    const tags_list: string[] = tags.map((obj: any) => obj.value);

    const post = await prisma.posts.create({
        data: {
            author: userID,
            description: description,
            tags: tags_list.join(","),
            image: image,
            recipeURL: recipeURL
        },
    });

    console.log(`Newly created post ID: ${post.id}`)

    await prisma.userPosts.create({
       data: {
           author: userID,
           postID: post.id
       }
    });

    console.log(`Successfully added post to user's records ...`);

    let formatted_tags: any[] = [];

    // Reformat the objects in the array
    for (let tag in tags_list) {
        formatted_tags.push({
           postID: post.id,
            tag: tag
        });
    }

    await prisma.postTags.createMany({
        data: formatted_tags
    });

    console.log(`Successfully added post's tags to records ...`);
    console.log('COMPLETE POST CREATION ...');
}

export async function getPostsByUserAndID(userID: number|undefined) {
    return await prisma.posts.findMany({
        where: {
            author: userID
        },
    });
}