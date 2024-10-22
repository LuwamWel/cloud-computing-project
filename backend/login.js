import { DynamoDBClient, PutItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
 
const dynamoDB = new DynamoDBClient({ region: "us-east-1" });
const DYNAMODB_TABLE_NAME = "users";
 
export const handler = async (event) => {
  try {
    if (!event.body) {
      throw new Error("Request body is missing");
    }
 
    const { email, password } = JSON.parse(event.body);
    if (!email || !password) {
      throw new Error("Missing required fields: email, password");
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
 
    const passwordMatch = password === Item.password.S
 
    if (!passwordMatch) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ error: "Invalid password" }),
      };
    }
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({name:Item.name.S, email:Item.email.S, profilImage:Item.profilImage?.S})
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
