import { onCall } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = getFirestore();

// CircleShot のスコアを保存する関数（v2）
export const submitCircleShotScore = onCall(async (request) => {
  const userId = request.auth?.uid ?? "guest";

  if (typeof request.data.score !== "number") {
    throw new Error("score が必要です");
  }

  const scoreData = {
    userId,
    name: request.data.name,
    score: request.data.score,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection("circleShot").doc("ranking").collection("ranking").add(scoreData);

  return { status: "ok" };
});
