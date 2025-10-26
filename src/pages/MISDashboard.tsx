import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CampusMap } from "@/components/mis/CampusMap";
import { AddRoomDialog } from "@/components/mis/AddRoomDialog";
import { RoomRequestsTable } from "@/components/mis/RoomRequestsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Clock, AlertCircle, CheckCircle } from "lucide-react";

const MISDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRooms: 0,
    pendingRequests: 0,
    availableRooms: 0,
    occupiedRooms: 0,
  });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    checkAuth();
    fetchStats();
  }, [refreshKey]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "mis_admin")
      .single();

    if (!roleData) {
      navigate("/auth");
    }
  };

  const fetchStats = async () => {
    const { data: rooms } = await supabase.from("rooms").select("status");
    const { data: requests } = await supabase
      .from("room_requests")
      .select("status")
      .eq("status", "pending");

    if (rooms) {
      setStats({
        totalRooms: rooms.length,
        availableRooms: rooms.filter((r) => r.status === "available").length,
        occupiedRooms: rooms.filter((r) => r.status === "occupied").length,
        pendingRequests: requests?.length || 0,
      });
    }
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="MIS Dashboard" />
      
      <main className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Rooms"
            value={stats.totalRooms}
            icon={Building2}
            description="All campus rooms"
          />
          <StatsCard
            title="Available Rooms"
            value={stats.availableRooms}
            icon={CheckCircle}
            description="Ready for booking"
          />
          <StatsCard
            title="Pending Requests"
            value={stats.pendingRequests}
            icon={Clock}
            description="Awaiting approval"
          />
          <StatsCard
            title="Occupied Rooms"
            value={stats.occupiedRooms}
            icon={AlertCircle}
            description="Currently in use"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="map" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="map">Campus Map</TabsTrigger>
              <TabsTrigger value="requests">Room Requests</TabsTrigger>
            </TabsList>
            <AddRoomDialog onRoomAdded={handleRefresh} />
          </div>

          <TabsContent value="map" className="space-y-4">
            <CampusMap key={refreshKey} />
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <RoomRequestsTable key={refreshKey} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MISDashboard;
