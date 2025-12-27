import { Link, useLoaderData } from "react-router";
import type { Route } from "./+types/items";
import { GetCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

export function meta() {
  return [{ title: "All your items" }, { name: "description", content: "Manage your items - view, create, update" }];
}

export async function loader() {
  const { ddb } = await import("~/server/db/dynamo");

  try {
    const result = await ddb.send(
      new ScanCommand({
        TableName: process.env.DYNAMO_TABLE, // your table name
      })
    );
    // console.log("xx ", result);
    // result.Items contains the array of items
    return { items: result.Items ?? [] };
  } catch (err) {
    console.error(err);
    return { error: (err as Error).message };
  }
}

const Items = ({ loaderData }: Route.ComponentProps) => {
  console.log("loaderData  , ", loaderData.items);
  const { error, items } = loaderData;

  return (
    <div>
      <h2 className="text-2xl">List of Items</h2>

      {error && <div>{error}</div>}
      <ul className="space-y-3">
        {items?.map((item) => (
          <li className="p-1 pl-4 bg-gray-800">
            <Link to={`/items/${item.ppkeylolhahaha}`}>
              <span className="font-bold"> {item.title}</span>
              <p>{item.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Items;
