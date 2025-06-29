
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";

interface Widget {
  id: string;
  name: string;
  website_url: string;
  button_color: string;
  position: string;
  tooltip: string;
  video_enabled: boolean;
  video_url: string;
  button_style: string;
  custom_icon_url: string;
  show_on_mobile: boolean;
  show_on_desktop: boolean;
  channels: any[];
  total_views: number;
  is_active: boolean;
  created_at: string;
}

interface UserCredits {
  balance: number;
  total_spent: number;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [userCredits, setUserCredits] = useState<UserCredits>({ balance: 0, total_spent: 0 });
  const [loadingWidgets, setLoadingWidgets] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWidgets();
      fetchUserCredits();
    }
  }, [user]);

  const fetchWidgets = async () => {
    try {
      const { data, error } = await supabase
        .from('widgets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWidgets(data || []);
    } catch (error) {
      console.error('Error fetching widgets:', error);
      toast.error('Error loading widgets');
    } finally {
      setLoadingWidgets(false);
    }
  };

  const fetchUserCredits = async () => {
    try {
      const { data, error } = await supabase
        .from('user_credits')
        .select('*')
        .maybeSingle();

      if (error && error.code === 'PGRST116') {
        console.log('No user credits found, creating default record...');
        const { data: newCredits, error: insertError } = await supabase
          .from('user_credits')
          .insert({
            user_id: user?.id,
            balance: 100,
            total_spent: 0
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user credits:', insertError);
          toast.error('Error initializing credits');
          setUserCredits({ balance: 100, total_spent: 0 });
        } else {
          console.log('Created new user credits record:', newCredits);
          setUserCredits(newCredits || { balance: 100, total_spent: 0 });
          toast.success('Credits account initialized');
        }
      } else if (error) {
        console.error('Error fetching credits:', error);
        toast.error('Error loading credits');
        setUserCredits({ balance: 100, total_spent: 0 });
      } else {
        setUserCredits(data || { balance: 100, total_spent: 0 });
      }
    } catch (error) {
      console.error('Unexpected error fetching credits:', error);
      setUserCredits({ balance: 100, total_spent: 0 });
    }
  };

  if (loading || loadingWidgets) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>Please sign in to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => navigate('/')}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader userEmail={user.email || ''} />
        <DashboardStats userCredits={userCredits} widgets={widgets} />
        <DashboardTabs 
          widgets={widgets}
          userCredits={userCredits}
          onRefreshWidgets={fetchWidgets}
          onRefreshCredits={fetchUserCredits}
        />
      </div>
    </div>
  );
};

export default Dashboard;
