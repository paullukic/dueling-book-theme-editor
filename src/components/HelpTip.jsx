import React, { useState } from "react";

/**
 * Small circled "?" that reveals its text on hover or keyboard focus.
 *
 * The tooltip is absolutely positioned and stretches to the full width of the
 * nearest positioned ancestor (the setting row), rather than hanging off the
 * icon itself - the panel is only 250px wide and clips its overflow, so an
 * icon-anchored tooltip would get cut off.
 *
 * tone="warn" colours the text as a caution instead of plain help.
 */
const HelpTip = ({ text, tone }) => {
  const [open, setOpen] = useState(false);

  const show = () => setOpen(true);
  const hide = () => setOpen(false);

  return (
    <>
      <span
        className="dbte-help"
        role="button"
        tabIndex={0}
        aria-label={text}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onClick={(e) => {
          // Rows are clickable (labels toggle checkboxes, headers collapse) -
          // poking the help icon should not trigger them.
          e.preventDefault();
          e.stopPropagation();
          setOpen((o) => !o);
        }}
      >
        ?
      </span>
      {open && (
        <span
          className={tone === "warn" ? "dbte-tip dbte-tip--warn" : "dbte-tip"}
          role="tooltip"
        >
          {text}
        </span>
      )}
    </>
  );
};

export default HelpTip;
