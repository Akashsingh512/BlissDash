import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, MessageCircle, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type FollowUp = {
  comment: string;
  date: string;
  whoCalled: string;
};

type Lead = {
  name: string;
  phone: string;
  comment: string;
  location: string;
  whoMet: string;
  date: string;
  timestamp: string;
  status?: string;
  lead_type?: string;
  followUp1?: FollowUp;
  followUp2?: FollowUp;
  followUp3?: FollowUp;
  followUp4?: FollowUp;
  rowNumber?: number;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [userName, setUserName] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [followUpData, setFollowUpData] = useState<FollowUp>({ 
    comment: "", 
    date: new Date().toISOString().split('T')[0], 
    whoCalled: "" 
  });
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [statusLead, setStatusLead] = useState<Lead | null>(null);
  const [statusValue, setStatusValue] = useState("");
  const [customStatus, setCustomStatus] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");

  useEffect(() => {
    checkAuth();
    loadSettings();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    // Get profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", session.user.id)
      .single();

    if (profile?.name) {
      setUserName(profile.name);
      fetchMyLeads(profile.name);
    }
  };

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("sheets-manager", {
        body: { action: "getTemplate" },
      });
      if (error) throw error;
      if (data?.template) setWhatsappMessage(data.template);
    } catch (err) {
      console.error("Error loading template:", err);
    }

    try {
      const { data, error } = await supabase.functions.invoke("sheets-manager", {
        body: { action: "getDefaults" },
      });
      if (error) throw error;
      if (data?.defaults) {
        setMediaUrl(data.defaults.mediaUrl || "");
      }
    } catch (err) {
      console.error("Error loading defaults:", err);
    }
  };

  const fetchMyLeads = async (name: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("sheets-manager", {
        body: { action: "getAll" },
      });
      if (error) throw error;
      
      const allLeads = data.leads || [];
      const myLeads = allLeads.filter((lead: Lead) => lead.whoMet === name);
      setLeads(myLeads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("Failed to load leads");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
    toast.success("Logged out successfully");
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, "_self");
  };

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const phoneWithCountry = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
    const text = `${whatsappMessage}${mediaUrl ? ` ${mediaUrl}` : ''}`;
    const encodedMessage = encodeURIComponent(text);
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const url = isMobile
      ? `https://wa.me/${phoneWithCountry}?text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=${phoneWithCountry}&text=${encodedMessage}`;
    window.open(url, "_blank");
  };

  const addFollowUp = async (lead: Lead) => {
    try {
      const nextFollowUp = !lead.followUp1 ? 'followUp1' :
                          !lead.followUp2 ? 'followUp2' :
                          !lead.followUp3 ? 'followUp3' :
                          !lead.followUp4 ? 'followUp4' : null;

      if (!nextFollowUp) {
        toast.error("Maximum 4 follow-ups reached");
        return;
      }

      const updatedLead = {
        ...lead,
        [nextFollowUp]: { ...followUpData, whoCalled: userName },
      };

      const { error } = await supabase.functions.invoke('sheets-manager', {
        body: { action: 'update', index: updatedLead.rowNumber, lead: updatedLead },
      });

      if (error) throw error;
      toast.success('Follow-up added successfully!');
      setSelectedLead(null);
      setFollowUpData({ comment: "", date: new Date().toISOString().split('T')[0], whoCalled: "" });
      fetchMyLeads(userName);
    } catch (err) {
      console.error('Error adding follow-up:', err);
      toast.error('Failed to add follow-up');
    }
  };

  const updateStatus = async () => {
    if (!statusLead) return;
    
    const finalStatus = statusValue === "custom" ? customStatus : statusValue;
    if (!finalStatus) {
      toast.error("Please enter a status");
      return;
    }

    try {
      const updatedLead = { ...statusLead, status: finalStatus };
      const { error } = await supabase.functions.invoke('sheets-manager', {
        body: { action: 'update', index: updatedLead.rowNumber, lead: updatedLead },
      });
      if (error) throw error;
      toast.success('Status updated successfully!');
      setShowStatusDialog(false);
      setStatusLead(null);
      setStatusValue("");
      setCustomStatus("");
      fetchMyLeads(userName);
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Failed to update status');
    }
  };

  const updateLeadType = async (lead: Lead, newType: string) => {
    try {
      const updatedLead = { ...lead, lead_type: newType };
      const { error } = await supabase.functions.invoke('sheets-manager', {
        body: { action: 'update', index: updatedLead.rowNumber, lead: updatedLead },
      });
      if (error) throw error;
      toast.success('Lead type updated!');
      fetchMyLeads(userName);
    } catch (err) {
      console.error('Error updating lead type:', err);
      toast.error('Failed to update lead type');
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {userName}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>My Leads ({leads.length})</CardTitle>
            <CardDescription>Leads assigned to you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>{lead.phone}</TableCell>
                      <TableCell>
                        <Select
                          value={lead.lead_type || ""}
                          onValueChange={(value) => updateLeadType(lead, value)}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Happiness Course">Happiness Course</SelectItem>
                            <SelectItem value="Meditation Session">Meditation Session</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{lead.date}</TableCell>
                      <TableCell>{lead.location}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setStatusLead(lead);
                            setStatusValue(lead.status || "");
                            setShowStatusDialog(true);
                          }}
                        >
                          {lead.status || "Set Status"}
                          
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCall(lead.phone)}
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleWhatsApp(lead.phone)}
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedLead(lead)}
                          >
                            Follow-up
                          </Button>
                          <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setSelectedLead(lead)}
                                                        title="View details & manage"
                                                        style={{marginRight: "10px"}}
                                                      >
                                                        View
                                                      </Button>
                          
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Follow-up</DialogTitle>
              <DialogDescription>
                Add a follow-up note for {selectedLead?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={followUpData.date}
                  onChange={(e) => setFollowUpData({ ...followUpData, date: e.target.value })}
                />
              </div>
              <div>
                <Label>Comment</Label>
                <Textarea
                  value={followUpData.comment}
                  onChange={(e) => setFollowUpData({ ...followUpData, comment: e.target.value })}
                  placeholder="Enter follow-up notes..."
                  rows={3}
                />
              </div>
              <Button onClick={() => selectedLead && addFollowUp(selectedLead)}>
                Add Follow-up
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Status</DialogTitle>
              <DialogDescription>
                Update status for {statusLead?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Select value={statusValue} onValueChange={setStatusValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Registered">Registered</SelectItem>
                  <SelectItem value="Not Interested">Not Interested</SelectItem>
                  <SelectItem value="Interested but busy">Interested but busy</SelectItem>
                  <SelectItem value="custom">Custom Status</SelectItem>
                </SelectContent>
              </Select>
              {statusValue === "custom" && (
                <Input
                  placeholder="Enter custom status"
                  value={customStatus}
                  onChange={(e) => setCustomStatus(e.target.value)}
                />
              )}
              <Button onClick={updateStatus}>Update Status</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;
