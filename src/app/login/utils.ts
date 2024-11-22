export function setAuthClient(name: string) {
    localStorage.setItem("userName", name)
}
export function getUserNameClient(){
    return localStorage.getItem('userName')
}
export function checkAuthClient() {
    return localStorage.getItem('userName') != null
}