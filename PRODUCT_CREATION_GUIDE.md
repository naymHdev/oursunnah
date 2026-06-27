# Product Creation Guide - Two Approaches

## Overview

The product creation endpoint supports **two methods**:

1. **JSON** (Simple) - Upload images separately, then create product
2. **Multipart Form-Data** (Integrated) - Create product + upload images in one request

---

## Method 1: JSON (Traditional)

### Step 1: Upload Images First

```bash
curl -X POST "http://localhost:5000/api/v1/upload/images?type=product" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg"
```

**Response:**
```json
{
  "data": {
    "images": [
      {
        "url": "https://res.cloudinary.com/.../image1.webp",
        "publicId": "our-sunnah/products/img1"
      },
      {
        "url": "https://res.cloudinary.com/.../image2.webp",
        "publicId": "our-sunnah/products/img2"
      }
    ]
  }
}
```

### Step 2: Create Product with Image Links

```bash
curl -X POST "http://localhost:5000/api/v1/products" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Product Name",
    "description": "Product description...",
    "price": 1500,
    "categoryIds": ["cat_id"],
    "images": [
      {
        "url": "https://res.cloudinary.com/.../image1.webp",
        "publicId": "our-sunnah/products/img1"
      },
      {
        "url": "https://res.cloudinary.com/.../image2.webp",
        "publicId": "our-sunnah/products/img2"
      }
    ]
  }'
```

---

## Method 2: Multipart Form-Data (Recommended)

### Single Request - Everything in One Form

```bash
curl -X POST "http://localhost:5000/api/v1/products" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F 'data={"name":"Product Name","description":"Long description...","price":1500,"categoryIds":["cat_id"]}' \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg" \
  -F "images=@image3.jpg"
```

**Key Points:**
- `data` field: Product information as JSON string (stringified)
- `images` field: Image files (0 or more)
- Backend automatically uploads images + creates product ✅

---

## 📱 Postman Examples

### Method 2: Multipart Form (Recommended - Copy This!)

#### Step 1: Setup Request

1. **Method:** POST
2. **URL:** `http://localhost:5000/api/v1/products`
3. **Headers Tab:**
   ```
   Authorization: Bearer eyJhbGc...
   ```

#### Step 2: Body - Form-Data

| Key | Type | Value |
|-----|------|-------|
| `data` | **Text** | `{"name":"Islamic Prayer Mat","shortDescription":"Premium quality","description":"এটি একটি প্রিমিয়াম ইসলামিক প্রার্থনা ম্যাট যা সর্বোচ্চ মানের উপাদান দিয়ে তৈরি। এটি নরম, টেকসই এবং দীর্ঘস্থায়ী।","sku":"PMAT-001","brand":"Our Sunnah","price":1500,"compareAtPrice":1999,"stock":50,"isActive":true,"isFeatured":true,"categoryIds":["cat_123"],"attributes":[{"key":"Material","value":"Polyester & Velvet"},{"key":"Size","value":"80cm x 120cm"}]}` |
| `images` | **File** | Select image1.jpg |
| `images` | **File** | Select image2.jpg |
| `images` | **File** | Select image3.jpg |

#### Step 3: Send

✅ Backend handles everything - images uploaded + product created!

---

## 📝 Complete Examples

### Minimal Product (No Images in Form)

**Postman Body (form-data):**

| Key | Type | Value |
|-----|------|-------|
| `data` | Text | `{"name":"Tasbih Counter","description":"Digital counter with LED display and alarm function. Battery operated. Very reliable.","price":499,"categoryIds":["electronics_id"]}` |

---

### Standard Product (With 2 Images)

**Postman Body (form-data):**

| Key | Type | Value |
|-----|------|-------|
| `data` | Text | (see below) |
| `images` | File | product_main.jpg |
| `images` | File | product_alternate.jpg |

**Data Field (copy as-is):**
```json
{
  "name": "Islamic Headscarf - Hijab",
  "shortDescription": "Elegant and comfortable hijab",
  "description": "আরামদায়ক এবং মার্জিত ইসলামিক হেডস্কার্ফ। বিভিন্ন রঙ এবং সাইজে পাওয়া যায়।",
  "sku": "HIJ-PREM-001",
  "brand": "Our Sunnah Fashion",
  "price": 799,
  "compareAtPrice": 999,
  "stock": 50,
  "isActive": true,
  "isFeatured": false,
  "metaTitle": "Premium Islamic Hijab",
  "metaDescription": "High quality Islamic headscarf in multiple colors",
  "categoryIds": [
    "fashion_id"
  ],
  "attributes": [
    {
      "key": "Material",
      "value": "Premium Cotton & Chiffon",
      "position": 1
    },
    {
      "key": "Colors Available",
      "value": "Black, Navy, Maroon, Brown",
      "position": 2
    }
  ]
}
```

---

### Complex Product (With Options & Variants + 3 Images)

**Postman Body (form-data):**

| Key | Type | Value |
|-----|------|-------|
| `data` | Text | (see below) |
| `images` | File | main.jpg |
| `images` | File | side.jpg |
| `images` | File | detail.jpg |

