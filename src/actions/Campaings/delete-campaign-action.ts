"use server";

import { revalidatePath } from "next/cache";
import { getDbConnection } from "../DBConnection";

export async function deleteCampaign(campaignId: number): Promise<{ success: boolean; message: string }>{
  let connection: any;
  try {
    connection = await getDbConnection();
    await connection.beginTransaction();

    // Remove recurrence rows first to satisfy FK constraints if present
    await connection.execute(
      "DELETE FROM recurrencias_campana WHERE id_campaign = ?",
      [campaignId]
    );

    // Delete the campaign
    const [result] = await connection.execute(
      "DELETE FROM campaigns WHERE id_campaign = ?",
      [campaignId]
    );

    await connection.commit();

    // Revalidate list page
    revalidatePath("/campaign");

    // Optionally, you might revalidate this campaign page too
    return { success: true, message: "Campaña eliminada correctamente" };
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error deleting campaign:", error);
    return { success: false, message: "Error al eliminar la campaña: " + (error as Error).message };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
