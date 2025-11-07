-- Migration: Convert static homepage to page_configs format (EXACT MATCH)
-- This makes the homepage editable in the Live Page Editor
-- Run this once to populate page_configs with homepage components matching app/page.tsx

INSERT INTO page_configs (slug, data)
VALUES (
  'home',
  '{
    "components": [
      {
        "id": "hero-home",
        "type": "hero",
        "data": {
          "title": "Studio 37",
          "subtitle": "Capturing your precious moments with artistic excellence and professional craftsmanship",
          "backgroundImage": "https://res.cloudinary.com/dmjxho2rl/image/upload/v1759639187/A4B03835-ED8B-4FBB-A27E-1F2EE6CA1A18_1_105_c_gstgil_e_gen_restore_e_improve_e_sharpen_l_image_upload_My_Brand_IMG_2115_mtuowt_c_scale_fl_relative_w_0.40_o_80_fl_layer_apply_g_south_x_0.03_y_0.04_yqgycj.jpg",
          "buttonText": "Book Your Session",
          "buttonLink": "/book-a-session",
          "secondaryButtonText": "View Portfolio",
          "secondaryButtonLink": "/gallery",
          "alignment": "center",
          "overlay": 50,
          "titleColor": "text-white",
          "subtitleColor": "text-amber-50",
          "buttonStyle": "primary",
          "fullBleed": true,
          "showIcon": true,
          "icon": "camera"
        }
      },
      {
        "id": "portrait-gallery",
        "type": "galleryHighlights",
        "data": {
          "categories": ["Portrait"],
          "collections": [],
          "tags": [],
          "group": "",
          "featuredOnly": true,
          "limit": 6,
          "sortBy": "display_order",
          "sortDir": "asc",
          "animation": "fade-in"
        }
      },
      {
        "id": "portrait-gallery-home",
        "type": "galleryHighlights",
        "data": {
          "categories": ["Portrait"],
          "collections": [],
          "tags": [],
          "group": "",
          "featuredOnly": true,
          "limit": 6,
          "sortBy": "display_order",
          "sortDir": "asc",
          "animation": "fade-in",
          "layout": "masonry"
        }
      },
      {
        "id": "services-home",
        "type": "servicesGrid",
        "data": {
          "heading": "Our Photography Services",
          "subheading": "From intimate portraits to grand celebrations, we offer comprehensive photography services tailored to your unique needs.",
          "services": [
            {
              "title": "Wedding Photography",
              "description": "Capture your special day with romantic and timeless images that tell your love story.",
              "icon": "heart",
              "link": "/services/wedding-photography",
              "features": ["Full day coverage", "Engagement session", "Digital gallery", "Print options"]
            },
            {
              "title": "Portrait Sessions",
              "description": "Professional headshots, family portraits, and individual sessions in studio or on location.",
              "icon": "users",
              "link": "/services/portrait-photography",
              "features": ["Studio or outdoor", "Multiple outfits", "Retouched images", "Same day preview"]
            },
            {
              "title": "Event Photography",
              "description": "Document your corporate events, parties, and celebrations with candid and posed shots.",
              "icon": "camera",
              "link": "/services/event-photography",
              "features": ["Event coverage", "Candid moments", "Group photos", "Quick turnaround"]
            },
            {
              "title": "Commercial Photography",
              "description": "Product photography, business headshots, and marketing materials for your brand.",
              "icon": "briefcase",
              "link": "/services/commercial-photography",
              "features": ["Product shots", "Brand imagery", "Marketing content", "Commercial rights"]
            }
          ],
          "columns": 4,
          "animation": "fade-in",
          "cardStyle": "elevated"
        }
      },
      {
        "id": "commercial-gallery-home",
        "type": "galleryHighlights",
        "data": {
          "heading": "Commercial Photography Showcase",
          "subheading": "Professional photography solutions that elevate your brand, showcase your products, and tell your business story with compelling visual content.",
          "categories": ["Commercial"],
          "collections": [],
          "tags": [],
          "group": "",
          "featuredOnly": true,
          "limit": 6,
          "sortBy": "display_order",
          "sortDir": "asc",
          "animation": "fade-in",
          "layout": "grid",
          "showStats": true
        }
      },
      {
        "id": "cta-home",
        "type": "ctaBanner",
        "data": {
          "heading": "Ready to Capture Your Story?",
          "subheading": "Let''s discuss your photography needs and create something beautiful together.",
          "primaryButtonText": "Get Your Quote",
          "primaryButtonLink": "/book-a-session",
          "secondaryButtonText": "",
          "secondaryButtonLink": "",
          "backgroundColor": "#f9fafb",
          "textColor": "text-gray-900",
          "fullBleed": false,
          "animation": "fade-in"
        }
      },
      {
        "id": "testimonials-home",
        "type": "testimonials",
        "data": {
          "heading": "What Our Clients Say",
          "subheading": "Don''t just take our word for it. Here''s what our satisfied clients have to say about their experience with Studio 37.",
          "style": "cards",
          "autoplay": true,
          "interval": 5000,
          "items": [
            {
              "text": "Studio 37 captured our wedding day perfectly! The photos are absolutely stunning and we couldn''t be happier with the results. Professional, creative, and a joy to work with.",
              "author": "Sarah & Michael Johnson",
              "role": "Wedding Photography",
              "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
              "rating": 5
            },
            {
              "text": "Outstanding professional headshots for our entire team. The photographer made everyone feel comfortable and the results exceeded our expectations. Highly recommend!",
              "author": "David Chen",
              "role": "Corporate Headshots",
              "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
              "rating": 5
            },
            {
              "text": "Amazing experience! They captured our family''s personality beautifully. The session was fun and relaxed, and we now have gorgeous photos we''ll treasure forever.",
              "author": "Emily Rodriguez",
              "role": "Family Portraits",
              "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
              "rating": 5
            }
          ]
        }
      }
    ]
  }'::jsonb
)
ON CONFLICT (slug) 
DO UPDATE SET 
  data = EXCLUDED.data,
  updated_at = now();
