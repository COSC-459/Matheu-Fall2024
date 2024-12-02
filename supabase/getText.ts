import { supabase } from "@/supabaseClient";
import useStoredUser from "./useStoredUser";

export async function getText() {   
    const storedUser = localStorage.getItem("user");
    
    if(storedUser){
        const parsedUser = JSON.parse(storedUser)
        
        const {data, error} = await supabase
            .from('text')
            .select('*') 
            .order('created_at', { ascending: false })
            .eq('user_id', parsedUser.id)
    
        if (error) {
            console.error('Error fetching row by ID:', error.message);
            return null;
          }
        
        return data
    }
}