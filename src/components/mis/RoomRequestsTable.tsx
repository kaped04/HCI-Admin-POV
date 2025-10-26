import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

interface Request {
  id: string;
  requester_name: string;
  requester_email: string;
  requested_date: string;
  requested_time_start: string;
  requested_time_end: string;
  purpose: string;
  status: string;
  rooms: { name: string } | null;
}

export const RoomRequestsTable = () => {
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const { data } = await supabase
      .from("room_requests")
      .select(`
        *,
        rooms(name)
      `)
      .order("created_at", { ascending: false });
    if (data) setRequests(data);
  };

  const handleUpdateStatus = async (id: string, status: "approved" | "declined") => {
    try {
      const { error } = await supabase
        .from("room_requests")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      toast.success(`Request ${status} successfully`);
      fetchRequests();
    } catch (error: any) {
      toast.error(error.message || "Failed to update request");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "secondary",
      approved: "default",
      declined: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Requester</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No requests found
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{request.requester_name}</p>
                    <p className="text-xs text-muted-foreground">{request.requester_email}</p>
                  </div>
                </TableCell>
                <TableCell>{request.rooms?.name || "N/A"}</TableCell>
                <TableCell>{new Date(request.requested_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {request.requested_time_start} - {request.requested_time_end}
                </TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell className="text-right">
                  {request.status === "pending" && (
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        onClick={() => handleUpdateStatus(request.id, "approved")}
                      >
                        <Check className="h-3 w-3" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-destructive hover:text-destructive"
                        onClick={() => handleUpdateStatus(request.id, "declined")}
                      >
                        <X className="h-3 w-3" />
                        Decline
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
