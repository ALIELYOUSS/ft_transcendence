"use client";

import { parseISO } from "date-fns";
import { useForm } from "react-hook-form";
import { AlertTriangle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { useDisclosure } from "@/hooks/use-disclosure";
import { useCalendar } from "@/calendar/contexts/calendar-context";
import { useUpdateEvent } from "@/calendar/hooks/use-update-event";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TimeInput } from "@/components/ui/time-input";
import { SingleDayPicker } from "@/components/ui/single-day-picker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormField, FormLabel, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogHeader, DialogClose, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

import { eventSchema } from "@/calendar/schemas";

import type { IEvent } from "@/calendar/interfaces";
import type { TimeValue } from "react-aria-components";
import type { TEventFormData } from "@/calendar/schemas";

interface IProps {
  children: React.ReactNode;
  event: IEvent;
}

export function EditEventDialog({ children, event }: IProps) {
  const { isOpen, onClose, onToggle } = useDisclosure();

  const { users } = useCalendar();

  const { updateEvent } = useUpdateEvent();

  const form = useForm<TEventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      user: event.user.id,
      title: event.title,
      description: event.description,
      startDate: parseISO(event.startDate),
      startTime: { hour: parseISO(event.startDate).getHours(), minute: parseISO(event.startDate).getMinutes() },
      endDate: parseISO(event.endDate),
      endTime: { hour: parseISO(event.endDate).getHours(), minute: parseISO(event.endDate).getMinutes() },
      color: event.color,
    },
  });

  const onSubmit = (values: TEventFormData) => {
    const user = users.find(user => user.id === values.user);

    if (!user) throw new Error("User not found");

    const startDateTime = new Date(values.startDate);
    startDateTime.setHours(values.startTime.hour, values.startTime.minute);

    const endDateTime = new Date(values.endDate);
    endDateTime.setHours(values.endTime.hour, values.endTime.minute);

    updateEvent({
      ...event,
      user,
      title: values.title,
      color: event.color,
      description: values.description,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onToggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto rounded-[20px] border-[#ece5dc] bg-[#f8f8f6] text-[#252a37] shadow-[0_20px_50px_rgba(18,22,30,0.12)]">
        <DialogHeader>
          <DialogTitle className="text-[#252a37]">Edit Event</DialogTitle>
          <DialogDescription className="leading-relaxed text-[#767d8d]">
            <AlertTriangle className="mr-1 inline-block size-4 text-[#d99d00]" />
            This form only updates the current event state locally for demonstration purposes. If you move an event after editing, some inconsistencies may
            occur. In a real application, you should submit this form to a backend API to persist the changes.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id="event-form" onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="user"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Responsible</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className="border-[#dfe3ed] bg-white text-[#3a4253] data-[placeholder]:text-[#767d8d] focus:ring-[#efb92d]"
                        data-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>

                      <SelectContent className="border-[#ece5dc] bg-white text-[#3a4253]">
                        {users.map(user => (
                          <SelectItem key={user.id} value={user.id} className="flex-1 focus:bg-[#eef1f5] focus:text-[#252a37]">
                            <div className="flex items-center gap-2">
                              <Avatar key={user.id} className="size-6">
                                <AvatarImage src={user.picturePath ?? undefined} alt={user.name} />
                                <AvatarFallback className="text-xxs">{user.name[0]}</AvatarFallback>
                              </Avatar>

                              <p className="truncate">{user.name}</p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="title">Title</FormLabel>

                  <FormControl>
                    <Input
                      id="title"
                      placeholder="Enter a title"
                      className="border-[#dfe3ed] bg-white text-[#252a37] placeholder:text-[#767d8d] focus-visible:ring-[#efb92d]"
                      data-invalid={fieldState.invalid}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field, fieldState }) => (
                  <FormItem className="flex-1">
                    <FormLabel htmlFor="startDate">Start Date</FormLabel>

                    <FormControl>
                      <SingleDayPicker
                        id="startDate"
                        value={field.value}
                        onSelect={date => field.onChange(date as Date)}
                        placeholder="Select a date"
                        className="border-[#dfe3ed] bg-white text-[#3a4253] hover:bg-[#f6f7fb] hover:text-[#3a4253] focus-visible:ring-[#efb92d]"
                        data-invalid={fieldState.invalid}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startTime"
                render={({ field, fieldState }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Start Time</FormLabel>

                    <FormControl>
                      <TimeInput
                        value={field.value as TimeValue}
                        onChange={field.onChange}
                        hourCycle={12}
                        dateInputClassName="border-[#dfe3ed] bg-white text-[#3a4253] data-[focus-within]:ring-[#efb92d]"
                        segmentClassName="text-[#3a4253] data-[focused]:bg-[#efb92d]/20 data-[focused]:text-[#252a37] data-[placeholder]:text-[#767d8d]"
                        data-invalid={fieldState.invalid}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="endDate"
                render={({ field, fieldState }) => (
                  <FormItem className="flex-1">
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <SingleDayPicker
                        value={field.value}
                        onSelect={date => field.onChange(date as Date)}
                        placeholder="Select a date"
                        className="border-[#dfe3ed] bg-white text-[#3a4253] hover:bg-[#f6f7fb] hover:text-[#3a4253] focus-visible:ring-[#efb92d]"
                        data-invalid={fieldState.invalid}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field, fieldState }) => (
                  <FormItem className="flex-1">
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <TimeInput
                        value={field.value as TimeValue}
                        onChange={field.onChange}
                        hourCycle={12}
                        dateInputClassName="border-[#dfe3ed] bg-white text-[#3a4253] data-[focus-within]:ring-[#efb92d]"
                        segmentClassName="text-[#3a4253] data-[focused]:bg-[#efb92d]/20 data-[focused]:text-[#252a37] data-[placeholder]:text-[#767d8d]"
                        data-invalid={fieldState.invalid}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>

                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value}
                      className="min-h-[88px] border-[#dfe3ed] bg-white text-[#252a37] placeholder:text-[#767d8d] focus-visible:ring-[#efb92d]"
                      data-invalid={fieldState.invalid}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="border-[#dfe3ed] bg-white text-[#3a4253] hover:bg-[#f6f7fb] hover:text-[#252a37]"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            form="event-form"
            type="submit"
            className="bg-[#efb92d] text-[#282313] shadow-sm hover:bg-[#e7ad1d] focus-visible:ring-[#efb92d]"
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
