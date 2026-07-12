import { redirect } from "next/navigation";

export default async function NewTemplatePage() {
  redirect("/templates/new");
}
