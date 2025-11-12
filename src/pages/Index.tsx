import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { queueLead } from "@/offlineQueue";
import { Edit2, Save, X, MessageSquare, Phone, MessageCircle } from "lucide-react";
import { getQueuedLeads, clearQueued } from "@/offlineQueue";


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
};

const Index = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    comment: "",
    location: "",
    whoMet: "",
    date: "",
    lead_type: "",
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState("Hello! I'm reaching out regarding your recent inquiry.");
  const [mediaUrl, setMediaUrl] = useState("");
  const [posterUrl, setPosterUrl] = useState<string>("");

  useEffect(() => {
    fetchRecentLeads();
    loadDefaultSettings();
    loadWhatsappMessage();
     window.addEventListener("online", syncOffline);

  return () => window.removeEventListener("online", syncOffline);
  }, []);

  async function syncOffline() {
  const queued = await getQueuedLeads();
  if (queued.length === 0) return;

  for (const item of queued) {
    await supabase.functions.invoke("sheets-manager", {
      body: { action: "submit", lead: item.lead },
    });
  }

  await clearQueued();
  fetchRecentLeads();
}


  const loadWhatsappMessage = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("sheets-manager", { body: { action: "getTemplate" } });
      if (error) throw error;
      if (data?.template) setWhatsappMessage(data.template);
    } catch (err) {
      const savedMessage = localStorage.getItem("whatsappMessage");
      if (savedMessage) setWhatsappMessage(savedMessage);
    }
  };

  const loadDefaultSettings = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("sheets-manager", {
        body: { action: "getDefaults" },
      });

      if (error) throw error;
      
      if (data.defaults) {
        setFormData(prev => ({ 
          ...prev, 
          date: data.defaults.date || prev.date,
          location: data.defaults.location || prev.location
        }));
        setMediaUrl(data.defaults.mediaUrl || "");
      }
    } catch (error) {
      console.error("Error loading defaults:", error);
    }

    // Fetch poster from settings table
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('poster_url')
        .eq('id', 1)
        .single();
      
      if (data?.poster_url) {
        setPosterUrl(data.poster_url);
      }
    } catch (err) {
      console.error("Error fetching poster:", err);
    }
  };

  const fetchRecentLeads = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("sheets-manager", {
        body: { action: "getRecent" },
      });

      if (error) throw error;
      setRecentLeads(data.leads || []);
    } catch (error) {
      console.error("Error fetching recent leads:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
       const payload = {
  ...formData,
  timestamp: new Date().toISOString(),
};
    try {

      const { data, error } = await supabase.functions.invoke("sheets-manager", {
        body: {
          action: "submit",
          lead: formData,
        },
      });

      if (error) throw error;

      toast.success("Lead submitted successfully!");
      setFormData({
        name: "",
        phone: "",
        comment: "",
        location: "",
        whoMet: "",
        date: "",
        lead_type: "",
      });
      loadDefaultSettings();
      fetchRecentLeads();
    } catch (error) {
      console.error("Error submitting lead:", error);
      await queueLead(payload);
      // await queueLead(formData);
      toast.error("Saved offline — will sync when online");
      if (navigator.onLine) {
    await syncOffline();
  }
      setFormData(prev => ({
    ...prev,
    name: "",
    phone: "",
    comment: "",
    whoMet: ""
  }));

      // toast.error("Failed to submit lead. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditData({ ...recentLeads[index] });
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditData(null);
  };

  const saveEdit = async (index: number) => {
    if (!editData) return;

    try {
      const { error } = await supabase.functions.invoke("sheets-manager", {
        body: {
          action: "update",
          index: recentLeads.length - index,
          lead: editData,
        },
      });

      if (error) throw error;

      toast.success("Lead updated successfully!");
      setEditingIndex(null);
      setEditData(null);
      fetchRecentLeads();
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error("Failed to update lead");
    }
  };

  const getFollowUpCount = (lead: Lead): number => {
    let count = 0;
    if (lead.followUp1) count++;
    if (lead.followUp2) count++;
    if (lead.followUp3) count++;
    if (lead.followUp4) count++;
    return count;
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, "_self");
  };

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const phoneWithCountry = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
    
    // Include poster URL if available
    const posterText = posterUrl ? `\n\nPoster: ${posterUrl}` : '';
    const text = `${whatsappMessage}${mediaUrl ? ` ${mediaUrl}` : ''}${posterText}`;
    
    const encodedMessage = encodeURIComponent(text);
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const url = isMobile
      ? `https://wa.me/${phoneWithCountry}?text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=${phoneWithCountry}&text=${encodedMessage}`;
    window.open(url, "_blank");
  };


  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Art Of Happiness
          </h1>
          <p className="text-muted-foreground">One more drop to Happiness</p>
          <Button
            onClick={() => window.location.href = "/auth"}
            className="bg-black text-white hover:bg-black/90 mt-4"
          >
            Login / Sign Up
          </Button>

        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Submit Lead</CardTitle>
            <CardDescription>Fill in your details below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    placeholder="Enter your location"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whoMet">Who Met *</Label>
                <Select
                  value={formData.whoMet}
                  onValueChange={(value) => setFormData({ ...formData, whoMet: value })}
                  required
                >
                  <SelectTrigger id="whoMet">
                    <SelectValue placeholder="Select who you met" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GuruDev">Jai Guru dev</SelectItem>
                    
                    <SelectItem value="Aakash">Aakash</SelectItem>

                    <SelectItem value="Heli">Heli</SelectItem>
                    <SelectItem value="Arunima Di">Arunima Di</SelectItem>
                    <SelectItem value="Bhavik">Bhavik</SelectItem>
                    <SelectItem value="Bhavika">Bhavika</SelectItem>
                    <SelectItem value="Isha Mishra">Isha Mishra</SelectItem>
                    <SelectItem value="Rahul Bhaiya">Rahul Bhaiya</SelectItem>
                    <SelectItem value="Shubham">Shubham</SelectItem>
                    <SelectItem value="Sugandha Sharma">Sugandha Sharma</SelectItem>
                    <SelectItem value="Aarushi">Aarushi</SelectItem>

                    <SelectItem value="Akanksha Srivastava">Akanksha Srivastava</SelectItem>

                    <SelectItem value="Archish">Archish</SelectItem>

                    <SelectItem value="Mayank">Mayank</SelectItem>
                    <SelectItem value="Swati">Swati</SelectItem>
                    <SelectItem value="Pranav">Pranav</SelectItem>
                    <SelectItem value="Yash">Yash</SelectItem>
                    </SelectContent>
                </Select>

              </div>

              <div className="space-y-2">
                <Label htmlFor="lead-type">Lead Type *</Label>
                <Select
                  value={formData.lead_type}
                  onValueChange={(value) => setFormData({ ...formData, lead_type: value })}
                  required
                >
                  <SelectTrigger id="lead-type">
                    <SelectValue placeholder="Select lead type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Happiness Course">Happiness Course</SelectItem>
                    <SelectItem value="Meditation Session">Meditation Session</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Comment</Label>
                <Textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Any additional comments..."
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Submit Lead"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>Last 10 leads submitted</CardDescription>
          </CardHeader>
          <CardContent>
            {recentLeads.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No recent submissions</p>
            ) : (
              <div className="space-y-3">
                {recentLeads.map((lead, index) => (
                  <Card key={index} className="p-4">
                    {editingIndex === index && editData ? (
                      <div className="space-y-3">
                        <div className="grid md:grid-cols-2 gap-3">
                          <Input
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            placeholder="Name"
                          />
                          <Input
                            value={editData.phone}
                            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                            placeholder="Phone"
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                          <Input
                            type="date"
                            value={editData.date}
                            onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                            placeholder="Date"
                          />
                          <Input
                            value={editData.location}
                            onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                            placeholder="Location"
                          />
                        </div>
                        <Select
                          value={editData.whoMet}
                          onValueChange={(value) => setEditData({ ...editData, whoMet: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GuruDev">Jai Guru dev</SelectItem>
                    
                    <SelectItem value="Aakash">Aakash</SelectItem>

                    <SelectItem value="Heli">Heli</SelectItem>
                    <SelectItem value="Arunima Di">Arunima Di</SelectItem>
                    <SelectItem value="Bhavik">Bhavik</SelectItem>
                    <SelectItem value="Bhavika">Bhavika</SelectItem>
                    <SelectItem value="Isha Mishra">Isha Mishra</SelectItem>
                    <SelectItem value="Rahul Bhaiya">Rahul Bhaiya</SelectItem>
                    <SelectItem value="Shubham">Shubham</SelectItem>
                    <SelectItem value="Sugandha Sharma">Sugandha Sharma</SelectItem>
                    <SelectItem value="Aarushi">Aarushi</SelectItem>

                    <SelectItem value="Akanksha Srivastava">Akanksha Srivastava</SelectItem>

                    <SelectItem value="Archish">Archish</SelectItem>

                    <SelectItem value="Mayank">Mayank</SelectItem>
                    <SelectItem value="Swati">Swati</SelectItem>
                    <SelectItem value="Pranav">Pranav</SelectItem>
                    <SelectItem value="Yash">Yash</SelectItem>
                    </SelectContent>
                        </Select>
                        <Textarea
                          value={editData.comment}
                          onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
                          placeholder="Comment"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => saveEdit(index)}>
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit}>
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold">{lead.name}</span>
                              <span className="text-sm text-muted-foreground">•</span>
                              <span className="text-sm text-muted-foreground">{lead.phone}</span>
                              {getFollowUpCount(lead) > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  {getFollowUpCount(lead)} Follow-up{getFollowUpCount(lead) > 1 ? 's' : ''}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {lead.date} • {lead.location} • Met: {lead.whoMet}
                            </p>
                            {lead.comment && (
                              <p className="text-sm mt-2">{lead.comment}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">{lead.timestamp}</p>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => startEdit(index)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex gap-2 pt-2 border-t">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCall(lead.phone)}
                            className="flex-1">
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleWhatsApp(lead.phone)}
                            className="flex-1">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            WhatsApp
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
