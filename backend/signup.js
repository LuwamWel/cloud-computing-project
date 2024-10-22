import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
 
const dynamoDB = new DynamoDBClient({ region: "us-east-1" });

const DYNAMODB_TABLE_NAME = "users";

const SALT_ROUNDS = 10;
 
export const handler = async (event) => {

  try {

    if (!event.body) {

      throw new Error("Request body is missing");

    }
 
    const { email, password, name } = JSON.parse(event.body);
 
    if (!email || !password || !name) {

      throw new Error("Missing required fields: email, password, or name");

    }


    // Save data to DynamoDB

    const user = {

      email: { S: email },

      name: { S: name },

      password: { S: password } 

    };
 
    await dynamoDB.send(new PutItemCommand({

      TableName: DYNAMODB_TABLE_NAME,

      Item: user,

    }));
 
    return {

      statusCode: 200,

      headers: {

        'Access-Control-Allow-Origin': '*',

        'Access-Control-Allow-Methods': 'POST',

        'Access-Control-Allow-Headers': 'Content-Type',

      },

      body: JSON.stringify({ email, name }), 

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

 