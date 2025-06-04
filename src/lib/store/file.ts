import localforage from 'localforage';
import { writable } from 'svelte/store';
import { z } from 'zod';

const LOCAL_KEY = 'steinberg:file';

const fileSchema = z.instanceof(File);

export const file = writable<File | null>(null);

file.subscribe((value) => {
  localforage.setItem(LOCAL_KEY, value);
});

localforage.getItem(LOCAL_KEY).then((value) => {
  const parsed = fileSchema.safeParse(value);
  if (parsed.success) {
    file.set(parsed.data);
  }
});
