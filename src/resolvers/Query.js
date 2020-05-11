const Query = {
    users(parent, args, {
        db
    }, info) {
        if (!args.query) {
            return db.users
        }
        return db.users.filter((user) => {
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
    posts(parent, args, {
        db
    }, info) {
        if (!args.query) {
            return db.posts
        }
        return db.posts.filter((post) => {
            return post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase())
        })
    },
    comments(parent, args, {
        db
    }, info) {
        return db.comments
    }
}

export {
    Query as
    default
}