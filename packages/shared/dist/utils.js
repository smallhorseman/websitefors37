"use strict";
// Shared utilities and constants
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_EQUIPMENT_CHECKLIST = exports.DEFAULT_PORTRAIT_SHOT_LIST = exports.DEFAULT_WEDDING_SHOT_LIST = exports.EQUIPMENT_CATEGORIES = exports.SHOOT_TYPES = exports.STUDIO37_TENANT_SLUG = void 0;
exports.isValidEmail = isValidEmail;
exports.isValidPhoneNumber = isValidPhoneNumber;
exports.formatShootDate = formatShootDate;
exports.formatShootTime = formatShootTime;
exports.calculateShootProgress = calculateShootProgress;
exports.STUDIO37_TENANT_SLUG = 'studio37';
exports.SHOOT_TYPES = [
    'wedding',
    'portrait',
    'event',
    'commercial',
    'family',
    'engagement',
    'corporate',
    'product',
    'real_estate',
    'other'
];
exports.EQUIPMENT_CATEGORIES = [
    'camera',
    'lens',
    'lighting',
    'audio',
    'accessories',
    'backup',
    'other'
];
// Default shot list templates
exports.DEFAULT_WEDDING_SHOT_LIST = [
    { id: '1', description: 'Bride getting ready', completed: false, required: true, category: 'prep' },
    { id: '2', description: 'Groom getting ready', completed: false, required: true, category: 'prep' },
    { id: '3', description: 'Bride & bridesmaids', completed: false, required: true, category: 'group' },
    { id: '4', description: 'Ceremony entrance', completed: false, required: true, category: 'ceremony' },
    { id: '5', description: 'Exchange of vows', completed: false, required: true, category: 'ceremony' },
    { id: '6', description: 'Ring exchange', completed: false, required: true, category: 'ceremony' },
    { id: '7', description: 'First kiss', completed: false, required: true, category: 'ceremony' },
    { id: '8', description: 'Couple portraits', completed: false, required: true, category: 'portraits' },
    { id: '9', description: 'Family formals', completed: false, required: true, category: 'group' },
    { id: '10', description: 'Reception details', completed: false, required: false, category: 'details' },
    { id: '11', description: 'First dance', completed: false, required: true, category: 'reception' },
    { id: '12', description: 'Cake cutting', completed: false, required: true, category: 'reception' }
];
exports.DEFAULT_PORTRAIT_SHOT_LIST = [
    { id: '1', description: 'Full body shot', completed: false, required: true, category: 'standard' },
    { id: '2', description: 'Head and shoulders', completed: false, required: true, category: 'standard' },
    { id: '3', description: 'Environmental portrait', completed: false, required: true, category: 'creative' },
    { id: '4', description: 'Close-up detail', completed: false, required: false, category: 'creative' },
    { id: '5', description: 'Candid shots', completed: false, required: false, category: 'candid' }
];
exports.DEFAULT_EQUIPMENT_CHECKLIST = [
    { item: 'Primary camera body', checked: false, category: 'camera' },
    { item: 'Backup camera body', checked: false, category: 'camera' },
    { item: 'Wide-angle lens', checked: false, category: 'lens' },
    { item: 'Standard zoom lens', checked: false, category: 'lens' },
    { item: 'Prime lens (50mm)', checked: false, category: 'lens' },
    { item: 'Memory cards (x3)', checked: false, category: 'accessories' },
    { item: 'Extra batteries (x2)', checked: false, category: 'accessories' },
    { item: 'Flash unit', checked: false, category: 'lighting' },
    { item: 'Reflector', checked: false, category: 'lighting' },
    { item: 'Tripod', checked: false, category: 'accessories' },
    { item: 'Lens cleaning kit', checked: false, category: 'accessories' }
];
// Validation helpers
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isValidPhoneNumber(phone) {
    // Simple US phone number validation
    return /^\+?1?\d{10,14}$/.test(phone.replace(/[\s()-]/g, ''));
}
// Date formatting
function formatShootDate(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
function formatShootTime(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}
// Shot list progress
function calculateShootProgress(shotList) {
    if (!shotList || shotList.length === 0)
        return 0;
    const completed = shotList.filter(shot => shot.completed).length;
    return Math.round((completed / shotList.length) * 100);
}
