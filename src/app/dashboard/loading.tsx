import { Spinner } from "@/components/Spinner";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Spinner className="h-10 w-10 border-[3px]" />
    </div>
  );
}
