import {
    GraphQLServer
} from 'graphql-yoga'

// Scalar types - String, Boolean, Int, Float, Id

// Type definitions - Application Schema
const typeDefs = `
    type Query {
        id: ID!
        title: String!
        price: Float!
        releaseYear: Int
        rating: Float
        inStock: Boolean!
    }
`

// Resolvers - Functions
const resolvers = {
    Query: {
        id() {
            return 'abc12'
        },
        title() {
            return 'iPhone'
        },
        price() {
            return 1234.56
        },
        releaseYear() {
            return 2020
        },
        rating() {
            return null
        },
        inStock() {
            return true
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