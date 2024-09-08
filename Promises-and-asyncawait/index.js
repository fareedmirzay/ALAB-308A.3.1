// Importing database functions. DO NOT MODIFY THIS LINE.
import { central, db1, db2, db3, vault } from "./databases.js";

async function getUserData(id) {
  const dbs = {
    db1: db1,
    db2: db2,
    db3: db3
  };

  if (typeof id !== "number" || id < 1 || id > 10) {
    return Promise.reject(new Error("Invalid ID"));
  }

  try {
    // Fetch the database name from the central database
    const dbName = await central(id);

    // Fetch user data from the appropriate db and vault
    const basicDataPromise = dbs[dbName](id);
    const personalDataPromise = vault(id);

    // Wait for both promises to resolve
    const [basicData, personalData] = await Promise.all([basicDataPromise, personalDataPromise]);

    // Construct the final user data object
    const userData = {
      id,
      name: personalData.name,
      username: basicData.username,
      email: personalData.email,
      address: personalData.address,
      phone: personalData.phone,
      website: basicData.website,
      company: basicData.company
    };

    return userData;
  } catch (error) {
    // Handle errors from any of the promises
    return Promise.reject(error);
  }
}

export { getUserData };
