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
  protected readonly socialLinks = {
    whatsapp: 'https://wa.me/573205061555?text=Hola%2C+vi+tu+portafolio+y+me+gustar%C3%ADa+hablar+contigo.&utm_source=chatgpt.com',
    linkedin: 'https://www.linkedin.com/in/breiner-gonzalez-machado-3a5961276',
    github: 'https://github.com/breinergg',
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
