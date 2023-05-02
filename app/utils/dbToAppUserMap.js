export default function dbToAppUserMap(dbUser) {
    return {
        ...dbUser,
        id: dbUser._id || dbUser.id,
        status: dbUser.stat?.userStatus || dbUser.status,
        lastUpdated: dbUser.stat?.lastUpdated || dbUser.lastUpdated,
        password: undefined,
        stat: undefined,
        _id: undefined,
        __v: undefined,
    }
}
