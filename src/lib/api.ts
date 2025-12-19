import { invoke } from "@tauri-apps/api/core";

export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
}

export async function getEvents(startRange: string, endRange: string): Promise<CalendarEvent[]> {
  return await invoke("get_events", { startRange, endRange });
}

export async function createEvent(title: string, description: string | undefined, start: string, end: string): Promise<number> {
  return await invoke("create_event", { title, description, start, end });
}

export async function deleteEvent(id: number): Promise<void> {
  return await invoke("delete_event", { id });
}
