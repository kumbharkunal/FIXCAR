"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import { suggestAreas } from "@/lib/areas";

interface AreaComboboxProps {
  id: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  variant: "field" | "bar";
}

/**
 * The area input with a styled suggestion list (the WAI-ARIA combobox pattern with list
 * autocomplete). Typing filters the 43 localities, local names included ("ghanta ghar"
 * suggests Clock Tower); any other area can still be typed. Arrow keys move through the
 * list, Enter picks, Escape closes.
 */
export function AreaCombobox({ id, value, placeholder, onChange, variant }: AreaComboboxProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const listRef = useRef<HTMLUListElement>(null);
  const suggestions = useMemo(() => suggestAreas(value), [value]);
  const showList = open && suggestions.length > 0;
  const listId = `${id}-listbox`;
  const optionId = (index: number) => `${id}-option-${index}`;

  useEffect(() => {
    if (showList && active >= 0) listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [showList, active]);
  useEffect(() => {
    if (showList) listRef.current?.scrollIntoView({ block: "nearest" });
  }, [showList]);

  const choose = (area: string) => {
    onChange(area);
    setOpen(false);
    setActive(-1);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const last = suggestions.length - 1;
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        if (!showList) {
          setOpen(true);
          setActive(event.key === "ArrowDown" ? 0 : last);
          return;
        }
        const step = event.key === "ArrowDown" ? 1 : -1;
        setActive((index) => (index + step + suggestions.length) % suggestions.length);
        break;
      }
      case "Enter":
        // With an option highlighted, Enter picks it; otherwise it submits the form.
        if (showList && active >= 0) {
          event.preventDefault();
          choose(suggestions[active]);
        }
        break;
      case "Escape":
        if (showList) {
          event.preventDefault();
          setOpen(false);
          setActive(-1);
        }
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <div className={cn("select", variant === "bar" && "is-bar")} data-open={showList || undefined}>
      <input
        id={id}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={showList && active >= 0 ? optionId(active) : undefined}
        className={variant === "bar" ? "bar-control" : "input"}
        value={value}
        autoComplete="off"
        spellCheck={false}
        placeholder={placeholder}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={onKeyDown}
        onBlur={() => {
          setOpen(false);
          setActive(-1);
        }}
      />
      <ul
        ref={listRef}
        id={listId}
        role="listbox"
        aria-label={placeholder}
        hidden={!showList}
        className="popover"
        // Keep focus in the input while picking with the mouse.
        onMouseDown={(event) => event.preventDefault()}
      >
        {suggestions.map((area, index) => (
          <li
            key={area}
            id={optionId(index)}
            role="option"
            aria-selected={area === value}
            data-active={index === active || undefined}
            className="option"
            onMouseMove={() => index !== active && setActive(index)}
            onClick={() => choose(area)}
          >
            {area}
          </li>
        ))}
      </ul>
    </div>
  );
}
