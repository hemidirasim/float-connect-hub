
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Users, Shield, User, Activity, CreditCard } from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  role?: string;
  balance?: number;
  total_spent?: number;
  total_widgets?: number;
  last_login?: string;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  totalCredits: number;
}

export const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    totalCredits: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          created_at
        `);

      if (profilesError) throw profilesError;

      // Get user roles
      const { data: roles } = await supabase
        .from('user_roles')
        .select('user_id, role');

      // Get user credits
      const { data: credits } = await supabase
        .from('user_credits')
        .select('user_id, balance, total_spent');

      // Get widget counts per user
      const { data: widgetCounts } = await supabase
        .from('widgets')
        .select('user_id');

      // Count widgets per user
      const widgetCountMap = widgetCounts?.reduce((acc, widget) => {
        acc[widget.user_id] = (acc[widget.user_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const usersWithRoles = profiles?.map(user => ({
        ...user,
        role: roles?.find(r => r.user_id === user.id)?.role || 'user',
        balance: credits?.find(c => c.user_id === user.id)?.balance || 0,
        total_spent: credits?.find(c => c.user_id === user.id)?.total_spent || 0,
        total_widgets: widgetCountMap[user.id] || 0,
      })) || [];

      setUsers(usersWithRoles);

      // Calculate stats
      const totalCredits = credits?.reduce((sum, c) => sum + (c.balance || 0), 0) || 0;
      const adminCount = roles?.filter(r => r.role === 'admin').length || 0;
      
      setStats({
        totalUsers: usersWithRoles.length,
        activeUsers: usersWithRoles.filter(u => u.balance > 0 || u.total_widgets > 0).length,
        adminUsers: adminCount,
        totalCredits
      });

    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Xəta",
        description: "İstifadəçilər yüklənərkən xəta baş verdi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      if (newRole === 'user') {
        // Remove admin/moderator role
        await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .in('role', ['admin', 'moderator']);
      } else {
        // Upsert new role
        await supabase
          .from('user_roles')
          .upsert({
            user_id: userId,
            role: newRole
          });
      }

      toast({
        title: "Uğurlu",
        description: "İstifadəçi rolu yeniləndi",
      });

      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Xəta",
        description: "İstifadəçi rolu yenilənərkən xəta baş verdi",
        variant: "destructive",
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'moderator':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-3 h-3" />;
      case 'moderator':
        return <Users className="w-3 h-3" />;
      default:
        return <User className="w-3 h-3" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-600 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-600 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
              <p className="mt-2 text-gray-400">Yüklənir...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Ümumi İstifadəçi</p>
                <p className="text-2xl font-bold text-blue-400">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Aktiv İstifadəçi</p>
                <p className="text-2xl font-bold text-green-400">{stats.activeUsers}</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Admin/Moderator</p>
                <p className="text-2xl font-bold text-red-400">{stats.adminUsers}</p>
              </div>
              <Shield className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Ümumi Kredit</p>
                <p className="text-2xl font-bold text-purple-400">{stats.totalCredits}</p>
              </div>
              <CreditCard className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="w-5 h-5" />
            İstifadəçilər ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Ad</TableHead>
                  <TableHead className="text-gray-300">Email</TableHead>
                  <TableHead className="text-gray-300">Rol</TableHead>
                  <TableHead className="text-gray-300">Balans</TableHead>
                  <TableHead className="text-gray-300">Xərclənən</TableHead>
                  <TableHead className="text-gray-300">Widget-lər</TableHead>
                  <TableHead className="text-gray-300">Qeydiyyat Tarixi</TableHead>
                  <TableHead className="text-gray-300">Əməliyyatlar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="border-gray-700 hover:bg-gray-750">
                    <TableCell className="font-medium text-white">{user.full_name || 'Ad yoxdur'}</TableCell>
                    <TableCell className="text-gray-300">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleColor(user.role!)} className="flex items-center gap-1 w-fit">
                        {getRoleIcon(user.role!)}
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">{user.balance} kredit</TableCell>
                    <TableCell className="text-gray-300">{user.total_spent} kredit</TableCell>
                    <TableCell className="text-gray-300">{user.total_widgets}</TableCell>
                    <TableCell className="text-gray-300">{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(value) => updateUserRole(user.id, value)}
                      >
                        <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="user" className="text-white">User</SelectItem>
                          <SelectItem value="moderator" className="text-white">Moderator</SelectItem>
                          <SelectItem value="admin" className="text-white">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
