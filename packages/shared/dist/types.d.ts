export type UserType = 'admin' | 'photographer' | 'client' | 'tenant_admin';
export type ShootStatus = 'planned' | 'in_progress' | 'completed' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded';
export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed';
export type JobType = 'photo_enhancement' | 'seo_generation' | 'alt_text' | 'content_generation' | 'analytics';
export type AppName = 'workflow' | 'companion' | 'portal' | 'ai_platform' | 'web_admin';
export interface AppUser {
    id: string;
    email: string;
    user_type: UserType;
    app_access: {
        workflow: boolean;
        companion: boolean;
        portal: boolean;
        ai_platform: boolean;
    };
    profile: {
        name?: string;
        phone?: string;
        avatar_url?: string;
        [key: string]: any;
    };
    admin_user_id?: string;
    tenant_id?: string;
    created_at: string;
    updated_at: string;
    last_login_at?: string;
}
export interface TenantConfig {
    id: string;
    slug: string;
    name: string;
    branding: {
        logo_url: string;
        primary_color: string;
        secondary_color: string;
        custom_domain?: string;
    };
    features: {
        workflow_app: boolean;
        client_portal: boolean;
        ai_tools: boolean;
        white_label: boolean;
    };
    billing: {
        plan: 'free' | 'pro' | 'enterprise';
        stripe_customer_id?: string;
        subscription_status: 'active' | 'inactive' | 'cancelled';
    };
    settings: Record<string, any>;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
export interface ShotListItem {
    id: string;
    description: string;
    completed: boolean;
    image_id?: string;
    notes?: string;
    required?: boolean;
    category?: string;
}
export interface EquipmentItem {
    item: string;
    checked: boolean;
    category?: string;
}
export interface Shoot {
    id: string;
    tenant_id?: string;
    client_id?: string;
    photographer_id?: string;
    title: string;
    shoot_type?: string;
    shoot_date?: string;
    shoot_time?: string;
    location_name?: string;
    location_address?: string;
    location_lat?: number;
    location_lng?: number;
    shot_list: ShotListItem[];
    equipment_checklist: EquipmentItem[];
    notes?: string;
    status: ShootStatus;
    metadata: Record<string, any>;
    created_at: string;
    updated_at: string;
    completed_at?: string;
}
export interface ShootPhoto {
    id: string;
    shoot_id: string;
    gallery_image_id: string;
    shot_list_item_id?: string;
    sequence_number?: number;
    metadata: Record<string, any>;
    upload_source: 'workflow_app' | 'web' | 'mobile_companion';
    uploaded_at: string;
    created_at: string;
}
export interface ClientAccount {
    id: string;
    tenant_id?: string;
    app_user_id: string;
    lead_id?: string;
    display_name?: string;
    access_code?: string;
    gallery_access: string[];
    permissions: {
        can_download: boolean;
        can_select_favorites: boolean;
        can_request_edits: boolean;
    };
    contract_signed: boolean;
    contract_signed_at?: string;
    payment_status: PaymentStatus;
    stripe_customer_id?: string;
    created_at: string;
    updated_at: string;
}
export interface AIProcessingJob {
    id: string;
    tenant_id?: string;
    user_id?: string;
    job_type: JobType;
    input_data: Record<string, any>;
    output_data?: Record<string, any>;
    status: JobStatus;
    progress: number;
    error_message?: string;
    credits_used: number;
    processing_time_ms?: number;
    created_at: string;
    started_at?: string;
    completed_at?: string;
}
export interface AppSession {
    id: string;
    user_id: string;
    app_name: AppName;
    device_info: {
        device_type?: string;
        os?: string;
        app_version?: string;
        [key: string]: any;
    };
    session_token_hash?: string;
    ip_address?: string;
    last_active_at: string;
    expires_at?: string;
    revoked: boolean;
    created_at: string;
}
export interface ClientFavorite {
    id: string;
    client_account_id: string;
    gallery_image_id: string;
    shoot_id?: string;
    rating?: number;
    notes?: string;
    created_at: string;
}
export interface Lead {
    id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    source: string;
    status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
    priority: 'low' | 'medium' | 'high';
    estimated_value?: number;
    created_at: string;
    updated_at: string;
    assigned_to?: string;
    next_follow_up?: string;
    tags?: string[];
    notes?: string;
    service_interest?: string;
    budget_range?: string;
    event_date?: string;
}
export interface GalleryImage {
    id: string;
    title: string;
    description?: string;
    image_url: string;
    thumbnail_url?: string;
    optimized_url?: string | null;
    category: string;
    tags?: string[];
    featured: boolean;
    order_index: number;
    display_order?: number;
    alt_text?: string;
    created_at: string;
    updated_at: string;
    orientation?: 'landscape' | 'portrait' | 'square';
    collection?: string;
    hero?: boolean;
    color_dominant?: string;
    color_palette?: string[];
}
