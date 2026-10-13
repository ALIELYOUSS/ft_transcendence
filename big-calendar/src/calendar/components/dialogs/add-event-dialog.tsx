"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AlertTriangle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { useDisclosure } from "@/hooks/use-disclosure";
import { useCalendar } from "@/calendar/contexts/calendar-context";

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

import type { TimeValue } from "react-aria-components";
import type { TEventFormData } from "@/calendar/schemas";

interface IProps {
  children: React.ReactNode;
  startDate?: Date;
  startTime?: { hour: number; minute: number };
}

export function AddEventDialog({ children, startDate, startTime }: IProps) {
  const { users, events, setLocalEvents } = useCalendar();

  const { isOpen, onClose, onToggle } = useDisclosure();

  const form = useForm<TEventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      user: "",
      title: "",
      description: "",
      startDate: typeof startDate !== "undefined" ? startDate : undefined,
      startTime: typeof startTime !== "undefined" ? startTime : undefined,
      endDate: typeof startDate !== "undefined" ? startDate : undefined,
      endTime: typeof startTime !== "undefined" ? startTime : undefined,
      color: "yellow",
    },
  });

  const onSubmit = (values: TEventFormData) => {
    const user = users.find(item => item.id === values.user);

    if (!user) {
      form.setError("user", { type: "validate", message: "Select a responsible person." });
      return;
    }

    const eventStart = new Date(values.startDate);
    eventStart.setHours(values.startTime.hour, values.startTime.minute, 0, 0);

    const eventEnd = new Date(values.endDate);
    eventEnd.setHours(values.endTime.hour, values.endTime.minute, 0, 0);

    const nextId = events.reduce((highestId, event) => Math.max(highestId, event.id), 0) + 1;

    setLocalEvents(currentEvents => [
      ...currentEvents,
      {
        id: nextId,
        startDate: eventStart.toISOString(),
        endDate: eventEnd.toISOString(),
        title: values.title,
        color: values.color ?? "yellow",
        description: values.description,
        user,
      },
    ]);

    onClose();
    form.reset();
  };

  useEffect(() => {
    form.reset({
      user: "",
      title: "",
      description: "",
      startDate,
      startTime,
      endDate: startDate,
      endTime: startTime,
      color: "yellow",
    });
  }, [startDate, startTime, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onToggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto rounded-[20px] border-[#ece5dc] bg-[#f8f8f6] text-[#252a37] shadow-[0_20px_50px_rgba(18,22,30,0.12)]">
        <DialogHeader>
          <DialogTitle className="text-[#252a37]">Add New Event</DialogTitle>
          <DialogDescription className="leading-relaxed text-[#767d8d]">
            <AlertTriangle className="mr-1 inline-block size-4 text-[#d99d00]" />
            Bookings are saved in this browser only. They are not shared with other devices.
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
            {form.formState.errors.root?.serverError && <p className="text-sm text-destructive">{form.formState.errors.root.serverError.message}</p>}
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
            Create Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
