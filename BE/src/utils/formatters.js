/**
 * Simple method to Convert a String to Slug
 * Các bạn có thể tham khảo thêm kiến thức liên quan ở đây: https://byby.dev/js-slugify-string
 */
export const slugify = val => {
    if (!val) return ''
    return String(val)
        .normalize('NFKD') 
        .replace(/[\u0300-\u036f]/g, '') 
        .trim() 
        .toLowerCase() 
        .replace(/[^a-z0-9 -]/g, '') 
        .replace(/\s+/g, '-') 
        .replace(/-+/g, '-') 
}
