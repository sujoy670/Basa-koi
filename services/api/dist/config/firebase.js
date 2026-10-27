"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.messaging = exports.storage = exports.db = exports.auth = void 0;
const admin = __importStar(require("firebase-admin"));
const env_1 = require("./env");
let firebaseApp;
if (!admin.apps.length) {
    if (env_1.env.FIREBASE_CLIENT_EMAIL && env_1.env.FIREBASE_PRIVATE_KEY) {
        const formattedKey = env_1.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
        firebaseApp = admin.initializeApp({
            credential: admin.credential.cert({
                projectId: env_1.env.FIREBASE_PROJECT_ID,
                clientEmail: env_1.env.FIREBASE_CLIENT_EMAIL,
                privateKey: formattedKey,
            }),
            storageBucket: `${env_1.env.FIREBASE_PROJECT_ID}.appspot.com`,
        });
        console.log('✅ Firebase Admin SDK initialized with Service Account');
    }
    else {
        // Development or CI mode fallback
        firebaseApp = admin.initializeApp({
            projectId: env_1.env.FIREBASE_PROJECT_ID,
        });
        console.warn('⚠️ Firebase Admin SDK initialized in default/project mode (No private key set)');
    }
}
else {
    firebaseApp = admin.app();
}
exports.auth = admin.auth();
exports.db = admin.firestore();
exports.storage = admin.storage();
exports.messaging = admin.messaging();
exports.default = firebaseApp;
