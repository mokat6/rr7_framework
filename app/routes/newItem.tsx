import { Form, redirect, type ActionFunctionArgs } from "react-router";
import { ddb } from "~/server/db/dynamo";
import { v4 as uuid } from "uuid"; // for unique ID
import { PutCommand } from "@aws-sdk/lib-dynamodb";

export function meta() {
  return [{ title: "muh tydl" }, { name: "description", content: "Create a new item using Dynamo DB" }];
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!title || !description) {
    return { error: "Title and content are required" };
  }

  // Generate a unique ID for the new item
  const id = uuid();

  try {
    // Insert into DynamoDB
    await ddb.send(
      new PutCommand({
        TableName: process.env.DYNAMO_TABLE,
        Item: {
          ppkeylolhahaha: id, // ✅ must match your table's PK name
          title,
          description,
        },
      })
    );
    return redirect("/"); // or redirect somewhere
  } catch (err) {
    console.error(err);
    return { error: (err as Error).message };
  }
}

const newItem = () => {
  return (
    <div>
      <h2 className="text-3xl text-center">Create New Item</h2>

      <Form method="post" className="border max-w-64 mx-auto">
        <div className="flex flex-col gap-10 p-4">
          <label>
            Title
            <input type="text" name="title" required className="border shadow min-w-0 w-full" />
          </label>
          <label>
            Description
            <textarea name="description" required className="border shadow w-full" />
          </label>
        </div>

        <button className="border p-1">Create Item</button>
      </Form>
    </div>
  );
};

export default newItem;
