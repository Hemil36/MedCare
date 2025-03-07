
import sdk , {Storage} from"node-appwrite";

const client = new sdk.Client();


client.setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_PROJECT_API_KEY)


 export const storage1 = new Storage(client);


 

  


