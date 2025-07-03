(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/components/ui/card.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/**
 * @fileoverview Componente de UI "Card" (Tarjeta).
 * Proporciona un contenedor estilizado para agrupar contenido relacionado,
 * con secciones para encabezado, contenido y pie de página.
 *
 * @see https://ui.shadcn.com/docs/components/card
 */ __turbopack_context__.s({
    "Card": (()=>Card),
    "CardContent": (()=>CardContent),
    "CardDescription": (()=>CardDescription),
    "CardFooter": (()=>CardFooter),
    "CardHeader": (()=>CardHeader),
    "CardTitle": (()=>CardTitle)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
/**
 * Componente principal de la tarjeta, actúa como contenedor.
 */ const Card = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-lg border bg-card text-card-foreground shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 20,
        columnNumber: 3
    }, this));
_c1 = Card;
Card.displayName = "Card";
/**
 * Sección de encabezado de la tarjeta.
 */ const CardHeader = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-1.5 p-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 38,
        columnNumber: 3
    }, this));
_c3 = CardHeader;
CardHeader.displayName = "CardHeader";
/**
 * Componente para el título dentro de CardHeader.
 */ const CardTitle = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-2xl font-semibold leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 53,
        columnNumber: 3
    }, this));
_c5 = CardTitle;
CardTitle.displayName = "CardTitle";
/**
 * Componente para la descripción dentro de CardHeader.
 */ const CardDescription = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 71,
        columnNumber: 3
    }, this));
_c7 = CardDescription;
CardDescription.displayName = "CardDescription";
/**
 * Sección de contenido principal de la tarjeta.
 */ const CardContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 86,
        columnNumber: 3
    }, this));
_c9 = CardContent;
CardContent.displayName = "CardContent";
/**
 * Sección de pie de página de la tarjeta.
 */ const CardFooter = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 97,
        columnNumber: 3
    }, this));
_c11 = CardFooter;
CardFooter.displayName = "CardFooter";
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11;
__turbopack_context__.k.register(_c, "Card$React.forwardRef");
__turbopack_context__.k.register(_c1, "Card");
__turbopack_context__.k.register(_c2, "CardHeader$React.forwardRef");
__turbopack_context__.k.register(_c3, "CardHeader");
__turbopack_context__.k.register(_c4, "CardTitle$React.forwardRef");
__turbopack_context__.k.register(_c5, "CardTitle");
__turbopack_context__.k.register(_c6, "CardDescription$React.forwardRef");
__turbopack_context__.k.register(_c7, "CardDescription");
__turbopack_context__.k.register(_c8, "CardContent$React.forwardRef");
__turbopack_context__.k.register(_c9, "CardContent");
__turbopack_context__.k.register(_c10, "CardFooter$React.forwardRef");
__turbopack_context__.k.register(_c11, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/select.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/**
 * @fileoverview Componente de UI "Select".
 * Muestra una lista de opciones para que el usuario elija una.
 *
 * @see https://ui.shadcn.com/docs/components/select
 */ __turbopack_context__.s({
    "Select": (()=>Select),
    "SelectContent": (()=>SelectContent),
    "SelectGroup": (()=>SelectGroup),
    "SelectItem": (()=>SelectItem),
    "SelectLabel": (()=>SelectLabel),
    "SelectScrollDownButton": (()=>SelectScrollDownButton),
    "SelectScrollUpButton": (()=>SelectScrollUpButton),
    "SelectSeparator": (()=>SelectSeparator),
    "SelectTrigger": (()=>SelectTrigger),
    "SelectValue": (()=>SelectValue)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-select/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
/**
 * Componente raíz del selector.
 */ const Select = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
/**
 * Agrupa opciones dentro del selector.
 */ const SelectGroup = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"];
/**
 * Muestra el valor seleccionado.
 */ const SelectValue = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Value"];
/**
 * El botón que abre/cierra el selector.
 */ const SelectTrigger = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
        ...props,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                    className: "h-4 w-4 opacity-50"
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/select.tsx",
                    lineNumber: 48,
                    columnNumber: 7
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/select.tsx",
                lineNumber: 47,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 38,
        columnNumber: 3
    }, this));
_c1 = SelectTrigger;
SelectTrigger.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"].displayName;
const SelectScrollUpButton = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollUpButton"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex cursor-default items-center justify-center py-1", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/src/components/ui/select.tsx",
            lineNumber: 66,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 58,
        columnNumber: 3
    }, this));
_c2 = SelectScrollUpButton;
SelectScrollUpButton.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollUpButton"].displayName;
const SelectScrollDownButton = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollDownButton"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex cursor-default items-center justify-center py-1", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/src/components/ui/select.tsx",
            lineNumber: 83,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 75,
        columnNumber: 3
    }, this));
_c3 = SelectScrollDownButton;
SelectScrollDownButton.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollDownButton"].displayName;
/**
 * Contenedor del contenido del selector (las opciones).
 */ const SelectContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c4 = ({ className, children, position = "popper", ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
            ref: ref,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
            position: position,
            ...props,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectScrollUpButton, {}, void 0, false, {
                    fileName: "[project]/src/components/ui/select.tsx",
                    lineNumber: 108,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"], {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
                    children: children
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/select.tsx",
                    lineNumber: 109,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectScrollDownButton, {}, void 0, false, {
                    fileName: "[project]/src/components/ui/select.tsx",
                    lineNumber: 118,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/select.tsx",
            lineNumber: 97,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 96,
        columnNumber: 3
    }, this));
_c5 = SelectContent;
SelectContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
/**
 * Etiqueta para un grupo de opciones.
 */ const SelectLabel = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("py-1.5 pl-8 pr-2 text-sm font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 131,
        columnNumber: 3
    }, this));
_c7 = SelectLabel;
SelectLabel.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"].displayName;
/**
 * Un elemento individual de opción en el selector.
 */ const SelectItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c8 = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemIndicator"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/select.tsx",
                        lineNumber: 156,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/select.tsx",
                    lineNumber: 155,
                    columnNumber: 7
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/select.tsx",
                lineNumber: 154,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemText"], {
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ui/select.tsx",
                lineNumber: 160,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 146,
        columnNumber: 3
    }, this));
_c9 = SelectItem;
SelectItem.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"].displayName;
/**
 * Separador visual entre grupos de opciones.
 */ const SelectSeparator = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("-mx-1 my-1 h-px bg-muted", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 172,
        columnNumber: 3
    }, this));
_c11 = SelectSeparator;
SelectSeparator.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11;
__turbopack_context__.k.register(_c, "SelectTrigger$React.forwardRef");
__turbopack_context__.k.register(_c1, "SelectTrigger");
__turbopack_context__.k.register(_c2, "SelectScrollUpButton");
__turbopack_context__.k.register(_c3, "SelectScrollDownButton");
__turbopack_context__.k.register(_c4, "SelectContent$React.forwardRef");
__turbopack_context__.k.register(_c5, "SelectContent");
__turbopack_context__.k.register(_c6, "SelectLabel$React.forwardRef");
__turbopack_context__.k.register(_c7, "SelectLabel");
__turbopack_context__.k.register(_c8, "SelectItem$React.forwardRef");
__turbopack_context__.k.register(_c9, "SelectItem");
__turbopack_context__.k.register(_c10, "SelectSeparator$React.forwardRef");
__turbopack_context__.k.register(_c11, "SelectSeparator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/dialog.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/**
 * @fileoverview Componente de UI "Dialog" (Diálogo).
 * Una ventana superpuesta que deshabilita el contenido de la página principal
 * y requiere que el usuario interactúe con ella.
 *
 * @see https://ui.shadcn.com/docs/components/dialog
 */ __turbopack_context__.s({
    "Dialog": (()=>Dialog),
    "DialogClose": (()=>DialogClose),
    "DialogContent": (()=>DialogContent),
    "DialogDescription": (()=>DialogDescription),
    "DialogFooter": (()=>DialogFooter),
    "DialogHeader": (()=>DialogHeader),
    "DialogOverlay": (()=>DialogOverlay),
    "DialogPortal": (()=>DialogPortal),
    "DialogTitle": (()=>DialogTitle),
    "DialogTrigger": (()=>DialogTrigger)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-dialog/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
/**
 * Componente raíz del diálogo.
 */ const Dialog = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
/**
 * Componente que activa la apertura del diálogo.
 */ const DialogTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"];
/**
 * Portal para renderizar el diálogo fuera del flujo normal del DOM.
 */ const DialogPortal = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"];
/**
 * Componente para cerrar el diálogo.
 */ const DialogClose = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"];
/**
 * Capa de superposición que cubre la pantalla detrás del diálogo.
 */ const DialogOverlay = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 44,
        columnNumber: 3
    }, this));
_c = DialogOverlay;
DialogOverlay.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"].displayName;
/**
 * Contenedor principal del contenido del diálogo.
 */ const DialogContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c1 = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogPortal, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogOverlay, {}, void 0, false, {
                fileName: "[project]/src/components/ui/dialog.tsx",
                lineNumber: 63,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                ref: ref,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg", className),
                ...props,
                children: [
                    children,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
                        className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/dialog.tsx",
                                lineNumber: 74,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "sr-only",
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/dialog.tsx",
                                lineNumber: 75,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/dialog.tsx",
                        lineNumber: 73,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/dialog.tsx",
                lineNumber: 64,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 62,
        columnNumber: 3
    }, this));
_c2 = DialogContent;
DialogContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
/**
 * Encabezado del diálogo, que contiene el título y la descripción.
 */ const DialogHeader = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-1.5 text-center sm:text-left", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 89,
        columnNumber: 3
    }, this);
_c3 = DialogHeader;
DialogHeader.displayName = "DialogHeader";
/**
 * Pie de página del diálogo, que contiene los botones de acción.
 */ const DialogFooter = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 106,
        columnNumber: 3
    }, this);
_c4 = DialogFooter;
DialogFooter.displayName = "DialogFooter";
/**
 * Título del diálogo.
 */ const DialogTitle = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c5 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-lg font-semibold leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 123,
        columnNumber: 3
    }, this));
_c6 = DialogTitle;
DialogTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"].displayName;
/**
 * Descripción o cuerpo del mensaje del diálogo.
 */ const DialogDescription = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c7 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 141,
        columnNumber: 3
    }, this));
_c8 = DialogDescription;
DialogDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8;
__turbopack_context__.k.register(_c, "DialogOverlay");
__turbopack_context__.k.register(_c1, "DialogContent$React.forwardRef");
__turbopack_context__.k.register(_c2, "DialogContent");
__turbopack_context__.k.register(_c3, "DialogHeader");
__turbopack_context__.k.register(_c4, "DialogFooter");
__turbopack_context__.k.register(_c5, "DialogTitle$React.forwardRef");
__turbopack_context__.k.register(_c6, "DialogTitle");
__turbopack_context__.k.register(_c7, "DialogDescription$React.forwardRef");
__turbopack_context__.k.register(_c8, "DialogDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/accordion.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/**
 * @fileoverview Componente de UI "Accordion" (Acordeón).
 * Proporciona un componente de acordeón colapsable, permitiendo mostrar
 * y ocultar secciones de contenido. Basado en Radix UI y estilizado con Tailwind CSS.
 *
 * @see https://ui.shadcn.com/docs/components/accordion
 */ __turbopack_context__.s({
    "Accordion": (()=>Accordion),
    "AccordionContent": (()=>AccordionContent),
    "AccordionItem": (()=>AccordionItem),
    "AccordionTrigger": (()=>AccordionTrigger)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-accordion/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
/**
 * Contenedor principal del acordeón, basado en AccordionPrimitive.Root.
 */ const Accordion = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
/**
 * Un único elemento dentro del acordeón, que contiene un disparador (trigger) y un contenido.
 */ const AccordionItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-b", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/accordion.tsx",
        lineNumber: 29,
        columnNumber: 3
    }, this));
_c1 = AccordionItem;
AccordionItem.displayName = "AccordionItem";
/**
 * El botón que conmuta el estado (abierto/cerrado) de un AccordionItem.
 */ const AccordionTrigger = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c2 = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Header"], {
        className: "flex",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
            ref: ref,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180", className),
            ...props,
            children: [
                children,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                    className: "h-4 w-4 shrink-0 transition-transform duration-200"
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/accordion.tsx",
                    lineNumber: 54,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/accordion.tsx",
            lineNumber: 45,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/accordion.tsx",
        lineNumber: 44,
        columnNumber: 3
    }, this));
_c3 = AccordionTrigger;
AccordionTrigger.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"].displayName;
/**
 * El contenedor del contenido que se muestra cuando un AccordionItem está abierto.
 */ const AccordionContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c4 = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
        ref: ref,
        className: "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("pb-4 pt-0", className),
            children: children
        }, void 0, false, {
            fileName: "[project]/src/components/ui/accordion.tsx",
            lineNumber: 72,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/accordion.tsx",
        lineNumber: 67,
        columnNumber: 3
    }, this));
_c5 = AccordionContent;
AccordionContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "AccordionItem$React.forwardRef");
__turbopack_context__.k.register(_c1, "AccordionItem");
__turbopack_context__.k.register(_c2, "AccordionTrigger$React.forwardRef");
__turbopack_context__.k.register(_c3, "AccordionTrigger");
__turbopack_context__.k.register(_c4, "AccordionContent$React.forwardRef");
__turbopack_context__.k.register(_c5, "AccordionContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/popover.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/**
 * @fileoverview Componente de UI "Popover".
 * Muestra contenido enriquecido en una ventana emergente que aparece
 * junto a un elemento disparador.
 *
 * @see https://ui.shadcn.com/docs/components/popover
 */ __turbopack_context__.s({
    "Popover": (()=>Popover),
    "PopoverContent": (()=>PopoverContent),
    "PopoverTrigger": (()=>PopoverTrigger)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-popover/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
/**
 * Componente raíz del popover.
 */ const Popover = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
/**
 * Elemento que activa la apertura del popover.
 */ const PopoverTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"];
/**
 * Contenedor del contenido del popover.
 */ const PopoverContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, align = "center", sideOffset = 4, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
            ref: ref,
            align: align,
            sideOffset: sideOffset,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className),
            ...props
        }, void 0, false, {
            fileName: "[project]/src/components/ui/popover.tsx",
            lineNumber: 34,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/popover.tsx",
        lineNumber: 33,
        columnNumber: 3
    }, this));
