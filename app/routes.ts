import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/items.tsx"),
  route("home", "routes/home.tsx"),
  route("new", "routes/newItem.tsx"),
  route("todo", "routes/todo.tsx"),
  route("items/:id", "routes/item.tsx"),
] satisfies RouteConfig;
