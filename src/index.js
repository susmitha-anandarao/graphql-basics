import {
    GraphQLServer
} from 'graphql-yoga'

import {
    v4 as uuidv4
} from 'uuid'

// Scalar types - String, Boolean, Int, Float, Id

// Demo user data
let users = [{
    id: '1',
    name: 'Susie',
    email: 'susie@example.com',
    age: 29
}, {
    id: '2',
    name: 'Aj',
    email: 'aj@example.com'
}, {
    id: '3',
    name: 'Su',
    email: 'su@example.com'
}]

// Demo post data
let posts = [{
    id: '4',
    title: 'Title 1',
    body: '',
    published: false,
    author: "1"
}, {
    id: '5',
    title: 'Title 2',
    body: 'Body 2',
    published: true,
    author: '2'
}, {
    id: '6',
    title: 'Title 3',
    body: 'Body 3',
    published: false,
    author: '3'
}]

// Demo comments data
let comments = [{
    id: '7',
    text: 'Comment 1',
    author: '1',
    post: '4'
}, {
    id: '8',
    text: 'Comment 2',
    author: '2',
    post: '4'
}, {
    id: '9',
    text: 'Comment 3',
    author: '2',
    post: '5'
}, {
    id: '10',
    text: 'Comment 4',
    author: '3',
    post: '5'
}]

// Type definitions - Application Schema
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        me: User!
        post: Post!
        posts(query: String): [Post!]!
        comments: [Comment!]
    }

    type Mutation {
        createUser(data: CreateUserInput!): User!
        deleteUser(id: ID!): User!
        createPost(data: CreatePostInput!): Post!
        deletePost(id: ID!): Post!
        createComment(data: CreateCommentInput!): Comment!
        deleteComment(id: ID!): Comment!
    }

    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }

    input CreateCommentInput {
        text:String!
        author: ID!
        post: ID!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]! 
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`

// Resolvers - Functions
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users
            }
            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        me() {
            return {
                id: 'Su123',
                name: 'Susie',
                email: 'susie@example.com'
            }
        },
        post() {
            return {
                id: 'Post1',
                title: 'Node.js is the best',
                body: 'Some body about node',
                published: false
            }
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts
            }
            return posts.filter((post) => {
                return post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        comments(parent, args, ctx, info) {
            return comments
        }
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some((user) => user.email === args.data.email)

            if (emailTaken) {
                throw new Error('Email taken.')
            }

            const user = {
                id: uuidv4(),
                ...args.data
            }

            users.push(user)
            return user
        },
        deleteUser(parent, args, ctx, info) {
            const userIndex = users.findIndex((user) => user.id === args.id)

            if (userIndex === -1) {
                throw new Error('User not found')
            }

            const deletedUser = users.splice(userIndex, 1)[0]

            posts = posts.filter((post) => {
                const match = post.author === args.id

                if (match) {
                    comments = comments.filter((comment) => comment.post !== post.id)
                }
                return !match
            })
            comments = comments.filter((comment) => comment.author !== args.id)

            return deletedUser
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some((user) => {
                return user.id === args.data.author
            })

            if (!userExists) {
                throw new Error('Author does not exist')
            }

            const post = {
                id: uuidv4(),
                ...args.data
            }

            posts.push(post)

            return post
        },
        deletePost(parent, args, ctx, info) {
            const postIndex = posts.findIndex((post) => post.id === args.id)

            if (postIndex === -1) {
                throw new Error('Post does not exist')
            }

            const deletedPost = posts.splice(postIndex, 1)[0]

            comments = comments.filter((comment) => comment.post !== args.id)

            return deletedPost
        },
        createComment(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.data.author)

            const postExists = posts.some((post) => post.id === args.data.post && post.published)

            if (!userExists || !postExists) {
                throw new Error('Unable to find user and post')
            }

            const comment = {
                id: uuidv4(),
                ...args.data
            }

            comments.push(comment)

            return comment
        },
        deleteComment(parent, args, ctx, info) {
            const commentIndex = comments.findIndex((comment) => comment.id === args.id)

            if (commentIndex === -1) {
                throw new Error('Comment does not exist')
            }

            const deletedComment = comments.splice(commentIndex, 1)[0]

            return deletedComment
        }

    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.post === parent.id
            })
        }

    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter((post) => {
                return post.author == parent.id
            })
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.author === parent.id
            })
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        post(parent, args, ctx, info) {
            return posts.find((post) => {
                return post.id === parent.post
            })
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('The server is up!')
})