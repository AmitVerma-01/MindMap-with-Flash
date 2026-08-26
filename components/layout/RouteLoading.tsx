import { PageLoading } from "@/components/LoadingLottie";

export default function RouteLoading({
  message = "Loading...",
}: {
  message?: string;
}) {
  return <PageLoading message={message} />;
}
