import { mount, unmount } from 'svelte';
import NumberDialog from '../components/NumberDialog.svelte';

export default function getDialogValue(
  label: string,
  defaultValue: number
): Promise<number | null> {
  const { promise, resolve } = Promise.withResolvers<number | null>();

  const app = mount(NumberDialog, {
    target: document.body,
    props: {
      label,
      defaultValue,
      onsubmit(value) {
        resolve(value);
        unmount(app);
      },
      onclose() {
        resolve(null);
        unmount(app);
      },
    },
  });

  return promise;
}
