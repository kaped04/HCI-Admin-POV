import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface Room {
  id: string;
  name: string;
  room_type: string;
  capacity: number;
  department: string;
  status: "available" | "occupied" | "pending";
  latitude: number | null;
  longitude: number | null;
}

export const CampusMap = () => {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const { data } = await supabase
      .from("rooms")
      .select("*")
      .order("name");
    if (data) setRooms(data as Room[]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-success";
      case "pending":
        return "bg-warning";
      case "occupied":
        return "bg-destructive";
      default:
        return "bg-muted";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "available":
        return "default";
      case "pending":
        return "secondary";
      case "occupied":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="relative w-full h-[600px] rounded-lg border bg-card overflow-hidden">
      {/* Interactive Campus Map Visualization */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-background p-8">
        <div className="grid grid-cols-4 gap-6 h-full">
          {rooms.map((room, index) => (
            <Card
              key={room.id}
              className="relative hover:shadow-lg transition-all cursor-pointer group"
              style={{
                gridColumn: (index % 4) + 1,
                gridRow: Math.floor(index / 4) + 1,
              }}
            >
              <div className="absolute -top-2 -right-2 z-10">
                <div className={`w-4 h-4 rounded-full ${getStatusColor(room.status)} ring-2 ring-background`} />
              </div>
              
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                      {room.name}
                    </h3>
                    <p className="text-xs text-muted-foreground capitalize">
                      {room.room_type.replace("_", " ")}
                    </p>
                  </div>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Capacity: {room.capacity}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {room.department}
                  </p>
                </div>
                
                <Badge variant={getStatusBadgeVariant(room.status)} className="text-xs">
                  {room.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card border rounded-lg p-3 shadow-lg">
        <p className="text-xs font-semibold mb-2">Status Legend</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-xs">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning" />
            <span className="text-xs">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <span className="text-xs">Occupied</span>
          </div>
        </div>
      </div>
    </div>
  );
};
