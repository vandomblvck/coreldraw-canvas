import { Crosshair, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export type TimelineEvent = {
  status: string;
  title: string;
  description: string;
  created_at: string;
};

const statusCopy: Record<string, { label: string; description: string }> = {
  sent: { label: "Sent", description: "Your money transfer has been sent." },
  in_progress: { label: "In progress", description: "Your money transfer is being processed." },
  delivered: { label: "Delivered", description: "The money transfer has been delivered to the receiver." },
  on_hold: { label: "On hold", description: "This transfer is on hold. Please contact support for more information." },
  cancelled: { label: "Cancelled", description: "This transfer has been cancelled." },
  failed: { label: "Failed", description: "We couldn't complete this transfer. Please contact support for more information." },
  available_for_pickup: { label: "Available for pickup", description: "Your money transfer is available for pickup." },
};

function normalize(status: string) {
  const key = status.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return key === "completed" ? "delivered" : key === "inprogress" ? "in_progress" : key;
}

export function TransferTimeline({
  mtcn, status, statusDetail, events, onReset,
}: {
  mtcn: string;
  status: string;
  statusDetail: string;
  events: TimelineEvent[];
  onReset: () => void;
}) {
  const currentKey = normalize(status);
  const current = statusCopy[currentKey] ?? { label: "Status update", description: "Please contact support for the latest information about your transfer." };
  const ordered = events.map((event) => ({ ...event, key: normalize(event.status) }));
  // The current transfer status is authoritative even if an older transfer has no matching event yet.
  if (ordered.at(-1)?.key !== currentKey) ordered.push({ status, title: current.label, description: "", created_at: "", key: currentKey });
  const steps = ordered.map((event, index) => ({
    label: statusCopy[event.key]?.label ?? "Status update",
    state: index === ordered.length - 1 ? "current" : "complete",
    key: `${event.created_at}-${index}`,
  }));
  const description = statusDetail.trim() || ordered.at(-1)?.description.trim() || current.description;

  return <section className="track-timeline-result" aria-label="Transfer status" role="status">
    <div className="track-timeline-reference">Tracking # (MTCN): <strong>{mtcn}</strong></div>
    <div className="track-timeline-body">
      <ol className="track-timeline-steps" aria-label="Transfer history">
        {steps.map((step) => <li key={step.key} className={`track-timeline-step track-timeline-step-${step.state}`} aria-current={step.state === "current" ? "step" : undefined}>
          <span className="track-timeline-marker" aria-hidden="true">{step.state === "complete" ? <span className="track-timeline-check">✓</span> : <span className="track-timeline-dot" />}</span>
          <span className="track-timeline-label">{step.label}</span>
        </li>)}
      </ol>
      <div className="track-timeline-message"><h2>Status</h2><p>{description}</p></div>
    </div>
    <div className="track-timeline-actions">
      <a href="https://www.westernunion.com/us/en/find-locations.html" className="track-timeline-action"><MapPin aria-hidden="true"/><span>Find a location</span></a>
      <Button type="button" variant="ghost" className="track-timeline-action" onClick={onReset}><Crosshair aria-hidden="true"/><span>Track a new transfer</span></Button>
    </div>
  </section>;
}