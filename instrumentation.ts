export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const admin_login = process.env.ADMIN_LOGIN || 'SuperUser'
        const admin_password = process.env.ADMIN_PASSWORD || 'SuperPassword'
        const UserStorage = await import('@/models/User/UserStorage')
        if (await UserStorage.getUserByName(admin_login) == null) {
            UserStorage.createUser(admin_login, admin_password)
            console.log("Registered SuperUser")
        }
        else console.log("SuperUser already registered")
    }
    else {
        console.log("ERROR: Not nodejs runtime")
    }
}