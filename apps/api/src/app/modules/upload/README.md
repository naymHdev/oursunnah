# Upload Module Documentation

## Overview

The Upload module provides a robust, production-ready image upload system for the Our Sunnah backend. It handles direct Cloudinary integration with optimized delivery, caching, and bulk operations.

## Features

✅ **Single & Batch Uploads** - Upload 1-10 images per request  
✅ **Image Optimization** - Auto-compression, format conversion (WebP), quality management  
✅ **Nested Folder Structure** - Products organized by productId: `/our-sunnah/products/{productId}`  
✅ **CDN Caching** - 1-year cache headers for immutable assets  
✅ **Bulk Deletion** - Clean up multiple images when deleting products  
✅ **Error Recovery** - Validation before upload, graceful failure handling  
✅ **Bangla Messages** - User-friendly Bengali error and success messages  
✅ **Memory Streaming** - No temporary disk files; buffer → Cloudinary direct  

## Configuration

### Environment Variables

Add to `.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Dependencies

```bash
npm install cloudinary multer
npm install -D @types/multer
```

## API Endpoints

### 1. Upload Single Image

**Endpoint:** `POST /api/v1/upload/image`

**Authentication:** Required (Bearer token)

**Query Parameters:**
- `type` (optional): `'product'` | `'category'` (default: `'product'`)
- `productId` (optional): For nested folder structure (e.g., `/our-sunnah/products/{productId}`)

**Request Body:**
```
Content-Type: multipart/form-data

Field: image (file)
File size: Max 5MB
Formats: jpg, jpeg, png, webp, gif
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "ছবি সফলভাবে আপলোড হয়েছে।",
  "data": {
    "url": "https://res.cloudinary.com/..../image.webp",
    "publicId": "our-sunnah/products/{productId}/abc123",
    "width": 1200,
    "height": 800,
    "format": "webp",
    "optimizedUrls": {
      "thumbnail": "https://..../c_scale,w_200,q_auto:good,f_auto/...",
      "medium": "https://..../c_scale,w_600,q_auto:good,f_auto/...",
      "large": "https://..../c_scale,w_1200,q_auto:good,f_auto/..."
    }
  }
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "message": "অবৈধ ফাইল টাইপ। শুধুমাত্র JPG, PNG, WebP এবং GIF অনুমতিপ্রাপ্ত।",
  "data": null
}
```

---

### 2. Upload Multiple Images (Batch)

**Endpoint:** `POST /api/v1/upload/images`

**Authentication:** Required (Bearer token)

**Query Parameters:**
- `type` (optional): `'product'` | `'category'` (default: `'product'`)
- `productId` (optional): For nested folder structure

**Request Body:**
```
Content-Type: multipart/form-data

Field: images (files)
Max files: 10
Max total: 50MB
Each file: Max 5MB
Formats: jpg, jpeg, png, webp, gif
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "3টি ছবি সফলভাবে আপলোড হয়েছে।",
  "data": {
    "images": [
      {
        "url": "https://res.cloudinary.com/..../image1.webp",
        "publicId": "our-sunnah/products/abc/img1",
        "width": 1200,
        "height": 800,
        "format": "webp",
        "optimizedUrls": { ... }
      },
      { ... },
      { ... }
    ],
    "count": 3,
    "totalSize": 2048576
  }
}
```

---

### 3. Delete Single Image

**Endpoint:** `DELETE /api/v1/upload/:publicId`

**Authentication:** Required (Bearer token)

**URL Parameters:**
- `publicId` (required): Cloudinary public ID (e.g., `our-sunnah/products/abc123/img1`)

**Success Response (200):**
```json
{
  "success": true,
  "message": "ছবি সফলভাবে মুছে ফেলা হয়েছে।",
  "data": null
}
```

---

### 4. Bulk Delete Images

**Endpoint:** `DELETE /api/v1/upload/bulk`

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{
  "publicIds": [
    "our-sunnah/products/abc/img1",
    "our-sunnah/products/abc/img2",
    "our-sunnah/products/abc/img3"
  ]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "সমস্ত ছবি সফলভাবে মুছে ফেলা হয়েছে।",
  "data": {
    "deletedCount": 3
  }
}
```

---

## Usage Workflow

### Creating a Product with Images

**Step 1: Upload Images**
```bash
curl -X POST "http://localhost:5000/api/v1/upload/images?type=product" \
  -H "Authorization: Bearer <token>" \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg"
```

Response:
```json
{
  "images": [
    { "url": "https://...", "publicId": "our-sunnah/products/img1" },
    { "url": "https://...", "publicId": "our-sunnah/products/img2" }
  ]
}
```

