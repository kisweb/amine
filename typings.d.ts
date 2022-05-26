import { StringDecoder } from "string_decoder"

export interface Post {
    [x: string]: string | number | Date
    _id: string,
    _createdAt: string,
    title: string,
    author: {
        name:string,
        image:string,
    },
    categories: {
        name:string,
    },
    comments: Comment[],
    description:string,
    mainImage: {
        asset: {
            url:string,
        },
    },
    slug:{
        current:string,
    },
    body: [object]
}

export interface Comment {
    approuved: boolean,
    comment: string,
    email: string,
    name: string,
    publishedAt: string
    post: {
        _ref:string,
        _type:string,
    },
    _createdAt: string,
    _id: string,
    _rev: string,
    _type: string,
    _updatedAt: string
}