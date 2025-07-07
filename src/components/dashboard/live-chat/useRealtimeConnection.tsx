import { supabase } from "@/integrations/supabase/client";

export const useRealtimeConnection = () => {
  const setupRealtimeChannel = (
    channelName: string,
    table: string,
    filter?: string,
    onEvent?: (payload: any) => void
  ) => {
    console.log(`Setting up realtime channel: ${channelName} for table: ${table}`);
    
    const channelConfig: any = {
      event: '*',
      schema: 'public',
      table: table,
    };
    
    if (filter) {
      channelConfig.filter = filter;
    }

    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', channelConfig, (payload) => {
        console.log(`Realtime event on ${table}:`, payload);
        if (onEvent) {
          onEvent(payload);
        }
      })
      .subscribe((status, err) => {
        console.log(`Subscription status for ${channelName}:`, status);
        if (err) {
          console.error(`Subscription error for ${channelName}:`, err);
        }
        if (status === 'SUBSCRIBED') {
          console.log(`Successfully subscribed to ${channelName}`);
        }
      });

    return channel;
  };

  const cleanupChannel = (channel: any) => {
    if (channel) {
      console.log('Cleaning up realtime channel');
      supabase.removeChannel(channel);
    }
  };

  return {
    setupRealtimeChannel,
    cleanupChannel
  };
};