**Step 2: Create Product with Image Data**
```bash
curl -X POST "http://localhost:5000/api/v1/products" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Product Name",
    "description": "Product description...",
    "price": 1999,
    "categoryIds": ["cat1"],
    "images": [
      {
        "url": "https://...",
        "publicId": "our-sunnah/products/img1"
      },
      {
        "url": "https://...",
        "publicId": "our-sunnah/products/img2"
      }
    ]
  }'
```

---

## Folder Structure

```
/our-sunnah/
├── products/
│   ├── {productId}/
│   │   ├── image1.webp
│   │   ├── image2.webp
│   │   └── image3.webp
│   ├── {productId}/
│   │   └── ...
│   └── ...
└── categories/
    ├── electronics.webp
    ├── fashion.webp
    └── ...
```

## Image Optimization

All images are automatically optimized:

- **Format**: Auto WebP conversion (fallback to original)
- **Quality**: Auto-optimized (typically 75-85% quality)
- **Compression**: Progressive JPEG for faster perceived loading
- **Responsive URLs**: Generated at 3 sizes (thumbnail: 200px, medium: 600px, large: 1200px)

### Optimized URLs

For any uploaded image, get responsive variants:
```js
{
  "url": "https://res.cloudinary.com/cloud/image/upload/v123/our-sunnah/products/img.webp",
  "optimizedUrls": {
    "thumbnail": "...?w_200",    // 200px width
    "medium": "...?w_600",        // 600px width (mobile-first)
    "large": "...?w_1200"         // 1200px width (desktop)
  }
}
```

## Caching

All uploaded images have 1-year cache headers:
```
Cache-Control: public, max-age=31536000, immutable
```

This means:
- **Browsers** cache for 1 year locally
- **CDN** caches aggressively
- **Cloudinary** CDN ensures fast delivery globally (including Bangladesh)

## Error Handling

All errors are thrown as `AppError` and caught by the global error handler. User-friendly Bengali messages are returned.

### Common Errors

| Status | Message | Cause |
|--------|---------|-------|
| 400 | অবৈধ ফাইল টাইপ | Wrong file type (not jpg/png/webp/gif) |
| 400 | ফাইল খুবই বড় | File exceeds 5MB limit |
| 400 | অত্যধিক ফাইল | More than 10 files in batch |
| 400 | ব্যাচ খুবই বড় | Total batch exceeds 50MB |
| 401 | অনুমোদন প্রয়োজন | Missing/invalid Bearer token |
| 500 | ক্লাউডিনারিতে আপলোড ব্যর্থ | Cloudinary API error |

## Integration with Product/Category Deletion

When deleting a product with images, bulk delete images from Cloudinary:

```js
// In ProductService.deleteProduct()
if (product.images?.length) {
  const publicIds = product.images.map(img => img.publicId);
  await UploadService.bulkDeleteImages(publicIds);
}

// Delete product from DB
await prisma.product.delete({ where: { id } });
```

## Limits Summary

| Limit | Value |
|-------|-------|
| Single file size | 5MB |
| Batch total size | 50MB |
| Max files per batch | 10 |
| Max image dimensions | 10000×10000 px |
| Allowed formats | jpg, jpeg, png, webp, gif |
| Cache duration | 1 year |

## Testing

### Using cURL

**Single upload:**
```bash
curl -X POST "http://localhost:5000/api/v1/upload/image?type=product&productId=prod-123" \
  -H "Authorization: Bearer eyJhbGc..." \
  -F "image=@photo.jpg"
```

**Batch upload:**
```bash
curl -X POST "http://localhost:5000/api/v1/upload/images?type=product" \
  -H "Authorization: Bearer eyJhbGc..." \
  -F "images=@photo1.jpg" \
  -F "images=@photo2.jpg" \
  -F "images=@photo3.jpg"
```

**Delete:**
```bash
curl -X DELETE "http://localhost:5000/api/v1/upload/our-sunnah%2Fproducts%2Fabc123" \
  -H "Authorization: Bearer eyJhbGc..."
```

### Using Postman

1. Create request `POST /api/v1/upload/images`
2. Set `Authorization` header: `Bearer <token>`
3. Set `type` query param: `product`
4. Body → form-data → `images` (file type)
5. Select multiple JPG/PNG files
6. Send

---

## Notes for Frontend Integration

The upload module returns data in the exact format expected by product/category schemas:

```js
// Single image response data
{
  url: string,        // ← Use in product creation
  publicId: string,   // ← Use in product creation
  optimizedUrls: { ... },
  width: number,
  height: number,
  format: string
}

// Batch response data
{
  images: [{ url, publicId, ... }],
  count: number,
  totalSize: number
}
```

Simply pass the returned `url` and `publicId` to the product/category creation endpoint.
