export async function getDeviceInfo() {
    if (window.electron) {
        return window.electron.getDeviceInfo()
          .then((data) => data)
          .catch((error) => {
            console.error("Error getting device ID:", error);
            return null;
          });
      } else {
        console.log("window.electron is not defined");
        return null;
      }

}