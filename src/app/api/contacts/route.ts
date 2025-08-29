import { NextResponse } from 'next/server';
import { getDbConnection } from '@/actions/DBConnection';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      nombre_completo, 
      email, 
      telefono = null, 
      empresa = null, 
      puesto = null, 
      listId 
    } = body;

    // Validate required fields
    if (!nombre_completo || !email || !listId) {
      return NextResponse.json(
        { success: false, message: 'Nombre completo, email y lista son campos requeridos' },
        { status: 400 }
      );
    }

    const connection = await getDbConnection();
    
    try {
      await connection.beginTransaction();

      // Check if the contact already exists by email
      const [existingContacts] = await connection.query(
        'SELECT id_contacto FROM contactos WHERE email = ?',
        [email]
      );

      let contactId: number;
      const contacts = existingContacts as { id_contacto: number }[];

      if (contacts.length > 0) {
        // Contact exists, update it
        contactId = contacts[0].id_contacto;
        await connection.query(
          `UPDATE contactos 
           SET nombre_completo = ?, telefono = ?, empresa = ?, puesto = ?, fecha_actualizacion = NOW()
           WHERE id_contacto = ?`,
          [nombre_completo, telefono, empresa, puesto, contactId]
        );
      } else {
        // Create new contact
        const [result] = await connection.query(
          `INSERT INTO contactos 
           (nombre_completo, email, telefono, empresa, puesto, estado, fecha_creacion, fecha_actualizacion)
           VALUES (?, ?, ?, ?, ?, 'activo', NOW(), NOW())`,
          [nombre_completo, email, telefono, empresa, puesto]
        );
        contactId = (result as any).insertId;
      }

      // Check if the contact is already in the list
      const [existingListContacts] = await connection.query(
        `SELECT id FROM contactos_lista 
         WHERE id_contacto = ? AND id_lista = ?`,
        [contactId, listId]
      );

      if ((existingListContacts as any[]).length === 0) {
        // Add contact to the list
        await connection.query(
          `INSERT INTO contactos_lista 
           (id_contacto, id_lista, estado, fecha_insercion)
           VALUES (?, ?, 'activo', NOW())`,
          [contactId, listId]
        );
      } else {
        // Update existing list contact status to active
        await connection.query(
          `UPDATE contactos_lista 
           SET estado = 'activo', fecha_insercion = NOW()
           WHERE id_contacto = ? AND id_lista = ?`,
          [contactId, listId]
        );
      }

      await connection.commit();

      return NextResponse.json({
        success: true,
        data: { contactId },
        message: 'Contacto guardado exitosamente',
      });

    } catch (error) {
      await connection.rollback();
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, message: 'Error en la base de datos al guardar el contacto' },
        { status: 500 }
      );
    } finally {
      await connection.end();
    }

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { success: false, message: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
