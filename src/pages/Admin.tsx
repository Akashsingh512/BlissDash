import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Phone, MessageCircle, LogOut, Calendar, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

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

const Admin = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [whatsappMessage, setWhatsappMessage] = useState(
    "Hello! I'm reaching out regarding your recent inquiry."
  );
  const [loading, setLoading] = useState(true);
  const [defaultDate, setDefaultDate] = useState("");
  const [defaultLocation, setDefaultLocation] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [followUpData, setFollowUpData] = useState<FollowUp>({ comment: "", date: new Date().toISOString().split('T')[0], whoCalled: "" });
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [statusLead, setStatusLead] = useState<Lead | null>(null);
  const [statusValue, setStatusValue] = useState("");
  const [customStatus, setCustomStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterMetBy, setFilterMetBy] = useState("");
  const [filterLeadType, setFilterLeadType] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [currentPosterUrl, setCurrentPosterUrl] = useState<string>("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      // Check if user is admin
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
      loadWhatsappMessage();
      loadDefaultSettings();
    };

    checkAuth();
  }, [navigate]);

  const loadDefaultSettings = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("sheets-manager", {
        body: { action: "getDefaults" },
      });
      if (error) throw error;
      if (data?.defaults) {
        setDefaultDate(data.defaults.date || "");
        setDefaultLocation(data.defaults.location || "");
        setMediaUrl(data.defaults.mediaUrl || "");
      }
    } catch (err) {
      console.error("Error loading defaults:", err);
    }

    // Fetch poster from settings table
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('poster_url')
        .eq('id', 1)
        .single();
      
      if (data?.poster_url) {
        setCurrentPosterUrl(data.poster_url);
      }
    } catch (err) {
      console.error("Error fetching poster:", err);
    }
  };

  const saveDefaultSettings = async () => {
    await saveDefaultsToBackend();
  };

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
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...leads];
    
    if (filterDate) {
      filtered = filtered.filter(lead => lead.date === filterDate);
    }
    
    if (filterStatus && filterStatus !== "all") {
      filtered = filtered.filter(lead => lead.status === filterStatus);
    }
    
    if (filterLocation) {
      filtered = filtered.filter(lead => 
        lead.location?.toLowerCase().includes(filterLocation.toLowerCase())
      );
    }

    if (filterMetBy) {
      filtered = filtered.filter(lead => 
        lead.whoMet?.toLowerCase().includes(filterMetBy.toLowerCase())
      );
    }

    if (filterLeadType && filterLeadType !== "all") {
      filtered = filtered.filter(lead => lead.lead_type === filterLeadType);
    }
    
    setFilteredLeads(filtered);
  };

  const clearFilters = () => {
    setFilterDate("");
    setFilterStatus("all");
    setFilterLocation("");
    setFilterMetBy("");
    setFilterLeadType("");
    setFilteredLeads(leads);
  };

  const updateLeadStatus = async (lead: Lead, status: string) => {
    try {
      const updatedLead = { ...lead, status };
      const { error } = await supabase.functions.invoke('sheets-manager', {
        body: { action: 'update', index: updatedLead.rowNumber, lead: updatedLead },
      });
      if (error) throw error;
      toast.success('Status updated successfully!');
      fetchLeads();
      setShowStatusDialog(false);
      setStatusLead(null);
      setStatusValue("");
      setCustomStatus("");
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Failed to update status');
    }
  };

  const loadWhatsappMessage = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("sheets-manager", {
        body: { action: "getTemplate" },
      });
      if (error) throw error;
      if (data?.template) setWhatsappMessage(data.template);
    } catch (err) {
      // fallback to localStorage if backend not set yet
      const savedMessage = localStorage.getItem("whatsappMessage");
      if (savedMessage) setWhatsappMessage(savedMessage);
    }
  };

  const saveWhatsappMessage = async () => {
    try {
      const { error } = await supabase.functions.invoke("sheets-manager", {
        body: { action: "saveTemplate", template: whatsappMessage },
      });
      if (error) throw error;
      toast.success("WhatsApp message template updated for all users");
    } catch (err) {
      console.error("Error saving template:", err);
      toast.error("Failed to save template");
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

  const saveDefaultsToBackend = async () => {
    try {
      const { error } = await supabase.functions.invoke("sheets-manager", {
        body: {
          action: "saveDefaults",
          defaults: { date: defaultDate, location: defaultLocation, mediaUrl },
        },
      });

      if (error) throw error;

      localStorage.setItem("defaultDate", defaultDate);
      localStorage.setItem("defaultLocation", defaultLocation);
      toast.success("Default settings saved and synced for all users");
    } catch (error) {
      console.error("Error saving defaults:", error);
      toast.error("Failed to save defaults");
    }
  };

  const handlePosterUpload = async () => {
    if (!posterFile) {
      toast.error("Please select an image first");
      return;
    }

    try {
      // Upload to storage
      const fileExt = posterFile.name.split('.').pop();
      const fileName = `poster-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('posters')
        .upload(fileName, posterFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('posters')
        .getPublicUrl(fileName);

      // Save to settings table
      const { error: updateError } = await supabase
        .from('settings')
        .upsert({
          id: 1,
          poster_url: publicUrl,
          updated_at: new Date().toISOString()
        });

      if (updateError) throw updateError;

      setCurrentPosterUrl(publicUrl);
      setPosterFile(null);
      toast.success("Poster uploaded successfully!");
    } catch (error) {
      console.error("Error uploading poster:", error);
      toast.error("Failed to upload poster");
    }
  };


  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/analytics")}>
              Analytics
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Message Template</CardTitle>
              <CardDescription>
                Customize the default message sent via WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp-template">Message Template</Label>
                <Textarea
                  id="whatsapp-template"
                  value={whatsappMessage}
                  onChange={(e) => setWhatsappMessage(e.target.value)}
                  placeholder="Enter default WhatsApp message"
                  rows={3}
                />
              </div>
              <Button onClick={saveWhatsappMessage}>Save Template</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Default Settings</CardTitle>
              <CardDescription>
                Set default date, location and an optional media URL (shared in WhatsApp message)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-date">Default Date</Label>
                <div className="flex gap-2">
                  <Calendar className="h-4 w-4 mt-2 text-muted-foreground" />
                  <Input
                    id="default-date"
                    type="date"
                    value={defaultDate}
                    onChange={(e) => setDefaultDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="default-location">Default Location</Label>
                <div className="flex gap-2">
                  <MapPin className="h-4 w-4 mt-2 text-muted-foreground" />
                  <Input
                    id="default-location"
                    value={defaultLocation}
                    onChange={(e) => setDefaultLocation(e.target.value)}
                    placeholder="Enter default location"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="media-url">WhatsApp Media URL (optional)</Label>
                <Input
                  id="media-url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="Paste image/video/file URL to append in WhatsApp"
                />
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <Label>WhatsApp Poster Upload</Label>
                <p className="text-sm text-muted-foreground">Upload a poster image to share with WhatsApp messages</p>
                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
                  />
                  <Button onClick={handlePosterUpload} disabled={!posterFile}>
                    Upload
                  </Button>
                </div>
                {currentPosterUrl && (
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-2">Current Poster:</p>
                    <img src={currentPosterUrl} alt="Current poster" className="max-w-xs rounded-lg border shadow-sm" />
                  </div>
                )}
              </div>
              
              <Button onClick={saveDefaultSettings}>Save Defaults</Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Leads</CardTitle>
                <CardDescription>Complete list of submitted leads ({filteredLeads.length} {filterDate || filterStatus || filterLocation ? 'filtered' : 'total'})</CardDescription>
              </div>
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
            </div>
            {showFilters && (
              <div className="mt-4 p-4 border rounded-lg space-y-3">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>Filter by Date</Label>
                    <Input
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      placeholder="Select date"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Filter by Status</Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="Registered">Registered</SelectItem>
                        <SelectItem value="Not Interested">Not Interested</SelectItem>
                        <SelectItem value="Interested but busy">Interested but busy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Filter by Location</Label>
                    <Input
                      value={filterLocation}
                      onChange={(e) => setFilterLocation(e.target.value)}
                      placeholder="Enter location"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Filter by Met By</Label>
                    <Input
                      value={filterMetBy}
                      onChange={(e) => setFilterMetBy(e.target.value)}
                      placeholder="Enter name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Filter by Lead Type</Label>
                    <Select value={filterLeadType} onValueChange={setFilterLeadType}>
                      <SelectTrigger>
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        <SelectItem value="Happiness Course">Happiness Course</SelectItem>
                        <SelectItem value="Meditation Session">Meditation Session</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={applyFilters} size="sm">Apply Filters</Button>
                  <Button onClick={clearFilters} variant="outline" size="sm">Clear Filters</Button>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground">Loading leads...</p>
            ) : filteredLeads.length === 0 ? (
              <p className="text-center text-muted-foreground">No leads found</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Comment</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Who Met</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map((lead, index) => {
                      const followUpCount = [lead.followUp1, lead.followUp2, lead.followUp3, lead.followUp4].filter(Boolean).length;
                      
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{lead.name}</TableCell>
                          <TableCell>{lead.phone}</TableCell>
                          <TableCell className="max-w-xs">
                            <div className="flex items-center gap-2">
                              <span className="truncate">{lead.comment}</span>
                              {followUpCount > 0 && (
                                <Badge variant="secondary" className="shrink-0 text-xs">
                                  +{followUpCount}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {lead.lead_type ? (
                              <Badge variant="outline">{lead.lead_type}</Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>{lead.date}</TableCell>
                          <TableCell>{lead.location}</TableCell>
                          <TableCell>{lead.whoMet}</TableCell>
                          <TableCell>
                            {lead.status ? (
                              <Badge variant={
                                lead.status === 'Registered' ? 'default' : 
                                lead.status === 'Not Interested' ? 'destructive' : 
                                'secondary'
                              }>
                                {lead.status}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedLead(lead)}
                              title="View details & manage"
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          </Card>


          {/* Follow-up Dialog */}
          <Dialog open={selectedLead !== null} onOpenChange={(open) => !open && setSelectedLead(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Lead Details & Follow-ups</DialogTitle>
                <DialogDescription>
                  View complete lead information, manage status, and add follow-ups
                </DialogDescription>
              </DialogHeader>
              {selectedLead && (
                <div className="space-y-6">
                  <div className="space-y-3 p-4 bg-muted rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="font-semibold">Name:</span> {selectedLead.name}</div>
                      <div><span className="font-semibold">Phone:</span> {selectedLead.phone}</div>
                      <div><span className="font-semibold">Date:</span> {selectedLead.date}</div>
                      <div><span className="font-semibold">Location:</span> {selectedLead.location}</div>
                      <div className="col-span-2"><span className="font-semibold">Who Met:</span> {selectedLead.whoMet}</div>
                      <div className="col-span-2">
                        <span className="font-semibold">Lead Type:</span>
                        <Select
                          value={selectedLead.lead_type || ""}
                          onValueChange={async (value) => {
                            try {
                              const updatedLead = { ...selectedLead, lead_type: value };
                              const { error } = await supabase.functions.invoke('sheets-manager', {
                                body: { action: 'update', index: updatedLead.rowNumber, lead: updatedLead },
                              });
                              if (error) throw error;
                              toast.success('Lead type updated!');
                              setSelectedLead(updatedLead);
                              fetchLeads();
                            } catch (err) {
                              console.error('Error updating lead type:', err);
                              toast.error('Failed to update lead type');
                            }
                          }}
                        >
                          <SelectTrigger className="w-[200px] mt-2">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Happiness Course">Happiness Course</SelectItem>
                            <SelectItem value="Meditation Session">Meditation Session</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {selectedLead.comment && (
                        <div className="col-span-2"><span className="font-semibold">Comment:</span> {selectedLead.comment}</div>
                      )}
                    </div>
                  </div>

                  {/* Status Management */}
                  <div className="space-y-3 p-4 border rounded-lg">
                    <h3 className="font-semibold">Lead Status</h3>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Current Status</Label>
                        {selectedLead.status ? (
                          <Badge variant={
                            selectedLead.status === 'Registered' ? 'default' : 
                            selectedLead.status === 'Not Interested' ? 'destructive' : 
                            'secondary'
                          }>
                            {selectedLead.status}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">Not set</span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Update Status</Label>
                        <Select value={statusValue} onValueChange={setStatusValue}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Registered">Registered</SelectItem>
                            <SelectItem value="Not Interested">Not Interested</SelectItem>
                            <SelectItem value="Interested but busy">Interested but busy this time</SelectItem>
                            <SelectItem value="Other">Other (custom)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {statusValue === "Other" && (
                        <div className="space-y-2">
                          <Label>Custom Status</Label>
                          <Input
                            value={customStatus}
                            onChange={(e) => setCustomStatus(e.target.value)}
                            placeholder="Enter custom status"
                          />
                        </div>
                      )}
                      {statusValue && (
                        <Button 
                          onClick={() => {
                            const finalStatus = statusValue === "Other" ? customStatus : statusValue;
                            updateLeadStatus(selectedLead, finalStatus);
                          }}
                          className="w-full"
                          disabled={!statusValue || (statusValue === "Other" && !customStatus)}
                        >
                          Save Status
                        </Button>
                      )}
                    </div>
                  </div>

                  {(selectedLead.followUp1 || selectedLead.followUp2 || selectedLead.followUp3 || selectedLead.followUp4) && (
                    <div className="space-y-3">
                      <h3 className="font-semibold">Follow-up History ({[selectedLead.followUp1, selectedLead.followUp2, selectedLead.followUp3, selectedLead.followUp4].filter(Boolean).length} comments)</h3>
                      {[selectedLead.followUp1, selectedLead.followUp2, selectedLead.followUp3, selectedLead.followUp4]
                        .map((fu, i) => fu && (
                          <Card key={i} className="p-3 bg-muted/50">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Badge variant="outline">Follow-up {i + 1}</Badge>
                                <span className="text-muted-foreground">{fu.date}</span>
                                <span className="text-muted-foreground">• By: {fu.whoCalled}</span>
                              </div>
                              <p className="text-sm">{fu.comment}</p>
                            </div>
                          </Card>
                        ))}
                    </div>
                  )}

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-semibold">Add New Follow-up</h3>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="followup-date">Date</Label>
                        <Input
                          id="followup-date"
                          type="date"
                          value={followUpData.date}
                          onChange={(e) => setFollowUpData({ ...followUpData, date: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="followup-who">Who Called</Label>
                        <Input
                          id="followup-who"
                          value={followUpData.whoCalled}
                          onChange={(e) => setFollowUpData({ ...followUpData, whoCalled: e.target.value })}
                          placeholder="Enter name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="followup-comment">Comment</Label>
                        <Textarea
                          id="followup-comment"
                          value={followUpData.comment}
                          onChange={(e) => setFollowUpData({ ...followUpData, comment: e.target.value })}
                          placeholder="Enter follow-up notes"
                          rows={4}
                        />
                      </div>
                      <Button onClick={async () => {
                        if (!selectedLead) return;
                        const updatedLead: Lead = { ...selectedLead };
                        if (!updatedLead.followUp1) updatedLead.followUp1 = followUpData;
                        else if (!updatedLead.followUp2) updatedLead.followUp2 = followUpData;
                        else if (!updatedLead.followUp3) updatedLead.followUp3 = followUpData;
                        else if (!updatedLead.followUp4) updatedLead.followUp4 = followUpData;
                        else { toast.error('Maximum 4 follow-ups reached'); return; }
                        try {
                          const { error } = await supabase.functions.invoke('sheets-manager', {
                            body: { action: 'update', index: updatedLead.rowNumber, lead: updatedLead },
                          });
                          if (error) throw error;
                          toast.success('Follow-up added successfully!');
                          setSelectedLead(null);
                          setFollowUpData({ comment: "", date: new Date().toISOString().split('T')[0], whoCalled: "" });
                          fetchLeads();
                        } catch (err) {
                          console.error('Error saving follow-up:', err);
                          toast.error('Failed to save follow-up');
                        }
                      }} className="w-full">Save Follow-up</Button>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => handleCall(selectedLead.phone)}
                      className="flex-1"
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => handleWhatsApp(selectedLead.phone)}
                      className="flex-1"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
      </div>
    </div>
  );
};

export default Admin;
