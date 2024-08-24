
import sdk , {Storage} from"node-appwrite";

const client = new sdk.Client();


client.setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite Endpoint
  .setProject('66a12c91000a4cded686')
  .setKey("2014e10f87bb59c608536301e97ce9dde1766df94e2001b0e1e26d4f591694c25c8f35d74c054fa59544dedbdaf7e43977f434e9e3e8b3ab338e6c25e5dce4320990eb4fa549692f76d3c683b46f459b1465db31e3211dfef0dee83c447f15e29293b9093eb6b4b79edaf62f07fdb4a63ac4de7a38fff124d0de1eaf95940c31")
   // Your project ID
   // Your API Key

 export const storage1 = new Storage(client);


 

  


