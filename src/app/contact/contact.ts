import { Component } from '@angular/core';
import { Reveal } from '../shared/reveal';

const EMAIL_ADDRESS = 'breinerftwyts@gmail.com';

@Component({
  selector: 'app-contact',
  imports: [Reveal],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  /**
   * Sustituye estas URLs por los perfiles reales antes de publicar.
   * WhatsApp requiere el número internacional sin espacios ni símbolo +.
   */
  protected readonly socialLinks = {
    whatsapp: 'https://wa.me/XXXXXXXXXX',
    linkedin: 'https://www.linkedin.com/in/TU-USUARIO',
    github: 'https://github.com/TU-USUARIO',
  };

  protected prepareEmail(event: SubmitEvent): void {
    event.preventDefault();

    const form = event.currentTarget;
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const subject = `Consulta desde el portafolio — ${name}`;
    const body = `Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`;

    window.location.href = `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
}
