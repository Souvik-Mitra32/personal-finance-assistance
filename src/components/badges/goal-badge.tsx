import { GoalStatus } from "@/lib/validators/goal"
import { Badge } from "../ui/badge"

export default function GoalBadge({
  status,
}: {
  status: GoalStatus | "expired" | "completed"
}) {
  const variant =
    status === "paused"
      ? "outline"
      : status === "completed"
        ? "success"
        : status === "expired"
          ? "destructive"
          : "default"

  return <Badge variant={variant}>{status}</Badge>
}
