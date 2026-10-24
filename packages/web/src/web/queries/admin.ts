import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "../lib/api";

export function useAdminMe(enabled: boolean) {
  return useQuery(orpc.admin.me.queryOptions({ enabled, retry: false }));
}
export function useAdminLogin() {
  return useMutation(orpc.admin.login.mutationOptions());
}
export function useAdminStats() {
  return useQuery(orpc.admin.stats.queryOptions({ refetchInterval: 5000 }));
}
export function useAdminConversations(filter: "all" | "human" | "waiting" | "closed") {
  return useQuery(orpc.admin.conversations.queryOptions({ input: { filter }, refetchInterval: 4000 }));
}
export function useAdminConversation(id: string | null) {
  return useQuery(
    orpc.admin.conversation.queryOptions({
      input: { id: id ?? "", afterId: 0 },
      enabled: !!id,
      refetchInterval: 2500,
    }),
  );
}
function useInvalidateAdmin() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: orpc.admin.key() });
}
export function useAdminReply() {
  const inv = useInvalidateAdmin();
  return useMutation(orpc.admin.reply.mutationOptions({ onSuccess: inv }));
}
export function useAdminSetMode() {
  const inv = useInvalidateAdmin();
  return useMutation(orpc.admin.setMode.mutationOptions({ onSuccess: inv }));
}
export function useAdminSetStatus() {
  const inv = useInvalidateAdmin();
  return useMutation(orpc.admin.setStatus.mutationOptions({ onSuccess: inv }));
}
export function useAdminBookings(status: "all" | "new" | "confirmed" | "declined" | "cancelled") {
  return useQuery(orpc.admin.bookings.queryOptions({ input: { status }, refetchInterval: 10000 }));
}
export function useAdminUpdateBooking() {
  const qc = useQueryClient();
  return useMutation(
    orpc.admin.updateBooking.mutationOptions({
      onMutate: async ({ id, status }) => {
        const keys = qc.getQueriesData({ queryKey: orpc.admin.bookings.key() });
        for (const [key, data] of keys)
          qc.setQueryData(key, (data as { id: number }[] | undefined)?.map((b) => (b.id === id ? { ...b, status } : b)));
      },
      onSettled: () => qc.invalidateQueries({ queryKey: orpc.admin.key() }),
    }),
  );
}
export function useAdminEnquiries() {
  return useQuery(orpc.admin.enquiries.queryOptions({ refetchInterval: 15000 }));
}
export function useAdminMarkEnquiry() {
  const inv = useInvalidateAdmin();
  return useMutation(orpc.admin.markEnquiry.mutationOptions({ onSuccess: inv }));
}
