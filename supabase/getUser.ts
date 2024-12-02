import { supabase } from "@/supabaseClient";

export async function getUser(id: string) {
    const {data, error} = await supabase.from('users')
    .select('*') 
    .eq('id', id)
    .single();

    if (error) {
        console.error('Error fetching row by ID:', error.message);
        return null;
      }

    
    return data
}