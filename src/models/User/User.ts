export class User {
    id: number = 0
    name: string = ''
    password: string = ''
    salt: string = ''
    role: Role = Role.Viewer

    static printRole(role:string) {
        switch (role){
            case "admin":{
                return "Администрирование"
            }
            case "editor":{
                return "Редактирование"
                break
            }
            case "viewer":{
                return "Просмотр"
                break
            }
        }
    }
}

export enum Role {
    Admin = 'admin',
    Editor = 'editor',
    Viewer = 'viewer',
}
