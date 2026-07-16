<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-box">
      <button class="modal-close" @click="$emit('close')" title="Cerrar">&times;</button>

      <h2 class="modal-title">Política de Privacidad de Bartify</h2>

      <div class="modal-body">
        <p>
          En Bartify, nos tomamos muy en serio la privacidad y la seguridad de tus datos
          personales. Esta Política de Privacidad describe cómo recopilamos, utilizamos,
          almacenamos y protegemos la información de los usuarios que residen y utilizan
          nuestra plataforma en Playa del Carmen, Cancún, Cozumel y zonas aledañas en el
          estado de Quintana Roo, México.
        </p>
        <p>
          Al utilizar nuestra aplicación, aceptas las prácticas descritas en esta política.
        </p>

        <h3>1. Responsable del Tratamiento de Datos</h3>
        <p>
          El responsable del tratamiento de tus datos personales es el equipo de desarrollo
          de Bartify, un proyecto local basado en Playa del Carmen, Quintana Roo, México.
        </p>
        <ul>
          <li>Correo electrónico de contacto: bartifyut@something.com</li>
        </ul>

        <h3>2. Datos Personales que Recopilamos</h3>
        <p>
          Para que puedas utilizar las funciones de compra, venta y trueque de la
          aplicación, recopilamos las siguientes categorías de datos:
        </p>
        <ul>
          <li>
            <strong>Datos de Registro y Perfil:</strong> Nombre completo, dirección de
            correo electrónico, contraseña de acceso y ubicación declarada por el usuario.
          </li>
          <li>
            <strong>Datos de los Artículos:</strong> Fotos, descripciones, precios (si
            aplica) y categorías de los objetos que decides subir a la plataforma para
            venta o trueque.
          </li>
          <li>
            <strong>Datos de Geolocalización:</strong> Información sobre tu ubicación
            (coordenadas o zona geográfica) con el fin de mostrarte de manera óptima los
            trueques y productos más cercanos a ti.
          </li>
          <li>
            <strong>Mensajería Interna:</strong> Almacenamos el contenido de los chats y
            conversaciones que mantienes con otros usuarios dentro de la aplicación para
            garantizar la continuidad del servicio y la seguridad de la comunidad.
          </li>
          <li>
            <strong>Uso del Dispositivo y Datos Técnicos:</strong> Tipo de dispositivo
            móvil, sistema operativo, dirección IP, cookies e identificadores de
            publicidad para el correcto funcionamiento técnico de la app.
          </li>
        </ul>

        <h3>3. Finalidad del Tratamiento de los Datos</h3>
        <p>
          En Bartify utilizamos tu información exclusivamente para finalidades internas y
          operativas de la plataforma, que incluyen:
        </p>
        <ul>
          <li>Facilitar la creación y gestión de tu cuenta de usuario.</li>
          <li>Permitir la publicación de artículos para compra, venta o trueque.</li>
          <li>
            Conectarte con usuarios cercanos a tu ubicación geográfica para realizar los
            intercambios de forma eficiente.
          </li>
          <li>Proveer un canal de comunicación directo y seguro a través de nuestro chat interno.</li>
          <li>
            Monitorear el rendimiento técnico de la app, solucionar errores y mejorar la
            experiencia de usuario.
          </li>
        </ul>

        <h3>4. Compartición de Datos y Almacenamiento</h3>
        <p>
          Nos comprometemos a proteger tu privacidad. No vendemos ni comercializamos tus
          datos personales con terceros.
        </p>
        <ul>
          <li>
            <strong>Almacenamiento Seguro:</strong> Tus datos se almacenan exclusivamente
            en nuestras bases de datos administradas a través de la plataforma externa de
            servicios en la nube AIVEN, la cual cuenta con altos estándares de seguridad
            informática.
          </li>
        </ul>

        <h3>5. Moderación, Eliminación de Contenido y Seguridad</h3>
        <p>
          Con el fin de mantener una comunidad segura y respetuosa en Quintana Roo,
          Bartify cuenta con las siguientes facultades de moderación:
        </p>
        <ul>
          <li>
            Los administradores de la aplicación se reservan el derecho de eliminar
            productos, publicaciones o cuentas de usuarios de manera definitiva si se
            detecta contenido ilegal, ofensivo, fraudulento o que viole nuestras normas
            comunitarias.
          </li>
        </ul>

        <h3>6. Derechos de los Usuarios (Acceso, Rectificación, Cancelación y Oposición)</h3>
        <p>
          Tienes el control total sobre tus datos personales. Como usuario de Bartify,
          puedes ejercer tus derechos de la siguiente manera:
        </p>
        <ul>
          <li>
            <strong>Eliminación de Cuenta:</strong> Puedes eliminar tu cuenta y todos tus
            datos asociados en cualquier momento directamente desde la opción "Eliminar
            cuenta" dentro del menú de configuración de la aplicación.
          </li>
          <li>
            <strong>Contacto Directo:</strong> Si tienes dudas, requieres aclaraciones o
            deseas solicitar la eliminación de tu información de forma manual, puedes
            escribirnos directamente a nuestro correo de soporte: bartifyut@something.com
          </li>
        </ul>
      </div>

      <div class="modal-actions">
        <button class="btn-cerrar" @click="$emit('close')">Entendido</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
  padding: 16px;
}

.modal-box {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 560px;
  max-height: 85vh;
  overflow-y: auto;
  padding: 28px;
  position: relative;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
}

.modal-close {
  position: absolute;
  top: 14px;
  right: 16px;
  background: none;
  border: none;
  font-size: 1.6rem;
  line-height: 1;
  color: #999;
  cursor: pointer;
}
.modal-close:hover { color: #1a1a1a; }

.modal-title {
  font-size: 1.2rem;
  font-weight: 900;
  color: #1a1a1a;
  margin: 0 0 16px;
  padding-right: 24px;
}

.modal-body {
  font-size: 0.85rem;
  color: #444;
  line-height: 1.55;
}

.modal-body h3 {
  font-size: 0.95rem;
  font-weight: 800;
  color: #1a1a1a;
  margin: 20px 0 8px;
}

.modal-body h3:first-child { margin-top: 0; }

.modal-body p {
  margin: 0 0 10px;
}

.modal-body ul {
  margin: 0 0 10px;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn-cerrar {
  background-color: #FA2700;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.15s;
}
.btn-cerrar:hover { background-color: #d92100; }
</style>