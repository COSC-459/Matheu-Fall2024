import { supabase } from "@/supabaseClient";


export async function checkIfDeviceExist(id: string) {
    const { data, error } = await supabase
    .from("devices")
    .select('id') // Select only the ID column to optimize query performance
    .eq('id', id)
    .limit(1); // Limit to 1 row for efficiency, since we only care if it exists

  if (error) {
    console.error('Error checking ID:', error.message);
    return false;
  }

  return data.length == 0; // If data array has items, the ID exists
}
