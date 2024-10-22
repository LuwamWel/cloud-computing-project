import { S3Client, PutObjectCommand} from "@aws-sdk/client-s3";
import { DynamoDBClient, PutItemCommand, GetItemCommand  } from "@aws-sdk/client-dynamodb";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
 
const s3 = new S3Client({ region: "us-east-1" });
const dynamoDB = new DynamoDBClient({ region: "us-east-1" });
const DYNAMODB_TABLE_NAME = "users";
const bucketName = "project-s3-bucket-backend";
 
export const handler = async (event) => {
  try {
    const { filename, contentType, email} = JSON.parse(event.body);
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
 
    // Generate pre-signed URL
    const uploadParams = {
      Bucket: bucketName,
      Key: filename,
      ContentType: contentType,
    };
    const command = new PutObjectCommand(uploadParams);
    const uploadURL = await getSignedUrl(s3, command, { expiresIn: 60 });
    const item = {
      name: {S: Item.name.S},
      password:{S: Item.password.S},
      email: { S: email },
      profileImage: { S: `https://${bucketName}.s3.amazonaws.com/${filename}` },
    };
 
    await dynamoDB.send(new PutItemCommand({
      TableName: DYNAMODB_TABLE_NAME,
      Item: item,
    }));
 
 
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ uploadURL }),
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
