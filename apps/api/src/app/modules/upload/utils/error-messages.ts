/**
 * Upload error messages in Bangla
 */

export const ErrorMessages = {
  INVALID_FILE_TYPE: "অবৈধ ফাইল টাইপ। শুধুমাত্র JPG, PNG, WebP এবং GIF অনুমতিপ্রাপ্ত।",
  INVALID_FILE_EXTENSION:
    "অবৈধ ফাইল এক্সটেনশন। শুধুমাত্র .jpg, .jpeg, .png, .webp এবং .gif অনুমতিপ্রাপ্ত।",
  FILE_TOO_LARGE: (mb: number) =>
    `ফাইল খুবই বড়। সর্বোচ্চ ${mb}MB পর্যন্ত অনুমতিপ্রাপ্ত।`,
  EMPTY_FILE: "খালি বা বিকৃত ফাইল। অনুগ্রহ করে আবার চেষ্টা করুন।",
  NO_FILES_PROVIDED: "কোনো ফাইল প্রদান করা হয়নি।",
  TOO_MANY_FILES: (max: number) =>
    `অত্যধিক ফাইল। একবারে সর্বোচ্চ ${max}টি ফাইল আপলোড করুন।`,
  BATCH_TOO_LARGE: (mb: number) =>
    `ব্যাচ খুবই বড়। মোট সাইজ ${mb}MB অতিক্রম করতে পারে না।`,

  // Cloudinary errors
  CLOUDINARY_UPLOAD_FAILED: "ক্লাউডিনারিতে আপলোড ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।",
  CLOUDINARY_DELETE_FAILED: "ক্লাউডিনারি থেকে মুছে ফেলতে ব্যর্থ। পুনরায় চেষ্টা করুন।",
  INVALID_PUBLIC_ID: "অবৈধ পাবলিক আইডি ফর্ম্যাট।",

  // Generic
  INTERNAL_SERVER_ERROR: "অভ্যন্তরীণ সার্ভার ত্রুটি। পুনরায় চেষ্টা করুন।",
  UNAUTHORIZED: "অনুমোদন প্রয়োজন। অনুগ্রহ করে লগ ইন করুন।",
};

export const SuccessMessages = {
  SINGLE_UPLOAD_SUCCESS: "ছবি সফলভাবে আপলোড হয়েছে।",
  BATCH_UPLOAD_SUCCESS: "সমস্ত ছবি সফলভাবে আপলোড হয়েছে।",
  DELETE_SUCCESS: "ছবি সফলভাবে মুছে ফেলা হয়েছে।",
  BULK_DELETE_SUCCESS: "সমস্ত ছবি সফলভাবে মুছে ফেলা হয়েছে।",
};
