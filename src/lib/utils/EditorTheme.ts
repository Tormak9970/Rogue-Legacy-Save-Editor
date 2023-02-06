import { HighlightStyle } from "@codemirror/language";
import { EditorView } from "@codemirror/view";
import { tags } from "@lezer/highlight";

const ivory = "#c1c7d4",
  stone = "#7d8799", // Brightened compared to original to increase contrast
  darkBackground = "#1a1a1a", //changed
  highlightBackground = "#2b2b2b", //changed
  background = "#1a1a1a", //changed
  selection = "#49597b", //changed
  cursor = "#d4d4d4"; //changed

const bracketsCol = "#c1c0c0";
const propsCol = "#a5c261";
const otherCol = "#b6b3eb";
const strCol = "#ffc66d";

/**
 * The codemirror theme based on vsCode
 */
export const vsCodeTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: background,
    },

    ".cm-content": {
      caretColor: cursor,
    },

    "&.cm-focused .cm-cursor": { borderLeftColor: cursor },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection":
      { backgroundColor: selection },

    ".cm-panels": { backgroundColor: darkBackground, color: ivory },
    ".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
    ".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },

    ".cm-searchMatch": {
      backgroundColor: "#72a1ff59",
      outline: "1px solid #457dff",
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: "#6199ff2f",
    },

    ".cm-activeLine": {
      boxShadow: `inset 0px 0px 1px 1.5px ${highlightBackground};`,
      backgroundColor: "transparent",
    },
    ".cm-selectionMatch": { backgroundColor: "#aafe661a" },

    ".cm-matchingBracket, .cm-nonmatchingBracket": {
      backgroundColor: "#bad0f847",
      outline: "1px solid #515a6b",
    },

    ".cm-gutters": {
      backgroundColor: background,
      color: stone,
      border: "none",
    },

    ".cm-activeLineGutter": {
      color: cursor,
      backgroundColor: "transparent",
    },

    ".cm-foldPlaceholder": {
      backgroundColor: "transparent",
      border: "none",
      color: "#ddd",
    },

    ".cm-tooltip": {
      border: "1px solid #181a1f",
      backgroundColor: darkBackground,
    },
    ".cm-tooltip-autocomplete": {
      "& > ul > li[aria-selected]": {
        backgroundColor: highlightBackground,
        color: ivory,
      },
    },
  },
  { dark: true }
);

/**
 * The Highlighting associated with the vsCode theme
 */
export const vsCodeHighlightStyle = HighlightStyle.define([
  {
    tag: [tags.unit, tags.number, tags.bool, tags.null],
    color: otherCol,
  },
  {
    tag: [tags.color, tags.string, tags.character, tags.atom],
    color: strCol,
  },
  {
    tag: [
      tags.punctuation,
      tags.separator,
      tags.paren,
      tags.squareBracket,
      tags.brace,
      tags.logicOperator,
    ],
    color: bracketsCol,
  },
  {
    tag: tags.invalid,
    color: "red",
  },
  {
    tag: [tags.propertyName],
    color: propsCol,
  },
]);
