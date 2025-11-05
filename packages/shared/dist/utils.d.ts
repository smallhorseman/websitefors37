export declare const STUDIO37_TENANT_SLUG = "studio37";
export declare const SHOOT_TYPES: readonly ["wedding", "portrait", "event", "commercial", "family", "engagement", "corporate", "product", "real_estate", "other"];
export declare const EQUIPMENT_CATEGORIES: readonly ["camera", "lens", "lighting", "audio", "accessories", "backup", "other"];
export declare const DEFAULT_WEDDING_SHOT_LIST: {
    id: string;
    description: string;
    completed: boolean;
    required: boolean;
    category: string;
}[];
export declare const DEFAULT_PORTRAIT_SHOT_LIST: {
    id: string;
    description: string;
    completed: boolean;
    required: boolean;
    category: string;
}[];
export declare const DEFAULT_EQUIPMENT_CHECKLIST: {
    item: string;
    checked: boolean;
    category: string;
}[];
export declare function isValidEmail(email: string): boolean;
export declare function isValidPhoneNumber(phone: string): boolean;
export declare function formatShootDate(date: string | Date): string;
export declare function formatShootTime(time: string): string;
export declare function calculateShootProgress(shotList: Array<{
    completed: boolean;
}>): number;
