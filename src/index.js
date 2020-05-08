import {
    GraphQLServer
} from 'graphql-yoga'

// Scalar types - String, Boolean, Int, Float, Id

// Demo user data
const users = [{
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
const posts = [{
    id: '1',
    title: 'Title 1',
    body: '',
    published: false
}, {
    id: '2',
    title: 'Title 2',
    body: 'Body 2',
    published: true
}, {
    id: '3',
    title: 'Title 3',
    body: 'Body 3',
    published: false
}]

// Type definitions - Application Schema
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        me: User!
        post: Post!
        posts(query: String): [Post!]!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
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