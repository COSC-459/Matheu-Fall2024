import { TemplateString } from "@/node_modules/next/dist/lib/metadata/types/metadata-types";
import { supabase } from "@/supabaseClient";

export async function getDeviceName(id: string) {   
        
        const {data, error} = await supabase
            .from('devices')
            .select('*') 
            .eq('id', id)
            .single()
    
        if (error) {
            console.error('Error fetching row by ID:', error.message);
            return null;
          }
        
        return data.name
    }

export async function getDeviceNames(id: string) {   
    
  const {data, error} = await supabase
      .from('devices')
      .select('*') 

  if (error) {
      console.error('Error fetching row by ID:', error.message);
      return null;
    }
  console.log(data);
  
  return data
}