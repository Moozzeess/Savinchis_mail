module.exports = {

"[externals]/events [external] (events, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}}),
"[externals]/process [external] (process, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}}),
"[externals]/net [external] (net, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}}),
"[externals]/tls [external] (tls, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}}),
"[externals]/timers [external] (timers, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("timers", () => require("timers"));

module.exports = mod;
}}),
"[externals]/stream [external] (stream, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[externals]/buffer [external] (buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}}),
"[externals]/string_decoder [external] (string_decoder, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("string_decoder", () => require("string_decoder"));

module.exports = mod;
}}),
"[externals]/crypto [external] (crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[externals]/zlib [external] (zlib, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}}),
"[externals]/util [external] (util, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}}),
"[project]/src/actions/template-actions.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"00fdeee1b67912cd40169e627b506c6488d511c086":"getTemplatesAction","4024a31c3d0e73da34e600b2dfb31666da4162b857":"deleteTemplateAction","40263c8206bd41e6787323cdaa6b06d06cb029fa6e":"saveTemplateAction","40fe3d066ef8bfa392b4411a87e12ed72d92fcc5c9":"getTemplateAction"},"",""] */ __turbopack_context__.s({
    "deleteTemplateAction": (()=>deleteTemplateAction),
    "getTemplateAction": (()=>getTemplateAction),
    "getTemplatesAction": (()=>getTemplatesAction),
    "saveTemplateAction": (()=>saveTemplateAction)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mysql2/promise.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function getDbConnection() {
    const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT } = process.env;
    if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_DATABASE) {
        throw new Error('Faltan las variables de entorno de la base de datos. Por favor, configúralas.');
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].createConnection({
        host: MYSQL_HOST,
        port: MYSQL_PORT ? parseInt(MYSQL_PORT, 10) : 3306,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE
    });
}
async function getTemplatesAction() {
    let connection;
    try {
        connection = await getDbConnection();
        const [rows] = await connection.execute('SELECT id_plantilla, nombre, asunto_predeterminado, contenido, fecha_creacion FROM plantillas ORDER BY fecha_creacion DESC');
        const templates = rows.map((row)=>({
                ...row,
                contenido: row.contenido ? JSON.parse(row.contenido) : []
            }));
        return templates;
    } catch (error) {
        console.error('Error al obtener las plantillas:', error);
        return [];
    } finally{
        if (connection) await connection.end();
    }
}
async function getTemplateAction(id) {
    let connection;
    try {
        connection = await getDbConnection();
        const [rows] = await connection.execute('SELECT id_plantilla, nombre, asunto_predeterminado, contenido, fecha_creacion FROM plantillas WHERE id_plantilla = ?', [
            id
        ]);
        if (rows.length === 0) return null;
        const row = rows[0];
        return {
            ...row,
            contenido: row.contenido ? JSON.parse(row.contenido) : []
        };
    } catch (error) {
        console.error(`Error al obtener la plantilla ${id}:`, error);
        return null;
    } finally{
        if (connection) await connection.end();
    }
}
async function saveTemplateAction(templateData) {
    const { id, nombre, asunto_predeterminado, contenido } = templateData;
    const contenidoJson = JSON.stringify(contenido);
    let connection;
    try {
        connection = await getDbConnection();
        if (id) {
            await connection.execute('UPDATE plantillas SET nombre = ?, asunto_predeterminado = ?, contenido = ? WHERE id_plantilla = ?', [
                nombre,
                asunto_predeterminado,
                contenidoJson,
                id
            ]);
            return {
                success: true,
                message: 'Plantilla actualizada con éxito.',
                id
            };
        } else {
            const [result] = await connection.execute('INSERT INTO plantillas (nombre, asunto_predeterminado, contenido) VALUES (?, ?, ?)', [
                nombre,
                asunto_predeterminado,
                contenidoJson
            ]);
            const insertId = result.insertId;
            return {
                success: true,
                message: 'Plantilla creada con éxito.',
                id: insertId
            };
        }
    } catch (error) {
        console.error('Error al guardar la plantilla:', error);
        return {
            success: false,
            message: `Error al guardar la plantilla: ${error.message}`
        };
    } finally{
        if (connection) await connection.end();
    }
}
async function deleteTemplateAction(id) {
    let connection;
    try {
        connection = await getDbConnection();
        await connection.execute('DELETE FROM plantillas WHERE id_plantilla = ?', [
            id
        ]);
        return {
            success: true,
            message: 'Plantilla eliminada con éxito.'
        };
    } catch (error) {
        console.error(`Error al eliminar la plantilla ${id}:`, error);
        return {
            success: false,
            message: `Error al eliminar la plantilla: ${error.message}`
        };
    } finally{
        if (connection) await connection.end();
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getTemplatesAction,
    getTemplateAction,
    saveTemplateAction,
    deleteTemplateAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getTemplatesAction, "00fdeee1b67912cd40169e627b506c6488d511c086", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getTemplateAction, "40fe3d066ef8bfa392b4411a87e12ed72d92fcc5c9", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(saveTemplateAction, "40263c8206bd41e6787323cdaa6b06d06cb029fa6e", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteTemplateAction, "4024a31c3d0e73da34e600b2dfb31666da4162b857", null);
}}),
"[project]/.next-internal/server/app/(main)/templates/editor/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/actions/template-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$template$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/template-actions.ts [app-rsc] (ecmascript)");
;
;
;
;
}}),
"[project]/.next-internal/server/app/(main)/templates/editor/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/actions/template-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$template$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/template-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$main$292f$templates$2f$editor$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$template$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(main)/templates/editor/page/actions.js { ACTIONS_MODULE0 => "[project]/src/actions/template-actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/(main)/templates/editor/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/actions/template-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "00fdeee1b67912cd40169e627b506c6488d511c086": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$template$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTemplatesAction"]),
    "4024a31c3d0e73da34e600b2dfb31666da4162b857": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$template$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteTemplateAction"]),
    "40263c8206bd41e6787323cdaa6b06d06cb029fa6e": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$template$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["saveTemplateAction"]),
    "40fe3d066ef8bfa392b4411a87e12ed72d92fcc5c9": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$template$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTemplateAction"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$template$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/template-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$main$292f$templates$2f$editor$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$template$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(main)/templates/editor/page/actions.js { ACTIONS_MODULE0 => "[project]/src/actions/template-actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/(main)/templates/editor/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/actions/template-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "00fdeee1b67912cd40169e627b506c6488d511c086": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$main$292f$templates$2f$editor$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$template$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["00fdeee1b67912cd40169e627b506c6488d511c086"]),
    "4024a31c3d0e73da34e600b2dfb31666da4162b857": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$main$292f$templates$2f$editor$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$template$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["4024a31c3d0e73da34e600b2dfb31666da4162b857"]),
    "40263c8206bd41e6787323cdaa6b06d06cb029fa6e": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$main$292f$templates$2f$editor$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$template$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40263c8206bd41e6787323cdaa6b06d06cb029fa6e"]),
    "40fe3d066ef8bfa392b4411a87e12ed72d92fcc5c9": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$main$292f$templates$2f$editor$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$template$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40fe3d066ef8bfa392b4411a87e12ed72d92fcc5c9"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$main$292f$templates$2f$editor$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$template$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(main)/templates/editor/page/actions.js { ACTIONS_MODULE0 => "[project]/src/actions/template-actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <module evaluation>');
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$main$292f$templates$2f$editor$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$template$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(main)/templates/editor/page/actions.js { ACTIONS_MODULE0 => "[project]/src/actions/template-actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <exports>');
}}),
"[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/src/app/(main)/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/(main)/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/src/components/template-editor-client.tsx (client reference/proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "TemplateEditorClient": (()=>TemplateEditorClient)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const TemplateEditorClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call TemplateEditorClient() from the server but TemplateEditorClient is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/template-editor-client.tsx <module evaluation>", "TemplateEditorClient");
}}),
"[project]/src/components/template-editor-client.tsx (client reference/proxy)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "TemplateEditorClient": (()=>TemplateEditorClient)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const TemplateEditorClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call TemplateEditorClient() from the server but TemplateEditorClient is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/template-editor-client.tsx", "TemplateEditorClient");
}}),
"[project]/src/components/template-editor-client.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$template$2d$editor$2d$client$2e$tsx__$28$client__reference$2f$proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/template-editor-client.tsx (client reference/proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$template$2d$editor$2d$client$2e$tsx__$28$client__reference$2f$proxy$29$__ = __turbopack_context__.i("[project]/src/components/template-editor-client.tsx (client reference/proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$template$2d$editor$2d$client$2e$tsx__$28$client__reference$2f$proxy$29$__);
}}),
"[project]/src/app/(main)/templates/editor/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>TemplateEditorPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$template$2d$editor$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/template-editor-client.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$template$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/template-actions.ts [app-rsc] (ecmascript)");
;
;
;
async function TemplateEditorPage({ searchParams }) {
    const templateId = searchParams.id ? parseInt(searchParams.id, 10) : undefined;
    let templateData = null;
    if (templateId) {
        templateData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$template$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTemplateAction"])(templateId);
    }
    // Envuelve el editor para que ocupe toda la altura y anule el padding del layout principal
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "-m-6 h-full",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$template$2d$editor$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TemplateEditorClient"], {
            template: templateData
        }, void 0, false, {
            fileName: "[project]/src/app/(main)/templates/editor/page.tsx",
            lineNumber: 23,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/(main)/templates/editor/page.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
}}),
"[project]/src/app/(main)/templates/editor/page.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/(main)/templates/editor/page.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__75e0df6e._.js.map