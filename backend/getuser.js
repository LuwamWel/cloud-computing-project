import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
 
const dynamoDB = new DynamoDBClient({ region: "us-east-1" });
const DYNAMODB_TABLE_NAME = "users";
 
export const handler = async (event) => {
  try {
    const email = event.pathParameters?.email;
    if (!email) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Email path parameter is required" }),
        };
    }
    const user = {
      email: { S: email },
    };
 
    const {Item} = await dynamoDB.send(new GetItemCommand({
      TableName: DYNAMODB_TABLE_NAME,
      Key: user,
    }));
    // Check if user exists
    if (!Item) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ error: "User not found" }),
      };
    }
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({email:Item.email.S, password:Item.password.S,  name:Item.name.S, profileImage:Item?.profileImage?.S})
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
