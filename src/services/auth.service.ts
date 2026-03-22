import api from "../api/api"
export class AuthService 
{
    async login(email : string , password : string)  
    {
        try 
        {
            const responseData = await api.post("auth/login" , {
                email, password 
            } , {
                headers : {
                    "Content-Type" : "application/json"
                }
            })
            console.log("Login" , responseData) 
        } 
        catch (err) 
        {
            console.log("Login Error: " , err) 
            throw err 
        }
    }
}