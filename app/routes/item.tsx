import React from "react";
import type { Route } from "./+types/item";
import { Form, redirect, type ActionFunctionArgs } from "react-router";
import { DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `edit item ${params.id}` },
    { name: "description", content: "Edit or delete an item using Dynamo DB" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const { ddb } = await import("~/server/db/dynamo"); // <-- safe
  const { GetCommand } = await import("@aws-sdk/lib-dynamodb");

  const { id } = params;

  if (!id)
    return {
      error: "No item found.",
    };

  try {
    const result = await ddb.send(
      new GetCommand({
        TableName: process.env.DYNAMO_TABLE, // your DynamoDB table name
        Key: {
          ppkeylolhahaha: id, // must match your table's PK
        },
      })
    );

    if (!result.Item) {
      return { error: "Item not found." };
    }

    return { item: result.Item };
  } catch (err) {
    console.error(err);
    return { error: (err as Error).message };
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { ddb } = await import("~/server/db/dynamo"); // server-only import
  const { id } = params;

  const formData = await request.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const intent = formData.get("intent");

  try {
    if (intent === "delete") {
      // Delete item
      await ddb.send(
        new DeleteCommand({
          TableName: process.env.DYNAMO_TABLE,
          Key: { ppkeylolhahaha: id },
        })
      );
      return redirect("/"); // go back to items list
    }

    if (intent === "update") {
      if (!title || !description) {
        return { error: "Title and description are required" };
      }

      // Update item
      await ddb.send(
        new UpdateCommand({
          TableName: process.env.DYNAMO_TABLE,
          Key: { ppkeylolhahaha: id },
          UpdateExpression: "SET #t = :title, #d = :desc",
          ExpressionAttributeNames: {
            "#t": "title",
            "#d": "description",
          },
          ExpressionAttributeValues: {
            ":title": title,
            ":desc": description,
          },
        })
      );
      return { updated: true };
    }

    return { error: "Unknown intent" };
  } catch (err) {
    console.error(err);
    return { error: (err as Error).message };
  }

  return {};
}

const Item = ({ loaderData, actionData }: Route.ComponentProps) => {
  if (!loaderData?.item) return <div>Item not found</div>;

  const { ppkeylolhahaha, title, description } = loaderData.item;

  return (
    <div>
      <h2 className="text-2xl font-bold text-indigo-400 mb-4">Edit item</h2>
      {actionData?.updated && (
        <div className="bg-green-300 text-green-700 p-2 mb-4  rounded">Item updated successfully!</div>
      )}

      <Form method="post" className="border max-w-64 mx-auto">
        <div className="flex flex-col gap-10 p-4">
          <label>
            Title
            <input type="text" defaultValue={title} name="title" required className="border shadow min-w-0 w-full" />
          </label>
          <label>
            Description
            <textarea name="description" defaultValue={description} required className="border shadow w-full" />
          </label>
        </div>

        <button type="submit" value="update" className="border p-1" name="intent">
          Update Item
        </button>
        <button type="submit" value="delete" className="border p-1" name="intent">
          Delete item
        </button>
      </Form>
    </div>
  );
};

export default Item;
