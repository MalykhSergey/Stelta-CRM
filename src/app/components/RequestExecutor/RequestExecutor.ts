import {showMessage} from "@/app/components/Alerts/Alert";

export default class RequestExecutor<T> {
    public constructor(private readonly input: string,
                       private readonly params: RequestInit,
                       // eslint-disable-next-line @typescript-eslint/no-explicit-any
                       private readonly callback: (json:T)=>void) {}
    public async execute():Promise<boolean>{
        try {
            const response = await fetch(this.input,this.params);
            if (response.ok){
                const result = await response.json();
                if (result?.error) {
                    showMessage(result.error)
                    return false
                }
                this.callback(result)
            }
            else {
                const result = await response.json();
                if (result?.error) {
                    showMessage(result.error)
                    return false
                }
                else {
                    showMessage("Непредвиденная ошибка на стороне сервера!")
                }
            }
        }
        catch (e){
            showMessage("Ошибка выполнения сетевого запроса!")
            console.error(e);
            return false;
        }
        return true;
    }
}