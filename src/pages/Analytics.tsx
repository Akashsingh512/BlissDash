import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, TrendingUp, Users } from "lucide-react";

type Lead = {
  date: string;
  status?: string;
  lead_type?: string;
};

const Analytics = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedLeadType, setSelectedLeadType] = useState("all");
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (roleData?.role !== "admin") {
        navigate("/admin");
        return;
      }

      fetchLeads();
    };

    checkAuth();
  }, [navigate]);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("sheets-manager", {
        body: { action: "getAll" },
      });
      if (error) throw error;
      
      const allLeads = data.leads || [];
      setLeads(allLeads);
      setFilteredLeads(allLeads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("Failed to load leads");
    }
  };

  const applyFilters = () => {
    let filtered = [...leads];

    if (startDate && endDate) {
      filtered = filtered.filter(lead => {
        const leadDate = new Date(lead.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return leadDate >= start && leadDate <= end;
      });
    }

    if (selectedLeadType && selectedLeadType !== "all") {
      filtered = filtered.filter(lead => lead.lead_type === selectedLeadType);
    }

    setFilteredLeads(filtered);
  };

  const getTotalLeads = () => filteredLeads.length;

  const getRegisteredLeads = () =>
    filteredLeads.filter(lead => lead.status === "Registered").length;

  const getLeadsByType = (type: string) =>
    filteredLeads.filter(lead => lead.lead_type === type).length;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/admin")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">View lead statistics and insights</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filter Analytics</CardTitle>
            <CardDescription>
              Select date range and lead type to view statistics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Lead Type</Label>
                <Select value={selectedLeadType} onValueChange={setSelectedLeadType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Happiness Course">Happiness Course</SelectItem>
                    <SelectItem value="Meditation Session">Meditation Session</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={applyFilters}>Apply Filters</Button>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-3xl font-bold">{getTotalLeads()}</div>
                  <p className="text-xs text-muted-foreground">All leads</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Registered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div>
                  <div className="text-3xl font-bold">{getRegisteredLeads()}</div>
                  <p className="text-xs text-muted-foreground">
                    {getTotalLeads() > 0
                      ? `${((getRegisteredLeads() / getTotalLeads()) * 100).toFixed(1)}%`
                      : "0%"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Happiness Course</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <span className="text-xl">📚</span>
                </div>
                <div>
                  <div className="text-3xl font-bold">
                    {getLeadsByType("Happiness Course")}
                  </div>
                  <p className="text-xs text-muted-foreground">Course leads</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Meditation Session</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <span className="text-xl">🧘</span>
                </div>
                <div>
                  <div className="text-3xl font-bold">
                    {getLeadsByType("Meditation Session")}
                  </div>
                  <p className="text-xs text-muted-foreground">Session leads</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lead Distribution by Status</CardTitle>
            <CardDescription>Breakdown of lead statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["Registered", "Not Interested", "Interested but busy"].map((status) => {
                const count = filteredLeads.filter(lead => lead.status === status).length;
                const percentage = getTotalLeads() > 0 ? (count / getTotalLeads()) * 100 : 0;
                
                return (
                  <div key={status} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{status}</span>
                      <span className="font-medium">
                        {count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          status === "Registered"
                            ? "bg-green-500"
                            : status === "Not Interested"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
