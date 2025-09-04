"use server";
import { getDbConnection } from "../DBConnection";

export async function deleteContactList(listId: string | number) {
  const connection = await getDbConnection();
  try {
    await connection.beginTransaction();

    const id = Number(listId);
    if (!Number.isFinite(id)) {
      throw new Error(`ID de lista inválido: ${listId}`);
    }

    // Eliminar relaciones con contactos primero
    await connection.query(
      `DELETE FROM contactos_lista WHERE id_lista = ?`,
      [id]
    );

    // Eliminar la lista
    const [result]: any = await connection.query(
      `DELETE FROM listas_contactos WHERE id_lista = ?`,
      [id]
    );

    await connection.commit();

    return {
      success: true,
      message: result?.affectedRows > 0 ? "Lista eliminada correctamente" : "No se encontró la lista",
    };
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error al eliminar la lista de contactos:", error);
    return {
      success: false,
      message: "Error al eliminar la lista de contactos",
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
