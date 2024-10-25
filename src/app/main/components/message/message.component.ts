import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Message, MessagesService } from 'src/app/services/messages.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
  @Input({ required: true }) message: Message;

  constructor(private messagesService: MessagesService) {}

  closeMessage() {
    this.messagesService.removeMessage(this.message);
  }
}
