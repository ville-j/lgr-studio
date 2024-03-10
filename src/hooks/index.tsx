import { useEffect } from "react";

const getFileExtension = (filename: string) =>
  filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);

export const useDragAndDrop = (
  callback: (files: File[], e: DragEvent) => void,
  ref?: React.RefObject<HTMLDivElement>,
  allowedFileExtensions = [] as string[]
) => {
  useEffect(() => {
    const fn = (e: Event) => {
      e.preventDefault();
      const ev = e as DragEvent;

      if (!ev.dataTransfer) return;

      if (ev.dataTransfer.items) {
        const files = [...ev.dataTransfer.items]
          .map((item) => {
            if (item.kind === "file") {
              return item.getAsFile();
            }
            return null;
          })
          .filter((f) => f) as File[];

        callback(
          files.filter(
            (f) =>
              allowedFileExtensions.length === 0 ||
              allowedFileExtensions.includes(getFileExtension(f.name))
          ),
          ev
        );
      } else {
        const files = [...ev.dataTransfer.files];
        callback(
          files.filter(
            (f) =>
              allowedFileExtensions.length === 0 ||
              allowedFileExtensions.includes(getFileExtension(f.name))
          ),
          ev
        );
      }
    };
    const element = ref?.current ?? document;
    const preventDefault = (e: Event) => {
      e.preventDefault();
    };
    element.addEventListener("drop", fn);
    element.addEventListener("dragover", preventDefault);

    return () => {
      element.removeEventListener("drop", fn);
      element.removeEventListener("dragover", preventDefault);
    };
  });
};
