export async function getDeviceID() {
    if (window.electron) {
        return window.electron.getDeviceId()
          .then((data) => data)
          .catch((error) => {
            console.error("Error getting device ID:", error);
            return null; // Return null or handle the error appropriately
          });
      } else {
        console.log("window.electron is not defined");
        return null;
      }

}