// This is the GraphQL query you use to fetch the data from the Datahub API.
// You can freely add or remove any of available fields from the query to get exactly the data you need from the API.
// This example query will only return 1 product with its id field.
// To learn more about what data can be fetched from Datahub API see the Datahub API Instructions document and the attached GraphQL schema.
const query = `
query GetGroupedProducts {
    groupedProducts(args: {publishing_id: "3dd3c135-2805-4f37-b475-82b10145aea6"}) {
        id
        productInformations(where: { language: { _eq: fi } }) {
            name
            description
        }
        postalAddresses {
            location
            postalCode
            streetName
            city
        }
    }
}
  
`;

(async () => {
  const authBody = new URLSearchParams();
  authBody.append("grant_type", "password");
  authBody.append("client_id", "datahub-api");
  // This value should be the client secret you received in an email from datahub when you registered
  
  authBody.append("client_secret", "ed7cd94f-727e-4cf7-879c-1c26f798bcc0");
  // This value should be the email you used to register to Datahub as API user
  authBody.append("username", "makkeeh@gmail.com");
  // This value should be the password for the API user
  authBody.append("password", "Macce20$$_datahub");

  const authRes = await fetch(
    "https://iam-datahub.visitfinland.com/auth/realms/Datahub/protocol/openid-connect/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: authBody,
    }
  );

  const accessToken = (await authRes.json()).access_token;

  const res = await fetch(
    "https://api-datahub.visitfinland.com/graphql/v1/graphql",
    {
      method: "POST",
      body: JSON.stringify({
        query,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const queryResult = await res.json();
  console.log(JSON.stringify(queryResult, null, 2));
})();
