import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "~/server/db/dynamo";

export async function loader(_args: LoaderFunctionArgs) {
  const result = await ddb.send(
    new ScanCommand({
      TableName: process.env.DYNAMO_TABLE,
    })
  );

  return result.Items ?? [];
}

export default function TodoRoute() {
  const items = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>My Todo Items</h1>
      <pre>{JSON.stringify(items, null, 2)}</pre>
    </div>
  );
}