_c1 = PopoverContent;
PopoverContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "PopoverContent$React.forwardRef");
__turbopack_context__.k.register(_c1, "PopoverContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/calendar.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/**
 * @fileoverview Componente de UI "Calendar" (Calendario).
 * Permite a los usuarios seleccionar fechas de un calendario interactivo.
 *
 * @see https://ui.shadcn.com/docs/components/calendar
 */ __turbopack_context__.s({
    "Calendar": (()=>Calendar)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$day$2d$picker$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-day-picker/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
;
/**
 * Componente de calendario para selección de fechas.
 * @param {CalendarProps} props - Propiedades del componente DayPicker.
 */ function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$day$2d$picker$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DayPicker"], {
        showOutsideDays: showOutsideDays,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-3", className),
        classNames: {
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buttonVariants"])({
                variant: "outline"
            }), "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buttonVariants"])({
                variant: "ghost"
            }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
            day_range_end: "day-range-end",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
            ...classNames
        },
        components: {
            IconLeft: ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-4 w-4", className),
                    ...props
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/calendar.tsx",
                    lineNumber: 69,
                    columnNumber: 11
                }, void 0),
            IconRight: ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-4 w-4", className),
                    ...props
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/calendar.tsx",
                    lineNumber: 72,
                    columnNumber: 11
                }, void 0)
        },
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/calendar.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
_c = Calendar;
Calendar.displayName = "Calendar";
;
var _c;
__turbopack_context__.k.register(_c, "Calendar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/data.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/**
 * @fileOverview Datos de prueba para la aplicación.
 * Este archivo contiene datos de ejemplo para campañas y contactos,
 * utilizados para poblar la interfaz de usuario hasta que se conecte una base de datos real.
 */ __turbopack_context__.s({
    "campaigns": (()=>campaigns),
    "certificateTemplates": (()=>certificateTemplates),
    "contacts": (()=>contacts),
    "events": (()=>events),
    "managedSenders": (()=>managedSenders),
    "surveys": (()=>surveys)
});
const campaigns = [
    {
        name: "Campaña de Bienvenida",
        status: "TERMINADA",
        sent: "5,000",
        opens: "35%",
        clicks: "8%",
        date: "2024-07-01"
    },
    {
        name: "Oferta Flash 24h",
        status: "EXPIRADA",
        sent: "2,500",
        opens: "45%",
        clicks: "15%",
        date: "2024-07-10"
    },
    {
        name: "Lanzamiento Nuevo Producto",
        status: "INICIADA",
        sent: "1,200",
        opens: "12%",
        clicks: "2%",
        date: "2024-07-18"
    },
    {
        name: "Promoción Black Friday",
        status: "TIEMPO LIMITADO",
        sent: "0",
        opens: "-",
        clicks: "-",
        date: "2024-11-29"
    },
    {
        name: "Venta de Aniversario",
        status: "AGOTADA",
        sent: "10,000",
        opens: "50%",
        clicks: "20%",
        date: "2024-06-15"
    }
];
const contacts = [
    {
        email: "juan.perez@example.com",
        name: "Juan Perez",
        status: "Suscrito",
        dateAdded: "2024-07-10"
    },
    {
        email: "maria.garcia@example.com",
        name: "Maria Garcia",
        status: "Suscrito",
        dateAdded: "2024-07-09"
    },
    {
        email: "baja@example.com",
        name: "Carlos Baja",
        status: "Baja",
        dateAdded: "2024-06-20"
    }
];
const surveys = [
    {
        id: "1",
        name: "Feedback de Producto de TI",
        description: "Encuesta para recopilar opiniones sobre nuestro último software.",
        responses: 150
    },
    {
        id: "2",
        name: "Satisfacción del Cliente Tech",
        description: "Mide la satisfacción general de nuestros clientes con el soporte técnico.",
        responses: 278
    },
    {
        id: "3",
        name: "Interés en Nuevos Cursos",
        description: "Sondeo sobre posibles nuevos cursos de desarrollo y TI.",
        responses: 45
    }
];
const events = [
    {
        id: "1",
        name: "Taller de Marketing Digital",
        date: "2024-08-15",
        status: "Realizado",
        attendees: 75
    },
    {
        id: "2",
        name: "Conferencia de Liderazgo",
        date: "2024-09-05",
        status: "Próximo",
        attendees: 120
    },
    {
        id: "3",
        name: "Webinar de Nuevas Tecnologías",
        date: "2024-07-20",
        status: "Realizado",
        attendees: 250
    }
];
const certificateTemplates = {
    '1': 'iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDlWIpAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGSSURBVHhe7dJBDQAgDAAx2NB/yHwM46GE+zs7+8HBAgQIECAwERAgQIAAgYmAAAECEAEDAgECEQEBAgECEQEBAgECBAgQCAmY+wEECBAgQCAhIM4DBAgQIEAgISDOAwQIECBAICEgzoMECBAgQCAhIM4DBAgQIEAgISDOAwQIECBAICEgzoMECBAgQCAhIM4DBAgQIEAgISDOAwQIECBAICEgzoMECBAgQCAhIM4DBAgQIEAgISDOAwQIECBAICEgzoMECBAgQCAhIM4DBAgQIEAgISDOAwQIECBAICEgzoMECBAgQCAhIM4DBAgQIEAgISDOAwQIECBAICEgzoMECBAgQCAhIM4DBAgQIEAgISDOAwQIECBAICEgzoMECBAgQCAhIM4DBAgQIEAgISDOAwQIECBAICEgzoMECBAgQCAhIM4DBAgQIEAgISDOAwQIECBAICEgzoMECBAgQCAhIM4DBAgQIEAgISDOAwQIECBAICEgzoMECBAgQCAhIM4DBAgQIEAgISDOAwQIECBAICEgzoMECBAgQCAhIM4DBAgQIEAgISDOAwQIECBAICEgzoMECBAgQCAhIM4DBAgQIECAQEBAgAABAq8CgU5q3+UAAAAASUVORK5CYII='
};
const managedSenders = [
    {
        name: 'Soporte Técnico',
        email: 'soporte@emailcraft.com'
    },
    {
        name: 'Notificaciones del Sistema',
        email: 'noreply@emailcraft.com'
    },
    {
        name: 'Comunicaciones Internas',
        email: 'comms@emailcraft.com'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/actions/data:64e5bb [app-client] (ecmascript) <text/javascript>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"400ba817b0cb9d909ed01fecb14a416b84005152c7":"sendCampaign"},"src/actions/send-campaign-action.ts",""] */ __turbopack_context__.s({
    "sendCampaign": (()=>sendCampaign)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var sendCampaign = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("400ba817b0cb9d909ed01fecb14a416b84005152c7", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "sendCampaign"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vc2VuZC1jYW1wYWlnbi1hY3Rpb24udHMiXSwic291cmNlc0NvbnRlbnQiOlsiXG4ndXNlIHNlcnZlcic7XG5cbmltcG9ydCAnaXNvbW9ycGhpYy1mZXRjaCc7XG5pbXBvcnQgeyBDbGllbnRTZWNyZXRDcmVkZW50aWFsIH0gZnJvbSAnQGF6dXJlL2lkZW50aXR5JztcbmltcG9ydCB7IENsaWVudCB9IGZyb20gJ0BtaWNyb3NvZnQvbWljcm9zb2Z0LWdyYXBoLWNsaWVudCc7XG5pbXBvcnQgeyBUb2tlbkNyZWRlbnRpYWxBdXRoZW50aWNhdGlvblByb3ZpZGVyIH0gZnJvbSAnQG1pY3Jvc29mdC9taWNyb3NvZnQtZ3JhcGgtY2xpZW50L2F1dGhQcm92aWRlcnMvYXp1cmVUb2tlbkNyZWRlbnRpYWxzJztcbmltcG9ydCBteXNxbCBmcm9tICdteXNxbDIvcHJvbWlzZSc7XG5pbXBvcnQgeyBwYXJzZSB9IGZyb20gJ2Nzdi1wYXJzZS9zeW5jJztcbmltcG9ydCAqIGFzIFhMU1ggZnJvbSAneGxzeCc7XG5pbXBvcnQgeyBldmVudHMgfSBmcm9tICdAL2xpYi9kYXRhJztcbmltcG9ydCB7IGhhc1Blcm1pc3Npb24sIEFQUF9QRVJNSVNTSU9OUywgdHlwZSBSb2xlIH0gZnJvbSAnQC9saWIvcGVybWlzc2lvbnMnO1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgQWNjacOzbiBkZSBzZXJ2aWRvciBwYXJhIGVudmlhciB1bmEgY2FtcGHDsWEgZGUgY29ycmVvIGVsZWN0csOzbmljby5cbiAqIE9idGllbmUgZGVzdGluYXRhcmlvcyBkZXNkZSB1bmEgZnVlbnRlIGRlIGRhdG9zIHkgbG9zIGVudsOtYSBwb3IgbG90ZXNcbiAqIHBhcmEgcmVzcGV0YXIgbG9zIGzDrW1pdGVzIGRlIGxhIEFQSSwgdXRpbGl6YW5kbyBNaWNyb3NvZnQgR3JhcGguXG4gKi9cblxuaW50ZXJmYWNlIFNlbmRDYW1wYWlnblBheWxvYWQge1xuICBzdWJqZWN0OiBzdHJpbmc7XG4gIGh0bWxCb2R5OiBzdHJpbmc7XG4gIHJlY2lwaWVudERhdGE6IHtcbiAgICB0eXBlOiAnZGF0ZScgfCAnY3N2JyB8ICdzcWwnIHwgJ2V4Y2VsJyB8ICdpbmRpdmlkdWFsJztcbiAgICB2YWx1ZTogc3RyaW5nO1xuICB9O1xuICBzZW5kZXJFbWFpbDogc3RyaW5nO1xuICBhdHRhY2htZW50Pzoge1xuICAgIGZpbGVuYW1lOiBzdHJpbmc7XG4gICAgY29udGVudFR5cGU6IHN0cmluZztcbiAgICBjb250ZW50OiBzdHJpbmc7IC8vIGJhc2U2NCBjb250ZW50XG4gIH07XG4gIGV2ZW50SWQ/OiBzdHJpbmc7XG4gIHJvbGU6IFJvbGU7XG59XG5cbmludGVyZmFjZSBSZWNpcGllbnQge1xuICBlbWFpbDogc3RyaW5nO1xuICBuYW1lPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIE9idGllbmUgdW5hIGxpc3RhIGRlIGRlc3RpbmF0YXJpb3MgZGVzZGUgbGEgZnVlbnRlIGVzcGVjaWZpY2FkYS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gZ2V0UmVjaXBpZW50cyhcbiAgcmVjaXBpZW50RGF0YTogU2VuZENhbXBhaWduUGF5bG9hZFsncmVjaXBpZW50RGF0YSddXG4pOiBQcm9taXNlPFJlY2lwaWVudFtdPiB7XG4gIGNvbnN0IHsgdHlwZSwgdmFsdWUgfSA9IHJlY2lwaWVudERhdGE7XG5cbiAgY29uc3QgZmluZEtleSA9IChvYmo6IG9iamVjdCwgcG90ZW50aWFsS2V5czogc3RyaW5nW10pID0+IHtcbiAgICBjb25zdCBrZXkgPSBPYmplY3Qua2V5cyhvYmopLmZpbmQoayA9PiBwb3RlbnRpYWxLZXlzLmluY2x1ZGVzKGsudG9Mb3dlckNhc2UoKSkpO1xuICAgIHJldHVybiBrZXkgPyBvYmpba2V5IGFzIGtleW9mIHR5cGVvZiBvYmpdIDogdW5kZWZpbmVkO1xuICB9O1xuXG4gIGlmICh0eXBlID09PSAnY3N2Jykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZWNvcmRzID0gcGFyc2UodmFsdWUsIHtcbiAgICAgICAgY29sdW1uczogdHJ1ZSxcbiAgICAgICAgc2tpcF9lbXB0eV9saW5lczogdHJ1ZSxcbiAgICAgIH0pO1xuICAgICAgaWYgKHJlY29yZHMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG5cbiAgICAgIGNvbnN0IGVtYWlsS2V5ID0gT2JqZWN0LmtleXMocmVjb3Jkc1swXSkuZmluZChrID0+IGsudG9Mb3dlckNhc2UoKSA9PT0gJ2VtYWlsJyk7XG4gICAgICBpZiAoIWVtYWlsS2V5KSB0aHJvdyBuZXcgRXJyb3IoJ0xhIGNvbHVtbmEgXCJlbWFpbFwiIG5vIHNlIGVuY29udHLDsyBlbiBlbCBhcmNoaXZvIENTVi4nKTtcblxuICAgICAgcmV0dXJuIHJlY29yZHMubWFwKChyZWNvcmQ6IGFueSkgPT4gKHtcbiAgICAgICAgZW1haWw6IHJlY29yZFtlbWFpbEtleV0sXG4gICAgICAgIG5hbWU6IGZpbmRLZXkocmVjb3JkLCBbJ25hbWUnLCAnbm9tYnJlJywgJ2Z1bGxuYW1lJywgJ25vbWJyZSBjb21wbGV0byddKSxcbiAgICAgIH0pKS5maWx0ZXIoKHI6IFJlY2lwaWVudCkgPT4gci5lbWFpbCAmJiByLmVtYWlsLmluY2x1ZGVzKCdAJykpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBhbCBwcm9jZXNhciBlbCBhcmNoaXZvIENTVjonLCBlcnJvcik7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEVycm9yIGFsIHByb2Nlc2FyIGVsIGFyY2hpdm8gQ1NWOiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKTtcbiAgICB9XG4gIH1cblxuICBpZiAodHlwZSA9PT0gJ2V4Y2VsJykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBidWZmZXIgPSBCdWZmZXIuZnJvbSh2YWx1ZSwgJ2Jhc2U2NCcpO1xuICAgICAgY29uc3Qgd29ya2Jvb2sgPSBYTFNYLnJlYWQoYnVmZmVyLCB7IHR5cGU6ICdidWZmZXInIH0pO1xuICAgICAgY29uc3Qgc2hlZXROYW1lID0gd29ya2Jvb2suU2hlZXROYW1lc1swXTtcbiAgICAgIGNvbnN0IHdvcmtzaGVldCA9IHdvcmtib29rLlNoZWV0c1tzaGVldE5hbWVdO1xuICAgICAgY29uc3QganNvbkRhdGE6IGFueVtdID0gWExTWC51dGlscy5zaGVldF90b19qc29uKHdvcmtzaGVldCk7XG4gICAgICBpZiAoanNvbkRhdGEubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG5cbiAgICAgIGNvbnN0IGVtYWlsS2V5ID0gT2JqZWN0LmtleXMoanNvbkRhdGFbMF0pLmZpbmQoa2V5ID0+IGtleS50b0xvd2VyQ2FzZSgpID09PSAnZW1haWwnKTtcbiAgICAgIGlmICghZW1haWxLZXkpIHRocm93IG5ldyBFcnJvcignTGEgY29sdW1uYSBcImVtYWlsXCIgbm8gc2UgZW5jb250csOzIGVuIGVsIGFyY2hpdm8gRXhjZWwuJyk7XG5cbiAgICAgIHJldHVybiBqc29uRGF0YS5tYXAocm93ID0+ICh7XG4gICAgICAgIGVtYWlsOiByb3dbZW1haWxLZXldLFxuICAgICAgICBuYW1lOiBmaW5kS2V5KHJvdywgWyduYW1lJywgJ25vbWJyZScsICdmdWxsbmFtZScsICdub21icmUgY29tcGxldG8nXSksXG4gICAgICB9KSkuZmlsdGVyKHIgPT4gci5lbWFpbCAmJiB0eXBlb2Ygci5lbWFpbCA9PT0gJ3N0cmluZycgJiYgci5lbWFpbC5pbmNsdWRlcygnQCcpKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgYWwgcHJvY2VzYXIgZWwgYXJjaGl2byBFeGNlbDonLCBlcnJvcik7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEVycm9yIGFsIHByb2Nlc2FyIGVsIGFyY2hpdm8gRXhjZWw6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0eXBlID09PSAnaW5kaXZpZHVhbCcpIHtcbiAgICBjb25zdCBlbWFpbHMgPSB2YWx1ZS5zcGxpdCgvW1xccyw7XSsvKS5maWx0ZXIoZSA9PiBlICYmIGUuaW5jbHVkZXMoJ0AnKSk7XG4gICAgcmV0dXJuIGVtYWlscy5tYXAoZW1haWwgPT4gKHsgZW1haWwgfSkpO1xuICB9XG5cbiAgY29uc3QgeyBNWVNRTF9IT1NULCBNWVNRTF9VU0VSLCBNWVNRTF9QQVNTV09SRCwgTVlTUUxfREFUQUJBU0UsIE1ZU1FMX1BPUlQgfSA9IHByb2Nlc3MuZW52O1xuICBpZiAoIU1ZU1FMX0hPU1QgfHwgIU1ZU1FMX1VTRVIgfHwgIU1ZU1FMX0RBVEFCQVNFKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdGYWx0YW4gbGFzIHZhcmlhYmxlcyBkZSBlbnRvcm5vIGRlIGxhIGJhc2UgZGUgZGF0b3MuIFBvciBmYXZvciwgY29uZmlnw7pyYWxhcy4nKTtcbiAgfVxuXG4gIGxldCBjb25uZWN0aW9uO1xuICB0cnkge1xuICAgIGNvbm5lY3Rpb24gPSBhd2FpdCBteXNxbC5jcmVhdGVDb25uZWN0aW9uKHtcbiAgICAgIGhvc3Q6IE1ZU1FMX0hPU1QsXG4gICAgICBwb3J0OiBNWVNRTF9QT1JUID8gcGFyc2VJbnQoTVlTUUxfUE9SVCwgMTApIDogMzMwNixcbiAgICAgIHVzZXI6IE1ZU1FMX1VTRVIsXG4gICAgICBwYXNzd29yZDogTVlTUUxfUEFTU1dPUkQsXG4gICAgICBkYXRhYmFzZTogTVlTUUxfREFUQUJBU0UsXG4gICAgfSk7XG5cbiAgICBsZXQgc3FsX3F1ZXJ5ID0gJyc7XG4gICAgbGV0IHBhcmFtczogYW55W10gPSBbXTtcblxuICAgIGlmICh0eXBlID09PSAnZGF0ZScpIHtcbiAgICAgIHNxbF9xdWVyeSA9IGBcbiAgICAgICAgICBTRUxFQ1QgYy5lbWFpbCwgYy5ub21icmVcbiAgICAgICAgICBGUk9NIGNvbnRhY3RvcyBjXG4gICAgICAgICAgSk9JTiBhc2lzdGVudGVzIGEgT04gYy5pZF9jb250YWN0byA9IGEuaWRfY29udGFjdG9cbiAgICAgICAgICBKT0lOIGV2ZW50b3MgZSBPTiBhLmlkX2V2ZW50byA9IGUuaWRfZXZlbnRvXG4gICAgICAgICAgV0hFUkUgZS5mZWNoYSA9ID87XG4gICAgICBgO1xuICAgICAgcGFyYW1zID0gW3ZhbHVlXTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzcWwnKSB7XG4gICAgICBzcWxfcXVlcnkgPSB2YWx1ZTtcbiAgICAgIHBhcmFtcyA9IFtdO1xuICAgIH1cblxuICAgIGNvbnN0IFtyb3dzXSA9IGF3YWl0IGNvbm5lY3Rpb24uZXhlY3V0ZShzcWxfcXVlcnksIHBhcmFtcyk7XG4gICAgcmV0dXJuIChyb3dzIGFzIFJlY2lwaWVudFtdKS5maWx0ZXIocm93ID0+IHJvdy5lbWFpbCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgYWwgY29uZWN0YXIgbyBjb25zdWx0YXIgbGEgYmFzZSBkZSBkYXRvczonLCBlcnJvcik7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdObyBzZSBwdWRvIG9idGVuZXIgbG9zIGNvbnRhY3RvcyBkZSBsYSBiYXNlIGRlIGRhdG9zLicpO1xuICB9IGZpbmFsbHkge1xuICAgIGlmIChjb25uZWN0aW9uKSBhd2FpdCBjb25uZWN0aW9uLmVuZCgpO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldEdyYXBoQ2xpZW50KCkge1xuICAgIGNvbnN0IHsgR1JBUEhfQ0xJRU5UX0lELCBHUkFQSF9URU5BTlRfSUQsIEdSQVBIX0NMSUVOVF9TRUNSRVQgfSA9IHByb2Nlc3MuZW52O1xuICAgIGlmICghR1JBUEhfQ0xJRU5UX0lEIHx8ICFHUkFQSF9URU5BTlRfSUQgfHwgIUdSQVBIX0NMSUVOVF9TRUNSRVQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGYWx0YW4gbGFzIHZhcmlhYmxlcyBkZSBlbnRvcm5vIGRlIE1pY3Jvc29mdCBHcmFwaC4gUG9yIGZhdm9yLCBjb25maWfDunJhbGFzLicpO1xuICAgIH1cbiAgICBjb25zdCBjcmVkZW50aWFsID0gbmV3IENsaWVudFNlY3JldENyZWRlbnRpYWwoR1JBUEhfVEVOQU5UX0lELCBHUkFQSF9DTElFTlRfSUQsIEdSQVBIX0NMSUVOVF9TRUNSRVQpO1xuICAgIGNvbnN0IGF1dGhQcm92aWRlciA9IG5ldyBUb2tlbkNyZWRlbnRpYWxBdXRoZW50aWNhdGlvblByb3ZpZGVyKGNyZWRlbnRpYWwsIHsgc2NvcGVzOiBbJ2h0dHBzOi8vZ3JhcGgubWljcm9zb2Z0LmNvbS8uZGVmYXVsdCddIH0pO1xuICAgIHJldHVybiBDbGllbnQuaW5pdFdpdGhNaWRkbGV3YXJlKHsgYXV0aFByb3ZpZGVyIH0pO1xufVxuXG5jb25zdCBkZWxheSA9IChtczogbnVtYmVyKSA9PiBuZXcgUHJvbWlzZShyZXMgPT4gc2V0VGltZW91dChyZXMsIG1zKSk7XG5cbmFzeW5jIGZ1bmN0aW9uIHNlbmRFbWFpbFdpdGhSZXRyeShncmFwaENsaWVudDogQ2xpZW50LCBtZXNzYWdlOiBhbnksIHVzZXJNYWlsOiBzdHJpbmcsIG1heFJldHJpZXMgPSAzKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXhSZXRyaWVzOyBpKyspIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IGdyYXBoQ2xpZW50LmFwaShgL3VzZXJzLyR7dXNlck1haWx9L3NlbmRNYWlsYCkucG9zdCh7IG1lc3NhZ2UsIHNhdmVUb1NlbnRJdGVtczogJ3RydWUnIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzQ29kZSA9PT0gNDI5ICYmIGkgPCBtYXhSZXRyaWVzIC0gMSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJldHJ5QWZ0ZXIgPSBlcnJvci5yZXNwb25zZUhlYWRlcnM/LlsncmV0cnktYWZ0ZXInXSB8fCBNYXRoLnBvdygyLCBpKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYFRocm90dGxlZCBwb3IgbGEgQVBJIGRlIEdyYXBoLiBSZWludGVudGFuZG8gZW4gJHtyZXRyeUFmdGVyfSBzZWd1bmRvcy4uLmApO1xuICAgICAgICAgICAgICAgIGF3YWl0IGRlbGF5KHJldHJ5QWZ0ZXIgKiAxMDAwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKGBObyBzZSBwdWRvIGVudmlhciBlbCBjb3JyZW8gZGVzcHXDqXMgZGUgJHttYXhSZXRyaWVzfSByZWludGVudG9zLmApO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZENhbXBhaWduKHBheWxvYWQ6IFNlbmRDYW1wYWlnblBheWxvYWQpIHtcbiAgY29uc3QgeyBzdWJqZWN0LCBodG1sQm9keSwgcmVjaXBpZW50RGF0YSwgYXR0YWNobWVudCwgZXZlbnRJZCwgcm9sZSwgc2VuZGVyRW1haWwgfSA9IHBheWxvYWQ7XG4gIFxuICBpZiAoIWhhc1Blcm1pc3Npb24ocm9sZSwgQVBQX1BFUk1JU1NJT05TLlNFTkRfQ0FNUEFJR04pKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdBY2Nlc28gZGVuZWdhZG86IE5vIHRpZW5lcyBwZXJtaXNvIHBhcmEgZW52aWFyIGNhbXBhw7Fhcy4nKTtcbiAgfVxuICBcbiAgY29uc3QgYmF0Y2hTaXplID0gNTA7XG4gIGNvbnN0IGVtYWlsRGVsYXkgPSAxMDA7XG4gIGNvbnN0IGJhdGNoRGVsYXkgPSA1O1xuXG4gIGNvbnN0IHN0YXJ0VGltZSA9IERhdGUubm93KCk7XG5cbiAgaWYgKCFzZW5kZXJFbWFpbCkge1xuICAgIHRocm93IG5ldyBFcnJvcignRmFsdGEgZWwgY29ycmVvIGRlbCByZW1pdGVudGUuIFBvciBmYXZvciwgY29uZmlnw7pyYWxvLicpO1xuICB9XG5cbiAgY29uc3QgcmVjaXBpZW50cyA9IGF3YWl0IGdldFJlY2lwaWVudHMocmVjaXBpZW50RGF0YSk7XG4gIGlmIChyZWNpcGllbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIG1lc3NhZ2U6IGBObyBzZSBlbmNvbnRyYXJvbiBkZXN0aW5hdGFyaW9zLiBObyBzZSBlbnZpYXJvbiBjb3JyZW9zLmAsIHN0YXRzOiB7IHNlbnRDb3VudDogMCwgZmFpbGVkQ291bnQ6IDAsIHRvdGFsUmVjaXBpZW50czogMCwgZHVyYXRpb246IDAgfSB9O1xuICB9XG5cbiAgY29uc3QgZXZlbnQgPSBldmVudElkID8gZXZlbnRzLmZpbmQoZSA9PiBlLmlkID09PSBldmVudElkKSA6IG51bGw7XG4gIGNvbnN0IHRvdGFsUmVjaXBpZW50cyA9IHJlY2lwaWVudHMubGVuZ3RoO1xuICBjb25zdCBncmFwaENsaWVudCA9IGF3YWl0IGdldEdyYXBoQ2xpZW50KCk7XG4gIGxldCBzZW50Q291bnQgPSAwO1xuICBsZXQgZmFpbGVkQ291bnQgPSAwO1xuXG4gIGNvbnN0IHJlY2lwaWVudEJhdGNoZXMgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCByZWNpcGllbnRzLmxlbmd0aDsgaSArPSBiYXRjaFNpemUpIHtcbiAgICByZWNpcGllbnRCYXRjaGVzLnB1c2gocmVjaXBpZW50cy5zbGljZShpLCBpICsgYmF0Y2hTaXplKSk7XG4gIH1cblxuICBmb3IgKGNvbnN0IFtpbmRleCwgYmF0Y2hdIG9mIHJlY2lwaWVudEJhdGNoZXMuZW50cmllcygpKSB7XG4gICAgZm9yIChjb25zdCBjb250YWN0IG9mIGJhdGNoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgZmluYWxIdG1sQm9keSA9IGh0bWxCb2R5O1xuICAgICAgICAgICAgaWYgKGNvbnRhY3QubmFtZSkge1xuICAgICAgICAgICAgICBmaW5hbEh0bWxCb2R5ID0gZmluYWxIdG1sQm9keS5yZXBsYWNlKC97e2NvbnRhY3QubmFtZX19L2csIGNvbnRhY3QubmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgZmluYWxIdG1sQm9keSA9IGZpbmFsSHRtbEJvZHkucmVwbGFjZSgve3tldmVudC5kYXRlfX0vZywgZXZlbnQuZGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaW5hbEh0bWxCb2R5ID0gZmluYWxIdG1sQm9keS5yZXBsYWNlKC97e2NvbnRhY3QubmFtZX19L2csICcnKTtcbiAgICAgICAgICAgIGZpbmFsSHRtbEJvZHkgPSBmaW5hbEh0bWxCb2R5LnJlcGxhY2UoL3t7ZXZlbnQuZGF0ZX19L2csICcnKTtcblxuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IHtcbiAgICAgICAgICAgICAgICBzdWJqZWN0OiBzdWJqZWN0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHsgY29udGVudFR5cGU6ICdIVE1MJywgY29udGVudDogZmluYWxIdG1sQm9keSB9LFxuICAgICAgICAgICAgICAgIHRvUmVjaXBpZW50czogW3sgZW1haWxBZGRyZXNzOiB7IGFkZHJlc3M6IGNvbnRhY3QuZW1haWwgfSB9XSxcbiAgICAgICAgICAgICAgICBhdHRhY2htZW50czogYXR0YWNobWVudCA/IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnQG9kYXRhLnR5cGUnOiAnI21pY3Jvc29mdC5ncmFwaC5maWxlQXR0YWNobWVudCcsXG4gICAgICAgICAgICAgICAgICAgICAgbmFtZTogYXR0YWNobWVudC5maWxlbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogYXR0YWNobWVudC5jb250ZW50VHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICBjb250ZW50Qnl0ZXM6IGF0dGFjaG1lbnQuY29udGVudCxcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYXdhaXQgc2VuZEVtYWlsV2l0aFJldHJ5KGdyYXBoQ2xpZW50LCBtZXNzYWdlLCBzZW5kZXJFbWFpbCk7XG4gICAgICAgICAgICBzZW50Q291bnQrKztcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGZhaWxlZENvdW50Kys7XG4gICAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSAoZXJyb3IgYXMgYW55KT8uYm9keSA/IEpTT04ucGFyc2UoKGVycm9yIGFzIGFueSkuYm9keSkuZXJyb3IubWVzc2FnZSA6IChlcnJvciBhcyBFcnJvcikubWVzc2FnZTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIGFsIGVudmlhciBjb3JyZW8gYSAke2NvbnRhY3QuZW1haWx9IHVzYW5kbyBHcmFwaDpgLCBlcnJvck1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZihlbWFpbERlbGF5ID4gMCkgYXdhaXQgZGVsYXkoZW1haWxEZWxheSk7XG4gICAgfVxuICAgIFxuICAgIGlmIChpbmRleCA8IHJlY2lwaWVudEJhdGNoZXMubGVuZ3RoIC0gMSkge1xuICAgICAgaWYoYmF0Y2hEZWxheSA+IDApIGF3YWl0IGRlbGF5KGJhdGNoRGVsYXkgKiAxMDAwKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBlbmRUaW1lID0gRGF0ZS5ub3coKTtcbiAgY29uc3QgZHVyYXRpb24gPSAoZW5kVGltZSAtIHN0YXJ0VGltZSkgLyAxMDAwO1xuXG4gIGxldCBtZXNzYWdlID0gYEVudsOtbyBjb21wbGV0YWRvIGNvbiBNaWNyb3NvZnQgR3JhcGguIEVudmlhZG9zOiAke3NlbnRDb3VudH0uIEZhbGxpZG9zOiAke2ZhaWxlZENvdW50fS5gO1xuICBpZiAoZmFpbGVkQ291bnQgPiAwKSB7XG4gICAgbWVzc2FnZSArPSAnIFJldmlzYSBsYSBjb25zb2xhIGRlbCBzZXJ2aWRvciBwYXJhIG3DoXMgZGV0YWxsZXMgc29icmUgbG9zIGVycm9yZXMuJztcbiAgfVxuXG4gIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIG1lc3NhZ2UsIHN0YXRzOiB7IHNlbnRDb3VudCwgZmFpbGVkQ291bnQsIHRvdGFsUmVjaXBpZW50cywgZHVyYXRpb24gfSB9O1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJ5U0E4S3NCIn0=
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/actions/data:d9fe16 [app-client] (ecmascript) <text/javascript>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"4021b06e3ddd3a00eaec703b80737f542c40396c6b":"sendTestEmailAction"},"src/actions/send-test-email-action.ts",""] */ __turbopack_context__.s({
    "sendTestEmailAction": (()=>sendTestEmailAction)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var sendTestEmailAction = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("4021b06e3ddd3a00eaec703b80737f542c40396c6b", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "sendTestEmailAction"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vc2VuZC10ZXN0LWVtYWlsLWFjdGlvbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbid1c2Ugc2VydmVyJztcblxuaW1wb3J0ICdpc29tb3JwaGljLWZldGNoJztcbmltcG9ydCB7IENsaWVudFNlY3JldENyZWRlbnRpYWwgfSBmcm9tICdAYXp1cmUvaWRlbnRpdHknO1xuaW1wb3J0IHsgQ2xpZW50IH0gZnJvbSAnQG1pY3Jvc29mdC9taWNyb3NvZnQtZ3JhcGgtY2xpZW50JztcbmltcG9ydCB7IFRva2VuQ3JlZGVudGlhbEF1dGhlbnRpY2F0aW9uUHJvdmlkZXIgfSBmcm9tICdAbWljcm9zb2Z0L21pY3Jvc29mdC1ncmFwaC1jbGllbnQvYXV0aFByb3ZpZGVycy9henVyZVRva2VuQ3JlZGVudGlhbHMnO1xuaW1wb3J0IHsgZm9ybWF0IH0gZnJvbSAnZGF0ZS1mbnMnO1xuaW1wb3J0IHsgZXMgfSBmcm9tICdkYXRlLWZucy9sb2NhbGUnO1xuaW1wb3J0IHsgZXZlbnRzIH0gZnJvbSAnQC9saWIvZGF0YSc7XG5pbXBvcnQgeyBoYXNQZXJtaXNzaW9uLCBBUFBfUEVSTUlTU0lPTlMsIHR5cGUgUm9sZSB9IGZyb20gJ0AvbGliL3Blcm1pc3Npb25zJztcblxuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IEFjY2nDs24gZGUgc2Vydmlkb3IgcGFyYSBlbnZpYXIgdW4gw7puaWNvIGNvcnJlbyBkZSBwcnVlYmEuXG4gKiBJbmNsdXllIHZlcmlmaWNhY2nDs24gZGUgcGVybWlzb3MgYmFzYWRhIGVuIHJvbC5cbiAqL1xuXG5pbnRlcmZhY2UgU2VuZFRlc3RFbWFpbFBheWxvYWQge1xuICBzdWJqZWN0OiBzdHJpbmc7XG4gIGh0bWxCb2R5OiBzdHJpbmc7XG4gIHJlY2lwaWVudEVtYWlsOiBzdHJpbmc7XG4gIHNlbmRlckVtYWlsOiBzdHJpbmc7XG4gIGF0dGFjaG1lbnQ/OiB7XG4gICAgZmlsZW5hbWU6IHN0cmluZztcbiAgICBjb250ZW50VHlwZTogc3RyaW5nO1xuICAgIGNvbnRlbnQ6IHN0cmluZzsgLy8gYmFzZTY0IGNvbnRlbnRcbiAgfTtcbiAgZXZlbnRJZD86IHN0cmluZztcbiAgcm9sZTogUm9sZTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0R3JhcGhDbGllbnQoKSB7XG4gICAgY29uc3QgeyBHUkFQSF9DTElFTlRfSUQsIEdSQVBIX1RFTkFOVF9JRCwgR1JBUEhfQ0xJRU5UX1NFQ1JFVCB9ID0gcHJvY2Vzcy5lbnY7XG4gICAgaWYgKCFHUkFQSF9DTElFTlRfSUQgfHwgIUdSQVBIX1RFTkFOVF9JRCB8fCAhR1JBUEhfQ0xJRU5UX1NFQ1JFVCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZhbHRhbiBsYXMgdmFyaWFibGVzIGRlIGVudG9ybm8gZGUgTWljcm9zb2Z0IEdyYXBoLiBQb3IgZmF2b3IsIGNvbmZpZ8O6cmFsYXMgZW4gQWp1c3Rlcy4nKTtcbiAgICB9XG4gICAgY29uc3QgY3JlZGVudGlhbCA9IG5ldyBDbGllbnRTZWNyZXRDcmVkZW50aWFsKEdSQVBIX1RFTkFOVF9JRCwgR1JBUEhfQ0xJRU5UX0lELCBHUkFQSF9DTElFTlRfU0VDUkVUKTtcbiAgICBjb25zdCBhdXRoUHJvdmlkZXIgPSBuZXcgVG9rZW5DcmVkZW50aWFsQXV0aGVudGljYXRpb25Qcm92aWRlcihjcmVkZW50aWFsLCB7IHNjb3BlczogWydodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20vLmRlZmF1bHQnXSB9KTtcbiAgICByZXR1cm4gQ2xpZW50LmluaXRXaXRoTWlkZGxld2FyZSh7IGF1dGhQcm92aWRlciB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlbmRUZXN0RW1haWxBY3Rpb24ocGF5bG9hZDogU2VuZFRlc3RFbWFpbFBheWxvYWQpOiBQcm9taXNlPHsgc3VjY2VzczogYm9vbGVhbiB9PiB7XG4gIGNvbnN0IHsgc3ViamVjdCwgaHRtbEJvZHksIHJlY2lwaWVudEVtYWlsLCBzZW5kZXJFbWFpbCwgYXR0YWNobWVudCwgZXZlbnRJZCwgcm9sZSB9ID0gcGF5bG9hZDtcbiAgXG4gIGlmICghaGFzUGVybWlzc2lvbihyb2xlLCBBUFBfUEVSTUlTU0lPTlMuU0VORF9DQU1QQUlHTikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0FjY2VzbyBkZW5lZ2FkbzogTm8gdGllbmVzIHBlcm1pc28gcGFyYSBlbnZpYXIgY29ycmVvcyBkZSBwcnVlYmEuJyk7XG4gIH1cblxuICBpZiAoIXNlbmRlckVtYWlsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdGYWx0YSBlbCBjb3JyZW8gZGVsIHJlbWl0ZW50ZS4gUG9yIGZhdm9yLCBjb25maWfDunJhbG8uJyk7XG4gIH1cblxuICBjb25zdCBldmVudCA9IGV2ZW50SWQgPyBldmVudHMuZmluZChlID0+IGUuaWQgPT09IGV2ZW50SWQpIDogbnVsbDtcbiAgXG4gIGxldCBmaW5hbEh0bWxCb2R5ID0gaHRtbEJvZHk7XG4gIC8vIFJlcGxhY2UgcGxhY2Vob2xkZXJzIHdpdGggdGVzdCBkYXRhXG4gIGZpbmFsSHRtbEJvZHkgPSBmaW5hbEh0bWxCb2R5LnJlcGxhY2UoL3t7Y29udGFjdC5uYW1lfX0vZywgJ1VzdWFyaW8gZGUgUHJ1ZWJhJyk7XG4gIGlmIChldmVudCkge1xuICAgIGZpbmFsSHRtbEJvZHkgPSBmaW5hbEh0bWxCb2R5LnJlcGxhY2UoL3t7ZXZlbnQuZGF0ZX19L2csIGV2ZW50LmRhdGUpO1xuICB9IGVsc2Uge1xuICAgIC8vIElmIG5vIGV2ZW50LCB1c2UgdG9kYXkncyBkYXRlIGZvciBwbGFjZWhvbGRlclxuICAgIGZpbmFsSHRtbEJvZHkgPSBmaW5hbEh0bWxCb2R5LnJlcGxhY2UoL3t7ZXZlbnQuZGF0ZX19L2csIGZvcm1hdChuZXcgRGF0ZSgpLCAnUFBQJywgeyBsb2NhbGU6IGVzIH0pKTtcbiAgfVxuICAvLyBDbGVhbiB1cCBhbnkgb3RoZXIgdW5yZXBsYWNlZCBwbGFjZWhvbGRlcnNcbiAgZmluYWxIdG1sQm9keSA9IGZpbmFsSHRtbEJvZHkucmVwbGFjZSgve3tjb250YWN0Lm5hbWV9fS9nLCAnJyk7XG4gIGZpbmFsSHRtbEJvZHkgPSBmaW5hbEh0bWxCb2R5LnJlcGxhY2UoL3t7ZXZlbnQuZGF0ZX19L2csICcnKTtcblxuXG4gIGNvbnN0IG1lc3NhZ2UgPSB7XG4gICAgc3ViamVjdDogYFtQUlVFQkFdICR7c3ViamVjdH1gLFxuICAgIGJvZHk6IHsgY29udGVudFR5cGU6ICdIVE1MJywgY29udGVudDogZmluYWxIdG1sQm9keSB9LFxuICAgIHRvUmVjaXBpZW50czogW3sgZW1haWxBZGRyZXNzOiB7IGFkZHJlc3M6IHJlY2lwaWVudEVtYWlsIH0gfV0sXG4gICAgYXR0YWNobWVudHM6IGF0dGFjaG1lbnQgPyBbXG4gICAgICB7XG4gICAgICAgICAgJ0BvZGF0YS50eXBlJzogJyNtaWNyb3NvZnQuZ3JhcGguZmlsZUF0dGFjaG1lbnQnLFxuICAgICAgICAgIG5hbWU6IGF0dGFjaG1lbnQuZmlsZW5hbWUsXG4gICAgICAgICAgY29udGVudFR5cGU6IGF0dGFjaG1lbnQuY29udGVudFR5cGUsXG4gICAgICAgICAgY29udGVudEJ5dGVzOiBhdHRhY2htZW50LmNvbnRlbnQsXG4gICAgICB9XG4gICAgXSA6IHVuZGVmaW5lZCxcbiAgfTtcblxuICB0cnkge1xuICAgIGNvbnN0IGdyYXBoQ2xpZW50ID0gYXdhaXQgZ2V0R3JhcGhDbGllbnQoKTtcbiAgICBhd2FpdCBncmFwaENsaWVudC5hcGkoYC91c2Vycy8ke3NlbmRlckVtYWlsfS9zZW5kTWFpbGApLnBvc3QoeyBtZXNzYWdlLCBzYXZlVG9TZW50SXRlbXM6ICd0cnVlJyB9KTtcbiAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH07XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXJyb3JNZXNzYWdlID0gKGVycm9yIGFzIGFueSk/LmJvZHkgPyBKU09OLnBhcnNlKChlcnJvciBhcyBhbnkpLmJvZHkpLmVycm9yLm1lc3NhZ2UgOiAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2U7XG4gICAgY29uc29sZS5lcnJvcihgRXJyb3IgYWwgZW52aWFyIGNvcnJlbyBkZSBwcnVlYmEgYSAke3JlY2lwaWVudEVtYWlsfSB1c2FuZG8gR3JhcGg6YCwgZXJyb3JNZXNzYWdlKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIHNlIHB1ZG8gZW52aWFyIGVsIGNvcnJlbyBkZSBwcnVlYmE6ICR7ZXJyb3JNZXNzYWdlfWApO1xuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6ImtUQXlDc0IifQ==
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/label.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/**
 * @fileoverview Componente de UI "Label" (Etiqueta).
 * Muestra una etiqueta para un campo de formulario.
 *
 * @see https://ui.shadcn.com/docs/components/label
 */ __turbopack_context__.s({
    "Label": (()=>Label)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-label/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const labelVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
/**
 * Componente Label que se asocia con un campo de entrada.
 */ const Label = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(labelVariants(), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/label.tsx",
        lineNumber: 28,
        columnNumber: 3
    }, this));
_c1 = Label;
Label.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Label$React.forwardRef");
__turbopack_context__.k.register(_c1, "Label");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/textarea.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/**
 * @fileoverview Componente de UI "Textarea".
 * Proporciona un campo de entrada de texto de varias líneas.
 *
 * @see https://ui.shadcn.com/docs/components/textarea
 */ __turbopack_context__.s({
    "Textarea": (()=>Textarea)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
/**
 * Componente Textarea para entrada de texto largo.
 */ const Textarea = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm', className),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/textarea.tsx",
        lineNumber: 18,
        columnNumber: 7
    }, this);
});
_c1 = Textarea;
Textarea.displayName = 'Textarea';
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Textarea$React.forwardRef");
__turbopack_context__.k.register(_c1, "Textarea");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/tabs.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/**
 * @fileoverview Componente de UI "Tabs" (Pestañas).
 * Un conjunto de pestañas que muestran un panel de contenido a la vez.
 *
 * @see https://ui.shadcn.com/docs/components/tabs
 */ __turbopack_context__.s({
    "Tabs": (()=>Tabs),
    "TabsContent": (()=>TabsContent),
    "TabsList": (()=>TabsList),
    "TabsTrigger": (()=>TabsTrigger)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-tabs/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
/**
 * Componente raíz del sistema de pestañas.
 */ const Tabs = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
/**
 * Lista que contiene los disparadores de las pestañas.
 */ const TabsList = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["List"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/tabs.tsx",
        lineNumber: 27,
        columnNumber: 3
    }, this));
_c1 = TabsList;
TabsList.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["List"].displayName;
/**
 * El botón que activa una pestaña para mostrar su contenido.
 */ const TabsTrigger = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/tabs.tsx",
        lineNumber: 45,
        columnNumber: 3
    }, this));
