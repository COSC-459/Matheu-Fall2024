export const isKeyInLocalStorage = (key: string): boolean => {
    return localStorage.getItem(key) !== null;
  };
  
  if (isKeyInLocalStorage("user")) {
    console.log("Key 'user' exists in localStorage.");
  } else {
    console.log("Key 'user' does not exist in localStorage.");
  }
  