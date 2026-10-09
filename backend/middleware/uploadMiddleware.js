import multer from "multer";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";

const productImageDirectory = fileURLToPath(new URL("../uploads/products/", import.meta.url));
const partnerLogoDirectory = fileURLToPath(new URL("../uploads/PartnerLogo/", import.meta.url));
const reportPdfDirectory = fileURLToPath(new URL("../uploads/ReportPdf/", import.meta.url));
const imageMimeTypes = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp"
};

// Product images
const productImageStorage = multer.diskStorage({
  destination: productImageDirectory,
  filename: (request, file, callback) => {
    callback(null, `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`);
  }
});

export const uploadProductImage = multer({
  storage: productImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const isAllowedImage = imageMimeTypes[extension] === file.mimetype;

    if (isAllowedImage) {
      callback(null, true);
      return;
    }

    callback(new Error("Only JPG, JPEG, PNG, and WEBP images are allowed."));
  }
});

// Partner logos
const partnerLogoStorage = multer.diskStorage({
  destination: partnerLogoDirectory,
  filename: (request, file, callback) => {
    callback(null, `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`);
  }
});

export const uploadPartnerLogo = multer({
  storage: partnerLogoStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const isAllowedImage = imageMimeTypes[extension] === file.mimetype;

    if (isAllowedImage) {
      callback(null, true);
      return;
    }

    callback(new Error("Only JPG, JPEG, PNG, and WEBP images are allowed."));
  }
});

// Quality report PDFs
const reportPdfStorage = multer.diskStorage({
  destination: reportPdfDirectory,
  filename: (request, file, callback) => {
    callback(null, `${randomUUID()}.pdf`);
  }
});

export const uploadReportPdf = multer({
  storage: reportPdfStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (request, file, callback) => {
    const hasPdfMimeType = file.mimetype === "application/pdf";
    const hasPdfExtension = path.extname(file.originalname).toLowerCase() === ".pdf";

    if (hasPdfMimeType && hasPdfExtension) {
      callback(null, true);
      return;
    }

    callback(new Error("Only PDF files are allowed."));
  }
});
