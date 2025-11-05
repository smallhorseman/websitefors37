"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSupabaseClient = createSupabaseClient;
exports.createSupabaseAdminClient = createSupabaseAdminClient;
exports.getTenantBySlug = getTenantBySlug;
exports.getTenantById = getTenantById;
exports.getUserByEmail = getUserByEmail;
exports.hasAppAccess = hasAppAccess;
exports.hashToken = hashToken;
exports.generateToken = generateToken;
const supabase_js_1 = require("@supabase/supabase-js");
function createSupabaseClient(url, anonKey) {
    return (0, supabase_js_1.createClient)(url, anonKey, {
        auth: {
            autoRefreshToken: true,
            persistSession: true
        }
    });
}
function createSupabaseAdminClient(url, serviceKey) {
    return (0, supabase_js_1.createClient)(url, serviceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}
// Tenant utilities
async function getTenantBySlug(supabase, slug) {
    const { data, error } = await supabase
        .from('tenant_config')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();
    if (error || !data)
        return null;
    return data;
}
async function getTenantById(supabase, id) {
    const { data, error } = await supabase
        .from('tenant_config')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();
    if (error || !data)
        return null;
    return data;
}
// User utilities
async function getUserByEmail(supabase, email) {
    const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .eq('email', email)
        .single();
    if (error || !data)
        return null;
    return data;
}
async function hasAppAccess(user, appName) {
    return user.app_access[appName] === true;
}
// Session helpers
function hashToken(token) {
    // Simple hash for demo; in production use crypto
    return Buffer.from(token).toString('base64');
}
function generateToken(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
