import type { ThemeRegistrationRaw } from "slidemotion/code";

/**
 * Dark-mode port of the Orange Juice VSCode theme.
 *
 * Original: https://github.com/flaviodelgrosso/vscode-orange-juice-theme
 * Palette adapted for dark backgrounds while preserving the orange accent identity.
 */
export const orangeJuiceDark: ThemeRegistrationRaw = {
  name: "orange-juice-dark",
  type: "dark",
  colors: {
    "editor.background": "#1A1A18",
    "editor.foreground": "#D4D4D4",
    "editor.lineHighlightBackground": "#2A2722",
    "editor.selectionBackground": "#4A3820",
    "editorLineNumber.foreground": "#5C5650",
    "editorCursor.foreground": "#ff8c00",
  },
  semanticHighlighting: true,
  settings: [
    {
      scope: [],
      settings: { foreground: "#D4D4D4" },
    },
    {
      name: "Comment",
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#6A6A6A" },
    },
    {
      name: "Variables",
      scope: ["variable", "string constant.other.placeholder", "source"],
      settings: { foreground: "#D4D4D4" },
    },
    {
      name: "Colors / Template expressions",
      scope: [
        "constant.other.color",
        "punctuation.definition.entity",
        "constant.character.entity",
        "punctuation.definition.template-expression",
        "punctuation.section.tag.twig",
      ],
      settings: { foreground: "#ff8c00" },
    },
    {
      name: "Invalid",
      scope: ["invalid", "invalid.illegal"],
      settings: { foreground: "#F44747" },
    },
    {
      name: "Keyword, Storage, Number, Constant",
      scope: [
        "keyword",
        "storage.type",
        "storage.modifier",
        "constant.numeric",
        "constant.language",
        "support.constant",
        "constant.character",
        "constant.escape",
      ],
      settings: { foreground: "#ff8c00" },
    },
    {
      name: "Operator, Misc",
      scope: [
        "punctuation",
        "punctuation.definition.tag",
        "punctuation.separator.inheritance.php",
        "punctuation.definition.tag.html",
        "punctuation.section.embedded",
        "keyword.other.template",
        "keyword.other.substitution",
        "meta.brace",
        "meta.block",
        "meta.jsx",
        "meta.embedded.expression",
        "meta.template.expression",
        "meta.tag.block.any.html",
        "string.unquoted.tag-string.nunjucks",
        "text.html.nunjucks",
      ],
      settings: { foreground: "#D4D4D4" },
    },
    {
      name: "Attribute Equal Signs, Operators",
      scope: [
        "punctuation.separator.key-value.html",
        "keyword.control",
        "keyword.operator",
        "constant.other.color",
        "punctuation.definition.constant",
        "meta.function.block.start.handlebars",
        "meta.function.inline.other",
        "meta.property-value",
        "support.constant.mathematical-symbols",
        "support.constant.vendored.property-value",
        "punctuation.definition.keyword",
        "punctuation.accessor",
        "punctuation.separator.property",
        "string.unquoted.filter-pipe",
      ],
      settings: { foreground: "#ff8c00" },
    },
    {
      name: "Tag",
      scope: [
        "entity.name.tag",
        "meta.tag.sgml",
        "markup.deleted.git_gutter",
        "support.variable.dom",
        "meta.import",
        "meta.export",
        "meta.export.default",
        "support.class.builtin",
        "support.class.component",
        "variable.other.object",
      ],
      settings: { foreground: "#E06C6C" },
    },
    {
      name: "Function, Special Method",
      scope: [
        "entity.name.function",
        "variable.function",
        "support.function",
        "keyword.other.special-method",
        "meta.function-call",
        "keyword.control.filter",
      ],
      settings: { foreground: "#FFAA33" },
    },
    {
      name: "Block Level Variables",
      scope: ["meta.block variable.other"],
      settings: { foreground: "#D4D4D4" },
    },
    {
      name: "Function Argument, Tag Attribute",
      scope: [
        "variable.parameter",
        "text.html",
        "punctuation.section.property-list",
        "meta.property-value.scss punctuation",
        "meta.property-list",
        "keyword.operator.type.annotation",
        "variable.other.object.property",
      ],
      settings: { foreground: "#D4D4D4" },
    },
    {
      name: "String, Symbols, Inherited Class",
      scope: [
        "string",
        "constant.other.symbol",
        "constant.other.key",
        "markup.heading",
        "markup.inserted.git_gutter",
        "meta.group.braces.curly constant.other.object.key.js string.unquoted.label.js",
        "punctuation.definition.string",
        "entity.name.section.markdown",
        "meta.attribute-selector",
        "entity.name.import.go",
        "storage.type.attr.nunjucks",
      ],
      settings: { foreground: "#56D6C2" },
    },
    {
      name: "Class, Support",
      scope: [
        "entity.name",
        "support.type",
        "support.orther.namespace.use.php",
        "meta.use.php",
        "support.other.namespace.php",
        "markup.changed.git_gutter",
        "support.type.sys-types",
        "meta.object-literal.key",
      ],
      settings: { foreground: "#FFAA33" },
    },
    {
      name: "Entity Types",
      scope: [
        "support.type",
        "support.class",
        "keyword.other.debugger",
        "entity.other.inherited-class",
        "meta.property-name",
        "punctuation.definition.raw.markdown",
        "variable.graphql",
        "variable.other.readwrite",
      ],
      settings: { foreground: "#56D6C2" },
    },
    {
      name: "CSS Class and Support",
      scope: [
        "source.css support.type.property-name",
        "source.sass support.type.property-name",
        "source.scss support.type.property-name",
        "source.less support.type.property-name",
        "source.stylus support.type.property-name",
        "source.postcss support.type.property-name",
        "support.type.property-name",
        "support.variable.object.node",
        "support.variable.object.process",
      ],
      settings: { foreground: "#56D6C2" },
    },
    {
      name: "Sub-methods",
      scope: ["entity.name.module.js", "variable.import.parameter.js"],
      settings: { foreground: "#F44747" },
    },
    {
      name: "Language methods",
      scope: ["variable.language"],
      settings: { foreground: "#56D6C2" },
    },
    {
      name: "entity.name.method.js",
      scope: ["entity.name.method.js"],
      settings: { foreground: "#56D6C2" },
    },
    {
      name: "meta.method.js",
      scope: [
        "meta.class-method.js entity.name.function.js",
        "variable.function.constructor",
      ],
      settings: { foreground: "#56D6C2" },
    },
    {
      name: "Attributes",
      scope: ["entity.other.attribute-name"],
      settings: { foreground: "#ff8c00" },
    },
    {
      name: "HTML Attributes",
      scope: [
        "text.html.basic entity.other.attribute-name.html",
        "text.html.basic entity.other.attribute-name",
      ],
      settings: { foreground: "#ff8c00" },
    },
    {
      name: "CSS Classes",
      scope: [
        "entity.other.attribute-name.class",
        "punctuation.definition.entity.css",
      ],
      settings: { foreground: "#ff8c00" },
    },
    {
      name: "CSS ID's",
      scope: ["source.sass keyword.control"],
      settings: { foreground: "#56D6C2" },
    },
    {
      name: "Inserted",
      scope: ["markup.inserted"],
      settings: { foreground: "#56D6C2" },
    },
    {
      name: "Deleted",
      scope: ["markup.deleted"],
      settings: { foreground: "#F44747" },
    },
    {
      name: "Changed",
      scope: ["markup.changed"],
      settings: { foreground: "#ff8c00" },
    },
    {
      name: "Regular Expressions",
      scope: ["string.regexp"],
      settings: { foreground: "#ff8c00" },
    },
    {
      name: "Escape Characters",
      scope: ["constant.character.escape"],
      settings: { foreground: "#56D6C2" },
    },
    {
      name: "URL",
      scope: ["*url*", "*link*", "*uri*"],
      settings: { fontStyle: "underline" },
    },
    {
      name: "Decorators",
      scope: [
        "meta.decorator",
        "tag.decorator.js entity.name.tag",
        "tag.decorator.js punctuation.definition.tag",
      ],
      settings: { foreground: "#56D6C2" },
    },
    {
      name: "ES7 Bind Operator",
      scope: [
        "source.js constant.other.object.key.js string.unquoted.label.js",
      ],
      settings: { foreground: "#F44747" },
    },
    {
      name: "JSON Key",
      scope: [
        "source.json meta.structure.dictionary.json support.type.property-name.json",
      ],
      settings: { foreground: "#ff8c00" },
    },
    {
      name: "Markup - Italic",
      scope: ["markup.italic"],
      settings: { fontStyle: "italic", foreground: "#F44747" },
    },
    {
      name: "Markup - Bold",
      scope: ["markup.bold"],
      settings: { fontStyle: "bold", foreground: "#F44747" },
    },
    {
      name: "Markup - Quote",
      scope: ["markup.quote"],
      settings: { fontStyle: "italic", foreground: "#56D6C2" },
    },
    {
      scope: "token.info-token",
      settings: { foreground: "#56D6C2" },
    },
    {
      scope: "token.warn-token",
      settings: { foreground: "#FFCC66" },
    },
    {
      scope: "token.error-token",
      settings: { foreground: "#F44747" },
    },
    {
      scope: "token.debug-token",
      settings: { foreground: "#ff8c00" },
    },
  ],
};
