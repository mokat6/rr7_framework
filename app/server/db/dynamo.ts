import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// const client = new DynamoDBClient({
//   region: process.env.AWS_DYNAMO_REGION ?? "us-east-1", // match your table region
// });

export const client = new DynamoDBClient({
  region: process.env.MY_DYNAMO_REGION!,
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY!,
  },
});

export const ddb = DynamoDBDocumentClient.from(client);
