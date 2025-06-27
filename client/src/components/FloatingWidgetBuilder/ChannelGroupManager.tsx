
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Users, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from "sonner";
import { Channel } from './types';
import { platformOptions } from './constants';

interface ChannelGroupManagerProps {
  channels: Channel[];
  onChannelsChange: (channels: Channel[]) => void;
}

export const ChannelGroupManager: React.FC<ChannelGroupManagerProps> = ({
  channels,
  onChannelsChange
}) => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  // Group channels by type for suggestions
  const getChannelsByType = () => {
    const grouped: { [key: string]: Channel[] } = {};
    channels.filter(ch => !ch.isGroup).forEach(channel => {
      if (!grouped[channel.type]) {
        grouped[channel.type] = [];
      }  
      grouped[channel.type].push(channel);
    });
    return grouped;
  };

  const createGroupFromType = (type: string) => {
    const channelsByType = getChannelsByType();
    const typeChannels = channelsByType[type] || [];
    
    if (typeChannels.length < 2) {
      toast.error(`Qrup yaratmaq üçün ən azı 2 ədəd ${type} kanalı olmalıdır`);
      return;
    }

    const platform = platformOptions.find(p => p.value === type);
    const groupId = Date.now().toString();
    
    const newGroup: Channel = {
      id: groupId,
      type: type,
      value: '', // Empty for groups
      label: `${platform?.label || type} Qrupu`,
      isGroup: true,
      groupItems: [...typeChannels],
      displayMode: 'grouped'
    };

    // Remove individual channels and add group
    const remainingChannels = channels.filter(ch => 
      ch.type !== type || ch.isGroup
    );
    
    onChannelsChange([...remainingChannels, newGroup]);
    toast.success(`${platform?.label || type} qrupu yaradıldı!`);
  };

  const ungroupChannel = (groupId: string) => {
    const group = channels.find(ch => ch.id === groupId && ch.isGroup);
    if (!group || !group.groupItems) return;

    // Add individual items back and remove group
    const otherChannels = channels.filter(ch => ch.id !== groupId);
    const individualItems = group.groupItems.map(item => ({
      ...item,
      displayMode: 'individual' as const
    }));
    
    onChannelsChange([...otherChannels, ...individualItems]);
    toast.success('Qrup ləğv edildi');
  };

  const removeFromGroup = (groupId: string, itemId: string) => {
    const updatedChannels = channels.map(channel => {
      if (channel.id === groupId && channel.isGroup && channel.groupItems) {
        const removedItem = channel.groupItems.find(item => item.id === itemId);
        const updatedGroupItems = channel.groupItems.filter(item => item.id !== itemId);
        
        // If only one item left, ungroup entirely
        if (updatedGroupItems.length <= 1) {
          return null; // Will be filtered out
        }
        
        return {
          ...channel,
          groupItems: updatedGroupItems
        };
      }
      return channel;
    }).filter(Boolean) as Channel[];

    // Add the removed item back as individual
    const group = channels.find(ch => ch.id === groupId);
    const removedItem = group?.groupItems?.find(item => item.id === itemId);
    
    if (removedItem) {
      updatedChannels.push({
        ...removedItem,
        displayMode: 'individual'
      });
    }

    onChannelsChange(updatedChannels);
    toast.success('Kanal qrupdan çıxarıldı');
  };

  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const channelsByType = getChannelsByType();
  const groupableTypes = Object.keys(channelsByType).filter(type => 
    channelsByType[type].length >= 2
  );

  return (
    <div className="space-y-4">
      {/* Group Creation Suggestions */}
      {groupableTypes.length > 0 && (
        <Card className="border-dashed border-blue-300 bg-blue-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Qrup Yaratma Təklifləri
            </CardTitle>
            <CardDescription className="text-xs">
              Eyni tip kanalları qruplaşdıra bilərsiniz
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {groupableTypes.map(type => {
                const platform = platformOptions.find(p => p.value === type);
                const count = channelsByType[type].length;
                return (
                  <Button
                    key={type}
                    variant="outline"
                    size="sm"
                    onClick={() => createGroupFromType(type)}
                    className="h-8 text-xs"
                  >
                    <platform.icon className="w-3 h-3 mr-1" style={{ color: platform.color }} />
                    {platform?.label} ({count})
                    <Users className="w-3 h-3 ml-1" />
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Display Groups */}
      {channels.filter(ch => ch.isGroup).map(group => {
        const platform = platformOptions.find(p => p.value === group.type);
        const isExpanded = expandedGroups.includes(group.id);
        
        return (
          <Card key={group.id} className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleGroupExpansion(group.id)}
                    className="h-6 w-6 p-0"
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </Button>
                  <platform.icon className="w-4 h-4" style={{ color: platform?.color }} />
                  <span className="font-medium">{group.label}</span>
                  <Badge variant="secondary" className="text-xs">
                    {group.groupItems?.length || 0} element
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => ungroupChannel(group.id)}
                  className="h-8 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            {isExpanded && group.groupItems && (
              <CardContent className="pt-0">
                <div className="space-y-2 pl-6">
                  {group.groupItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{item.label}</span>
                        <span className="text-xs text-gray-500">{item.value}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromGroup(group.id, item.id)}
                        className="h-6 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};
