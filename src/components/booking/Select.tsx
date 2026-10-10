"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { cn } from "@/lib/cn";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  id: string;
  /** Id of the visible label element. */
  labelId: string;
  value: string;
  options: readonly SelectOption[];
  placeholder: string;
  onChange: (value: string) => void;
  /** "field": a full input in the booking sheet. "bar": a compact control in the hero bar. */
  variant: "field" | "bar";
  /** Text to show instead of the option label (for example a picked date). */
  display?: string;
}

/**
 * A styled single-select (the WAI-ARIA select-only combobox pattern). Focus stays on the
 * button; the open list is announced through aria-activedescendant. Keyboard: arrows,
 * Home, End, Page Up and Down, Enter or Space to choose, Escape to close, Tab to choose
 * and move on, and typing a letter jumps to the first matching option.
 */
export function Select({ id, labelId, value, options, placeholder, onChange, variant, display }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: "", at: 0 });

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;
  const listId = `${id}-listbox`;
  const optionId = (index: number) => `${id}-option-${index}`;
  const last = options.length - 1;

  const show = (index: number) => {
    setActive(Math.max(0, Math.min(last, index)));
    setOpen(true);
  };
  /** Picking an option always reports it (so "Pick a date" can reopen a calendar). */
  const choose = (index: number) => {
    const option = options[index];
    if (option) onChange(option.value);
    setOpen(false);
  };

  // A pointer press anywhere else closes the list.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Keep the active option, and the open list itself, in view (the booking sheet scrolls).
  useEffect(() => {
    if (!open) return;
    listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);
  useEffect(() => {
    if (open) listRef.current?.scrollIntoView({ block: "nearest" });
  }, [open]);

  /** Typing letters jumps to the first option starting with them. */
  const jumpTo = (key: string) => {
    const now = performance.now();
    typed.current.text = now - typed.current.at > 700 ? key : typed.current.text + key;
    typed.current.at = now;
    const query = typed.current.text.toLowerCase();
    const start = open ? active : Math.max(0, selectedIndex);
    for (let step = query.length === 1 ? 1 : 0; step <= options.length; step += 1) {
      const index = (start + step) % options.length;
      if (options[index].label.toLowerCase().startsWith(query)) return show(index);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const { key } = event;
    if (!open) {
      if (key === "ArrowDown" || key === "ArrowUp" || key === "Enter" || key === " ") {
        event.preventDefault();
        show(selectedIndex >= 0 ? selectedIndex : 0);
      } else if (key === "Home" || key === "End") {
        event.preventDefault();
        show(key === "Home" ? 0 : last);
      } else if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        jumpTo(key);
      }
      return;
    }
    switch (key) {
      case "ArrowDown":
      case "ArrowUp":
        event.preventDefault();
        if (event.altKey) choose(active);
        else setActive((index) => Math.max(0, Math.min(last, index + (key === "ArrowDown" ? 1 : -1))));
        break;
      case "Home":
      case "End":
        event.preventDefault();
        setActive(key === "Home" ? 0 : last);
        break;
      case "PageDown":
      case "PageUp":
        event.preventDefault();
        setActive((index) => Math.max(0, Math.min(last, index + (key === "PageDown" ? 8 : -8))));
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        choose(active);
        break;
      case "Escape":
        // preventDefault tells an open booking sheet that this Escape is already handled.
        event.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        // Tab keeps a newly highlighted option, without re-reporting the current one.
        if (active !== selectedIndex) choose(active);
        else setOpen(false);
        break;
      default:
        if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) jumpTo(key);
    }
  };

  // Mouse and touch only: keyboard activation is handled in onKeyDown.
  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (event.detail === 0) return;
    if (open) setOpen(false);
    else show(selectedIndex >= 0 ? selectedIndex : 0);
  };

  return (
    <div ref={wrapRef} className={cn("select", variant === "bar" && "is-bar")} data-open={open || undefined}>
      <button
        id={id}
        type="button"
        role="combobox"
        aria-labelledby={labelId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? optionId(active) : undefined}
        className={cn(variant === "bar" ? "bar-control select-trigger" : "input select-trigger")}
        onKeyDown={onKeyDown}
        onClick={onClick}
      >
        <span className={cn("truncate", !selected && !display && "text-stone")}>{display ?? selected?.label ?? placeholder}</span>
        <span className="select-caret" aria-hidden />
      </button>
      <ul
        ref={listRef}
        id={listId}
        role="listbox"
        aria-labelledby={labelId}
        hidden={!open}
        className="popover"
        // Keep focus on the button while choosing with the mouse.
        onMouseDown={(event) => event.preventDefault()}
      >
        {options.map((option, index) => (
          <li
            key={option.value || "none"}
            id={optionId(index)}
            role="option"
            aria-selected={index === selectedIndex}
            data-active={index === active || undefined}
            className="option"
            onMouseMove={() => index !== active && setActive(index)}
            onClick={() => choose(index)}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
