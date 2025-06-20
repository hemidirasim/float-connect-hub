
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Save } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Profile {
  full_name: string;
  email: string;
}

export const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile>({
    full_name: '',
    email: user?.email || ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProfile({
          full_name: data.full_name || '',
          email: data.email || user?.email || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleInputChange = (field: keyof Profile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          full_name: profile.full_name,
          email: profile.email,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('Profil yeniləndi!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Profil yenilənməkdə xəta');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Profile yüklənir...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Profil məlumatları
          </CardTitle>
          <CardDescription>Hesab məlumatlarınızı yeniləyin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Tam ad</Label>
              <Input
                id="full_name"
                value={profile.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                placeholder="Adınızı daxil edin"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@example.com"
                  className="pl-10"
                  disabled
                />
              </div>
              <p className="text-xs text-gray-500">Email dəyişdirmək üçün dəstəyə müraciət edin</p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saxlanılır...' : 'Saxla'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hesab məlumatları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">User ID</span>
              <code className="text-sm bg-white px-2 py-1 rounded">{user?.id}</code>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Qeydiyyat tarixi</span>
              <span className="text-sm">{user?.created_at ? new Date(user.created_at).toLocaleDateString('az-AZ') : 'N/A'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