**Data Field:**
```json
{
  "name": "Qur'an Stand - Adjustable",
  "shortDescription": "Premium adjustable Qur'an stand",
  "description": "একটি প্রিমিয়াম, সামঞ্জস্যযোগ্য কুরআন স্ট্যান্ড যা যেকোনো কোণ থেকে পড়ার জন্য উপযুক্ত। টেকসই উপাদান দিয়ে তৈরি।",
  "sku": "QS-ADJ-BASE",
  "brand": "Our Sunnah",
  "price": 1199,
  "compareAtPrice": 1599,
  "stock": 0,
  "isActive": true,
  "categoryIds": ["accessories_id"],
  "options": [
    {
      "name": "Material",
      "values": ["Wood", "Plastic", "Metal"]
    },
    {
      "name": "Color",
      "values": ["Brown", "Black", "Natural"]
    }
  ],
  "variants": [
    {
      "optionValues": {
        "Material": "Wood",
        "Color": "Brown"
      },
      "sku": "QS-WOOD-BRN",
      "price": 1199,
      "stock": 15
    },
    {
      "optionValues": {
        "Material": "Wood",
        "Color": "Black"
      },
      "sku": "QS-WOOD-BLK",
      "price": 1199,
      "stock": 10
    },
    {
      "optionValues": {
        "Material": "Plastic",
        "Color": "Brown"
      },
      "sku": "QS-PLAST-BRN",
      "price": 699,
      "stock": 25
    }
  ]
}
```

---

## 🔄 Comparison

| Aspect | Method 1 (JSON) | Method 2 (Multipart) |
|--------|-----------------|----------------------|
| **Requests** | 2 steps | 1 step |
| **Complexity** | Medium | Simple |
| **UX** | Copy links manually | Direct form submit |
| **Speed** | Slower | Faster |
| **Best For** | API testing | Frontend forms |

---

## 🚀 Quick Copy-Paste Examples

### Minimal (Text Only)

```json
{
  "name": "Test Product",
  "description": "A test product description that is at least ten characters long.",
  "price": 500,
  "categoryIds": ["cat_id_here"]
}
```

### Standard (With Images)

**Postman form-data:**
- `data`: Paste the JSON below as text
- `images`: Select 2-3 image files

```json
{
  "name": "Islamic Prayer Mat",
  "shortDescription": "Premium prayer mat",
  "description": "এটি একটি প্রিমিয়াম ইসলামিক প্রার্থনা ম্যাট যা সর্বোচ্চ মানের উপাদান দিয়ে তৈরি। এটি নরম, টেকসই এবং দীর্ঘস্থায়ী। আরামদায়ক এবং ঐতিহ্যবাহী ডিজাইন সহ।",
  "sku": "PMAT-001",
  "brand": "Our Sunnah",
  "price": 1500,
  "compareAtPrice": 1999,
  "stock": 50,
  "isActive": true,
  "isFeatured": true,
  "categoryIds": ["cat_id_here"],
  "attributes": [
    {
      "key": "Material",
      "value": "Polyester & Velvet"
    },
    {
      "key": "Size",
      "value": "80cm x 120cm"
    }
  ]
}
```

---

## ⚠️ Important Notes

### For `data` field in Postman:

1. **Type:** Must be **Text** (not File)
2. **Format:** Valid JSON string
3. **No escaping needed** in Postman - it handles it
4. **Multiline OK** - Postman will format correctly

### For `images` field:

1. **Type:** Must be **File**
2. **Multiple:** Add multiple entries with same key name
3. **Optional:** Can create product without images
4. **Formats:** jpg, jpeg, png, webp, gif
5. **Max per file:** 5MB
6. **Max total:** 50MB
7. **Max files:** 10

---

## 📋 Full Postman Workflow

### 1. Get Auth Token

```
POST http://localhost:5000/api/v1/auth/login

Body (JSON):
{
  "email": "admin@oursunnah.com",
  "password": "password123"
}

Response → Copy accessToken
```

### 2. Get Category ID

```
GET http://localhost:5000/api/v1/categories

Header: Authorization: Bearer <token>

Response → Copy any category id
```

### 3. Create Product with Images

```
POST http://localhost:5000/api/v1/products

Header: Authorization: Bearer <token>

Body: form-data
- data: <JSON from examples above>
- images: <select files>

Send → Product created ✅
```

---

## ✅ Success Response

```json
{
  "success": true,
  "message": "Product created successfully with images",
  "data": {
    "id": "prod_abc123xyz",
    "name": "Islamic Prayer Mat",
    "slug": "islamic-prayer-mat",
    "description": "...",
    "price": 1500,
    "stock": 50,
    "images": [
      {
        "id": "img_1",
        "url": "https://res.cloudinary.com/.../image1.webp",
        "publicId": "our-sunnah/products/img1",
        "position": 1
      },
      {
        "id": "img_2",
        "url": "https://res.cloudinary.com/.../image2.webp",
        "publicId": "our-sunnah/products/img2",
        "position": 2
      }
    ],
    "categories": [
      {
        "id": "cat_123",
        "name": "Prayer Items"
      }
    ],
    "createdAt": "2024-06-27T10:30:00Z"
  }
}
```

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "data field is required" | Add `data` field as Text in form-data |
| "Invalid JSON in data field" | Make sure JSON is valid - use JSON validator |
| "File too large" | Max 5MB per file, 50MB total |
| "Invalid file type" | Use jpg/png/webp/gif only |
| "Images not attached" | Set field type to **File** not Text |
| "Product created but no images" | Add files to `images` field |

---

## 🎯 Recommended: Use Method 2 (Multipart)

✅ Single form submission  
✅ Images + data together  
✅ Better UX  
✅ Faster  
✅ Automatic Cloudinary upload  

**Just use Postman form-data with `data` (text) + `images` (files)!**
