import {
    GraphQLServer
} from 'graphql-yoga'

// Type definitions - Application Schema
const typeDefs = `
    type Query {
        hello: String!
        name: String!
        location: String!
        bio: String!
    }
`

// Resolvers - Functions
const resolvers = {
    Query: {
        hello() {
            return 'This is my first query!'
        },
        name() {
            return 'Susie'
        },
        location() {
            return 'HTX'
        },
        bio() {
            return 'Love cooking'
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