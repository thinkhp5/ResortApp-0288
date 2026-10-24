import { useMutation } from "@tanstack/react-query";
import { orpc } from "../lib/api";

export function useCreateBooking() {
  return useMutation(orpc.bookings.create.mutationOptions());
}

export function useCreateEnquiry() {
  return useMutation(orpc.enquiries.create.mutationOptions());
}