_c3 = TabsTrigger;
TabsTrigger.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"].displayName;
/**
 * El panel de contenido asociado a una pestaña.
 */ const TabsContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/tabs.tsx",
        lineNumber: 63,
        columnNumber: 3
    }, this));
_c5 = TabsContent;
TabsContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "TabsList$React.forwardRef");
__turbopack_context__.k.register(_c1, "TabsList");
__turbopack_context__.k.register(_c2, "TabsTrigger$React.forwardRef");
__turbopack_context__.k.register(_c3, "TabsTrigger");
__turbopack_context__.k.register(_c4, "TabsContent$React.forwardRef");
__turbopack_context__.k.register(_c5, "TabsContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/actions/data:bde38a [app-client] (ecmascript) <text/javascript>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"00fdeee1b67912cd40169e627b506c6488d511c086":"getTemplatesAction"},"src/actions/template-actions.ts",""] */ __turbopack_context__.s({
    "getTemplatesAction": (()=>getTemplatesAction)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var getTemplatesAction = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("00fdeee1b67912cd40169e627b506c6488d511c086", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "getTemplatesAction"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vdGVtcGxhdGUtYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHNlcnZlcic7XG5cbmltcG9ydCBteXNxbCBmcm9tICdteXNxbDIvcHJvbWlzZSc7XG5pbXBvcnQgdHlwZSB7IEJsb2NrIH0gZnJvbSAnQC9saWIvdGVtcGxhdGUtdXRpbHMnO1xuXG5hc3luYyBmdW5jdGlvbiBnZXREYkNvbm5lY3Rpb24oKSB7XG4gICAgY29uc3QgeyBNWVNRTF9IT1NULCBNWVNRTF9VU0VSLCBNWVNRTF9QQVNTV09SRCwgTVlTUUxfREFUQUJBU0UsIE1ZU1FMX1BPUlQgfSA9IHByb2Nlc3MuZW52O1xuICAgIGlmICghTVlTUUxfSE9TVCB8fCAhTVlTUUxfVVNFUiB8fCAhTVlTUUxfREFUQUJBU0UpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGYWx0YW4gbGFzIHZhcmlhYmxlcyBkZSBlbnRvcm5vIGRlIGxhIGJhc2UgZGUgZGF0b3MuIFBvciBmYXZvciwgY29uZmlnw7pyYWxhcy4nKTtcbiAgICB9XG4gICAgcmV0dXJuIG15c3FsLmNyZWF0ZUNvbm5lY3Rpb24oe1xuICAgICAgICBob3N0OiBNWVNRTF9IT1NULFxuICAgICAgICBwb3J0OiBNWVNRTF9QT1JUID8gcGFyc2VJbnQoTVlTUUxfUE9SVCwgMTApIDogMzMwNixcbiAgICAgICAgdXNlcjogTVlTUUxfVVNFUixcbiAgICAgICAgcGFzc3dvcmQ6IE1ZU1FMX1BBU1NXT1JELFxuICAgICAgICBkYXRhYmFzZTogTVlTUUxfREFUQUJBU0UsXG4gICAgfSk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGVtcGxhdGUge1xuICAgIGlkX3BsYW50aWxsYTogbnVtYmVyO1xuICAgIG5vbWJyZTogc3RyaW5nO1xuICAgIGFzdW50b19wcmVkZXRlcm1pbmFkbzogc3RyaW5nO1xuICAgIGNvbnRlbmlkbzogQmxvY2tbXTtcbiAgICBmZWNoYV9jcmVhY2lvbjogc3RyaW5nO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0VGVtcGxhdGVzQWN0aW9uKCk6IFByb21pc2U8VGVtcGxhdGVbXT4ge1xuICAgIGxldCBjb25uZWN0aW9uO1xuICAgIHRyeSB7XG4gICAgICAgIGNvbm5lY3Rpb24gPSBhd2FpdCBnZXREYkNvbm5lY3Rpb24oKTtcbiAgICAgICAgY29uc3QgW3Jvd3NdID0gYXdhaXQgY29ubmVjdGlvbi5leGVjdXRlKCdTRUxFQ1QgaWRfcGxhbnRpbGxhLCBub21icmUsIGFzdW50b19wcmVkZXRlcm1pbmFkbywgY29udGVuaWRvLCBmZWNoYV9jcmVhY2lvbiBGUk9NIHBsYW50aWxsYXMgT1JERVIgQlkgZmVjaGFfY3JlYWNpb24gREVTQycpO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgdGVtcGxhdGVzID0gKHJvd3MgYXMgYW55W10pLm1hcChyb3cgPT4gKHtcbiAgICAgICAgICAgIC4uLnJvdyxcbiAgICAgICAgICAgIGNvbnRlbmlkbzogcm93LmNvbnRlbmlkbyA/IEpTT04ucGFyc2Uocm93LmNvbnRlbmlkbykgOiBbXSxcbiAgICAgICAgfSkpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlcyBhcyBUZW1wbGF0ZVtdO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGFsIG9idGVuZXIgbGFzIHBsYW50aWxsYXM6JywgZXJyb3IpO1xuICAgICAgICByZXR1cm4gW107XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGNvbm5lY3Rpb24pIGF3YWl0IGNvbm5lY3Rpb24uZW5kKCk7XG4gICAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0VGVtcGxhdGVBY3Rpb24oaWQ6IG51bWJlcik6IFByb21pc2U8VGVtcGxhdGUgfCBudWxsPiB7XG4gICAgbGV0IGNvbm5lY3Rpb247XG4gICAgdHJ5IHtcbiAgICAgICAgY29ubmVjdGlvbiA9IGF3YWl0IGdldERiQ29ubmVjdGlvbigpO1xuICAgICAgICBjb25zdCBbcm93c10gPSBhd2FpdCBjb25uZWN0aW9uLmV4ZWN1dGUoJ1NFTEVDVCBpZF9wbGFudGlsbGEsIG5vbWJyZSwgYXN1bnRvX3ByZWRldGVybWluYWRvLCBjb250ZW5pZG8sIGZlY2hhX2NyZWFjaW9uIEZST00gcGxhbnRpbGxhcyBXSEVSRSBpZF9wbGFudGlsbGEgPSA/JywgW2lkXSk7XG4gICAgICAgIFxuICAgICAgICBpZiAoKHJvd3MgYXMgYW55W10pLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgY29uc3Qgcm93ID0gKHJvd3MgYXMgYW55W10pWzBdO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4ucm93LFxuICAgICAgICAgICAgY29udGVuaWRvOiByb3cuY29udGVuaWRvID8gSlNPTi5wYXJzZShyb3cuY29udGVuaWRvKSA6IFtdLFxuICAgICAgICB9IGFzIFRlbXBsYXRlO1xuXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgYWwgb2J0ZW5lciBsYSBwbGFudGlsbGEgJHtpZH06YCwgZXJyb3IpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoY29ubmVjdGlvbikgYXdhaXQgY29ubmVjdGlvbi5lbmQoKTtcbiAgICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzYXZlVGVtcGxhdGVBY3Rpb24odGVtcGxhdGVEYXRhOiB7XG4gICAgaWQ/OiBudW1iZXIsXG4gICAgbm9tYnJlOiBzdHJpbmcsXG4gICAgYXN1bnRvX3ByZWRldGVybWluYWRvOiBzdHJpbmcsXG4gICAgY29udGVuaWRvOiBCbG9ja1tdXG59KTogUHJvbWlzZTx7IHN1Y2Nlc3M6IGJvb2xlYW47IG1lc3NhZ2U6IHN0cmluZywgaWQ/OiBudW1iZXIgfT4ge1xuICAgIGNvbnN0IHsgaWQsIG5vbWJyZSwgYXN1bnRvX3ByZWRldGVybWluYWRvLCBjb250ZW5pZG8gfSA9IHRlbXBsYXRlRGF0YTtcbiAgICBjb25zdCBjb250ZW5pZG9Kc29uID0gSlNPTi5zdHJpbmdpZnkoY29udGVuaWRvKTtcbiAgICBsZXQgY29ubmVjdGlvbjtcbiAgICB0cnkge1xuICAgICAgICBjb25uZWN0aW9uID0gYXdhaXQgZ2V0RGJDb25uZWN0aW9uKCk7XG4gICAgICAgIGlmIChpZCkge1xuICAgICAgICAgICAgYXdhaXQgY29ubmVjdGlvbi5leGVjdXRlKFxuICAgICAgICAgICAgICAgICdVUERBVEUgcGxhbnRpbGxhcyBTRVQgbm9tYnJlID0gPywgYXN1bnRvX3ByZWRldGVybWluYWRvID0gPywgY29udGVuaWRvID0gPyBXSEVSRSBpZF9wbGFudGlsbGEgPSA/JyxcbiAgICAgICAgICAgICAgICBbbm9tYnJlLCBhc3VudG9fcHJlZGV0ZXJtaW5hZG8sIGNvbnRlbmlkb0pzb24sIGlkXVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIG1lc3NhZ2U6ICdQbGFudGlsbGEgYWN0dWFsaXphZGEgY29uIMOpeGl0by4nLCBpZCB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgW3Jlc3VsdF0gPSBhd2FpdCBjb25uZWN0aW9uLmV4ZWN1dGUoXG4gICAgICAgICAgICAgICAgJ0lOU0VSVCBJTlRPIHBsYW50aWxsYXMgKG5vbWJyZSwgYXN1bnRvX3ByZWRldGVybWluYWRvLCBjb250ZW5pZG8pIFZBTFVFUyAoPywgPywgPyknLFxuICAgICAgICAgICAgICAgIFtub21icmUsIGFzdW50b19wcmVkZXRlcm1pbmFkbywgY29udGVuaWRvSnNvbl1cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBpbnNlcnRJZCA9IChyZXN1bHQgYXMgYW55KS5pbnNlcnRJZDtcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIG1lc3NhZ2U6ICdQbGFudGlsbGEgY3JlYWRhIGNvbiDDqXhpdG8uJywgaWQ6IGluc2VydElkIH07XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBhbCBndWFyZGFyIGxhIHBsYW50aWxsYTonLCBlcnJvcik7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBtZXNzYWdlOiBgRXJyb3IgYWwgZ3VhcmRhciBsYSBwbGFudGlsbGE6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoY29ubmVjdGlvbikgYXdhaXQgY29ubmVjdGlvbi5lbmQoKTtcbiAgICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVUZW1wbGF0ZUFjdGlvbihpZDogbnVtYmVyKTogUHJvbWlzZTx7IHN1Y2Nlc3M6IGJvb2xlYW47IG1lc3NhZ2U6IHN0cmluZyB9PiB7XG4gICAgbGV0IGNvbm5lY3Rpb247XG4gICAgdHJ5IHtcbiAgICAgICAgY29ubmVjdGlvbiA9IGF3YWl0IGdldERiQ29ubmVjdGlvbigpO1xuICAgICAgICBhd2FpdCBjb25uZWN0aW9uLmV4ZWN1dGUoJ0RFTEVURSBGUk9NIHBsYW50aWxsYXMgV0hFUkUgaWRfcGxhbnRpbGxhID0gPycsIFtpZF0pO1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBtZXNzYWdlOiAnUGxhbnRpbGxhIGVsaW1pbmFkYSBjb24gw6l4aXRvLicgfTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGBFcnJvciBhbCBlbGltaW5hciBsYSBwbGFudGlsbGEgJHtpZH06YCwgZXJyb3IpO1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgbWVzc2FnZTogYEVycm9yIGFsIGVsaW1pbmFyIGxhIHBsYW50aWxsYTogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChjb25uZWN0aW9uKSBhd2FpdCBjb25uZWN0aW9uLmVuZCgpO1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiMlNBMkJzQiJ9
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/template-utils.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "blockSchema": (()=>blockSchema),
    "formSchema": (()=>formSchema),
    "generateHtmlFromBlocks": (()=>generateHtmlFromBlocks)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zod/lib/index.mjs [app-client] (ecmascript)");
;
const textBlockSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].object({
    text: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string().default('Escribe tu texto aquí...'),
    color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string().default('#000000'),
    fontSize: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].number().default(16),
    lineHeight: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].number().default(1.5),
    fontWeight: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].enum([
        'normal',
        'bold'
    ]).default('normal'),
    textAlign: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].enum([
        'left',
        'center',
        'right'
    ]).default('left')
});
const imageBlockSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].object({
    src: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string().url().default('https://placehold.co/600x300.png'),
    alt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string().default('Imagen descriptiva'),
    width: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].number().default(100),
    align: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].enum([
        'left',
        'center',
        'right'
    ]).default('center')
});
const buttonBlockSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].object({
    text: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string().default('Haz Clic Aquí'),
    href: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string().url().default('https://example.com'),
    backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string().default('#74B49B'),
    color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string().default('#ffffff'),
    textAlign: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].enum([
        'left',
        'center',
        'right'
    ]).default('center'),
    borderRadius: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].number().default(5)
});
const spacerBlockSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].object({
    height: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].number().default(30)
});
const dividerBlockSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].object({
    color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string().default('#cccccc'),
    padding: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].number().default(10)
});
const htmlBlockSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].object({
    code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string().default('<!-- Tu código HTML aquí -->')
});
const blockSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].discriminatedUnion('type', [
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].object({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string(),
        type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].literal('text'),
        content: textBlockSchema
    }),
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].object({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string(),
        type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].literal('image'),
        content: imageBlockSchema
    }),
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].object({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string(),
        type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].literal('button'),
        content: buttonBlockSchema
    }),
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].object({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string(),
        type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].literal('spacer'),
        content: spacerBlockSchema
    }),
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].object({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string(),
        type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].literal('divider'),
        content: dividerBlockSchema
    }),
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].object({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string(),
        type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].literal('html'),
        content: htmlBlockSchema
    })
]);
const formSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].object({
    templateName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string().min(1, 'El nombre de la plantilla es requerido.'),
    emailSubject: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string().min(1, 'El asunto del correo es requerido.'),
    blocks: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].array(blockSchema)
});
function generateHtmlFromBlocks(blocks) {
    const content = blocks.map((block)=>{
        switch(block.type){
            case 'text':
                {
                    const { text, color, fontSize, lineHeight, fontWeight, textAlign } = block.content;
                    return `<tr><td style="padding: 10px 20px; font-family: Arial, sans-serif; text-align: ${textAlign};"><p style="margin:0; color: ${color}; font-size: ${fontSize}px; line-height: ${lineHeight}; font-weight: ${fontWeight};">${text.replace(/\n/g, '<br>')}</p></td></tr>`;
                }
            case 'image':
                {
                    const { src, alt, width, align } = block.content;
                    return `<tr><td style="padding: 10px 20px; text-align: ${align};"><img src="${src}" alt="${alt || ''}" style="max-width: ${width}%; height: auto; border: 0;" /></td></tr>`;
                }
            case 'button':
                {
                    const { text, href, backgroundColor, color, textAlign, borderRadius } = block.content;
                    return `<tr><td style="padding: 20px; text-align: ${textAlign};"><a href="${href}" target="_blank" style="background-color: ${backgroundColor}; color: ${color}; padding: 12px 25px; text-decoration: none; border-radius: ${borderRadius}px; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; display: inline-block;">${text}</a></td></tr>`;
                }
            case 'spacer':
                {
                    const { height } = block.content;
                    return `<tr><td style="height: ${height}px; line-height: ${height}px; font-size: ${height}px;">&nbsp;</td></tr>`;
                }
            case 'divider':
                {
                    const { color, padding } = block.content;
                    return `<tr><td style="padding: ${padding}px 20px;"><hr style="border: none; border-top: 1px solid ${color}; margin: 0;" /></td></tr>`;
                }
            case 'html':
                {
                    return `<tr><td style="padding: 0; margin: 0;">${block.content.code}</td></tr>`;
                }
            default:
                return '';
        }
    }).join('');
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Email Preview</title>
        <meta charset="UTF-8">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" style="padding: 20px;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              ${content}
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/(main)/send/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>SendPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$accordion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/accordion.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.js [app-client] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MailPlus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail-plus.js [app-client] (ecmascript) <export default as MailPlus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.js [app-client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$reply$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Reply$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/reply.js [app-client] (ecmascript) <export default as Reply>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$reply$2d$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ReplyAll$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/reply-all.js [app-client] (ecmascript) <export default as ReplyAll>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$forward$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Forward$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/forward.js [app-client] (ecmascript) <export default as Forward>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-client] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__File$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file.js [app-client] (ecmascript) <export default as File>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$laptop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Laptop$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/laptop.js [app-client] (ecmascript) <export default as Laptop>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/smartphone.js [app-client] (ecmascript) <export default as Smartphone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/list.js [app-client] (ecmascript) <export default as List>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/popover.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$calendar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/calendar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/date-fns/format.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$locale$2f$es$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/locale/es.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/use-toast.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$data$3a$64e5bb__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/actions/data:64e5bb [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$data$3a$d9fe16__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/actions/data:d9fe16 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/textarea.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/tabs.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$csv$2d$parse$2f$lib$2f$sync$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/csv-parse/lib/sync.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$csv$2d$parse$2f$lib$2f$sync$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/csv-parse/lib/sync.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/xlsx/xlsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$es$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jspdf/dist/jspdf.es.min.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$permissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/permissions.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$data$3a$bde38a__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/actions/data:bde38a [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$template$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/template-utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const defaultInitialBody = `<div style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 16px; line-height: 1.5; color: #333333; background-color: #ffffff; margin: 0; padding: 0;">
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #ffffff;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" border="0" cellpadding="0" cellspacing="0" class="content-table" style="width: 100%; max-width: 600px; margin: 0 auto;">
          <!-- Header -->
          <tr>
            <td>
              <img src="https://placehold.co/600x95.png" alt="Header Banner" style="width: 100%; height: auto; display: block;" data-ai-hint="papalote museum header" />
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 30px 20px;">
              <p style="margin: 0 0 16px 0;"><strong>Maestra, Maestro:</strong></p>
              <p style="margin: 0 0 16px 0;">Nos alegra mucho que hayas utilizado nuestra página para planear tu visita a Papalote Museo del Niño.</p>
              <p style="margin: 0 0 16px 0;">En este correo encontrarás adjuntos:</p>
              <ul style="margin: 0 0 16px 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Formato Proyecto de visita (prellenado)</li>
                <li style="margin-bottom: 8px;">Formatos administrativos</li>
              </ul>
              <p style="margin: 0 0 16px 0;">Esperamos que estas herramientas te ayuden a detonar proyectos increíbles y faciliten la visita con tu grupo escolar.</p>
              
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td valign="top" style="padding-right: 20px; width: 60%;">
                    <p style="margin: 0 0 16px 0;"><strong>Si requieres más información:</strong></p>
                    <p style="margin: 0 0 8px 0;">Llámanos a: 5552371710 - 5546017873</p>
                    <p style="margin: 0 0 16px 0;">O escríbenos un whatsApp.</p>
                    <p style="margin: 0 0 16px 0;">
                      <img src="https://placehold.co/40x40.png" alt="WhatsApp" width="30" height="30" style="vertical-align: middle;" data-ai-hint="whatsapp logo" />
                    </p>
                    <p style="margin: 0;"><strong>¡Nos vemos muy pronto!</strong></p>
                  </td>
                  <td width="40%" valign="top" align="center">
                    <img src="https://placehold.co/200x150.png" alt="¡No olvides descargar la guía educativa! Da clic aquí" style="max-width: 100%; height: auto; display: block;" data-ai-hint="educational guide monster" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td>
              <img src="https://placehold.co/600x50.png" alt="Footer Banner" style="width: 100%; height: auto; display: block;" data-ai-hint="papalote museum footer" />
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>`;
function SendPage() {
    _s();
    const [date, setDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])();
    const [isSending, setIsSending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSendingTest, setIsSendingTest] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const { role } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const isIT = role === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$permissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROLES"].IT;
    const [senderEmail, setSenderEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [testEmail, setTestEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [subject, setSubject] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [emailBody, setEmailBody] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [recipientSource, setRecipientSource] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("file");
    const [fileContent, setFileContent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [uploadedFileType, setUploadedFileType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [uploadedFileName, setUploadedFileName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [sqlQuery, setSqlQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("SELECT email, nombre FROM contactos WHERE suscrito = TRUE;");
    const [individualEmails, setIndividualEmails] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [lastRunStats, setLastRunStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [recipientCount, setRecipientCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [recipientSummary, setRecipientSummary] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("Ninguna fuente seleccionada");
    // State for recipient dialog
    const [isRecipientDialogOpen, setIsRecipientDialogOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // templates state
    const [templates, setTemplates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // Content type selection
    const [contentType, setContentType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("template");
    const [selectedTemplateId, setSelectedTemplateId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedEventId, setSelectedEventId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedSurveyId, setSelectedSurveyId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [attachmentName, setAttachmentName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [certificatePreview, setCertificatePreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [previewMode, setPreviewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('desktop');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SendPage.useEffect": ()=>{
            if (role) {
                const userEmail = isIT ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["managedSenders"][0].email : `${role}@email.com`;
                setSenderEmail(userEmail);
                setTestEmail(userEmail);
            }
            const fetchTemplates = {
                "SendPage.useEffect.fetchTemplates": async ()=>{
                    const dbTemplates = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$data$3a$bde38a__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["getTemplatesAction"])();
                    setTemplates(dbTemplates);
                }
            }["SendPage.useEffect.fetchTemplates"];
            fetchTemplates();
        }
    }["SendPage.useEffect"], [
        role,
        isIT
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SendPage.useEffect": ()=>{
            setAttachmentName(null);
            setCertificatePreview(null);
            if (contentType === 'custom') {
                setSubject("Asunto Personalizado");
                setEmailBody(defaultInitialBody);
            } else if (contentType === "template") {
                if (templates.length > 0) {
                    // Default to first template if none is selected
                    const currentTemplateId = selectedTemplateId || String(templates[0].id_plantilla);
                    if (!selectedTemplateId) {
                        setSelectedTemplateId(currentTemplateId);
                    }
                    const template = templates.find({
                        "SendPage.useEffect.template": (t)=>String(t.id_plantilla) === currentTemplateId
                    }["SendPage.useEffect.template"]);
                    if (template) {
                        setSubject(template.asunto_predeterminado);
                        setEmailBody((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$template$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateHtmlFromBlocks"])(template.contenido));
                    }
                } else {
                    // No templates loaded yet or available
                    setSubject("");
                    setEmailBody("");
                }
            } else if (contentType === "event" && selectedEventId) {
                const event = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["events"].find({
                    "SendPage.useEffect.event": (e)=>e.id === selectedEventId
                }["SendPage.useEffect.event"]);
                if (event) {
                    setSubject(`Invitación al evento: ${event.name}`);
                    setEmailBody(`<h1>Invitación a ${event.name}</h1><p>Estás invitado a nuestro próximo evento el ${event.date}. ¡No te lo pierdas!</p>`);
                }
            } else if (contentType === "survey" && selectedSurveyId) {
                const survey = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["surveys"].find({
                    "SendPage.useEffect.survey": (s)=>s.id === selectedSurveyId
                }["SendPage.useEffect.survey"]);
                if (survey) {
                    setSubject(`Participa en nuestra encuesta: ${survey.name}`);
                    setEmailBody(`<h1>${survey.name}</h1><p>Tu opinión es importante. <a href="#">Haz clic aquí para participar</a>.</p>`);
                }
            } else if (contentType === "certificate" && selectedEventId) {
                const event = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["events"].find({
                    "SendPage.useEffect.event": (e)=>e.id === selectedEventId
                }["SendPage.useEffect.event"]);
                const template = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["certificateTemplates"][selectedEventId];
                if (event && template) {
                    setSubject(`Tu certificado del evento: ${event.name}`);
                    setEmailBody(`<h1>¡Felicidades! Aquí está tu certificado</h1><p>Hola {{contact.name}},</p><p>Gracias por tu participación en el evento "${event.name}" el {{event.date}}. Adjuntamos tu certificado de asistencia.</p><p>¡Esperamos verte de nuevo!</p>`);
                    setAttachmentName(`certificado-${event.name.replace(/\s/g, '_')}.pdf`);
                    setCertificatePreview(`data:image/png;base64,${template}`);
                }
            } else {
                setSubject("");
                setEmailBody("");
            }
        }
    }["SendPage.useEffect"], [
        contentType,
        selectedTemplateId,
        selectedEventId,
        selectedSurveyId,
        templates
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SendPage.useEffect": ()=>{
            let count = 0;
            switch(recipientSource){
                case 'file':
                    count = recipientCount;
                    break;
                case 'individual':
                    count = individualEmails.split(/[\s,;]+/).filter({
                        "SendPage.useEffect": (e)=>e && e.includes('@')
                    }["SendPage.useEffect"]).length;
                    break;
            }
            setRecipientCount(count);
        }
    }["SendPage.useEffect"], [
        recipientSource,
        recipientCount,
        individualEmails
    ]);
    const estimatedTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SendPage.useMemo[estimatedTime]": ()=>{
            const batchSize = 50;
            const emailDelay = 100;
            const batchDelay = 5;
            if (recipientCount === 0 || batchSize <= 0) return "0s";
            const totalEmailDelaySeconds = recipientCount * emailDelay / 1000;
            const numberOfBatches = Math.ceil(recipientCount / batchSize);
            const totalBatchDelaySeconds = numberOfBatches > 1 ? (numberOfBatches - 1) * batchDelay : 0;
            const totalSeconds = totalEmailDelaySeconds + totalBatchDelaySeconds;
            if (totalSeconds < 60) return `${totalSeconds.toFixed(1)}s`;
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = (totalSeconds % 60).toFixed(0);
            return `${minutes}m ${seconds}s`;
        }
    }["SendPage.useMemo[estimatedTime]"], [
        recipientCount
    ]);
    const handleFileChange = (e)=>{
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            const fileName = file.name.toLowerCase();
            setRecipientCount(0);
            setUploadedFileName(file.name);
            const resetState = ()=>{
                e.target.value = '';
                setFileContent("");
                setUploadedFileType(null);
                setRecipientCount(0);
                setUploadedFileName(null);
            };
            if (fileName.endsWith(".csv")) {
                setUploadedFileType("csv");
                reader.onload = (event)=>{
                    const content = event.target?.result;
                    setFileContent(content);
                    try {
                        setRecipientCount((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$csv$2d$parse$2f$lib$2f$sync$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["parse"])(content, {
                            columns: true,
                            skip_empty_lines: true
                        }).length);
                    } catch  {
                        setRecipientCount(0);
                    }
                };
                reader.readAsText(file);
            } else if (fileName.endsWith(".xls") || fileName.endsWith(".xlsx")) {
                setUploadedFileType("excel");
                reader.onload = (event)=>{
                    const buffer = event.target?.result;
                    const base64 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(buffer).toString('base64');
                    setFileContent(base64);
                    try {
                        const workbook = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["read"])(buffer, {
                            type: 'buffer'
                        });
                        const jsonData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
                        setRecipientCount(jsonData.length);
                    } catch  {
                        setRecipientCount(0);
                    }
                };
                reader.readAsArrayBuffer(file);
            } else {
                toast({
                    title: "Archivo no válido",
                    description: "Por favor, selecciona un archivo .csv, .xls o .xlsx.",
                    variant: "destructive"
                });
                resetState();
            }
        }
    };
    const handleHtmlFileChange = (e)=>{
        const file = e.target.files?.[0];
        if (file && file.name.endsWith(".html")) {
            const reader = new FileReader();
            reader.onload = (event)=>{
                setEmailBody(event.target?.result);
                toast({
                    title: "HTML Cargado"
                });
            };
            reader.readAsText(file);
            setContentType("custom");
        } else {
            toast({
                title: "Archivo no válido",
                description: "Por favor, selecciona un archivo .html.",
                variant: "destructive"
            });
        }
        e.target.value = "";
    };
    const handleSendTestEmail = async ()=>{
        if (!testEmail.trim() || !senderEmail.trim() || !subject.trim() || !emailBody.trim()) {
            toast({
                title: "Faltan datos",
                description: "Asegúrate de que el remitente, asunto, cuerpo y correo de prueba estén completos.",
                variant: "destructive"
            });
            return;
        }
        if (!role) {
            toast({
                title: "Error de autenticación",
                description: "No se pudo verificar el rol del usuario.",
                variant: "destructive"
            });
            return;
        }
        setIsSendingTest(true);
        try {
            let attachment;
            if (contentType === 'certificate' && selectedEventId) {
                const template = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["certificateTemplates"][selectedEventId];
                const event = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["events"].find((e)=>e.id === selectedEventId);
                if (template && event) {
                    const pdf = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$es$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsPDF"]('l', 'px', [
                        1100,
                        850
                    ]);
                    const dataUrl = `data:image/png;base64,${template}`;
                    pdf.addImage(dataUrl, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
                    pdf.text(`Otorgado a: Usuario de Prueba`, 550, 450, {
                        align: 'center'
                    });
                    const pdfBase64 = pdf.output('datauristring').split(',')[1];
                    attachment = {
                        content: pdfBase64,
                        filename: `certificado-${event.name.replace(/ /g, '_')}.pdf`,
                        contentType: 'application/pdf'
                    };
                }
            }
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$data$3a$d9fe16__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["sendTestEmailAction"])({
                subject,
                htmlBody: emailBody,
                recipientEmail: testEmail,
                senderEmail,
                attachment,
                eventId: selectedEventId,
                role
            });
            toast({
                title: "Correo de prueba enviado",
                description: `Se ha enviado un correo de prueba a ${testEmail}.`
            });
        } catch (error) {
            toast({
                title: "Error al enviar prueba",
                description: error.message,
                variant: "destructive"
            });
        } finally{
            setIsSendingTest(false);
        }
    };
    const handleSendCampaign = async ()=>{
        setLastRunStats(null);
        if (!subject.trim() || !senderEmail.trim() || !emailBody.trim()) {
            toast({
                title: "Remitente, Asunto y Cuerpo requeridos",
                variant: "destructive"
            });
            return;
        }
        if (!role) {
            toast({
                title: "Error de autenticación",
                description: "No se pudo verificar el rol del usuario.",
                variant: "destructive"
            });
            return;
        }
        let recipientData;
        switch(recipientSource){
            case "date":
                if (!date) {
                    toast({
                        title: "Fecha requerida",
                        variant: "destructive"
                    });
                    return;
                }
                recipientData = {
                    type: "date",
                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(date, "yyyy-MM-dd")
                };
                break;
            case "file":
                if (!uploadedFileType || !fileContent) {
                    toast({
                        title: "Archivo requerido",
                        variant: "destructive"
                    });
                    return;
                }
                recipientData = {
                    type: uploadedFileType,
                    value: fileContent
                };
                break;
            case "sql":
                if (!sqlQuery.trim()) {
                    toast({
                        title: "Consulta SQL requerida",
                        variant: "destructive"
                    });
                    return;
                }
                recipientData = {
                    type: "sql",
                    value: sqlQuery
                };
                break;
            case "individual":
                if (!individualEmails.trim()) {
                    toast({
                        title: "Correos requeridos",
                        variant: "destructive"
                    });
                    return;
                }
                recipientData = {
                    type: "individual",
                    value: individualEmails
                };
                break;
            default:
                toast({
                    title: "Fuente de destinatarios no válida",
                    variant: "destructive"
                });
                return;
        }
        let attachment;
        if (contentType === 'certificate' && selectedEventId) {
            const template = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["certificateTemplates"][selectedEventId];
            const event = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["events"].find((e)=>e.id === selectedEventId);
            if (template && event) {
                const pdf = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$es$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsPDF"]('l', 'px', [
                    1100,
                    850
                ]);
                const dataUrl = `data:image/png;base64,${template}`;
                pdf.addImage(dataUrl, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
                const pdfBase64 = pdf.output('datauristring').split(',')[1];
                attachment = {
                    content: pdfBase64,
                    filename: `certificado-${event.name.replace(/ /g, '_')}.pdf`,
                    contentType: 'application/pdf'
                };
            } else {
                toast({
                    title: "Plantilla no encontrada",
                    variant: "destructive"
                });
                return;
            }
        }
        setIsSending(true);
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$data$3a$64e5bb__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["sendCampaign"])({
                subject,
                htmlBody: emailBody,
                recipientData,
                senderEmail,
                attachment,
                eventId: selectedEventId,
                role
            });
            toast({
                title: "Proceso de envío finalizado",
                description: result.message
            });
            if (result.stats) setLastRunStats(result.stats);
        } catch (error) {
            toast({
                title: "Error al enviar",
                description: error.message,
                variant: "destructive"
            });
        } finally{
            setIsSending(false);
        }
    };
    const handleSaveRecipients = ()=>{
        let summary = "Ninguna fuente seleccionada";
        switch(recipientSource){
            case "file":
                if (recipientCount > 0 && uploadedFileName) {
                    summary = `Archivo: "${uploadedFileName}" (${recipientCount} destinatarios).`;
                }
                break;
            case "date":
                if (date) {
                    summary = `Fecha de Visita (BD): ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(date, "PPP", {
                        locale: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$locale$2f$es$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["es"]
                    })}`;
                }
                break;
            case "sql":
                summary = "Consulta SQL personalizada.";
                break;
            case "individual":
                const count = individualEmails.split(/[\s,;]+/).filter((e)=>e && e.includes('@')).length;
                if (count > 0) {
                    summary = `Contactos Individuales: ${count} destinatarios.`;
                }
                break;
        }
        setRecipientSummary(summary);
        setIsRecipientDialogOpen(false);
    };
    const renderContentSelector = ()=>{
        switch(contentType){
            case 'template':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                    value: selectedTemplateId,
                    onValueChange: setSelectedTemplateId,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                                placeholder: "Elige una plantilla..."
                            }, void 0, false, {
                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                lineNumber: 472,
                                columnNumber: 108
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/send/page.tsx",
                            lineNumber: 472,
                            columnNumber: 93
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                            children: templates.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                    value: String(t.id_plantilla),
                                    children: t.nombre
                                }, t.id_plantilla, false, {
                                    fileName: "[project]/src/app/(main)/send/page.tsx",
                                    lineNumber: 472,
                                    columnNumber: 211
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/send/page.tsx",
                            lineNumber: 472,
                            columnNumber: 176
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(main)/send/page.tsx",
                    lineNumber: 472,
                    columnNumber: 20
                }, this);
            case 'event':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                    onValueChange: setSelectedEventId,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                                placeholder: "Elige un evento para la invitación..."
                            }, void 0, false, {
                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                lineNumber: 474,
                                columnNumber: 78
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/send/page.tsx",
                            lineNumber: 474,
                            columnNumber: 63
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["events"].map((e)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                    value: e.id,
                                    children: e.name
                                }, e.id, false, {
                                    fileName: "[project]/src/app/(main)/send/page.tsx",
                                    lineNumber: 474,
                                    columnNumber: 193
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/send/page.tsx",
                            lineNumber: 474,
                            columnNumber: 161
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(main)/send/page.tsx",
                    lineNumber: 474,
                    columnNumber: 20
                }, this);
            case 'survey':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                    onValueChange: setSelectedSurveyId,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                                placeholder: "Elige una encuesta..."
                            }, void 0, false, {
                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                lineNumber: 476,
                                columnNumber: 79
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/send/page.tsx",
                            lineNumber: 476,
                            columnNumber: 64
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["surveys"].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                    value: s.id,
                                    children: s.name
                                }, s.id, false, {
                                    fileName: "[project]/src/app/(main)/send/page.tsx",
                                    lineNumber: 476,
                                    columnNumber: 179
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/send/page.tsx",
                            lineNumber: 476,
                            columnNumber: 146
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(main)/send/page.tsx",
                    lineNumber: 476,
                    columnNumber: 20
                }, this);
            case 'certificate':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                    onValueChange: setSelectedEventId,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                                placeholder: "Elige un evento para el certificado..."
                            }, void 0, false, {
                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                lineNumber: 478,
                                columnNumber: 78
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/send/page.tsx",
                            lineNumber: 478,
                            columnNumber: 63
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["events"].map((e)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                    value: e.id,
                                    children: e.name
                                }, e.id, false, {
                                    fileName: "[project]/src/app/(main)/send/page.tsx",
                                    lineNumber: 478,
                                    columnNumber: 194
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/send/page.tsx",
                            lineNumber: 478,
                            columnNumber: 162
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(main)/send/page.tsx",
                    lineNumber: 478,
                    columnNumber: 20
                }, this);
            default:
                return null;
        }
    };
    const renderSenderInput = ()=>{
        if (isIT) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                        htmlFor: "sender-email",
                        children: "Email del Remitente"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(main)/send/page.tsx",
                        lineNumber: 488,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                        value: senderEmail,
                        onValueChange: setSenderEmail,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                id: "sender-email",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                                    placeholder: "Selecciona un remitente..."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/send/page.tsx",
                                    lineNumber: 490,
                                    columnNumber: 54
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                lineNumber: 490,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["managedSenders"].map((sender)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                        value: sender.email,
                                        children: [
                                            sender.name,
                                            " (",
                                            sender.email,
                                            ")"
                                        ]
                                    }, sender.email, true, {
                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                        lineNumber: 491,
                                        columnNumber: 66
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                lineNumber: 491,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(main)/send/page.tsx",
                        lineNumber: 489,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(main)/send/page.tsx",
                lineNumber: 487,
                columnNumber: 13
            }, this);
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                    htmlFor: "sender-email",
                    children: "Email del Remitente"
                }, void 0, false, {
                    fileName: "[project]/src/app/(main)/send/page.tsx",
                    lineNumber: 498,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                    id: "sender-email",
                    type: "email",
                    value: senderEmail,
                    onChange: (e)=>setSenderEmail(e.target.value)
                }, void 0, false, {
                    fileName: "[project]/src/app/(main)/send/page.tsx",
                    lineNumber: 499,
                    columnNumber: 13
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(main)/send/page.tsx",
            lineNumber: 497,
            columnNumber: 9
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl font-headline font-bold",
                            children: "Nuevo Correo"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/send/page.tsx",
                            lineNumber: 508,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-muted-foreground",
                            children: "Compón y envía un nuevo correo electrónico masivo."
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/send/page.tsx",
                            lineNumber: 509,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(main)/send/page.tsx",
                    lineNumber: 507,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(main)/send/page.tsx",
                lineNumber: 506,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid lg:grid-cols-2 gap-8 items-start",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                            children: "Composición y Configuración"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(main)/send/page.tsx",
                                            lineNumber: 519,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                        lineNumber: 518,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                        className: "space-y-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                children: "Tipo de Contenido"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                lineNumber: 525,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                                                value: contentType,
                                                                onValueChange: (v)=>setContentType(v),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {}, void 0, false, {
                                                                            fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                            lineNumber: 527,
                                                                            columnNumber: 42
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                        lineNumber: 527,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                                value: "template",
                                                                                children: "Usar Plantilla"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                                lineNumber: 529,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                                value: "event",
                                                                                children: "Invitación a Evento"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                                lineNumber: 530,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                                value: "survey",
                                                                                children: "Enviar Encuesta"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                                lineNumber: 531,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                                value: "certificate",
                                                                                children: "Certificado de Evento"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                                lineNumber: 532,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                                value: "custom",
                                                                                children: "Personalizado (HTML)"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                                lineNumber: 533,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                        lineNumber: 528,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                lineNumber: 526,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                        lineNumber: 524,
                                                        columnNumber: 19
                                                    }, this),
                                                    contentType !== 'custom' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-2",
                                                        children: renderContentSelector()
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                        lineNumber: 537,
                                                        columnNumber: 48
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                lineNumber: 523,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-4 border-t pt-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid md:grid-cols-2 gap-4",
                                                        children: [
                                                            renderSenderInput(),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                        htmlFor: "subject",
                                                                        children: "Asunto del Correo"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                        lineNumber: 544,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                        id: "subject",
                                                                        value: subject,
                                                                        onChange: (e)=>setSubject(e.target.value)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                        lineNumber: 545,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                lineNumber: 543,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                        lineNumber: 541,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex justify-between items-center",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                        children: "Cuerpo del Mensaje"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                        lineNumber: 551,
                                                                        columnNumber: 21
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-2", contentType !== 'custom' && 'hidden'),
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                                htmlFor: "html-upload",
                                                                                className: "text-sm font-normal text-primary underline-offset-4 hover:underline cursor-pointer",
                                                                                children: "O sube HTML"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                                lineNumber: 553,
                                                                                columnNumber: 23
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                                id: "html-upload",
                                                                                type: "file",
                                                                                accept: ".html",
                                                                                className: "hidden",
                                                                                onChange: handleHtmlFileChange
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                                lineNumber: 554,
                                                                                columnNumber: 23
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                        lineNumber: 552,
                                                                        columnNumber: 21
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                lineNumber: 550,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                                                                value: emailBody,
                                                                onChange: (e)=>setEmailBody(e.target.value),
                                                                rows: 10,
                                                                disabled: contentType !== 'custom'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                lineNumber: 557,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                        lineNumber: 549,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                lineNumber: 540,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                        lineNumber: 521,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                lineNumber: 517,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                children: "Destinatarios"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                lineNumber: 565,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                                children: recipientSummary
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                lineNumber: 566,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                        lineNumber: 564,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "outline",
                                            onClick: ()=>setIsRecipientDialogOpen(true),
                                            children: "Seleccionar Fuente de Destinatarios"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(main)/send/page.tsx",
                                            lineNumber: 569,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                        lineNumber: 568,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                lineNumber: 563,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                                open: isRecipientDialogOpen,
                                onOpenChange: setIsRecipientDialogOpen,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                                    className: "sm:max-w-2xl",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                                    children: "Destinatarios"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(main)/send/page.tsx",
                                                    lineNumber: 578,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                                    children: "Elige las personas que recibirán tu campaña."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(main)/send/page.tsx",
                                                    lineNumber: 579,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(main)/send/page.tsx",
                                            lineNumber: 577,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                            className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/send/page.tsx",
                                                            lineNumber: 585,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                            placeholder: "Buscar listas o segmentos...",
                                                            className: "pl-9"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/send/page.tsx",
                                                            lineNumber: 586,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(main)/send/page.tsx",
                                                    lineNumber: 584,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tabs"], {
                                                    defaultValue: "lists",
                                                    className: "mt-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsList"], {
                                                            className: "grid w-full grid-cols-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                                                    value: "lists",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__["List"], {
                                                                            className: "mr-2 h-4 w-4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                            lineNumber: 590,
                                                                            columnNumber: 54
                                                                        }, this),
                                                                        "Listas"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                    lineNumber: 590,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                                                    value: "segments",
                                                                    disabled: !isIT,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                                                            className: "mr-2 h-4 w-4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                            lineNumber: 591,
                                                                            columnNumber: 74
                                                                        }, this),
                                                                        "Segmentos"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                    lineNumber: 591,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                                                    value: "individuals",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                                                            className: "mr-2 h-4 w-4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                            lineNumber: 592,
                                                                            columnNumber: 60
                                                                        }, this),
                                                                        "Individuales"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                    lineNumber: 592,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/(main)/send/page.tsx",
                                                            lineNumber: 589,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsContent"], {
                                                            value: "lists",
                                                            className: "mt-4",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$accordion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Accordion"], {
                                                                type: "single",
                                                                collapsible: true,
                                                                className: "w-full",
                                                                onValueChange: (v)=>setRecipientSource(v),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$accordion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccordionItem"], {
                                                                        value: "file",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$accordion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccordionTrigger"], {
                                                                                children: "Subir Archivo (CSV/Excel)"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                                lineNumber: 597,
                                                                                columnNumber: 35
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$accordion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccordionContent"], {
                                                                                className: "pt-4 space-y-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                                        htmlFor: "file-upload",
                                                                                        children: "Sube un archivo de contactos"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                                        lineNumber: 599,
                                                                                        columnNumber: 39
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                                        id: "file-upload",
                                                                                        type: "file",
                                                                                        accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
                                                                                        onChange: handleFileChange
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                                        lineNumber: 600,
                                                                                        columnNumber: 39
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-sm text-muted-foreground",
                                                                                        children: 'El archivo debe contener una columna "email".'
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                                        lineNumber: 601,
                                                                                        columnNumber: 39
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                                lineNumber: 598,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                        lineNumber: 596,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$accordion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccordionItem"], {
                                                                        value: "date",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$accordion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccordionTrigger"], {
                                                                                children: "Contactos por Fecha (BD)"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                                lineNumber: 605,
                                                                                columnNumber: 35
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$accordion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccordionContent"], {
                                                                                className: "pt-4 space-y-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                                        children: "Selecciona una fecha de visita"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                                        lineNumber: 607,
                                                                                        columnNumber: 37
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popover"], {
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverTrigger"], {
                                                                                                asChild: true,
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                                                    variant: "outline",
                                                                                                    className: "w-[280px] justify-start text-left font-normal",
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                                                                            className: "mr-2 h-4 w-4"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                                                            lineNumber: 608,
                                                                                                            columnNumber: 156
                                                                                                        }, this),
                                                                                                        date ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(date, "PPP", {
                                                                                                            locale: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$locale$2f$es$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["es"]
                                                                                                        }) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                            children: "Elige una fecha"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                                                            lineNumber: 608,
                                                                                                            columnNumber: 243
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                                                    lineNumber: 608,
                                                                                                    columnNumber: 70
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                                                lineNumber: 608,
                                                                                                columnNumber: 46
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverContent"], {
                                                                                                className: "w-auto p-0",
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$calendar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Calendar"], {
                                                                                                    mode: "single",
                                                                                                    selected: date,
                                                                                                    onSelect: setDate,
                                                                                                    initialFocus: true,
                                                                                                    locale: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$locale$2f$es$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["es"]
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                                                    lineNumber: 608,
                                                                                                    columnNumber: 337
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                                                lineNumber: 608,
                                                                                                columnNumber: 298
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                                        lineNumber: 608,
                                                                                        columnNumber: 37
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                                lineNumber: 606,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                        lineNumber: 604,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                lineNumber: 595,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/send/page.tsx",
                                                            lineNumber: 594,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsContent"], {
                                                            value: "segments",
                                                            className: "mt-4 space-y-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                    htmlFor: "sql-query",
                                                                    children: "Escribe tu consulta SQL"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                    lineNumber: 614,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                                                                    id: "sql-query",
                                                                    value: sqlQuery,
                                                                    onChange: (e)=>{
                                                                        setSqlQuery(e.target.value);
                                                                        setRecipientSource('sql');
                                                                    },
                                                                    rows: 6
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                    lineNumber: 615,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-muted-foreground",
                                                                    children: 'La consulta debe devolver una columna "email".'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                    lineNumber: 616,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/(main)/send/page.tsx",
                                                            lineNumber: 613,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsContent"], {
                                                            value: "individuals",
                                                            className: "mt-4 space-y-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                    htmlFor: "individual-emails",
                                                                    children: "Pegar Correos"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                    lineNumber: 619,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                                                                    id: "individual-emails",
                                                                    placeholder: "ejemplo1@dominio.com, ejemplo2@dominio.com",
                                                                    rows: 6,
                                                                    value: individualEmails,
                                                                    onChange: (e)=>{
                                                                        setIndividualEmails(e.target.value);
                                                                        setRecipientSource('individual');
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                    lineNumber: 620,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-muted-foreground",
                                                                    children: "Separa los correos con comas, espacios o saltos de línea."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                    lineNumber: 621,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/(main)/send/page.tsx",
                                                            lineNumber: 618,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(main)/send/page.tsx",
                                                    lineNumber: 588,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(main)/send/page.tsx",
                                            lineNumber: 583,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                                            className: "mt-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    variant: "ghost",
                                                    onClick: ()=>setIsRecipientDialogOpen(false),
                                                    children: "Cancelar"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(main)/send/page.tsx",
                                                    lineNumber: 626,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    onClick: handleSaveRecipients,
                                                    children: "Guardar"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(main)/send/page.tsx",
                                                    lineNumber: 627,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(main)/send/page.tsx",
                                            lineNumber: 625,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(main)/send/page.tsx",
                                    lineNumber: 576,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                lineNumber: 575,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                            children: "Envío de Prueba"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(main)/send/page.tsx",
                                            lineNumber: 634,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                        lineNumber: 633,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2 items-end",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-grow space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                            htmlFor: "test-email",
                                                            className: "sr-only",
                                                            children: "Correo de Prueba"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/send/page.tsx",
                                                            lineNumber: 639,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                            id: "test-email",
                                                            type: "email",
                                                            placeholder: "tu-correo@ejemplo.com",
                                                            value: testEmail,
                                                            onChange: (e)=>setTestEmail(e.target.value)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/send/page.tsx",
                                                            lineNumber: 640,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(main)/send/page.tsx",
                                                    lineNumber: 638,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    onClick: handleSendTestEmail,
                                                    variant: "secondary",
                                                    disabled: isSendingTest || isSending,
                                                    children: isSendingTest ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                        className: "mr-2 h-4 w-4 animate-spin"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                        lineNumber: 643,
                                                        columnNumber: 38
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                        lineNumber: 643,
                                                        columnNumber: 90
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(main)/send/page.tsx",
                                                    lineNumber: 642,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(main)/send/page.tsx",
                                            lineNumber: 637,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                        lineNumber: 636,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                lineNumber: 632,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start space-x-3 rounded-md bg-muted/50 p-3 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                        className: "h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                        lineNumber: 650,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-muted-foreground",
                                                children: [
                                                    "Destinatarios detectados: ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-bold text-foreground",
                                                        children: recipientCount
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                        lineNumber: 652,
                                                        columnNumber: 82
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                lineNumber: 652,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-muted-foreground",
                                                children: [
                                                    "Tiempo estimado: ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-bold text-foreground",
                                                        children: estimatedTime
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                        lineNumber: 653,
                                                        columnNumber: 73
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                lineNumber: 653,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-muted-foreground mt-1 text-xs",
                                                children: [
                                                    "Los ajustes de velocidad de envío se gestionan en la sección de ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-bold text-foreground",
                                                        children: "Ajustes"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                        lineNumber: 654,
                                                        columnNumber: 133
                                                    }, this),
                                                    "."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                lineNumber: 654,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                        lineNumber: 651,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                lineNumber: 649,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: handleSendCampaign,
                                disabled: isSending || isSendingTest,
                                size: "lg",
                                className: "w-full",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MailPlus$3e$__["MailPlus"], {
                                        className: "mr-2 h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                        lineNumber: 659,
                                        columnNumber: 13
                                    }, this),
                                    isSending ? "Enviando..." : "Iniciar Envío Masivo"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                lineNumber: 658,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(main)/send/page.tsx",
                        lineNumber: 516,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "sticky top-24 space-y-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                            children: "Vista Previa del Correo"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/send/page.tsx",
                                                            lineNumber: 670,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                                            children: "Así es como los destinatarios verán tu correo."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/send/page.tsx",
                                                            lineNumber: 671,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(main)/send/page.tsx",
                                                    lineNumber: 669,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1 rounded-md bg-muted p-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                            variant: previewMode === 'desktop' ? 'secondary' : 'ghost',
                                                            size: "icon",
                                                            className: "h-8 w-8",
                                                            onClick: ()=>setPreviewMode('desktop'),
                                                            "aria-label": "Vista de escritorio",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$laptop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Laptop$3e$__["Laptop"], {
                                                                className: "h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                lineNumber: 675,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/send/page.tsx",
                                                            lineNumber: 674,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                            variant: previewMode === 'mobile' ? 'secondary' : 'ghost',
                                                            size: "icon",
                                                            className: "h-8 w-8",
                                                            onClick: ()=>setPreviewMode('mobile'),
                                                            "aria-label": "Vista móvil",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__["Smartphone"], {
                                                                className: "h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                lineNumber: 678,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/send/page.tsx",
                                                            lineNumber: 677,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(main)/send/page.tsx",
                                                    lineNumber: 673,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(main)/send/page.tsx",
                                            lineNumber: 668,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                        lineNumber: 667,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full transition-all duration-300 ease-in-out", previewMode === 'mobile' && 'mx-auto w-[375px]'),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden", previewMode === 'mobile' && 'border-8 border-black rounded-[40px] shadow-lg'),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between p-3 border-b bg-muted/30",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                                                                        className: "h-8 w-8",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                                                                            children: "AP"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                            lineNumber: 696,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                        lineNumber: 695,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "font-semibold text-sm",
                                                                                children: senderEmail || 'remitente@ejemplo.com'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                                lineNumber: 699,
                                                                                columnNumber: 37
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-xs text-muted-foreground",
                                                                                children: "Para: destinatario@ejemplo.com"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                                lineNumber: 700,
                                                                                columnNumber: 37
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                        lineNumber: 698,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                lineNumber: 694,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-1 text-muted-foreground",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-xs mr-2",
                                                                        children: "Ahora"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                        lineNumber: 704,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                        variant: "ghost",
                                                                        size: "icon",
                                                                        className: "size-8",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$reply$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Reply$3e$__["Reply"], {
                                                                            className: "size-4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                            lineNumber: 705,
                                                                            columnNumber: 88
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                        lineNumber: 705,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                        variant: "ghost",
                                                                        size: "icon",
                                                                        className: "size-8",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$reply$2d$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ReplyAll$3e$__["ReplyAll"], {
                                                                            className: "size-4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                            lineNumber: 706,
                                                                            columnNumber: 88
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                        lineNumber: 706,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                        variant: "ghost",
                                                                        size: "icon",
                                                                        className: "size-8",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$forward$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Forward$3e$__["Forward"], {
                                                                            className: "size-4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                            lineNumber: 707,
                                                                            columnNumber: 88
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                        lineNumber: 707,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                        variant: "ghost",
                                                                        size: "icon",
                                                                        className: "size-8",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                                                            className: "size-4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                            lineNumber: 708,
                                                                            columnNumber: 88
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                        lineNumber: 708,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                lineNumber: 703,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                        lineNumber: 693,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "p-4 border-b space-y-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                                className: "text-xl font-bold",
                                                                children: subject || 'Asunto del correo'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                lineNumber: 714,
                                                                columnNumber: 29
                                                            }, this),
                                                            attachmentName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-sm font-medium",
                                                                                children: "1 archivo adjunto"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                                lineNumber: 719,
                                                                                columnNumber: 37
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-sm text-muted-foreground",
                                                                                children: "(~256 KB)"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                                lineNumber: 720,
                                                                                columnNumber: 37
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                        lineNumber: 718,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "mt-2 flex items-center gap-2 rounded-md border p-2 max-w-xs bg-muted/30",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__File$3e$__["File"], {
                                                                                className: "h-6 w-6 text-primary flex-shrink-0"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                                lineNumber: 723,
                                                                                columnNumber: 37
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "truncate",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-sm font-medium truncate",
                                                                                    children: attachmentName
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                                    lineNumber: 725,
                                                                                    columnNumber: 41
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                                lineNumber: 724,
                                                                                columnNumber: 37
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                        lineNumber: 722,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                lineNumber: 717,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                        lineNumber: 713,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-white w-full",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
                                                                srcDoc: emailBody,
                                                                title: "Email Preview",
                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full h-[600px] border-0", previewMode === 'mobile' && 'rounded-[32px]'),
                                                                sandbox: "allow-scripts"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                lineNumber: 734,
                                                                columnNumber: 29
                                                            }, this),
                                                            certificatePreview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "p-4 bg-gray-100",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                        className: "text-lg font-semibold mb-2",
                                                                        children: "Vista Previa del Certificado"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                        lineNumber: 745,
                                                                        columnNumber: 37
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                        src: certificatePreview,
                                                                        alt: "Vista previa del certificado",
                                                                        className: "max-w-full border rounded-md"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                        lineNumber: 746,
                                                                        columnNumber: 37
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                lineNumber: 744,
                                                                columnNumber: 33
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                        lineNumber: 733,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "p-2 border-t flex items-center gap-2 bg-muted/30",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                variant: "outline",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$reply$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Reply$3e$__["Reply"], {
                                                                        className: "mr-2"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                        lineNumber: 753,
                                                                        columnNumber: 55
                                                                    }, this),
                                                                    " Responder"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                lineNumber: 753,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                variant: "outline",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$forward$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Forward$3e$__["Forward"], {
                                                                        className: "mr-2"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                        lineNumber: 754,
                                                                        columnNumber: 55
                                                                    }, this),
                                                                    " Reenviar"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                lineNumber: 754,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                        lineNumber: 752,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                lineNumber: 688,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(main)/send/page.tsx",
                                            lineNumber: 684,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                        lineNumber: 683,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                lineNumber: 666,
                                columnNumber: 11
                            }, this),
                            lastRunStats && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                children: "Resumen del Envío"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                lineNumber: 763,
                                                columnNumber: 27
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                                children: "Estadísticas del envío finalizado."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                lineNumber: 763,
                                                columnNumber: 67
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                        lineNumber: 763,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                        className: "space-y-4 text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-muted-foreground flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                                                className: "h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                lineNumber: 765,
                                                                columnNumber: 132
                                                            }, this),
                                                            " Total Destinatarios"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                        lineNumber: 765,
                                                        columnNumber: 68
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-bold",
                                                        children: lastRunStats.totalRecipients
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                        lineNumber: 765,
                                                        columnNumber: 188
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                lineNumber: 765,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-muted-foreground flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                                className: "h-4 w-4 text-green-500"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                lineNumber: 766,
                                                                columnNumber: 132
                                                            }, this),
                                                            " Enviados"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                        lineNumber: 766,
                                                        columnNumber: 68
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-bold",
                                                        children: lastRunStats.sentCount
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                        lineNumber: 766,
                                                        columnNumber: 198
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                lineNumber: 766,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-muted-foreground flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                                className: "h-4 w-4 text-destructive"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                lineNumber: 767,
                                                                columnNumber: 132
                                                            }, this),
                                                            " Fallidos"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                        lineNumber: 767,
                                                        columnNumber: 68
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-bold",
                                                        children: lastRunStats.failedCount
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                        lineNumber: 767,
                                                        columnNumber: 202
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                lineNumber: 767,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-muted-foreground flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                                className: "h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                lineNumber: 768,
                                                                columnNumber: 132
                                                            }, this),
                                                            " Duración"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                        lineNumber: 768,
                                                        columnNumber: 68
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-bold",
                                                        children: [
                                                            lastRunStats.duration.toFixed(2),
                                                            "s"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                        lineNumber: 768,
                                                        columnNumber: 177
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                lineNumber: 768,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-muted-foreground flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                                                className: "h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                                lineNumber: 769,
                                                                columnNumber: 132
                                                            }, this),
                                                            " Velocidad Media"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                        lineNumber: 769,
                                                        columnNumber: 68
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-bold",
                                                        children: [
                                                            lastRunStats.duration > 0 ? (lastRunStats.sentCount / lastRunStats.duration).toFixed(2) : "N/A",
                                                            " correos/s"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                                        lineNumber: 769,
                                                        columnNumber: 189
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                                lineNumber: 769,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(main)/send/page.tsx",
                                        lineNumber: 764,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(main)/send/page.tsx",
                                lineNumber: 762,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(main)/send/page.tsx",
                        lineNumber: 665,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(main)/send/page.tsx",
                lineNumber: 515,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(main)/send/page.tsx",
        lineNumber: 505,
        columnNumber: 5
    }, this);
}
_s(SendPage, "qObvVH90WEXKs4eN01j/pO0iImk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = SendPage;
var _c;
__turbopack_context__.k.register(_c, "SendPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_db443cd1._.js.map