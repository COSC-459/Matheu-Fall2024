import { supabase } from '../supabaseClient';
import { checkIfDeviceExist } from './checkIfDeviceExist';
import { getDeviceID } from './getDeviceID';
import { getDeviceInfo } from './getDeviceInfo';
import { getUser } from './getUser';

export async function signUp(email: string, password:string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Signup error:', error.message);
    return { error };
  }


// AFTER AUTHENTICATING USER ADD THEM TO THE PUBLIC USERS TABLE
  if (data.user) {
    const { error: insertError } = await supabase.from('users').insert([
      {
        id: data.user.id,
        username: name,
        board_limit: 30,
        created_at: data.user.created_at
      },
    ]);

    if (insertError) {
      console.error('Error inserting user into public.user:', insertError.message);
      return { error: insertError };
    }
  }

  // ADD THE UESRS DEVICE TO THE DEVICES TABLE
  if (data.user) {
    const deviceID = await getDeviceID()
    const deviceInfo = await getDeviceInfo()
    
    const { error: insertError } = await supabase.from('devices').insert([
      {
        id: deviceID,
        user_id: data.user.id,
        name: deviceInfo.name,
        os: deviceInfo.os
      },
    ]);

    if (insertError) {
      console.error('Error inserting user into public.devices:', insertError.message);
      return { error: insertError };
    } 
  }

  // GET THE PUBLIC USER AND RETURN IT
  const publicUser = await getUser(data.user.id)

  return publicUser;
}

export async function signIn(email: string, password:string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });


    const deviceID = await getDeviceID()
    const deviceInfo = await getDeviceInfo()
    // CHECK IF THE USE HAS ALREADY LOGGED IN ON THIS DEVICE
    if (data.user && await checkIfDeviceExist(deviceID)) {
        
        // ADD THE USER'S DEVICE TO THE DEVICES TABLE IT'S NOT CURRENTLY ADDED
    const { error: insertError } = await supabase.from('devices').insert([
      {
        id: deviceID,
        user_id: data.user.id,
        name: deviceInfo.name,
        os: deviceInfo.os
      },
    ]);

    if (insertError) {
      console.error('Error inserting user into public.devices:', insertError.message);
      return { error: insertError };
    } 
  }
  

  if (error) {
    console.error('Signin error:', error.message);
    return { error };
  }

 // GET THE PUBLIC USER AND RETURN IT
 const publicUser = await getUser(data.user.id)

 return publicUser;
}
