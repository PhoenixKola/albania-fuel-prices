import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

type Option = { value: string; label: string };
type Props = { label: string; value: string; options: Option[]; onChange: (value: string) => void };

// Select-only combobox: focus stays on the trigger while the active option is announced.
export default function TripSelect({ label, value, options, onChange }: Props) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const search = useRef({ text: "", time: 0 });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [placement, setPlacement] = useState({ above: false, height: 272 });
  const selected = Math.max(0, options.findIndex((option) => option.value === value));

  function show(index = selected) {
    const rect = trigger.current?.getBoundingClientRect();
    if (rect) {
      const below = window.innerHeight - rect.bottom - 20;
      const above = rect.top - 20;
      const upward = below < Math.min(272, options.length * 44 + 16) && above > below;
      setPlacement({ above: upward, height: Math.max(80, Math.min(272, upward ? above : below)) });
    }
    search.current = { text: "", time: 0 };
    setActive(index);
    setOpen(true);
  }

  function choose(index: number) {
    if (options[index]) onChange(options[index].value);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const resize = () => setOpen(false);
    document.addEventListener("pointerdown", dismiss);
    window.addEventListener("resize", resize);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("resize", resize);
    };
  }, [open]);

  useEffect(() => {
    const menu = list.current;
    const option = menu?.children[active] as HTMLElement | undefined;
    if (!open || !menu || !option) return;
    // Scroll only the menu, keeping the calculator's position on the page stable.
    const top = option.getBoundingClientRect().top - menu.getBoundingClientRect().top + menu.scrollTop - menu.clientTop;
    if (top < menu.scrollTop) menu.scrollTop = top;
    else if (top + option.offsetHeight > menu.scrollTop + menu.clientHeight) menu.scrollTop = top + option.offsetHeight - menu.clientHeight;
  }, [active, open]);

  function handleKey(event: KeyboardEvent<HTMLButtonElement>) {
    const last = options.length - 1;
    if (event.key === "Tab") { if (open) choose(active); return; }
    if (event.key === "Escape") { if (open) { event.preventDefault(); event.stopPropagation(); setOpen(false); } return; }
    if (["ArrowDown", "ArrowUp", "Home", "End", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      if (event.key === "Enter" || event.key === " ") { if (open) choose(active); else show(); }
      else if (event.key === "Home") { if (open) setActive(0); else show(0); }
      else if (event.key === "End") { if (open) setActive(last); else show(last); }
      else if (!open) show();
      else setActive((index) => Math.max(0, Math.min(last, index + (event.key === "ArrowDown" ? 1 : -1))));
      return;
    }
    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;
    event.preventDefault();
    const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
    const now = Date.now();
    const text = now - search.current.time > 700 ? event.key : search.current.text + event.key;
    const query = normalize([...text].every((char) => char === text[0]) ? text[0] : text);
    const start = open ? active : selected;
    const indices = options.map((_, index) => (start + index + (query.length === 1 ? 1 : 0)) % options.length);
    const match = indices.find((index) => normalize(options[index].label).startsWith(query));
    if (!open) show(match ?? selected);
    else if (match !== undefined) setActive(match);
    search.current = { text, time: now };
  }

  return <div className="tripSelectField">
    <label id={`${id}-label`} htmlFor={id}>{label}</label>
    <div ref={root} className={`tripSelect${open ? " tripSelectOpen" : ""}`} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
    }}>
      <button ref={trigger} id={id} type="button" className="tripSelectTrigger" role="combobox"
        aria-labelledby={`${id}-label`} aria-haspopup="listbox" aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined} aria-activedescendant={open ? `${id}-option-${active}` : undefined}
        disabled={!options.length} onClick={() => { if (open) setOpen(false); else show(); }} onKeyDown={handleKey}>
        <span>{options[selected]?.label ?? value}</span>
        <svg className="tripSelectChevron" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {open && <ul ref={list} id={`${id}-list`} role="listbox" aria-labelledby={`${id}-label`}
        className={`tripSelectMenu${placement.above ? " tripSelectMenuAbove" : ""}`} style={{ maxHeight: placement.height }}
        onMouseDown={(event) => event.preventDefault()}>
        {options.map((option, index) => <li id={`${id}-option-${index}`} key={option.value} role="option"
          aria-selected={option.value === value} data-active={index === active} className="tripSelectOption"
          onPointerMove={(event) => { if (event.pointerType === "mouse") setActive(index); }}
          onClick={() => choose(index)}>
          <span>{option.label}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </li>)}
      </ul>}
    </div>
  </div>;
}
