
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Users, Shield, User } from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  role?: string;
  balance?: number;
  total_spent?: number;
}

export const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
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

      const usersWithRoles = profiles?.map(user => ({
        ...user,
        role: roles?.find(r => r.user_id === user.id)?.role || 'user',
        balance: credits?.find(c => c.user_id === user.id)?.balance || 0,
        total_spent: credits?.find(c => c.user_id === user.id)?.total_spent || 0,
      })) || [];

      setUsers(usersWithRoles);
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
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="w-5 h-5" />
            İstifadəçilər
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-2 text-gray-400">Yüklənir...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
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
  );
};
