import { Dispatcher } from "../types/dispatcher";

export function dispatchEvent(event: string, payload: unknown): Dispatcher;

export function dispatchEvent(
  event: string[],
  payload: unknown[],
): Dispatcher[];

export function dispatchEvent(
  event: string | string[],
  payload: unknown,
): Dispatcher | Dispatcher[];

export function dispatchEvent(event: string | string[], _payload: unknown) {
  if (Array.isArray(event)) {
    const result: Dispatcher[] = event.map((ev) => {
      return { event: ev, status: "dispatched" };
    });
    return result;
  }

  return { event: event, status: "dispatched" };
}
